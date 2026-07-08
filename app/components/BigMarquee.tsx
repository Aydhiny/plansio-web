function Item() {
  return (
    <span className="it">
      marketing <span className="o">design</span>{" "}
      <span className="serif grad-t" style={{ WebkitTextStroke: "0" }}>
        software
      </span>
      <span className="sep">·</span>
    </span>
  );
}

export default function BigMarquee() {
  return (
    <section className="bigmarq" aria-hidden="true">
      <div className="row">
        <Item />
        <Item />
      </div>
    </section>
  );
}
