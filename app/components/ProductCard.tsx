import Link from "next/link";
import { type Product, t } from "@/lib/products";
import type { Dict, Locale } from "../i18n";

export default function ProductCard({ p, d, locale }: { p: Product; d: Dict; locale: Locale }) {
  const statusLabel = p.status === "live" ? d.products.live : p.status === "beta" ? d.products.beta : d.products.wip;
  return (
    <Link href={`/products/${p.slug}`} className="pcard" style={{ "--accent": p.accent } as React.CSSProperties}>
      <div className="pcard-media">
        {p.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.poster} alt="" loading="lazy" />
        ) : (
          <span
            className="pcard-ph"
            style={{ background: `radial-gradient(120% 120% at 30% 15%, ${p.accent}33, transparent 60%), #0c0a12` }}
          >
            <b>{p.name}</b>
          </span>
        )}
        <span className={`pcard-status s-${p.status}`}>{statusLabel}</span>
      </div>
      <div className="pcard-body">
        <div className="pcard-cat">{t(p.category, locale)}</div>
        <h3>{p.name}</h3>
        <p>{t(p.tagline, locale)}</p>
        <span className="pcard-view">
          {d.products.view} <span className="ar">↗</span>
        </span>
      </div>
    </Link>
  );
}
