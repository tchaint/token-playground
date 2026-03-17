'use client'

import { useEffect, useState } from 'react'
import { ChevronDownIcon, RefreshCwIcon } from 'lucide-react'
import type { ColorScale, ScaleGeneratorSettings } from '@/lib/types'
import { generateScale, defaultGeneratorSettings } from '@/lib/color/generator'
import { useScaleStore } from '@/lib/stores/scale-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

// base-ui slider onValueChange returns `number | readonly number[]`
function toArr(v: number | readonly number[]): readonly number[] {
  return typeof v === 'number' ? [v] : v
}

// ─── Chroma Curve Preview ─────────────────────────────────────────────────────

function ChromaCurvePreview({ settings }: { settings: ScaleGeneratorSettings }) {
  const W = 100
  const H = 44
  const PX = 3
  const PT = 6
  const PB = 4
  const iW = W - PX * 2
  const iH = H - PT - PB

  const steps = generateScale(settings)
  const maxC = Math.max(...steps.map((s) => s.oklch.c), 0.0001)

  const pts = steps.map((step, i): [number, number] => [
    PX + (i / 11) * iW,
    PT + iH - (step.oklch.c / maxC) * iH,
  ])

  const line = pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ')
  const area = `${line} L${(PX + iW).toFixed(2)},${(PT + iH).toFixed(2)} L${PX.toFixed(2)},${(PT + iH).toFixed(2)} Z`

  // Step index tick marks
  const tickY = PT + iH + 3

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H * 2 }}>
      <path d={area} className="fill-primary/10" />
      <path d={line} className="fill-none stroke-primary" strokeWidth={1.5} strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5} className="fill-primary" />
      ))}
      {/* Baseline */}
      <line
        x1={PX}
        y1={PT + iH}
        x2={PX + iW}
        y2={PT + iH}
        className="stroke-border"
        strokeWidth={0.75}
      />
      {/* Step ticks every 3 steps */}
      {pts.map(([x], i) =>
        (i + 1) % 3 === 0 || i === 0 || i === 11 ? (
          <text
            key={i}
            x={x}
            y={tickY + 4}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 5 }}
          >
            {i + 1}
          </text>
        ) : null,
      )}
    </svg>
  )
}

// ─── ControlRow ───────────────────────────────────────────────────────────────

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

// ─── SliderWithInput ──────────────────────────────────────────────────────────

function SliderWithInput({
  value,
  min,
  max,
  step = 0.01,
  decimals = 2,
  onChange,
  sliderClassName,
}: {
  value: number
  min: number
  max: number
  step?: number
  decimals?: number
  onChange: (v: number) => void
  sliderClassName?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(toArr(vals)[0])}
        className={cn('flex-1', sliderClassName)}
      />
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value.toFixed(decimals)}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)))
        }}
        className="h-7 w-[52px] shrink-0 px-1.5 text-center text-xs tabular-nums"
      />
    </div>
  )
}

// ─── ScaleGenerator ───────────────────────────────────────────────────────────

interface ScaleGeneratorProps {
  scale: ColorScale
}

export function ScaleGenerator({ scale }: ScaleGeneratorProps) {
  const { updateScale } = useScaleStore()
  const [open, setOpen] = useState(true)
  const [settings, setSettings] = useState<ScaleGeneratorSettings>(defaultGeneratorSettings)

  // Reset settings when a different scale is selected
  useEffect(() => {
    setSettings(defaultGeneratorSettings())
  }, [scale.id])

  function patch<K extends keyof ScaleGeneratorSettings>(key: K, value: ScaleGeneratorSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function regenerate() {
    updateScale(scale.id, { steps: generateScale(settings) })
  }

  const isGaussian = settings.chromaCurve === 'gaussian'

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b">
      {/* Header */}
      <CollapsibleTrigger
        className={cn(
          'flex w-full select-none items-center justify-between px-3 py-2.5',
          'text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground',
        )}
      >
        <span>Generator</span>
        <ChevronDownIcon
          className={cn('size-3.5 transition-transform duration-150', open && 'rotate-180')}
        />
      </CollapsibleTrigger>

      {/* Controls */}
      <CollapsibleContent>
        <div className="flex flex-col gap-4 px-3 pb-4 pt-1">
          {/* ── Hue ── */}
          <ControlRow label="Hue">
            <div className="flex items-center gap-2">
              {/* Gradient track wrapper */}
              <div className="relative flex flex-1 items-center">
                <div
                  className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                  style={{
                    background:
                      'linear-gradient(to right, oklch(0.65 0.2 0), oklch(0.65 0.2 60), oklch(0.65 0.2 120), oklch(0.65 0.2 180), oklch(0.65 0.2 240), oklch(0.65 0.2 300), oklch(0.65 0.2 360))',
                  }}
                />
                <Slider
                  value={[settings.baseHue]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(vals) => patch('baseHue', toArr(vals)[0])}
                  className="[&_[data-slot=slider-range]]:hidden [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-track]]:h-1.5"
                />
              </div>
              <Input
                type="number"
                min={0}
                max={360}
                value={settings.baseHue}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (!isNaN(v)) patch('baseHue', Math.max(0, Math.min(360, v)))
                }}
                className="h-7 w-[52px] shrink-0 px-1.5 text-center text-xs tabular-nums"
              />
            </div>
          </ControlRow>

          {/* ── Base Chroma ── */}
          <ControlRow label="Saturation intensity">
            <SliderWithInput
              value={settings.baseChroma}
              min={0}
              max={0.4}
              step={0.005}
              decimals={3}
              onChange={(v) => patch('baseChroma', v)}
            />
          </ControlRow>

          {/* ── Lightness Range ── */}
          <ControlRow label="Lightness range">
            <div className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                {settings.lightnessRange.min.toFixed(2)}
              </span>
              <Slider
                value={[settings.lightnessRange.min, settings.lightnessRange.max]}
                min={0.05}
                max={1}
                step={0.01}
                onValueChange={(vals) => {
                  const a = toArr(vals)
                  patch('lightnessRange', { min: a[0], max: a[1] })
                }}
                className="flex-1"
              />
              <span className="w-8 shrink-0 text-[11px] tabular-nums text-muted-foreground">
                {settings.lightnessRange.max.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground/50">
              <span>Darkest</span>
              <span>Lightest</span>
            </div>
          </ControlRow>

          {/* ── Chroma Distribution ── */}
          <ControlRow label="Chroma distribution">
            <Select
              value={settings.chromaCurve}
              onValueChange={(val) =>
                val && patch('chromaCurve', val as ScaleGeneratorSettings['chromaCurve'])
              }
            >
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gaussian">Gaussian (recommended)</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </ControlRow>

          {/* ── Gaussian params ── */}
          {isGaussian && (
            <>
              <ControlRow label="Peak intensity position">
                <SliderWithInput
                  value={settings.gaussianMean ?? 0.6}
                  min={0}
                  max={1}
                  step={0.01}
                  decimals={2}
                  onChange={(v) => patch('gaussianMean', v)}
                />
              </ControlRow>
              <ControlRow label="Distribution width">
                <SliderWithInput
                  value={settings.gaussianSigma ?? 0.2}
                  min={0.05}
                  max={0.5}
                  step={0.01}
                  decimals={2}
                  onChange={(v) => patch('gaussianSigma', v)}
                />
              </ControlRow>
            </>
          )}

          {/* ── Curve preview ── */}
          <ControlRow label="Chroma curve">
            <div className="overflow-hidden rounded-md bg-muted/50 px-3 py-2">
              <ChromaCurvePreview settings={settings} />
            </div>
          </ControlRow>

          {/* ── Regenerate ── */}
          <Button size="sm" className="w-full gap-1.5" onClick={regenerate}>
            <RefreshCwIcon className="size-3.5" />
            Regenerate Scale
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
