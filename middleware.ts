import { NextRequest, NextResponse } from "next/server";

const COOKIE = "NEXT_LOCALE";

/*
 * On first visit, stamp a locale cookie based on the visitor's region so the
 * choice persists across pages. Bosnia (BA) — or a bs/hr/sr Accept-Language —
 * gets Bosnian; everyone else English. A manual switch overwrites this cookie.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (!req.cookies.get(COOKIE)) {
    const country = (req.headers.get("x-vercel-ip-country") || "").toUpperCase();
    const accept = req.headers.get("accept-language") || "";
    const locale = country === "BA" || /\b(bs|hr|sr)\b/i.test(accept) ? "bs" : "en";
    res.cookies.set(COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next|assets|.*\\.).*)"],
};
