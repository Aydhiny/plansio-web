import Hero from "./components/Hero";
import BigMarquee from "./components/BigMarquee";
import Services from "./components/Services";
import Showcase from "./components/Showcase";
import FeaturedProducts from "./components/FeaturedProducts";
import Manifesto from "./components/Manifesto";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import { getDict, getLocale } from "./i18n";
import { getAllProducts } from "@/lib/products";

export default async function Home() {
  const locale = await getLocale();
  const d = getDict(locale);
  const products = await getAllProducts();
  return (
    <>
      <Hero d={d} />
      <BigMarquee d={d} />
      <Services d={d} />
      <FeaturedProducts d={d} locale={locale} products={products.filter((p) => p.featured)} />
      <Showcase d={d} />
      <Manifesto d={d} />
      <Pricing d={d} />
      <CTA d={d} />
    </>
  );
}
