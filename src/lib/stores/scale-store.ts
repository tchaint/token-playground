import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ColorScale, ColorStep } from '../types'

// ─── Default Gray Scale (Radix "slate" light — approximate OKLCH values) ─────

const DEFAULT_SCALE_ID = 'default-gray'

const defaultGraySteps: ColorStep[] = [
  { index: 1,  oklch: { l: 0.990, c: 0.002, h: 240, a: 1 } }, // App background
  { index: 2,  oklch: { l: 0.975, c: 0.003, h: 240, a: 1 } }, // Subtle background
  { index: 3,  oklch: { l: 0.946, c: 0.005, h: 240, a: 1 } }, // Component background
  { index: 4,  oklch: { l: 0.916, c: 0.007, h: 240, a: 1 } }, // Hover background
  { index: 5,  oklch: { l: 0.886, c: 0.008, h: 240, a: 1 } }, // Active background
  { index: 6,  oklch: { l: 0.850, c: 0.009, h: 240, a: 1 } }, // Subtle border
  { index: 7,  oklch: { l: 0.800, c: 0.010, h: 240, a: 1 } }, // Border
  { index: 8,  oklch: { l: 0.730, c: 0.012, h: 240, a: 1 } }, // Strong border
  { index: 9,  oklch: { l: 0.620, c: 0.010, h: 240, a: 1 } }, // Solid background
  { index: 10, oklch: { l: 0.560, c: 0.010, h: 240, a: 1 } }, // Hover solid
  { index: 11, oklch: { l: 0.440, c: 0.008, h: 240, a: 1 } }, // Lo-contrast text
  { index: 12, oklch: { l: 0.220, c: 0.005, h: 240, a: 1 } }, // Hi-contrast text
]

const defaultGrayScale: ColorScale = {
  id: DEFAULT_SCALE_ID,
  name: 'Gray',
  source: 'custom',
  steps: defaultGraySteps,
  createdAt: 0,
  updatedAt: 0,
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface ScaleState {
  scales: ColorScale[]
}

interface ScaleActions {
  addScale: (scale: ColorScale) => void
  updateScale: (id: string, updates: Partial<ColorScale>) => void
  updateStep: (scaleId: string, stepIndex: number, updates: Partial<ColorStep['oklch']>) => void
  removeScale: (id: string) => void
  duplicateScale: (id: string) => ColorScale | undefined
  reorderScales: (fromIndex: number, toIndex: number) => void
}

export const useScaleStore = create<ScaleState & ScaleActions>()(
  persist(
    immer((set, get) => ({
      scales: [defaultGrayScale],

      addScale(scale) {
        set((state) => {
          state.scales.push(scale)
        })
      },

      updateScale(id, updates) {
        set((state) => {
          const scale = state.scales.find((s) => s.id === id)
          if (!scale) return
          Object.assign(scale, updates, { updatedAt: Date.now() })
        })
      },

      updateStep(scaleId, stepIndex, updates) {
        set((state) => {
          const scale = state.scales.find((s) => s.id === scaleId)
          if (!scale) return
          const step = scale.steps.find((s) => s.index === stepIndex)
          if (!step) return
          Object.assign(step.oklch, updates)
          scale.updatedAt = Date.now()
        })
      },

      removeScale(id) {
        set((state) => {
          state.scales = state.scales.filter((s) => s.id !== id)
        })
      },

      duplicateScale(id) {
        const original = get().scales.find((s) => s.id === id)
        if (!original) return undefined

        const copy: ColorScale = {
          ...original,
          id: crypto.randomUUID(),
          name: `${original.name} (copy)`,
          steps: original.steps.map((step) => ({
            ...step,
            oklch: { ...step.oklch },
          })),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        set((state) => {
          state.scales.push(copy)
        })

        return copy
      },

      reorderScales(fromIndex, toIndex) {
        set((state) => {
          const [removed] = state.scales.splice(fromIndex, 1)
          state.scales.splice(toIndex, 0, removed)
        })
      },
    })),
    { name: 'scale-store' }
  )
)

export { DEFAULT_SCALE_ID }
