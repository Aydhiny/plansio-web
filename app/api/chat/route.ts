import { NextResponse } from "next/server";
import { getAllProducts, t } from "@/lib/products";

type Msg = { role: "user" | "assistant"; content: string };

const FALLBACK =
  "The live assistant isn't switched on yet — but a real person will get back to you fast. Drop us a line at hello@plansio.studio or use the contact form. What are you building?";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { messages?: Msg[]; locale?: string } | null;
  const incoming = Array.isArray(body?.messages) ? body!.messages : [];
  const locale = body?.locale === "bs" ? "bs" : "en";

  // sanitize: keep last ~12 turns, valid roles, string content, capped length
  const messages: Msg[] = incoming
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ reply: "…" });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ reply: FALLBACK });

  const products = await getAllProducts();
  const productList = products
    .map((p) => `- ${p.name} (${t(p.category, locale)}): ${t(p.tagline, locale)} — ${p.url}`)
    .join("\n");

  const system = `You are the concierge for Plansio, a full-stack studio doing marketing, design, software and games. Voice: warm, concise, confident, no fluff. Reply in ${
    locale === "bs" ? "Bosnian" : "English"
  } (or mirror the user's language). Help visitors understand the studio and pick the right engagement. Pricing tiers: Spark $2.4k/project (one focused deliverable), Studio $6.8k/month (dedicated team, retainer), Scale custom (full-stack partnership). To start a project, point them to the contact form on the page or hello@plansio.studio. Never invent services, clients, prices or facts beyond these. Keep replies under ~90 words.\n\nOur products:\n${productList}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system,
        messages,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ reply: "I hit a snag there — try again, or email hello@plansio.studio." });
    }
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const reply = data.content?.find((c) => c.type === "text")?.text?.trim() || "…";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Network hiccup — try again in a moment, or email hello@plansio.studio." });
  }
}
