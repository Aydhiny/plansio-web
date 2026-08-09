"use client";

import dynamic from "next/dynamic";

/*
 * Client wrapper for the Hunter Mouse 2 hero's Aurora background. dynamic(ssr:false)
 * keeps `ogl` out of the server bundle + initial client chunk; the placeholder
 * holds the layout so there's no jump before the canvas mounts.
 */
const Aurora = dynamic(() => import("./Aurora"), {
  ssr: false,
  loading: () => <div className="hm-aurora" aria-hidden="true" />,
});

export default function HeroAurora() {
  return <Aurora colorStops={["#7A5CFF", "#C13AD6", "#3E8BFF"]} amplitude={1.15} blend={0.5} speed={0.7} />;
}
