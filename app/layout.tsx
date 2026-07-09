import type { Metadata, Viewport } from "next";
import { Unbounded, Space_Grotesk, EB_Garamond, JetBrains_Mono } from "next/font/google";
import { getLocale } from "./i18n";

/*
 * Root layout: just <html>/<body> + fonts + metadata. All visitor-facing chrome
 * lives in app/(site)/layout.tsx so the /studio (Sanity) route stays isolated
 * from Lenis and our global CSS.
 */
const display = Unbounded({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-display", display: "swap" });
const body = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });
const serif = EB_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

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

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    // `js` gates entrance animations on JS being available; set statically so
    // first paint already carries the class.
    <html lang={locale} className={`js ${display.variable} ${body.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
