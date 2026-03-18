'use client'

import type { SemanticTokenMap } from '@/lib/types'

interface TokenRowProps {
  tokenKey: keyof SemanticTokenMap
  themeId: string
}

// Convert camelCase key to a readable label
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
}

export function TokenRow({ tokenKey }: TokenRowProps) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 group/token-row hover:bg-muted/30 transition-colors">
      <span className="text-xs text-foreground">{formatLabel(tokenKey)}</span>
      <span className="text-xs text-muted-foreground/50">picker coming</span>
    </div>
  )
}
