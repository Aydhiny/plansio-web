"use server";

export type ContactError = "empty" | "long" | "email" | "unconfigured" | "send" | "network";
export type ContactState = { ok?: boolean; error?: ContactError };

/*
 * Contact server action. Sends via the Resend REST API (no SDK dependency) when
 * RESEND_API_KEY is configured; otherwise it fails gracefully and points people
 * to the email address. Set RESEND_API_KEY and CONTACT_TO in the environment
 * (e.g. Vercel project settings) to activate delivery.
 */
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) return { error: "empty" };
  if (name.length > 120 || message.length > 4000) return { error: "long" };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "email" };

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "hello@plansio.studio";
  if (!key) return { error: "unconfigured" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Plansio Site <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `New project enquiry — ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
      cache: "no-store",
    });
    if (!res.ok) return { error: "send" };
    return { ok: true };
  } catch {
    return { error: "network" };
  }
}
