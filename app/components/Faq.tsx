"use client";

import { useId, useState, type KeyboardEvent } from "react";
import s from "./Faq.module.css";

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  // Track open rows by index in a Set — allows multiple open at once.
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  // Stable, SSR-safe id prefix so header/region ids match between server and client.
  const baseId = useId();

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <ul className={s.faq}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const headerId = `${baseId}-h-${i}`;
        const panelId = `${baseId}-p-${i}`;

        const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
          // Space/Enter are native on <button>; this is here only to keep
          // the handler strictly typed and future-proof for extra keys.
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggle(i);
          }
        };

        return (
          <li className={s.row} key={item.q}>
            <h3 className={s.head}>
              <button
                type="button"
                id={headerId}
                className={s.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                onKeyDown={onKeyDown}
              >
                <span className={s.q}>{item.q}</span>
                <span className={s.icon} aria-hidden="true" data-open={isOpen}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={s.region}
              data-open={isOpen}
            >
              <div className={s.regionInner}>
                <p className={s.a}>{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
