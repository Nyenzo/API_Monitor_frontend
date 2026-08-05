// Full monitor entity as returned from the API
export interface Monitor {
  id: string
  user_id: string
  name: string
  url: string
  method: string
  headers: Record<string, string>
  body: string
  interval_seconds: number
  timeout_ms: number
  expected_status: number | null
  expected_body_contains: string
  is_active: boolean
  last_check_success?: boolean | null
  last_checked_at: string | null
  created_at: string
  updated_at: string
  // Runtime status fields populated from the latest check result
  last_status_code?: number | null
  consecutive_failures?: number
  last_response_time_ms?: number | null
}

// Paginated list of monitors with total count
export interface MonitorListResponse {
  monitors: Monitor[]
  total: number
  page: number
  per_page: number
}

// Payload for creating a new monitor
export interface MonitorCreate {
  name: string
  url: string
  method?: string
  headers?: Record<string, string>
  body?: string
  interval_seconds?: number
  timeout_ms?: number
  expected_status?: number
  expected_body_contains?: string
}

// Payload for partially updating an existing monitor
export interface MonitorUpdate {
  name?: string
  url?: string
  method?: string
  headers?: Record<string, string>
  body?: string
  interval_seconds?: number
  timeout_ms?: number
  expected_status?: number
  expected_body_contains?: string
  is_active?: boolean
}
