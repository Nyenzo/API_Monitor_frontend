import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Placeholder UI for empty lists with an icon, title, and optional actions
interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-5 py-20 text-center', className)}>
      <div className="rounded-2xl bg-muted p-5">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      </div>
      {children}
    </div>
  )
}
