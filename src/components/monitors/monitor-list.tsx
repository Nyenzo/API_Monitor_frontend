import { useMonitors } from '@/hooks/use-monitors'
import { MonitorCard } from './monitor-card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Activity, Plus } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Searchable, filterable paginated list of monitor cards with an "Add Monitor" button
export function MonitorList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data, isLoading } = useMonitors(page, 20)

  const monitors = (data?.monitors ?? []).filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.url.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (statusFilter === 'active') return m.is_active
    if (statusFilter === 'paused') return !m.is_active
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Search monitors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Link to="/monitors/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Monitor
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading monitors..." />
      ) : monitors.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No monitors found"
          description={search ? 'Try adjusting your search.' : 'Create your first monitor to start tracking.'}
        >
          {!search && (
            <Link to="/monitors/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Monitor
              </Button>
            </Link>
          )}
        </EmptyState>
      ) : (
        <>
          <div className="grid gap-3">
            {monitors.map((m) => (
              <MonitorCard key={m.id} monitor={m} />
            ))}
          </div>
          {data && data.total > 20 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground flex items-center px-2">
                Page {page} of {Math.ceil(data.total / 20)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(data.total / 20)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
