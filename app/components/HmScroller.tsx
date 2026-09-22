"use client";

import { useRef } from "react";

/*
 * Horizontal, scroll-snapping image strip for the Hunter Mouse 2 page. Native
 * touch/trackpad scroll does the work on mobile; the two arrow buttons drive
 * it on desktop. No JS-driven drag — scroll-snap + native overflow scrolling
 * keeps it cheap and keyboard/touch accessible for free.
 */
export default function HmScroller({ images }: { images: { src: string; alt: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.86, behavior: "smooth" });
  };

  return (
    <div className="hm-scroller">
      <div className="hm-scroller-track" ref={trackRef}>
        {images.map((img, i) => (
          <figure className="hm-scroller-item" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} loading="lazy" />
          </figure>
        ))}
      </div>
      <button className="hm-scroller-nav prev" onClick={() => scroll(-1)} aria-label="Scroll left">
        ‹
      </button>
      <button className="hm-scroller-nav next" onClick={() => scroll(1)} aria-label="Scroll right">
        ›
      </button>
    </div>
  );
}
