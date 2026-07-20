import { type Block, type Locale, t } from "@/lib/blog";

/*
 * Renders an article's typed block list. Prose comes from a controlled model
 * (never raw HTML), so there's no dangerouslySetInnerHTML surface for user/CMS
 * content — the one safe-injection concern a blog usually has is designed out.
 */
export default function ArticleBody({ blocks, locale }: { blocks: Block[]; locale: Locale }) {
  return (
    <div className="article-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{t(b.text, locale)}</p>;
          case "h2":
            return <h2 key={i}>{t(b.text, locale)}</h2>;
          case "h3":
            return <h3 key={i}>{t(b.text, locale)}</h3>;
          case "quote":
            return (
              <blockquote key={i}>
                <p>{t(b.text, locale)}</p>
                {b.cite && <cite>— {b.cite}</cite>}
              </blockquote>
            );
          case "list":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{t(it, locale)}</li>
                ))}
              </ul>
            );
          case "code":
            return (
              <pre key={i} className="article-code" data-lang={b.lang}>
                <code>{b.code}</code>
              </pre>
            );
          case "image":
            return (
              <figure key={i} className="article-fig">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.alt ? t(b.alt, locale) : ""} loading="lazy" />
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
