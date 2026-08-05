import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CheckResultListResponse, MonitorStats } from '@/types/api'

// Fetch paginated check results for a monitor with auto-refresh every 30 seconds
export function useCheckResults(monitorId: string, page = 1, perPage = 50, hours = 24) {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    hours: String(hours),
  })
  return useQuery({
    queryKey: ['check-results', monitorId, page, perPage, hours],
    queryFn: () => api.get<CheckResultListResponse>(`/api/v1/monitors/${monitorId}/results?${params}`),
    enabled: !!monitorId,
    refetchInterval: 30000,
  })
}

// Fetch aggregated uptime and latency stats for a monitor, refreshed every 60 seconds
export function useMonitorStats(monitorId: string, hours = 24) {
  return useQuery({
    queryKey: ['monitor-stats', monitorId, hours],
    queryFn: () => api.get<MonitorStats>(`/api/v1/monitors/${monitorId}/stats?hours=${hours}`),
    enabled: !!monitorId,
    refetchInterval: 60000,
  })
}
