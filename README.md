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
| `SANITY_PROJECT_ID` / `SANITY_DATASET` | enable CMS-backed products |
| `RESEND_API_KEY` / `CONTACT_TO` | activate contact-form email delivery |

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
    Loader.tsx           intro loader
    ChatWidget.tsx       bottom-right chat launcher
public/assets/           logo, palms, cursor
```

## License

All rights reserved.
