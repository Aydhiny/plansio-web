"use client";

import type { Locale } from "../i18n";

// unit 5-point star centered at 0,0
const STAR =
  "M0,-1 L0.225,-0.309 L0.951,-0.309 L0.363,0.118 L0.588,0.809 L0,0.382 L-0.588,0.809 L-0.363,0.118 L-0.951,-0.309 L-0.225,-0.309 Z";

// Inline SVG flags (emoji flags don't render on Windows) — 2:1, clipped & rounded.
function FlagEN() {
  return (
    <svg className="flag" viewBox="0 0 60 30" aria-hidden="true">
      <clipPath id="uk-clip">
        <rect width="60" height="30" rx="4" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

function FlagBA() {
  const stars = [0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92];
  return (
    <svg className="flag" viewBox="0 0 60 30" aria-hidden="true">
      <clipPath id="ba-clip">
        <rect width="60" height="30" rx="4" />
      </clipPath>
      <g clipPath="url(#ba-clip)">
        <rect width="60" height="30" fill="#002395" />
        <polygon points="20,0 60,0 60,30" fill="#FECB00" />
        <g fill="#fff">
          {stars.map((t, i) => (
            <path key={i} d={STAR} transform={`translate(${20 + 40 * t} ${30 * t}) scale(2.1)`} />
          ))}
        </g>
      </g>
    </svg>
  );
}

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const set = (l: Locale) => {
    if (l === locale) return;
    document.cookie = `NEXT_LOCALE=${l};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    location.reload();
  };
  return (
    <div className="lang" role="group" aria-label="Language">
      <button
        className={locale === "en" ? "on" : ""}
        onClick={() => set("en")}
        aria-pressed={locale === "en"}
        aria-label="English"
      >
        <FlagEN />
      </button>
      <button
        className={locale === "bs" ? "on" : ""}
        onClick={() => set("bs")}
        aria-pressed={locale === "bs"}
        aria-label="Bosanski"
      >
        <FlagBA />
      </button>
    </div>
  );
}
