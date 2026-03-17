import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { CanvasViewMode, ComponentGroup } from '../types'

// ─── Store ────────────────────────────────────────────────────────────────────

interface PlaygroundState {
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  canvasViewMode: CanvasViewMode
  activeComponentGroup: ComponentGroup | null
  selectedScaleId: string | null
}

interface PlaygroundActions {
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  setCanvasViewMode: (mode: CanvasViewMode) => void
  setActiveComponentGroup: (group: ComponentGroup | null) => void
  setSelectedScaleId: (id: string | null) => void
}

export const usePlaygroundStore = create<PlaygroundState & PlaygroundActions>()(
  persist(
    immer((set) => ({
      leftPanelOpen: true,
      rightPanelOpen: true,
      canvasViewMode: 'grouped',
      activeComponentGroup: null,
      selectedScaleId: null,

      toggleLeftPanel() {
        set((state) => {
          state.leftPanelOpen = !state.leftPanelOpen
        })
      },

      toggleRightPanel() {
        set((state) => {
          state.rightPanelOpen = !state.rightPanelOpen
        })
      },

      setCanvasViewMode(mode) {
        set((state) => {
          state.canvasViewMode = mode
        })
      },

      setActiveComponentGroup(group) {
        set((state) => {
          state.activeComponentGroup = group
        })
      },

      setSelectedScaleId(id) {
        set((state) => {
          state.selectedScaleId = id
        })
      },
    })),
    { name: 'playground-store' }
  )
)
