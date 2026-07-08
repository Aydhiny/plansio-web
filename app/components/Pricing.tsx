import type { Dict } from "../i18n";

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#c238cf" strokeWidth="2.5">
      <path d="M5 12l5 5L20 6" />
    </svg>
  );
}

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
        <div className="tiers">
          {p.tiers.map((t, i) => {
            const hi = i === 1;
            return (
              <article
                className={`tier ${hi ? "hi" : ""} rv ${i === 1 ? "d1" : i === 2 ? "d2" : ""}`.replace(/\s+/g, " ").trim()}
                key={t.name}
              >
                {t.badge && <div className="badge">{t.badge}</div>}
                <div className="nm">{t.name}</div>
                <div className={`pr ${hi ? "grad-t" : ""}`.trim()}>
                  {t.price}
                  {t.period && <small> {t.period}</small>}
                </div>
                <p className="for">{t.for}</p>
                <ul>
                  {t.features.map((f) => (
                    <li key={f}>
                      <Check /> {f}
                    </li>
                  ))}
                </ul>
                <a className={`btn ${hi ? "solid" : "ghost"}`} href="#contact">
                  <span>{t.cta}</span>
                  {hi && <span className="ar">↗</span>}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
