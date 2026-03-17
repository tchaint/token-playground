# src/lib/color/

Color utility modules. All operate on the internal OKLCH type `{ l: number, c: number, h: number, a: number }`.

## converter.ts

Bidirectional color format conversion. Internal `toCulori()` bridges the local OKLCH type to culori's format.

- `oklchToCSS(oklch)` → `"oklch(L C H)"` or `"oklch(L C H / A)"` — primary output for CSS variable injection
- `oklchToHex(oklch)` → `"#rrggbb"` — via culori formatHex, defaults to `#000000` on failure
- `oklchToHSL(oklch)` → `"hsl(H S% L%)"` — rounded integers (not culori's decimal output)
- `oklchToRGB(oklch)` → `{ r, g, b, a }` — 0–255 clamped integers
- `cssToOklch(css)` → `Oklch` — parses any CSS color string (hex, hsl, rgb, oklch) via culori; throws on unparseable input
- `formatOklchChannels(oklch)` → `"L C H"` — for Tailwind `oklch(var(--color) / <alpha>)` usage

## contrast.ts

Two contrast algorithms available; APCA is more accurate for modern display text legibility.

- `wcagContrastRatio(fg, bg)` → number — accepts any CSS color strings
- `apcaContrast(fg, bg)` → number (Lc value) — converts via culori to 0–255 RGB before calling `sRGBtoY` + `APCAcontrast`
- `contrastLevel(ratio)` → `'pass' | 'large-only' | 'fail'` — thresholds: ≥4.5 pass, ≥3.0 large-only

## gamut.ts

- `isInSRGB(oklch)` → boolean — converts to rgb first (culori handles); do not call `displayable()` on raw oklch
- `clampToSRGB(oklch)` → Oklch — reduces chroma until displayable; preserves L and H, resets C
- `countOutOfGamut(steps: ColorStep[])` → number — quick audit of a full scale

## generator.ts

Procedural scale generation; always outputs exactly 12 steps.

- `generateScale(settings)` → `ColorStep[12]`
  - Step 1 = `lightnessRange.max` (lightest), step 12 = `lightnessRange.min` (darkest)
  - `gaussian` curve: `c = baseChroma × exp(-0.5 × ((l - mean) / sigma)²)`
  - `linear` and `manual` both use constant `baseChroma`
- `defaultGeneratorSettings()` → `{ baseHue: 250, baseChroma: 0.15, lightnessRange: { min: 0.20, max: 0.97 }, chromaCurve: 'gaussian', gaussianMean: 0.6, gaussianSigma: 0.2 }`

## radix-presets.ts

All 31 Radix color scales converted to `ColorScale` format at module load time (once).

- `RADIX_SCALE_NAMES` — sorted `string[]` of all 31 scale names
- `RADIX_SCALES_LIGHT` — `Record<name, ColorScale>` for light variants
- `RADIX_SCALES_DARK` — `Record<name, ColorScale>` for dark variants
- `getRadixScale(name, mode)` — convenience accessor; throws if name not found

**ID format**: `radix-{name}-{mode}` (e.g., `radix-slate-dark`, `radix-indigo-light`)

**createdAt/updatedAt** are set to `0` for all presets (they are read-only; never mutated).

Bad conversions are skipped with `console.warn` rather than throwing, so the module loads safely even if a scale is missing.
