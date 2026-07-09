import { promises as fs } from "fs";
import path from "path";

/*
 * Tiny JSON persistence used by the Studio. Uses Vercel KV (Upstash REST) when
 * KV_REST_API_URL + KV_REST_API_TOKEN are set; otherwise writes to .data/*.json
 * on disk (works in local dev). On serverless prod without KV, writes won't
 * persist — set up KV for production editing.
 */
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const DIR = path.join(process.cwd(), ".data");

export async function getJSON<T>(key: string): Promise<T | null> {
  if (KV_URL && KV_TOKEN) {
    try {
      const r = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: "no-store",
      });
      if (!r.ok) return null;
      const j = (await r.json()) as { result: string | null };
      return j.result ? (JSON.parse(j.result) as T) : null;
    } catch {
      return null;
    }
  }
  try {
    const buf = await fs.readFile(path.join(DIR, `${key}.json`), "utf8");
    return JSON.parse(buf) as T;
  } catch {
    return null;
  }
}

export async function setJSON<T>(key: string, value: T): Promise<boolean> {
  const body = JSON.stringify(value);
  if (KV_URL && KV_TOKEN) {
    try {
      const r = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        body,
      });
      return r.ok;
    } catch {
      return false;
    }
  }
  try {
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(path.join(DIR, `${key}.json`), JSON.stringify(value, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}
