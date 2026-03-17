// ─── Color Scale ─────────────────────────────────────────────────────────────

export interface ColorStep {
  index: number // 1–12 (Radix convention)
  oklch: {
    l: number // Lightness: 0–1
    c: number // Chroma: 0–0.4 (practical range)
    h: number // Hue: 0–360
    a: number // Alpha: 0–1
  }
  // Computed at render time, not stored:
  // hex, hsl, rgb (via culori), inGamut (sRGB check via culori)
}

export interface ColorScale {
  id: string // UUID
  name: string // User-defined, e.g. "Brand Blue"
  source: 'custom' | 'radix'
  radixName?: string // If source is 'radix', e.g. "indigo"
  steps: ColorStep[] // 12 steps
  createdAt: number
  updatedAt: number
}

// ─── Scale Generator ─────────────────────────────────────────────────────────

export interface ScaleGeneratorSettings {
  baseHue: number // 0–360
  baseChroma: number // 0–0.4
  lightnessRange: {
    min: number // Darkest step (e.g., 0.15 for step 12)
    max: number // Lightest step (e.g., 0.97 for step 1)
  }
  chromaCurve: 'gaussian' | 'linear' | 'manual'
  gaussianMean?: number // Where chroma peaks (0–1 lightness)
  gaussianSigma?: number // Spread of chroma distribution
}

// ─── Token Reference ─────────────────────────────────────────────────────────

export interface TokenRef {
  scaleId: string
  stepIndex: number // 1–12
}

// ─── Semantic Token Map ───────────────────────────────────────────────────────
//
// Each value is a TokenRef — { scaleId, stepIndex }.
// This indirection is key: changing a scale step updates every theme that
// references it.

export interface SemanticTokenMap {
  // Surfaces
  backgroundPrimary: TokenRef
  backgroundSecondary: TokenRef
  backgroundTertiary: TokenRef
  backgroundPopover: TokenRef
  backgroundOverlay: TokenRef

  // Foreground — Emphasis hierarchy
  foregroundPrimary: TokenRef
  foregroundSecondary: TokenRef
  foregroundTertiary: TokenRef

  // Foreground — Surface-specific overrides
  foregroundPopover: TokenRef
  foregroundOverlay: TokenRef

  // Accent
  accentPrimary: TokenRef
  accentPrimaryForeground: TokenRef
  accentSecondary: TokenRef
  accentSecondaryForeground: TokenRef
  accentHover: TokenRef
  accentHoverForeground: TokenRef
  accentDestructive: TokenRef
  accentDestructiveForeground: TokenRef
  accentWarning: TokenRef
  accentWarningForeground: TokenRef
  accentSuccess: TokenRef
  accentSuccessForeground: TokenRef
  accentInfo: TokenRef
  accentInfoForeground: TokenRef

  // Borders — Structural
  borderPrimary: TokenRef
  borderSecondary: TokenRef
  borderInput: TokenRef

  // Borders — Semantic
  borderDestructivePrimary: TokenRef
  borderDestructiveSecondary: TokenRef
  borderWarningPrimary: TokenRef
  borderWarningSecondary: TokenRef
  borderSuccessPrimary: TokenRef
  borderSuccessSecondary: TokenRef
  borderInfoPrimary: TokenRef
  borderInfoSecondary: TokenRef

  // Focus
  ring: TokenRef
}

// ─── Theme Set ───────────────────────────────────────────────────────────────

export interface ThemeSet {
  id: string
  name: string // e.g. "Light", "Dark", "Brand A"
  mode: 'light' | 'dark' | 'custom'
  tokens: SemanticTokenMap
  createdAt: number
  updatedAt: number
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export type ComponentGroup =
  | 'inputs-forms'
  | 'data-display'
  | 'feedback'
  | 'navigation'
  | 'layout'

export type CanvasViewMode = 'grouped' | 'kitchen-sink'

export type ExportFormat = 'css' | 'css-with-property' | 'tailwind' | 'json'
