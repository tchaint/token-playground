'use client'

import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useThemeStore } from '@/lib/stores/theme-store'
import { useScaleStore } from '@/lib/stores/scale-store'
import { resolveTokenRef } from '@/lib/tokens/resolve'
import { wcagContrastRatio, apcaContrast, contrastLevel } from '@/lib/color/contrast'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { SemanticTokenMap } from '@/lib/types'

const ROWS: (keyof SemanticTokenMap)[] = [
  'foregroundPrimary',
  'foregroundSecondary',
  'foregroundTertiary',
]

const COLS: (keyof SemanticTokenMap)[] = [
  'backgroundPrimary',
  'backgroundSecondary',
  'backgroundTertiary',
]

const ROW_LABELS = ['fg-pri', 'fg-sec', 'fg-ter']
const COL_LABELS = ['bg-pri', 'bg-sec', 'bg-ter']

interface CellData {
  wcag: number
  apca: number
  level: 'pass' | 'large-only' | 'fail'
  na: boolean
}

export function ContrastMatrix() {
  const [open, setOpen] = useState(true)
  const { themes, activeThemeId } = useThemeStore()
  const { scales } = useScaleStore()

  const theme = themes.find((t) => t.id === activeThemeId)

  const matrix = useMemo<(CellData | null)[][] | null>(() => {
    if (!theme) return null

    return ROWS.map((rowKey) =>
      COLS.map((colKey) => {
        // foregroundTertiary × backgroundTertiary: not a required pairing
        if (rowKey === 'foregroundTertiary' && colKey === 'backgroundTertiary') {
          return { wcag: 0, apca: 0, level: 'fail', na: true }
        }

        const fgRef = theme.tokens[rowKey]
        const bgRef = theme.tokens[colKey]
        if (!fgRef || !bgRef) return null

        const fgCss = resolveTokenRef(fgRef, scales)
        const bgCss = resolveTokenRef(bgRef, scales)
        if (!fgCss || !bgCss) return null

        try {
          const wcag = wcagContrastRatio(fgCss, bgCss)
          const apca = apcaContrast(fgCss, bgCss)
          return { wcag, apca, level: contrastLevel(wcag), na: false }
        } catch {
          return null
        }
      }),
    )
  }, [theme, scales])

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 hover:bg-muted/40 transition-colors">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Contrast Matrix
        </span>
        <ChevronDown
          className={cn(
            'size-3.5 text-muted-foreground/60 transition-transform duration-150',
            open && 'rotate-180',
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 pb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-12" />
                {COL_LABELS.map((label) => (
                  <th
                    key={label}
                    className="pb-1.5 text-center font-mono text-[9px] font-medium text-muted-foreground/60"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((rowKey, rowIdx) => (
                <tr key={rowKey}>
                  <td className="py-1 pr-2 font-mono text-[9px] text-muted-foreground/60">
                    {ROW_LABELS[rowIdx]}
                  </td>
                  {COLS.map((colKey, colIdx) => {
                    const cell = matrix?.[rowIdx]?.[colIdx]
                    return (
                      <td key={colKey} className="py-1 px-1 text-center">
                        {!cell ? (
                          <span className="font-mono text-[9px] text-muted-foreground/30">—</span>
                        ) : cell.na ? (
                          <span className="inline-flex flex-col items-center gap-0.5">
                            <span className="rounded bg-muted px-1.5 py-px font-mono text-[9px] text-muted-foreground/40">
                              N/A
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex flex-col items-center gap-0.5">
                            <span
                              className={cn(
                                'rounded px-1.5 py-px font-mono text-[9px] font-medium',
                                cell.level === 'pass' &&
                                  'bg-green-500/12 text-green-700 dark:text-green-400',
                                cell.level === 'large-only' &&
                                  'bg-amber-500/12 text-amber-700 dark:text-amber-500',
                                cell.level === 'fail' &&
                                  'bg-red-500/12 text-red-700 dark:text-red-400',
                              )}
                            >
                              {cell.wcag.toFixed(1)}:1{' '}
                              {cell.level === 'pass' ? '✓' : '✗'}
                            </span>
                            <span className="font-mono text-[8px] text-muted-foreground/45">
                              Lc {Math.round(Math.abs(cell.apca))}
                            </span>
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
