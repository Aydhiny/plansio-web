import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LiveEmbed from "@/app/components/LiveEmbed";
import VideoEmbed from "@/app/components/VideoEmbed";
import ProductCard from "@/app/components/ProductCard";
import { getDict, getLocale } from "@/app/i18n";
import { getAllProducts, getProduct, getRelated, t } from "@/lib/products";

function youtubeId(url: string): string | null {
  const m = url.match(/[?&]v=([\w-]{6,})/) || url.match(/youtu\.be\/([\w-]{6,})/);
  return m ? m[1] : null;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const p = await getProduct(slug);
  if (!p) return {};
  const description = t(p.tagline, locale);
  return {
    title: `${p.name} — ${t(p.category, locale)}`,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description, url: `/products/${p.slug}`, images: p.poster ? [p.poster] : undefined },
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const d = getDict(locale);
  const p = await getProduct(slug);
  if (!p) notFound();

  const related = await getRelated(p);
  const ytId = !p.liveEmbed ? youtubeId(p.url) : null;
  const statusLabel = p.status === "live" ? d.products.live : p.status === "beta" ? d.products.beta : d.products.wip;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    applicationCategory: t(p.category, locale),
    operatingSystem: p.platforms.join(", "),
    url: p.url,
    description: t(p.description, locale),
  };

  return (
    <main className="page" style={{ "--accent": p.accent } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pd">
        <div className="wrap">
          <Link className="pd-back" href="/products">
            ← {d.products.back}
          </Link>

          <div className="pd-head rv">
            <div className="pd-headmain">
              <div className="pd-meta">
                <span className="pd-cat">{t(p.category, locale)}</span>
                <span className={`pcard-status s-${p.status}`}>{statusLabel}</span>
                <span className="pd-year">{p.year}</span>
              </div>
              <h1 className="pd-title">{p.name}</h1>
              <p className="pd-tagline">{t(p.tagline, locale)}</p>
            </div>
            <a className="btn solid" href={p.url} target="_blank" rel="noreferrer">
              <span>{ytId ? d.products.watch : d.products.visit}</span> <span className="ar">↗</span>
            </a>
          </div>

          <div className="pd-embed rv d1">
            {p.liveEmbed ? (
              <LiveEmbed
                url={p.url}
                name={p.name}
                accent={p.accent}
                poster={p.poster}
                loadLabel={d.products.clickToLoad}
                visitLabel={d.products.visit}
              />
            ) : ytId ? (
              <VideoEmbed id={ytId} title={p.name} poster={p.poster} />
            ) : null}
          </div>

          <div className="pd-cols">
            <div className="pd-overview rv">
              <h2 className="pd-h">{d.products.overview}</h2>
              <p>{t(p.description, locale)}</p>
              <div className="pd-tags">
                <div className="pd-taggroup">
                  <span className="pd-tagl">{d.products.platforms}</span>
                  <div className="pd-tagrow">
                    {p.platforms.map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </div>
                </div>
                <div className="pd-taggroup">
                  <span className="pd-tagl">{d.products.stack}</span>
                  <div className="pd-tagrow">
                    {p.tech.map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pd-features rv d1">
              <h2 className="pd-h">{d.products.features}</h2>
              <div className="pd-flist">
                {p.features.map((f, i) => (
                  <div className="pd-feat" key={i}>
                    <span className="pd-featno">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{t(f.title, locale)}</h3>
                      <p>{t(f.body, locale)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {p.metrics && p.metrics.length > 0 && (
            <div className="pd-metrics rv">
              {p.metrics.map((m, i) => (
                <div className="pd-metric" key={i}>
                  <div className="pd-metric-n grad-t">{m.value}</div>
                  <div className="pd-metric-l">{t(m.label, locale)}</div>
                </div>
              ))}
            </div>
          )}

          {related.length > 0 && (
            <div className="pd-related">
              <h2 className="pd-h rv">{d.products.related}</h2>
              <div className="pgrid">
                {related.map((r) => (
                  <div className="rv" key={r.slug}>
                    <ProductCard p={r} d={d} locale={locale} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
