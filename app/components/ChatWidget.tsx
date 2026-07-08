"use client";

import { useEffect, useState } from "react";

const EMAIL = "hello@plansio.studio";

/*
 * Small playful chat launcher, bottom-right. A "Pick me!" teaser pops in after
 * a beat; clicking opens a compact on-brand panel with a few canned lines and a
 * message box that hands off to email. Pure client island, no backend.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (open) return;
    const t = window.setTimeout(() => setTeaser(true), 4200);
    return () => clearTimeout(t);
  }, [open]);

  const openPanel = () => {
    setOpen(true);
    setTeaser(false);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(msg.trim() || "Hi Plansio — I'd like to start a project.");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("New project")}&body=${body}`;
  };

  return (
    <div className={`chat${open ? " open" : ""}`}>
      {!open && teaser && (
        <button className="chat-teaser" onClick={openPanel}>
          <span className="chat-wave" aria-hidden="true">👋</span> Pick me!
        </button>
      )}

      <div className="chat-panel" role="dialog" aria-label="Chat with Plansio" aria-hidden={!open}>
        <div className="chat-head">
          <span className="chat-ava" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/plansio-logo.png" alt="" />
          </span>
          <div className="chat-id">
            <strong>Plansio</strong>
            <em>marketing · design · software</em>
          </div>
          <button className="chat-x" onClick={() => setOpen(false)} aria-label="Close chat">
            ✕
          </button>
        </div>
        <div className="chat-body">
          <div className="chat-msg">Hey 👋</div>
          <div className="chat-msg">
            Pick us and you get marketing, design and code from one team — no handoffs, no five-agency chaos.
          </div>
          <div className="chat-msg">So… what are you building?</div>
        </div>
        <form className="chat-input" onSubmit={send}>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Tell us what you're making…"
            aria-label="Your message"
          />
          <button type="submit" className="chat-send" aria-label="Send">
            ↗
          </button>
        </form>
      </div>

      <button
        className="chat-fab"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
      >
        <svg className="chat-fab-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v7c0 1.38-1.12 2.5-2.5 2.5H10l-4.2 3.5c-.66.55-1.66.08-1.66-.77V6.5Z"
            fill="currentColor"
          />
        </svg>
        <span className="chat-fab-x" aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
