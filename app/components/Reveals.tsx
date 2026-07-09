"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Scroll-reveal for `.rv` elements. Runs on every route change so pages reached
 * by client-side navigation (e.g. /products) get their reveals observed too —
 * a single mount-time observer would miss them.
 */
export default function Reveals() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    // next paint, so freshly-navigated DOM is in place
    const id = requestAnimationFrame(() => {
      document.querySelectorAll(".rv:not(.in)").forEach((el) => io.observe(el));
    });
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
    };
  }, [pathname]);
  return null;
}
