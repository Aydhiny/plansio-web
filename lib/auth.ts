import { cookies } from "next/headers";
import { createHash } from "crypto";

/*
 * Minimal password gate for the Studio. Set STUDIO_PASSWORD (and ideally
 * STUDIO_SECRET) in the environment. The session cookie stores a hash derived
 * from the password + secret, so it can't be forged without knowing them.
 */
const PASSWORD = process.env.STUDIO_PASSWORD || "plansio";
const SECRET = process.env.STUDIO_SECRET || "plansio-studio-secret-change-me";
export const SESSION_COOKIE = "studio_session";

export function sessionToken(): string {
  return createHash("sha256").update(`${PASSWORD}:${SECRET}`).digest("hex");
}

export function checkPassword(pw: string): boolean {
  return typeof pw === "string" && pw.length > 0 && pw === PASSWORD;
}

export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  return c.get(SESSION_COOKIE)?.value === sessionToken();
}
