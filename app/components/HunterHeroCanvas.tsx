"use client";

import dynamic from "next/dynamic";

/*
 * Client wrapper for the Hunter Mouse 2 Three.js hero. dynamic(ssr:false) keeps
 * `three` out of the server bundle and the initial client chunk — it downloads
 * and mounts only on the client when the hero renders. The placeholder holds the
 * layout so there's no jump before the canvas arrives.
 */
const HunterHero3D = dynamic(() => import("./HunterHero3D"), {
  ssr: false,
  loading: () => <div className="hm-hero-canvas" aria-hidden="true" />,
});

export default function HunterHeroCanvas() {
  return <HunterHero3D />;
}
