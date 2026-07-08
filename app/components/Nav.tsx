"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#studio", label: "Studio" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // lock page scroll while the mobile menu is open, and close on Esc / desktop resize
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
      <a className="brand" href="#top" onClick={() => setOpen(false)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/plansio-logo.png" alt="" />
        <span className="wm">
          <em>Plansio</em>
        </span>
      </a>

      <div className="nav-r">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <a className="btn solid" href="#contact">
          <span>Start a project</span>
        </a>
      </div>

      <button
        className={`nav-burger${open ? " open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
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
          {LINKS.map((l, i) => (
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
            href="#contact"
            style={{ transitionDelay: `${0.06 * LINKS.length + 0.05}s` }}
            onClick={() => setOpen(false)}
          >
            <span>Start a project</span> <span className="ar">↗</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
