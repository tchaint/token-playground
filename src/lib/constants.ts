import type { ComponentGroup } from './types'

// ─── Semantic Token CSS Variable Names ───────────────────────────────────────
//
// Flat list of all 36 semantic token CSS custom property names.
// Source of truth for iteration (export, validation, bridge CSS generation).

export const SEMANTIC_TOKEN_NAMES: string[] = [
  // Backgrounds (5)
  '--background-primary',
  '--background-secondary',
  '--background-tertiary',
  '--background-popover',
  '--background-overlay',

  // Foreground — Emphasis (3)
  '--foreground-primary',
  '--foreground-secondary',
  '--foreground-tertiary',

  // Foreground — Surface Overrides (2)
  '--foreground-popover',
  '--foreground-overlay',

  // Accent (14 — 7 pairs)
  '--accent-primary',
  '--accent-primary-foreground',
  '--accent-secondary',
  '--accent-secondary-foreground',
  '--accent-hover',
  '--accent-hover-foreground',
  '--accent-destructive',
  '--accent-destructive-foreground',
  '--accent-warning',
  '--accent-warning-foreground',
  '--accent-success',
  '--accent-success-foreground',
  '--accent-info',
  '--accent-info-foreground',

  // Borders — Structural (3)
  '--border-primary',
  '--border-secondary',
  '--border-input',

  // Borders — Semantic (8 — 4 pairs)
  '--border-destructive-primary',
  '--border-destructive-secondary',
  '--border-warning-primary',
  '--border-warning-secondary',
  '--border-success-primary',
  '--border-success-secondary',
  '--border-info-primary',
  '--border-info-secondary',

  // Focus (1)
  '--ring',
]

// ─── Semantic Token Groups ────────────────────────────────────────────────────
//
// Tokens organized into display groups for Panel C (Theme Set Editor).
// Each key matches the corresponding camelCase key in SemanticTokenMap.

export const SEMANTIC_TOKEN_GROUPS: Array<{
  id: string
  label: string
  tokens: (keyof import('./types').SemanticTokenMap)[]
}> = [
  {
    id: 'backgrounds',
    label: 'Backgrounds',
    tokens: [
      'backgroundPrimary',
      'backgroundSecondary',
      'backgroundTertiary',
      'backgroundPopover',
      'backgroundOverlay',
    ],
  },
  {
    id: 'foreground-emphasis',
    label: 'Foreground — Emphasis',
    tokens: ['foregroundPrimary', 'foregroundSecondary', 'foregroundTertiary'],
  },
  {
    id: 'foreground-surface',
    label: 'Foreground — Surface Overrides',
    tokens: ['foregroundPopover', 'foregroundOverlay'],
  },
  {
    id: 'accent',
    label: 'Accent',
    tokens: [
      'accentPrimary',
      'accentPrimaryForeground',
      'accentSecondary',
      'accentSecondaryForeground',
      'accentHover',
      'accentHoverForeground',
      'accentDestructive',
      'accentDestructiveForeground',
      'accentWarning',
      'accentWarningForeground',
      'accentSuccess',
      'accentSuccessForeground',
      'accentInfo',
      'accentInfoForeground',
    ],
  },
  {
    id: 'borders-structural',
    label: 'Borders — Structural',
    tokens: ['borderPrimary', 'borderSecondary', 'borderInput'],
  },
  {
    id: 'borders-semantic',
    label: 'Borders — Semantic',
    tokens: [
      'borderDestructivePrimary',
      'borderDestructiveSecondary',
      'borderWarningPrimary',
      'borderWarningSecondary',
      'borderSuccessPrimary',
      'borderSuccessSecondary',
      'borderInfoPrimary',
      'borderInfoSecondary',
    ],
  },
  {
    id: 'focus',
    label: 'Focus',
    tokens: ['ring'],
  },
]

// ─── Radix Step Labels ────────────────────────────────────────────────────────
//
// Use-case hints for each of the 12 steps, following Radix UI conventions.
// Index 0 = step 1 (app background), index 11 = step 12 (hi-contrast text).

export const RADIX_STEP_LABELS: string[] = [
  'App background',      // 1
  'Subtle background',   // 2
  'Component background',// 3
  'Hover background',    // 4
  'Active background',   // 5
  'Subtle border',       // 6
  'Border',              // 7
  'Strong border',       // 8
  'Solid background',    // 9
  'Hover solid',         // 10
  'Lo-contrast text',    // 11
  'Hi-contrast text',    // 12
]

// ─── Component Groups ─────────────────────────────────────────────────────────
//
// Used by Panel B (Component Canvas) to organize specimens into sections.

export const COMPONENT_GROUPS: Array<{
  id: ComponentGroup
  label: string
  components: string[]
}> = [
  {
    id: 'inputs-forms',
    label: 'Inputs & Forms',
    components: [
      'Button',
      'Button Group',
      'Calendar',
      'Checkbox',
      'Combobox',
      'Command',
      'Date Picker',
      'Field',
      'Input',
      'Input Group',
      'Input OTP',
      'Label',
      'Native Select',
      'Radio Group',
      'Select',
      'Slider',
      'Switch',
      'Textarea',
      'Toggle',
      'Toggle Group',
    ],
  },
  {
    id: 'data-display',
    label: 'Data Display',
    components: [
      'Avatar',
      'Badge',
      'Card',
      'Chart',
      'Data Table',
      'Item',
      'Kbd',
      'Skeleton',
      'Spinner',
      'Table',
      'Typography',
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    components: [
      'Alert',
      'Alert Dialog',
      'Dialog',
      'Drawer',
      'Empty',
      'Progress',
      'Sheet',
      'Sonner',
      'Tooltip',
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    components: [
      'Accordion',
      'Breadcrumb',
      'Collapsible',
      'Context Menu',
      'Dropdown Menu',
      'Hover Card',
      'Menubar',
      'Navigation Menu',
      'Pagination',
      'Popover',
      'Scroll Area',
      'Sidebar',
      'Tabs',
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    components: ['Aspect Ratio', 'Direction', 'Resizable', 'Separator'],
  },
]
