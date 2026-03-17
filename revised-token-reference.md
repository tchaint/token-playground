# Revised Token Architecture — Complete Reference

> Replaces Sections 3.1–3.4 of the original proposal. Changes from original:
> - `--text-*` axis removed; emphasis hierarchy lives entirely on `--foreground-*`
> - `--background-overlay` added for scrim/backdrop surfaces
> - `--accent-success`, `--accent-warning`, `--accent-info` added alongside `--accent-destructive`
> - Border tokens expanded to cover all semantic states

---

## 1. Neutral Surfaces (Background Axis)

Surface tokens control the layered canvases of the UI. Each ranked tier includes a paired foreground — the default high-emphasis text color optimized for that surface. Surface lightness steps are intentionally subtle (2–4% OKLCH luminance between tiers) to preserve room in the foreground hierarchy for accessible contrast.

| Token | Maps from shadcn | Role |
|---|---|---|
| `--background-primary` | `--background` | Page canvas; highest-level surface |
| `--background-secondary` | `--card` | Cards, sections, sidebar panels |
| `--background-tertiary` | `--muted` | Nested/inset surfaces: wells, code blocks, table rows inside cards |
| `--background-popover` | `--popover` | Floating surfaces (dropdowns, tooltips). Named rather than ranked — float behavior is orthogonal to depth |
| `--background-overlay` | *(new)* | Scrim/backdrop behind modals and drawers. Typically a semi-transparent dark value |

---

## 2. Foreground (Text Emphasis + Surface Defaults)

Foreground tokens serve double duty: they are the **emphasis hierarchy** for text content and the **default text color** for each surface. There is no separate `--text-*` axis — one system, one canonical set of tokens.

### Emphasis Hierarchy

These three tokens describe content importance. They are usable on **any** surface — the contrast matrix (Section 5) guarantees the required pairings.

| Token | Maps from shadcn | Role |
|---|---|---|
| `--foreground-primary` | `--foreground` | Headings, body copy, primary labels. Highest emphasis |
| `--foreground-secondary` | `--muted-foreground` (elevated) | Descriptions, metadata, timestamps, secondary labels. Medium emphasis |
| `--foreground-tertiary` | *(new)* | Placeholders, helper text, disabled content, captions. Lowest emphasis |

### Surface-Specific Overrides

Named foreground tokens for surfaces where the base text color differs from the ranked hierarchy (e.g., light text on a dark tooltip, or inverted text on a scrim).

| Token | Maps from shadcn | Role |
|---|---|---|
| `--foreground-popover` | `--popover-foreground` | Default text on `--background-popover` |
| `--foreground-overlay` | *(new)* | Default text on `--background-overlay` (if applicable, e.g., text on a scrim) |

> **Usage rule:** Components use the emphasis hierarchy (`--foreground-primary/secondary/tertiary`) in nearly all cases. The surface-specific overrides exist only for float/overlay contexts where the background color breaks from the ranked surface scale.

---

## 3. Action Colors (Accent Axis)

All interactive/intent colors use the `accent` namespace. Each token includes a `-foreground` pair for text/icons rendered on the fill.

| Token | Maps from shadcn | Role |
|---|---|---|
| `--accent-primary` / `--accent-primary-foreground` | `--primary` / `--primary-foreground` | Main CTA fill and its text/icon color |
| `--accent-secondary` / `--accent-secondary-foreground` | `--secondary` / `--secondary-foreground` | Subdued/ghost action fill |
| `--accent-hover` / `--accent-hover-foreground` | `--accent` / `--accent-foreground` | Hover/focus highlight on interactive elements |
| `--accent-destructive` / `--accent-destructive-foreground` | `--destructive` / `--destructive-foreground` | Danger/error action fill |
| `--accent-warning` / `--accent-warning-foreground` | *(new)* | Caution action fill (e.g., confirmations with consequences) |
| `--accent-success` / `--accent-success-foreground` | *(new)* | Positive/completion action fill (e.g., save confirmations, status) |
| `--accent-info` / `--accent-info-foreground` | *(new)* | Informational action fill (e.g., tips, callouts, non-urgent alerts) |

---

## 4. Border Tokens

Borders cover neutral hierarchy and semantic state. This lets components reference border intent without hard-coding color values.

### Structural Borders

| Token | Maps from shadcn | Role |
|---|---|---|
| `--border-primary` | `--border` | Default structural borders: cards, dividers, table rules |
| `--border-secondary` | *(new)* | Subtle/low-contrast borders: section separators, nested containers |
| `--border-input` | `--input` | Form field borders (kept specific for focus-state pairing) |

### Semantic Borders

Each semantic state has a primary (high-emphasis) and secondary (subtle) variant.

| Token | Maps from shadcn | Role |
|---|---|---|
| `--border-destructive-primary` | *(new)* | High-emphasis error: invalid fields, alert containers |
| `--border-destructive-secondary` | *(new)* | Subtle error: secondary validation, warning-adjacent |
| `--border-warning-primary` | *(new)* | High-emphasis warning: caution alerts, attention states |
| `--border-warning-secondary` | *(new)* | Subtle warning: advisory containers, soft caution |
| `--border-success-primary` | *(new)* | High-emphasis success: confirmed states, valid fields |
| `--border-success-secondary` | *(new)* | Subtle success: passive completion indicators |
| `--border-info-primary` | *(new)* | High-emphasis info: tip containers, highlighted callouts |
| `--border-info-secondary` | *(new)* | Subtle info: background callout borders, soft emphasis |

### Focus

| Token | Maps from shadcn | Role |
|---|---|---|
| `--ring` | `--ring` | Focus indicator color. Unchanged; paired with `--radius` |

---

## 5. Contrast Matrix (Updated)

With the collapsed foreground model, the matrix uses `--foreground-*` directly. Guarantees are validated at the theme level per Section 5 of the original proposal.

|  | `--background-primary` | `--background-secondary` | `--background-tertiary` |
|---|---|---|---|
| `--foreground-primary` | ✓ 4.5:1 minimum | ✓ 4.5:1 minimum | ✓ 4.5:1 minimum |
| `--foreground-secondary` | ✓ 4.5:1 minimum | ✓ 4.5:1 minimum | ✓ 4.5:1 minimum |
| `--foreground-tertiary` | ✓ 4.5:1 minimum | ✓ 4.5:1 minimum | ✗ Not guaranteed |

---

## 6. Tailwind Class Migration Map (Updated)

| Current class | New class | Axis |
|---|---|---|
| `bg-background` | `bg-background-primary` | Surface |
| `bg-card` | `bg-background-secondary` | Surface |
| `bg-muted` | `bg-background-tertiary` | Surface |
| `bg-popover` | `bg-background-popover` | Surface |
| — | `bg-background-overlay` | Surface (new) |
| `text-foreground` | `text-foreground-primary` | Foreground |
| `text-muted-foreground` | `text-foreground-secondary` | Foreground |
| — | `text-foreground-tertiary` | Foreground (new) |
| `text-popover-foreground` | `text-foreground-popover` | Foreground |
| `bg-primary` | `bg-accent-primary` | Accent |
| `text-primary` | `text-accent-primary` | Accent |
| `text-primary-foreground` | `text-accent-primary-foreground` | Accent |
| `bg-secondary` | `bg-accent-secondary` | Accent |
| `bg-accent` | `bg-accent-hover` | Accent |
| `bg-destructive` | `bg-accent-destructive` | Accent |
| — | `bg-accent-warning` | Accent (new) |
| — | `bg-accent-success` | Accent (new) |
| — | `bg-accent-info` | Accent (new) |
| `border-border` | `border-border-primary` | Border |
| — | `border-border-secondary` | Border (new) |
| `border-input` | `border-input` | Border (unchanged) |
| `border-destructive` | `border-destructive-primary` | Border |
| — | `border-destructive-secondary` | Border (new) |
| — | `border-warning-primary` | Border (new) |
| — | `border-warning-secondary` | Border (new) |
| — | `border-success-primary` | Border (new) |
| — | `border-success-secondary` | Border (new) |
| — | `border-info-primary` | Border (new) |
| — | `border-info-secondary` | Border (new) |
| `ring-ring` | `ring-ring` | Focus (unchanged) |

---

## Token Count Summary

| Axis | Tokens | Foreground pairs | Total CSS custom properties |
|---|---|---|---|
| Surfaces | 5 | 4 (primary, secondary, tertiary, popover) + 1 (overlay) | 10 |
| Foreground (emphasis) | 3 | — | 3 |
| Accent | 7 | 7 | 14 |
| Border | 11 | — | 11 |
| Focus | 1 | — | 1 |
| **Total** | | | **39** |

shadcn/ui's current system defines ~20 CSS custom properties. This proposal roughly doubles the count, with the majority of new tokens coming from the semantic border and accent state expansions. The increase is justified: every new token eliminates a hard-coded color value somewhere in the component library.
