import type { Dict } from "../i18n";

export default function Services({ d }: { d: Dict }) {
  const s = d.services;
  return (
    <section className="svcs" id="work" data-screen-label="Work">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="palm-img p-svc parallax" data-speed="0.08" src="/assets/palm-e.png" alt="" aria-hidden="true" />
      <div className="wrap">
        <div className="shead rv">
          <h2>
            {s.h1}
            <br />
            <span className="serif grad-t">{s.h2}</span>
          </h2>
          <p>{s.lead}</p>
        </div>

        <div className="svc-list">
          {s.items.map((it, i) => (
            <article className={`svc rv ${i === 1 ? "d1" : i >= 2 ? "d2" : ""}`.trim()} key={it.no}>
              <span className="svc-no">{it.no}</span>
              <div className="svc-main">
                <h3 className="svc-title">
                  {it.pre} <span className="serif">{it.accent}</span>
                  {it.post ? ` ${it.post}` : ""}
                </h3>
                <p className="svc-line">{it.line}</p>
              </div>
              <div className="svc-tags">
                {it.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="svc-foot rv d1">
          <p>
            {s.footPre} <span className="serif grad-t">{s.footAccent}</span> {s.footPost}
          </p>
          <a className="btn solid" href="#contact">
            <span>{s.start}</span> <span className="ar">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
