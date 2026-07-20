import type { Metadata } from "next";
import BlogCard from "@/app/components/BlogCard";
import { getDict, getLocale } from "@/app/i18n";
import { getAllPosts } from "@/lib/blog";

export async function generateMetadata(): Promise<Metadata> {
  const d = getDict(await getLocale());
  const title = `${d.blog.title} ${d.blog.accent}`.trim();
  return { title, description: d.blog.lead, alternates: { canonical: "/blog" } };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const d = getDict(locale);
  const posts = await getAllPosts();
  const [lead, ...rest] = posts;

  return (
    <main className="page">
      <section className="blog" data-screen-label="Blog">
        <div className="wrap">
          <div className="shead rv">
            <h2>
              {d.blog.title} <span className="serif grad-t">{d.blog.accent}</span>
            </h2>
            <p>{d.blog.lead}</p>
          </div>

          {lead && (
            <div className="rv blead">
              <BlogCard post={lead} d={d} locale={locale} featured />
            </div>
          )}

          {rest.length > 0 && (
            <div className="bgrid">
              {rest.map((p) => (
                <div className="rv" key={p.slug}>
                  <BlogCard post={p} d={d} locale={locale} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
