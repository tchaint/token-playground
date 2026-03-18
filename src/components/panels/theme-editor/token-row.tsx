'use client'

import { useMemo } from 'react'
import { useThemeStore } from '@/lib/stores/theme-store'
import { useScaleStore } from '@/lib/stores/scale-store'
import { SEMANTIC_TOKEN_MAP } from '@/lib/tokens/semantic-tokens'
import { resolveTokenRef } from '@/lib/tokens/resolve'
import { oklchToHex, oklchToCSS } from '@/lib/color/converter'
import { wcagContrastRatio, contrastLevel } from '@/lib/color/contrast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { SemanticTokenMap, ColorStep } from '@/lib/types'

interface TokenRowProps {
  tokenKey: keyof SemanticTokenMap
  themeId: string
}

// Abbreviate a token key to a compact contrast badge label.
// "--background-primary" → "bg-pri", "--accent-destructive" → "ac-des"
function shortLabel(key: keyof SemanticTokenMap): string {
  const parts = SEMANTIC_TOKEN_MAP[key].cssVariable.replace('--', '').split('-')
  const prefixes: Record<string, string> = {
    background: 'bg',
    foreground: 'fg',
    accent: 'ac',
    border: 'bd',
  }
  const prefix = prefixes[parts[0]] ?? parts[0].slice(0, 2)
  const suffix = parts[1] ? parts[1].slice(0, 3) : ''
  return suffix ? `${prefix}-${suffix}` : prefix
}

function ScaleStrip({ steps }: { steps: ColorStep[] }) {
  return (
    <span className="flex shrink-0 gap-px">
      {steps.map((step) => (
        <span
          key={step.index}
          className="inline-block h-2.5 w-[7px] first:rounded-l-[2px] last:rounded-r-[2px]"
          style={{ background: oklchToCSS(step.oklch) }}
        />
      ))}
    </span>
  )
}

export function TokenRow({ tokenKey, themeId }: TokenRowProps) {
  const { themes, setToken } = useThemeStore()
  const { scales } = useScaleStore()

  const theme = themes.find((t) => t.id === themeId)
  const descriptor = SEMANTIC_TOKEN_MAP[tokenKey]
  const ref = theme?.tokens[tokenKey]

  const resolvedCss = useMemo(() => {
    if (!ref) return null
    return resolveTokenRef(ref, scales)
  }, [ref, scales])

  const currentScale = useMemo(() => {
    if (!ref) return null
    return scales.find((s) => s.id === ref.scaleId) ?? null
  }, [ref, scales])

  const contrastBadges = useMemo(() => {
    if (!descriptor.contrastTargets || !resolvedCss || !theme) return []
    return descriptor.contrastTargets
      .map((targetKey) => {
        const targetRef = theme.tokens[targetKey]
        if (!targetRef) return null
        const targetCss = resolveTokenRef(targetRef, scales)
        if (!targetCss) return null
        try {
          const ratio = wcagContrastRatio(resolvedCss, targetCss)
          return {
            label: shortLabel(targetKey),
            ratio: ratio.toFixed(1),
            level: contrastLevel(ratio),
          }
        } catch {
          return null
        }
      })
      .filter((b): b is NonNullable<typeof b> => b !== null)
  }, [descriptor.contrastTargets, resolvedCss, theme, scales])

  if (!theme || !ref) return null

  return (
    <TooltipProvider delay={250}>
      <div className="border-b border-border/25 px-3 py-2.5 last:border-0">
        {/* Row 1 — CSS var name, description, swatch */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <code className="block text-[10px] font-mono leading-none tracking-tight text-foreground/55">
              {descriptor.cssVariable}
            </code>
            <p className="mt-1 text-[10px] leading-snug text-muted-foreground/70">
              {descriptor.description}
            </p>
          </div>
          {resolvedCss ? (
            <div
              className="mt-0.5 size-5 shrink-0 rounded ring-1 ring-inset ring-black/10 dark:ring-white/10"
              style={{ background: resolvedCss }}
            />
          ) : (
            <div className="mt-0.5 size-5 shrink-0 rounded bg-muted ring-1 ring-inset ring-border/50" />
          )}
        </div>

        {/* Row 2 — scale picker */}
        <div className="mt-2">
          <Select
            value={ref.scaleId}
            onValueChange={(val) =>
              val &&
              setToken(themeId, tokenKey, { scaleId: val, stepIndex: ref.stepIndex })
            }
          >
            <SelectTrigger size="sm" className="h-7 w-full gap-2 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {scales.map((scale) => (
                <SelectItem key={scale.id} value={scale.id}>
                  <span className="flex items-center gap-2 text-xs">
                    <span className="min-w-[3.5rem]">{scale.name}</span>
                    <ScaleStrip steps={scale.steps} />
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Row 3 — step picker */}
        {currentScale && (
          <div className="mt-1.5 flex gap-[3px]">
            {currentScale.steps.map((step) => {
              const css = oklchToCSS(step.oklch)
              const hex = oklchToHex(step.oklch)
              const isActive = step.index === ref.stepIndex
              return (
                <Tooltip key={step.index}>
                  <TooltipTrigger
                    render={
                      <button
                        onClick={() =>
                          setToken(themeId, tokenKey, {
                            scaleId: ref.scaleId,
                            stepIndex: step.index,
                          })
                        }
                        className={cn(
                          'relative size-5 shrink-0 rounded-[3px] transition-all duration-100',
                          'hover:z-10 hover:scale-110',
                          isActive
                            ? 'ring-2 ring-ring ring-offset-[2px] ring-offset-background'
                            : 'hover:ring-1 hover:ring-foreground/30 hover:ring-offset-[1px] hover:ring-offset-background',
                        )}
                        style={{ background: css }}
                      />
                    }
                  />
                  <TooltipContent side="top" sideOffset={6}>
                    <div className="space-y-px">
                      <div className="font-semibold">Step {step.index}</div>
                      <div className="font-mono text-background/80">{hex}</div>
                      <div className="font-mono text-background/55">
                        {step.oklch.l.toFixed(3)} {step.oklch.c.toFixed(3)}{' '}
                        {step.oklch.h.toFixed(1)}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        )}

        {/* Row 4 — contrast badges (foreground tokens only) */}
        {contrastBadges.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {contrastBadges.map((badge) => (
              <span
                key={badge.label}
                className={cn(
                  'inline-flex items-center gap-px rounded px-1.5 py-px font-mono text-[9px] font-medium',
                  badge.level === 'pass' &&
                    'bg-green-500/12 text-green-700 dark:text-green-400',
                  badge.level === 'large-only' &&
                    'bg-amber-500/12 text-amber-700 dark:text-amber-500',
                  badge.level === 'fail' &&
                    'bg-red-500/12 text-red-700 dark:text-red-400',
                )}
              >
                {badge.label}:{badge.ratio}
                <span aria-hidden="true">
                  {badge.level === 'pass' ? ' ✓' : ' ✗'}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
