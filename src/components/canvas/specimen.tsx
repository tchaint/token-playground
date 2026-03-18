'use client'

import { cn } from '@/lib/utils'

interface SpecimenProps {
  name: string
  children: React.ReactNode
  className?: string
}

export function Specimen({ name, children, className }: SpecimenProps) {
  return (
    <div className={cn('pt-8 mt-8 border-t border-border/50', className)}>
      <p className="text-sm font-medium text-muted-foreground mb-3">{name}</p>
      <div className="p-4 rounded-md bg-background border border-border/40">
        {children}
      </div>
    </div>
  )
}
