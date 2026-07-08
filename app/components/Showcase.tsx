import VideoEmbed from "./VideoEmbed";

export default function Showcase() {
  return (
    <section className="showcase" id="showcase" data-screen-label="Work">
      <div className="wrap">
        <div className="shead rv">
          <h2>
            from the <span className="serif grad-t">studio.</span>
          </h2>
          <p>
            We don&apos;t just build for clients — we ship our own. Here&apos;s Hunter Mouse 2, designed, built and
            launched in-house.
          </p>
        </div>
        <div className="showcase-media rv d1">
          <VideoEmbed id="Glwv6vjXREs" title="Hunter Mouse 2 — official trailer" poster="/assets/hunter-mouse-2.jpg" />
        </div>
        <div className="showcase-foot rv d1">
          <div className="showcase-meta">
            <span className="showcase-badge">Our game</span>
            <p>
              A fast, hand-crafted title built with the same team that handles client work — proof the studio can carry
              an idea all the way to a shipped, playable product.
            </p>
          </div>
          <a className="btn ghost" href="https://www.youtube.com/watch?v=Glwv6vjXREs" target="_blank" rel="noreferrer">
            <span>Watch on YouTube</span> <span className="ar">↗</span>
          </a>
        </div>

        {/* selected design work */}
        <div className="showcase-grid rv d1">
          {/* eslint-disable @next/next/no-img-element */}
          <figure className="work-card">
            <img src="/assets/plansio-work-1.jpg" alt="Plansio brand design piece" loading="lazy" />
            <figcaption>Brand &amp; social design</figcaption>
          </figure>
          <figure className="work-card">
            <img src="/assets/plansio-work-2.jpg" alt="Plansio brand design piece" loading="lazy" />
            <figcaption>Identity &amp; art direction</figcaption>
          </figure>
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </div>
    </section>
  );
}
