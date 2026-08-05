import { createFileRoute } from '@tanstack/react-router'
import { MonitorDetail } from '@/components/monitors/monitor-detail'

// Monitor detail route using the monitorId URL parameter
export const Route = createFileRoute('/_authenticated/monitors/$monitorId/')({
  component: MonitorDetailPage,
})

// Extracts monitorId from URL params and renders the detail view
function MonitorDetailPage() {
  const { monitorId } = Route.useParams()
  return <MonitorDetail monitorId={monitorId} />
}
