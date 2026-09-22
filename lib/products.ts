/*
 * Product data layer. One typed source of truth consumed by the products index,
 * detail pages, home "featured" strip, related-products, sitemap and OG images.
 *
 * CMS-ready: when SANITY_PROJECT_ID + SANITY_DATASET are set it fetches live
 * content from Sanity (GROQ over the public HTTP API — no SDK dependency);
 * otherwise it uses the local seed below so the site works with zero config.
 * Drop-in schema: sanity/product.schema.ts.
 */

import { getJSON, setJSON } from "./store";

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
    category: { en: "Reading app", bs: "Aplikacija za čitanje" },
    tagline: {
      en: "Gamified reading, one streak at a time.",
      bs: "Igrifikovano čitanje, dan po dan.",
    },
    description: {
      en: "Inkril turns reading into a daily habit — streaks, a leaderboard with friends, a built-in PDF reader and recommendations that actually fit what you're into.",
      bs: "Inkril čitanje pretvara u svakodnevnu naviku — nizovi, rang-lista s prijateljima, ugrađeni PDF čitač i preporuke koje zaista odgovaraju onome što volite.",
    },
    url: "https://github.com/Aydhiny/inkril-books-app",
    liveEmbed: false,
    poster: "/assets/inkril-hero.webp",
    accent: "#6a22d8",
    year: "2025",
    status: "wip",
    platforms: ["Web", "iOS", "Android", "Windows"],
    features: [
      { title: { en: "Daily streaks", bs: "Dnevni nizovi" }, body: { en: "A leaderboard that keeps friends reading, not just competing.", bs: "Rang-lista koja tjera prijatelje da čitaju, ne samo takmiče." } },
      { title: { en: "Built-in PDF reader", bs: "Ugrađeni PDF čitač" }, body: { en: "Read without leaving the app that's tracking your progress.", bs: "Čitajte bez napuštanja aplikacije koja prati vaš napredak." } },
      { title: { en: "Personalized picks", bs: "Personalizovani izbor" }, body: { en: "Recommendations built from what you've actually finished.", bs: "Preporuke izgrađene na osnovu onoga što ste zaista pročitali." } },
    ],
    tech: ["ASP.NET Core", "PostgreSQL", "RabbitMQ", "Flutter"],
    related: ["musicle", "galaxus"],
    featured: true,
  },
  {
    slug: "musicle",
    name: "Musicle",
    category: { en: "Music analysis platform", bs: "Platforma za analizu muzike" },
    tagline: {
      en: "Upload your track, improve your mix.",
      bs: "Učitaj pjesmu, poboljšaj mix.",
    },
    description: {
      en: "Musicle gives producers instant AI feedback on a track — audio characteristics, production quality and commercial potential — from an ML.NET agent, then a feed to share and compare mixes with other producers.",
      bs: "Musicle producentima daje trenutnu AI povratnu informaciju o pjesmi — audio karakteristike, kvalitet produkcije i komercijalni potencijal — putem ML.NET agenta, uz feed za dijeljenje i poređenje mikseva s drugim producentima.",
    },
    url: "https://github.com/Aydhiny/musicle-ai",
    liveEmbed: false,
    poster: "/assets/musicle-hero.webp",
    accent: "#f36844",
    year: "2025",
    status: "wip",
    platforms: ["Web"],
    features: [
      { title: { en: "Instant ML feedback", bs: "Trenutna ML povratna informacija" }, body: { en: "Genre, production quality and commercial potential, scored on upload.", bs: "Žanr, kvalitet produkcije i komercijalni potencijal, ocijenjeno odmah nakon učitavanja." } },
      { title: { en: "Learns over time", bs: "Uči s vremenom" }, body: { en: "A LightGBM classifier that retrains on accumulated feedback.", bs: "LightGBM klasifikator koji se ponovo trenira na osnovu prikupljenih povratnih informacija." } },
      { title: { en: "Community feed", bs: "Feed zajednice" }, body: { en: "Share a mix insight or a production win with other producers.", bs: "Podijelite uvid o miksu ili uspjeh u produkciji s drugim producentima." } },
    ],
    tech: ["Next.js", "ASP.NET Core", "ML.NET", "SignalR"],
    related: ["inkril", "hunter-mouse-2"],
    featured: true,
  },
  {
    slug: "galaxus",
    name: "Galaxus",
    category: { en: "Personal growth platform", bs: "Platforma za lični razvoj" },
    tagline: {
      en: "Everything you're building toward, in one universe.",
      bs: "Sve što gradiš, u jednom univerzumu.",
    },
    description: {
      en: "Galaxus is a calm home for the habits that matter — prayers, goals, deep work, fitness, journaling, reading and creative projects — tracked and streaked in one dashboard instead of scattered across five apps.",
      bs: "Galaxus je miran dom za navike koje su bitne — molitve, ciljevi, fokusiran rad, fitness, dnevnik, čitanje i kreativni projekti — praćeni na jednom dashboardu umjesto razbacani po pet aplikacija.",
    },
    url: "https://github.com/Aydhiny/project-galaxus",
    liveEmbed: false,
    poster: "/assets/galaxus-hero.webp",
    accent: "#2a3bed",
    year: "2026",
    status: "beta",
    platforms: ["Web"],
    features: [
      { title: { en: "Eight life pillars", bs: "Osam životnih stubova" }, body: { en: "Prayers, habits, goals, deep work, fitness, journaling, reading, creative — pick what matters.", bs: "Molitve, navike, ciljevi, fokusiran rad, fitness, dnevnik, čitanje, kreativnost — izaberite šta je bitno." } },
      { title: { en: "Streaks & heatmaps", bs: "Nizovi i heatmape" }, body: { en: "Visual consistency tracking that makes showing up feel good.", bs: "Vizuelno praćenje konzistentnosti koje čini pojavljivanje svaki dan prijatnim." } },
      { title: { en: "Private by design", bs: "Privatno po dizajnu" }, body: { en: "Every account's data is fully isolated — yours alone.", bs: "Podaci svakog naloga su potpuno izolovani — samo vaši." } },
    ],
    tech: ["Next.js", "Drizzle ORM", "Neon Postgres", "Auth.js"],
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
    url: "https://gamejolt.com/games/huntermouse2/1004119",
    liveEmbed: false,
    poster: "/assets/hunter-mouse-2/jungle-scapes.webp",
    accent: "#d93d72",
    year: "2025",
    status: "live",
    platforms: ["Windows", "Web"],
    features: [
      { title: { en: "Tight controls", bs: "Precizne kontrole" }, body: { en: "Every frame reacts.", bs: "Svaki frame reaguje." } },
      { title: { en: "Hand-crafted", bs: "Ručno izrađeno" }, body: { en: "Art, sound and mechanics, all in-house.", bs: "Art, zvuk i mehanike — sve u kući." } },
    ],
    tech: ["Unity", "C#"],
    related: ["musicle"],
    featured: true,
  },
];

/* --------------------------------------------------------------- accessor ---- */
const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
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

export const DEFAULT_PRODUCTS = SEED;

export async function getAllProducts(): Promise<Product[]> {
  const stored = await getJSON<Product[]>("products"); // Studio-edited content
  if (stored && stored.length) return stored;
  return (await fromSanity()) ?? SEED;
}

export async function setProducts(products: Product[]): Promise<boolean> {
  return setJSON("products", products);
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
