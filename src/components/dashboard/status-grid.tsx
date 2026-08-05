import { useMonitors } from '@/hooks/use-monitors'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Link } from '@tanstack/react-router'

// Derive up/down/paused status from a monitor's active state and failure count
function deriveStatus(monitor: { is_active: boolean; last_status_code?: number | null; consecutive_failures?: number }): 'up' | 'down' | 'degraded' | 'paused' {
  if (!monitor.is_active) return 'paused'
  if (monitor.last_status_code == null) return 'paused'
  if ((monitor.consecutive_failures ?? 0) > 0) return 'down'
  return 'up'
}

// Card grid showing all monitors with their name, URL, and current status badge
export function StatusGrid() {
  const { data, isLoading } = useMonitors(1, 50)

  if (isLoading) return <LoadingSpinner label="Loading monitors..." />

  const monitors = data?.monitors ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Monitor Status</CardTitle>
      </CardHeader>
      <CardContent>
        {monitors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No monitors yet.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {monitors.map((m) => (
              <Link
                key={m.id}
                to="/monitors/$monitorId"
                params={{ monitorId: m.id }}
                className="group flex items-center justify-between rounded-lg border p-3.5 hover:bg-accent/50 hover:border-primary/20 transition-all duration-200"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-foreground transition-colors">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{m.url}</p>
                </div>
                <StatusBadge status={deriveStatus(m)} />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
