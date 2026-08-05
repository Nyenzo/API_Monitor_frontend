import { createFileRoute } from '@tanstack/react-router'
import { MonitorForm } from '@/components/monitors/monitor-form'

// New monitor creation route definition
export const Route = createFileRoute('/_authenticated/monitors/new')({
  component: NewMonitorPage,
})

// Page with the monitor creation form
function NewMonitorPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Monitor</h1>
        <p className="text-sm text-muted-foreground">Add a new endpoint to monitor</p>
      </div>
      <MonitorForm mode="create" />
    </div>
  )
}
