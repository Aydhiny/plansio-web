import type { Dict } from "../i18n";

// optional Cal.com (or any booking) link for the "Get a quote" CTA
const CAL = process.env.NEXT_PUBLIC_CAL_LINK;

export default function Pricing({ d }: { d: Dict }) {
  const p = d.pricing;
  return (
    <section className="pricing" id="pricing" data-screen-label="Pricing">
      <div className="wrap">
        <div className="shead rv">
          <h2>
            {p.h1} <span className="serif grad-t">{p.hAccent}</span> {p.h2}
          </h2>
          <p>{p.lead}</p>
        </div>

        <div className="price-factors rv d1">
          {p.factors.map((f, i) => (
            <div className="price-factor" key={f.title}>
              <span className="price-factor-no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>

        <div className="price-cta rv d2">
          <a className="btn solid" href={CAL || "#contact"} {...(CAL ? { target: "_blank", rel: "noreferrer" } : {})}>
            <span>{p.ctaLabel}</span> <span className="ar">↗</span>
          </a>
          <p className="price-cta-note">{p.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}
