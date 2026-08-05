import { createFileRoute } from '@tanstack/react-router'
import { MonitorList } from '@/components/monitors/monitor-list'

// Monitors listing route definition
export const Route = createFileRoute('/_authenticated/monitors/')({
  component: MonitorsPage,
})

// Monitors page rendering the full monitor list with header
function MonitorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Monitors</h1>
        <p className="text-sm text-muted-foreground">Manage your API endpoint monitors</p>
      </div>
      <MonitorList />
    </div>
  )
}
