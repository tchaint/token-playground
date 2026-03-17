'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TopBar } from '@/components/playground/top-bar'
import { StatusBar } from '@/components/playground/status-bar'
import { ScaleEditor } from '@/components/panels/scale-editor'
import { ThemeEditor } from '@/components/panels/theme-editor'
import { ComponentCanvas } from '@/components/canvas'
import { usePlaygroundStore } from '@/lib/stores/playground-store'

const PANEL_TRANSITION = { duration: 0.2, ease: 'easeInOut' } as const

export default function Home() {
  const { leftPanelOpen, rightPanelOpen, toggleLeftPanel, toggleRightPanel } = usePlaygroundStore()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return
      if (e.key === '[') toggleLeftPanel()
      if (e.key === ']') toggleRightPanel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleLeftPanel, toggleRightPanel])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar />

      <div className="relative flex flex-1 overflow-hidden">
        {/* Left panel */}
        <AnimatePresence initial={false}>
          {leftPanelOpen && (
            <motion.div
              key="left-panel"
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={PANEL_TRANSITION}
              className="max-xl:absolute max-xl:inset-y-0 max-xl:left-0 max-xl:z-10 max-xl:shadow-lg
                         flex w-80 shrink-0 flex-col overflow-hidden border-r bg-background"
            >
              <ScaleEditor />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center canvas */}
        <main className="flex flex-1 flex-col overflow-auto min-w-0">
          <ComponentCanvas />
        </main>

        {/* Right panel */}
        <AnimatePresence initial={false}>
          {rightPanelOpen && (
            <motion.div
              key="right-panel"
              initial={{ x: 380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 380, opacity: 0 }}
              transition={PANEL_TRANSITION}
              className="max-xl:absolute max-xl:inset-y-0 max-xl:right-0 max-xl:z-10 max-xl:shadow-lg
                         flex w-[380px] shrink-0 flex-col border-l bg-background"
            >
              <ThemeEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StatusBar />
    </div>
  )
}
