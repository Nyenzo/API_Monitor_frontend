import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Monitor, MonitorListResponse, MonitorCreate, MonitorUpdate } from '@/types/monitor'

// Fetch a paginated list of monitors with optional search filter
export function useMonitors(page = 1, perPage = 20, search?: string) {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (search) params.set('search', search)
  return useQuery({
    queryKey: ['monitors', page, perPage, search],
    queryFn: () => api.get<MonitorListResponse>(`/api/v1/monitors?${params}`),
  })
}

// Fetch a single monitor by its id
export function useMonitor(monitorId: string) {
  return useQuery({
    queryKey: ['monitors', monitorId],
    queryFn: () => api.get<Monitor>(`/api/v1/monitors/${monitorId}`),
    enabled: !!monitorId,
  })
}

// Mutation to create a new monitor and invalidate the list cache
export function useCreateMonitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: MonitorCreate) => api.post<Monitor>('/api/v1/monitors', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['monitors'] }) },
  })
}

// Mutation to update a monitor's fields and refresh both list and detail caches
export function useUpdateMonitor(monitorId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: MonitorUpdate) => api.patch<Monitor>(`/api/v1/monitors/${monitorId}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['monitors'] })
      qc.invalidateQueries({ queryKey: ['monitors', monitorId] })
    },
  })
}

// Mutation to delete a monitor and refresh the list cache
export function useDeleteMonitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (monitorId: string) => api.del(`/api/v1/monitors/${monitorId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['monitors'] }) },
  })
}

// Mutation to trigger an on-demand test check for a monitor
export function useTestMonitor() {
  return useMutation({
    mutationFn: (monitorId: string) => api.post<Record<string, unknown>>(`/api/v1/monitors/${monitorId}/test`),
  })
}

// Mutation to toggle a monitor's active/paused state
export function useToggleMonitor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ monitorId, isActive }: { monitorId: string; isActive: boolean }) =>
      api.patch<Monitor>(`/api/v1/monitors/${monitorId}/toggle`, { is_active: isActive }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['monitors'] }) },
  })
}
