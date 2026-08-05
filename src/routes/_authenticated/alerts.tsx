import { createFileRoute } from '@tanstack/react-router'
import { AlertRuleList } from '@/components/alerts/alert-rule-list'
import { AlertHistoryTable } from '@/components/alerts/alert-history-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Alerts page route definition
export const Route = createFileRoute('/_authenticated/alerts')({
  component: AlertsPage,
})

// Alerts page with tabbed view switching between rules and history
function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-sm text-muted-foreground">Manage alert rules and view alert history</p>
      </div>

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="rules">
          <AlertRuleList />
        </TabsContent>
        <TabsContent value="history">
          <AlertHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
