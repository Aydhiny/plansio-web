import Link from "next/link";
import { type Project, type Locale, t } from "@/lib/projects";

export default function ProjectCard({ p, locale }: { p: Project; locale: Locale }) {
  return (
    <Link href={`/projects/${p.slug}`} className="prcard" style={{ "--accent": p.accent } as React.CSSProperties}>
      <div className="prcard-media">
        {p.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover} alt="" loading="lazy" />
        ) : (
          <span
            className="prcard-ph"
            aria-hidden="true"
            style={{
              background: `radial-gradient(120% 120% at 20% 12%, ${p.accent}, transparent 62%), radial-gradient(120% 120% at 90% 88%, ${p.accent}55, transparent 55%), #0c0a12`,
            }}
          >
            <b>{p.client}</b>
          </span>
        )}
        <span className="prcard-year">{p.year}</span>
      </div>
      <div className="prcard-body">
        <div className="prcard-top">
          <span className="prcard-client">{p.client}</span>
          <span className="prcard-sector">{t(p.sector, locale)}</span>
        </div>
        <h3>{t(p.title, locale)}</h3>
        <p>{t(p.summary, locale)}</p>
        <div className="prcard-roles">
          {p.roles.map((r) => (
            <span key={r}>{r}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
