import type { SemanticTokenMap } from '../types'

// ─── Semantic Token Descriptor ────────────────────────────────────────────────

export interface SemanticTokenDescriptor {
  /** Matches the camelCase key in SemanticTokenMap */
  key: keyof SemanticTokenMap
  /** The CSS custom property name (with -- prefix) */
  cssVariable: string
  /** Display group for Panel C organization */
  group:
    | 'backgrounds'
    | 'foreground-emphasis'
    | 'foreground-surface'
    | 'accent'
    | 'borders-structural'
    | 'borders-semantic'
    | 'focus'
  /** Short role description */
  description: string
  /**
   * For foreground tokens: surface token keys this token must pass 4.5:1 against.
   * Only present on foreground tokens where contrast is validated.
   */
  contrastTargets?: (keyof SemanticTokenMap)[]
}

// ─── Token Definitions ────────────────────────────────────────────────────────

export const SEMANTIC_TOKENS: SemanticTokenDescriptor[] = [
  // ── Backgrounds ──────────────────────────────────────────────────────────────

  {
    key: 'backgroundPrimary',
    cssVariable: '--background-primary',
    group: 'backgrounds',
    description: 'Page canvas; highest-level surface',
  },
  {
    key: 'backgroundSecondary',
    cssVariable: '--background-secondary',
    group: 'backgrounds',
    description: 'Cards, sections, sidebar panels',
  },
  {
    key: 'backgroundTertiary',
    cssVariable: '--background-tertiary',
    group: 'backgrounds',
    description: 'Nested/inset surfaces: wells, code blocks, table rows inside cards',
  },
  {
    key: 'backgroundPopover',
    cssVariable: '--background-popover',
    group: 'backgrounds',
    description: 'Floating surfaces (dropdowns, tooltips). Named rather than ranked — float behavior is orthogonal to depth',
  },
  {
    key: 'backgroundOverlay',
    cssVariable: '--background-overlay',
    group: 'backgrounds',
    description: 'Scrim/backdrop behind modals and drawers. Typically a semi-transparent dark value',
  },

  // ── Foreground — Emphasis ─────────────────────────────────────────────────────

  {
    key: 'foregroundPrimary',
    cssVariable: '--foreground-primary',
    group: 'foreground-emphasis',
    description: 'Headings, body copy, primary labels. Highest emphasis',
    contrastTargets: ['backgroundPrimary', 'backgroundSecondary', 'backgroundTertiary'],
  },
  {
    key: 'foregroundSecondary',
    cssVariable: '--foreground-secondary',
    group: 'foreground-emphasis',
    description: 'Descriptions, metadata, timestamps, secondary labels. Medium emphasis',
    contrastTargets: ['backgroundPrimary', 'backgroundSecondary', 'backgroundTertiary'],
  },
  {
    key: 'foregroundTertiary',
    cssVariable: '--foreground-tertiary',
    group: 'foreground-emphasis',
    description: 'Placeholders, helper text, disabled content, captions. Lowest emphasis',
    contrastTargets: ['backgroundPrimary', 'backgroundSecondary'],
    // Note: 4.5:1 against backgroundTertiary is NOT guaranteed — see contrast matrix
  },

  // ── Foreground — Surface Overrides ────────────────────────────────────────────

  {
    key: 'foregroundPopover',
    cssVariable: '--foreground-popover',
    group: 'foreground-surface',
    description: 'Default text on --background-popover',
    contrastTargets: ['backgroundPopover'],
  },
  {
    key: 'foregroundOverlay',
    cssVariable: '--foreground-overlay',
    group: 'foreground-surface',
    description: 'Default text on --background-overlay (e.g., text on a scrim)',
    contrastTargets: ['backgroundOverlay'],
  },

  // ── Accent ────────────────────────────────────────────────────────────────────

  {
    key: 'accentPrimary',
    cssVariable: '--accent-primary',
    group: 'accent',
    description: 'Main CTA fill color',
  },
  {
    key: 'accentPrimaryForeground',
    cssVariable: '--accent-primary-foreground',
    group: 'accent',
    description: 'Text/icon color on --accent-primary',
    contrastTargets: ['accentPrimary'],
  },
  {
    key: 'accentSecondary',
    cssVariable: '--accent-secondary',
    group: 'accent',
    description: 'Subdued/ghost action fill',
  },
  {
    key: 'accentSecondaryForeground',
    cssVariable: '--accent-secondary-foreground',
    group: 'accent',
    description: 'Text/icon color on --accent-secondary',
    contrastTargets: ['accentSecondary'],
  },
  {
    key: 'accentHover',
    cssVariable: '--accent-hover',
    group: 'accent',
    description: 'Hover/focus highlight on interactive elements',
  },
  {
    key: 'accentHoverForeground',
    cssVariable: '--accent-hover-foreground',
    group: 'accent',
    description: 'Text/icon color on --accent-hover',
    contrastTargets: ['accentHover'],
  },
  {
    key: 'accentDestructive',
    cssVariable: '--accent-destructive',
    group: 'accent',
    description: 'Danger/error action fill',
  },
  {
    key: 'accentDestructiveForeground',
    cssVariable: '--accent-destructive-foreground',
    group: 'accent',
    description: 'Text/icon color on --accent-destructive',
    contrastTargets: ['accentDestructive'],
  },
  {
    key: 'accentWarning',
    cssVariable: '--accent-warning',
    group: 'accent',
    description: 'Caution action fill (e.g., confirmations with consequences)',
  },
  {
    key: 'accentWarningForeground',
    cssVariable: '--accent-warning-foreground',
    group: 'accent',
    description: 'Text/icon color on --accent-warning',
    contrastTargets: ['accentWarning'],
  },
  {
    key: 'accentSuccess',
    cssVariable: '--accent-success',
    group: 'accent',
    description: 'Positive/completion action fill (e.g., save confirmations, status)',
  },
  {
    key: 'accentSuccessForeground',
    cssVariable: '--accent-success-foreground',
    group: 'accent',
    description: 'Text/icon color on --accent-success',
    contrastTargets: ['accentSuccess'],
  },
  {
    key: 'accentInfo',
    cssVariable: '--accent-info',
    group: 'accent',
    description: 'Informational action fill (e.g., tips, callouts, non-urgent alerts)',
  },
  {
    key: 'accentInfoForeground',
    cssVariable: '--accent-info-foreground',
    group: 'accent',
    description: 'Text/icon color on --accent-info',
    contrastTargets: ['accentInfo'],
  },

  // ── Borders — Structural ──────────────────────────────────────────────────────

  {
    key: 'borderPrimary',
    cssVariable: '--border-primary',
    group: 'borders-structural',
    description: 'Default structural borders: cards, dividers, table rules',
  },
  {
    key: 'borderSecondary',
    cssVariable: '--border-secondary',
    group: 'borders-structural',
    description: 'Subtle/low-contrast borders: section separators, nested containers',
  },
  {
    key: 'borderInput',
    cssVariable: '--border-input',
    group: 'borders-structural',
    description: 'Form field borders (kept specific for focus-state pairing)',
  },

  // ── Borders — Semantic ────────────────────────────────────────────────────────

  {
    key: 'borderDestructivePrimary',
    cssVariable: '--border-destructive-primary',
    group: 'borders-semantic',
    description: 'High-emphasis error: invalid fields, alert containers',
  },
  {
    key: 'borderDestructiveSecondary',
    cssVariable: '--border-destructive-secondary',
    group: 'borders-semantic',
    description: 'Subtle error: secondary validation, warning-adjacent',
  },
  {
    key: 'borderWarningPrimary',
    cssVariable: '--border-warning-primary',
    group: 'borders-semantic',
    description: 'High-emphasis warning: caution alerts, attention states',
  },
  {
    key: 'borderWarningSecondary',
    cssVariable: '--border-warning-secondary',
    group: 'borders-semantic',
    description: 'Subtle warning: advisory containers, soft caution',
  },
  {
    key: 'borderSuccessPrimary',
    cssVariable: '--border-success-primary',
    group: 'borders-semantic',
    description: 'High-emphasis success: confirmed states, valid fields',
  },
  {
    key: 'borderSuccessSecondary',
    cssVariable: '--border-success-secondary',
    group: 'borders-semantic',
    description: 'Subtle success: passive completion indicators',
  },
  {
    key: 'borderInfoPrimary',
    cssVariable: '--border-info-primary',
    group: 'borders-semantic',
    description: 'High-emphasis info: tip containers, highlighted callouts',
  },
  {
    key: 'borderInfoSecondary',
    cssVariable: '--border-info-secondary',
    group: 'borders-semantic',
    description: 'Subtle info: background callout borders, soft emphasis',
  },

  // ── Focus ─────────────────────────────────────────────────────────────────────

  {
    key: 'ring',
    cssVariable: '--ring',
    group: 'focus',
    description: 'Focus indicator color. Paired with --radius',
  },
]

// ─── Lookup Map ───────────────────────────────────────────────────────────────

/** Look up a token descriptor by its SemanticTokenMap key */
export const SEMANTIC_TOKEN_MAP = Object.fromEntries(
  SEMANTIC_TOKENS.map((t) => [t.key, t])
) as Record<keyof SemanticTokenMap, SemanticTokenDescriptor>

/** Look up a token descriptor by its CSS variable name */
export const SEMANTIC_TOKEN_BY_CSS_VAR = Object.fromEntries(
  SEMANTIC_TOKENS.map((t) => [t.cssVariable, t])
) as Record<string, SemanticTokenDescriptor>
