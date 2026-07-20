/*
 * Blog data layer. Mirrors the shape/strategy of lib/products.ts so the whole
 * codebase reads the same way: one typed source of truth consumed by the blog
 * index, article pages, home "latest" strip, related posts, sitemap and OG.
 *
 * Content is modelled as an ordered list of typed blocks (not raw HTML/MDX) so
 * it stays localizable, safe to render (no dangerouslySetInnerHTML for prose),
 * and CMS-portable. When SANITY_PROJECT_ID is set it fetches live; otherwise it
 * uses the local seed so the site works with zero config.
 */

import { getJSON, setJSON } from "./store";
import type { Localized, Locale } from "./products";
import { t } from "./products";

export type { Localized, Locale };
export { t };

/** A single renderable block of article content. */
export type Block =
  | { type: "p"; text: Localized }
  | { type: "h2"; text: Localized }
  | { type: "h3"; text: Localized }
  | { type: "quote"; text: Localized; cite?: string }
  | { type: "list"; items: Localized[] }
  | { type: "code"; lang?: string; code: string }
  | { type: "image"; src: string; alt?: Localized };

export interface Author {
  name: string;
  role: Localized;
  avatar?: string;
}

export interface Post {
  slug: string;
  title: Localized;
  excerpt: Localized;
  category: Localized;
  cover?: string; // preview image for cards / hero
  accent: string; // hex, themes the article
  date: string; // ISO — used for sort + <time>
  author: Author;
  tags: string[];
  body: Block[];
  related?: string[]; // slugs
  featured?: boolean;
}

/** Rough reading-time from the localized body text (~200 wpm). */
export function readingTime(post: Post, locale: Locale): number {
  const words = post.body.reduce((n, b) => {
    if (b.type === "p" || b.type === "h2" || b.type === "h3" || b.type === "quote")
      return n + t(b.text, locale).split(/\s+/).length;
    if (b.type === "list") return n + b.items.reduce((m, i) => m + t(i, locale).split(/\s+/).length, 0);
    return n;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

const AUTHOR_AJDIN: Author = {
  name: "Ajdin Mehmedović",
  role: { en: "Full-stack engineer", bs: "Full-stack inženjer" },
};
const AUTHOR_STUDIO: Author = {
  name: "Plansio Studio",
  role: { en: "The whole team", bs: "Cijeli tim" },
};

/* ------------------------------------------------------------------ seed ---- */
const SEED: Post[] = [
  {
    slug: "the-human-touch-in-software",
    title: {
      en: "The human touch in software",
      bs: "Ljudski dodir u softveru",
    },
    excerpt: {
      en: "Anyone can ship a feature. The work is the gap between what a product does and how it feels — and that gap is where trust lives.",
      bs: "Svako može isporučiti feature. Posao je u jazu između onoga što proizvod radi i kako se osjeća — a u tom jazu živi povjerenje.",
    },
    category: { en: "Craft", bs: "Zanat" },
    accent: "#6a22d8",
    date: "2026-06-18",
    author: AUTHOR_STUDIO,
    tags: ["Design", "Product", "Craft"],
    featured: true,
    body: [
      {
        type: "p",
        text: {
          en: "There's a moment, right after a product technically works, where most teams stop. The tests are green, the feature ships, the ticket closes. But the people using it can feel the difference between something that works and something that was cared about.",
          bs: "Postoji trenutak, odmah nakon što proizvod tehnički radi, u kojem se većina timova zaustavi. Testovi su zeleni, feature je isporučen, tiket zatvoren. Ali ljudi koji ga koriste osjete razliku između nečega što radi i nečega o čemu se vodilo računa.",
        },
      },
      {
        type: "h2",
        text: { en: "Feeling is a feature", bs: "Osjećaj je feature" },
      },
      {
        type: "p",
        text: {
          en: "Timing, easing, the weight of a shadow, how an error speaks to you — none of these show up in a requirements doc. All of them decide whether a person trusts what you built.",
          bs: "Tajming, easing, težina sjene, kako vam se greška obraća — ništa od ovoga se ne pojavljuje u dokumentu sa zahtjevima. Sve to odlučuje hoće li osoba vjerovati onome što ste izgradili.",
        },
      },
      {
        type: "quote",
        text: {
          en: "Technology is easy. Making it feel human is the work.",
          bs: "Tehnologija je laka. Učiniti da djeluje ljudski — to je posao.",
        },
        cite: "The Plansio difference",
      },
      {
        type: "h2",
        text: { en: "A checklist for warmth", bs: "Lista za toplinu" },
      },
      {
        type: "list",
        items: [
          { en: "Motion that explains, never decorates for its own sake.", bs: "Pokret koji objašnjava, nikad ne ukrašava sam radi sebe." },
          { en: "Copy that talks like a person, not a system dialog.", bs: "Tekst koji govori kao osoba, a ne kao sistemski dijalog." },
          { en: "Empty states that welcome instead of apologising.", bs: "Prazna stanja koja dočekuju umjesto da se izvinjavaju." },
          { en: "Loading that reassures — progress, not a spinner void.", bs: "Učitavanje koje umiruje — napredak, a ne praznina spinnera." },
        ],
      },
      {
        type: "p",
        text: {
          en: "None of it is expensive. It's just the difference between finishing and caring — and users can always tell which one you did.",
          bs: "Ništa od toga nije skupo. To je samo razlika između završavanja i brige — a korisnici uvijek osjete šta ste od toga uradili.",
        },
      },
    ],
    related: ["building-a-webgl-hero-with-three-js", "why-we-ship-our-own-games"],
  },
  {
    slug: "building-a-webgl-hero-with-three-js",
    title: {
      en: "Building a WebGL hero with Three.js",
      bs: "Gradnja WebGL heroja pomoću Three.js",
    },
    excerpt: {
      en: "A living 3D backdrop that stays at 60fps on a laptop and gracefully turns itself off on a phone. Here's the whole approach.",
      bs: "Živa 3D pozadina koja ostaje na 60fps na laptopu i graciozno se gasi na telefonu. Evo cijelog pristupa.",
    },
    category: { en: "Engineering", bs: "Inženjering" },
    accent: "#2a3bed",
    date: "2026-07-02",
    author: AUTHOR_AJDIN,
    tags: ["Three.js", "WebGL", "Performance"],
    featured: true,
    body: [
      {
        type: "p",
        text: {
          en: "The best 3D on a marketing site is the kind you feel before you notice. It should never fight the content, never spin the fans on a MacBook, and never load at all on a device that can't afford it.",
          bs: "Najbolji 3D na marketinškoj stranici je onaj koji osjetite prije nego što ga primijetite. Nikad ne bi trebao da se bori sa sadržajem, nikad da vrti ventilatore na MacBooku, i nikad da se uopšte učita na uređaju koji to ne može priuštiti.",
        },
      },
      {
        type: "h2",
        text: { en: "Three rules before any geometry", bs: "Tri pravila prije bilo kakve geometrije" },
      },
      {
        type: "list",
        items: [
          { en: "Cap the pixel ratio — DPR 3 renders 9× the fragments of DPR 1.", bs: "Ograniči pixel ratio — DPR 3 renderuje 9× više fragmenata od DPR 1." },
          { en: "Pause on blur and off-screen — never burn GPU on a hidden tab.", bs: "Pauziraj na blur i van ekrana — nikad ne troši GPU na skrivenom tabu." },
          { en: "Detect low-power up front and render one static frame instead.", bs: "Detektuj slabe uređaje unaprijed i renderuj jedan statični frame umjesto toga." },
        ],
      },
      {
        type: "p",
        text: {
          en: "Those three decisions matter more than the shader itself. Get them right and you can afford something genuinely beautiful in the frames that remain.",
          bs: "Te tri odluke znače više od samog shadera. Postavi ih kako treba i možeš priuštiti nešto zaista lijepo u frejmovima koji preostanu.",
        },
      },
      {
        type: "h3",
        text: { en: "The render loop", bs: "Petlja renderovanja" },
      },
      {
        type: "code",
        lang: "ts",
        code: `const dpr = Math.min(window.devicePixelRatio, 1.6);\nrenderer.setPixelRatio(dpr);\n\nlet raf = 0;\nconst tick = () => {\n  if (document.hidden || !inView) { raf = requestAnimationFrame(tick); return; }\n  mesh.rotation.y += 0.0016;\n  material.uniforms.uTime.value = clock.getElapsedTime();\n  renderer.render(scene, camera);\n  raf = requestAnimationFrame(tick);\n};`,
      },
      {
        type: "p",
        text: {
          en: "Everything else — dispose geometries and materials on unmount, drop the WebGL context, remove listeners — is just being a good guest in someone's browser tab.",
          bs: "Sve ostalo — oslobodi geometrije i materijale pri unmountu, ukloni WebGL kontekst, skini listenere — samo je pitanje pristojnog gosta u nečijem tabu.",
        },
      },
    ],
    related: ["the-human-touch-in-software", "shipping-fast-without-shipping-junk"],
  },
  {
    slug: "why-we-ship-our-own-games",
    title: {
      en: "Why we ship our own games",
      bs: "Zašto objavljujemo vlastite igre",
    },
    excerpt: {
      en: "Client work pays the bills. Our own titles keep the craft honest — you can't fake having shipped something all the way to a store page.",
      bs: "Klijentski rad plaća račune. Vlastiti naslovi drže zanat iskrenim — ne možeš glumiti da si nešto isporučio sve do stranice u prodavnici.",
    },
    category: { en: "Studio", bs: "Studio" },
    accent: "#d93d72",
    date: "2026-05-09",
    author: AUTHOR_STUDIO,
    tags: ["Games", "Studio", "Unity"],
    body: [
      {
        type: "p",
        text: {
          en: "A studio that only builds for others slowly forgets what shipping actually costs. Deadlines get abstract. Polish becomes negotiable. Making our own games is how we keep the muscle.",
          bs: "Studio koji gradi samo za druge polako zaboravi šta isporuka zaista košta. Rokovi postaju apstraktni. Poliranje postaje pregovor. Pravljenje vlastitih igara je način da održimo mišić.",
        },
      },
      {
        type: "quote",
        text: {
          en: "We ship our own titles, and we can ship yours.",
          bs: "Objavljujemo vlastite naslove, a možemo i vaše.",
        },
      },
      {
        type: "p",
        text: {
          en: "Hunter Mouse 2 was designed, built and launched in-house — art, sound and mechanics, all by the same team that handles client work. That's the proof we carry an idea the whole way.",
          bs: "Hunter Mouse 2 je dizajniran, izgrađen i lansiran u vlastitoj režiji — art, zvuk i mehanike, sve od istog tima koji radi klijentske projekte. To je dokaz da ideju vodimo do kraja.",
        },
      },
    ],
    related: ["the-human-touch-in-software"],
  },
  {
    slug: "shipping-fast-without-shipping-junk",
    title: {
      en: "Shipping fast without shipping junk",
      bs: "Isporuka brzo bez isporuke smeća",
    },
    excerpt: {
      en: "Speed and quality aren't opposites — they're both downstream of taste and small batches. A field guide from real projects.",
      bs: "Brzina i kvalitet nisu suprotnosti — oboje proizlaze iz ukusa i malih serija. Vodič iz stvarnih projekata.",
    },
    category: { en: "Process", bs: "Proces" },
    accent: "#f36844",
    date: "2026-04-21",
    author: AUTHOR_AJDIN,
    tags: ["Process", "Engineering"],
    body: [
      {
        type: "p",
        text: {
          en: "\"Move fast\" gets a bad name because people hear \"skip the thinking.\" Real speed comes from smaller batches, tighter feedback, and a strong opinion about what not to build.",
          bs: "\"Kreći se brzo\" ima loš glas jer ljudi čuju \"preskoči razmišljanje.\" Prava brzina dolazi iz manjih serija, čvršćeg feedbacka i jasnog stava o tome šta ne graditi.",
        },
      },
      {
        type: "h2",
        text: { en: "Small batches win", bs: "Male serije pobjeđuju" },
      },
      {
        type: "p",
        text: {
          en: "A change you can review in ten minutes ships today. A change you can review in two days ships next week, with three merge conflicts and a bug you'll find in production.",
          bs: "Promjena koju možeš pregledati za deset minuta ide danas. Promjena koju pregledaš za dva dana ide sljedeće sedmice, sa tri merge konflikta i bugom kojeg ćeš naći u produkciji.",
        },
      },
      {
        type: "list",
        items: [
          { en: "One reason to change per commit.", bs: "Jedan razlog za promjenu po commitu." },
          { en: "Green build before you move on, always.", bs: "Zeleni build prije nego kreneš dalje, uvijek." },
          { en: "Delete more than you add when you can.", bs: "Obriši više nego što dodaš kad možeš." },
        ],
      },
    ],
    related: ["building-a-webgl-hero-with-three-js"],
  },
];

/* --------------------------------------------------------------- accessor ---- */
const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API_VERSION = "2024-01-01";
const POST_QUERY = `*[_type == "post"]|order(date desc)`;

async function fromSanity(): Promise<Post[] | null> {
  if (!PROJECT_ID) return null;
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(POST_QUERY)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: Post[] };
    return json.result?.length ? json.result : null;
  } catch {
    return null;
  }
}

const byDateDesc = (a: Post, b: Post) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

export const DEFAULT_POSTS = SEED;

export async function getAllPosts(): Promise<Post[]> {
  const stored = await getJSON<Post[]>("posts"); // Studio-edited content
  const posts = (stored && stored.length && stored) || (await fromSanity()) || SEED;
  return [...posts].sort(byDateDesc);
}

export async function setPosts(posts: Post[]): Promise<boolean> {
  return setJSON("posts", posts);
}

export async function getPost(slug: string): Promise<Post | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedPosts(post: Post): Promise<Post[]> {
  const all = await getAllPosts();
  const explicit = (post.related ?? [])
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is Post => Boolean(p));
  if (explicit.length) return explicit.slice(0, 3);
  // fall back to most-recent others so the section is never empty
  return all.filter((p) => p.slug !== post.slug).slice(0, 3);
}
