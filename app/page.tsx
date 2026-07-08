import Nav from "./components/Nav";
import Hero from "./components/Hero";
import BigMarquee from "./components/BigMarquee";
import Services from "./components/Services";
import Showcase from "./components/Showcase";
import Manifesto from "./components/Manifesto";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <BigMarquee />
      <Services />
      <Showcase />
      <Manifesto />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
