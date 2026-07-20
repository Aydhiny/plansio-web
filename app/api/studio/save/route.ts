import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { setSettings, type SiteSettings } from "@/lib/studio";
import { setProducts, type Product } from "@/lib/products";
import { setPosts, type Post } from "@/lib/blog";

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => null)) as
    | { settings?: SiteSettings; products?: Product[]; posts?: Post[] }
    | null;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  const okS = body.settings ? await setSettings(body.settings) : true;
  const okP = body.products ? await setProducts(body.products) : true;
  const okB = body.posts ? await setPosts(body.posts) : true;

  // refresh cached site content
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: okS && okP && okB });
}
