import type { Dict } from "../i18n";
import CountUp from "./CountUp";

const STAT_NUMBERS = ["120+", "3", "100%"];

export default function Manifesto({ d }: { d: Dict }) {
  const m = d.manifesto;
  return (
    <section className="mani" id="studio" data-screen-label="Studio">
      <div className="wrap">
        <span className="kick c rv">{m.kick}</span>
        <h2 className="rv d1">
          <em className="serif">{m.a}</em>
          {m.b}
          <br />
          {m.c}
          <em className="serif grad-t">{m.d}</em>
          {m.e}
        </h2>
        <p className="rv d2">{m.p}</p>
        <div className="mani-stats rv d3">
          {m.stats.map((label, i) => (
            <div className="ms" key={label}>
              <div className="ms-n grad-t">
                <CountUp value={STAT_NUMBERS[i]} />
              </div>
              <div className="ms-l">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
