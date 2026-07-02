# AGENTS.md — HIMA TI Web Frontend

## Quick start

```bash
npm install            # install deps
cp .env.example .env   # configure env
npm run dev            # start Vite dev server
```

## Dev commands (all you get)

| Command | What |
|---------|------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check (no autofix) |
| `npm run preview` | Preview production build |

No tests, no typecheck (no TypeScript). Only `lint` is available for verification.

## Env & API

- `VITE_API_BASE_URL=/api` (proxy mode) → recommended for dev. `DEV_API_PROXY_TARGET=http://localhost:3000` points Vite proxy at backend.
- `VITE_API_BASE_URL=http://host:port/api` (direct mode) → needs CORS on backend.
- Proxy logic in `vite.config.js` handles trailing `/api` on target (rewrites path if target already ends with `/api`).
- Production: Vercel rewrites `/api/*` → `https://hima-ti-be.vercel.app/api/*` (see `vercel.json`).

## Auth

- Login stores JWT in `sessionStorage` key `himati_auth`.
- Bearer token sent on `Authorization` header for admin operations (Portal).
- Some hooks (e.g. `useAspirasi`) also check `localStorage` key `himati_token` as fallback.

## API field mapping

Backend uses English field names; frontend maps them in hooks:

| Backend | Frontend (code) |
|---------|----------------|
| `name` | `nama` |
| `description` | `deskripsi` |
| `image_url` | `gambar` |
| `url` / `link_order` | `linkOrder` |
| `price` | `harga` |

Form submissions send both `price` and `harga` for compatibility.

## Routes & standalone pages

```
/          → Beranda (home)
/tentang   → Tentang (about)
/kepengurusan → Kepengurusan (organization)
/produk    → Produk (products)
/aspirasi  → Aspirasi (aspirations)
/kontak    → Kontak (contact)
/portal    → Portal (admin dashboard)  ← standalone
/kkn2026   → KKN 2026 showcase         ← standalone
```

Routes `/portal` and `/kkn2026` are **standalone** — they render without Navbar, Footer, or AiraAssistant chat widget.

## Architecture

- **Stack:** React 19, Vite 8 (beta, overridden in `package.json`), Tailwind CSS v4, React Router 7.
- **Animations:** GSAP + ScrollTrigger + Lenis (smooth scroll) on `/kkn2026`; animejs everywhere else.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin. `@import "tailwindcss"` in `index.css` (no `@tailwind` directives).
- **Entry:** `index.html` → `src/main.jsx` → `App.jsx` (BrowserRouter wrapping all routes).
- `src/config/api.js` — centralized `apiUrl()` helper reading `VITE_API_BASE_URL`.
- `src/hooks/` — custom hooks for auth, products, aspirations, programs, messages.
- `src/components/` — feature directories per route; shared components (`Navbar`, `Footer`, `AiraAssistant`, `ScrollToTop`) at root.

## Route-level code splitting

`/portal` and `/kkn2026` are **lazy-loaded** via `React.lazy()` with a `Suspense` fallback. This keeps GSAP, ScrollTrigger, Lenis, and all Portal components out of the main bundle. The main bundle is ~338 KB (down from ~598 KB).

## Performance conventions

- **React.memo** added to `Navbar`, `Footer`, `AiraAssistant` to prevent re-renders on route changes.
- **`content-visibility: auto`** on below-fold sections (`HighlightKegiatan`, `Statistik`, `PenjelasanLogo`) to defer off-screen rendering.
- **`fetchpriority="high"`** on hero image; **`loading="lazy"`** on below-fold images.
- All hero/background images should be WebP, sized appropriately (hero was 5456×3632px/1.1MB, now 2000×1333/195KB).

## KKN 2026 page (`/kkn2026`)

- Large (~1k lines), all-in-one page component with subcomponents in `components/kkn2026/components/`.
- Design spec in `design.md`: playful organic EdTech style, dual typography (rounded sans + handwriting), HIMA Green/Yellow palette, extreme border-radius cards, inline SVG decorations (blobs, scribbles, concentric circles).
- Uses GSAP, ScrollTrigger, and Lenis for scroll-driven animations (lazy-loaded via code splitting).

## ESLint

- Config in `eslint.config.js` (flat config, ESLint 9).
- Ignores `dist/`.
- `no-unused-vars` allows underscore-prefixed vars (`^[A-Z_]`). `react-hooks/set-state-in-effect` is explicitly disabled.
