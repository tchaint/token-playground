'use client'

export function StatusBar() {
  return (
    <div className="flex h-8 shrink-0 items-center justify-between border-t bg-muted/50 px-3 text-[11px] text-muted-foreground tabular-nums">
      <span>39 tokens</span>
      <span>All contrasts passing</span>
      <span>All colors in sRGB gamut</span>
    </div>
  )
}
