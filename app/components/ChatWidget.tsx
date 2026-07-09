"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "../i18n";

type ChatDict = Dict["chat"];
type Msg = { role: "user" | "assistant"; content: string };

/*
 * Bottom-right AI concierge. A "Pick me!" teaser pops in after a beat; opening
 * shows the localized intro lines, then a real conversation powered by /api/chat
 * (Claude). With no ANTHROPIC_API_KEY the API returns a friendly fallback, so it
 * always works.
 */
export default function ChatWidget({ d }: { d: ChatDict }) {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => d.msgs.map((m) => ({ role: "assistant" as const, content: m })));
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) return;
    const t = window.setTimeout(() => setTeaser(true), 4200);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, pending, open]);

  const openPanel = () => {
    setOpen(true);
    setTeaser(false);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    const locale = typeof document !== "undefined" ? document.documentElement.lang : "en";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // don't resend the canned intro lines as history
        body: JSON.stringify({ messages: next.slice(d.msgs.length), locale }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "…" }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Try again in a moment, or email hello@plansio.studio." }]);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={`chat${open ? " open" : ""}`}>
      {!open && teaser && (
        <button className="chat-teaser" onClick={openPanel}>
          <span className="chat-wave" aria-hidden="true">👋</span> {d.teaser}
        </button>
      )}

      <div className="chat-panel" role="dialog" aria-label="Plansio" aria-hidden={!open}>
        <div className="chat-head">
          <span className="chat-ava" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/plansio-logo.png" alt="" />
          </span>
          <div className="chat-id">
            <strong>Plansio</strong>
            <em>{d.subtitle}</em>
          </div>
          <button className="chat-x" onClick={() => setOpen(false)} aria-label={d.close}>
            ✕
          </button>
        </div>
        <div className="chat-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div className={`chat-msg${m.role === "user" ? " me" : ""}`} key={i}>
              {m.content}
            </div>
          ))}
          {pending && (
            <div className="chat-msg chat-typing" aria-label="Typing">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
        <form className="chat-input" onSubmit={send}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={d.placeholder}
            aria-label={d.placeholder}
          />
          <button type="submit" className="chat-send" aria-label="Send" disabled={pending}>
            ↗
          </button>
        </form>
      </div>

      <button
        className="chat-fab"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label={open ? d.close : d.open}
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
