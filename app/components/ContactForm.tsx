"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "../actions";
import type { Dict } from "../i18n";

const initial: ContactState = {};

export default function ContactForm({ d }: { d: Dict }) {
  const c = d.cta;
  const [state, action, pending] = useActionState(sendContact, initial);

  if (state.ok) return <p className="form-ok">{c.ok}</p>;

  return (
    <form className="contact" action={action}>
      {/* honeypot — hidden from real users, catches bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp-field"
      />
      <div className="contact-row">
        <input name="name" placeholder={c.name} aria-label={c.name} autoComplete="name" required />
        <input name="email" type="email" placeholder={c.email} aria-label={c.email} autoComplete="email" required />
      </div>
      <textarea name="message" placeholder={c.message} aria-label={c.message} rows={4} required />
      {state.error && (
        <p className="form-err" role="alert">
          {c.errors[state.error]}
        </p>
      )}
      <button className="btn solid" type="submit" disabled={pending}>
        <span>{pending ? c.sending : c.send}</span> <span className="ar">↗</span>
      </button>
    </form>
  );
}
