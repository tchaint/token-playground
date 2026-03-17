'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { COMPONENT_GROUPS } from '@/lib/constants'

export function SectionNav() {
  const [activeId, setActiveId] = useState<string>(COMPONENT_GROUPS[0]?.id ?? '')

  useEffect(() => {
    // Use the playground-theme div as root so IntersectionObserver tracks
    // intersections within the canvas scroll container, not the viewport.
    const root = document.querySelector('.playground-theme') as HTMLElement | null

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting section
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (intersecting.length > 0) {
          const id = intersecting[0].target.id.replace('section-', '')
          setActiveId(id)
        }
      },
      {
        root,
        rootMargin: '-56px 0px -55% 0px',
        threshold: 0,
      }
    )

    COMPONENT_GROUPS.forEach(({ id }) => {
      const el = document.getElementById(`section-${id}`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveId(id)
  }

  return (
    <div className="sticky top-0 z-10 flex gap-1 px-4 py-2 bg-background/90 backdrop-blur-sm border-b border-border/60">
      {COMPONENT_GROUPS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer',
            activeId === id
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
