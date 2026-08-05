import { useState } from 'react'
import { useAllAlertRules, useDeleteAlertRule } from '@/hooks/use-alerts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { EmptyState } from '@/components/shared/empty-state'
import { AlertRuleForm } from './alert-rule-form'
import { toast } from '@/hooks/use-toast'
import { Bell, Pencil, Plus, Trash2 } from 'lucide-react'
import type { AlertRule } from '@/types/alert'

// Lists all alert rules with edit and delete actions and a dialog to create new ones
export function AlertRuleList() {
  const { data, isLoading } = useAllAlertRules()
  const deleteMutation = useDeleteAlertRule()
  const [formOpen, setFormOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<AlertRule | undefined>()

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id)
      toast({ title: 'Alert rule deleted' })
    } catch (err: unknown) {
      toast({
        title: 'Failed to delete',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  const rules = data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Alert Rules</h2>
        <Button onClick={() => { setEditingRule(undefined); setFormOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading alert rules..." />
      ) : rules.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No alert rules"
          description="Create an alert rule to get notified when monitors go down."
        >
          <Button onClick={() => { setEditingRule(undefined); setFormOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            New Rule
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-3">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{rule.alert_type}</Badge>
                    <span className="text-sm font-medium">{rule.target}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    After {rule.threshold_down_minutes}min down · {rule.cooldown_minutes}min cooldown
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setEditingRule(rule); setFormOpen(true) }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertRuleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        rule={editingRule}
      />
    </div>
  )
}
