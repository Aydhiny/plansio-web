"use client";

import { useEffect, useState } from "react";
import type { Project, Localized, ProjectResult } from "@/lib/projects";
import s from "./ProductsPanel.module.css"; // reuse the products editor styling
import x from "./PostsPanel.module.css"; // reuse the list-row helper

type LocalizedKey = keyof Localized;

function slugify(raw: string): string {
  return raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function uniqueSlug(base: string, taken: Set<string>): string {
  const root = base || "new-project";
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}
function blankProject(taken: Set<string>): Project {
  return {
    slug: uniqueSlug("new-project", taken),
    client: "New client",
    title: { en: "", bs: "" },
    sector: { en: "", bs: "" },
    year: String(new Date().getFullYear()),
    accent: "#2a3bed",
    roles: [],
    summary: { en: "", bs: "" },
    challenge: { en: "", bs: "" },
    approach: { en: "", bs: "" },
    outcome: { en: "", bs: "" },
    results: [],
    stack: [],
  };
}

export default function ProjectsPanel({ value, onChange }: { value: Project[]; onChange: (v: Project[]) => void }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(value.length > 0 ? value[0].slug : null);
  const selectedIndex = value.findIndex((p) => p.slug === selectedSlug);
  const selected = selectedIndex >= 0 ? value[selectedIndex] : null;

  function patchAt(index: number, patch: Partial<Project>) {
    const next = value.map((p, i) => (i === index ? { ...p, ...patch } : p));
    if (patch.slug !== undefined && index === selectedIndex) setSelectedSlug(patch.slug);
    onChange(next);
  }
  function removeAt(index: number) {
    const removed = value[index];
    const next = value.filter((_, i) => i !== index);
    onChange(next);
    if (removed.slug === selectedSlug) setSelectedSlug((next[index] ?? next[index - 1] ?? null)?.slug ?? null);
  }
  function addProject() {
    const created = blankProject(new Set(value.map((p) => p.slug)));
    onChange([...value, created]);
    setSelectedSlug(created.slug);
  }

  return (
    <div className={s.panel}>
      <header className={s.head}>
        <div>
          <h2 className={s.title}>Projects</h2>
          <p className={s.hint}>
            {value.length} {value.length === 1 ? "case study" : "case studies"}. Edits publish on save.
          </p>
        </div>
        <button type="button" className={s.primary} onClick={addProject}>
          + Add project
        </button>
      </header>

      <div className={s.layout}>
        <div className={s.list}>
          {value.length === 0 ? (
            <div className={s.empty}>No projects yet. Use “Add project” to create one.</div>
          ) : (
            value.map((project, index) => (
              <div className={`${s.card} ${project.slug === selectedSlug ? s.cardActive : ""}`} key={project.slug || `idx-${index}`}>
                <button type="button" className={s.cardMain} onClick={() => setSelectedSlug(project.slug)}>
                  <span className={s.chip} style={{ background: project.accent }} aria-hidden="true" />
                  <span className={s.cardText}>
                    <span className={s.cardName}>{project.client || "Untitled"}</span>
                    <span className={s.cardMeta}>{project.sector.en || "—"} · {project.year}</span>
                  </span>
                  {project.featured ? <span className={`${s.badge} ${s.badge_live}`}>Featured</span> : null}
                </button>
                <div className={s.cardActions}>
                  <button type="button" className={s.ghost} onClick={() => setSelectedSlug(project.slug)}>
                    Edit
                  </button>
                  <button type="button" className={s.danger} onClick={() => removeAt(index)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={s.detail}>
          {selected ? (
            <ProjectEditor
              key={selected.slug || `edit-${selectedIndex}`}
              project={selected}
              siblings={value}
              index={selectedIndex}
              onPatch={(patch) => patchAt(selectedIndex, patch)}
            />
          ) : (
            <div className={s.detailEmpty}>Select a project to edit, or add a new one.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectEditor({
  project,
  siblings,
  index,
  onPatch,
}: {
  project: Project;
  siblings: Project[];
  index: number;
  onPatch: (patch: Partial<Project>) => void;
}) {
  const [slugTouched, setSlugTouched] = useState(false);
  useEffect(() => setSlugTouched(false), [index]);

  function setLoc(field: "title" | "sector" | "summary" | "challenge" | "approach" | "outcome", key: LocalizedKey, text: string) {
    onPatch({ [field]: { ...project[field], [key]: text } } as Partial<Project>);
  }
  function setClient(client: string) {
    if (slugTouched) onPatch({ client });
    else onPatch({ client, slug: slugify(client) });
  }
  const slugTaken = siblings.some((p, i) => i !== index && p.slug === project.slug && project.slug !== "");

  const results = project.results ?? [];
  function patchResult(ri: number, patch: Partial<ProjectResult>) {
    onPatch({ results: results.map((r, i) => (i === ri ? { ...r, ...patch } : r)) });
  }

  return (
    <div className={s.editor}>
      <div className={s.editorHead}>
        <span className={s.editorChip} style={{ background: project.accent }} aria-hidden="true" />
        <h3 className={s.editorTitle}>{project.client || "Untitled"}</h3>
      </div>

      <section className={s.section}>
        <div className={s.grid2}>
          <Field label="Client">
            <input className={s.input} value={project.client} onChange={(e) => setClient(e.target.value)} />
          </Field>
          <Field label="Slug" error={slugTaken ? "Slug already in use" : undefined}>
            <input
              className={`${s.input} ${s.mono} ${slugTaken ? s.inputError : ""}`}
              value={project.slug}
              spellCheck={false}
              onChange={(e) => {
                setSlugTouched(true);
                onPatch({ slug: slugify(e.target.value) });
              }}
            />
          </Field>
          <Field label="Title (EN)">
            <input className={s.input} value={project.title.en} onChange={(e) => setLoc("title", "en", e.target.value)} />
          </Field>
          <Field label="Title (BS)">
            <input className={s.input} value={project.title.bs} onChange={(e) => setLoc("title", "bs", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.grid3}>
          <Field label="Sector (EN)">
            <input className={s.input} value={project.sector.en} onChange={(e) => setLoc("sector", "en", e.target.value)} />
          </Field>
          <Field label="Sector (BS)">
            <input className={s.input} value={project.sector.bs} onChange={(e) => setLoc("sector", "bs", e.target.value)} />
          </Field>
          <Field label="Year">
            <input className={s.input} value={project.year} onChange={(e) => onPatch({ year: e.target.value })} />
          </Field>
          <Field label="Accent">
            <div className={s.colorRow}>
              <span className={s.swatchWrap}>
                <input
                  type="color"
                  className={s.swatch}
                  value={/^#[0-9a-fA-F]{6}$/.test(project.accent) ? project.accent : "#000000"}
                  onChange={(e) => onPatch({ accent: e.target.value })}
                  aria-label="Accent color"
                />
              </span>
              <input className={`${s.input} ${s.mono}`} value={project.accent} maxLength={7} onChange={(e) => onPatch({ accent: e.target.value })} aria-label="Accent hex" />
            </div>
          </Field>
          <Field label="Cover image">
            <input className={`${s.input} ${s.mono}`} value={project.cover ?? ""} placeholder="/images/cover.png" onChange={(e) => onPatch({ cover: e.target.value })} />
          </Field>
          <Field label="Live URL">
            <input className={`${s.input} ${s.mono}`} value={project.url ?? ""} placeholder="https://…" onChange={(e) => onPatch({ url: e.target.value })} />
          </Field>
        </div>
        <label className={s.check}>
          <input type="checkbox" checked={project.featured ?? false} onChange={(e) => onPatch({ featured: e.target.checked })} />
          <span>Featured</span>
        </label>
      </section>

      <section className={s.section}>
        <div className={s.grid2}>
          <Field label="Summary (EN)">
            <textarea className={s.textarea} rows={2} value={project.summary.en} onChange={(e) => setLoc("summary", "en", e.target.value)} />
          </Field>
          <Field label="Summary (BS)">
            <textarea className={s.textarea} rows={2} value={project.summary.bs} onChange={(e) => setLoc("summary", "bs", e.target.value)} />
          </Field>
        </div>
        {(["challenge", "approach", "outcome"] as const).map((field) => (
          <div className={s.grid2} key={field}>
            <Field label={`${field[0].toUpperCase()}${field.slice(1)} (EN)`}>
              <textarea className={s.textarea} rows={3} value={project[field].en} onChange={(e) => setLoc(field, "en", e.target.value)} />
            </Field>
            <Field label={`${field[0].toUpperCase()}${field.slice(1)} (BS)`}>
              <textarea className={s.textarea} rows={3} value={project[field].bs} onChange={(e) => setLoc(field, "bs", e.target.value)} />
            </Field>
          </div>
        ))}
      </section>

      <section className={s.section}>
        <CsvField label="Roles" items={project.roles} onItems={(roles) => onPatch({ roles })} />
        <CsvField label="Stack" items={project.stack} onItems={(stack) => onPatch({ stack })} />
      </section>

      <section className={s.section}>
        <div className={s.sectionHead}>
          <span className={s.label}>Results</span>
          <button type="button" className={s.ghost} onClick={() => onPatch({ results: [...results, { value: "", label: { en: "", bs: "" } }] })}>
            + Add result
          </button>
        </div>
        {results.length === 0 ? (
          <div className={s.subEmpty}>No results yet.</div>
        ) : (
          results.map((r, ri) => (
            <div className={x.listItem} key={ri}>
              <Field label="Value">
                <input className={s.input} value={r.value} placeholder="+64%" onChange={(e) => patchResult(ri, { value: e.target.value })} />
              </Field>
              <Field label="Label (EN)">
                <input className={s.input} value={r.label.en} onChange={(e) => patchResult(ri, { label: { ...r.label, en: e.target.value } })} />
              </Field>
              <Field label="Label (BS)">
                <input className={s.input} value={r.label.bs} onChange={(e) => patchResult(ri, { label: { ...r.label, bs: e.target.value } })} />
              </Field>
              <button type="button" className={s.danger} style={{ alignSelf: "flex-end" }} onClick={() => onPatch({ results: results.filter((_, i) => i !== ri) })}>
                ✕
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

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
  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      <input
        className={s.input}
        value={draft}
        spellCheck={false}
        placeholder="comma, separated, values"
        onChange={(e) => {
          setDraft(e.target.value);
          onItems(e.target.value.split(",").map((p) => p.trim()).filter(Boolean));
        }}
      />
    </label>
  );
}
