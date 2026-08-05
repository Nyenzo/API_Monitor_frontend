import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { formatMs, formatRelativeTime } from '@/lib/utils'
import type { Monitor } from '@/types/monitor'
import { Clock, Globe } from 'lucide-react'

// Clickable card showing a monitor's name, URL, status, method, interval, and last check
interface MonitorCardProps {
  monitor: Monitor
}

function deriveStatus(m: Monitor): 'up' | 'down' | 'degraded' | 'paused' | 'unknown' {
  if (!m.is_active) return 'paused'
  if (m.last_check_success == null) return 'unknown'  // active but not yet checked
  return m.last_check_success ? 'up' : 'down'
}

export function MonitorCard({ monitor }: MonitorCardProps) {
  return (
    <Link to="/monitors/$monitorId" params={{ monitorId: monitor.id }}>
      <Card className="group hover:border-primary/30 transition-all duration-200 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 mb-1.5">
                <h3 className="font-medium text-sm truncate group-hover:text-foreground transition-colors">{monitor.name}</h3>
                <StatusBadge status={deriveStatus(monitor)} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2.5">
                <Globe className="h-3 w-3 shrink-0" />
                <span className="truncate">{monitor.url}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-[11px] font-mono">
                  {monitor.method}
                </Badge>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  every {monitor.interval_seconds}s
                </span>
                {monitor.last_response_time_ms != null && (
                  <span className="font-mono">{formatMs(monitor.last_response_time_ms)}</span>
                )}
                {monitor.last_checked_at && (
                  <span>checked {formatRelativeTime(monitor.last_checked_at)}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
