import type { Metadata } from "next";
import Link from "next/link";
import HeroAurora from "@/app/components/HeroAurora";
import HeroLogo from "@/app/components/HeroLogo";
import HmScroller from "@/app/components/HmScroller";
import Parallax from "@/app/components/Parallax";
import PrismaticBurst from "@/app/components/PrismaticBurst";
import VideoEmbed from "@/app/components/VideoEmbed";
import { getDict, getLocale } from "@/app/i18n";

/*
 * Hunter Mouse 2 — a dedicated, cinematic showcase page for the studio's own
 * game. Copy is fully localized (see the `hm` block in app/i18n.ts); page-local
 * arrays below hold only the non-translatable structure (image slugs, icons,
 * links, video ids). The hero background is a lazy, client-only ogl Aurora.
 */

const GAMEJOLT = "https://gamejolt.com/games/huntermouse2/1004119";
const DEVLOGS = "https://www.youtube.com/channel/UCEXAp1jCB2j45tgx-d5UUQg";
const MUSIC = "https://www.youtube.com/c/aydhiny";
const TRAILER_ID = "Glwv6vjXREs";
const IMG = "/assets/hunter-mouse-2";

// structure only — the words come from the dictionary, zipped by index
const WORLD_STRUCT: { img: string; wide?: boolean }[] = [
  { img: "jungle-scapes", wide: true },
  { img: "aether-reach" },
  { img: "infernias-keep" },
  { img: "whispering-frost" },
  { img: "creeptown" },
  { img: "pirate-ship" },
  { img: "reufs-valley" },
  { img: "reufs-keep" },
  { img: "misty-heights" },
  { img: "starlane" },
  { img: "chase-road", wide: true },
  { img: "smugglers-run" },
];
const GALLERY_IMAGES = [
  "gallery-archipelago",
  "gallery-frost-forest",
  "gallery-desert",
  "gallery-portal",
  "gallery-dock",
];
const FEAT_ICON = ["🗺️", "🎮", "⚡", "👀", "🕵️"];
const JOURNEY_HREF: (string | undefined)[] = [undefined, MUSIC, undefined, undefined, undefined];
const DEV_IDS = ["BBN68hcazJc", "qfv3Gr91jxM", "GhGqQCtngXY"];
const TRACKS = [
  "Main Theme", "Jupiter Capsule", "Jupiter Capsule Pt. 2 (Spaceship)", "Jungle Scapes",
  "Whispering Frost", "Reuf's Valley", "Aether Reach", "Infernias Keep",
  "Creeptown", "Witches & Switches", "Neon Tunnel", "Clumsy Board",
  "Misty Mysteries", "Final Boss (Reuf)", "Game Over", "Neon Train (Chase)",
];

export async function generateMetadata(): Promise<Metadata> {
  const d = getDict(await getLocale());
  return {
    title: "Hunter Mouse 2 — a 3D collectathon platformer",
    description: d.hm.heroSub,
    alternates: { canonical: "/hunter-mouse-2" },
    openGraph: {
      title: "Hunter Mouse 2",
      description: d.hm.heroSub,
      url: "/hunter-mouse-2",
      images: [`${IMG}/keyart-header.webp`],
    },
  };
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"
      />
    </svg>
  );
}

export default async function HunterMouse2() {
  const locale = await getLocale();
  const d = getDict(locale);
  const h = d.hm;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Hunter Mouse 2",
    description:
      "A 3D retro-inspired collectathon platformer. Play as Puntsy, retrieve the scattered thunderbolts across handcrafted worlds and stop Reuf's betrayal of the Mouse Kingdom.",
    genre: ["Platformer", "Collectathon", "Adventure", "Indie"],
    gamePlatform: ["PC", "Web"],
    applicationCategory: "Game",
    operatingSystem: "Windows, Web",
    author: { "@type": "Person", name: "Aydhiny" },
    url: GAMEJOLT,
    trailer: { "@type": "VideoObject", name: "Hunter Mouse 2 — trailer", embedUrl: `https://www.youtube.com/embed/${TRAILER_ID}` },
    image: `${IMG}/keyart-header.webp`,
  };

  return (
    <main className="hm" data-nav-dark style={{ "--accent": "#a24bff" } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ============================== HERO ============================== */}
      <header className="hm-hero">
        <div className="hm-hero-bg" aria-hidden="true" />
        <div className="hm-hero-scrim" aria-hidden="true" />
        <div className="hm-hero-aurora" aria-hidden="true">
          <HeroAurora />
        </div>
        <div className="hm-hero-glow" aria-hidden="true" />

        <div className="hm-hero-inner wrap">
          <HeroLogo src={`${IMG}/hm2-logo.webp`} alt="Hunter Mouse 2" />
          <p className="hm-hero-sub">{h.heroSub}</p>
          <div className="hm-hero-cta">
            <a className="btn solid" href={GAMEJOLT} target="_blank" rel="noreferrer">
              <span>{h.play}</span> <span className="ar">↗</span>
            </a>
            <a className="btn ghost" href="#trailer">
              <span>▶ {h.watch}</span>
            </a>
            <a className="btn ghost" href={DEVLOGS} target="_blank" rel="noreferrer">
              <YouTubeIcon /> <span>{h.devlogs}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ============================== PREMISE (dark band) ============== */}
      <section className="hm-story" id="story">
        <Parallax className="hm-story-bg" speed={0.3}>
          <div className="hm-story-img" style={{ backgroundImage: `url(${IMG}/reufs-keep.webp)` }} />
        </Parallax>
        <div className="hm-story-scrim" aria-hidden="true" />
        <div className="wrap hm-story-inner">
          <span className="hm-eyebrow">{h.storyEyebrow}</span>
          <h2 className="hm-story-h">{h.storyLead}</h2>
          <p>{h.storyBody}</p>
        </div>
      </section>

      {/* ============================== TRAILER ========================== */}
      <section className="hm-trailer" id="trailer">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">{h.trailerEyebrow}</span>
              <h2 className="hm-sec-h">{h.trailerH}</h2>
            </div>
            <a className="btn ghost" href={GAMEJOLT} target="_blank" rel="noreferrer">
              <span>{h.gjPage}</span> <span className="ar">↗</span>
            </a>
          </div>
          <div className="hm-trailer-frame rv">
            <VideoEmbed id={TRAILER_ID} title="Hunter Mouse 2 — trailer" />
          </div>
        </div>
      </section>

      {/* ============================== WORLDS ========================== */}
      <section className="hm-worlds" id="worlds">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">{h.worldsEyebrow}</span>
              <h2 className="hm-sec-h">{h.worldsH}</h2>
            </div>
            <p className="hm-sec-lead">{h.worldsLead}</p>
          </div>

          <div className="hm-world-grid">
            {WORLD_STRUCT.map((w, i) => (
              <figure key={w.img} className={`hm-world${w.wide ? " wide" : ""} rv`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${IMG}/${w.img}.webp`} alt={`${h.worlds[i].name} — Hunter Mouse 2`} loading="lazy" />
                <figcaption>
                  <strong>{h.worlds[i].name}</strong>
                  <p>{h.worlds[i].blurb}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== HUB / HOMESTEAD (dark band) ====== */}
      <section className="hm-story" id="hub">
        <Parallax className="hm-story-bg" speed={0.3}>
          <div className="hm-story-img" style={{ backgroundImage: `url(${IMG}/homestead.webp)` }} />
        </Parallax>
        <div className="hm-story-scrim" aria-hidden="true" />
        <div className="wrap hm-story-inner">
          <span className="hm-eyebrow">{h.hubEyebrow}</span>
          <h2 className="hm-story-h">{h.hubH}</h2>
          <p>{h.hubBody}</p>
        </div>
      </section>

      {/* ============================== GALLERY (scroller) =============== */}
      <section className="hm-gallery">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">{h.galleryEyebrow}</span>
              <h2 className="hm-sec-h">{h.galleryH}</h2>
            </div>
            <p className="hm-sec-lead">{h.galleryLead}</p>
          </div>
          <HmScroller
            images={GALLERY_IMAGES.map((slug) => ({ src: `${IMG}/${slug}.webp`, alt: "Hunter Mouse 2 — in-game screenshot" }))}
          />
        </div>
      </section>

      {/* ============================== FEATURES ======================== */}
      <section className="hm-features">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">{h.featEyebrow}</span>
              <h2 className="hm-sec-h">{h.featH}</h2>
            </div>
          </div>
          <div className="hm-feat-grid">
            {h.features.map((f, i) => (
              <div className="hm-feat rv" key={i}>
                <span className="hm-feat-icon" aria-hidden="true">{FEAT_ICON[i]}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== JOURNEY ========================= */}
      <section className="hm-journey" id="journey">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">{h.journeyEyebrow}</span>
              <h2 className="hm-sec-h">{h.journeyH}</h2>
            </div>
            <p className="hm-sec-lead">{h.journeyLead}</p>
          </div>

          <ol className="hm-timeline">
            {h.journey.map((s, i) => (
              <li className="hm-step rv" key={i}>
                <div className="hm-step-rail" aria-hidden="true">
                  <span className="hm-step-dot" />
                </div>
                <div className="hm-step-body">
                  <span className="hm-step-year">{s.year}</span>
                  <h3>{s.role}</h3>
                  <p>{s.body}</p>
                  {JOURNEY_HREF[i] && s.link && (
                    <a className="hm-step-link" href={JOURNEY_HREF[i]} target="_blank" rel="noreferrer">
                      {s.link} <span className="ar">↗</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================== SOUNDTRACK ====================== */}
      <section className="hm-ost">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">{h.ostEyebrow}</span>
              <h2 className="hm-sec-h">{h.ostH}</h2>
            </div>
            <p className="hm-sec-lead">{h.ostLead}</p>
          </div>

          <div className="hm-tracklist">
            {TRACKS.map((tk, i) => (
              <div className="hm-track" key={i}>
                <span className="hm-track-no">{String(i + 1).padStart(2, "0")}</span>
                <span className="hm-track-name">{tk}</span>
                <span className="hm-track-eq" aria-hidden="true">
                  <i /><i /><i /><i />
                </span>
              </div>
            ))}
          </div>
          <div className="hm-ost-cta">
            <a className="btn ghost" href={GAMEJOLT} target="_blank" rel="noreferrer">
              <span>{h.ostListen}</span> <span className="ar">↗</span>
            </a>
            <a className="btn ghost" href={MUSIC} target="_blank" rel="noreferrer">
              <YouTubeIcon /> <span>{h.ostMusic}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================== DEVLOGS ========================= */}
      <section className="hm-devlog">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">{h.devEyebrow}</span>
              <h2 className="hm-sec-h">{h.devH}</h2>
            </div>
            <a className="btn solid" href={DEVLOGS} target="_blank" rel="noreferrer">
              <YouTubeIcon /> <span>{h.devSub}</span>
            </a>
          </div>

          <div className="hm-devlog-grid">
            {h.devlogsList.map((v, i) => (
              <a
                className="hm-devcard rv"
                key={DEV_IDS[i]}
                href={`https://www.youtube.com/watch?v=${DEV_IDS[i]}`}
                target="_blank"
                rel="noreferrer"
              >
                <div className="hm-devcard-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${DEV_IDS[i]}/hqdefault.jpg`} alt="" loading="lazy" />
                  <span className="hm-devcard-play" aria-hidden="true">▶</span>
                </div>
                <div className="hm-devcard-body">
                  <span className="hm-devcard-tag">{v.tag}</span>
                  <h3>{v.title}</h3>
                  <span className="hm-devcard-ch">
                    <YouTubeIcon /> aidinii
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== FINAL CTA ======================= */}
      <section className="hm-final">
        <div className="hm-final-burst" aria-hidden="true">
          <PrismaticBurst
            intensity={0.62}
            speed={0.4}
            animationType="hover"
            rayCount={10}
            mixBlendMode="screen"
            forceDark
            colors={["#a24bff", "#d93d72", "#6a22d8", "#4f7bff", "#f36844"]}
          />
        </div>
        <div className="hm-final-scrim" aria-hidden="true" />
        <div className="wrap hm-final-inner">
          <h2 className="hm-final-h">
            <span className="grad-t-warm">{h.finalH}</span> 🐭
          </h2>
          <p>{h.finalBody}</p>
          <div className="hm-final-cta">
            <a className="btn solid" href={GAMEJOLT} target="_blank" rel="noreferrer">
              <span>{h.finalPlay}</span> <span className="ar">↗</span>
            </a>
            <a className="btn ghost" href={DEVLOGS} target="_blank" rel="noreferrer">
              <YouTubeIcon /> <span>{h.finalFollow}</span>
            </a>
            <Link className="hm-final-back" href="/products">
              ← {h.finalBack}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
