"use client";

import { useEffect } from "react";

/*
 * Port of the original script.js. Everything is set up inside one effect and
 * fully torn down on cleanup so React fast-refresh / navigation can't leak
 * RAF loops or listeners. Renders nothing — it only wires behaviour onto the
 * server-rendered DOM (canvas#vapor, .hero, .rv, .logo3d, .btn …).
 */
export default function Effects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const finePointer = window.matchMedia("(pointer:fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- nav scroll state ----
    const nav = document.getElementById("nav");
    if (nav) {
      const onNav = () => nav.classList.toggle("scr", window.scrollY > 40);
      onNav();
      window.addEventListener("scroll", onNav, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onNav));
    }

    // ---- hero entrance (deferred until the intro loader has revealed) ----
    let heroTimer = 0;
    const revealHero = () =>
      (heroTimer = window.setTimeout(
        () => document.querySelector(".hero")?.classList.add("in"),
        120
      ));
    if (document.documentElement.classList.contains("loaded")) {
      revealHero();
    } else {
      window.addEventListener("plansio:loaded", revealHero, { once: true });
      cleanups.push(() => window.removeEventListener("plansio:loaded", revealHero));
    }
    cleanups.push(() => clearTimeout(heroTimer));

    // (scroll reveals live in Reveals.tsx so they re-run on route change)

    // ---- 3D logo tilt (pointer-reactive) ----
    (function logoTilt() {
      const wrap = document.querySelector<HTMLElement>(".logo3d-wrap");
      const logo = document.getElementById("logo3d");
      const hero = document.querySelector<HTMLElement>(".hero");
      if (!wrap || !logo || !hero || !finePointer || reduce) return;
      let tx = 0,
        ty = 0,
        cx = 0,
        cy = 0,
        raf = 0;
      const onMove = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        tx = ((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * -34;
        ty = ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 40;
      };
      const onLeave = () => {
        tx = 0;
        ty = 0;
      };
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
      const loop = () => {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        logo.style.transform = `rotateX(${cx}deg) rotateY(${cy}deg)`;
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
      });
    })();

    // ---- vapor / clouds canvas ----
    (function vapor() {
      const cv = document.getElementById("vapor") as HTMLCanvasElement | null;
      if (!cv) return;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      let w = 0,
        h = 0;
      const blobs = [
        { hue: "243,104,68", r: 0.62, x: 0.92, y: 0.04, sx: 0.00007, sy: 0.00009, p: 0 },
        { hue: "106,34,216", r: 0.66, x: 0.06, y: 0.94, sx: 0.00009, sy: 0.00006, p: 2 },
        { hue: "217,61,114", r: 0.5, x: 0.54, y: 0.4, sx: 0.00006, sy: 0.0001, p: 4 },
        { hue: "247,178,49", r: 0.44, x: 0.76, y: 0.07, sx: 0.0001, sy: 0.00007, p: 1.5 },
        { hue: "106,34,216", r: 0.46, x: 0.2, y: 0.82, sx: 0.00008, sy: 0.00008, p: 3.4 },
      ];
      const size = () => {
        const dpr = 0.5; // soft blobs don't need real pixels; CSS scales up
        w = cv.width = Math.max(2, Math.round(window.innerWidth * dpr));
        h = cv.height = Math.max(2, Math.round(window.innerHeight * dpr));
        cv.style.width = window.innerWidth + "px";
        cv.style.height = window.innerHeight + "px";
      };
      const draw = (t: number) => {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
        for (const b of blobs) {
          const cx = (b.x + Math.sin(t * b.sx + b.p) * 0.12) * w;
          const cy = (b.y + Math.cos(t * b.sy + b.p) * 0.12) * h;
          const rad = b.r * Math.min(w, h) * (0.85 + Math.sin(t * 0.0002 + b.p) * 0.15);
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
          g.addColorStop(0, `rgba(${b.hue},0.22)`);
          g.addColorStop(0.5, `rgba(${b.hue},0.08)`);
          g.addColorStop(1, `rgba(${b.hue},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      // static: draw the soft wash once (and on resize). Animating this
      // full-screen multiply layer every frame was heat for no perceptible gain.
      const onResize = () => {
        size();
        draw(0);
      };
      onResize();
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));
    })();

    // (magnetic buttons removed — buttons now rely purely on their CSS hover)

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
