import Nav from "./components/Nav";
import Hero from "./components/Hero";
import BigMarquee from "./components/BigMarquee";
import Services from "./components/Services";
import Showcase from "./components/Showcase";
import Manifesto from "./components/Manifesto";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { getDict, getLocale } from "./i18n";

export default async function Home() {
  const locale = await getLocale();
  const d = getDict(locale);
  return (
    <>
      <Nav d={d} locale={locale} />
      <Hero d={d} />
      <BigMarquee d={d} />
      <Services d={d} />
      <Showcase d={d} />
      <Manifesto d={d} />
      <Pricing d={d} />
      <CTA d={d} />
      <Footer d={d} />
    </>
  );
}
