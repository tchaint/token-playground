'use client'

import { useState } from 'react'
import { TriangleAlertIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { ColorScale } from '@/lib/types'
import { oklchToCSS, oklchToHex } from '@/lib/color/converter'
import { isInSRGB, clampToSRGB, countOutOfGamut } from '@/lib/color/gamut'
import { useScaleStore } from '@/lib/stores/scale-store'
import { RADIX_STEP_LABELS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// ─── StepInput ────────────────────────────────────────────────────────────────

interface StepInputProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  decimals: number
  onCommit: (v: number) => void
}

function StepInput({ label, value, min, max, step, decimals, onCommit }: StepInputProps) {
  const [draft, setDraft] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDraft(e.target.value)
    const n = parseFloat(e.target.value)
    if (!isNaN(n)) onCommit(Math.max(min, Math.min(max, n)))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = parseFloat(Math.max(min, Math.min(max, value + step)).toFixed(decimals))
      setDraft(next.toFixed(decimals))
      onCommit(next)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = parseFloat(Math.max(min, Math.min(max, value - step)).toFixed(decimals))
      setDraft(next.toFixed(decimals))
      onCommit(next)
    } else if (e.key === 'Enter') {
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-center text-[9px] font-medium uppercase tracking-wider text-muted-foreground/50">
        {label}
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={draft ?? value.toFixed(decimals)}
        onChange={handleChange}
        onFocus={(e) => {
          setDraft(value.toFixed(decimals))
          e.target.select()
        }}
        onBlur={() => setDraft(null)}
        onKeyDown={handleKeyDown}
        className={cn(
          'h-6 w-full rounded-md border border-input bg-transparent',
          'px-0.5 text-center text-[10px] tabular-nums',
          'outline-none transition-colors',
          'focus:border-ring focus:ring-1 focus:ring-ring/30',
        )}
      />
    </div>
  )
}

// ─── StepRow ──────────────────────────────────────────────────────────────────

function StepRow({ scale, stepIndex }: { scale: ColorScale; stepIndex: number }) {
  const { updateStep } = useScaleStore()
  const step = scale.steps.find((s) => s.index === stepIndex)!
  const { l, c, h, a } = step.oklch

  const css = oklchToCSS(step.oklch)
  const hex = oklchToHex(step.oklch)
  const inSRGB = isInSRGB(step.oklch)

  function commit(channel: 'l' | 'c' | 'h' | 'a', v: number) {
    updateStep(scale.id, stepIndex, { [channel]: v })
  }

  function copyHex() {
    navigator.clipboard.writeText(hex).then(() => toast(`Copied ${hex}`))
  }

  return (
    <div className="px-3 py-2.5">
      <div
        className="grid items-start gap-x-2"
        style={{ gridTemplateColumns: '16px 28px 1fr' }}
      >
        {/* Step number */}
        <span className="mt-[7px] text-right text-[10px] tabular-nums text-muted-foreground/40">
          {stepIndex}
        </span>

        {/* Swatch */}
        <div
          className="mt-[1px] size-7 shrink-0 rounded"
          style={{ backgroundColor: css }}
        />

        {/* Right column */}
        <div className="flex min-w-0 flex-col gap-1.5">
          {/* Hint + hex + gamut */}
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="min-w-0 flex-1 truncate text-[11px] leading-5 text-muted-foreground/60">
              {RADIX_STEP_LABELS[stepIndex - 1]}
            </span>
            <button
              onClick={copyHex}
              className="shrink-0 font-mono text-[10px] leading-5 text-muted-foreground/40 transition-colors hover:text-foreground"
              title="Click to copy"
            >
              {hex}
            </button>
            {!inSRGB ? (
              <Tooltip>
                <TooltipTrigger className="flex shrink-0 items-center leading-5">
                  <TriangleAlertIcon className="size-3 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={6} className="max-w-44 text-center">
                  Outside sRGB gamut — may render differently across browsers
                </TooltipContent>
              </Tooltip>
            ) : (
              // placeholder to keep row height stable
              <span className="size-3 shrink-0" />
            )}
          </div>

          {/* OKLCH inputs */}
          <div className="grid grid-cols-4 gap-1">
            <StepInput
              label="L"
              value={l}
              min={0}
              max={1}
              step={0.01}
              decimals={2}
              onCommit={(v) => commit('l', v)}
            />
            <StepInput
              label="C"
              value={c}
              min={0}
              max={0.4}
              step={0.005}
              decimals={3}
              onCommit={(v) => commit('c', v)}
            />
            <StepInput
              label="H"
              value={h}
              min={0}
              max={360}
              step={1}
              decimals={0}
              onCommit={(v) => commit('h', v)}
            />
            <StepInput
              label="A"
              value={a}
              min={0}
              max={1}
              step={0.01}
              decimals={2}
              onCommit={(v) => commit('a', v)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── StepEditor ───────────────────────────────────────────────────────────────

interface StepEditorProps {
  scale: ColorScale
}

export function StepEditor({ scale }: StepEditorProps) {
  const { updateScale } = useScaleStore()
  const outOfGamut = countOutOfGamut(scale.steps)

  function clampAll() {
    const steps = scale.steps.map((step) => ({
      ...step,
      oklch: isInSRGB(step.oklch) ? step.oklch : clampToSRGB(step.oklch),
    }))
    updateScale(scale.id, { steps })
    toast(`Clamped ${outOfGamut} step${outOfGamut !== 1 ? 's' : ''} to sRGB`)
  }

  return (
    <TooltipProvider delay={500}>
      {/* Summary header */}
      <div className="border-b px-3 py-2.5">
        {/* Larger swatch strip */}
        <div className="mb-2.5 flex gap-px overflow-hidden rounded-md">
          {scale.steps.map((step) => (
            <div
              key={step.index}
              className="h-7 flex-1"
              style={{ backgroundColor: oklchToCSS(step.oklch) }}
              title={`Step ${step.index}`}
            />
          ))}
        </div>

        {/* Gamut status */}
        <div className="flex items-center justify-between">
          {outOfGamut === 0 ? (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
              All steps in sRGB
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-amber-500">
              <TriangleAlertIcon className="size-3" />
              {outOfGamut} step{outOfGamut !== 1 ? 's' : ''} outside sRGB
            </span>
          )}
          {outOfGamut > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[11px]"
              onClick={clampAll}
            >
              Clamp all
            </Button>
          )}
        </div>
      </div>

      {/* Step rows */}
      <div className="divide-y">
        {scale.steps.map((step) => (
          <StepRow key={step.index} scale={scale} stepIndex={step.index} />
        ))}
      </div>
    </TooltipProvider>
  )
}
