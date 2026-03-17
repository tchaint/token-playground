# token-playground

A Next.js 15 app for exploring and building design token systems — color scales, typography, spacing, and contrast tooling.

## Stack

- **Next.js 15** — App Router, React 19, Turbopack
- **TypeScript** — strict mode
- **Tailwind CSS v4** — CSS-first config via `globals.css`
- **shadcn/ui** — base-nova style, all components installed at `src/components/ui/`
- **Zustand + Immer** — state management with immutable updates
- **Framer Motion** — animations
- **next-themes** — dark/light mode
- **Sonner** — toast notifications

## Color & Contrast

- **culori** — color space conversions and manipulation
- **@radix-ui/colors** — pre-built color scales (P3-aware)
- **apca-w3** — APCA contrast algorithm for accessible color pairing

## Project Structure

```
src/
  app/          # Routes and layouts
  components/
    ui/         # shadcn/ui primitives (do not edit directly)
  hooks/        # Shared React hooks
  lib/
    utils.ts    # cn() helper (clsx + tailwind-merge)
```

## Commands

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Production build
npm run start    # Serve production build
```

## Typography Conventions

Apply these consistently across all UI:

- **Headings/short text** — `text-balance` (text-wrap: balance, ≤6 lines)
- **Body/descriptions** — `text-pretty` (text-wrap: pretty, avoids orphans)
- **Root layout** — `antialiased` on `<html>` for macOS font smoothing
- **Dynamic numbers** (counters, prices, timers) — `tabular-nums`
- **Code/pre-formatted text** — no text-wrap override

## Code Conventions

- Use `cn()` from `@/lib/utils` for conditional class merging
- Prefer CSS variables for tokens — they live in `globals.css`
- State slices go in `src/lib/store/` using Zustand + Immer
- Don't modify `src/components/ui/` files — extend by composition
