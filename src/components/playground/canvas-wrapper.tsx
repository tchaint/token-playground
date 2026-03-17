'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { useResolvedTokens } from '@/lib/hooks/use-resolved-tokens'
import { useThemeStore } from '@/lib/stores/theme-store'
import { cn } from '@/lib/utils'

// Portal selectors that need to receive theme CSS variables.
// These elements render outside the wrapper div via React portals.
const PORTAL_SELECTORS = [
  '[data-radix-popper-content-wrapper]',
  '[role="dialog"]',
  '.sonner-toaster',
  '[data-vaul-drawer-wrapper]',
]

interface CanvasWrapperProps {
  children: ReactNode
  className?: string
}

export function CanvasWrapper({ children, className }: CanvasWrapperProps) {
  const resolvedTokens = useResolvedTokens()
  const activeThemeId = useThemeStore((s) => s.activeThemeId)
  const themes = useThemeStore((s) => s.themes)
  const activeTheme = themes.find((t) => t.id === activeThemeId)
  const isDark = activeTheme?.mode === 'dark'

  const styleTagRef = useRef<HTMLStyleElement | null>(null)

  // Build CSS declarations string from resolved tokens
  const cssDeclarations = Object.entries(resolvedTokens)
    .map(([varName, value]) => `  ${varName}: ${value};`)
    .join('\n')

  // Inject a <style> tag that applies tokens to the wrapper AND all portal elements.
  // This is necessary because portals render outside the wrapper div and cannot
  // inherit CSS custom properties through the DOM tree.
  useEffect(() => {
    if (!styleTagRef.current) {
      const el = document.createElement('style')
      el.setAttribute('data-playground-theme', '')
      document.head.appendChild(el)
      styleTagRef.current = el
    }

    const allSelectors = ['.playground-theme', ...PORTAL_SELECTORS].join(',\n')
    styleTagRef.current.textContent = `${allSelectors} {\n${cssDeclarations}\n}`

    return () => {
      if (styleTagRef.current) {
        styleTagRef.current.remove()
        styleTagRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cssDeclarations])

  // Build inline style object for the wrapper div.
  // This ensures tokens are available immediately on first render (no flash)
  // without waiting for the useEffect to run.
  const style = resolvedTokens as unknown as CSSProperties

  return (
    <div
      className={cn('playground-theme', isDark && 'dark', className)}
      style={style}
    >
      {children}
    </div>
  )
}
