import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Subscribe to real-time check result inserts and invalidate related caches
export function useRealtimeCheckResults(monitorId?: string) {
  const qc = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel(`check-results-${monitorId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'check_results',
          ...(monitorId ? { filter: `monitor_id=eq.${monitorId}` } : {}),
        },
        () => {
          // Invalidate related queries to trigger refetch with fresh data
          qc.invalidateQueries({ queryKey: ['check-results'] })
          qc.invalidateQueries({ queryKey: ['monitor-stats'] })
          qc.invalidateQueries({ queryKey: ['dashboard'] })
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [monitorId, qc])
}

// Subscribe to real-time alert history inserts and invalidate alert caches
export function useRealtimeAlertHistory() {
  const qc = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('alert-history-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alert_history' },
        () => {
          qc.invalidateQueries({ queryKey: ['all-alert-history'] })
          qc.invalidateQueries({ queryKey: ['alert-history'] })
          qc.invalidateQueries({ queryKey: ['dashboard'] })
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [qc])
}
