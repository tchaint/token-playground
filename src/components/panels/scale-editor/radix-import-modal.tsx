'use client'

import { useEffect, useMemo, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  RADIX_SCALE_NAMES,
  RADIX_SCALES_LIGHT,
  RADIX_SCALES_DARK,
} from '@/lib/color/radix-presets'
import { oklchToCSS, oklchToHex } from '@/lib/color/converter'
import type { ColorScale } from '@/lib/types'
import { useScaleStore } from '@/lib/stores/scale-store'
import { usePlaygroundStore } from '@/lib/stores/playground-store'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// ─── ScaleCard ────────────────────────────────────────────────────────────────

function ScaleCard({
  name,
  scale,
  isSelected,
  onClick,
}: {
  name: string
  scale: ColorScale
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col gap-1.5 rounded-lg border p-2.5 text-left transition-colors hover:bg-muted/40',
        isSelected
          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
          : 'border-border',
      )}
    >
      <span className="text-xs font-medium capitalize">{name}</span>
      <div className="flex gap-px overflow-hidden rounded-sm">
        {scale.steps.map((step) => (
          <div
            key={step.index}
            className="h-3.5 flex-1"
            style={{ backgroundColor: oklchToCSS(step.oklch) }}
          />
        ))}
      </div>
    </button>
  )
}

// ─── ScalePreview ─────────────────────────────────────────────────────────────

function ScalePreview({ scale }: { scale: ColorScale }) {
  const s1  = scale.steps[0]   // App background
  const s6  = scale.steps[5]   // Subtle border
  const s7  = scale.steps[6]   // Border
  const s9  = scale.steps[8]   // Solid background (accent)
  const s11 = scale.steps[10]  // Lo-contrast text
  const s12 = scale.steps[11]  // Hi-contrast text

  return (
    <div className="shrink-0 border-t px-4 pb-3 pt-3">
      {/* Step swatches with hex */}
      <div className="mb-3 flex gap-1">
        {scale.steps.map((step) => {
          const hex = oklchToHex(step.oklch).slice(1).toUpperCase()
          return (
            <div key={step.index} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="h-8 w-full rounded-sm"
                style={{ backgroundColor: oklchToCSS(step.oklch) }}
                title={`Step ${step.index}: #${hex}`}
              />
              <span className="font-mono text-[7.5px] leading-none text-muted-foreground">
                {hex}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mini UI sample */}
      <div
        className="flex items-center justify-between rounded-lg border px-4 py-3"
        style={{
          backgroundColor: oklchToCSS(s1.oklch),
          borderColor: oklchToCSS(s6.oklch),
        }}
      >
        <div className="flex flex-col gap-1">
          <span
            className="text-sm font-semibold"
            style={{ color: oklchToCSS(s12.oklch) }}
          >
            Sample heading
          </span>
          <span
            className="text-xs"
            style={{ color: oklchToCSS(s11.oklch) }}
          >
            Secondary text · step 11
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="h-px w-8"
            style={{ backgroundColor: oklchToCSS(s7.oklch) }}
          />
          <button
            className="rounded-md px-3 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: oklchToCSS(s9.oklch),
              color: oklchToCSS(s12.oklch),
            }}
            tabIndex={-1}
          >
            Button
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── RadixImportModal ─────────────────────────────────────────────────────────

interface RadixImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RadixImportModal({ open, onOpenChange }: RadixImportModalProps) {
  const { addScale } = useScaleStore()
  const { setSelectedScaleId } = usePlaygroundStore()

  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [search, setSearch] = useState('')
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [importAsCustom, setImportAsCustom] = useState(false)

  // Reset internal state each time the dialog opens
  useEffect(() => {
    if (open) {
      setMode('light')
      setSearch('')
      setSelectedName(null)
      setImportAsCustom(false)
    }
  }, [open])

  const scaleMap = mode === 'light' ? RADIX_SCALES_LIGHT : RADIX_SCALES_DARK

  const filteredNames = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? RADIX_SCALE_NAMES.filter((n) => n.includes(q)) : RADIX_SCALE_NAMES
  }, [search])

  const selectedScale = selectedName ? scaleMap[selectedName] : null

  function handleImport() {
    if (!selectedScale || !selectedName) return

    const now = Date.now()
    const baseName = selectedScale.name
      .replace(/\s*\(Light\)$/, '')
      .replace(/\s*\(Dark\)$/, '')

    const scale: ColorScale = importAsCustom
      ? {
          ...selectedScale,
          id: crypto.randomUUID(),
          name: baseName,
          source: 'custom',
          radixName: selectedName,
          steps: selectedScale.steps.map((s) => ({ ...s, oklch: { ...s.oklch } })),
          createdAt: now,
          updatedAt: now,
        }
      : {
          ...selectedScale,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        }

    addScale(scale)
    setSelectedScaleId(scale.id)
    onOpenChange(false)
    toast(`Imported ${scale.name}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
        showCloseButton={false}
      >
        {/* ── Header ── */}
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
          <DialogTitle>Import Radix Color Scale</DialogTitle>
          <ToggleGroup variant="outline" size="sm">
            <ToggleGroupItem
              pressed={mode === 'light'}
              onPressedChange={(p) => p && setMode('light')}
            >
              Light
            </ToggleGroupItem>
            <ToggleGroupItem
              pressed={mode === 'dark'}
              onPressedChange={(p) => p && setMode('dark')}
            >
              Dark
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* ── Search ── */}
        <div className="shrink-0 border-b px-4 py-2.5">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search scales…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>

        {/* ── Scale grid ── */}
        <ScrollArea className="min-h-0 flex-1">
          {filteredNames.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              No scales match &ldquo;{search}&rdquo;
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 p-4">
              {filteredNames.map((name) => {
                const scale = scaleMap[name]
                if (!scale) return null
                return (
                  <ScaleCard
                    key={name}
                    name={name}
                    scale={scale}
                    isSelected={selectedName === name}
                    onClick={() =>
                      setSelectedName((prev) => (prev === name ? null : name))
                    }
                  />
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* ── Preview ── */}
        {selectedScale && <ScalePreview scale={selectedScale} />}

        {/* ── Footer ── */}
        <div className="flex shrink-0 items-center justify-between rounded-b-xl border-t bg-muted/50 px-4 py-3">
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={importAsCustom}
              onCheckedChange={(v) => setImportAsCustom(v === true)}
            />
            <span className="select-none text-sm">Import as custom (editable)</span>
          </label>
          <div className="flex items-center gap-2">
            <DialogClose render={<Button variant="outline" size="sm" />}>
              Cancel
            </DialogClose>
            <Button size="sm" onClick={handleImport} disabled={!selectedName}>
              Import Scale
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
