'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useThemeStore } from '@/lib/stores/theme-store'
import { SEMANTIC_TOKEN_GROUPS } from '@/lib/constants'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { TokenGroup } from './token-group'
import type { ThemeSet } from '@/lib/types'

export function ThemeEditor() {
  const { themes, activeThemeId, setActiveTheme, addTheme, duplicateTheme, removeTheme, updateTheme } =
    useThemeStore()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const activeTheme = themes.find((t) => t.id === activeThemeId)

  function handleAddTheme() {
    const base = activeTheme ?? themes[0]
    const newTheme: ThemeSet = {
      id: crypto.randomUUID(),
      name: `Theme ${themes.length + 1}`,
      mode: 'light',
      tokens: base ? { ...base.tokens } : activeTheme!.tokens,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    addTheme(newTheme)
    setActiveTheme(newTheme.id)
  }

  function handleDuplicate() {
    const copy = duplicateTheme(activeThemeId)
    if (copy) setActiveTheme(copy.id)
  }

  function handleDelete() {
    removeTheme(activeThemeId)
    setDeleteOpen(false)
  }

  function handleModeChange(mode: string | null) {
    if (!mode) return
    updateTheme(activeThemeId, { mode: mode as ThemeSet['mode'] })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center px-4 h-11 border-b">
        <h2 className="text-sm font-semibold">Theme Sets</h2>
      </div>

      {/* Theme tabs + add button */}
      <div className="shrink-0 flex items-start gap-1 px-2 pt-2.5 pb-1">
        <Tabs
          value={activeThemeId}
          onValueChange={(val) => val && setActiveTheme(val)}
          className="flex-1 min-w-0"
        >
          <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-0.5">
            {themes.map((theme) => (
              <TabsTrigger key={theme.id} value={theme.id}>
                {theme.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={handleAddTheme}
          title="New theme"
          className="mt-0.5 shrink-0"
        >
          <Plus />
        </Button>
      </div>

      {/* Theme actions */}
      <div className="shrink-0 flex items-center justify-between px-2 py-1.5 border-b">
        <div className="flex items-center gap-0.5">
          <Button size="sm" variant="ghost" onClick={handleDuplicate}>
            Duplicate
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
            disabled={themes.length <= 1}
          >
            Delete
          </Button>
        </div>

        <RadioGroup
          value={activeTheme?.mode ?? 'light'}
          onValueChange={handleModeChange}
          className="flex flex-row gap-3 w-auto"
        >
          {(['light', 'dark', 'custom'] as const).map((m) => (
            <label key={m} className="flex items-center gap-1.5 cursor-pointer">
              <RadioGroupItem value={m} />
              <span className="text-xs capitalize text-muted-foreground">{m}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Token groups — scrollable */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="py-1">
          {SEMANTIC_TOKEN_GROUPS.map((group) => (
            <TokenGroup
              key={group.id}
              groupLabel={group.label}
              tokenKeys={group.tokens}
              themeId={activeThemeId}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{activeTheme?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This theme will be permanently removed and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
