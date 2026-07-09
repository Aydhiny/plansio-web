"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import s from "./ProductsPanel.module.css";

/**
 * ProductsPanel — master/detail CRUD editor for the Studio products collection.
 *
 * Design notes:
 * - The panel is *fully controlled*: it never keeps a private copy of the list.
 *   Every mutation produces a brand-new array via `onChange`, so undo/redo and
 *   dirty-tracking in the parent stay honest (React can't miss a change).
 * - When patching a single product we ALWAYS spread the original first
 *   (`{ ...product, ...patch }`). That preserves optional/unknown fields
 *   (metrics, gallery, ...) that this UI doesn't render — dropping them would be
 *   silent data loss on save.
 * - Comma-separated array fields use a small local-draft component so the user
 *   can type spaces/trailing commas without the value snapping back mid-edit;
 *   we only lift a parsed string[] on each keystroke, not the raw text.
 */

type Localized = Product["category"];
type LocalizedKey = keyof Localized; // "en" | "bs"
type ProductFeature = Product["features"][number];

const STATUSES: Product["status"][] = ["live", "beta", "wip"];

const STATUS_LABEL: Record<Product["status"], string> = {
  live: "Live",
  beta: "Beta",
  wip: "WIP",
};

/** url-safe slug: lowercase, alphanumerics + single hyphens, no leading/trailing. */
function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Returns `base`, or `base-2`, `base-3`, … — the first not already taken. */
function uniqueSlug(base: string, taken: Set<string>): string {
  const root = base || "new-product";
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

function blankProduct(taken: Set<string>): Product {
  return {
    slug: uniqueSlug("new-product", taken),
    name: "New product",
    category: { en: "", bs: "" },
    tagline: { en: "", bs: "" },
    description: { en: "", bs: "" },
    url: "",
    liveEmbed: false,
    accent: "#f36844",
    year: String(new Date().getFullYear()),
    status: "wip",
    platforms: [],
    tech: [],
    features: [],
  };
}

export default function ProductsPanel({
  value,
  onChange,
}: {
  value: Product[];
  onChange: (v: Product[]) => void;
}) {
  // We track the *slug* of the selected product rather than its index: indices
  // shift when items are added/removed, but a slug stays pinned to its product.
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    value.length > 0 ? value[0].slug : null,
  );

  const selectedIndex = value.findIndex((p) => p.slug === selectedSlug);
  const selected = selectedIndex >= 0 ? value[selectedIndex] : null;

  function patchAt(index: number, patch: Partial<Product>) {
    const next = value.map((p, i) =>
      i === index ? { ...p, ...patch } : p,
    );
    // If the slug changed, keep the selection pointing at the same product.
    if (patch.slug !== undefined && index === selectedIndex) {
      setSelectedSlug(patch.slug);
    }
    onChange(next);
  }

  function removeAt(index: number) {
    const removed = value[index];
    const next = value.filter((_, i) => i !== index);
    onChange(next);
    if (removed.slug === selectedSlug) {
      // Move selection to a neighbour so the editor doesn't go blank abruptly.
      const fallback = next[index] ?? next[index - 1] ?? null;
      setSelectedSlug(fallback ? fallback.slug : null);
    }
  }

  function addProduct() {
    const taken = new Set(value.map((p) => p.slug));
    const created = blankProduct(taken);
    onChange([...value, created]);
    setSelectedSlug(created.slug);
  }

  return (
    <div className={s.panel}>
      <header className={s.head}>
        <div>
          <h2 className={s.title}>Products</h2>
          <p className={s.hint}>
            {value.length} {value.length === 1 ? "product" : "products"} in the
            collection.
          </p>
        </div>
        <button type="button" className={s.primary} onClick={addProduct}>
          + Add product
        </button>
      </header>

      <div className={s.layout}>
        {/* ---- master list ---- */}
        <div className={s.list}>
          {value.length === 0 ? (
            <div className={s.empty}>
              No products yet. Use “Add product” to create one.
            </div>
          ) : (
            value.map((product, index) => (
              <ProductCard
                key={product.slug || `idx-${index}`}
                product={product}
                active={product.slug === selectedSlug}
                onSelect={() => setSelectedSlug(product.slug)}
                onDelete={() => removeAt(index)}
              />
            ))
          )}
        </div>

        {/* ---- detail editor ---- */}
        <div className={s.detail}>
          {selected ? (
            <ProductEditor
              key={selected.slug || `edit-${selectedIndex}`}
              product={selected}
              siblings={value}
              index={selectedIndex}
              onPatch={(patch) => patchAt(selectedIndex, patch)}
            />
          ) : (
            <div className={s.detailEmpty}>
              Select a product to edit, or add a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ card ---- */

function ProductCard({
  product,
  active,
  onSelect,
  onDelete,
}: {
  product: Product;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`${s.card} ${active ? s.cardActive : ""}`}>
      <button type="button" className={s.cardMain} onClick={onSelect}>
        <span className={s.chip} style={{ background: product.accent }} aria-hidden="true" />
        <span className={s.cardText}>
          <span className={s.cardName}>{product.name || "Untitled"}</span>
          <span className={s.cardMeta}>{product.category.en || "—"}</span>
        </span>
        <span className={`${s.badge} ${s[`badge_${product.status}`]}`}>
          {STATUS_LABEL[product.status]}
        </span>
      </button>
      <div className={s.cardActions}>
        <button type="button" className={s.ghost} onClick={onSelect}>
          Edit
        </button>
        <button
          type="button"
          className={s.danger}
          onClick={onDelete}
          aria-label={`Delete ${product.name}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- editor ---- */

function ProductEditor({
  product,
  siblings,
  index,
  onPatch,
}: {
  product: Product;
  siblings: Product[];
  index: number;
  onPatch: (patch: Partial<Product>) => void;
}) {
  // Whether the user has hand-edited the slug. Until they do, editing the name
  // keeps the slug auto-synced; once they touch it, we stop clobbering it.
  const [slugTouched, setSlugTouched] = useState(false);

  // Reset the "touched" flag whenever we switch to a different product.
  useEffect(() => {
    setSlugTouched(false);
  }, [index]);

  function setLocalized(
    field: "category" | "tagline" | "description",
    key: LocalizedKey,
    text: string,
  ) {
    const current: Localized = product[field];
    onPatch({ [field]: { ...current, [key]: text } } as Partial<Product>);
  }

  function setName(name: string) {
    if (slugTouched) {
      onPatch({ name });
    } else {
      // Auto-suggest slug from the name until the user overrides it.
      onPatch({ name, slug: slugify(name) });
    }
  }

  function setSlug(raw: string) {
    setSlugTouched(true);
    onPatch({ slug: slugify(raw) });
  }

  const slugTaken = siblings.some(
    (p, i) => i !== index && p.slug === product.slug && product.slug !== "",
  );

  /* ---- features ---- */

  function addFeature() {
    const feature: ProductFeature = {
      title: { en: "", bs: "" },
      body: { en: "", bs: "" },
    };
    onPatch({ features: [...product.features, feature] });
  }

  function patchFeature(fi: number, patch: Partial<ProductFeature>) {
    const features = product.features.map((f, i) =>
      i === fi ? { ...f, ...patch } : f,
    );
    onPatch({ features });
  }

  function setFeatureLocalized(
    fi: number,
    field: "title" | "body",
    key: LocalizedKey,
    text: string,
  ) {
    const feature = product.features[fi];
    patchFeature(fi, { [field]: { ...feature[field], [key]: text } });
  }

  function removeFeature(fi: number) {
    onPatch({ features: product.features.filter((_, i) => i !== fi) });
  }

  return (
    <div className={s.editor}>
      <div className={s.editorHead}>
        <span
          className={s.editorChip}
          style={{ background: product.accent }}
          aria-hidden="true"
        />
        <h3 className={s.editorTitle}>{product.name || "Untitled"}</h3>
      </div>

      {/* identity */}
      <section className={s.section}>
        <div className={s.grid2}>
          <Field label="Name">
            <input
              type="text"
              className={s.input}
              value={product.name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Slug" error={slugTaken ? "Slug already in use" : undefined}>
            <input
              type="text"
              className={`${s.input} ${s.mono} ${slugTaken ? s.inputError : ""}`}
              value={product.slug}
              spellCheck={false}
              autoComplete="off"
              onChange={(e) => setSlug(e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* localized copy */}
      <section className={s.section}>
        <div className={s.grid2}>
          <Field label="Category (EN)">
            <input
              type="text"
              className={s.input}
              value={product.category.en}
              onChange={(e) => setLocalized("category", "en", e.target.value)}
            />
          </Field>
          <Field label="Category (BS)">
            <input
              type="text"
              className={s.input}
              value={product.category.bs}
              onChange={(e) => setLocalized("category", "bs", e.target.value)}
            />
          </Field>
          <Field label="Tagline (EN)">
            <input
              type="text"
              className={s.input}
              value={product.tagline.en}
              onChange={(e) => setLocalized("tagline", "en", e.target.value)}
            />
          </Field>
          <Field label="Tagline (BS)">
            <input
              type="text"
              className={s.input}
              value={product.tagline.bs}
              onChange={(e) => setLocalized("tagline", "bs", e.target.value)}
            />
          </Field>
        </div>
        <div className={s.grid2}>
          <Field label="Description (EN)">
            <textarea
              className={s.textarea}
              rows={4}
              value={product.description.en}
              onChange={(e) => setLocalized("description", "en", e.target.value)}
            />
          </Field>
          <Field label="Description (BS)">
            <textarea
              className={s.textarea}
              rows={4}
              value={product.description.bs}
              onChange={(e) => setLocalized("description", "bs", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* links + media */}
      <section className={s.section}>
        <div className={s.grid2}>
          <Field label="URL">
            <input
              type="url"
              className={`${s.input} ${s.mono}`}
              value={product.url}
              placeholder="https://…"
              onChange={(e) => onPatch({ url: e.target.value })}
            />
          </Field>
          <Field label="Poster">
            <input
              type="text"
              className={`${s.input} ${s.mono}`}
              value={product.poster ?? ""}
              placeholder="/images/poster.png"
              onChange={(e) => onPatch({ poster: e.target.value })}
            />
          </Field>
        </div>
      </section>

      {/* attributes */}
      <section className={s.section}>
        <div className={s.grid3}>
          <Field label="Accent">
            <div className={s.colorRow}>
              <span className={s.swatchWrap}>
                <input
                  type="color"
                  className={s.swatch}
                  value={/^#[0-9a-fA-F]{6}$/.test(product.accent) ? product.accent : "#000000"}
                  onChange={(e) => onPatch({ accent: e.target.value })}
                  aria-label="Accent color"
                />
              </span>
              <input
                type="text"
                className={`${s.input} ${s.mono}`}
                value={product.accent}
                spellCheck={false}
                maxLength={7}
                onChange={(e) => onPatch({ accent: e.target.value })}
                aria-label="Accent hex"
              />
            </div>
          </Field>
          <Field label="Year">
            <input
              type="text"
              className={s.input}
              value={product.year}
              onChange={(e) => onPatch({ year: e.target.value })}
            />
          </Field>
          <Field label="Status">
            <select
              className={s.select}
              value={product.status}
              onChange={(e) =>
                onPatch({ status: e.target.value as Product["status"] })
              }
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {STATUS_LABEL[st]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className={s.checkRow}>
          <label className={s.check}>
            <input
              type="checkbox"
              checked={product.liveEmbed}
              onChange={(e) => onPatch({ liveEmbed: e.target.checked })}
            />
            <span>Live embed</span>
          </label>
          <label className={s.check}>
            <input
              type="checkbox"
              checked={product.featured ?? false}
              onChange={(e) => onPatch({ featured: e.target.checked })}
            />
            <span>Featured</span>
          </label>
        </div>
      </section>

      {/* collections */}
      <section className={s.section}>
        <CsvField
          label="Platforms"
          items={product.platforms}
          onItems={(platforms) => onPatch({ platforms })}
        />
        <CsvField
          label="Tech"
          items={product.tech}
          onItems={(tech) => onPatch({ tech })}
        />
        <CsvField
          label="Related (slugs)"
          items={product.related ?? []}
          onItems={(related) => onPatch({ related })}
        />
      </section>

      {/* features */}
      <section className={s.section}>
        <div className={s.sectionHead}>
          <span className={s.label}>Features</span>
          <button type="button" className={s.ghost} onClick={addFeature}>
            + Add feature
          </button>
        </div>

        {product.features.length === 0 ? (
          <div className={s.subEmpty}>No features yet.</div>
        ) : (
          <div className={s.features}>
            {product.features.map((feature, fi) => (
              <div className={s.feature} key={fi}>
                <div className={s.featureHead}>
                  <span className={s.featureIndex}>#{fi + 1}</span>
                  <button
                    type="button"
                    className={s.danger}
                    onClick={() => removeFeature(fi)}
                  >
                    Remove
                  </button>
                </div>
                <div className={s.grid2}>
                  <Field label="Title (EN)">
                    <input
                      type="text"
                      className={s.input}
                      value={feature.title.en}
                      onChange={(e) =>
                        setFeatureLocalized(fi, "title", "en", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Title (BS)">
                    <input
                      type="text"
                      className={s.input}
                      value={feature.title.bs}
                      onChange={(e) =>
                        setFeatureLocalized(fi, "title", "bs", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Body (EN)">
                    <textarea
                      className={s.textarea}
                      rows={2}
                      value={feature.body.en}
                      onChange={(e) =>
                        setFeatureLocalized(fi, "body", "en", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Body (BS)">
                    <textarea
                      className={s.textarea}
                      rows={2}
                      value={feature.body.bs}
                      onChange={(e) =>
                        setFeatureLocalized(fi, "body", "bs", e.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* --------------------------------------------------------------- helpers ---- */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      {children}
      {error ? <span className={s.fieldError}>{error}</span> : null}
    </label>
  );
}

/**
 * CsvField — edits a string[] through a comma-separated text box.
 *
 * It holds a local *draft string* so the user can type "a, b, " freely; the
 * parsed array is lifted on every keystroke, but the visible text is never
 * reformatted mid-edit. When the underlying array changes from outside (e.g.
 * switching products), the effect resyncs the draft from props.
 */
function CsvField({
  label,
  items,
  onItems,
}: {
  label: string;
  items: string[];
  onItems: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState(items.join(", "));

  useEffect(() => {
    setDraft(items.join(", "));
    // Only resync when the *content* of the array changes from the outside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.join(" ")]);

  function onText(raw: string) {
    setDraft(raw);
    const parsed = raw
      .split(",")
      .map((piece: string) => piece.trim())
      .filter((piece: string) => piece.length > 0);
    onItems(parsed);
  }

  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      <input
        type="text"
        className={s.input}
        value={draft}
        spellCheck={false}
        autoComplete="off"
        placeholder="comma, separated, values"
        onChange={(e) => onText(e.target.value)}
      />
    </label>
  );
}
