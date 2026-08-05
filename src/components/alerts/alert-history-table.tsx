import { useAllAlertHistory } from '@/hooks/use-alerts'
import { useRealtimeAlertHistory } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { formatRelativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

// Paginated table of triggered alert events with real-time updates
export function AlertHistoryTable() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAllAlertHistory(page)

  useRealtimeAlertHistory()

  const alerts = data?.history ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alert History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No alerts triggered yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left py-3 pr-4 font-medium">Type</th>
                    <th className="text-left py-3 pr-4 font-medium">Message</th>
                    <th className="text-left py-3 pr-4 font-medium">Status</th>
                    <th className="text-left py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((a) => (
                    <tr key={a.id} className="border-b last:border-0 table-row-hover transition-colors">
                      <td className="py-3 pr-4">
                        <Badge variant="outline">{String(a.payload['alert_type'] ?? 'N/A')}</Badge>
                      </td>
                      <td className="py-3 pr-4 truncate max-w-[300px] text-sm">{String(a.payload['monitor_name'] ?? 'Alert triggered')}</td>
                      <td className="py-3 pr-4">
                        <Badge
                          variant={
                            a.status === 'resolved'
                              ? 'success'
                              : a.status === 'sent'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {a.status}
                        </Badge>
                      </td>
                      <td className="py-3 whitespace-nowrap text-sm">
                        {formatRelativeTime(a.triggered_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data && data.total > 20 && (
              <div className="flex justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground flex items-center px-2">
                  Page {page} of {Math.ceil(data.total / 20)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(data.total / 20)}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
