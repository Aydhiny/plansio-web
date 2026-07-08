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
