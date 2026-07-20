import Link from "next/link";
import { type Post, type Locale, t, readingTime } from "@/lib/blog";
import type { Dict } from "../i18n";

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(locale === "bs" ? "bs-BA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({
  post,
  d,
  locale,
  featured = false,
}: {
  post: Post;
  d: Dict;
  locale: Locale;
  featured?: boolean;
}) {
  const mins = readingTime(post, locale);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`bcard${featured ? " bcard-feat" : ""}`}
      style={{ "--accent": post.accent } as React.CSSProperties}
    >
      <div className="bcard-media">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt="" loading="lazy" />
        ) : (
          <span
            className="bcard-ph"
            aria-hidden="true"
            style={{
              background: `radial-gradient(120% 120% at 25% 10%, ${post.accent}, transparent 60%), radial-gradient(120% 120% at 85% 90%, ${post.accent}66, transparent 55%)`,
            }}
          />
        )}
        <span className="bcard-cat">{t(post.category, locale)}</span>
      </div>
      <div className="bcard-body">
        <h3>{t(post.title, locale)}</h3>
        <p>{t(post.excerpt, locale)}</p>
        <div className="bcard-meta">
          <span>{formatDate(post.date, locale)}</span>
          <span className="dot" aria-hidden="true">·</span>
          <span>
            {mins} {d.blog.min}
          </span>
        </div>
      </div>
    </Link>
  );
}
