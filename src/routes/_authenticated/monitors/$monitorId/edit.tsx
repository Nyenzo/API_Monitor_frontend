import { createFileRoute } from '@tanstack/react-router'
import { MonitorForm } from '@/components/monitors/monitor-form'
import { useMonitor } from '@/hooks/use-monitors'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Monitor edit route using the monitorId URL parameter
export const Route = createFileRoute('/_authenticated/monitors/$monitorId/edit')({
  component: EditMonitorPage,
})

// Loads the existing monitor data and renders it in edit mode
function EditMonitorPage() {
  const { monitorId } = Route.useParams()
  const { data: monitor, isLoading } = useMonitor(monitorId)

  if (isLoading || !monitor) return <LoadingSpinner label="Loading monitor..." />

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Monitor</h1>
        <p className="text-sm text-muted-foreground">Update {monitor.name}</p>
      </div>
      <MonitorForm mode="edit" monitor={monitor} />
    </div>
  )
}
