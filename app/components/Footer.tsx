import type { Dict } from "../i18n";
import type { SiteSettings } from "@/lib/studio";
import Parallax from "./Parallax";

export default function Footer({ d, settings }: { d: Dict; settings?: SiteSettings }) {
  const f = d.footer;
  const email = settings?.brand.email || "hello@plansio.studio";
  const brand = settings?.brand.name || "Plansio";
  const social = settings?.social;
  const studioHrefs = ["/#work", "/#studio", "/#pricing", "/#contact"];
  const serviceHrefs = ["/#work", "/#work", "/#work", "/#work"];
  const connectHrefs = [social?.instagram || "#", social?.linkedin || "#", social?.dribbble || "#", `mailto:${email}`];

  return (
    <footer className="footer" data-nav-dark>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-lead">
            <h2 className="foot-head">
              {d.cta.hPre} <span className="serif grad-t">{d.cta.hAccent}</span>
            </h2>
            <a className="btn solid foot-cta" href="/#contact">
              <span>{d.nav.start}</span> <span className="ar">↗</span>
            </a>
          </div>

          <div className="foot-cols">
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
        </div>

        <p className="foot-blurb">{f.blurb}</p>

        <Parallax className="fword" speed={0.12}>
          {brand}
        </Parallax>

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
