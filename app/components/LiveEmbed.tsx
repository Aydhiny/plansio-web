"use client";

import { useState } from "react";

/*
 * A browser-chrome device frame around a live web app. Lazy facade: shows a
 * poster (or accent gradient) until clicked, then mounts the real iframe — so
 * the embedded app's scripts never load until the visitor asks. If the app
 * blocks framing (X-Frame-Options), the "open live app" link is always there.
 */
export default function LiveEmbed({
  url,
  name,
  accent,
  poster,
  loadLabel,
  visitLabel,
}: {
  url: string;
  name: string;
  accent: string;
  poster?: string;
  loadLabel: string;
  visitLabel: string;
}) {
  const [loaded, setLoaded] = useState(false);
  let host = url;
  try {
    host = new URL(url).host;
  } catch {}

  return (
    <div className="frame" style={{ "--accent": accent } as React.CSSProperties}>
      <div className="frame-bar">
        <span className="frame-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="frame-url">{host}</span>
        <a className="frame-open" href={url} target="_blank" rel="noreferrer" aria-label={visitLabel}>
          ↗
        </a>
      </div>
      <div className="frame-screen">
        {loaded ? (
          <iframe
            className="frame-iframe"
            src={url}
            title={name}
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <button className="frame-poster" onClick={() => setLoaded(true)} aria-label={loadLabel}>
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" />
            ) : (
              <span
                className="frame-ph"
                style={{ background: `radial-gradient(120% 120% at 30% 20%, ${accent}2e, transparent 60%), #0c0a12` }}
              >
                <b>{name}</b>
              </span>
            )}
            <span className="frame-play">
              <span className="frame-play-i">▶</span> {loadLabel}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
