import type { Metadata, Viewport } from "next";
import { Unbounded, Space_Grotesk, EB_Garamond, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import Effects from "./components/Effects";
import Loader from "./components/Loader";
import ChatWidget from "./components/ChatWidget";
import { getDict, getLocale } from "./i18n";
import "./globals.css";

/*
 * Self-hosting the four families through next/font removes the render-blocking
 * request to fonts.googleapis.com that the original page made, and pins each
 * family to a CSS variable that globals.css already references
 * (--font-display / --font-body / --font-serif / --font-mono).
 */
const display = Unbounded({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});
const body = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const serif = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://plansio.studio";
const DESCRIPTION =
  "A full-stack studio — marketing, design, software and games, handled by one team from the first idea to launch day.";

const DESCRIPTION_BS =
  "Full-stack studio — marketing, dizajn, softver i igre, sve u rukama jednog tima, od prve ideje do dana lansiranja.";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const description = locale === "bs" ? DESCRIPTION_BS : DESCRIPTION;
  const title = "Plansio — Marketing · Design · Software · Games";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s — Plansio" },
    description,
    applicationName: "Plansio",
    keywords: [
      "Plansio",
      "creative studio",
      "marketing agency",
      "brand design",
      "product design",
      "web development",
      "game development",
      "full-stack studio",
    ],
    authors: [{ name: "Plansio" }],
    creator: "Plansio",
    alternates: { canonical: "/" },
    openGraph: { type: "website", siteName: "Plansio", url: "/", title, description, locale: locale === "bs" ? "bs_BA" : "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = getDict(locale);
  return (
    // `js` mirrors the original inline <script> that gated entrance animations on
    // JS being available; set statically so first paint already carries the class.
    <html
      lang={locale}
      className={`js ${display.variable} ${body.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>
        <a href="#top" className="skip-link">Skip to content</a>

        {/* fixed atmosphere layers — purely decorative, server-rendered */}
        <div className="atmos" />
        <canvas id="vapor" />
        <div className="gridlines" />
        <div className="grain" />
        <div className="pg-white" aria-hidden="true" />
        <div className="pg-border" aria-hidden="true" />

        <SmoothScroll>{children}</SmoothScroll>

        {/* pointer/scroll/canvas behaviour, hydrated as one client island */}
        <Effects />

        {/* bottom-right chat launcher */}
        <ChatWidget d={dict.chat} />

        {/* GTA VI-style intro overlay — rendered last so it sits on top */}
        <Loader />
      </body>
    </html>
  );
}
