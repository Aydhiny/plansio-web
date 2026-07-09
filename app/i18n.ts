import { cookies, headers } from "next/headers";

export const locales = ["en", "bs"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

const en = {
  nav: { work: "Work", studio: "Studio", pricing: "Pricing", products: "Products", start: "Start a project", open: "Open menu", close: "Close menu" },
  products: {
    title: "things we've",
    accent: "shipped.",
    lead: "Real products, designed and built end to end. Explore them live.",
    live: "Live",
    beta: "Beta",
    wip: "In progress",
    overview: "Overview",
    features: "Features",
    stack: "Built with",
    platforms: "Platforms",
    related: "More from the studio",
    visit: "Open live app",
    watch: "Watch trailer",
    clickToLoad: "Click to load the live app",
    back: "All products",
    view: "View product",
  },
  hero: {
    pre: ["We", "build", "brands,", "products", "&"],
    accent: "worlds.",
    sub: "A full-stack studio — marketing, design, software and games, handled by one team from the first idea to launch day.",
    start: "Start a project",
    work: "See the work",
  },
  marquee: { marketing: "marketing", design: "design", software: "software", games: "games" },
  services: {
    h1: "one studio,",
    h2: "the whole stack.",
    lead: "Three disciplines, one team — carrying every project from the first spark of an idea to the thing people actually use.",
    items: [
      { no: "01", pre: "marketing that", accent: "means", post: "it", line: "Positioning, campaigns & content that move real numbers — built on strategy, not vanity metrics.", tags: ["Strategy", "Campaigns", "SEO", "Social"] },
      { no: "02", pre: "identity with a", accent: "pulse", post: "", line: "Logos & brand systems built to be remembered — everywhere they live, from a favicon to a billboard.", tags: ["Identity", "Systems", "Art direction", "Motion"] },
      { no: "03", pre: "full-stack apps &", accent: "websites", post: "", line: "From a landing page to a production web app — designed, built and shipped end to end by the same team.", tags: ["Web apps", "Websites", "APIs", "Product UX"] },
      { no: "04", pre: "games worth", accent: "playing", post: "", line: "Original games and interactive worlds — from mechanics and art to release. We ship our own titles, and we can ship yours.", tags: ["Game design", "Unity", "Web games", "Narrative"] },
    ],
    footPre: "Many projects.",
    footAccent: "One partner",
    footPost: "who carries all of them, start to finish.",
    start: "Start a project",
  },
  showcase: {
    hPre: "from the",
    hAccent: "studio.",
    lead: "We don't just build for clients — we ship our own. Here's Hunter Mouse 2, designed, built and launched in-house.",
    badge: "Our game",
    meta: "A fast, hand-crafted title built with the same team that handles client work — proof the studio can carry an idea all the way to a shipped, playable product.",
    watch: "Watch on YouTube",
    cap1: "Brand & social design",
    cap2: "Identity & art direction",
    videoTitle: "Hunter Mouse 2 — official trailer",
  },
  manifesto: {
    kick: "The Plansio difference",
    a: "technology",
    b: " is easy.",
    c: "making it feel ",
    d: "human",
    e: " is the work.",
    p: "Anyone can ship a feature. We obsess over the gap between what a product does and how it feels — the warmth, the timing, the small moments that make people trust a brand.",
    stats: ["Projects shipped", "Disciplines, one team", "In-house craft"],
  },
  pricing: {
    h1: "ways to",
    hAccent: "work",
    h2: "together.",
    lead: "Clear engagements, no surprise invoices. Start small or go all-in — every tier is run by the people doing the work.",
    tiers: [
      { name: "Spark", price: "$2.4k", period: "/ project", for: "A single, focused deliverable — a landing page, a logo, a campaign.", features: ["One discipline, one outcome", "2-week turnaround", "Source files included", "Two revision rounds"], cta: "Start small", badge: "" },
      { name: "Studio", price: "$6.8k", period: "/ month", for: "A dedicated team across design, marketing & code — your brand on retainer.", features: ["All three disciplines", "Dedicated project lead", "Weekly shipping cadence", "Unlimited revisions", "Priority support"], cta: "Book the studio", badge: "Most picked" },
      { name: "Scale", price: "Custom", period: "", for: "Full-stack product & brand partnership for teams shipping at volume.", features: ["Multi-project roadmap", "Embedded engineers", "Dedicated infrastructure", "SLA & account team"], cta: "Let's talk scale", badge: "" },
    ],
  },
  cta: {
    hPre: "let's build the thing",
    hAccent: "you keep describing.",
    sub: "Tell us what you're making. We'll bring the strategy, the craft, and the code.",
    name: "Your name",
    email: "Email",
    message: "What are you building?",
    send: "Send it over",
    sending: "Sending…",
    ok: "Thanks — your message is on its way. We'll be in touch shortly.",
    altPre: "Prefer email?",
    errors: {
      empty: "Please fill in every field.",
      long: "That's a bit long — trim it down?",
      email: "That email doesn't look right.",
      unconfigured: "The form isn't wired up yet — email us at hello@plansio.studio and we'll jump on it.",
      send: "Something went wrong sending that. Try again, or email hello@plansio.studio.",
      network: "Network hiccup — try again in a moment.",
    },
  },
  footer: {
    blurb: "One team across marketing, design and software — so your brand isn't stitched together from five different agencies.",
    studio: "Studio",
    services: "Services",
    connect: "Connect",
    lStudio: ["Work", "About", "Pricing", "Contact"],
    lServices: ["Marketing", "Graphic design", "Software", "Games"],
    lConnect: ["Instagram", "LinkedIn", "Dribbble", "Email"],
    rights: "© 2026 Plansio Studio",
    tagline: "Design, code & strategy under one roof",
  },
  chat: {
    teaser: "Pick me!",
    subtitle: "marketing · design · software · games",
    msgs: ["Hey 👋", "Pick us and you get marketing, design and code from one team — no handoffs, no five-agency chaos.", "So… what are you building?"],
    placeholder: "Tell us what you're making…",
    open: "Open chat",
    close: "Close chat",
  },
};

export type Dict = typeof en;

const bs: Dict = {
  nav: { work: "Radovi", studio: "Studio", pricing: "Cijene", products: "Proizvodi", start: "Započni projekt", open: "Otvori meni", close: "Zatvori meni" },
  products: {
    title: "stvari koje smo",
    accent: "napravili.",
    lead: "Stvarni proizvodi, dizajnirani i izgrađeni od početka do kraja. Isprobajte ih uživo.",
    live: "Uživo",
    beta: "Beta",
    wip: "U izradi",
    overview: "Pregled",
    features: "Mogućnosti",
    stack: "Napravljeno pomoću",
    platforms: "Platforme",
    related: "Još iz studija",
    visit: "Otvori aplikaciju",
    watch: "Pogledaj trailer",
    clickToLoad: "Klikni da učitaš aplikaciju uživo",
    back: "Svi proizvodi",
    view: "Pogledaj proizvod",
  },
  hero: {
    pre: ["Gradimo", "brendove,", "proizvode", "i"],
    accent: "svjetove.",
    sub: "Full-stack studio — marketing, dizajn, softver i igre, sve u rukama jednog tima, od prve ideje do dana lansiranja.",
    start: "Započni projekt",
    work: "Pogledaj radove",
  },
  marquee: { marketing: "marketing", design: "dizajn", software: "softver", games: "igre" },
  services: {
    h1: "jedan studio,",
    h2: "cijeli stack.",
    lead: "Tri discipline, jedan tim — vodimo svaki projekt od prve iskre ideje do onoga što ljudi zaista koriste.",
    items: [
      { no: "01", pre: "marketing koji nešto", accent: "znači", post: "", line: "Pozicioniranje, kampanje i sadržaj koji pomjeraju stvarne brojke — zasnovani na strategiji, a ne na ispraznim metrikama.", tags: ["Strategija", "Kampanje", "SEO", "Društvene mreže"] },
      { no: "02", pre: "identitet s", accent: "pulsom", post: "", line: "Logotipi i brend sistemi stvoreni da se pamte — svugdje gdje se pojave, od favicona do bilborda.", tags: ["Identitet", "Sistemi", "Art direkcija", "Motion"] },
      { no: "03", pre: "full-stack aplikacije i", accent: "web stranice", post: "", line: "Od landing stranice do produkcijske web aplikacije — dizajnirano, izgrađeno i isporučeno od početka do kraja, od istog tima.", tags: ["Web aplikacije", "Web stranice", "API-ji", "Product UX"] },
      { no: "04", pre: "igre vrijedne", accent: "igranja", post: "", line: "Originalne igre i interaktivni svjetovi — od mehanika i arta do izdavanja. Objavljujemo vlastite naslove, a možemo i vaše.", tags: ["Dizajn igara", "Unity", "Web igre", "Naracija"] },
    ],
    footPre: "Mnogo projekata.",
    footAccent: "Jedan partner",
    footPost: "koji ih sve vodi, od početka do kraja.",
    start: "Započni projekt",
  },
  showcase: {
    hPre: "iz",
    hAccent: "studija.",
    lead: "Ne gradimo samo za klijente — objavljujemo i svoje. Evo Hunter Mouse 2, dizajniran, izgrađen i lansiran u vlastitoj režiji.",
    badge: "Naša igra",
    meta: "Brza, ručno izrađena igra koju je napravio isti tim koji radi i klijentske projekte — dokaz da studio može ideju provesti sve do gotovog, igrivog proizvoda.",
    watch: "Pogledaj na YouTubeu",
    cap1: "Brend i dizajn za društvene mreže",
    cap2: "Identitet i art direkcija",
    videoTitle: "Hunter Mouse 2 — službeni trailer",
  },
  manifesto: {
    kick: "Plansio razlika",
    a: "tehnologija",
    b: " je laka.",
    c: "učiniti da djeluje ",
    d: "ljudski",
    e: " — to je posao.",
    p: "Svako može isporučiti feature. Nas opsjeda jaz između onoga što proizvod radi i kako se osjeća — toplina, tajming, mali trenuci zbog kojih ljudi počnu vjerovati brendu.",
    stats: ["Isporučenih projekata", "Discipline, jedan tim", "Zanatstvo u kući"],
  },
  pricing: {
    h1: "načini da",
    hAccent: "radimo",
    h2: "zajedno.",
    lead: "Jasni angažmani, bez iznenađenja na fakturi. Počni malo ili idi all-in — svaki paket vode ljudi koji rade posao.",
    tiers: [
      { name: "Spark", price: "$2.4k", period: "/ projekt", for: "Jedan fokusiran deliverable — landing stranica, logo, kampanja.", features: ["Jedna disciplina, jedan ishod", "Rok od 2 sedmice", "Uključeni izvorni fajlovi", "Dva kruga revizija"], cta: "Počni malo", badge: "" },
      { name: "Studio", price: "$6.8k", period: "/ mjesec", for: "Posvećen tim kroz dizajn, marketing i kod — vaš brend na retaineru.", features: ["Sve tri discipline", "Posvećen vođa projekta", "Sedmični ritam isporuke", "Neograničene revizije", "Prioritetna podrška"], cta: "Rezerviši studio", badge: "Najčešći izbor" },
      { name: "Scale", price: "Po dogovoru", period: "", for: "Full-stack partnerstvo za proizvod i brend, za timove koji isporučuju u velikom obimu.", features: ["Roadmap za više projekata", "Ugrađeni inženjeri", "Posvećena infrastruktura", "SLA i account tim"], cta: "Razgovarajmo o skaliranju", badge: "" },
    ],
  },
  cta: {
    hPre: "hajde da izgradimo ono",
    hAccent: "što stalno opisuješ.",
    sub: "Reci nam šta praviš. Mi donosimo strategiju, zanat i kod.",
    name: "Vaše ime",
    email: "Email",
    message: "Šta gradiš?",
    send: "Pošalji",
    sending: "Šaljem…",
    ok: "Hvala — poruka je na putu. Javljamo se uskoro.",
    altPre: "Radije email?",
    errors: {
      empty: "Molimo popunite sva polja.",
      long: "Malo je predugačko — možete li skratiti?",
      email: "Taj email ne izgleda ispravno.",
      unconfigured: "Forma još nije povezana — pišite nam na hello@plansio.studio i odmah se javljamo.",
      send: "Nešto je pošlo po zlu pri slanju. Pokušajte ponovo ili pišite na hello@plansio.studio.",
      network: "Problem s mrežom — pokušajte ponovo za trenutak.",
    },
  },
  footer: {
    blurb: "Jedan tim za marketing, dizajn i softver — da vaš brend ne bude skrpljen od pet različitih agencija.",
    studio: "Studio",
    services: "Usluge",
    connect: "Poveži se",
    lStudio: ["Radovi", "O nama", "Cijene", "Kontakt"],
    lServices: ["Marketing", "Grafički dizajn", "Softver", "Igre"],
    lConnect: ["Instagram", "LinkedIn", "Dribbble", "Email"],
    rights: "© 2026 Plansio Studio",
    tagline: "Dizajn, kod i strategija pod jednim krovom",
  },
  chat: {
    teaser: "Izaberi mene!",
    subtitle: "marketing · dizajn · softver · igre",
    msgs: ["Hej 👋", "Izaberi nas i dobijaš marketing, dizajn i kod od jednog tima — bez preprodavanja i bez haosa s pet agencija.", "Pa… šta gradiš?"],
    placeholder: "Reci nam šta praviš…",
    open: "Otvori chat",
    close: "Zatvori chat",
  },
};

const dicts: Record<Locale, Dict> = { en, bs };

export function getDict(locale: Locale): Dict {
  return dicts[locale] || en;
}

/** Resolve the active locale: manual cookie override → region/language headers → default. */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (fromCookie === "en" || fromCookie === "bs") return fromCookie;

  const h = await headers();
  const country = (h.get("x-vercel-ip-country") || "").toUpperCase();
  const accept = h.get("accept-language") || "";
  if (country === "BA" || /\b(bs|hr|sr)\b/i.test(accept)) return "bs";
  return defaultLocale;
}
