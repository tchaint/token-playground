'use client'

import { useState } from 'react'
import { useThemeStore } from '@/lib/stores/theme-store'
import { useScaleStore } from '@/lib/stores/scale-store'
import { wcagContrastRatio } from '@/lib/color/contrast'
import { oklchToCSS } from '@/lib/color/converter'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SemanticTokenMap, TokenRef, ColorScale } from '@/lib/types'

function ScaleStrip({ scale }: { scale: ColorScale }) {
  return (
    <span className="flex shrink-0 gap-px">
      {scale.steps.map((step) => (
        <span
          key={step.index}
          className="inline-block h-2.5 w-[7px] first:rounded-l-[2px] last:rounded-r-[2px]"
          style={{ background: oklchToCSS(step.oklch) }}
        />
      ))}
    </span>
  )
}

interface QuickFillProps {
  themeId: string
}

export function QuickFill({ themeId }: QuickFillProps) {
  const { themes, setToken, addTheme, setActiveTheme } = useThemeStore()
  const { scales } = useScaleStore()

  const theme = themes.find((t) => t.id === themeId)

  const [neutralOpen, setNeutralOpen] = useState(false)
  const [neutralScaleId, setNeutralScaleId] = useState(scales[0]?.id ?? '')

  const [accentOpen, setAccentOpen] = useState(false)
  const [accentScaleId, setAccentScaleId] = useState(scales[0]?.id ?? '')

  function applyNeutral() {
    const scale = scales.find((s) => s.id === neutralScaleId)
    if (!scale) return

    const bgStep1 = scale.steps.find((s) => s.index === 1)
    const fgStep10 = scale.steps.find((s) => s.index === 10)

    let fgTertiaryStep = 9
    if (bgStep1 && fgStep10) {
      try {
        const ratio = wcagContrastRatio(oklchToCSS(fgStep10.oklch), oklchToCSS(bgStep1.oklch))
        if (ratio >= 4.5) fgTertiaryStep = 10
      } catch {
        // keep step 9
      }
    }

    const ref = (step: number): TokenRef => ({ scaleId: neutralScaleId, stepIndex: step })

    const mappings: [keyof SemanticTokenMap, TokenRef][] = [
      ['backgroundPrimary', ref(1)],
      ['backgroundSecondary', ref(2)],
      ['backgroundTertiary', ref(3)],
      ['backgroundPopover', ref(1)],
      ['foregroundPrimary', ref(12)],
      ['foregroundSecondary', ref(11)],
      ['foregroundTertiary', ref(fgTertiaryStep)],
      ['foregroundPopover', ref(12)],
      ['borderSecondary', ref(6)],
      ['borderPrimary', ref(7)],
      ['borderInput', ref(7)],
    ]

    for (const [key, tokenRef] of mappings) {
      setToken(themeId, key, tokenRef)
    }
    setNeutralOpen(false)
  }

  function applyAccent() {
    if (!theme) return
    const accentScale = scales.find((s) => s.id === accentScaleId)
    if (!accentScale) return

    // Use step 1 of the current neutral scale (backgroundPrimary's scale) as the
    // foreground on solid accent fills. Fall back to step 1 of the accent scale.
    const neutralScaleIdCurrent = theme.tokens.backgroundPrimary?.scaleId
    const neutralScale = scales.find((s) => s.id === neutralScaleIdCurrent)
    const fgSolidRef: TokenRef = neutralScale
      ? { scaleId: neutralScale.id, stepIndex: 1 }
      : { scaleId: accentScaleId, stepIndex: 1 }

    const ref = (step: number): TokenRef => ({ scaleId: accentScaleId, stepIndex: step })

    const mappings: [keyof SemanticTokenMap, TokenRef][] = [
      ['accentPrimary', ref(9)],
      ['accentPrimaryForeground', fgSolidRef],
      ['accentSecondary', ref(3)],
      ['accentSecondaryForeground', ref(11)],
      ['accentHover', ref(4)],
      ['accentHoverForeground', ref(11)],
      ['ring', ref(8)],
    ]

    for (const [key, tokenRef] of mappings) {
      setToken(themeId, key, tokenRef)
    }
    setAccentOpen(false)
  }

  function invertForDark() {
    if (!theme) return

    const invertedTokens = Object.fromEntries(
      Object.entries(theme.tokens).map(([key, ref]) => [
        key,
        { scaleId: ref.scaleId, stepIndex: 13 - ref.stepIndex },
      ]),
    ) as unknown as SemanticTokenMap

    const darkTheme = {
      id: crypto.randomUUID(),
      name: `${theme.name} (Dark)`,
      mode: 'dark' as const,
      tokens: invertedTokens,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    addTheme(darkTheme)
    setActiveTheme(darkTheme.id)
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-0.5 px-2 py-1.5 border-b">
      {/* Auto-map Neutral */}
      <Popover open={neutralOpen} onOpenChange={setNeutralOpen}>
        <PopoverTrigger
          render={
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              Auto-map Neutral
            </Button>
          }
        />
        <PopoverContent side="bottom" align="start" className="w-64 p-3 gap-2">
          <p className="text-xs font-medium text-foreground">Select neutral scale</p>
          <Select value={neutralScaleId} onValueChange={(v) => v && setNeutralScaleId(v)}>
            <SelectTrigger size="sm" className="h-7 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scales.map((scale) => (
                <SelectItem key={scale.id} value={scale.id}>
                  <span className="flex items-center gap-2 text-xs">
                    <span className="min-w-[3.5rem]">{scale.name}</span>
                    <ScaleStrip scale={scale} />
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="w-full" onClick={applyNeutral}>
            Apply
          </Button>
        </PopoverContent>
      </Popover>

      {/* Auto-map Accent */}
      <Popover open={accentOpen} onOpenChange={setAccentOpen}>
        <PopoverTrigger
          render={
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              Auto-map Accent
            </Button>
          }
        />
        <PopoverContent side="bottom" align="start" className="w-64 p-3 gap-2">
          <p className="text-xs font-medium text-foreground">Select accent scale</p>
          <Select value={accentScaleId} onValueChange={(v) => v && setAccentScaleId(v)}>
            <SelectTrigger size="sm" className="h-7 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scales.map((scale) => (
                <SelectItem key={scale.id} value={scale.id}>
                  <span className="flex items-center gap-2 text-xs">
                    <span className="min-w-[3.5rem]">{scale.name}</span>
                    <ScaleStrip scale={scale} />
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="w-full" onClick={applyAccent}>
            Apply
          </Button>
        </PopoverContent>
      </Popover>

      {/* Invert for Dark */}
      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={invertForDark}>
        Invert for Dark
      </Button>
    </div>
  )
}
