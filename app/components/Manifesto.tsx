const STATS = [
  { n: "120+", l: "Projects shipped" },
  { n: "3", l: "Disciplines, one team" },
  { n: "100%", l: "In-house craft" },
];

export default function Manifesto() {
  return (
    <section className="mani" id="studio" data-screen-label="Studio">
      <div className="wrap">
        <span className="kick c rv">The Plansio difference</span>
        <h2 className="rv d1">
          <em className="serif">technology</em> is easy.
          <br />
          making it feel <em className="serif grad-t">human</em> is the work.
        </h2>
        <p className="rv d2">
          Anyone can ship a feature. We obsess over the gap between what a product does and how it{" "}
          <em className="serif">feels</em> — the warmth, the timing, the small moments that make people trust a brand.
        </p>
        <div className="mani-stats rv d3">
          {STATS.map((s) => (
            <div className="ms" key={s.l}>
              <div className="ms-n grad-t">{s.n}</div>
              <div className="ms-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
