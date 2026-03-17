import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ThemeSet, SemanticTokenMap, TokenRef } from '../types'
import { DEFAULT_SCALE_ID, DEFAULT_BLUE_SCALE_ID, DEFAULT_RED_SCALE_ID } from './scale-store'

// ─── Default Light Theme ──────────────────────────────────────────────────────
//
// Surfaces use the gray scale; accents use the blue scale; destructive uses red.
// Step conventions follow Radix: 1–3 backgrounds, 4–5 hover/active, 6–8 borders,
// 9–10 solid fills, 11–12 text.

const gray = (stepIndex: number): TokenRef => ({ scaleId: DEFAULT_SCALE_ID, stepIndex })
const blue = (stepIndex: number): TokenRef => ({ scaleId: DEFAULT_BLUE_SCALE_ID, stepIndex })
const red  = (stepIndex: number): TokenRef => ({ scaleId: DEFAULT_RED_SCALE_ID, stepIndex })

const DEFAULT_THEME_ID = 'default-light'

const defaultTokens: SemanticTokenMap = {
  // Surfaces — ranked by depth (lighter = higher)
  backgroundPrimary:   gray(1),
  backgroundSecondary: gray(2),
  backgroundTertiary:  gray(3),
  backgroundPopover:   gray(1),
  backgroundOverlay:   gray(12), // dark scrim — will override with alpha later

  // Foreground — emphasis hierarchy
  foregroundPrimary:   gray(12),
  foregroundSecondary: gray(11),
  foregroundTertiary:  gray(10),

  // Foreground — surface overrides
  foregroundPopover:   gray(12),
  foregroundOverlay:   gray(1),  // light text on dark scrim

  // Accent — primary (blue)
  accentPrimary:             blue(9),
  accentPrimaryForeground:   gray(1),  // near-white on solid blue

  // Accent — secondary (subtle blue tint)
  accentSecondary:            blue(3),
  accentSecondaryForeground:  blue(12),

  // Accent — hover state (slightly deeper blue tint)
  accentHover:               blue(4),
  accentHoverForeground:     blue(12),

  // Accent — destructive (red)
  accentDestructive:             red(9),
  accentDestructiveForeground:   gray(1),

  // Accent — semantic states (default to blue/red for now)
  accentWarning:              blue(9),
  accentWarningForeground:    gray(1),
  accentSuccess:              blue(9),
  accentSuccessForeground:    gray(1),
  accentInfo:                 blue(9),
  accentInfoForeground:       gray(1),

  // Borders — structural (gray steps 6–7)
  borderPrimary:   gray(7),
  borderSecondary: gray(6),
  borderInput:     gray(7),

  // Borders — semantic (all default to same neutral step)
  borderDestructivePrimary:   gray(8),
  borderDestructiveSecondary: gray(6),
  borderWarningPrimary:       gray(8),
  borderWarningSecondary:     gray(6),
  borderSuccessPrimary:       gray(8),
  borderSuccessSecondary:     gray(6),
  borderInfoPrimary:          gray(8),
  borderInfoSecondary:        gray(6),

  // Focus ring — blue step 8 (visible but not overwhelming)
  ring: blue(8),
}

const defaultLightTheme: ThemeSet = {
  id: DEFAULT_THEME_ID,
  name: 'Light',
  mode: 'light',
  tokens: defaultTokens,
  createdAt: 0,
  updatedAt: 0,
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface ThemeState {
  themes: ThemeSet[]
  activeThemeId: string
}

interface ThemeActions {
  addTheme: (theme: ThemeSet) => void
  updateTheme: (id: string, updates: Partial<ThemeSet>) => void
  setToken: (themeId: string, tokenKey: keyof SemanticTokenMap, ref: TokenRef) => void
  removeTheme: (id: string) => void
  duplicateTheme: (id: string) => ThemeSet | undefined
  setActiveTheme: (id: string) => void
}

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    immer((set, get) => ({
      themes: [defaultLightTheme],
      activeThemeId: DEFAULT_THEME_ID,

      addTheme(theme) {
        set((state) => {
          state.themes.push(theme)
        })
      },

      updateTheme(id, updates) {
        set((state) => {
          const theme = state.themes.find((t) => t.id === id)
          if (!theme) return
          Object.assign(theme, updates, { updatedAt: Date.now() })
        })
      },

      setToken(themeId, tokenKey, ref) {
        set((state) => {
          const theme = state.themes.find((t) => t.id === themeId)
          if (!theme) return
          theme.tokens[tokenKey] = ref
          theme.updatedAt = Date.now()
        })
      },

      removeTheme(id) {
        set((state) => {
          state.themes = state.themes.filter((t) => t.id !== id)
          // If active theme was removed, fall back to first remaining theme
          if (state.activeThemeId === id && state.themes.length > 0) {
            state.activeThemeId = state.themes[0].id
          }
        })
      },

      duplicateTheme(id) {
        const original = get().themes.find((t) => t.id === id)
        if (!original) return undefined

        const copy: ThemeSet = {
          ...original,
          id: crypto.randomUUID(),
          name: `${original.name} (copy)`,
          tokens: { ...original.tokens },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        set((state) => {
          state.themes.push(copy)
        })

        return copy
      },

      setActiveTheme(id) {
        set((state) => {
          state.activeThemeId = id
        })
      },
    })),
    { name: 'theme-store' }
  )
)

export { DEFAULT_THEME_ID }
