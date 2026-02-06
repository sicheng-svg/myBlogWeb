# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog website (中文/Chinese content) built with React + TypeScript + Tailwind CSS v4. Originally exported from Figma Make, now with a full Vite build system.

## Build & Dev Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run preview  # Preview production build
```

## Tech Stack

- **Vite** — bundler, with `@vitejs/plugin-react` + `@tailwindcss/vite`
- **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS v4** — config in `src/styles/globals.css` via `@theme inline`, `@custom-variant`
- **react-router-dom** — client-side routing (`/` home, `/blogs` all posts)
- **Motion** (imported as `motion/react`, NOT `framer-motion`)
- **shadcn/ui** components in `src/components/ui/` (do not edit manually)
- **embla-carousel-react** — blog carousel
- **lucide-react** — icons
- **clsx** + **tailwind-merge** — `cn()` utility in `src/components/ui/utils.ts`

**Path alias:** `@/` → `src/` (configured in tsconfig + vite.config.ts)

## Architecture

**Entry:** `src/main.tsx` → `<App />` → `BrowserRouter`

**Routing** (`src/App.tsx`):
- `/` → `Home` page (WelcomeSection + ProfileSection + BlogCarousel)
- `/blogs` → `AllBlogPosts` page (grid list of all posts)
- `Navbar` — fixed top, visible on all routes
- `ScrollToTop` — resets scroll on route change

**Component organization:**
- `src/pages/` — Route-level page components (Home, AllBlogPosts)
- `src/components/` — Shared section components (Navbar, WelcomeSection, ProfileSection, BlogCarousel, ContributionGraph, ScrollToTop)
- `src/components/ui/` — shadcn/ui primitives (do not edit manually)
- `src/components/figma/` — Figma Make utility components (ImageWithFallback)
- `src/data/` — Shared data modules (blogPosts.ts)

**Styling:**
- `src/styles/globals.css` — Tailwind v4 source CSS with design tokens (light/dark themes)

## Key Patterns

- All animations use `motion/react` — `motion.div`, `whileInView`, etc.
- `ImageWithFallback` wraps `<img>` with error state fallback (inline SVG placeholder)
- Blog data is in `src/data/blogPosts.ts` — shared between carousel and list page
- ContributionGraph generates random data on each render (no real data source)
- Chinese (中文) for all user-facing content; code comments mix Chinese and English
- 3 shadcn/ui files have `@ts-nocheck` due to version-mismatch types (calendar, chart, resizable) — they are unused
