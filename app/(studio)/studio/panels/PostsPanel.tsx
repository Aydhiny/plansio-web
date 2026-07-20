"use client";

import { useEffect, useState } from "react";
import type { Post, Block, Localized, Author } from "@/lib/blog";
import s from "./ProductsPanel.module.css"; // reuse the products editor styling verbatim
import x from "./PostsPanel.module.css"; // block-editor–specific extras

/**
 * PostsPanel — master/detail CRUD editor for the blog, wired to the same Studio
 * save pipeline as products (parent lifts state → /api/studio/save → store).
 *
 * Same discipline as ProductsPanel: fully controlled (no private list copy),
 * every mutation returns a fresh array, and single-item patches spread the
 * original first so optional/unknown fields survive a save.
 *
 * The article body is a typed Block[] (discriminated union). Editing a union in
 * a form is the fiddly part — we branch on `block.type` and only ever hand back
 * a whole new block, so the union stays valid at every keystroke.
 */

type LocalizedKey = keyof Localized; // "en" | "bs"

const BLOCK_TYPES: { type: Block["type"]; label: string }[] = [
  { type: "p", label: "Paragraph" },
  { type: "h2", label: "Heading" },
  { type: "h3", label: "Subheading" },
  { type: "quote", label: "Quote" },
  { type: "list", label: "List" },
  { type: "code", label: "Code" },
  { type: "image", label: "Image" },
];

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(base: string, taken: Set<string>): string {
  const root = base || "new-post";
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

function isoToday(): string {
  // Locale-independent YYYY-MM-DD for the <input type="date"> default.
  return new Date().toISOString().slice(0, 10);
}

function blankBlock(type: Block["type"]): Block {
  switch (type) {
    case "p":
    case "h2":
    case "h3":
      return { type, text: { en: "", bs: "" } };
    case "quote":
      return { type, text: { en: "", bs: "" }, cite: "" };
    case "list":
      return { type, items: [{ en: "", bs: "" }] };
    case "code":
      return { type, lang: "ts", code: "" };
    case "image":
      return { type, src: "", alt: { en: "", bs: "" } };
  }
}

function blankPost(taken: Set<string>): Post {
  return {
    slug: uniqueSlug("new-post", taken),
    title: { en: "New post", bs: "Novi članak" },
    excerpt: { en: "", bs: "" },
    category: { en: "", bs: "" },
    accent: "#6a22d8",
    date: isoToday(),
    author: { name: "Plansio Studio", role: { en: "", bs: "" } },
    tags: [],
    body: [{ type: "p", text: { en: "", bs: "" } }],
  };
}

export default function PostsPanel({ value, onChange }: { value: Post[]; onChange: (v: Post[]) => void }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(value.length > 0 ? value[0].slug : null);

  const selectedIndex = value.findIndex((p) => p.slug === selectedSlug);
  const selected = selectedIndex >= 0 ? value[selectedIndex] : null;

  function patchAt(index: number, patch: Partial<Post>) {
    const next = value.map((p, i) => (i === index ? { ...p, ...patch } : p));
    if (patch.slug !== undefined && index === selectedIndex) setSelectedSlug(patch.slug);
    onChange(next);
  }

  function removeAt(index: number) {
    const removed = value[index];
    const next = value.filter((_, i) => i !== index);
    onChange(next);
    if (removed.slug === selectedSlug) {
      const fallback = next[index] ?? next[index - 1] ?? null;
      setSelectedSlug(fallback ? fallback.slug : null);
    }
  }

  function addPost() {
    const taken = new Set(value.map((p) => p.slug));
    const created = blankPost(taken);
    onChange([created, ...value]); // newest first — matches the site's sort
    setSelectedSlug(created.slug);
  }

  return (
    <div className={s.panel}>
      <header className={s.head}>
        <div>
          <h2 className={s.title}>Blog</h2>
          <p className={s.hint}>
            {value.length} {value.length === 1 ? "article" : "articles"}. Edits publish on save.
          </p>
        </div>
        <button type="button" className={s.primary} onClick={addPost}>
          + Add article
        </button>
      </header>

      <div className={s.layout}>
        <div className={s.list}>
          {value.length === 0 ? (
            <div className={s.empty}>No articles yet. Use “Add article” to write one.</div>
          ) : (
            value.map((post, index) => (
              <PostCard
                key={post.slug || `idx-${index}`}
                post={post}
                active={post.slug === selectedSlug}
                onSelect={() => setSelectedSlug(post.slug)}
                onDelete={() => removeAt(index)}
              />
            ))
          )}
        </div>

        <div className={s.detail}>
          {selected ? (
            <PostEditor
              key={selected.slug || `edit-${selectedIndex}`}
              post={selected}
              siblings={value}
              index={selectedIndex}
              onPatch={(patch) => patchAt(selectedIndex, patch)}
            />
          ) : (
            <div className={s.detailEmpty}>Select an article to edit, or add a new one.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ card ---- */

function PostCard({
  post,
  active,
  onSelect,
  onDelete,
}: {
  post: Post;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`${s.card} ${active ? s.cardActive : ""}`}>
      <button type="button" className={s.cardMain} onClick={onSelect}>
        <span className={s.chip} style={{ background: post.accent }} aria-hidden="true" />
        <span className={s.cardText}>
          <span className={s.cardName}>{post.title.en || "Untitled"}</span>
          <span className={s.cardMeta}>
            {post.category.en || "—"} · {post.date}
          </span>
        </span>
        {post.featured ? <span className={`${s.badge} ${s.badge_live}`}>Featured</span> : null}
      </button>
      <div className={s.cardActions}>
        <button type="button" className={s.ghost} onClick={onSelect}>
          Edit
        </button>
        <button type="button" className={s.danger} onClick={onDelete} aria-label={`Delete ${post.title.en}`}>
          Delete
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- editor ---- */

function PostEditor({
  post,
  siblings,
  index,
  onPatch,
}: {
  post: Post;
  siblings: Post[];
  index: number;
  onPatch: (patch: Partial<Post>) => void;
}) {
  const [slugTouched, setSlugTouched] = useState(false);
  useEffect(() => setSlugTouched(false), [index]);

  function setLocalized(field: "title" | "excerpt" | "category", key: LocalizedKey, text: string) {
    onPatch({ [field]: { ...post[field], [key]: text } } as Partial<Post>);
  }

  function setTitle(key: LocalizedKey, text: string) {
    const title = { ...post.title, [key]: text };
    if (key === "en" && !slugTouched) onPatch({ title, slug: slugify(text) });
    else onPatch({ title });
  }

  function setAuthor(patch: Partial<Author>) {
    onPatch({ author: { ...post.author, ...patch } });
  }

  const slugTaken = siblings.some((p, i) => i !== index && p.slug === post.slug && post.slug !== "");

  /* ---- block ops ---- */
  function addBlock(type: Block["type"]) {
    onPatch({ body: [...post.body, blankBlock(type)] });
  }
  function patchBlock(bi: number, next: Block) {
    onPatch({ body: post.body.map((b, i) => (i === bi ? next : b)) });
  }
  function removeBlock(bi: number) {
    onPatch({ body: post.body.filter((_, i) => i !== bi) });
  }
  function moveBlock(bi: number, dir: -1 | 1) {
    const target = bi + dir;
    if (target < 0 || target >= post.body.length) return;
    const body = [...post.body];
    [body[bi], body[target]] = [body[target], body[bi]];
    onPatch({ body });
  }

  return (
    <div className={s.editor}>
      <div className={s.editorHead}>
        <span className={s.editorChip} style={{ background: post.accent }} aria-hidden="true" />
        <h3 className={s.editorTitle}>{post.title.en || "Untitled"}</h3>
      </div>

      {/* identity */}
      <section className={s.section}>
        <div className={s.grid2}>
          <Field label="Title (EN)">
            <input className={s.input} value={post.title.en} onChange={(e) => setTitle("en", e.target.value)} />
          </Field>
          <Field label="Title (BS)">
            <input className={s.input} value={post.title.bs} onChange={(e) => setTitle("bs", e.target.value)} />
          </Field>
          <Field label="Slug" error={slugTaken ? "Slug already in use" : undefined}>
            <input
              className={`${s.input} ${s.mono} ${slugTaken ? s.inputError : ""}`}
              value={post.slug}
              spellCheck={false}
              autoComplete="off"
              onChange={(e) => {
                setSlugTouched(true);
                onPatch({ slug: slugify(e.target.value) });
              }}
            />
          </Field>
          <Field label="Date">
            <input type="date" className={`${s.input} ${s.mono}`} value={post.date} onChange={(e) => onPatch({ date: e.target.value })} />
          </Field>
        </div>
      </section>

      {/* copy */}
      <section className={s.section}>
        <div className={s.grid2}>
          <Field label="Category (EN)">
            <input className={s.input} value={post.category.en} onChange={(e) => setLocalized("category", "en", e.target.value)} />
          </Field>
          <Field label="Category (BS)">
            <input className={s.input} value={post.category.bs} onChange={(e) => setLocalized("category", "bs", e.target.value)} />
          </Field>
          <Field label="Excerpt (EN)">
            <textarea className={s.textarea} rows={3} value={post.excerpt.en} onChange={(e) => setLocalized("excerpt", "en", e.target.value)} />
          </Field>
          <Field label="Excerpt (BS)">
            <textarea className={s.textarea} rows={3} value={post.excerpt.bs} onChange={(e) => setLocalized("excerpt", "bs", e.target.value)} />
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
                  value={/^#[0-9a-fA-F]{6}$/.test(post.accent) ? post.accent : "#000000"}
                  onChange={(e) => onPatch({ accent: e.target.value })}
                  aria-label="Accent color"
                />
              </span>
              <input
                className={`${s.input} ${s.mono}`}
                value={post.accent}
                spellCheck={false}
                maxLength={7}
                onChange={(e) => onPatch({ accent: e.target.value })}
                aria-label="Accent hex"
              />
            </div>
          </Field>
          <Field label="Cover image">
            <input className={`${s.input} ${s.mono}`} value={post.cover ?? ""} placeholder="/images/cover.png" onChange={(e) => onPatch({ cover: e.target.value })} />
          </Field>
          <Field label="Featured">
            <label className={s.check} style={{ paddingTop: 8 }}>
              <input type="checkbox" checked={post.featured ?? false} onChange={(e) => onPatch({ featured: e.target.checked })} />
              <span>Show as lead</span>
            </label>
          </Field>
        </div>
      </section>

      {/* author */}
      <section className={s.section}>
        <div className={s.grid3}>
          <Field label="Author name">
            <input className={s.input} value={post.author.name} onChange={(e) => setAuthor({ name: e.target.value })} />
          </Field>
          <Field label="Author role (EN)">
            <input className={s.input} value={post.author.role.en} onChange={(e) => setAuthor({ role: { ...post.author.role, en: e.target.value } })} />
          </Field>
          <Field label="Author role (BS)">
            <input className={s.input} value={post.author.role.bs} onChange={(e) => setAuthor({ role: { ...post.author.role, bs: e.target.value } })} />
          </Field>
        </div>
      </section>

      {/* collections */}
      <section className={s.section}>
        <CsvField label="Tags" items={post.tags} onItems={(tags) => onPatch({ tags })} />
        <CsvField label="Related (slugs)" items={post.related ?? []} onItems={(related) => onPatch({ related })} />
      </section>

      {/* body blocks */}
      <section className={s.section}>
        <div className={s.sectionHead}>
          <span className={s.label}>Article body</span>
          <span className={s.hint}>{post.body.length} blocks</span>
        </div>

        {post.body.length === 0 ? (
          <div className={s.subEmpty}>No content yet — add a block below.</div>
        ) : (
          <div className={x.blocks}>
            {post.body.map((block, bi) => (
              <BlockEditor
                key={bi}
                block={block}
                index={bi}
                count={post.body.length}
                onChange={(next) => patchBlock(bi, next)}
                onRemove={() => removeBlock(bi)}
                onMove={(dir) => moveBlock(bi, dir)}
              />
            ))}
          </div>
        )}

        <div className={x.addBar}>
          <span className={x.addLabel}>Add block:</span>
          {BLOCK_TYPES.map((bt) => (
            <button key={bt.type} type="button" className={s.ghost} onClick={() => addBlock(bt.type)}>
              + {bt.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ----------------------------------------------------------- block editor ---- */

function BlockEditor({
  block,
  index,
  count,
  onChange,
  onRemove,
  onMove,
}: {
  block: Block;
  index: number;
  count: number;
  onChange: (b: Block) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const typeLabel = BLOCK_TYPES.find((t) => t.type === block.type)?.label ?? block.type;

  return (
    <div className={x.block}>
      <div className={x.blockHead}>
        <span className={x.blockType}>{typeLabel}</span>
        <div className={x.blockActions}>
          <button type="button" className={x.iconBtn} onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up">
            ↑
          </button>
          <button type="button" className={x.iconBtn} onClick={() => onMove(1)} disabled={index === count - 1} aria-label="Move down">
            ↓
          </button>
          <button type="button" className={s.danger} onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>

      <BlockFields block={block} onChange={onChange} />
    </div>
  );
}

function BlockFields({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  switch (block.type) {
    case "p":
    case "h2":
    case "h3":
      return (
        <div className={s.grid2}>
          <Field label="Text (EN)">
            <textarea className={s.textarea} rows={3} value={block.text.en} onChange={(e) => onChange({ ...block, text: { ...block.text, en: e.target.value } })} />
          </Field>
          <Field label="Text (BS)">
            <textarea className={s.textarea} rows={3} value={block.text.bs} onChange={(e) => onChange({ ...block, text: { ...block.text, bs: e.target.value } })} />
          </Field>
        </div>
      );
    case "quote":
      return (
        <>
          <div className={s.grid2}>
            <Field label="Quote (EN)">
              <textarea className={s.textarea} rows={2} value={block.text.en} onChange={(e) => onChange({ ...block, text: { ...block.text, en: e.target.value } })} />
            </Field>
            <Field label="Quote (BS)">
              <textarea className={s.textarea} rows={2} value={block.text.bs} onChange={(e) => onChange({ ...block, text: { ...block.text, bs: e.target.value } })} />
            </Field>
          </div>
          <Field label="Citation (optional)">
            <input className={s.input} value={block.cite ?? ""} onChange={(e) => onChange({ ...block, cite: e.target.value })} />
          </Field>
        </>
      );
    case "list":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {block.items.map((item, ii) => (
            <div className={x.listItem} key={ii}>
              <Field label={`Item ${ii + 1} (EN)`}>
                <input className={s.input} value={item.en} onChange={(e) => onChange({ ...block, items: block.items.map((it, i) => (i === ii ? { ...it, en: e.target.value } : it)) })} />
              </Field>
              <Field label={`(BS)`}>
                <input className={s.input} value={item.bs} onChange={(e) => onChange({ ...block, items: block.items.map((it, i) => (i === ii ? { ...it, bs: e.target.value } : it)) })} />
              </Field>
              <button
                type="button"
                className={s.danger}
                style={{ alignSelf: "flex-end" }}
                onClick={() => onChange({ ...block, items: block.items.filter((_, i) => i !== ii) })}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className={s.ghost} style={{ alignSelf: "flex-start" }} onClick={() => onChange({ ...block, items: [...block.items, { en: "", bs: "" }] })}>
            + Add item
          </button>
        </div>
      );
    case "code":
      return (
        <>
          <Field label="Language">
            <input className={`${s.input} ${s.mono}`} value={block.lang ?? ""} placeholder="ts" onChange={(e) => onChange({ ...block, lang: e.target.value })} />
          </Field>
          <Field label="Code">
            <textarea className={`${s.textarea} ${s.mono}`} rows={6} value={block.code} spellCheck={false} onChange={(e) => onChange({ ...block, code: e.target.value })} />
          </Field>
        </>
      );
    case "image":
      return (
        <>
          <Field label="Image src">
            <input className={`${s.input} ${s.mono}`} value={block.src} placeholder="/images/figure.png" onChange={(e) => onChange({ ...block, src: e.target.value })} />
          </Field>
          <div className={s.grid2}>
            <Field label="Alt (EN)">
              <input className={s.input} value={block.alt?.en ?? ""} onChange={(e) => onChange({ ...block, alt: { en: e.target.value, bs: block.alt?.bs ?? "" } })} />
            </Field>
            <Field label="Alt (BS)">
              <input className={s.input} value={block.alt?.bs ?? ""} onChange={(e) => onChange({ ...block, alt: { en: block.alt?.en ?? "", bs: e.target.value } })} />
            </Field>
          </div>
        </>
      );
    default:
      return null;
  }
}

/* --------------------------------------------------------------- helpers ---- */

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      {children}
      {error ? <span className={s.fieldError}>{error}</span> : null}
    </label>
  );
}

function CsvField({ label, items, onItems }: { label: string; items: string[]; onItems: (v: string[]) => void }) {
  const [draft, setDraft] = useState(items.join(", "));
  useEffect(() => {
    setDraft(items.join(", "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.join(" ")]);

  function onText(raw: string) {
    setDraft(raw);
    onItems(
      raw
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
    );
  }

  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      <input className={s.input} value={draft} spellCheck={false} autoComplete="off" placeholder="comma, separated, values" onChange={(e) => onText(e.target.value)} />
    </label>
  );
}
