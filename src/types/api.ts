// Single health check result for a monitor
export interface CheckResult {
  id: string
  monitor_id: string
  timestamp: string
  status_code: number | null
  response_time_ms: number | null
  success: boolean
  response_size_bytes: number
  error_message: string
  response_snippet: string
  created_at: string
}

// Paginated list of check results
export interface CheckResultListResponse {
  results: CheckResult[]
  total: number
  page: number
  per_page: number
}

// Aggregated uptime and latency statistics for a monitor
export interface MonitorStats {
  monitor_id: string
  uptime_percentage: number
  avg_response_time_ms: number
  p95_response_time_ms: number
  p99_response_time_ms: number
  total_checks: number
  successful_checks: number
  failed_checks: number
  period_start: string
  period_end: string
}

// Dashboard summary combining monitor counts, uptime, and recent alerts
export interface DashboardSummary {
  total_monitors: number
  active_monitors: number
  monitors_up: number
  monitors_down: number
  avg_response_time_ms: number
  overall_uptime_percentage: number
  recent_alerts: import('./alert').AlertHistory[]
  checks_last_24h: number
}
