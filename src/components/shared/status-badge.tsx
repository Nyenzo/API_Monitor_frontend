import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Colored badge that maps monitor status to a visual indicator
type StatusType = 'up' | 'down' | 'degraded' | 'paused' | 'unknown'

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<StatusType, { label: string; variant: 'success' | 'destructive' | 'warning' | 'secondary' | 'outline' }> = {
  up: { label: 'Up', variant: 'success' },
  down: { label: 'Down', variant: 'destructive' },
  degraded: { label: 'Degraded', variant: 'warning' },
  paused: { label: 'Paused', variant: 'secondary' },
  unknown: { label: 'Pending', variant: 'outline' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.unknown
  return (
    <Badge variant={config.variant} className={cn('capitalize', className)}>
      <span className={cn(
        'mr-1.5 h-2 w-2 rounded-full inline-block',
        status === 'up' && 'bg-green-100 animate-pulse-dot',
        status === 'down' && 'bg-red-100 animate-pulse-dot',
        status === 'degraded' && 'bg-yellow-100 animate-pulse-dot',
        status === 'paused' && 'bg-gray-300',
        status === 'unknown' && 'bg-gray-300 opacity-60',
      )} />
      {config.label}
    </Badge>
  )
}
