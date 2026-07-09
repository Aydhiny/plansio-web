import { getJSON, setJSON } from "./store";

/*
 * Editable site settings (theme, brand, hero, social). Products live separately
 * in lib/products. The Studio reads/writes these; the site merges them over the
 * built-in defaults, so an empty/unset field always falls back gracefully.
 */
export interface ThemeConfig {
  warm: string;
  coral: string;
  pink: string;
  blue: string;
  violet: string;
  mag: string;
}

export interface SiteSettings {
  theme: ThemeConfig;
  brand: { name: string; email: string };
  hero: { headline: string; sub: string };
  social: { instagram: string; linkedin: string; dribbble: string };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  theme: {
    warm: "#f7b231",
    coral: "#f36844",
    pink: "#d93d72",
    blue: "#2a3bed",
    violet: "#6a22d8",
    mag: "#b81fc4",
  },
  brand: { name: "Plansio", email: "hello@plansio.studio" },
  hero: { headline: "", sub: "" },
  social: { instagram: "", linkedin: "", dribbble: "" },
};

const KEY = "settings";

export async function getSettings(): Promise<SiteSettings> {
  const saved = await getJSON<Partial<SiteSettings>>(KEY);
  if (!saved) return DEFAULT_SETTINGS;
  // deep-merge so newly-added fields keep their defaults
  return {
    theme: { ...DEFAULT_SETTINGS.theme, ...(saved.theme || {}) },
    brand: { ...DEFAULT_SETTINGS.brand, ...(saved.brand || {}) },
    hero: { ...DEFAULT_SETTINGS.hero, ...(saved.hero || {}) },
    social: { ...DEFAULT_SETTINGS.social, ...(saved.social || {}) },
  };
}

export async function setSettings(value: SiteSettings): Promise<boolean> {
  return setJSON(KEY, value);
}
