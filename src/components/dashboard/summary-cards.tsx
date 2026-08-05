import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, ArrowDown, ArrowUp, Clock } from 'lucide-react'
import type { DashboardSummary } from '@/types/api'
import { formatMs } from '@/lib/utils'

// Grid of stat cards showing total monitors, up/down counts, latency, and alert count
interface SummaryCardsProps {
  data?: DashboardSummary
  isLoading: boolean
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Monitors',
      value: data?.total_monitors ?? 0,
      icon: Activity,
      description: `${data?.active_monitors ?? 0} active`,
    },
    {
      title: 'Up',
      value: data?.monitors_up ?? 0,
      icon: ArrowUp,
      description: 'Currently healthy',
      className: 'text-success',
    },
    {
      title: 'Down',
      value: data?.monitors_down ?? 0,
      icon: ArrowDown,
      description: 'Currently failing',
      className: 'text-destructive',
    },
    {
      title: 'Avg Latency',
      value: data?.avg_response_time_ms != null ? formatMs(data.avg_response_time_ms) : '—',
      icon: Clock,
      description: 'Across all monitors',
    },
    {
      title: 'Alerts (24h)',
      value: data?.recent_alerts?.length ?? 0,
      icon: AlertTriangle,
      description: 'Triggered recently',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => (
        <Card key={card.title} className="group relative overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.title}</CardTitle>
            <div className="rounded-md bg-muted p-1.5">
              <card.icon className={`h-3.5 w-3.5 ${card.className ?? 'text-muted-foreground'}`} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            ) : (
              <div className={`text-2xl font-bold tracking-tight ${card.className ?? ''}`}>{card.value}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1.5">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
