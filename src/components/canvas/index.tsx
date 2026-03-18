'use client'

import { CanvasWrapper } from '@/components/playground/canvas-wrapper'
import { usePlaygroundStore } from '@/lib/stores/playground-store'
import { SurfaceNestingDemo } from './surface-nesting-demo'
import { SectionNav } from './section-nav'
import { InputsFormsGroup } from './groups/inputs-forms'
import { DataDisplayGroup } from './groups/data-display'
import { FeedbackGroup } from './groups/feedback'
import { NavigationGroup } from './groups/navigation-group'
import { LayoutGroup } from './groups/layout-group'

export function ComponentCanvas() {
  const canvasViewMode = usePlaygroundStore((s) => s.canvasViewMode)
  const isGrouped = canvasViewMode === 'grouped'

  return (
    <CanvasWrapper className="h-full overflow-auto bg-background">
      {isGrouped && <SectionNav />}

      <div className="mx-auto max-w-3xl space-y-12 p-8">
        {/* Surface hierarchy demo — always visible */}
        <SurfaceNestingDemo />

        {/* Group sections */}
        <InputsFormsGroup showHeader={isGrouped} />
        <DataDisplayGroup showHeader={isGrouped} />
        <FeedbackGroup showHeader={isGrouped} />
        <NavigationGroup showHeader={isGrouped} />
        <LayoutGroup showHeader={isGrouped} />
      </div>
    </CanvasWrapper>
  )
}
