"use client";

import type { SiteSettings } from "@/lib/studio";
import s from "./BrandPanel.module.css";

/**
 * BrandPanel — edits the non-theme site settings: brand identity, homepage hero
 * copy, and social links.
 *
 * This is a fully *controlled* panel: it holds no local state and lifts every
 * keystroke up via `onChange`. Because SiteSettings is a nested object, each
 * update spreads a fresh object at every level it touches (`{ ...value, brand:
 * { ...value.brand, [field]: next } }`) so React sees a new reference and the
 * untouched branches — crucially `value.theme` — pass through unchanged. Mutating
 * the existing object in place would break change detection and could corrupt
 * the parent's state, so we never do that.
 */

const HERO_HELP = "Leave empty to use the default.";

export default function BrandPanel({
  value,
  onChange,
}: {
  value: SiteSettings;
  onChange: (v: SiteSettings) => void;
}) {
  function setBrand(field: keyof SiteSettings["brand"], next: string) {
    onChange({ ...value, brand: { ...value.brand, [field]: next } });
  }

  function setHero(field: keyof SiteSettings["hero"], next: string) {
    onChange({ ...value, hero: { ...value.hero, [field]: next } });
  }

  function setSocial(field: keyof SiteSettings["social"], next: string) {
    onChange({ ...value, social: { ...value.social, [field]: next } });
  }

  return (
    <div className={s.panel}>
      <header className={s.head}>
        <h2 className={s.title}>Brand &amp; Copy</h2>
        <p className={s.hint}>
          Identity, homepage hero copy, and social links.
        </p>
      </header>

      {/* ---- Brand ---- */}
      <section className={s.group}>
        <span className={s.groupLabel}>Brand</span>
        <div className={s.grid}>
          <label className={s.field}>
            <span className={s.fieldLabel}>Name</span>
            <input
              type="text"
              className={s.input}
              value={value.brand.name}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setBrand("name", e.target.value)}
            />
          </label>

          <label className={s.field}>
            <span className={s.fieldLabel}>Email</span>
            <input
              type="email"
              className={s.input}
              value={value.brand.email}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setBrand("email", e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* ---- Hero ---- */}
      <section className={s.group}>
        <span className={s.groupLabel}>Hero</span>

        <label className={s.field}>
          <span className={s.fieldLabel}>Headline</span>
          <input
            type="text"
            className={s.input}
            value={value.hero.headline}
            autoComplete="off"
            onChange={(e) => setHero("headline", e.target.value)}
          />
          <span className={s.note}>{HERO_HELP}</span>
        </label>

        <label className={s.field}>
          <span className={s.fieldLabel}>Subheading</span>
          <textarea
            className={s.textarea}
            value={value.hero.sub}
            rows={3}
            onChange={(e) => setHero("sub", e.target.value)}
          />
          <span className={s.note}>{HERO_HELP}</span>
        </label>
      </section>

      {/* ---- Social links ---- */}
      <section className={s.group}>
        <span className={s.groupLabel}>Social links</span>
        <div className={s.grid}>
          <label className={s.field}>
            <span className={s.fieldLabel}>Instagram</span>
            <input
              type="url"
              className={s.input}
              value={value.social.instagram}
              autoComplete="off"
              spellCheck={false}
              placeholder="https://"
              onChange={(e) => setSocial("instagram", e.target.value)}
            />
          </label>

          <label className={s.field}>
            <span className={s.fieldLabel}>LinkedIn</span>
            <input
              type="url"
              className={s.input}
              value={value.social.linkedin}
              autoComplete="off"
              spellCheck={false}
              placeholder="https://"
              onChange={(e) => setSocial("linkedin", e.target.value)}
            />
          </label>

          <label className={s.field}>
            <span className={s.fieldLabel}>Dribbble</span>
            <input
              type="url"
              className={s.input}
              value={value.social.dribbble}
              autoComplete="off"
              spellCheck={false}
              placeholder="https://"
              onChange={(e) => setSocial("dribbble", e.target.value)}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
