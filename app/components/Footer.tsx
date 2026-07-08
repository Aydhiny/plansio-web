import type { Dict } from "../i18n";

const EMAIL = "hello@plansio.studio";

export default function Footer({ d }: { d: Dict }) {
  const f = d.footer;
  const studioHrefs = ["#work", "#studio", "#pricing", "#contact"];
  const serviceHrefs = ["#work", "#work", "#work", "#work"];
  const connectHrefs = ["#", "#", "#", `mailto:${EMAIL}`];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <div className="wm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/plansio-logo.png" alt="" />
              Plansio
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
          Plansio
        </div>
        <div className="fbot">
          <span>{f.rights}</span>
          <span>{f.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
