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
  app/
    layout.tsx              # ThemeProvider (next-themes), Toaster (sonner)
    page.tsx                # Three-panel layout with AnimatePresence
  components/
    ui/                     # shadcn/ui primitives (do not edit directly)
    canvas/
      index.tsx             # ComponentCanvas — 5 group sections + SurfaceNestingDemo
      specimen.tsx          # Specimen — named wrapper for each component demo
      section-nav.tsx       # SectionNav — sticky grouped-mode nav (z-20; must beat day-picker stacking)
      surface-nesting-demo.tsx
      groups/
        inputs-forms.tsx    # InputsFormsGroup — 20 components
        data-display.tsx    # DataDisplayGroup — 11 components
        feedback.tsx        # FeedbackGroup — 9 components
        navigation-group.tsx # NavigationGroup — 13 components
        layout-group.tsx    # LayoutGroup — 4 components
    panels/
      scale-editor/index.tsx  # ScaleEditor panel (placeholder)
      theme-editor/index.tsx  # ThemeEditor panel (placeholder)
    playground/
      top-bar.tsx           # Logo, panel toggles, view mode, theme select, export
      status-bar.tsx        # Token count, contrast, gamut status
      canvas-wrapper.tsx    # CanvasWrapper — injects resolved tokens as CSS vars + portal <style>
  hooks/
    use-resolved-tokens.ts  # useResolvedTokens() — memoized CSS variable map
  lib/
    utils.ts                # cn() helper (clsx + tailwind-merge)
    types.ts                # ColorStep, ColorScale, SemanticTokenMap, ThemeSet, etc.
    constants.ts            # Shared constants
    color/
      converter.ts          # oklchToCSS, oklchToHex, oklchToHSL, cssToOklch, etc.
      contrast.ts           # wcagContrastRatio, apcaContrast, contrastLevel
      gamut.ts              # isInSRGB, clampToSRGB, countOutOfGamut
      generator.ts          # generateScale, defaultGeneratorSettings
      radix-presets.ts      # RADIX_SCALES_LIGHT/DARK, getRadixScale
    tokens/
      bridge.ts             # CSS_BRIDGE_MAP, REVERSE_BRIDGE_MAP, generateBridgeCSS
      semantic-tokens.ts    # SEMANTIC_TOKENS descriptors, SEMANTIC_TOKEN_MAP
      resolve.ts            # resolveTokenRef, resolveAllTokens, resolveWithBridge
    stores/
      scale-store.ts        # useScaleStore — ColorScale[] with Immer + persist
      theme-store.ts        # useThemeStore — ThemeSet[], activeThemeId
      playground-store.ts   # usePlaygroundStore — panel state, canvasViewMode
```

## Commands

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Production build
npm run start    # Serve production build
```

## shadcn/ui is built on @base-ui/react, NOT @radix-ui

This is the most important gotcha. The `src/components/ui/` components wrap `@base-ui/react` primitives. The API differs from Radix in key ways:

- **`render` prop instead of `asChild`**: Use `<DropdownMenuTrigger render={<Button>...</Button>} />` — `asChild` does not exist on base-ui components.
- **Select `onValueChange` receives `string | null`**: Guard with `(val) => val && handler(val)` to satisfy TypeScript.
- **ToggleGroup**: Each `ToggleGroupItem` is controlled via `pressed` / `onPressedChange` props — there is no `value` prop on the group for single-select.
- **`Accordion` `defaultValue` takes `string[]`**: Pass an array — `<Accordion defaultValue={['item-1']}>`. A plain string silently fails to open the item.
- **`react-resizable-panels` uses `orientation` not `direction`**: `<ResizablePanelGroup orientation="horizontal">` — the `direction` prop no longer exists in v2. TypeScript error cites `HTMLDivElement` which is misleading.
- **`Sidebar` from `sidebar.tsx` is layout-only**: It uses `position: fixed; inset-y: 0` and requires `SidebarProvider` context — not suitable for inline specimens. For icon-only sidebar demos, use a plain `<div>` with `bg-sidebar`, `bg-sidebar-accent`, `text-sidebar-foreground`, `text-sidebar-accent-foreground` CSS variables directly.

## Layout Architecture (`src/app/page.tsx`)

Three-panel layout:
- **Left panel** — 320px (`w-80`), collapsible, contains `<ScaleEditor />`
- **Center canvas** — `flex-1 overflow-auto min-w-0`, contains `<ComponentCanvas />`
- **Right panel** — 380px (`w-[380px]`), collapsible, contains `<ThemeEditor />`

Panels animate with Framer Motion `AnimatePresence` (slide on x-axis + opacity, 200ms easeInOut). On viewports < 1280px (`max-xl:`), panels switch to `absolute` overlay mode with `z-10` and `shadow-lg`.

Keyboard shortcuts in `page.tsx`: `[` toggles left panel, `]` toggles right panel. The handler skips INPUT, TEXTAREA, and contentEditable targets.

## Zustand Stores

All stores use `persist` + `immer` middleware:

- **`useScaleStore`** (`scale-store.ts`) — `scales: ColorScale[]`. Three default scales: gray (`default-gray`, hand-crafted steps), blue (`default-blue`, hue 250, gaussian), red (`default-red`, hue 25, gaussian). Blue and red are generated at module load via `generateScale()`. Exports `DEFAULT_SCALE_ID`, `DEFAULT_BLUE_SCALE_ID`, `DEFAULT_RED_SCALE_ID`. Actions: `addScale`, `updateScale`, `updateStep`, `removeScale`, `duplicateScale`, `reorderScales`.
- **`useThemeStore`** (`theme-store.ts`) — `themes: ThemeSet[]`, `activeThemeId`. Default theme id `'default-light'`: surfaces/foregrounds/borders → gray scale, accent/hover/ring → blue scale (step 9 solid, step 8 ring), destructive → red scale (step 9). Actions: `addTheme`, `updateTheme`, `setToken`, `removeTheme`, `duplicateTheme`, `setActiveTheme`.
- **`usePlaygroundStore`** (`playground-store.ts`) — `leftPanelOpen`, `rightPanelOpen`, `canvasViewMode: CanvasViewMode`, `activeComponentGroup`, `selectedScaleId`. All persisted.

## Canvas Theming

`CanvasWrapper` (`src/components/playground/canvas-wrapper.tsx`) is the live theming boundary:

1. Calls `useResolvedTokens()` to get all resolved `oklch()` values as a flat `Record<cssVar, string>`.
2. Applies that record as inline `style` on a `<div class="playground-theme [dark]">` — tokens are available on first render without flash.
3. On every token change, updates a `<style data-playground-theme>` tag injected into `<head>` that writes the same variables to:
   - `.playground-theme` (the wrapper itself)
   - `[data-radix-popper-content-wrapper]`, `[role="dialog"]`, `.sonner-toaster`, `[data-vaul-drawer-wrapper]` (Radix/Vaul portals)
   - `[data-slot="tooltip-content"]`, `[data-slot="dropdown-menu-content"]`, `[data-slot="context-menu-content"]`, `[data-slot="hover-card-content"]`, `[data-slot="popover-content"]` (base-ui portals)
   - **NavigationMenu** portals have no `data-slot` on their `Popup` — they cannot be targeted and fall back to document-level CSS variables.

**localStorage note**: Zustand `persist` restores the last saved state on load. After changing default store initialization, clear localStorage (DevTools → Application → Storage → Clear site data) to see the new defaults.

## Data Model

Colors are stored in **OKLCH** (`l`, `c`, `h`, `a`) — chosen for perceptual uniformity and clean chroma curves. Conversion to hex/hsl/rgb/CSS happens at render time via `src/lib/color/converter.ts`. Gamut checking (sRGB displayability) is via culori's `displayable()`; use `clampToSRGB()` to reduce chroma on out-of-gamut colors.

`SemanticTokenMap` values are `TokenRef = { scaleId, stepIndex }` — an indirection that lets a single scale edit propagate across all themes referencing it.

## Color Architecture

### Scale Generation

Scales are always 12 steps, index 1 (lightest) → 12 (darkest) — Radix convention, not 0-based. `generateScale()` in `src/lib/color/generator.ts` supports three chroma curves:
- `gaussian` — chroma peaks at a configurable lightness mean/sigma
- `linear` — constant chroma across all steps
- `manual` — constant (reserved for direct step editing)

### Radix Presets

`src/lib/color/radix-presets.ts` exports 62 pre-converted `ColorScale` objects (31 scales × light/dark). IDs follow `radix-{name}-{mode}` (e.g., `radix-indigo-light`). Use `getRadixScale(name, mode)` as the primary accessor. Available scales: gray, mauve, slate, sage, olive, sand, gold, bronze, brown, yellow, amber, orange, tomato, red, ruby, crimson, pink, plum, purple, violet, iris, indigo, blue, cyan, teal, jade, green, grass, lime, mint, sky.

### Token Resolution

`resolveWithBridge()` in `src/lib/tokens/resolve.ts` resolves all `TokenRef` values to `oklch()` strings AND fans out to shadcn/ui CSS variable names via `CSS_BRIDGE_MAP`. Always use `resolveWithBridge` (not `resolveAllTokens`) when injecting tokens into the DOM — it produces both our names and shadcn's in one pass. The `useResolvedTokens()` hook in `src/hooks/` returns a memoized version backed by both Zustand stores.

### Contrast

`src/lib/color/contrast.ts` exports both WCAG (`wcagContrastRatio`) and APCA (`apcaContrast`) algorithms. `contrastLevel()` thresholds: ≥4.5 = `pass`, ≥3.0 = `large-only`, <3.0 = `fail`.

## Typography Conventions

Typography is **not tokenized** — there are no font-size, font-weight, line-height, or letter-spacing tokens in the semantic token pipeline. Font families are registered as CSS custom properties in `globals.css` (`--font-sans`, `--font-mono`) and applied via `html { @apply font-sans; }`. All other typography decisions are expressed as Tailwind utility classes directly in components:

- **Headings/short text** — `text-balance`
- **Body/descriptions** — `text-pretty`
- **Root layout** — `antialiased` on `<html>`
- **Dynamic numbers** — `tabular-nums`

## Code Conventions

- Use `cn()` from `@/lib/utils` for conditional class merging
- Prefer CSS variables for tokens — they live in `globals.css`
- State slices go in `src/lib/stores/` using Zustand + Immer
- Don't modify `src/components/ui/` files — extend by composition

### Flex scroll pattern

Any scrollable panel or modal must follow this three-part pattern or the `ScrollArea` will expand to its natural height instead of scrolling:

1. **Outer container** — `flex flex-col max-h-[X] overflow-hidden` (all three are required; `overflow-hidden` is the one most often forgotten)
2. **Fixed regions** — `shrink-0` on headers, footers, toolbars
3. **Scroll region** — `<ScrollArea className="flex-1 min-h-0">`

Without `overflow-hidden` on the outer container, `max-height` does not clip flex children and `flex-1 min-h-0` has no bounded height to work within.
