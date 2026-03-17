import { COMPONENT_GROUPS } from '@/lib/constants'

const group = COMPONENT_GROUPS.find((g) => g.id === 'data-display')!

interface Props {
  showHeader?: boolean
}

export function DataDisplayGroup({ showHeader = true }: Props) {
  return (
    <section id="section-data-display" className="space-y-6">
      {showHeader && (
        <div className="pb-2 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{group.label}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {group.components.length} components
          </p>
        </div>
      )}
      <p className="text-sm text-muted-foreground italic">Components coming&hellip;</p>
    </section>
  )
}
