import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CheckResult } from '@/types/api'
import { formatMs } from '@/lib/utils'

interface LatencyChartProps {
  data: CheckResult[]
  title?: string
}

type DotProps = {
  cx?: number
  cy?: number
  index?: number
  payload?: { success: boolean }
}

function CheckDot(props: DotProps) {
  const { cx, cy, payload, index } = props
  if (cx == null || cy == null || payload == null) return <g />
  if (!payload.success) {
    return (
      <circle
        key={`fail-dot-${index}`}
        cx={cx}
        cy={cy}
        r={5}
        fill="#ef4444"
        stroke="white"
        strokeWidth={1.5}
      />
    )
  }
  return <circle key={`ok-dot-${index}`} cx={cx} cy={cy} r={0} />
}

export function LatencyChart({ data, title = 'Response Time' }: LatencyChartProps) {
  const sorted = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  const chartData = sorted.map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fullTime: new Date(r.timestamp).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    latency: r.response_time_ms ?? 0,
    success: r.success,
    statusCode: r.status_code,
    errorMessage: r.error_message,
  }))

  const allMs = sorted.map((r) => r.response_time_ms ?? 0)
  const avg = allMs.length > 0 ? Math.round(allMs.reduce((a, b) => a + b, 0) / allMs.length) : null
  const min = allMs.length > 0 ? Math.min(...allMs) : null
  const max = allMs.length > 0 ? Math.max(...allMs) : null

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '6px',
    fontSize: '12px',
  }

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-base">{title}</CardTitle>
        {avg != null && (
          <div className="flex gap-4 text-xs text-muted-foreground mt-0.5">
            <span>
              Avg{' '}
              <span className="font-mono font-medium text-foreground">{formatMs(avg)}</span>
            </span>
            <span>
              Min{' '}
              <span className="font-mono font-medium text-foreground">{formatMs(min!)}</span>
            </span>
            <span>
              Max{' '}
              <span className="font-mono font-medium text-foreground">{formatMs(max!)}</span>
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                interval="preserveStartEnd"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(v: number) => formatMs(v)}
                width={55}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                labelFormatter={(
                  _: string,
                  payload: { payload?: { fullTime?: string } }[],
                ) => payload?.[0]?.payload?.fullTime ?? ''}
                formatter={(
                  value: number,
                  _: string,
                  entry: {
                    payload?: {
                      success?: boolean
                      statusCode?: number | null
                      errorMessage?: string
                    }
                  },
                ) => {
                  const { success, statusCode, errorMessage } = entry.payload ?? {}
                  const line = `${formatMs(value)} · HTTP ${statusCode ?? '—'} · ${success ? '✓ Up' : '✗ Down'}`
                  return [errorMessage && !success ? `${line}\n${errorMessage}` : line, '']
                }}
              />
              {avg != null && (
                <ReferenceLine
                  y={avg}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="4 3"
                  strokeOpacity={0.45}
                />
              )}
              <Area
                type="monotone"
                dataKey="latency"
                stroke="hsl(var(--primary))"
                fill="url(#latencyGradient)"
                strokeWidth={1.5}
                dot={<CheckDot />}
                activeDot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
