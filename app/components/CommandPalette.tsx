"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import s from "./CommandPalette.module.css";

type Item = { label: string; href: string; hint?: string };

export default function CommandPalette({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [active, setActive] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // Case-insensitive substring filter over labels.
  const results = useMemo<Item[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it: Item) => it.label.toLowerCase().includes(q));
  }, [items, query]);

  const close = useCallback((): void => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const navigate = useCallback(
    (item: Item): void => {
      if (item.href.startsWith("http")) {
        window.open(item.href, "_blank");
      } else {
        window.location.assign(item.href);
      }
      close();
    },
    [close],
  );

  // Global shortcut: Cmd+K (mac) / Ctrl+K toggles the palette.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((prev: boolean) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock body scroll and focus the input while open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      root.style.overflow = previous;
      cancelAnimationFrame(raf);
    };
  }, [open]);

  // Keep the active index in range as results change.
  useEffect(() => {
    setActive((prev: number) => {
      if (results.length === 0) return 0;
      return Math.min(prev, results.length - 1);
    });
  }, [results.length]);

  // Ensure the highlighted row stays visible in the scroll container.
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const row = list.children[active] as HTMLElement | undefined;
    row?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onModalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((prev: number) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((prev: number) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) navigate(item);
    }
  };

  const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Only close when the backdrop itself (not the panel) is pressed.
    if (e.target === e.currentTarget) close();
  };

  if (!open) return null;

  return (
    <div
      className={s.backdrop}
      onMouseDown={onBackdropMouseDown}
      onKeyDown={onModalKeyDown}
    >
      <div
        className={s.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className={s.searchRow}>
          <input
            ref={inputRef}
            className={s.input}
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            placeholder="Search…"
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={s.kbd}>⌘K</kbd>
        </div>

        <ul
          ref={listRef}
          className={s.results}
          role="listbox"
          aria-label="Results"
        >
          {results.length === 0 ? (
            <li className={s.empty}>No results</li>
          ) : (
            results.map((item: Item, i: number) => {
              const isActive = i === active;
              return (
                <li
                  key={`${item.href}-${i}`}
                  className={`${s.row} ${isActive ? s.rowActive : ""}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => navigate(item)}
                >
                  <span className={s.label}>{item.label}</span>
                  {item.hint ? (
                    <span className={s.hint}>{item.hint}</span>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
