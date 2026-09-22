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

// No client case studies yet — add real ones here (or via /studio) as they ship.
const SEED: Project[] = [];

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
