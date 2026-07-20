import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/app/components/ArticleBody";
import BlogCard, { formatDate } from "@/app/components/BlogCard";
import { getDict, getLocale } from "@/app/i18n";
import { getAllPosts, getPost, getRelatedPosts, readingTime, t } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://plansio.studio";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const p = await getPost(slug);
  if (!p) return {};
  const title = t(p.title, locale);
  const description = t(p.excerpt, locale);
  return {
    title,
    description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${p.slug}`,
      publishedTime: p.date,
      authors: [p.author.name],
      images: p.cover ? [p.cover] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const d = getDict(locale);
  const p = await getPost(slug);
  if (!p) notFound();

  const related = await getRelatedPosts(p);
  const mins = readingTime(p, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: t(p.title, locale),
    description: t(p.excerpt, locale),
    datePublished: p.date,
    author: { "@type": "Person", name: p.author.name },
    publisher: { "@type": "Organization", name: "Plansio", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
    mainEntityOfPage: `${SITE_URL}/blog/${p.slug}`,
    keywords: p.tags.join(", "),
    ...(p.cover ? { image: p.cover } : {}),
  };

  return (
    <main className="page article" style={{ "--accent": p.accent } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="wrap article-wrap">
        <Link className="pd-back" href="/blog">
          ← {d.blog.back}
        </Link>

        <header className="article-head rv">
          <div className="article-meta">
            <span className="article-cat">{t(p.category, locale)}</span>
            <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
            <span className="dot" aria-hidden="true">·</span>
            <span>
              {mins} {d.blog.min}
            </span>
          </div>
          <h1 className="article-title">{t(p.title, locale)}</h1>
          <p className="article-excerpt">{t(p.excerpt, locale)}</p>
          <div className="article-author">
            <span className="article-avatar" aria-hidden="true" style={{ background: `linear-gradient(135deg, ${p.accent}, var(--c-violet))` }}>
              {p.author.name.charAt(0)}
            </span>
            <span>
              <b>{p.author.name}</b>
              <em>{t(p.author.role, locale)}</em>
            </span>
          </div>
        </header>

        {p.cover && (
          <div className="article-cover rv d1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.cover} alt="" />
          </div>
        )}

        <div className="rv d1">
          <ArticleBody blocks={p.body} locale={locale} />
        </div>

        {p.tags.length > 0 && (
          <div className="article-tags rv">
            {p.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="wrap article-related">
          <h2 className="pd-h rv">{d.blog.related}</h2>
          <div className="bgrid">
            {related.map((r) => (
              <div className="rv" key={r.slug}>
                <BlogCard post={r} d={d} locale={locale} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
