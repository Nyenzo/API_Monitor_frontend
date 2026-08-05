import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DashboardSummary } from '@/types/api'

// Fetch the dashboard summary with auto-refresh every 30 seconds
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardSummary>('/api/v1/dashboard/summary'),
    refetchInterval: 30000,
  })
}
