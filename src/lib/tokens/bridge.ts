// ─── CSS Bridge Map ───────────────────────────────────────────────────────────
//
// Maps our semantic token CSS variable names to the variable names that
// shadcn/ui components expect. This is the translation layer that lets
// shadcn/ui components work without modification — they read their original
// variable names, and we alias our tokens onto them.
//
// Usage in CanvasWrapper CSS:
//   .canvas-wrapper {
//     --background: var(--background-primary);
//     --foreground: var(--foreground-primary);
//     ...
//   }
//
// One of our tokens (--foreground-primary) maps to two shadcn variables
// (--foreground and --card-foreground). The value type is string | string[]
// to handle these one-to-many cases.

export const CSS_BRIDGE_MAP: Record<string, string | string[]> = {
  '--background-primary': ['--background'],
  '--foreground-primary': ['--foreground', '--card-foreground'],
  '--background-secondary': ['--card'],
  '--background-tertiary': ['--muted'],
  '--foreground-secondary': ['--muted-foreground'],
  '--accent-primary': ['--primary'],
  '--accent-primary-foreground': ['--primary-foreground'],
  '--accent-secondary': ['--secondary'],
  '--accent-secondary-foreground': ['--secondary-foreground'],
  '--accent-hover': ['--accent'],
  '--accent-hover-foreground': ['--accent-foreground'],
  '--accent-destructive': ['--destructive'],
  '--accent-destructive-foreground': ['--destructive-foreground'],
  '--border-primary': ['--border'],
  '--border-input': ['--input'],
  '--ring': ['--ring'],
  '--background-popover': ['--popover'],
  '--foreground-popover': ['--popover-foreground'],
}

// ─── Reverse Bridge Map ───────────────────────────────────────────────────────
//
// Maps shadcn/ui variable names back to our semantic token variable names.
// Used to look up the source token when reading a shadcn component's var.

export const REVERSE_BRIDGE_MAP: Record<string, string> = {
  '--background': '--background-primary',
  '--foreground': '--foreground-primary',
  '--card': '--background-secondary',
  '--card-foreground': '--foreground-primary',
  '--muted': '--background-tertiary',
  '--muted-foreground': '--foreground-secondary',
  '--primary': '--accent-primary',
  '--primary-foreground': '--accent-primary-foreground',
  '--secondary': '--accent-secondary',
  '--secondary-foreground': '--accent-secondary-foreground',
  '--accent': '--accent-hover',
  '--accent-foreground': '--accent-hover-foreground',
  '--destructive': '--accent-destructive',
  '--destructive-foreground': '--accent-destructive-foreground',
  '--border': '--border-primary',
  '--input': '--border-input',
  '--ring': '--ring',
  '--popover': '--background-popover',
  '--popover-foreground': '--foreground-popover',
}

// ─── Bridge CSS Generator ─────────────────────────────────────────────────────
//
// Generates the CSS bridge declarations for use inside .canvas-wrapper.
// Output example:
//   --background: var(--background-primary);
//   --foreground: var(--foreground-primary);
//   --card-foreground: var(--foreground-primary);
//   ...

export function generateBridgeCSS(selector = '.canvas-wrapper'): string {
  const declarations: string[] = []

  for (const [ourVar, shadcnVars] of Object.entries(CSS_BRIDGE_MAP)) {
    const targets = Array.isArray(shadcnVars) ? shadcnVars : [shadcnVars]
    for (const shadcnVar of targets) {
      declarations.push(`  ${shadcnVar}: var(${ourVar});`)
    }
  }

  return `${selector} {\n${declarations.join('\n')}\n}`
}
