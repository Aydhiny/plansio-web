import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, getLocale } from "@/app/i18n";
import { getAllProjects, getProject, t } from "@/lib/projects";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://plansio.studio";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const p = await getProject(slug);
  if (!p) return {};
  const title = `${p.client} — ${t(p.title, locale)}`;
  const description = t(p.summary, locale);
  return {
    title,
    description,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title, description, url: `/projects/${p.slug}`, images: p.cover ? [p.cover] : undefined },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const d = getDict(locale);
  const p = await getProject(slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: t(p.title, locale),
    about: t(p.sector, locale),
    creator: { "@type": "Organization", name: "Plansio" },
    datePublished: p.year,
    description: t(p.summary, locale),
    mainEntityOfPage: `${SITE_URL}/projects/${p.slug}`,
  };

  const phases: { label: string; body: string }[] = [
    { label: d.projects.challenge, body: t(p.challenge, locale) },
    { label: d.projects.approach, body: t(p.approach, locale) },
    { label: d.projects.outcome, body: t(p.outcome, locale) },
  ];

  return (
    <main className="page" style={{ "--accent": p.accent } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pd">
        <div className="wrap">
          <Link className="pd-back" href="/projects">
            ← {d.projects.back}
          </Link>

          <div className="pr-head rv">
            <div className="pr-meta">
              <span className="pr-client">{p.client}</span>
              <span className="pd-year">{t(p.sector, locale)}</span>
              <span className="pd-year">{p.year}</span>
            </div>
            <h1 className="pd-title">{t(p.title, locale)}</h1>
            <p className="pd-tagline">{t(p.summary, locale)}</p>
            <div className="pr-roles">
              {p.roles.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
            {p.url && (
              <a className="btn solid" href={p.url} target="_blank" rel="noreferrer">
                <span>{d.projects.visit}</span> <span className="ar">↗</span>
              </a>
            )}
          </div>

          {p.results && p.results.length > 0 && (
            <div className="pd-metrics rv d1">
              {p.results.map((m, i) => (
                <div className="pd-metric" key={i}>
                  <div className="pd-metric-n grad-t">{m.value}</div>
                  <div className="pd-metric-l">{t(m.label, locale)}</div>
                </div>
              ))}
            </div>
          )}

          <div className="pr-phases">
            {phases.map((ph, i) => (
              <div className="pr-phase rv" key={i}>
                <span className="pr-phase-no">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="pd-h">{ph.label}</h2>
                  <p>{ph.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pr-stack rv">
            <span className="pd-tagl">{d.projects.stack}</span>
            <div className="pd-tagrow">
              {p.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
