"use client";

import { useEffect, useState } from "react";

/*
 * GTA VI-style intro. The overlay is server-rendered opaque (so the page never
 * flashes underneath before hydration), a percentage counts up while the mark
 * animates in, scroll is locked via `html.is-loading`, then it fades and
 * dispatches `plansio:loaded` — Effects listens for that to play the hero
 * entrance on reveal. Honors prefers-reduced-motion with a near-instant pass.
 */
export default function Loader() {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("is-loading");

    const dur = reduce ? 260 : 1700;
    const start = performance.now();
    let raf = 0;
    let doneTimer = 0;

    const finish = () => {
      setGone(true);
      root.classList.remove("is-loading");
      root.classList.add("loaded");
      window.dispatchEvent(new Event("plansio:loaded"));
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 2); // easeOutQuad
      setPct(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else doneTimer = window.setTimeout(finish, reduce ? 0 : 240); // brief hold at 100
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(doneTimer);
      root.classList.remove("is-loading");
    };
  }, []);

  return (
    <div className={`loader${gone ? " gone" : ""}`} role="status" aria-hidden={gone} aria-label="Loading">
      <div className="loader-wash" aria-hidden="true" />
      <div className="loader-floor" aria-hidden="true" />
      {/* eslint-disable @next/next/no-img-element */}
      <img className="loader-palm lp-l" src="/assets/palm-d.png" alt="" aria-hidden="true" />
      <img className="loader-palm lp-r" src="/assets/palm-e.png" alt="" aria-hidden="true" />
      {/* eslint-enable @next/next/no-img-element */}

      <div className="loader-inner">
        <div className="loader-mk">
          <span className="ring" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/plansio-logo.png" alt="" />
        </div>
        <div className="loader-wm">Plansio</div>
        <div className="loader-bar">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
      </div>
      <div className="loader-pct">
        {String(pct).padStart(3, "0")}
        <em>%</em>
      </div>
    </div>
  );
}
