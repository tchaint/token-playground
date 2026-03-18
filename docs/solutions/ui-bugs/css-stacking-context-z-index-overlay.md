---
title: Sticky nav obscured by calendar day picker z-index stacking
problem_type: ui-bugs
component: section-nav / react-day-picker
symptoms:
  - Calendar day cells appear above sticky section navigation text when scrolling
  - Day picker numbers visually overlay navigation text
  - Z-index layering fails despite sticky nav having z-10
tags:
  - z-index
  - stacking-context
  - react-day-picker
  - sticky-positioning
  - tailwind
severity: medium
date_solved: 2026-03-17
related_components:
  - src/components/canvas/section-nav.tsx
  - src/components/ui/calendar.tsx
---

## Problem

When scrolling the component canvas, calendar day numbers from `react-day-picker` appeared visually on top of the sticky section navigation bar. The nav had `z-10` but was still beaten.

## Root Cause

`react-day-picker` renders day cells with `position: relative` to support its selection circle overlay. When a parent element of those cells creates a stacking context (via `transform`, `opacity`, `will-change`, `isolation`, or `contain`), it can elevate child elements beyond what a sticky `z-10` can beat — even without an explicit `z-index` on the day cells themselves.

The sticky nav at `z-10` (= `z-index: 10`) was insufficient. Bumping to `z-20` resolves it cleanly.

## Solution

**File:** `src/components/canvas/section-nav.tsx`

```diff
- <div className="sticky top-0 z-10 flex gap-1 px-4 py-2 bg-background/90 backdrop-blur-sm border-b border-border/60">
+ <div className="sticky top-0 z-20 flex gap-1 px-4 py-2 bg-background/90 backdrop-blur-sm border-b border-border/60">
```

## Prevention

### Z-index layering convention for this app

| Layer | Tailwind | When |
|---|---|---|
| Content / components | `z-0` – `z-10` | Default — cards, inputs, day picker cells |
| Sticky navigation | `z-20` | Section nav, sticky headers |
| Overlay panels | `z-30` | Slide-in panels (`absolute` mode on narrow viewports) |
| Modals / dialogs | `z-50` | Radix/base-ui portal dialogs, sheets |
| Toasts | `z-70` | Sonner toaster |

The key rule: **sticky chrome must beat any `position: relative` third-party content**. Start at `z-20` for any sticky nav.

### Identifying third-party stacking issues

1. Open DevTools → select the element bleeding through → check `z-index` and `position` in Computed
2. Walk up the DOM tree looking for ancestors with `opacity < 1`, `transform`, `will-change`, or `isolation: isolate` — these all create stacking contexts
3. If a third-party element is the culprit, raise the sticky nav's z-index rather than fighting the library's internals

### Sticky nav checklist

- [ ] Use `z-20` or higher — never `z-10` for sticky chrome
- [ ] Test by scrolling a date picker, dropdown, or calendar past the nav
- [ ] Verify portals (dialogs, sheets) still appear above the nav — they use `z-50`+
