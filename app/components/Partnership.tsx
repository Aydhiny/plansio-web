import type { Dict } from "../i18n";

const DIGITAL_PARK_URL = "https://digitalpark.ba";

/* Digital Park's real mark — a code-bracket + center dot, reproduced from
   their own site header at their exact brand color (#E8FF00). */
function DigitalParkMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M8 6L3 14L8 22" stroke="#E8FF00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 6L25 14L20 22" stroke="#E8FF00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="14" cy="14" r="2" fill="#E8FF00" opacity="0.8" />
    </svg>
  );
}

export default function Partnership({ d }: { d: Dict }) {
  const p = d.partner;
  return (
    <section className="partner" data-screen-label="Partnership">
      <div className="wrap">
        <div className="shead rv">
          <h2>
            {p.h1} <span className="serif grad-t">{p.hAccent}</span>
          </h2>
          <p>{p.lead}</p>
        </div>

        <div className="partner-card rv d1">
          <div className="partner-half ph-plansio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="partner-logo" src="/assets/plansio-logo.png" alt="" aria-hidden="true" />
            <div className="partner-name">Plansio</div>
            <p className="partner-tag">{p.plansioTag}</p>
            <ul>
              {p.plansioItems.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>

          <div className="partner-seam" aria-hidden="true">
            <span>×</span>
          </div>

          <div className="partner-half ph-dp">
            <DigitalParkMark />
            <div className="partner-name">
              Digital<span className="dp-accent">Park</span>
            </div>
            <p className="partner-tag">{p.dpTag}</p>
            <ul>
              {p.dpItems.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="partner-foot rv d2">
          <a className="btn ghost" href={DIGITAL_PARK_URL} target="_blank" rel="noreferrer">
            <span>{p.visit}</span> <span className="ar">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
