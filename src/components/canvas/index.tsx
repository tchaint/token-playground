'use client'

import { CanvasWrapper } from '@/components/playground/canvas-wrapper'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

// ─── Button variants to demo ──────────────────────────────────────────────────

const BUTTON_VARIANTS = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
] as const

// ─── Surface swatches ─────────────────────────────────────────────────────────

const SURFACE_SWATCHES = [
  { label: 'bg-background', className: 'bg-background', token: '--background → background-primary' },
  { label: 'bg-card',       className: 'bg-card',       token: '--card → background-secondary' },
  { label: 'bg-muted',      className: 'bg-muted',      token: '--muted → background-tertiary' },
] as const

export function ComponentCanvas() {
  return (
    <CanvasWrapper className="h-full overflow-auto bg-background">
      <div className="mx-auto max-w-2xl space-y-10 p-8">

        {/* ── Buttons ──────────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-2">
            {BUTTON_VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col items-center gap-1.5">
                <Button variant={variant}>{variant}</Button>
                <span className="text-[10px] tabular-nums text-muted-foreground">{variant}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Surfaces ─────────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Surfaces
          </h2>
          <div className="flex gap-3">
            {SURFACE_SWATCHES.map(({ label, className, token }) => (
              <div key={label} className="flex-1 space-y-1.5">
                <div
                  className={`h-16 rounded-lg border border-border ${className}`}
                />
                <p className="text-xs font-medium text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{token}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography ───────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Typography
          </h2>
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
              text-foreground — primary emphasis
            </p>
            <p className="text-sm text-muted-foreground">
              text-muted-foreground — secondary / supporting text
            </p>
            <p className="text-xs text-muted-foreground/60">
              text-muted-foreground/60 — tertiary / de-emphasized
            </p>
          </div>
        </section>

        {/* ── Card ─────────────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Card
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Token Playground</CardTitle>
              <CardDescription>
                This card surface uses <code className="font-mono text-xs">bg-card</code>, which
                maps to <code className="font-mono text-xs">--background-secondary</code> via the
                CSS bridge. Edit the gray scale to see this update live.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-pretty">
                All shadcn/ui components inside the canvas read CSS variables that are
                injected by <code className="font-mono text-xs">CanvasWrapper</code>. Changes
                to the token map propagate instantly — no page reload required.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">Save theme</Button>
              <Button size="sm" variant="outline">Export CSS</Button>
            </CardFooter>
          </Card>
        </section>

      </div>
    </CanvasWrapper>
  )
}
