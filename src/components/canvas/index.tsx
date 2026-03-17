'use client'

import { CanvasWrapper } from '@/components/playground/canvas-wrapper'

export function ComponentCanvas() {
  return (
    <CanvasWrapper className="flex h-full flex-col overflow-auto">
      <div className="flex flex-1 items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Canvas ready — components coming in Milestone 4
        </span>
      </div>
    </CanvasWrapper>
  )
}
