"use client";

import { useState } from "react";

/*
 * Lightweight YouTube facade: shows the thumbnail + a play button and only
 * loads the (heavy) YouTube iframe on click, so the player's scripts never hit
 * the page until someone actually presses play. Falls back to hqdefault if the
 * maxres thumbnail doesn't exist.
 */
export default function VideoEmbed({ id, title, poster }: { id: string; title: string; poster?: string }) {
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <div className="video">
        <iframe
          className="video-frame"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="video">
      <button className="video-poster" onClick={() => setPlay(true)} aria-label={`Play ${title}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
          alt=""
          onError={(e) => {
            if (!poster) (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
          }}
        />
        <span className="video-play" aria-hidden="true">
          ▶
        </span>
        <span className="video-tag">{title}</span>
      </button>
    </div>
  );
}
