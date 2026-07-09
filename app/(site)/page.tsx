import Hero from "@/app/components/Hero";
import BigMarquee from "@/app/components/BigMarquee";
import Services from "@/app/components/Services";
import Showcase from "@/app/components/Showcase";
import FeaturedProducts from "@/app/components/FeaturedProducts";
import Manifesto from "@/app/components/Manifesto";
import Pricing from "@/app/components/Pricing";
import CTA from "@/app/components/CTA";
import { getDict, getLocale } from "@/app/i18n";
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
