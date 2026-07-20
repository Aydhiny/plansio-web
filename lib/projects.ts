/*
 * Projects data layer — client case studies (distinct from lib/products, which
 * is the studio's OWN shipped apps). Same strategy as products/blog: typed local
 * seed + Sanity-ready + Studio KV/file override, all localized.
 */

import { getJSON, setJSON } from "./store";
import type { Localized, Locale } from "./products";
import { t } from "./products";

export type { Localized, Locale };
export { t };

export interface ProjectResult {
  value: string;
  label: Localized;
}

export interface Project {
  slug: string;
  client: string;
  title: Localized; // the engagement headline
  sector: Localized;
  year: string;
  accent: string;
  cover?: string;
  roles: string[]; // what the studio did — Brand, Web, Marketing…
  summary: Localized; // one-liner for cards
  challenge: Localized;
  approach: Localized;
  outcome: Localized;
  results?: ProjectResult[];
  stack: string[];
  url?: string;
  featured?: boolean;
}

const SEED: Project[] = [
  {
    slug: "northwind-rebrand",
    client: "Northwind",
    title: { en: "A logistics brand that finally moves", bs: "Logistički brend koji se konačno pokreće" },
    sector: { en: "Logistics", bs: "Logistika" },
    year: "2026",
    accent: "#2a3bed",
    roles: ["Brand", "Web", "Motion"],
    summary: {
      en: "Full rebrand and marketing site for a freight startup scaling across three markets.",
      bs: "Potpuni rebrand i marketinška stranica za transport startup koji raste na tri tržišta.",
    },
    challenge: {
      en: "Northwind had outgrown a logo made in a weekend. Investors were in, expansion was funded, but the brand read like a local courier — not a company moving freight across borders.",
      bs: "Northwind je prerastao logo napravljen za vikend. Investitori su bili tu, ekspanzija finansirana, ali brend je djelovao kao lokalni kurir — a ne kompanija koja vozi teret preko granica.",
    },
    approach: {
      en: "We rebuilt the identity around motion and reliability, then shipped a marketing site with live shipment visuals and a tone that speaks to operations leads, not consumers.",
      bs: "Identitet smo izgradili oko pokreta i pouzdanosti, zatim isporučili marketinšku stranicu sa vizualima pošiljki uživo i tonom koji govori operativcima, ne potrošačima.",
    },
    outcome: {
      en: "A cohesive system across truck livery, app and web — and a site that converts enterprise leads instead of scaring them off.",
      bs: "Kohezivan sistem kroz izgled kamiona, aplikaciju i web — te stranica koja konvertuje enterprise leadove umjesto da ih plaši.",
    },
    results: [
      { value: "+64%", label: { en: "Demo requests", bs: "Zahtjeva za demo" } },
      { value: "3", label: { en: "Markets launched", bs: "Pokrenutih tržišta" } },
      { value: "6 wk", label: { en: "Idea to launch", bs: "Od ideje do lansiranja" } },
    ],
    stack: ["Figma", "Next.js", "Framer Motion"],
    featured: true,
  },
  {
    slug: "auralux-commerce",
    client: "Auralux",
    title: { en: "A skincare store that feels like the product", bs: "Trgovina za njegu kože koja djeluje kao proizvod" },
    sector: { en: "E-commerce", bs: "E-trgovina" },
    year: "2025",
    accent: "#d93d72",
    roles: ["Design", "Software", "Marketing"],
    summary: {
      en: "Headless storefront and launch campaign for a premium skincare label.",
      bs: "Headless trgovina i kampanja lansiranja za premium brend za njegu kože.",
    },
    challenge: {
      en: "A beautiful product trapped in a template store that loaded slowly and looked like everyone else's.",
      bs: "Prekrasan proizvod zarobljen u template trgovini koja se sporo učitavala i izgledala kao svačija druga.",
    },
    approach: {
      en: "A headless build for speed and total design control, paired with a launch campaign that treated the site itself as the hero asset.",
      bs: "Headless izrada za brzinu i potpunu kontrolu nad dizajnom, uparena s kampanjom lansiranja koja je samu stranicu tretirala kao glavni adut.",
    },
    outcome: {
      en: "Sub-second loads, a checkout people finish, and a first drop that sold through in days.",
      bs: "Učitavanje ispod sekunde, checkout koji ljudi završe, i prvi drop rasprodan za nekoliko dana.",
    },
    results: [
      { value: "0.9s", label: { en: "Median load", bs: "Medijalno učitavanje" } },
      { value: "+38%", label: { en: "Conversion", bs: "Konverzija" } },
      { value: "Sold out", label: { en: "First drop", bs: "Prvi drop" } },
    ],
    stack: ["Shopify Hydrogen", "TypeScript", "Meta Ads"],
    featured: true,
  },
  {
    slug: "civia-dashboard",
    client: "Civia",
    title: { en: "Making city data legible for everyone", bs: "Gradski podaci čitljivi za svakoga" },
    sector: { en: "Civic tech", bs: "Civic tech" },
    year: "2025",
    accent: "#6a22d8",
    roles: ["Product", "Software", "Data viz"],
    summary: {
      en: "An analytics dashboard turning municipal open data into decisions.",
      bs: "Analitički dashboard koji općinske otvorene podatke pretvara u odluke.",
    },
    challenge: {
      en: "City staff were drowning in spreadsheets no council member could read, let alone act on.",
      bs: "Gradsko osoblje se davilo u tabelama koje nijedan vijećnik nije mogao pročitati, a kamoli djelovati po njima.",
    },
    approach: {
      en: "We designed a calm, accessible dashboard with charts built for non-experts and exports that drop straight into a council packet.",
      bs: "Dizajnirali smo smiren, pristupačan dashboard sa grafovima za nestručnjake i izvozima koji odmah idu u vijećnički materijal.",
    },
    outcome: {
      en: "Data that used to sit in a folder now opens council meetings — the same numbers, finally understood.",
      bs: "Podaci koji su prije stajali u folderu sada otvaraju sjednice vijeća — iste brojke, konačno shvaćene.",
    },
    results: [
      { value: "12", label: { en: "Datasets unified", bs: "Objedinjenih skupova" } },
      { value: "WCAG AA", label: { en: "Accessibility", bs: "Pristupačnost" } },
    ],
    stack: ["Next.js", "D3", "Postgres"],
    featured: false,
  },
];

const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API_VERSION = "2024-01-01";
const QUERY = `*[_type == "project"]|order(coalesce(order, 99) asc)`;

async function fromSanity(): Promise<Project[] | null> {
  if (!PROJECT_ID) return null;
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(QUERY)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: Project[] };
    return json.result?.length ? json.result : null;
  } catch {
    return null;
  }
}

export const DEFAULT_PROJECTS = SEED;

export async function getAllProjects(): Promise<Project[]> {
  const stored = await getJSON<Project[]>("projects");
  if (stored && stored.length) return stored;
  return (await fromSanity()) ?? SEED;
}

export async function setProjects(projects: Project[]): Promise<boolean> {
  return setJSON("projects", projects);
}

export async function getProject(slug: string): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) ?? null;
}
