# Plansio

A cinematic brand site for **Plansio** — a full-stack studio for **marketing, design & software**. One team carrying every project from strategy to shipped product.

Built with the App Router, statically rendered, with a light-touch WebGL hero and a handful of small client-side interaction islands.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **[Lenis](https://github.com/darkroomengineering/lenis)** — weighted momentum scrolling
- **[ogl](https://github.com/oframe/ogl)** — the Prismatic Burst WebGL hero (React Bits, adapted)
- **`next/font`** — self-hosted Unbounded / Space Grotesk / EB Garamond / JetBrains Mono
- Hand-authored CSS with a design-token system (no CSS framework)

## Highlights

- **Islands architecture** — the whole page is static HTML/CSS (SSG); only scroll, canvas, and pointer behaviour hydrate as small `'use client'` components.
- **Three.js showpiece** (`/`, the "Lab" section) — a custom-GLSL noise-displaced icosahedron with a fresnel rim in the brand gradient + an additive orbiting particle constellation, pointer-reactive and theme-aware. Lazy-loaded (`dynamic ssr:false`) so `three` stays out of the initial bundle; DPR-capped, ~30fps, pauses off-screen, reduced-motion/low-core static frame, WebGL-failure fallback, full GPU disposal on unmount.
- **Blog** (`/blog`) — data-driven articles from `lib/blog.ts` with a typed `Block[]` content model (localized, no raw-HTML injection surface), reading time, related posts and `BlogPosting` schema. Fully editable in the Studio.
- **Projects** (`/projects`) — client case studies (challenge → approach → outcome + results), a data layer distinct from products, editable in the Studio.
- **Dark mode** — opt-in `<html data-theme="dark">` applied pre-paint (no FOUC) from `localStorage`/`prefers-color-scheme`; a nav toggle flips it. Dark overrides the core tokens + atmosphere layers, everything else is token-driven.
- **Prismatic Burst hero** — an `ogl` fragment shader, remapped to tinted-white so it reads as soft light rays on the white page. DPR-capped, 30fps, low-power, and pauses when off-screen.
- **Performance-minded** — no per-frame full-screen repaints; the ambient wash and grid are static, RAF loops are throttled and torn down on unmount.
- **Smooth scroll + parallax** — Lenis momentum with a scroll-linked parallax layer and a thin progress meter.
- **Details** — intro loader, gradient page-border frame, mobile hamburger overlay, a chat launcher, and a custom macOS cursor.
- **Accessible & resilient** — respects `prefers-reduced-motion`, decorative layers are `aria-hidden`, and content renders without JS.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the build
```

## Products

Products (Inkril, Musicle, Galaxus, Hunter Mouse 2) are data-driven from a single
typed source — `lib/products.ts` — consumed by the products index (`/products`),
detail pages (`/products/[slug]`), the home "featured" strip, related-products,
the sitemap and per-product metadata. Web-app products render a **live embed** in
a browser device-frame (lazy facade — the iframe loads only on click).

**CMS (Sanity, optional):** the data layer auto-switches to Sanity when
`NEXT_PUBLIC_SANITY_PROJECT_ID` is set, and falls back to the local seed otherwise
— the site reads content over Sanity's HTTP API, so it needs **no Sanity
dependency**. To get an editing dashboard:

```bash
npm create sanity@latest -- --template clean --create-project "Plansio" --dataset production
# copy sanity/product.schema.ts into the new studio's schemaTypes and register it
cd <studio-folder> && npm run dev      # dashboard at http://localhost:3333
npx sanity deploy                       # hosted dashboard at <name>.sanity.studio
```

Then set `NEXT_PUBLIC_SANITY_PROJECT_ID` (from the studio) on the site and it
serves CMS content. (Embedded `/studio` was skipped — Sanity Studio doesn't yet
build under Next 16's Turbopack; the standalone studio is the reliable path.)

## Environment

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | canonical/OG/sitemap base URL |
| `STUDIO_PASSWORD` / `STUDIO_SECRET` | password + session secret for `/studio` (default password `plansio` — change it) |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV persistence for Studio edits in prod (falls back to `.data/*.json` in dev) |
| `ANTHROPIC_API_KEY` | powers the AI concierge chat (falls back to a friendly canned reply without it) |
| `NEXT_PUBLIC_CAL_LINK` | booking link for the featured "Book the studio" pricing tier |
| `RESEND_API_KEY` / `CONTACT_TO` | activate contact-form email delivery |
| `SANITY_PROJECT_ID` / `SANITY_DATASET` | alternative CMS source for products (optional) |

## Studio & extras

- **`/studio`** — a custom, password-gated admin with tabs for **Theme**, **Brand & Copy**, **Products**, **Projects** and **Blog**. Full CRUD (the Blog tab has a block editor: paragraph / heading / quote / list / code / image, reorderable) persists to KV/file via `/api/studio/save` and `revalidatePath`, re-theming and republishing the site live.
- **AI concierge** — the bottom-right chat talks to Claude (`/api/chat`) grounded in the studio's products.
- **⌘K command palette**, **animated count-up stats**, **FAQ** (`/faq`, with `FAQPage` schema), cross-document **view transitions**, `security.txt`, and richer Organization JSON-LD.
- **CI** (`.github/workflows/ci.yml`) runs build + Playwright smoke tests on every push/PR.

## Structure

```
app/
  layout.tsx            fonts, metadata, atmosphere layers, client islands
  page.tsx              composes the sections
  globals.css           full design system + component styles
  components/
    Nav / Hero / BigMarquee / Services / Manifesto / Pricing / CTA / Footer
    SmoothScroll.tsx     Lenis + parallax + scroll progress
    Effects.tsx          nav state, reveals, 3D logo tilt, vapor canvas
    PrismaticBurst.tsx   ogl WebGL hero backdrop
    Scene3D.tsx / Lab.tsx  Three.js showpiece (lazy, client-only)
    ThemeToggle.tsx      light/dark switch (pre-paint, no FOUC)
    BlogCard / ArticleBody / ProjectCard  blog + projects UI
lib/
    products.ts / projects.ts / blog.ts   typed data layers (seed + Sanity + KV)
    Loader.tsx           intro loader
    ChatWidget.tsx       bottom-right chat launcher
public/assets/           logo, palms, cursor
```

## License

All rights reserved.
