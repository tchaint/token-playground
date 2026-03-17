# Token Playground — Implementation Plan

> A Claude Code–ready spec for building a color token system playground
> with OKLCH scale creation, Radix preset support, semantic token mapping,
> and a live shadcn/ui component preview canvas.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Tech Stack](#2-architecture--tech-stack)
3. [Information Architecture](#3-information-architecture)
4. [Data Model](#4-data-model)
5. [Panel A: Color Scale Editor (Left)](#5-panel-a-color-scale-editor-left)
6. [Panel B: Component Canvas (Center)](#6-panel-b-component-canvas-center)
7. [Panel C: Theme Set Editor (Right)](#7-panel-c-theme-set-editor-right)
8. [Export System](#8-export-system)
9. [Theming Pipeline (How Live Preview Works)](#9-theming-pipeline-how-live-preview-works)
10. [Component Inventory & Grouping](#10-component-inventory--grouping)
11. [Accessibility & Contrast Validation](#11-accessibility--contrast-validation)
12. [Milestones & Build Order](#12-milestones--build-order)
13. [File Structure](#13-file-structure)
14. [Key Implementation Notes for Claude Code](#14-key-implementation-notes-for-claude-code)

---

## 1. Project Overview

### What we're building

A browser-based playground for designing, previewing, and exporting color token systems built on the revised semantic token architecture (see `revised-token-reference.md`). The tool has three panels:

- **Left panel** — Create and manage color scales (custom OKLCH or Radix presets)
- **Center canvas** — Live preview of all 57 shadcn/ui components, themed in real time
- **Right panel** — Define theme sets (light, dark, custom) by mapping semantic tokens to scale values

### Who it's for

Design engineers and design system maintainers who need to:
- Build OKLCH color scales with accessible contrast
- Map those scales to the semantic token architecture
- Preview the result across every component before committing
- Export production-ready CSS, Tailwind config, and JSON

### Key interactions

- Changing any token value in the right panel instantly updates every component in the canvas
- Color scales can be generated from a base hue + chroma, then fine-tuned per step
- Radix UI preset scales can be imported and used alongside custom scales
- Themes can be duplicated, compared, and exported independently

---

## 2. Architecture & Tech Stack

### Framework

**Next.js 15 (App Router)** with React 19. shadcn/ui is built on this stack, so we're eating our own dog food — the playground's chrome uses shadcn/ui components, and the canvas renders them with the user's theme applied.

### Key Dependencies

| Package | Purpose |
|---|---|
| `next` | App framework |
| `tailwindcss` v4 | Utility styling |
| `shadcn/ui` | All 57 components (installed via CLI) |
| `culori` | OKLCH color math, gamut checking, format conversion |
| `zustand` | Global state (scales, themes, active selections) |
| `@radix-ui/colors` | Preset color scale data (imported as JS objects) |
| `immer` | Immutable state updates inside Zustand |
| `react-colorful` | Base color picker (hue/chroma wheel), or build custom |
| `framer-motion` | Panel open/close transitions, canvas section transitions |
| `sonner` | Toast notifications (export success, validation warnings) |
| `next-themes` | Dark/light mode toggle for the playground's own chrome |
| `file-saver` | Client-side file export (CSS, JSON, Tailwind config) |

### State Management (Zustand)

Three stores, kept separate for clarity:

```
useScaleStore     — color scales (custom + Radix presets)
useThemeStore     — theme sets + semantic token mappings
usePlaygroundStore — UI state (active panel, canvas view mode, active theme, selected component group)
```

### No backend

Everything runs client-side. State is persisted to `localStorage` (scales and themes) and exportable as files. No auth, no database.

---

## 3. Information Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Top Bar                                                            │
│  [Logo] [Toggle Left Panel] [Canvas View: Grouped | Kitchen Sink]  │
│  [Active Theme Dropdown] [Toggle Right Panel] [Export ▼]           │
├────────────┬──────────────────────────────────┬─────────────────────┤
│            │                                  │                     │
│  Panel A   │        Panel B: Canvas           │    Panel C          │
│  Color     │                                  │    Theme Set        │
│  Scale     │  ┌──── Section Nav ────────┐     │    Editor           │
│  Editor    │  │ Inputs · Display · ...  │     │                     │
│            │  └─────────────────────────┘     │  [Theme selector]   │
│  [Scale    │                                  │  [Token groups]     │
│   list]    │  ┌─── Component Group ─────┐    │                     │
│            │  │                         │    │  Background tokens   │
│  [Scale    │  │  Button variants        │    │  Foreground tokens   │
│   editor]  │  │  Input states           │    │  Accent tokens       │
│            │  │  Checkbox + Radio       │    │  Border tokens       │
│  [Gener-   │  │  ...                    │    │  Focus tokens        │
│   ator]    │  │                         │    │                     │
│            │  └─────────────────────────┘    │  [Contrast matrix]  │
│  [Export   │                                  │  [Export button]    │
│   scale]   │  ┌─── Next Group ──────────┐    │                     │
│            │  │  ...                     │    │                     │
│            │  └──────────────────────────┘    │                     │
│            │                                  │                     │
├────────────┴──────────────────────────────────┴─────────────────────┤
│  Status Bar: Contrast warnings · Token count · Gamut status         │
└─────────────────────────────────────────────────────────────────────┘
```

**Panel widths:** Left ~320px, Right ~380px, both collapsible. Canvas fills remaining space.

**Responsive behavior:** Panels overlay on viewports < 1280px (drawer mode). Canvas is always visible.

---

## 4. Data Model

### Color Scale

```typescript
interface ColorScale {
  id: string;                    // UUID
  name: string;                  // User-defined name, e.g. "Brand Blue"
  source: 'custom' | 'radix';   // Origin
  radixName?: string;            // If source is 'radix', e.g. "indigo"
  steps: ColorStep[];            // 12 steps, matching Radix convention
  createdAt: number;
  updatedAt: number;
}

interface ColorStep {
  index: number;       // 1–12 (Radix convention)
  oklch: {
    l: number;         // Lightness: 0–1
    c: number;         // Chroma: 0–0.4 (practical range)
    h: number;         // Hue: 0–360
    a: number;         // Alpha: 0–1
  };
  // Computed at render time, not stored:
  // - hex, hsl, rgb (via culori)
  // - inGamut (sRGB check via culori)
}
```

### Theme Set

```typescript
interface ThemeSet {
  id: string;
  name: string;                      // e.g. "Light", "Dark", "Brand A"
  mode: 'light' | 'dark' | 'custom'; // Affects surface lightness direction
  tokens: SemanticTokenMap;
  createdAt: number;
  updatedAt: number;
}

interface SemanticTokenMap {
  // Each value is a reference: { scaleId: string, stepIndex: number }
  // This indirection is key — changing a scale step updates every
  // theme that references it.

  // Surfaces
  backgroundPrimary: TokenRef;
  backgroundSecondary: TokenRef;
  backgroundTertiary: TokenRef;
  backgroundPopover: TokenRef;
  backgroundOverlay: TokenRef;

  // Foreground (emphasis hierarchy)
  foregroundPrimary: TokenRef;
  foregroundSecondary: TokenRef;
  foregroundTertiary: TokenRef;

  // Foreground (surface overrides)
  foregroundPopover: TokenRef;
  foregroundOverlay: TokenRef;

  // Accent
  accentPrimary: TokenRef;
  accentPrimaryForeground: TokenRef;
  accentSecondary: TokenRef;
  accentSecondaryForeground: TokenRef;
  accentHover: TokenRef;
  accentHoverForeground: TokenRef;
  accentDestructive: TokenRef;
  accentDestructiveForeground: TokenRef;
  accentWarning: TokenRef;
  accentWarningForeground: TokenRef;
  accentSuccess: TokenRef;
  accentSuccessForeground: TokenRef;
  accentInfo: TokenRef;
  accentInfoForeground: TokenRef;

  // Borders
  borderPrimary: TokenRef;
  borderSecondary: TokenRef;
  borderInput: TokenRef;
  borderDestructivePrimary: TokenRef;
  borderDestructiveSecondary: TokenRef;
  borderWarningPrimary: TokenRef;
  borderWarningSecondary: TokenRef;
  borderSuccessPrimary: TokenRef;
  borderSuccessSecondary: TokenRef;
  borderInfoPrimary: TokenRef;
  borderInfoSecondary: TokenRef;

  // Focus
  ring: TokenRef;
}

interface TokenRef {
  scaleId: string;
  stepIndex: number;    // 1–12
}
```

### Generator Settings (for custom scale creation)

```typescript
interface ScaleGeneratorSettings {
  baseHue: number;         // 0–360
  baseChroma: number;      // 0–0.4
  lightnessRange: {
    min: number;           // Darkest step (e.g., 0.15 for step 12)
    max: number;           // Lightest step (e.g., 0.97 for step 1)
  };
  chromaCurve: 'gaussian' | 'linear' | 'manual';
  gaussianMean?: number;   // Where chroma peaks (0–1 lightness)
  gaussianSigma?: number;  // Spread of chroma distribution
}
```

---

## 5. Panel A: Color Scale Editor (Left)

### 5.1 Scale List

Top section of the panel. Shows all scales (custom + imported Radix).

- Each scale shows: name, 12-step swatch strip, source badge ("Custom" or "Radix")
- Click to select and open in the editor below
- "New Scale" button → opens generator
- "Import Radix Scale" button → opens a picker with all ~30 Radix scales
- Drag to reorder (cosmetic, for organization)
- Right-click or `...` menu: Duplicate, Rename, Delete, Export

### 5.2 Scale Generator (Custom Scales)

When creating a new custom scale, the generator is the first step.

**Controls:**
- **Hue** — slider (0–360) with a hue ring visualization
- **Base Chroma** — slider (0–0.4) showing saturation intensity
- **Lightness Range** — dual-thumb slider for min/max
- **Chroma Distribution** — dropdown: Gaussian (default), Linear, Manual
  - Gaussian shows mean + sigma sliders
  - A small curve preview shows chroma distribution across the 12 steps
- **"Generate" button** — populates all 12 steps based on settings

The generator uses culori to interpolate 12 steps in OKLCH space:
- Lightness is linearly distributed between min and max
- Chroma follows the selected curve (Gaussian recommended — peaks at step 9, the "purest" step, matching Radix convention)
- Hue is held constant (can be offset per step in fine-tuning)

### 5.3 Per-Step Fine-Tuning

After generation (or when editing an existing scale), each step is editable:

- **12 rows**, one per step. Each row shows:
  - Step number (1–12)
  - Color swatch
  - L / C / H / A inputs (number fields with drag-to-adjust)
  - Hex value (read-only, computed via culori)
  - Gamut warning icon if the step is outside sRGB
  - Use-case hint label (subtle text): "App bg", "Subtle bg", "Component bg", "Hover", "Active", "Subtle border", "Border", "Strong border", "Solid bg", "Hover solid", "Lo-contrast text", "Hi-contrast text" — following Radix conventions for steps 1–12

- **Linked editing mode** (toggle): adjusting one step's lightness proportionally shifts adjacent steps to maintain even distribution. Off by default.

- **Gamut indicator** in the panel header: green check if all 12 steps are within sRGB, yellow warning with count if any are out of gamut. Clicking the warning offers "Clamp to sRGB" which uses `culori.clampChroma` on out-of-gamut steps.

### 5.4 Radix Import

Clicking "Import Radix Scale" opens a modal/sheet with:
- Grid of all Radix color scales (~30) showing name + swatch strip
- Toggle for light/dark variant
- Toggle for solid/alpha variant
- Search/filter by name
- Click imports the scale as a read-only ColorScale with `source: 'radix'`
- "Duplicate as Custom" converts it to an editable custom scale

The Radix scale data comes from `@radix-ui/colors` npm package. At build time or init, we convert all Radix scale values to OKLCH using culori and store them in the same `ColorStep` format.

### 5.5 Scale Export

Exports the selected scale as:
- **CSS custom properties** — `--{scale-name}-1` through `--{scale-name}-12` in `oklch()` format
- **JSON** — the raw `ColorStep[]` array with OKLCH + computed hex/hsl/rgb
- **Tailwind config snippet** — a color object ready to drop into `tailwind.config`

Export triggers a download dialog with format selector.

---

## 6. Panel B: Component Canvas (Center)

### 6.1 Layout Modes

**Grouped view (default):** Components are organized into collapsible sections by category. A sticky horizontal section nav at the top of the canvas allows jumping between groups. Smooth-scrolling anchor navigation.

**Kitchen sink view (toggle):** All components rendered in a single flat flow, no grouping. Toggle via a button in the top bar.

### 6.2 Component Groups

| Group | Components |
|---|---|
| **Inputs & Forms** | Button, Button Group, Calendar, Checkbox, Combobox, Command, Date Picker, Field, Input, Input Group, Input OTP, Label, Native Select, Radio Group, Select, Slider, Switch, Textarea, Toggle, Toggle Group |
| **Data Display** | Avatar, Badge, Card, Chart, Data Table, Item, Kbd, Skeleton, Spinner, Table, Typography |
| **Feedback** | Alert, Alert Dialog, Dialog, Drawer, Empty, Progress, Sheet, Sonner (Toast), Tooltip |
| **Navigation** | Accordion, Breadcrumb, Collapsible, Context Menu, Dropdown Menu, Hover Card, Menubar, Navigation Menu, Pagination, Popover, Scroll Area, Sidebar, Tabs |
| **Layout** | Aspect Ratio, Direction, Resizable, Separator |

### 6.3 Component Specimens

Each component in the canvas is rendered as a **specimen** — a self-contained block that shows:
- Component name as a small label above
- The component in its default state with realistic sample content
- Variant showcase where applicable (e.g., Button shows default, secondary, destructive, outline, ghost, link variants; Badge shows default, secondary, destructive, outline)
- State variants inline where practical (e.g., Input shows default + focus + disabled + error on the same row)

**All components are fully interactive.** Dialogs open, dropdowns expand, sliders drag, tabs switch, accordions toggle. The canvas is not a screenshot — it's a living component environment.

### 6.4 Canvas Theme Application

The canvas is wrapped in a `<div>` that receives CSS custom properties derived from the active theme set (see Section 9). The shadcn/ui components inside read these variables naturally — no prop-passing needed.

The canvas wrapper also gets a `data-theme` attribute and a class (`light` or `dark`) to handle mode switching.

### 6.5 Surface Nesting Demo

One special section in the canvas (placed prominently, perhaps at the top of the grouped view) demonstrates the surface hierarchy specifically:

```
┌─ background-primary ─────────────────────────────────┐
│  Heading (foreground-primary)                         │
│  Description (foreground-secondary)                   │
│  ┌─ background-secondary (Card) ───────────────────┐ │
│  │  Card title (foreground-primary)                 │ │
│  │  Card description (foreground-secondary)         │ │
│  │  Helper text (foreground-tertiary)               │ │
│  │  ┌─ background-tertiary (Well/Code Block) ────┐ │ │
│  │  │  Code content (foreground-primary)          │ │ │
│  │  │  Comment (foreground-secondary)             │ │ │
│  │  └────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

This makes it immediately obvious whether the surface + text hierarchy is working.

---

## 7. Panel C: Theme Set Editor (Right)

### 7.1 Theme Selector

Top of the panel. Shows all defined theme sets as tabs or a dropdown.

- "New Theme" button — creates a blank theme set
- "Duplicate" — copies the active theme as a starting point
- Delete (with confirmation)
- The **active** theme is what the canvas displays

### 7.2 Token Mapping Interface

Below the theme selector, the 39 semantic tokens are organized into collapsible groups matching the token architecture:

**Backgrounds** (5 tokens)
**Foreground — Emphasis** (3 tokens)
**Foreground — Surface Overrides** (2 tokens)
**Accent** (14 tokens — 7 pairs)
**Borders — Structural** (3 tokens)
**Borders — Semantic** (8 tokens — 4 pairs of primary/secondary)
**Focus** (1 token)

Each token row shows:
- Token name (e.g., `--background-primary`)
- A color swatch showing the current resolved value
- **Scale picker** — dropdown listing all scales from Panel A, showing the scale name + swatch strip
- **Step picker** — a row of 12 clickable step swatches from the selected scale. Active step is highlighted.
- Contrast indicator (see Section 11) — shows the computed contrast ratio against its paired surface, with a pass/fail badge

### 7.3 Quick-Fill Helpers

For common patterns, offer one-click assignments:
- **"Auto-map neutral scale"** — takes a selected gray scale and maps steps 1→background-primary, 2→background-secondary, 3→background-tertiary, 6→border-secondary, 7→border-primary, 8→border-input, 11→foreground-secondary, 12→foreground-primary. Based on Radix step conventions.
- **"Auto-map accent scale"** — takes a selected accent scale and maps step 9→accent-primary, step 3→accent-secondary, step 4→accent-hover, with foreground pairs auto-selected for contrast.
- **"Invert for dark mode"** — takes the current light theme and creates a dark variant by inverting the lightness direction of all surface and foreground token references.

These are time-savers, not requirements. They can be applied and then manually overridden.

### 7.4 Live Preview

Every change in Panel C immediately updates the CSS custom properties on the canvas wrapper (Section 9). There is no "Apply" button — changes are live. This is the core interaction loop of the tool.

---

## 8. Export System

### 8.1 Theme Export Formats

Accessible via the top bar "Export" dropdown or a button in Panel C.

**CSS Custom Properties:**
```css
:root {
  /* Surfaces */
  --background-primary: oklch(0.98 0.005 270);
  --background-secondary: oklch(0.96 0.005 270);
  --background-tertiary: oklch(0.94 0.005 270);
  /* ... all 39 tokens */
}

.dark {
  --background-primary: oklch(0.15 0.005 270);
  /* ... dark variant if defined */
}
```

**CSS with `@property` registration:**
```css
@property --accent-primary {
  syntax: '<color>';
  inherits: true;
  initial-value: oklch(0.55 0.25 270);
}
/* ... for every token */
```

**Tailwind config snippet:**
```javascript
// tailwind.config.js colors section
module.exports = {
  theme: {
    extend: {
      colors: {
        'background-primary': 'oklch(var(--background-primary) / <alpha-value>)',
        'background-secondary': 'oklch(var(--background-secondary) / <alpha-value>)',
        // ... all tokens
      }
    }
  }
}
```

**JSON:**
```json
{
  "name": "Light",
  "mode": "light",
  "tokens": {
    "--background-primary": {
      "oklch": { "l": 0.98, "c": 0.005, "h": 270, "a": 1 },
      "hex": "#f9f9fb",
      "hsl": "240 20% 98%",
      "source": { "scale": "Slate", "step": 1 }
    }
  }
}
```

### 8.2 Scale Export Formats

Same formats as above but scoped to a single scale's 12 steps:
- CSS: `--{name}-1` through `--{name}-12`
- JSON: step array with all color formats
- Tailwind: color object with 12 keyed values

### 8.3 Export UX

- Format selector (radio buttons or tabs)
- "Copy to clipboard" button (with toast confirmation)
- "Download file" button
- Preview pane showing the generated code

---

## 9. Theming Pipeline (How Live Preview Works)

This is the critical path that makes the tool feel real-time.

### Step 1: Token Resolution

When any token reference changes in the active theme:

```
TokenRef { scaleId: "abc", stepIndex: 9 }
  → look up scale "abc" in useScaleStore
  → get step 9's OKLCH values
  → format as CSS oklch() string
```

### Step 2: CSS Variable Injection

A React component wrapping the canvas computes all 39 resolved values and sets them as inline CSS custom properties on the wrapper `<div>`:

```tsx
function CanvasWrapper({ children }) {
  const resolvedTokens = useResolvedTokens(); // hook that does Step 1 for all tokens

  const style = {
    '--background-primary': resolvedTokens.backgroundPrimary,
    '--background-secondary': resolvedTokens.backgroundSecondary,
    // ... all 39
  } as React.CSSProperties;

  return (
    <div style={style} className={activeTheme.mode === 'dark' ? 'dark' : ''}>
      {children}
    </div>
  );
}
```

### Step 3: Component Consumption

shadcn/ui components already read from CSS custom properties. We remap the new token names to shadcn's expected variable names in a CSS layer inside the canvas:

```css
/* Bridge layer: maps our token names to what shadcn/ui components expect */
.canvas-wrapper {
  --background: var(--background-primary);
  --foreground: var(--foreground-primary);
  --card: var(--background-secondary);
  --card-foreground: var(--foreground-primary);
  --muted: var(--background-tertiary);
  --muted-foreground: var(--foreground-secondary);
  --primary: var(--accent-primary);
  --primary-foreground: var(--accent-primary-foreground);
  --secondary: var(--accent-secondary);
  --secondary-foreground: var(--accent-secondary-foreground);
  --accent: var(--accent-hover);
  --accent-foreground: var(--accent-hover-foreground);
  --destructive: var(--accent-destructive);
  --destructive-foreground: var(--accent-destructive-foreground);
  --border: var(--border-primary);
  --input: var(--border-input);
  --ring: var(--ring);
  --popover: var(--background-popover);
  --popover-foreground: var(--foreground-popover);
}
```

This bridge layer is the key insight: we don't need to modify any shadcn/ui component source code. The components read their original variable names, and we alias our new tokens onto them. The canvas is stock shadcn/ui with a translation layer.

### Performance

Token resolution is cheap (object lookups). The CSS variable injection is a single `style` attribute update on one DOM node. The browser handles the cascade efficiently — there's no per-component re-render, just a CSS repaint. This should be instantaneous even with 57 components on screen.

---

## 10. Component Inventory & Grouping

### Full list with specimen notes (57 components)

#### Inputs & Forms (20)

| Component | Specimen Notes |
|---|---|
| Button | All 6 variants (default, secondary, destructive, outline, ghost, link) × 3 sizes + disabled state |
| Button Group | A group of 3 connected buttons |
| Calendar | One month view with selected date, range, and disabled dates |
| Checkbox | Checked, unchecked, indeterminate, disabled |
| Combobox | Closed state + note "click to open" — interactive |
| Command | Full command palette with search, groups, shortcuts |
| Date Picker | Closed trigger + calendar opens on click |
| Field | Label + input + description + error message |
| Input | Default, focused, disabled, with placeholder, with error border |
| Input Group | Input with prepend/append elements |
| Input OTP | 6-digit OTP with some filled |
| Label | Standalone + associated with input |
| Native Select | Default + disabled |
| Radio Group | 3 options, one selected, one disabled |
| Select | Closed trigger + opens on click |
| Slider | Default, range, with steps |
| Switch | On, off, disabled |
| Textarea | Default, with content, disabled |
| Toggle | Default, pressed, disabled |
| Toggle Group | Single + multiple selection modes |

#### Data Display (11)

| Component | Specimen Notes |
|---|---|
| Avatar | Image, fallback initials, multiple sizes |
| Badge | Default, secondary, destructive, outline variants |
| Card | Full card with header, content, footer, description |
| Chart | Simple bar chart with 2 data series (demonstrates chart theming) |
| Data Table | 5-row table with sorting, selection, pagination |
| Item | Default item layout |
| Kbd | Single key, combo (⌘+K) |
| Skeleton | Card-shaped skeleton, text lines, avatar |
| Spinner | Default spinner |
| Table | Static table with header, rows, footer |
| Typography | h1–h4, p, blockquote, list, inline code, lead |

#### Feedback (9)

| Component | Specimen Notes |
|---|---|
| Alert | Default + destructive + success (if supported) variants |
| Alert Dialog | Trigger button, opens on click |
| Dialog | Trigger button, opens with form content |
| Drawer | Trigger button, opens from bottom |
| Empty | Empty state with icon + message + action |
| Progress | 33%, 66%, 100% bars |
| Sheet | Trigger button, opens from right |
| Sonner (Toast) | Trigger button, fires toast notification |
| Tooltip | Hover target with tooltip |

#### Navigation (13)

| Component | Specimen Notes |
|---|---|
| Accordion | 3 items, first open |
| Breadcrumb | 4-level breadcrumb with truncation |
| Collapsible | Open/closed toggle |
| Context Menu | Right-click target area |
| Dropdown Menu | Trigger button, full menu with groups + shortcuts |
| Hover Card | Trigger link, card appears on hover |
| Menubar | File / Edit / View menu bar |
| Navigation Menu | Multi-item nav with one expanded section |
| Pagination | 10 pages, current page 5 |
| Popover | Trigger button, form content inside |
| Scroll Area | Scrollable list of 20 items |
| Sidebar | Compact sidebar with icon nav + expand |
| Tabs | 3 tabs with content panels |

#### Layout (4)

| Component | Specimen Notes |
|---|---|
| Aspect Ratio | 16:9 and 1:1 boxes with placeholder content |
| Direction | LTR/RTL demo (if meaningful visually) |
| Resizable | 2-panel resizable with drag handle |
| Separator | Horizontal + vertical separators |

---

## 11. Accessibility & Contrast Validation

### 11.1 Per-Token Contrast Indicators

In Panel C (Theme Set Editor), each foreground token row shows a live contrast ratio against its relevant surfaces:

- `--foreground-primary` shows ratio against all 3 surfaces (3 badges)
- `--foreground-secondary` shows ratio against all 3 surfaces (3 badges)
- `--foreground-tertiary` shows ratio against primary + secondary surfaces (2 badges), and a gray "N/A" for tertiary surface

Each badge shows:
- The numeric ratio (e.g., "7.2:1")
- Green check (≥ 4.5:1 for AA normal text)
- Yellow warning (≥ 3:1 but < 4.5:1 — passes AA large text only)
- Red fail (< 3:1)

### 11.2 Contrast Matrix View

A dedicated collapsible section in Panel C that renders the full contrast matrix table from the proposal. Updated live as tokens change. Each cell shows the computed ratio and pass/fail status.

### 11.3 Gamut Validation

The status bar at the bottom of the app shows:
- Total out-of-gamut steps across all scales
- Clicking opens a panel listing every out-of-gamut step with a "Clamp" action

### 11.4 APCA Advisory

In addition to WCAG 2.x ratios, show APCA Lc values as a secondary indicator. These are informational, not enforced. Tooltip on each contrast badge explains: "WCAG 2.x: {ratio} — APCA: Lc {value}".

### 11.5 Implementation

Use culori for all contrast computation:
```typescript
import { wcagContrast, parse } from 'culori';

function getContrastRatio(fg: string, bg: string): number {
  return wcagContrast(parse(fg), parse(bg));
}
```

For APCA, use the `apca-w3` package or implement the SAPC algorithm directly (it's small).

---

## 12. Milestones & Build Order

### Milestone 0: Project Scaffold (Day 1)

- [ ] Initialize Next.js 15 project with App Router
- [ ] Install and configure Tailwind v4
- [ ] Install all shadcn/ui components via CLI (`npx shadcn@latest add --all`)
- [ ] Install culori, zustand, immer, framer-motion, @radix-ui/colors, file-saver
- [ ] Set up the three Zustand stores with TypeScript interfaces
- [ ] Set up the three-panel responsive layout shell (no content yet)
- [ ] Verify the app compiles and the layout responds correctly

### Milestone 1: Color Scale Engine (Days 2–3)

- [ ] Implement OKLCH scale generator (hue, chroma, lightness range, Gaussian distribution)
- [ ] Implement Radix scale importer (convert all `@radix-ui/colors` values to OKLCH via culori at init)
- [ ] Implement per-step fine-tuning with OKLCH inputs
- [ ] Implement sRGB gamut checking per step (culori `displayable()` or `clampChroma()`)
- [ ] Wire up `useScaleStore` with CRUD operations
- [ ] Unit test: generator produces 12 valid OKLCH values for edge case inputs

### Milestone 2: Theme Engine + Live Preview (Days 3–4)

- [ ] Implement `useThemeStore` with token mapping CRUD
- [ ] Implement token resolution pipeline (TokenRef → resolved oklch string)
- [ ] Build `CanvasWrapper` component with CSS variable injection
- [ ] Build the CSS bridge layer mapping new tokens to shadcn variable names
- [ ] Wire a single component (Button) to verify live theming works end-to-end
- [ ] Verify that changing a token value in the store immediately updates the Button in the canvas

### Milestone 3: Panel A — Color Scale Editor UI (Days 4–5)

- [ ] Scale list with swatch strips
- [ ] Generator UI (hue wheel, chroma slider, lightness range, distribution curve)
- [ ] Per-step fine-tuning rows with L/C/H/A inputs
- [ ] Gamut warnings and clamp action
- [ ] Radix import modal with scale grid
- [ ] Panel collapse/expand animation

### Milestone 4: Panel B — Component Canvas (Days 5–8)

- [ ] Build all 57 component specimens with realistic content
- [ ] Organize into 5 groups with collapsible sections
- [ ] Implement section nav (sticky horizontal bar)
- [ ] Implement kitchen sink toggle
- [ ] Ensure all components are interactive (dialogs open, dropdowns work, etc.)
- [ ] Build surface nesting demo section
- [ ] Test that all components respond to theme changes via CSS variables

### Milestone 5: Panel C — Theme Set Editor UI (Days 8–9)

- [ ] Theme selector (tabs/dropdown) with CRUD
- [ ] Token mapping rows organized by group (Background, Foreground, Accent, Border, Focus)
- [ ] Scale picker + step picker for each token
- [ ] Quick-fill helpers (auto-map neutral, auto-map accent, invert for dark)
- [ ] Live contrast indicators per token row
- [ ] Contrast matrix collapsible section
- [ ] Panel collapse/expand animation

### Milestone 6: Export System (Day 9–10)

- [ ] CSS custom properties export (with and without @property blocks)
- [ ] Tailwind config snippet export
- [ ] JSON export
- [ ] Per-scale export
- [ ] Copy-to-clipboard + file download
- [ ] Export preview pane

### Milestone 7: Polish & Edge Cases (Days 10–12)

- [ ] localStorage persistence for scales and themes
- [ ] Undo/redo for token changes (zustand middleware)
- [ ] Status bar with gamut + contrast summary
- [ ] Keyboard navigation in panels
- [ ] Responsive behavior (drawer mode for panels < 1280px)
- [ ] Loading states and empty states
- [ ] Error boundaries around canvas components
- [ ] Cross-browser testing (Chrome, Firefox, Safari for oklch support)

---

## 13. File Structure

```
/app
  /layout.tsx                    — Root layout with providers
  /page.tsx                      — Main playground page (three-panel layout)
  /globals.css                   — Base styles + CSS variable bridge

/components
  /playground
    /top-bar.tsx                 — Logo, toggles, theme selector, export button
    /status-bar.tsx              — Contrast warnings, gamut status
    /canvas-wrapper.tsx          — CSS variable injection wrapper
    /section-nav.tsx             — Sticky horizontal nav for canvas groups

  /panels
    /scale-editor
      /scale-list.tsx            — List of all scales with swatch strips
      /scale-generator.tsx       — Hue, chroma, lightness, distribution controls
      /step-editor.tsx           — 12-row fine-tuning interface
      /radix-import-modal.tsx    — Radix scale browser and importer
      /scale-export-dialog.tsx   — Per-scale export

    /theme-editor
      /theme-selector.tsx        — Theme tabs/dropdown with CRUD
      /token-group.tsx           — Collapsible group of token rows
      /token-row.tsx             — Single token: scale picker + step picker + contrast badge
      /contrast-matrix.tsx       — Full matrix table
      /quick-fill.tsx            — Auto-map buttons
      /theme-export-dialog.tsx   — Full theme export

  /canvas
    /groups
      /inputs-forms.tsx          — All input/form component specimens
      /data-display.tsx          — All data display specimens
      /feedback.tsx              — All feedback specimens
      /navigation.tsx            — All navigation specimens
      /layout.tsx                — All layout specimens
    /specimens
      /button-specimen.tsx       — Individual component specimen (one per component)
      /input-specimen.tsx
      /... (57 total)
    /surface-nesting-demo.tsx    — Nested surface hierarchy demo

  /ui                            — shadcn/ui components (auto-generated by CLI)

/lib
  /stores
    /scale-store.ts              — Zustand store for color scales
    /theme-store.ts              — Zustand store for theme sets
    /playground-store.ts         — Zustand store for UI state
  /color
    /generator.ts                — OKLCH scale generation algorithm
    /converter.ts                — Format conversion wrappers around culori
    /contrast.ts                 — WCAG + APCA contrast computation
    /gamut.ts                    — sRGB gamut checking and clamping
    /radix-presets.ts            — Radix scale data converted to OKLCH
  /export
    /css.ts                      — CSS custom property + @property generation
    /tailwind.ts                 — Tailwind config snippet generation
    /json.ts                     — JSON export formatting
  /tokens
    /semantic-tokens.ts          — Token names, groups, descriptions, contrast requirements
    /bridge.ts                   — Mapping from new token names to shadcn variable names
    /resolve.ts                  — TokenRef → resolved color string
  /types.ts                      — Shared TypeScript interfaces (from Section 4)
  /constants.ts                  — Radix step use-case labels, default scales, etc.
```

---

## 14. Key Implementation Notes for Claude Code

### Things to get right first

1. **The CSS bridge layer is the linchpin.** Get `CanvasWrapper` + the variable aliasing working with one component before building anything else. If the bridge works, everything downstream works.

2. **Install all shadcn/ui components up front.** Run `npx shadcn@latest add --all` during scaffold. Don't add them one at a time — the specimens need all of them available.

3. **culori is the single source of truth for color math.** Don't write custom OKLCH→hex conversion. Use `culori.formatHex()`, `culori.formatHsl()`, `culori.displayable()`, `culori.clampChroma()`, `culori.wcagContrast()`. The library handles edge cases (gamut mapping, achromatic colors, etc.) that hand-rolled math will miss.

4. **Token resolution must be reactive.** The path is: user clicks step 9 of "Blue" scale for `--accent-primary` → `useThemeStore` updates the `TokenRef` → `useResolvedTokens()` hook recomputes → `CanvasWrapper` re-renders with new CSS variables → every component in the canvas updates via CSS cascade. This chain must be synchronous (no debounce) for the "instant preview" feel.

### Things that are easy to get wrong

1. **Radix color format conversion.** `@radix-ui/colors` exports CSS color strings (hex or P3), not OKLCH. Use `culori.parse()` on each value and `culori.converter('oklch')` to get OKLCH. Do this once at app initialization and cache the results. Some Radix P3 colors may be outside sRGB — flag them the same way you'd flag custom out-of-gamut steps.

2. **Alpha channel handling.** Our scales include an alpha channel, but `oklch()` in CSS uses the `/` syntax for alpha: `oklch(0.55 0.25 270 / 0.5)`. Make sure the export formatters handle this correctly. When alpha is 1, omit it from the output for cleaner CSS.

3. **The popover/dialog/sheet/drawer components render in portals.** These components append their content to `document.body`, which means they escape the `CanvasWrapper` div and lose the CSS variable context. Solution: either (a) use `shadcn/ui`'s container prop if available, or (b) add the CSS variables to a global stylesheet in addition to the inline `style`, scoped to a `.playground-theme` class, and ensure the portal containers inherit it. Test this early — it's a common gotcha.

4. **The `Chart` component uses Recharts.** Recharts reads CSS variables for theming via the `ChartConfig` pattern. Make sure the chart specimen passes color variables through the config object, not as inline colors. Otherwise the chart won't respond to theme changes.

5. **Contrast ratio computation must use resolved colors, not relative OKLCH values.** WCAG contrast is defined on luminance (relative to sRGB), not OKLCH lightness. Use `culori.wcagContrast()` which handles the conversion internally. Don't approximate contrast from OKLCH L values — they're close but not identical.

### Scope management

The 57 component specimens are the highest-effort part of this project. Each specimen needs:
- Realistic sample content (names, dates, placeholder text)
- Multiple variants where applicable
- Multiple states where applicable
- All interactions working

**Build the specimens in group order** (Inputs & Forms → Data Display → Feedback → Navigation → Layout). This front-loads the most token-sensitive components (inputs, buttons, cards) and ensures the theming pipeline gets stress-tested early.

**Use a consistent specimen wrapper** for every component:

```tsx
function Specimen({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground-secondary">{name}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
```

This keeps the canvas scannable and makes every component visually consistent.

### Performance guardrails

- **Don't re-render the entire canvas on every token change.** The CSS variable injection approach avoids this by design — only the `CanvasWrapper` style attribute updates, and the browser handles the repaint. But if you accidentally put resolved colors into React state that flows as props to specimens, you'll trigger 57+ re-renders per keystroke. Keep the theme data in CSS variables, not in React props.

- **Memoize Radix preset conversion.** Converting ~30 scales × 12 steps × light/dark from hex to OKLCH is ~720 conversions. Do this once, memoize the result. Don't recompute on every render.

- **Lazy-load the chart specimen.** Recharts is heavy. Dynamic import it so it doesn't block the initial canvas render.
