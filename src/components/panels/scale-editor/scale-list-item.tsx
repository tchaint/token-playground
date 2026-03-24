'use client'

import { useEffect, useRef, useState } from 'react'
import { MoreHorizontalIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { ColorScale } from '@/lib/types'
import { oklchToCSS } from '@/lib/color/converter'
import { useScaleStore } from '@/lib/stores/scale-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

interface ScaleListItemProps {
  scale: ColorScale
  isSelected: boolean
  onSelect: () => void
}

export function ScaleListItem({ scale, isSelected, onSelect }: ScaleListItemProps) {
  const { updateScale, removeScale, duplicateScale } = useScaleStore()
  const [isRenaming, setIsRenaming] = useState(false)
  const [nameValue, setNameValue] = useState(scale.name)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNameValue(scale.name)
  }, [scale.name])

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isRenaming])

  function commitRename() {
    const trimmed = nameValue.trim()
    if (trimmed && trimmed !== scale.name) {
      updateScale(scale.id, { name: trimmed })
    } else {
      setNameValue(scale.name)
    }
    setIsRenaming(false)
  }

  function handleRenameKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') {
      setNameValue(scale.name)
      setIsRenaming(false)
    }
  }

  function handleDelete() {
    removeScale(scale.id)
    setDeleteOpen(false)
  }

  return (
    <>
      <div
        className={cn(
          'group relative flex flex-col gap-2 rounded-lg p-3 cursor-pointer transition-colors',
          isSelected
            ? 'bg-accent/40 ring-1 ring-ring/50'
            : 'hover:bg-muted/60',
        )}
        onClick={onSelect}
      >
        {/* Name + badge + menu row */}
        <div className="flex items-center gap-2">
          {isRenaming ? (
            <Input
              ref={inputRef}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleRenameKeyDown}
              className="h-6 flex-1 py-0 px-1.5 text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="flex-1 truncate text-sm font-medium"
              onDoubleClick={(e) => {
                e.stopPropagation()
                setIsRenaming(true)
              }}
            >
              {scale.name}
            </span>
          )}

          <Badge
            variant={scale.source === 'radix' ? 'secondary' : 'outline'}
            className="shrink-0 text-xs"
          >
            {scale.source === 'radix' ? 'Radix' : 'Custom'}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 data-popup-open:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                />
              }
            >
              <MoreHorizontalIcon className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => duplicateScale(scale.id)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsRenaming(true)}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast('Coming soon')}>
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Swatch strip */}
        <div className="flex gap-px overflow-hidden rounded-md">
          {scale.steps.map((step) => (
            <div
              key={step.index}
              className="h-4 flex-1"
              style={{ backgroundColor: oklchToCSS(step.oklch) }}
              title={`Step ${step.index}`}
            />
          ))}
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{scale.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the scale. Theme tokens referencing it will break.
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
    </>
  )
}
