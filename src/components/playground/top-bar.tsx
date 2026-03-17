'use client'

import { PanelLeftCloseIcon, PanelLeftOpenIcon, PanelRightCloseIcon, PanelRightOpenIcon, DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { usePlaygroundStore } from '@/lib/stores/playground-store'
import { useThemeStore } from '@/lib/stores/theme-store'
import type { CanvasViewMode } from '@/lib/types'

export function TopBar() {
  const { leftPanelOpen, rightPanelOpen, canvasViewMode, toggleLeftPanel, toggleRightPanel, setCanvasViewMode } =
    usePlaygroundStore()
  const { themes, activeThemeId, setActiveTheme } = useThemeStore()

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b bg-background px-3 gap-2">
      {/* Left */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[13px] font-medium tracking-tight select-none mr-1">
          token<span className="text-muted-foreground">/</span>playground
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          onClick={toggleLeftPanel}
          aria-label={leftPanelOpen ? 'Close left panel' : 'Open left panel'}
        >
          {leftPanelOpen ? <PanelLeftCloseIcon className="size-4" /> : <PanelLeftOpenIcon className="size-4" />}
        </Button>
      </div>

      {/* Center */}
      <div className="flex items-center gap-2">
        <ToggleGroup variant="outline" size="sm">
          <ToggleGroupItem
            pressed={canvasViewMode === 'grouped'}
            onPressedChange={() => setCanvasViewMode('grouped' as CanvasViewMode)}
          >
            Grouped
          </ToggleGroupItem>
          <ToggleGroupItem
            pressed={canvasViewMode === 'kitchen-sink'}
            onPressedChange={() => setCanvasViewMode('kitchen-sink' as CanvasViewMode)}
          >
            Kitchen Sink
          </ToggleGroupItem>
        </ToggleGroup>

        <Select value={activeThemeId} onValueChange={(val) => val && setActiveTheme(val)}>
          <SelectTrigger size="sm" className="w-36">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            {themes.map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <DownloadIcon className="size-3.5" />
                Export
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>CSS variables</DropdownMenuItem>
            <DropdownMenuItem>Tailwind config</DropdownMenuItem>
            <DropdownMenuItem>JSON tokens</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          onClick={toggleRightPanel}
          aria-label={rightPanelOpen ? 'Close right panel' : 'Open right panel'}
        >
          {rightPanelOpen ? <PanelRightCloseIcon className="size-4" /> : <PanelRightOpenIcon className="size-4" />}
        </Button>
      </div>
    </div>
  )
}
