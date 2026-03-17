# src/lib/tokens/

Token resolution and CSS variable generation pipeline.

## resolve.ts

Resolution pipeline: `TokenRef → find scale by id → find step by index → oklch() string`

- `resolveTokenRef(ref, scales)` → `string | null` — returns `null` if scale or step not found; not an error, callers should skip nulls
- `resolveAllTokens(tokens, scales)` → `Record<cssVar, oklchString>` — iterates `SEMANTIC_TOKENS` descriptors to get CSS variable names; skips unresolvable refs
- `resolveWithBridge(tokens, scales)` → `Record<cssVar, oklchString>` — calls `resolveAllTokens`, then extends the result with shadcn/ui variable aliases via `CSS_BRIDGE_MAP`

**Always use `resolveWithBridge`** when injecting tokens into a DOM element — it includes both `--background-primary` (our name) AND `--background` (shadcn's name) in one pass.

## bridge.ts

The translation layer between our semantic token names and the variable names shadcn/ui components read.

- `CSS_BRIDGE_MAP` — `Record<ourVar, string | string[]>` — one-to-many; e.g., `--foreground-primary` maps to both `--foreground` and `--card-foreground`
- `REVERSE_BRIDGE_MAP` — `Record<shadcnVar, ourVar>` — inverse lookup
- `generateBridgeCSS(selector?)` → CSS string — static alias declarations for use in a `.canvas-wrapper` block (avoids runtime resolution)

## semantic-tokens.ts

Ordered source-of-truth for all semantic token definitions.

- `SEMANTIC_TOKENS` — `SemanticTokenDescriptor[]` — ordered array; each entry has `key`, `cssVariable`, `group`, `description`, and optional `contrastTargets`
- `SEMANTIC_TOKEN_MAP` — `Record<key, descriptor>` — O(1) lookup by `SemanticTokenMap` key
- `SEMANTIC_TOKEN_BY_CSS_VAR` — `Record<cssVar, descriptor>` — O(1) lookup by CSS variable string

Token groups: `backgrounds`, `foreground-emphasis`, `foreground-surface`, `accent`, `borders-structural`, `borders-semantic`, `focus`.

**Color-only system** — there are no typography, spacing, or shadow tokens. Font families live in `globals.css` as CSS custom properties; all other typography decisions are Tailwind utility classes applied directly in components.

`contrastTargets` on foreground tokens lists which background token keys the foreground must pass 4.5:1 contrast against.

## ../hooks/use-resolved-tokens.ts

```ts
const tokens = useResolvedTokens()
// Record<string, string>
// { '--background-primary': 'oklch(0.99 0.002 240)', '--background': 'oklch(0.99 0.002 240)', ... }
```

Subscribes to both `useThemeStore` (active theme + token refs) and `useScaleStore` (all scales). Memoized on `activeTheme?.tokens` and `scales` — intentionally omits `activeTheme` object reference to avoid re-renders when Immer creates a new object reference without changing token values.
