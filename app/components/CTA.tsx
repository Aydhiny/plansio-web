import ContactForm from "./ContactForm";
import type { Dict } from "../i18n";

const EMAIL = "hello@plansio.studio";

export default function CTA({ d }: { d: Dict }) {
  const c = d.cta;
  return (
    <section className="cta" id="contact" data-screen-label="Contact">
      {/* eslint-disable @next/next/no-img-element */}
      <img className="palm-img p-cta-l parallax" data-speed="0.07" src="/assets/palm-d.png" alt="" aria-hidden="true" />
      <img className="palm-img p-cta-r parallax" data-speed="0.1" src="/assets/palm-c.png" alt="" aria-hidden="true" />
      <div className="wrap">
        <img className="mk rv" src="/assets/plansio-logo.png" alt="Plansio" />
        {/* eslint-enable @next/next/no-img-element */}
        <h2 className="rv d1">
          {c.hPre}
          <br />
          <span className="serif grad-t">{c.hAccent}</span>
        </h2>
        <p className="sub rv d2">{c.sub}</p>
        <div className="acts rv d3">
          <ContactForm d={d} />
          <p className="cta-alt">
            {c.altPre} <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
