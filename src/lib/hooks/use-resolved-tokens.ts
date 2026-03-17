import { useMemo } from 'react'
import { useThemeStore } from '../stores/theme-store'
import { useScaleStore } from '../stores/scale-store'
import { resolveWithBridge } from '../tokens/resolve'

export function useResolvedTokens(): Record<string, string> {
  const activeThemeId = useThemeStore((s) => s.activeThemeId)
  const themes = useThemeStore((s) => s.themes)
  const scales = useScaleStore((s) => s.scales)

  const activeTheme = themes.find((t) => t.id === activeThemeId)

  return useMemo(() => {
    if (!activeTheme) return {}
    return resolveWithBridge(activeTheme.tokens, scales)
  }, [activeTheme?.tokens, scales]) // eslint-disable-line react-hooks/exhaustive-deps
}
