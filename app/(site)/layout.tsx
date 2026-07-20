import "@/app/globals.css";
import SmoothScroll from "@/app/components/SmoothScroll";
import Effects from "@/app/components/Effects";
import Loader from "@/app/components/Loader";
import ChatWidget from "@/app/components/ChatWidget";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import Reveals from "@/app/components/Reveals";
import CookieConsent from "@/app/components/CookieConsent";
import CommandPalette from "@/app/components/CommandPalette";
import { getDict, getLocale } from "@/app/i18n";
import { getSettings } from "@/lib/studio";
import { getAllProducts, t } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { getAllProjects } from "@/lib/projects";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://plansio.studio";

/*
 * Site chrome layout. Everything visitor-facing lives here (atmosphere, smooth
 * scroll, nav/footer, effects, loader). The /studio route is deliberately NOT
 * under this group, so the Sanity Studio isn't wrapped in Lenis or our global
 * CSS (which would break its UI).
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = getDict(locale);
  const settings = await getSettings();
  const [products, posts, projects] = await Promise.all([getAllProducts(), getAllPosts(), getAllProjects()]);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.brand.name || "Plansio",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description: "A full-stack studio for marketing, design, software and games.",
    email: settings.brand.email || "hello@plansio.studio",
    sameAs: [settings.social.instagram, settings.social.linkedin, settings.social.dribbble].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      email: settings.brand.email || "hello@plansio.studio",
      contactType: "sales",
    },
  };

  const paletteItems = [
    { label: dict.nav.work, href: "/#work" },
    { label: dict.nav.products, href: "/products" },
    { label: dict.nav.projects, href: "/projects" },
    { label: dict.nav.blog, href: "/blog" },
    { label: dict.nav.studio, href: "/#studio" },
    { label: dict.nav.pricing, href: "/#pricing" },
    { label: dict.nav.start, href: "/#contact" },
    { label: "FAQ", href: "/faq" },
    ...products.map((p) => ({ label: p.name, href: `/products/${p.slug}`, hint: t(p.category, locale) })),
    ...projects.map((p) => ({ label: p.client, href: `/projects/${p.slug}`, hint: t(p.sector, locale) })),
    ...posts.map((p) => ({ label: t(p.title, locale), href: `/blog/${p.slug}`, hint: t(p.category, locale) })),
    { label: "Studio", href: "/studio", hint: "admin" },
  ];

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
        <Nav d={dict} locale={locale} brand={settings.brand.name} />
        {children}
        <Footer d={dict} settings={settings} />
      </SmoothScroll>

      <Effects />
      <Reveals />
      <ChatWidget d={dict.chat} />
      <CommandPalette items={paletteItems} />
      <CookieConsent text={dict.ui.consent} ok={dict.ui.consentOk} />
      <Loader />

      <Analytics />
      <SpeedInsights />
    </>
  );
}
