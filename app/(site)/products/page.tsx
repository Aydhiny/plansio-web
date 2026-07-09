import type { Metadata } from "next";
import ProductCard from "@/app/components/ProductCard";
import { getDict, getLocale } from "@/app/i18n";
import { getAllProducts } from "@/lib/products";

export async function generateMetadata(): Promise<Metadata> {
  const d = getDict(await getLocale());
  const title = `${d.products.title} ${d.products.accent}`.trim();
  return { title, description: d.products.lead, alternates: { canonical: "/products" } };
}

export default async function ProductsPage() {
  const locale = await getLocale();
  const d = getDict(locale);
  const products = await getAllProducts();
  return (
    <main className="page">
      <section className="products" data-screen-label="Products">
        <div className="wrap">
          <div className="shead rv">
            <h2>
              {d.products.title} <span className="serif grad-t">{d.products.accent}</span>
            </h2>
            <p>{d.products.lead}</p>
          </div>
          <div className="pgrid">
            {products.map((p) => (
              <div className="rv" key={p.slug}>
                <ProductCard p={p} d={d} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
