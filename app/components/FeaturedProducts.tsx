import Link from "next/link";
import ProductCard from "./ProductCard";
import { type Product } from "@/lib/products";
import type { Dict, Locale } from "../i18n";

export default function FeaturedProducts({ d, locale, products }: { d: Dict; locale: Locale; products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="products" id="products" data-screen-label="Products">
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
        <div className="products-more rv d1">
          <Link className="btn ghost" href="/products">
            <span>{d.products.back}</span> <span className="ar">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
