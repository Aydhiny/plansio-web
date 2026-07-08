import PrismaticBurst from "./PrismaticBurst";
import type { Dict } from "../i18n";

export default function Hero({ d }: { d: Dict }) {
  return (
    <header className="hero" id="top" data-screen-label="Hero">
      {/* Prismatic Burst (ogl) — soft light rays over the white hero */}
      <div className="hero-burst" aria-hidden="true">
        <PrismaticBurst
          intensity={1.6}
          speed={0.4}
          animationType="rotate3d"
          distort={0}
          rayCount={0}
          mixBlendMode="multiply"
          colors={["#ffce8a", "#ff9e7a", "#ff8fb0", "#b79cff", "#8fb8ff"]}
        />
      </div>
      {/* soft white fadeout dissolving the rays into the body */}
      <div className="hero-fade" aria-hidden="true" />

      <div className="stage" id="hero-stage">
        <div className="logo3d-wrap anim a1" aria-hidden="true">
          <span className="ring" />
          <div className="logo3d" id="logo3d">
            <span className="gloss" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/plansio-logo.png" alt="" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ref" src="/assets/plansio-logo.png" alt="" />
        </div>
        <h1 className="giant split">
          {d.hero.pre.map((word, i) => (
            <span className="w" key={i}>
              <span className="wi" style={{ transitionDelay: `${0.3 + i * 0.06}s` }}>
                {word}
              </span>
            </span>
          ))}
          <span className="w">
            <span className="wi serif grad-t sheen" style={{ transitionDelay: `${0.3 + d.hero.pre.length * 0.06}s` }}>
              {d.hero.accent}
            </span>
          </span>
        </h1>
        <p className="hero-sub anim a3">{d.hero.sub}</p>
        <div className="hero-cta anim a4">
          <a className="btn solid" href="#contact">
            <span>{d.hero.start}</span> <span className="ar">↗</span>
          </a>
          <a className="btn ghost" href="#work">
            <span>{d.hero.work}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
