import type { Dict } from "../i18n";
import type { SiteSettings } from "@/lib/studio";

export default function Footer({ d, settings }: { d: Dict; settings?: SiteSettings }) {
  const f = d.footer;
  const email = settings?.brand.email || "hello@plansio.studio";
  const brand = settings?.brand.name || "Plansio";
  const social = settings?.social;
  const studioHrefs = ["/#work", "/#studio", "/#pricing", "/#contact"];
  const serviceHrefs = ["/#work", "/#work", "/#work", "/#work"];
  const connectHrefs = [
    social?.instagram || "#",
    social?.linkedin || "#",
    social?.dribbble || "#",
    `mailto:${email}`,
  ];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <div className="wm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/plansio-logo.png" alt="" />
              {brand}
            </div>
            <p>{f.blurb}</p>
          </div>
          <div className="fcol">
            <h4>{f.studio}</h4>
            {f.lStudio.map((label, i) => (
              <a key={label} href={studioHrefs[i]}>
                {label}
              </a>
            ))}
          </div>
          <div className="fcol">
            <h4>{f.services}</h4>
            {f.lServices.map((label, i) => (
              <a key={label} href={serviceHrefs[i]}>
                {label}
              </a>
            ))}
          </div>
          <div className="fcol">
            <h4>{f.connect}</h4>
            {f.lConnect.map((label, i) => (
              <a key={label} href={connectHrefs[i]}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="fword parallax" data-speed="0.05">
          {brand}
        </div>
        <div className="fbot">
          <span>{f.rights}</span>
          <span className="fbot-links">
            <a href="/faq">FAQ</a>
            <a href="/privacy">{d.ui.privacy}</a>
            <a href="/terms">{d.ui.terms}</a>
          </span>
          <span>{f.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
