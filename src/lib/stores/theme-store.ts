import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ThemeSet, SemanticTokenMap, TokenRef } from '../types'
import { DEFAULT_SCALE_ID } from './scale-store'

// ─── Default Light Theme ──────────────────────────────────────────────────────
//
// Maps semantic tokens to gray scale steps following Radix conventions.
// Step references use the default gray scale from scale-store.

const ref = (stepIndex: number): TokenRef => ({ scaleId: DEFAULT_SCALE_ID, stepIndex })

const DEFAULT_THEME_ID = 'default-light'

const defaultTokens: SemanticTokenMap = {
  // Surfaces — ranked by depth (lighter = higher)
  backgroundPrimary:   ref(1),
  backgroundSecondary: ref(2),
  backgroundTertiary:  ref(3),
  backgroundPopover:   ref(1),
  backgroundOverlay:   ref(12), // dark scrim — will override with alpha later

  // Foreground — emphasis hierarchy
  foregroundPrimary:   ref(12),
  foregroundSecondary: ref(11),
  foregroundTertiary:  ref(10),

  // Foreground — surface overrides
  foregroundPopover:   ref(12),
  foregroundOverlay:   ref(1),  // light text on dark scrim

  // Accent — all default to gray until user assigns a color scale
  accentPrimary:              ref(9),
  accentPrimaryForeground:    ref(1),
  accentSecondary:            ref(3),
  accentSecondaryForeground:  ref(12),
  accentHover:                ref(4),
  accentHoverForeground:      ref(12),
  accentDestructive:          ref(9),
  accentDestructiveForeground: ref(1),
  accentWarning:              ref(9),
  accentWarningForeground:    ref(1),
  accentSuccess:              ref(9),
  accentSuccessForeground:    ref(1),
  accentInfo:                 ref(9),
  accentInfoForeground:       ref(1),

  // Borders — structural
  borderPrimary:   ref(6),
  borderSecondary: ref(5),
  borderInput:     ref(7),

  // Borders — semantic (all default to same neutral step)
  borderDestructivePrimary:   ref(8),
  borderDestructiveSecondary: ref(6),
  borderWarningPrimary:       ref(8),
  borderWarningSecondary:     ref(6),
  borderSuccessPrimary:       ref(8),
  borderSuccessSecondary:     ref(6),
  borderInfoPrimary:          ref(8),
  borderInfoSecondary:        ref(6),

  // Focus
  ring: ref(9),
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
