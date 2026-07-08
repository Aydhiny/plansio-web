"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "../actions";

const initial: ContactState = {};

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);

  if (state.ok) {
    return <p className="form-ok">Thanks — your message is on its way. We&apos;ll be in touch shortly.</p>;
  }

  return (
    <form className="contact" action={action}>
      <div className="contact-row">
        <input name="name" placeholder="Your name" aria-label="Your name" autoComplete="name" required />
        <input name="email" type="email" placeholder="Email" aria-label="Email" autoComplete="email" required />
      </div>
      <textarea name="message" placeholder="What are you building?" aria-label="Message" rows={4} required />
      {state.error && (
        <p className="form-err" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn solid" type="submit" disabled={pending}>
        <span>{pending ? "Sending…" : "Send it over"}</span> <span className="ar">↗</span>
      </button>
    </form>
  );
}
