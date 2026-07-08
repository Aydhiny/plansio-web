function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#c238cf" strokeWidth="2.5">
      <path d="M5 12l5 5L20 6" />
    </svg>
  );
}

const TIERS = [
  {
    hi: false,
    delay: "",
    nm: "Spark",
    pr: (
      <>
        $2.4k<small> / project</small>
      </>
    ),
    prGrad: false,
    badge: null,
    for: "A single, focused deliverable — a landing page, a logo, a campaign.",
    features: ["One discipline, one outcome", "2-week turnaround", "Source files included", "Two revision rounds"],
    cta: { cls: "ghost", label: "Start small", arrow: false },
  },
  {
    hi: true,
    delay: "d1",
    nm: "Studio",
    pr: (
      <>
        $6.8k<small> / month</small>
      </>
    ),
    prGrad: true,
    badge: "Most picked",
    for: "A dedicated team across design, marketing & code — your brand on retainer.",
    features: [
      "All three disciplines",
      "Dedicated project lead",
      "Weekly shipping cadence",
      "Unlimited revisions",
      "Priority support",
    ],
    cta: { cls: "solid", label: "Book the studio", arrow: true },
  },
  {
    hi: false,
    delay: "d2",
    nm: "Scale",
    pr: <>Custom</>,
    prGrad: false,
    badge: null,
    for: "Full-stack product & brand partnership for teams shipping at volume.",
    features: ["Multi-project roadmap", "Embedded engineers", "Dedicated infrastructure", "SLA & account team"],
    cta: { cls: "ghost", label: "Let's talk scale", arrow: false },
  },
];

export default function Pricing() {
  return (
    <section className="pricing" id="pricing" data-screen-label="Pricing">
      <div className="wrap">
        <div className="shead rv">
          <h2>
            ways to <span className="serif grad-t">work</span> together.
          </h2>
          <p>
            Clear engagements, no surprise invoices. Start small or go all-in — every tier is run by the people doing
            the work.
          </p>
        </div>
        <div className="tiers">
          {TIERS.map((t) => (
            <article className={`tier ${t.hi ? "hi" : ""} rv ${t.delay}`.replace(/\s+/g, " ").trim()} key={t.nm}>
              {t.badge && <div className="badge">{t.badge}</div>}
              <div className="nm">{t.nm}</div>
              <div className={`pr ${t.prGrad ? "grad-t" : ""}`.trim()}>{t.pr}</div>
              <p className="for">{t.for}</p>
              <ul>
                {t.features.map((f) => (
                  <li key={f}>
                    <Check /> {f}
                  </li>
                ))}
              </ul>
              <a className={`btn ${t.cta.cls}`} href="#contact">
                <span>{t.cta.label}</span>
                {t.cta.arrow && <span className="ar">↗</span>}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
