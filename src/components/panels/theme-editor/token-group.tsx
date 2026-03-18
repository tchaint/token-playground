'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { TokenRow } from './token-row'
import type { SemanticTokenMap } from '@/lib/types'

interface TokenGroupProps {
  groupLabel: string
  tokenKeys: (keyof SemanticTokenMap)[]
  themeId: string
}

export function TokenGroup({ groupLabel, tokenKeys, themeId }: TokenGroupProps) {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 hover:bg-muted/40 transition-colors">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {groupLabel}
        </span>
        <ChevronDown
          className={cn(
            'size-3.5 text-muted-foreground/60 transition-transform duration-150',
            open && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-1">
          {tokenKeys.map((key) => (
            <TokenRow key={key} tokenKey={key} themeId={themeId} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
