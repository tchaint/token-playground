'use client'

import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { generateScale, defaultGeneratorSettings } from '@/lib/color/generator'
import type { ColorScale } from '@/lib/types'
import { useScaleStore } from '@/lib/stores/scale-store'
import { usePlaygroundStore } from '@/lib/stores/playground-store'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ScaleListItem } from './scale-list-item'
import { ScaleGenerator } from './scale-generator'
import { StepEditor } from './step-editor'

export function ScaleEditor() {
  const { scales, addScale } = useScaleStore()
  const { selectedScaleId, setSelectedScaleId } = usePlaygroundStore()

  const selectedScale = scales.find((s) => s.id === selectedScaleId) ?? null

  function handleNewScale() {
    const scale: ColorScale = {
      id: crypto.randomUUID(),
      name: 'New Scale',
      source: 'custom',
      steps: generateScale(defaultGeneratorSettings()),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    addScale(scale)
    setSelectedScaleId(scale.id)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-2.5">
        <h2 className="text-sm font-semibold">Color Scales</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => toast('Coming soon')}
          >
            Import Radix
          </Button>
          <Button
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            onClick={handleNewScale}
          >
            <PlusIcon className="size-3.5" />
            New Scale
          </Button>
        </div>
      </div>

      {/* Everything below the header scrolls together */}
      <ScrollArea className="flex-1 min-h-0">
        {/* Generator — collapsible, shown for custom scales */}
        {selectedScale?.source === 'custom' && (
          <ScaleGenerator key={selectedScale.id} scale={selectedScale} />
        )}

        {/* Step editor — shown when any scale is selected */}
        {selectedScale && <StepEditor scale={selectedScale} />}

        {/* Scale list */}
        <div className="flex flex-col gap-1 p-2">
          {scales.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-xs text-muted-foreground">No scales yet</span>
            </div>
          ) : (
            scales.map((scale) => (
              <ScaleListItem
                key={scale.id}
                scale={scale}
                isSelected={selectedScaleId === scale.id}
                onSelect={() => setSelectedScaleId(scale.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
