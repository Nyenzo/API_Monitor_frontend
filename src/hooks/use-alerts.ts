import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AlertRule, AlertRuleCreate, AlertHistoryListResponse } from '@/types/alert'

// Fetch all alert rules configured for a specific monitor
export function useAlertRules(monitorId: string) {
  return useQuery({
    queryKey: ['alert-rules', monitorId],
    queryFn: () => api.get<AlertRule[]>(`/api/v1/monitors/${monitorId}/alerts`),
    enabled: !!monitorId,
  })
}

// Mutation to create a new alert rule for a monitor.
// monitorId is passed per-call so the hook can be used from forms where the monitor is selected dynamically.
export function useCreateAlertRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ monitorId, data }: { monitorId: string; data: AlertRuleCreate }) =>
      api.post<AlertRule>(`/api/v1/monitors/${monitorId}/alerts`, data),
    onSuccess: (_r, { monitorId }) => { qc.invalidateQueries({ queryKey: ['alert-rules', monitorId] }) },
  })
}

// Mutation to update an alert rule's configuration
export function useUpdateAlertRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ alertId, data }: { alertId: string; data: Partial<AlertRuleCreate & { is_active: boolean }> }) =>
      api.patch<AlertRule>(`/api/v1/alerts/${alertId}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['alert-rules'] }) },
  })
}

// Mutation to delete an alert rule by its id
export function useDeleteAlertRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (alertId: string) => api.del(`/api/v1/alerts/${alertId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['alert-rules'] }) },
  })
}

// Fetch paginated alert history for a single alert rule
export function useAlertHistory(alertId: string, page = 1) {
  return useQuery({
    queryKey: ['alert-history', alertId, page],
    queryFn: () => api.get<AlertHistoryListResponse>(`/api/v1/alerts/${alertId}/history?page=${page}`),
    enabled: !!alertId,
  })
}

// Fetch all alert rules across all monitors owned by the current user
export function useAllAlertRules() {
  return useQuery({
    queryKey: ['all-alert-rules'],
    queryFn: () => api.get<AlertRule[]>('/api/v1/alerts/rules'),
  })
}

// Fetch paginated alert history across all monitors for the current user
export function useAllAlertHistory(page = 1) {
  return useQuery({
    queryKey: ['all-alert-history', page],
    queryFn: () => api.get<AlertHistoryListResponse>(`/api/v1/alerts/history?page=${page}`),
  })
}
