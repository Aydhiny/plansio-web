import type { Metadata, Viewport } from "next";
import { Unbounded, Space_Grotesk, EB_Garamond, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import Effects from "./components/Effects";
import Loader from "./components/Loader";
import ChatWidget from "./components/ChatWidget";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Plansio — Marketing · Design · Software · Games",
    template: "%s — Plansio",
  },
  description: DESCRIPTION,
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
  openGraph: {
    type: "website",
    siteName: "Plansio",
    url: "/",
    title: "Plansio — Marketing · Design · Software · Games",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Plansio — Marketing · Design · Software · Games",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `js` mirrors the original inline <script> that gated entrance animations on
    // JS being available; set statically so first paint already carries the class.
    <html
      lang="en"
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
        <ChatWidget />

        {/* GTA VI-style intro overlay — rendered last so it sits on top */}
        <Loader />
      </body>
    </html>
  );
}
