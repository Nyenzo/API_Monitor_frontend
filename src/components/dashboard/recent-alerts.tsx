import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAllAlertHistory } from '@/hooks/use-alerts'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { Bell } from 'lucide-react'

// Card listing the most recent triggered alerts with their status and time
export function RecentAlerts() {
  const { data, isLoading } = useAllAlertHistory(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : !data?.history?.length ? (
          <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
            <div className="rounded-full bg-muted p-3">
              <Bell className="h-5 w-5" />
            </div>
            <p className="text-sm">No recent alerts</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.history.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between gap-2 rounded-lg border p-3.5 transition-colors hover:bg-accent/30"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {String(alert.payload['monitor_name'] ?? 'Alert triggered')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatRelativeTime(alert.triggered_at)}
                  </p>
                </div>
                <Badge
                  variant={alert.status === 'resolved' ? 'secondary' : 'destructive'}
                  className="shrink-0"
                >
                  {alert.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
