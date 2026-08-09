"use client";

import { useEffect, useRef } from "react";

/*
 * Lightweight scroll-parallax layer. Translates its content vertically as it
 * moves through the viewport (via a --py CSS var consumed in globals.css).
 * rAF-throttled; disabled under prefers-reduced-motion. Use for section
 * background images so foreground copy drifts against them.
 */
export default function Parallax({
  speed = 0.18,
  className = "",
  children,
}: {
  speed?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // ~ -1 .. 1
      el.style.setProperty("--py", `${progress * speed * -100}px`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div className={`hm-parallax ${className}`} ref={ref}>
      {children}
    </div>
  );
}
