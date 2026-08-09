"use client";

import { useEffect, useRef } from "react";

/*
 * The huge Hunter Mouse 2 key-art/logo with a pointer-reactive 3D tilt (same
 * feel as the home hero's logo3d). Fine-pointer + motion-safe only; on touch or
 * reduced-motion it's a clean static image. Torn down on unmount.
 */
export default function HeroLogo({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const fine = window.matchMedia("(pointer:fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const target = (wrap.closest(".hm-hero") as HTMLElement) || wrap;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      tx = ((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * -9;
      ty = ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 13;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerleave", onLeave);
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      img.style.transform = `rotateX(${cx}deg) rotateY(${cy}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="hm-keyart-wrap" ref={wrapRef}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hm-keyart" ref={imgRef} src={src} alt={alt} />
    </div>
  );
}
