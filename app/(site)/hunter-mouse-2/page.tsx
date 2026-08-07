import type { Metadata } from "next";
import Link from "next/link";
import HunterHeroCanvas from "@/app/components/HunterHeroCanvas";
import VideoEmbed from "@/app/components/VideoEmbed";

/*
 * Hunter Mouse 2 — a dedicated, cinematic showcase page for the studio's own
 * game (its data still lives in lib/products.ts for the index/cards, but this
 * hand-built page is the canonical destination). Bespoke `hm-` styles live in
 * globals.css. The hero is a lazy, client-only Three.js scene.
 */

const GAMEJOLT = "https://gamejolt.com/games/huntermouse2/1004119";
const DEVLOGS = "https://www.youtube.com/channel/UCEXAp1jCB2j45tgx-d5UUQg";
const MUSIC = "https://www.youtube.com/c/aydhiny";
const TRAILER_ID = "Glwv6vjXREs";
const IMG = "/assets/hunter-mouse-2";

export const metadata: Metadata = {
  title: "Hunter Mouse 2 — a 3D collectathon platformer",
  description:
    "Step into the paws of Puntsy in Hunter Mouse 2 — a handcrafted 3D retro-inspired collectathon platformer. Chase the thunderbolts across eight worlds, stop Reuf's betrayal, and explore a childhood dream turned solo-built game.",
  alternates: { canonical: "/hunter-mouse-2" },
  openGraph: {
    title: "Hunter Mouse 2",
    description:
      "A handcrafted 3D collectathon platformer — eight worlds, a 16-track original score, and one very determined mouse. A dream since childhood, built by one multidisciplinary maker.",
    url: "/hunter-mouse-2",
    images: [`${IMG}/jungle-scapes.webp`],
  },
};

const WORLDS: { img: string; name: string; tag: string; blurb: string; wide?: boolean }[] = [
  { img: "jungle-scapes", name: "Jungle Scapes", tag: "The hub", blurb: "Lush lagoon islands, hot-air balloons and hidden coves — the first breath of the adventure.", wide: true },
  { img: "aether-reach", name: "Aether Reach", tag: "Sky islands", blurb: "Balloon-hop between floating platforms high above the clouds." },
  { img: "infernias-keep", name: "Infernias Keep", tag: "Molten depths", blurb: "Leap across crumbling obsidian over a sea of lava." },
  { img: "whispering-frost", name: "Whispering Frost", tag: "Frozen caverns", blurb: "Glowing ice, top-hatted snowmen and crystal-lit tunnels." },
  { img: "creeptown", name: "Creeptown", tag: "Haunted grounds", blurb: "A moonlit graveyard where Reuf is lurking — don't get jumpscared." },
  { img: "pirate-ship", name: "The High Seas", tag: "Pirate ships", blurb: "Board floating galleons and raise the black flag." },
  { img: "reufs-valley", name: "Reuf's Valley", tag: "Desert & boss", blurb: "A crimson desert guarded by Reuf's Pet — a very large spider." },
  { img: "reufs-keep", name: "Reuf's Keep", tag: "Neon fortress", blurb: "The final neon-soaked approach to the traitor himself." },
];

const FEATURES: { icon: string; title: string; body: string }[] = [
  { icon: "🗺️", title: "Insanely detailed worlds", body: "Eight handcrafted worlds brimming with secrets, relics and things worth climbing toward." },
  { icon: "🎮", title: "Classic-feel platforming", body: "Tight, expressive movement inspired by the legends — Banjo-Kazooie and Super Mario 64." },
  { icon: "⚡", title: "Collect the thunderbolts", body: "Retrieve the scattered thunderbolts, uncover hidden relics and unlock new abilities." },
  { icon: "👀", title: "Goofy, dangerous foes", body: "Face off against enemies with googly eyes and genuinely wicked charm." },
  { icon: "🕵️", title: "Unravel the betrayal", body: "Chase down the mystery behind Reuf's turn — and prove you're the hero the kingdom deserves." },
];

const TRACKS = [
  "Main Theme", "Jupiter Capsule", "Jupiter Capsule Pt. 2 (Spaceship)", "Jungle Scapes",
  "Whispering Frost", "Reuf's Valley", "Aether Reach", "Infernias Keep",
  "Creeptown", "Witches & Switches", "Neon Tunnel", "Clumsy Board",
  "Misty Mysteries", "Final Boss (Reuf)", "Game Over", "Neon Train (Chase)",
];

const JOURNEY: { year: string; role: string; body: string; href?: string; linkLabel?: string }[] = [
  {
    year: "The spark",
    role: "A kid with a dream",
    body: "Before the code and the mixing desk, there was a small kid who wanted, more than anything, to make the games he loved to play. Hunter Mouse 2 is that promise, kept.",
  },
  {
    year: "First craft",
    role: "Professional music producer",
    body: "The dream started with sound. Years producing music as Aydhiny taught rhythm, mood and how a single melody can carry a whole world — the same instinct behind the game's 16-track score.",
    href: MUSIC,
    linkLabel: "Hear the music",
  },
  {
    year: "Next",
    role: "Designer & art director",
    body: "Then came the eye — identity, colour, composition. Learning to make things that feel deliberate, that read at a glance and reward a second look.",
  },
  {
    year: "Then",
    role: "Software engineer",
    body: "The dream needed engineering to become real. Full-stack C# .NET and React/TypeScript by day — the discipline to ship things that actually work.",
  },
  {
    year: "Now",
    role: "Multidisciplinary game dev & tech enthusiast",
    body: "Music, design and engineering finally converge. Hunter Mouse 2 is written, scored, modelled, animated and shipped by one maker — every discipline pulling in the same direction.",
  },
];

const DEVLOGS_LIST: { id: string; title: string; tag: string }[] = [
  { id: "BBN68hcazJc", title: "The soundtrack that changed my game", tag: "Music" },
  { id: "qfv3Gr91jxM", title: "2 years of solo game dev — this is the result", tag: "The journey" },
  { id: "GhGqQCtngXY", title: "Set up a Unity MCP server with Claude Code", tag: "Tech" },
];

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

export default function HunterMouse2() {
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
    image: `${IMG}/jungle-scapes.webp`,
  };

  return (
    <main className="hm" style={{ "--accent": "#d93d72" } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ============================== HERO ============================== */}
      <header className="hm-hero">
        <div className="hm-hero-canvas-wrap" aria-hidden="true">
          <HunterHeroCanvas />
        </div>
        <div className="hm-hero-glow" aria-hidden="true" />
        <div className="hm-hero-fade" aria-hidden="true" />

        <div className="hm-hero-inner wrap">
          <span className="hm-kick">A Plansio original · 3D collectathon platformer</span>
          <h1 className="hm-title">
            <span className="hm-title-1">Hunter</span>
            <span className="hm-title-2 grad-t-warm">Mouse</span>
            <span className="hm-title-3">2</span>
          </h1>
          <p className="hm-hero-sub">
            Enter <span className="serif">Jungle Scapes</span>, where worlds impress &amp; adventure awaits. Chase the
            thunderbolts, stop the greatest betrayal in mouse history — are you mouse enough?
          </p>
          <div className="hm-hero-cta">
            <a className="btn solid" href={GAMEJOLT} target="_blank" rel="noreferrer">
              <span>Play on Game Jolt</span> <span className="ar">↗</span>
            </a>
            <a className="btn ghost" href="#trailer">
              <span>▶ Watch the trailer</span>
            </a>
            <a className="btn ghost" href={DEVLOGS} target="_blank" rel="noreferrer">
              <YouTubeIcon /> <span>Devlogs</span>
            </a>
          </div>
          <div className="hm-hero-meta">
            <span>Solo-made</span>
            <i />
            <span>Unity · C#</span>
            <i />
            <span>Original 16-track score</span>
          </div>
        </div>

        <a className="hm-scroll" href="#story" aria-label="Scroll to story">
          <span />
        </a>
      </header>

      {/* ============================== PREMISE (dark cinematic band) ======= */}
      <section className="hm-story" id="story" style={{ backgroundImage: `url(${IMG}/reufs-keep.webp)` }}>
        <div className="hm-story-scrim" aria-hidden="true" />
        <div className="wrap hm-story-inner">
          <span className="hm-eyebrow">The story</span>
          <h2 className="hm-story-h">
            The infamous <span className="grad-t-warm">Reuf</span> — once a trusted ally — has turned against the Mouse
            Kingdom.
          </h2>
          <p>
            With an army of corrupted critters and diabolical gadgets, he threatens the peace. Only you, our brave hero{" "}
            <strong>Puntsy</strong>, can chase him down — thunderbolt by thunderbolt — across lush jungles, forgotten
            temples, floating pirate ships and quirky sky islands, and restore order to the kingdom.
          </p>
          <div className="hm-story-tags">
            <span>#collectathon</span>
            <span>#3dplatformer</span>
            <span>#retro</span>
            <span>#indiegame</span>
            <span>#miceunite</span>
          </div>
        </div>
      </section>

      {/* ============================== TRAILER ============================== */}
      <section className="hm-trailer" id="trailer">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">Watch</span>
              <h2 className="hm-sec-h">See it in motion.</h2>
            </div>
            <a className="btn ghost" href={GAMEJOLT} target="_blank" rel="noreferrer">
              <span>Game Jolt page</span> <span className="ar">↗</span>
            </a>
          </div>
          <div className="hm-trailer-frame rv">
            <VideoEmbed id={TRAILER_ID} title="Hunter Mouse 2 — trailer" />
          </div>
        </div>
      </section>

      {/* ============================== WORLDS ============================== */}
      <section className="hm-worlds" id="worlds">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">The worlds</span>
              <h2 className="hm-sec-h">
                Eight handcrafted worlds, <span className="serif">brimming</span> with secrets.
              </h2>
            </div>
            <p className="hm-sec-lead">
              Every world is modelled, lit and scored by hand — from sun-drenched lagoons to neon fortresses. Here's a
              look at where the hunt takes you.
            </p>
          </div>

          <div className="hm-world-grid">
            {WORLDS.map((w) => (
              <figure key={w.img} className={`hm-world${w.wide ? " wide" : ""} rv`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${IMG}/${w.img}.webp`} alt={`${w.name} — Hunter Mouse 2`} loading="lazy" />
                <figcaption>
                  <span className="hm-world-tag">{w.tag}</span>
                  <strong>{w.name}</strong>
                  <p>{w.blurb}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== FEATURES ============================== */}
      <section className="hm-features">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">What you'll do</span>
              <h2 className="hm-sec-h">Adventure, nostalgia &amp; danger.</h2>
            </div>
          </div>
          <div className="hm-feat-grid">
            {FEATURES.map((f, i) => (
              <div className="hm-feat rv" key={i}>
                <span className="hm-feat-icon" aria-hidden="true">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== JOURNEY (the dream) ================== */}
      <section className="hm-journey" id="journey">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">The maker</span>
              <h2 className="hm-sec-h">
                A dream I've had since I was <span className="serif">a small kid.</span>
              </h2>
            </div>
            <p className="hm-sec-lead">
              Hunter Mouse 2 isn't just a game — it's four crafts I spent years learning, finally pulled into one thing.
              This is the road that led here.
            </p>
          </div>

          <ol className="hm-timeline">
            {JOURNEY.map((s, i) => (
              <li className="hm-step rv" key={i}>
                <div className="hm-step-rail" aria-hidden="true">
                  <span className="hm-step-dot" />
                </div>
                <div className="hm-step-body">
                  <span className="hm-step-year">{s.year}</span>
                  <h3>{s.role}</h3>
                  <p>{s.body}</p>
                  {s.href && (
                    <a className="hm-step-link" href={s.href} target="_blank" rel="noreferrer">
                      {s.linkLabel} <span className="ar">↗</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================== SOUNDTRACK ========================== */}
      <section className="hm-ost">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">The score</span>
              <h2 className="hm-sec-h">
                An original score, <span className="grad-t-warm">16 tracks</span> deep.
              </h2>
            </div>
            <p className="hm-sec-lead">
              Every world has its own theme — written and produced from scratch. It's where the music-producer chapter of
              the journey lives on inside the game.
            </p>
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
              <span>Listen on Game Jolt</span> <span className="ar">↗</span>
            </a>
            <a className="btn ghost" href={MUSIC} target="_blank" rel="noreferrer">
              <YouTubeIcon /> <span>More of my music</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================== DEVLOGS ============================== */}
      <section className="hm-devlog">
        <div className="wrap">
          <div className="hm-sec-head">
            <div>
              <span className="hm-eyebrow">Follow the build</span>
              <h2 className="hm-sec-h">Devlogs from the workshop.</h2>
            </div>
            <a className="btn solid" href={DEVLOGS} target="_blank" rel="noreferrer">
              <YouTubeIcon /> <span>Subscribe on YouTube</span>
            </a>
          </div>

          <div className="hm-devlog-grid">
            {DEVLOGS_LIST.map((v) => (
              <a className="hm-devcard rv" key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer">
                <div className="hm-devcard-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
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

      {/* ============================== FINAL CTA =========================== */}
      <section className="hm-final" style={{ backgroundImage: `url(${IMG}/infernias-keep.webp)` }}>
        <div className="hm-final-scrim" aria-hidden="true" />
        <div className="wrap hm-final-inner">
          <h2 className="hm-final-h">
            Are you <span className="grad-t-warm">mouse enough?</span> 🐭
          </h2>
          <p>The kingdom's counting on you. Grab the thunderbolts, chase down Reuf, and see the whole adventure through.</p>
          <div className="hm-final-cta">
            <a className="btn solid" href={GAMEJOLT} target="_blank" rel="noreferrer">
              <span>Play Hunter Mouse 2</span> <span className="ar">↗</span>
            </a>
            <a className="btn ghost" href={DEVLOGS} target="_blank" rel="noreferrer">
              <YouTubeIcon /> <span>Follow the devlogs</span>
            </a>
            <Link className="hm-final-back" href="/products">
              ← More from the studio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
