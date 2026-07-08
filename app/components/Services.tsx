const SERVICES = [
  {
    no: "01",
    title: (
      <>
        marketing that <span className="serif">means</span> it
      </>
    ),
    line: "Positioning, campaigns & content that move real numbers — built on strategy, not vanity metrics.",
    tags: ["Strategy", "Campaigns", "SEO", "Social"],
    delay: "",
  },
  {
    no: "02",
    title: (
      <>
        identity with a <span className="serif">pulse</span>
      </>
    ),
    line: "Logos & brand systems built to be remembered — everywhere they live, from a favicon to a billboard.",
    tags: ["Identity", "Systems", "Art direction", "Motion"],
    delay: "d1",
  },
  {
    no: "03",
    title: (
      <>
        full-stack apps &amp; <span className="serif">websites</span>
      </>
    ),
    line: "From a landing page to a production web app — designed, built and shipped end to end by the same team.",
    tags: ["Web apps", "Websites", "APIs", "Product UX"],
    delay: "d2",
  },
];

export default function Services() {
  return (
    <section className="svcs" id="work" data-screen-label="Work">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="palm-img p-svc parallax" data-speed="0.08" src="/assets/palm-e.png" alt="" aria-hidden="true" />
      <div className="wrap">
        <div className="shead rv">
          <h2>
            one studio,
            <br />
            <span className="serif grad-t">the whole stack.</span>
          </h2>
          <p>
            Three disciplines, one team — carrying every project from the first spark of an idea to the thing people
            actually use.
          </p>
        </div>

        <div className="svc-list">
          {SERVICES.map((s) => (
            <article className={`svc rv ${s.delay}`.trim()} key={s.no}>
              <span className="svc-no">{s.no}</span>
              <div className="svc-main">
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-line">{s.line}</p>
              </div>
              <div className="svc-tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="svc-foot rv d1">
          <p>
            Many projects. <span className="serif grad-t">One partner</span> who carries all of them, start to finish.
          </p>
          <a className="btn solid" href="#contact">
            <span>Start a project</span> <span className="ar">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
