// Alert rule configuration attached to a monitor
export interface AlertRule {
  id: string
  monitor_id: string
  alert_type: 'email' | 'slack' | 'webhook'
  target: string
  threshold_down_minutes: number
  cooldown_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Payload for creating a new alert rule
export interface AlertRuleCreate {
  alert_type: 'email' | 'slack' | 'webhook'
  target: string
  threshold_down_minutes?: number
  cooldown_minutes?: number
}

// Record of a triggered alert event
export interface AlertHistory {
  id: string
  alert_rule_id: string
  triggered_at: string
  resolved_at: string | null
  status: 'triggered' | 'sent' | 'failed' | 'resolved'
  payload: Record<string, unknown>
  created_at: string
}

// Paginated list of alert history entries
export interface AlertHistoryListResponse {
  history: AlertHistory[]
  total: number
  page: number
  per_page: number
}
