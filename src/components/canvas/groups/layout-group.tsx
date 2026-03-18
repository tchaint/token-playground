'use client'

import { Specimen } from '@/components/canvas/specimen'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { DirectionProvider } from '@/components/ui/direction'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { COMPONENT_GROUPS } from '@/lib/constants'

const group = COMPONENT_GROUPS.find((g) => g.id === 'layout')!

interface Props {
  showHeader?: boolean
}

// ─── Aspect Ratio ─────────────────────────────────────────────────────────────

function AspectRatioSpecimen() {
  return (
    <Specimen name="Aspect Ratio">
      <div className="flex gap-4">
        <div className="w-64">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
              <span className="text-sm font-medium text-muted-foreground">16 / 9</span>
            </div>
          </AspectRatio>
        </div>
        <div className="w-32">
          <AspectRatio ratio={1} className="overflow-hidden rounded-md">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
              <span className="text-sm font-medium text-muted-foreground">1 / 1</span>
            </div>
          </AspectRatio>
        </div>
      </div>
    </Specimen>
  )
}

// ─── Direction ────────────────────────────────────────────────────────────────

function DirectionSpecimen() {
  return (
    <Specimen name="Direction">
      <div className="flex gap-4">
        <DirectionProvider direction="ltr">
          <div className="flex-1 rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">LTR</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="size-2 rounded-full bg-primary shrink-0" />
              <span className="text-foreground">Left-to-right text flow</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">English, French, Spanish…</p>
          </div>
        </DirectionProvider>
        <DirectionProvider direction="rtl">
          <div dir="rtl" className="flex-1 rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2 text-right">RTL</p>
            <div className="flex items-center gap-2 text-sm flex-row-reverse">
              <span className="size-2 rounded-full bg-primary shrink-0" />
              <span className="text-foreground">تدفق النص من اليمين إلى اليسار</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground text-right">Arabic, Hebrew, Persian…</p>
          </div>
        </DirectionProvider>
      </div>
    </Specimen>
  )
}

// ─── Resizable ────────────────────────────────────────────────────────────────

function ResizableSpecimen() {
  return (
    <Specimen name="Resizable">
      <div className="h-48 rounded-md border border-border overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="flex h-full flex-col p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Sidebar</p>
              <ul className="space-y-1">
                {['Dashboard', 'Projects', 'Settings'].map((item) => (
                  <li
                    key={item}
                    className="rounded px-2 py-1 text-sm text-foreground hover:bg-muted cursor-default"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full flex-col p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Main</p>
              <div className="flex-1 rounded bg-muted/50 border border-border/50" />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Specimen>
  )
}

// ─── Separator ────────────────────────────────────────────────────────────────

function SeparatorSpecimen() {
  return (
    <Specimen name="Separator">
      <div className="space-y-4">
        {/* Horizontal */}
        <div>
          <p className="text-sm font-medium text-foreground">Section One</p>
          <p className="text-sm text-muted-foreground">Content below the first section heading.</p>
          <Separator className="my-3" />
          <p className="text-sm font-medium text-foreground">Section Two</p>
          <p className="text-sm text-muted-foreground">Content below the second section heading.</p>
        </div>

        {/* Vertical */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Blog</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Docs</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Source</span>
        </div>
      </div>
    </Specimen>
  )
}

// ─── Group ───────────────────────────────────────────────────────────────────

export function LayoutGroup({ showHeader = true }: Props) {
  return (
    <section id="section-layout" className="space-y-6">
      {showHeader && (
        <div className="pb-2 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{group.label}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {group.components.length} components
          </p>
        </div>
      )}
      <AspectRatioSpecimen />
      <DirectionSpecimen />
      <ResizableSpecimen />
      <SeparatorSpecimen />
    </section>
  )
}
