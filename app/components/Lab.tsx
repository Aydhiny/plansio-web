"use client";

import dynamic from "next/dynamic";

/*
 * Client wrapper for the Three.js showpiece. dynamic(ssr:false) keeps `three`
 * out of the server bundle and the initial client chunk — it only downloads +
 * mounts on the client when this section renders. The placeholder holds the
 * layout so there's no jump when the canvas arrives.
 */
const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => <div className="scene3d-canvas" aria-hidden="true" />,
});

export default function Lab({
  kicker,
  title,
  accent,
  lead,
  hint,
}: {
  kicker: string;
  title: string;
  accent: string;
  lead: string;
  hint: string;
}) {
  return (
    <section className="lab" data-screen-label="Lab">
      <div className="wrap">
        <div className="lab-head rv">
          <span className="lab-kicker">{kicker}</span>
          <h2>
            {title} <span className="serif grad-t">{accent}</span>
          </h2>
          <p>{lead}</p>
        </div>

        <div className="lab-stage rv d1">
          <Scene3D />
          <span className="lab-hint" aria-hidden="true">
            {hint}
          </span>
        </div>
      </div>
    </section>
  );
}
