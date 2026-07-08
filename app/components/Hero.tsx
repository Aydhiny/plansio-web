import PrismaticBurst from "./PrismaticBurst";

export default function Hero() {
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
        <h1 className="giant anim a2">
          the <span className="serif grad-t sheen">human</span> touch.
        </h1>
        <p className="hero-sub anim a3">
          A full-stack studio for <em className="serif">marketing</em>, <em className="serif">design</em> &amp;
          software — building brands, products and the feeling in between.
        </p>
        <div className="hero-cta anim a4">
          <a className="btn solid" href="#contact">
            <span>Start a project</span> <span className="ar">↗</span>
          </a>
          <a className="btn ghost" href="#work">
            <span>See the work</span>
          </a>
        </div>
      </div>
    </header>
  );
}
