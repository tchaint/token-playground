---
title: react-resizable-panels v2 renamed `direction` prop to `orientation`
problem_type: integration-issues
component: ResizablePanelGroup
symptoms:
  - "TypeScript error: Property 'direction' does not exist on type 'IntrinsicAttributes & HTMLAttributes<HTMLDivElement>'"
  - ResizablePanelGroup renders but TypeScript compilation fails
tags:
  - react-resizable-panels
  - breaking-change
  - v2-migration
  - typescript
severity: low
date_solved: 2026-03-17
related_components:
  - src/components/ui/resizable.tsx
  - src/components/canvas/groups/layout-group.tsx
---

## Problem

Using `<ResizablePanelGroup direction="horizontal">` causes a TypeScript error:

```
Type error: Type '{ children: Element[]; direction: string; className: string; }' is not
assignable to type 'IntrinsicAttributes & HTMLAttributes<HTMLDivElement> & { ... }'.
Property 'direction' does not exist on type '...'
```

The error message mentions `HTMLDivElement` which misleadingly suggests an HTML attribute issue rather than a renamed prop.

## Root Cause

`react-resizable-panels` v2 renamed the orientation prop from `direction` to `orientation` to align with web standards naming. The `GroupProps` type in v2 simply doesn't include `direction` at all — hence the confusing `HTMLDivElement` error (the component's base type is `HTMLAttributes<HTMLDivElement>`).

## Solution

**File:** wherever `ResizablePanelGroup` is used

```diff
- <ResizablePanelGroup direction="horizontal" className="h-full">
+ <ResizablePanelGroup orientation="horizontal" className="h-full">
```

Valid values are `"horizontal"` and `"vertical"` — same as before, just a different prop name.

## Prevention

### Decoding the `HTMLDivElement` TypeScript error pattern

When TypeScript says a prop doesn't exist on `HTMLAttributes<HTMLDivElement>`, it usually means one of:
1. The prop was **renamed** in a major version upgrade
2. The prop was **removed** entirely
3. You're importing from the wrong package

Check `node_modules/react-resizable-panels/dist/react-resizable-panels.d.ts` and search for the old prop name to confirm it's gone.

### Upgrading packages with potential breaking changes

1. Before upgrading a major version, scan the changelog for "Breaking Changes"
2. After upgrading, run `tsc --noEmit` to catch prop renames across the codebase
3. Search for old prop names: `grep -r 'direction=' src/` to find all usages
