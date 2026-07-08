"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/*
 * GTA VI-style scroll layer:
 *  - Lenis gives weighted momentum scrolling (the signature "heavy" feel).
 *  - A scroll-linked parallax driver translates any [data-speed] element so
 *    palms and the giant footer word drift at their own depth.
 *  - A 2px top progress meter fills as you descend.
 *
 * All of it degrades to native scroll under prefers-reduced-motion, and every
 * listener/RAF is torn down on unmount to avoid leaks across fast-refresh.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const bar = document.getElementById("scroll-progress");

    // ---- parallax targets: cache each element's untransformed doc position ----
    type Target = { el: HTMLElement; speed: number; base: number; h: number };
    let targets: Target[] = [];
    let maxScroll = 0; // cached so updateProgress never reads scrollHeight per-frame
    const measure = () => {
      targets = Array.from(
        document.querySelectorAll<HTMLElement>("[data-speed]")
      ).map((el) => {
        const prev = el.style.transform;
        el.style.transform = ""; // measure without our own offset
        const rect = el.getBoundingClientRect();
        el.style.transform = prev;
        return {
          el,
          speed: parseFloat(el.dataset.speed || "0"),
          base: rect.top + window.scrollY,
          h: el.offsetHeight,
        };
      });
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    };

    const applyParallax = () => {
      const viewCenter = window.scrollY + window.innerHeight / 2;
      for (const t of targets) {
        const elCenter = t.base + t.h / 2;
        const y = (viewCenter - elCenter) * t.speed;
        t.el.style.setProperty("--par-y", `${y.toFixed(1)}px`);
      }
    };

    const updateProgress = () => {
      const p = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      if (bar) bar.style.setProperty("--sp", String(p));
    };

    const onScroll = () => {
      if (!reduce) applyParallax();
      updateProgress();
    };

    measure();
    onScroll();

    let lenis: Lenis | null = null;
    let rafId = 0;

    if (!reduce) {
      // syncTouch left off (default) → native touch scrolling on mobile, which
      // feels far better than virtualized momentum on phones.
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", onScroll);
      const raf = (time: number) => {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // ---- smooth anchor navigation ----
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as
        | HTMLAnchorElement
        | null;
      if (!a) return;
      const id = a.getAttribute("href") || "";
      if (id === "#" || id.length < 2) {
        e.preventDefault(); // placeholder links (#) shouldn't jump
        return;
      }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // land content just below the fixed nav rather than under it
      const navClear = -90;
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: navClear });
      else {
        const y = (target as HTMLElement).getBoundingClientRect().top + window.scrollY + navClear;
        window.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" });
      }
    };
    document.addEventListener("click", onClick);

    let alive = true; // guard stray post-unmount callbacks (fonts.ready / load)
    const onResize = () => {
      if (!alive) return;
      measure();
      onScroll();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize); // images settle → re-measure parallax
    // fonts settling changes layout heights → re-measure once ready
    if (document.fonts?.ready) document.fonts.ready.then(onResize);

    return () => {
      alive = false;
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      <div className="scrollbar" id="scroll-progress" aria-hidden="true" />
      {children}
    </>
  );
}
