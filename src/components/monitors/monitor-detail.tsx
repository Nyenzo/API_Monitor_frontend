import { useMonitor } from '@/hooks/use-monitors'
import { useCheckResults, useMonitorStats } from '@/hooks/use-check-results'
import { useRealtimeCheckResults } from '@/hooks/use-realtime'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { MonitorActions } from './monitor-actions'
import { StatusBadge } from '@/components/shared/status-badge'
import { LatencyChart } from '@/components/dashboard/latency-chart'
import { UptimeChart } from '@/components/dashboard/uptime-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatMs, formatRelativeTime, formatUptime } from '@/lib/utils'
import { ArrowLeft, Clock, Globe } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

// Full detail view for a monitor with stats, charts, and a recent checks table
interface MonitorDetailProps {
  monitorId: string
}

function deriveStatus(monitor: { is_active: boolean; last_check_success?: boolean | null }): 'up' | 'down' | 'paused' | 'unknown' {
  if (!monitor.is_active) return 'paused'
  if (monitor.last_check_success == null) return 'unknown'  // active but not yet checked
  return monitor.last_check_success ? 'up' : 'down'
}

export function MonitorDetail({ monitorId }: MonitorDetailProps) {
  const { data: monitor, isLoading } = useMonitor(monitorId)
  const { data: checksData } = useCheckResults(monitorId, 1, 100)
  const { data: stats } = useMonitorStats(monitorId)

  useRealtimeCheckResults(monitorId)

  if (isLoading || !monitor) return <LoadingSpinner label="Loading monitor..." />

  const checks = checksData?.results ?? []

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Link to="/monitors">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{monitor.name}</h1>
            <StatusBadge status={deriveStatus(monitor)} />
          </div>
          <div className="flex items-center gap-2.5 mt-1.5 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>{monitor.url}</span>
            <Badge variant="outline" className="font-mono text-[11px]">{monitor.method}</Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              every {monitor.interval_seconds}s
            </span>
          </div>
        </div>
        <MonitorActions monitor={monitor} />
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{formatUptime(stats.uptime_percentage)}</div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight font-mono">{formatMs(stats.avg_response_time_ms)}</div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stats.total_checks}</div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {monitor.last_checked_at
                  ? formatRelativeTime(monitor.last_checked_at)
                  : 'Never'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <LatencyChart data={checks} />
        <UptimeChart data={checks} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Checks</CardTitle>
        </CardHeader>
        <CardContent>
          {checks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No checks recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left py-3 pr-4 font-medium">Time</th>
                    <th className="text-left py-3 pr-4 font-medium">Status</th>
                    <th className="text-left py-3 pr-4 font-medium">Code</th>
                    <th className="text-left py-3 pr-4 font-medium">Latency</th>
                    <th className="text-left py-3 font-medium">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {checks.slice(0, 20).map((c) => (
                    <tr key={c.id} className="border-b last:border-0 table-row-hover transition-colors">
                      <td className="py-3 pr-4 whitespace-nowrap text-sm">
                        {formatRelativeTime(c.timestamp)}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={c.success ? 'success' : 'destructive'}>
                          {c.success ? 'Up' : 'Down'}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 font-mono text-sm">{c.status_code ?? '—'}</td>
                      <td className="py-3 pr-4 font-mono text-sm">{c.response_time_ms != null ? formatMs(c.response_time_ms) : '—'}</td>
                      <td className="py-3 text-muted-foreground truncate max-w-[200px] text-sm">
                        {c.error_message || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
