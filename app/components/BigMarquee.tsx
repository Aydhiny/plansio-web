import type { Dict } from "../i18n";

function Item({ d }: { d: Dict }) {
  return (
    <span className="it">
      {d.marquee.marketing} <span className="o">{d.marquee.design}</span>{" "}
      <span className="serif grad-t" style={{ WebkitTextStroke: "0" }}>
        {d.marquee.software}
      </span>{" "}
      <span className="o">{d.marquee.games}</span>
      <span className="sep">·</span>
    </span>
  );
}

export default function BigMarquee({ d }: { d: Dict }) {
  return (
    <section className="bigmarq" aria-hidden="true">
      <div className="row">
        <Item d={d} />
        <Item d={d} />
      </div>
    </section>
  );
}
