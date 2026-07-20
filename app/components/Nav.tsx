"use client";

import { useEffect, useState } from "react";
import type { Dict, Locale } from "../i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Nav({ d, locale, brand = "Plansio" }: { d: Dict; locale: Locale; brand?: string }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/#work", label: d.nav.work },
    { href: "/products", label: d.nav.products },
    { href: "/blog", label: d.nav.blog },
    { href: "/#pricing", label: d.nav.pricing },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 760 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <nav className="nav" id="nav">
      <a className="brand" href="/" onClick={() => setOpen(false)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/plansio-logo.png" alt="" />
        <span className="wm">
          <em>{brand}</em>
        </span>
      </a>

      <div className="nav-r">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <LanguageSwitcher locale={locale} />
        <a className="btn solid" href="/#contact">
          <span>{d.nav.start}</span>
        </a>
      </div>

      <button
        className={`nav-burger${open ? " open" : ""}`}
        aria-label={open ? d.nav.close : d.nav.open}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div id="mobile-menu" className={`nav-menu${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="nav-menu-inner">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              style={{ transitionDelay: `${0.06 * i + 0.05}s` }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            className="btn solid"
            href="/#contact"
            style={{ transitionDelay: `${0.06 * links.length + 0.05}s` }}
            onClick={() => setOpen(false)}
          >
            <span>{d.nav.start}</span> <span className="ar">↗</span>
          </a>
          <div style={{ transitionDelay: `${0.06 * (links.length + 1) + 0.05}s` }}>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
    </nav>
  );
}
