import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CheckResult } from '@/types/api'

// Statuspage-style check history strip: coloured bars whose height is proportional to
// response time (success) or shown at full height in red (failure).
interface UptimeChartProps {
  data: CheckResult[]
  title?: string
}

const SUCCESS_COLOR = '#22c55e'
const FAILURE_COLOR = '#ef4444'

export function UptimeChart({ data, title = 'Check History' }: UptimeChartProps) {
  const checks = [...data]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-90)

  const total = checks.length
  const upCount = checks.filter((c) => c.success).length
  const uptimePct = total > 0 ? ((upCount / total) * 100).toFixed(1) : null

  const maxMs = Math.max(
    ...checks.filter((c) => c.response_time_ms != null).map((c) => c.response_time_ms!),
    1,
  )

  const pctColor =
    uptimePct == null
      ? ''
      : parseFloat(uptimePct) >= 99
        ? 'text-[#22c55e]'
        : parseFloat(uptimePct) >= 95
          ? 'text-yellow-500'
          : 'text-[#ef4444]'

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {uptimePct != null && (
            <span className={`text-sm font-mono font-semibold ${pctColor}`}>
              {uptimePct}%
            </span>
          )}
        </div>
        {total > 0 && (
          <p className="text-xs text-muted-foreground">
            {upCount} up · {total - upCount} down · last {total} checks
          </p>
        )}
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No checks yet</p>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-end gap-[2px] h-16">
              {checks.map((check, i) => {
                // Height proportional to latency for successes; full height for failures
                const heightPct = check.success
                  ? Math.max(18, ((check.response_time_ms ?? maxMs) / maxMs) * 100)
                  : 100

                const ts = new Date(check.timestamp).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                const tooltip = [
                  ts,
                  `HTTP ${check.status_code ?? '—'}`,
                  check.success ? 'Up' : 'Down',
                  check.response_time_ms != null ? `${check.response_time_ms}ms` : null,
                  check.error_message || null,
                ]
                  .filter(Boolean)
                  .join(' · ')

                return (
                  <div
                    key={check.id ?? i}
                    title={tooltip}
                    className="flex-1 min-w-0 rounded-[2px] cursor-default transition-opacity hover:opacity-70"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: check.success ? SUCCESS_COLOR : FAILURE_COLOR,
                    }}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              {checks[0] ? (
                <span>
                  {new Date(checks[0].timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              ) : (
                <span />
              )}
              <span>now</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
