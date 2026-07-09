"use client";

import { useEffect, useState } from "react";
import type { SiteSettings, ThemeConfig } from "@/lib/studio";
import type { Product } from "@/lib/products";
import ThemePanel from "./panels/ThemePanel";
import BrandPanel from "./panels/BrandPanel";
import ProductsPanel from "./panels/ProductsPanel";

type Tab = "theme" | "brand" | "products";
const TABS: { id: Tab; label: string }[] = [
  { id: "theme", label: "Theme" },
  { id: "brand", label: "Brand & Copy" },
  { id: "products", label: "Products" },
];

export default function StudioApp({
  initialSettings,
  initialProducts,
}: {
  initialSettings: SiteSettings;
  initialProducts: Product[];
}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [tab, setTab] = useState<Tab>("theme");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  // live-preview the palette on the studio itself as you edit
  useEffect(() => {
    const el = document.documentElement;
    const t = settings.theme;
    const map: Record<string, string> = {
      "--c-warm": t.warm,
      "--c-coral": t.coral,
      "--c-pink": t.pink,
      "--c-blue": t.blue,
      "--c-violet": t.violet,
      "--c-mag": t.mag,
    };
    for (const [k, v] of Object.entries(map)) el.style.setProperty(k, v);
  }, [settings.theme]);

  // warn before leaving with unsaved edits
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const onTheme = (theme: ThemeConfig) => {
    setSettings((s) => ({ ...s, theme }));
    setDirty(true);
  };
  const onSettings = (v: SiteSettings) => {
    setSettings(v);
    setDirty(true);
  };
  const onProducts = (v: Product[]) => {
    setProducts(v);
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/studio/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings, products }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const logout = async () => {
    await fetch("/api/studio/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="st-app">
      <header className="st-topbar">
        <div className="st-topbrand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/plansio-logo.png" alt="" />
          <b>Studio</b>
          {dirty && <span className="st-dot" title="Unsaved changes" />}
        </div>

        <nav className="st-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`st-tab${tab === t.id ? " on" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="st-actions">
          <a className="st-btn st-btn-ghost" href="/" target="_blank" rel="noreferrer">
            View site ↗
          </a>
          <button className="st-btn st-btn-ghost" onClick={logout}>
            Log out
          </button>
          <button className="st-btn st-btn-solid" onClick={save} disabled={saving}>
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
          </button>
        </div>
      </header>

      <main className="st-main">
        {tab === "theme" && <ThemePanel value={settings.theme} onChange={onTheme} />}
        {tab === "brand" && <BrandPanel value={settings} onChange={onSettings} />}
        {tab === "products" && <ProductsPanel value={products} onChange={onProducts} />}
      </main>
    </div>
  );
}
