import "@/app/globals.css";
import SmoothScroll from "@/app/components/SmoothScroll";
import Effects from "@/app/components/Effects";
import Loader from "@/app/components/Loader";
import ChatWidget from "@/app/components/ChatWidget";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import Reveals from "@/app/components/Reveals";
import CookieConsent from "@/app/components/CookieConsent";
import { getDict, getLocale } from "@/app/i18n";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://plansio.studio";
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Plansio",
  url: SITE_URL,
  description: "A full-stack studio for marketing, design, software and games.",
  email: "hello@plansio.studio",
};

/*
 * Site chrome layout. Everything visitor-facing lives here (atmosphere, smooth
 * scroll, nav/footer, effects, loader). The /studio route is deliberately NOT
 * under this group, so the Sanity Studio isn't wrapped in Lenis or our global
 * CSS (which would break its UI).
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = getDict(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <a href="#top" className="skip-link">
        Skip to content
      </a>

      {/* fixed atmosphere layers — purely decorative */}
      <div className="atmos" />
      <canvas id="vapor" />
      <div className="gridlines" />
      <div className="grain" />
      <div className="pg-white" aria-hidden="true" />
      <div className="pg-border" aria-hidden="true" />

      <SmoothScroll>
        <Nav d={dict} locale={locale} />
        {children}
        <Footer d={dict} />
      </SmoothScroll>

      <Effects />
      <Reveals />
      <ChatWidget d={dict.chat} />
      <CookieConsent text={dict.ui.consent} ok={dict.ui.consentOk} />
      <Loader />

      <Analytics />
      <SpeedInsights />
    </>
  );
}
