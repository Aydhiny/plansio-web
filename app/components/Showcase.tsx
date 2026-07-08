import VideoEmbed from "./VideoEmbed";
import type { Dict } from "../i18n";

export default function Showcase({ d }: { d: Dict }) {
  const s = d.showcase;
  return (
    <section className="showcase" id="showcase" data-screen-label="Work">
      <div className="wrap">
        <div className="shead rv">
          <h2>
            {s.hPre} <span className="serif grad-t">{s.hAccent}</span>
          </h2>
          <p>{s.lead}</p>
        </div>
        <div className="showcase-media rv d1">
          <VideoEmbed id="Glwv6vjXREs" title={s.videoTitle} poster="/assets/hunter-mouse-2.jpg" />
        </div>
        <div className="showcase-foot rv d1">
          <div className="showcase-meta">
            <span className="showcase-badge">{s.badge}</span>
            <p>{s.meta}</p>
          </div>
          <a className="btn ghost" href="https://www.youtube.com/watch?v=Glwv6vjXREs" target="_blank" rel="noreferrer">
            <span>{s.watch}</span> <span className="ar">↗</span>
          </a>
        </div>

        <div className="showcase-grid rv d1">
          {/* eslint-disable @next/next/no-img-element */}
          <figure className="work-card">
            <img src="/assets/plansio-work-1.jpg" alt={s.cap1} loading="lazy" />
            <figcaption>{s.cap1}</figcaption>
          </figure>
          <figure className="work-card">
            <img src="/assets/plansio-work-2.jpg" alt={s.cap2} loading="lazy" />
            <figcaption>{s.cap2}</figcaption>
          </figure>
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </div>
    </section>
  );
}
