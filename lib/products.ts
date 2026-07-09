/*
 * Product data layer. One typed source of truth consumed by the products index,
 * detail pages, home "featured" strip, related-products, sitemap and OG images.
 *
 * CMS-ready: when SANITY_PROJECT_ID + SANITY_DATASET are set it fetches live
 * content from Sanity (GROQ over the public HTTP API — no SDK dependency);
 * otherwise it uses the local seed below so the site works with zero config.
 * Drop-in schema: sanity/product.schema.ts.
 */

export type Localized = { en: string; bs: string };
export type Locale = "en" | "bs";

export function t(v: Localized | string, locale: Locale): string {
  if (typeof v === "string") return v;
  return v[locale] || v.en;
}

export interface ProductFeature {
  title: Localized;
  body: Localized;
}

export interface ProductMetric {
  value: string;
  label: Localized;
}

export interface Product {
  slug: string;
  name: string;
  category: Localized;
  tagline: Localized;
  description: Localized;
  url: string; // live app URL
  liveEmbed: boolean; // render an interactive iframe of the live app
  poster?: string; // preview image for the device frame / cards
  accent: string; // hex, themes the page
  year: string;
  status: "live" | "beta" | "wip";
  platforms: string[];
  features: ProductFeature[];
  tech: string[];
  metrics?: ProductMetric[];
  gallery?: string[];
  related?: string[]; // slugs
  featured?: boolean;
}

/* ------------------------------------------------------------------ seed ---- */
// Placeholder copy/URLs/images — replace with real content (or wire the CMS).
const SEED: Product[] = [
  {
    slug: "inkril",
    name: "Inkril",
    category: { en: "Creative web app", bs: "Kreativna web aplikacija" },
    tagline: {
      en: "A calmer canvas for writing and thinking.",
      bs: "Mirniji prostor za pisanje i razmišljanje.",
    },
    description: {
      en: "Inkril is a distraction-free writing surface with structure that gets out of your way — outlines, focus mode, and export that just works.",
      bs: "Inkril je površina za pisanje bez ometanja, sa strukturom koja vam ne smeta — nacrti, focus mode i izvoz koji jednostavno radi.",
    },
    url: "https://inkril.com",
    liveEmbed: true,
    accent: "#6a22d8",
    year: "2025",
    status: "live",
    platforms: ["Web"],
    features: [
      { title: { en: "Focus mode", bs: "Focus mode" }, body: { en: "Everything fades but the sentence you're writing.", bs: "Sve nestaje osim rečenice koju pišete." } },
      { title: { en: "Living outlines", bs: "Živi nacrti" }, body: { en: "Structure that rearranges as your thinking does.", bs: "Struktura koja se preslaguje kako se mijenja vaše razmišljanje." } },
      { title: { en: "Export anywhere", bs: "Izvoz bilo gdje" }, body: { en: "Markdown, PDF, or clean HTML in a click.", bs: "Markdown, PDF ili čist HTML u jednom kliku." } },
    ],
    tech: ["Next.js", "TypeScript", "Postgres", "Tiptap"],
    metrics: [
      { value: "4.9", label: { en: "Avg. rating", bs: "Prosječna ocjena" } },
      { value: "12k", label: { en: "Writers", bs: "Pisaca" } },
    ],
    related: ["musicle", "galaxus"],
    featured: true,
  },
  {
    slug: "musicle",
    name: "Musicle",
    category: { en: "Music game", bs: "Muzička igra" },
    tagline: {
      en: "A daily music guessing game.",
      bs: "Dnevna igra pogađanja muzike.",
    },
    description: {
      en: "Guess the track from a few seconds of audio, one clue at a time. New puzzle every day, streaks, and a leaderboard with your friends.",
      bs: "Pogodi pjesmu iz nekoliko sekundi zvuka, trag po trag. Nova zagonetka svaki dan, nizovi i rang-lista s prijateljima.",
    },
    url: "https://musicle.app",
    liveEmbed: true,
    accent: "#f36844",
    year: "2025",
    status: "live",
    platforms: ["Web", "iOS", "Android"],
    features: [
      { title: { en: "One a day", bs: "Jedna dnevno" }, body: { en: "A fresh puzzle at midnight, same for everyone.", bs: "Svježa zagonetka u ponoć, ista za sve." } },
      { title: { en: "Streaks", bs: "Nizovi" }, body: { en: "Keep the run alive and climb the board.", bs: "Održi niz i penji se na rang-listi." } },
      { title: { en: "Share cards", bs: "Kartice za dijeljenje" }, body: { en: "Spoiler-free results, made to share.", bs: "Rezultati bez spojlera, spremni za dijeljenje." } },
    ],
    tech: ["Next.js", "Web Audio API", "Supabase"],
    metrics: [
      { value: "1M+", label: { en: "Games played", bs: "Odigranih partija" } },
      { value: "60s", label: { en: "Avg. session", bs: "Prosječna sesija" } },
    ],
    related: ["inkril", "hunter-mouse-2"],
    featured: true,
  },
  {
    slug: "galaxus",
    name: "Galaxus",
    category: { en: "Web platform", bs: "Web platforma" },
    tagline: {
      en: "Your universe of projects, in orbit.",
      bs: "Vaš univerzum projekata, u orbiti.",
    },
    description: {
      en: "Galaxus is a spatial workspace that maps your projects, docs and links as a navigable galaxy — zoom out for the big picture, dive in for the detail.",
      bs: "Galaxus je prostorni radni prostor koji vaše projekte, dokumente i linkove prikazuje kao galaksiju kroz koju se krećete — odzumirajte za širu sliku, uronite za detalje.",
    },
    url: "https://galaxus.app",
    liveEmbed: true,
    accent: "#2a3bed",
    year: "2026",
    status: "beta",
    platforms: ["Web"],
    features: [
      { title: { en: "Spatial canvas", bs: "Prostorno platno" }, body: { en: "Everything lives on one infinite, zoomable map.", bs: "Sve živi na jednoj beskonačnoj mapi s zumiranjem." } },
      { title: { en: "Instant search", bs: "Trenutna pretraga" }, body: { en: "Warp to anything in a keystroke.", bs: "Skok do bilo čega jednim potezom." } },
      { title: { en: "Real-time", bs: "U realnom vremenu" }, body: { en: "Your whole team, on the same map.", bs: "Cijeli tim, na istoj mapi." } },
    ],
    tech: ["Next.js", "WebGL", "Yjs", "Postgres"],
    metrics: [{ value: "Beta", label: { en: "Now in", bs: "Trenutno u" } }],
    related: ["inkril", "musicle"],
    featured: true,
  },
  {
    slug: "hunter-mouse-2",
    name: "Hunter Mouse 2",
    category: { en: "Game", bs: "Igra" },
    tagline: { en: "Our own fast, hand-crafted title.", bs: "Naš vlastiti brzi, ručno izrađeni naslov." },
    description: {
      en: "A fast arcade title designed, built and launched in-house — proof the studio carries an idea all the way to a shipped, playable product.",
      bs: "Brza arkadna igra dizajnirana, izrađena i lansirana u vlastitoj režiji — dokaz da studio ideju vodi sve do gotovog, igrivog proizvoda.",
    },
    url: "https://www.youtube.com/watch?v=Glwv6vjXREs",
    liveEmbed: false,
    poster: "/assets/hunter-mouse-2.jpg",
    accent: "#d93d72",
    year: "2025",
    status: "live",
    platforms: ["Web", "Steam"],
    features: [
      { title: { en: "Tight controls", bs: "Precizne kontrole" }, body: { en: "Every frame reacts.", bs: "Svaki frame reaguje." } },
      { title: { en: "Hand-crafted", bs: "Ručno izrađeno" }, body: { en: "Art, sound and mechanics, all in-house.", bs: "Art, zvuk i mehanike — sve u kući." } },
    ],
    tech: ["Unity", "C#"],
    related: ["musicle"],
    featured: false,
  },
];

/* --------------------------------------------------------------- accessor ---- */
const PROJECT_ID = process.env.SANITY_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET || "production";
const API_VERSION = "2024-01-01";
const PRODUCT_QUERY = `*[_type == "product"]|order(coalesce(order, 99) asc)`;

async function fromSanity(): Promise<Product[] | null> {
  if (!PROJECT_ID) return null;
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(PRODUCT_QUERY)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: Product[] };
    return json.result?.length ? json.result : null;
  } catch {
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  return (await fromSanity()) ?? SEED;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getRelated(product: Product): Promise<Product[]> {
  const all = await getAllProducts();
  return (product.related ?? [])
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));
}
