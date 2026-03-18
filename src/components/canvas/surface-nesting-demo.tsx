'use client'

// ─── Surface Nesting Demo ─────────────────────────────────────────────────────
//
// Visual demonstration of the three-layer surface hierarchy: background →
// card → muted. Each surface is labeled with the CSS token it reads from.

export function SurfaceNestingDemo() {
  return (
    <div
      className="rounded-xl border border-border p-6 space-y-2"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Surface token badge */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Surface Hierarchy</h3>
          <p className="text-sm text-muted-foreground mt-0.5 text-pretty">
            Three nested surfaces — each mapped to a semantic background token.
          </p>
        </div>
        <TokenBadge token="--background-primary" alias="bg-background" />
      </div>

      {/* Foreground levels at bg-background */}
      <ForegroundStack />

      {/* Card surface */}
      <div
        className="rounded-lg border border-border p-4 space-y-3 mt-4"
        style={{ backgroundColor: 'var(--card)' }}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Card surface</p>
          <TokenBadge token="--background-secondary" alias="bg-card" />
        </div>
        <p className="text-sm text-muted-foreground text-pretty">
          Secondary surface for elevated content like cards, panels, and modals.
        </p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
          Tertiary / de-emphasized helper text
        </p>

        {/* Muted well */}
        <div
          className="rounded-md border border-border/60 p-3 space-y-1.5 mt-2"
          style={{ backgroundColor: 'var(--muted)' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">Muted well</p>
            <TokenBadge token="--background-tertiary" alias="bg-muted" small />
          </div>
          <p className="text-xs text-muted-foreground">
            Inset region for code blocks, metadata, and subtle containers.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Foreground Stack ─────────────────────────────────────────────────────────

function ForegroundStack() {
  return (
    <div className="space-y-0.5 pl-1">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: 'var(--foreground)' }} />
        <span className="text-sm font-semibold text-foreground">
          Primary foreground
        </span>
        <TokenBadge token="--foreground-primary" alias="text-foreground" small />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: 'var(--muted-foreground)' }} />
        <span className="text-sm text-muted-foreground">
          Secondary foreground
        </span>
        <TokenBadge token="--foreground-secondary" alias="text-muted-foreground" small />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full shrink-0 opacity-50" style={{ backgroundColor: 'var(--muted-foreground)' }} />
        <span className="text-xs opacity-50" style={{ color: 'var(--muted-foreground)' }}>
          Tertiary foreground (60% opacity)
        </span>
        <TokenBadge token="--foreground-tertiary" alias="opacity-60" small />
      </div>
    </div>
  )
}

// ─── Token Badge ──────────────────────────────────────────────────────────────

function TokenBadge({ token, alias, small }: { token: string; alias: string; small?: boolean }) {
  return (
    <div className={`flex flex-col items-end gap-0.5 shrink-0 ${small ? 'ml-auto' : ''}`}>
      <code
        className={`font-mono bg-muted rounded px-1.5 py-0.5 text-foreground/70 ${small ? 'text-[9px]' : 'text-[10px]'}`}
      >
        {token}
      </code>
      <span className={`text-muted-foreground/60 ${small ? 'text-[9px]' : 'text-[10px]'}`}>
        {alias}
      </span>
    </div>
  )
}
