import { createFileRoute } from '@tanstack/react-router'
import { useDashboard } from '@/hooks/use-dashboard'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { StatusGrid } from '@/components/dashboard/status-grid'
import { RecentAlerts } from '@/components/dashboard/recent-alerts'

// Dashboard route definition
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

// Dashboard page displaying summary cards, status grid, and recent alerts
function DashboardPage() {
  const { data, isLoading } = useDashboard()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your monitored endpoints</p>
      </div>

      <SummaryCards data={data} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <StatusGrid />
        <RecentAlerts />
      </div>
    </div>
  )
}
