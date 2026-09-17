import { createFileRoute } from '@tanstack/react-router'
import { MonitorForm } from '@/components/monitors/monitor-form'
import { useMonitor } from '@/hooks/use-monitors'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Activity } from 'lucide-react'
import { Link } from '@tanstack/react-router'

// Monitor edit route using the monitorId URL parameter
export const Route = createFileRoute('/_authenticated/monitors/$monitorId/edit')({
  component: EditMonitorPage,
})

// Loads the existing monitor data and renders it in edit mode
function EditMonitorPage() {
  const { monitorId } = Route.useParams()
  const { data: monitor, isLoading, isError } = useMonitor(monitorId)

  if (isLoading) return <LoadingSpinner label="Loading monitor..." />

  if (isError || !monitor) {
    return (
      <EmptyState
        icon={Activity}
        title="Monitor unavailable"
        description="This monitor may have been deleted or you may not have access to it."
      >
        <Button asChild>
          <Link to="/monitors">Back to monitors</Link>
        </Button>
      </EmptyState>
    )
  }

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
