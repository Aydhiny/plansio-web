import type { Metadata } from "next";
import Faq from "@/app/components/Faq";
import { getLocale } from "@/app/i18n";

const FAQ: Record<"en" | "bs", { q: string; a: string }[]> = {
  en: [
    { q: "What does Plansio do?", a: "We're a full-stack studio — marketing, design, software and games — handled by one team from the first idea to launch day." },
    { q: "How do we start a project?", a: "Send a message through the contact form or email hello@plansio.studio with a sentence about what you're building. We'll reply with clear next steps." },
    { q: "What are your pricing tiers?", a: "Spark ($2.4k/project) for a single focused deliverable, Studio ($6.8k/month) for a dedicated team on retainer, and Scale (custom) for full-stack product & brand partnerships." },
    { q: "Do you build your own products?", a: "Yes — we ship our own, like the game Hunter Mouse 2 and web apps such as Inkril, Musicle and Galaxus. It's proof we carry ideas all the way to a shipped product." },
    { q: "Can you work with our existing brand or codebase?", a: "Absolutely. We can slot into an existing system or build from scratch — whichever gets you the best result." },
    { q: "Which languages do you work in?", a: "The site is available in English and Bosnian, and we work with clients internationally." },
  ],
  bs: [
    { q: "Čime se Plansio bavi?", a: "Mi smo full-stack studio — marketing, dizajn, softver i igre — sve u rukama jednog tima, od prve ideje do dana lansiranja." },
    { q: "Kako započinjemo projekt?", a: "Pošaljite poruku putem kontakt forme ili na hello@plansio.studio uz rečenicu o tome šta gradite. Javljamo se s jasnim sljedećim koracima." },
    { q: "Kakvi su vaši cjenovni paketi?", a: "Spark ($2.4k/projekat) za jedan fokusiran deliverable, Studio ($6.8k/mjesec) za posvećen tim na retaineru, i Scale (po dogovoru) za full-stack partnerstvo za proizvod i brend." },
    { q: "Gradite li vlastite proizvode?", a: "Da — objavljujemo svoje, poput igre Hunter Mouse 2 i web aplikacija kao što su Inkril, Musicle i Galaxus. To je dokaz da ideje vodimo sve do gotovog proizvoda." },
    { q: "Možete li raditi s našim postojećim brendom ili kodom?", a: "Apsolutno. Možemo se uklopiti u postojeći sistem ili graditi od nule — šta god vam donosi najbolji rezultat." },
    { q: "Na kojim jezicima radite?", a: "Stranica je dostupna na engleskom i bosanskom, a radimo s klijentima međunarodno." },
  ],
};

export const metadata: Metadata = { title: "FAQ", alternates: { canonical: "/faq" } };

export default async function FaqPage() {
  const locale = (await getLocale()) === "bs" ? "bs" : "en";
  const items = FAQ[locale];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return (
    <main className="page legal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap">
        <h1>{locale === "bs" ? "Česta pitanja" : "Frequently asked questions"}</h1>
        <p className="legal-updated">{locale === "bs" ? "Ne nalazite odgovor? Pišite na hello@plansio.studio" : "Can't find it? Email hello@plansio.studio"}</p>
        <Faq items={items} />
      </div>
    </main>
  );
}
