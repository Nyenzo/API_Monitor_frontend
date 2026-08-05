import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateAlertRule, useUpdateAlertRule } from '@/hooks/use-alerts'
import { useMonitors } from '@/hooks/use-monitors'
import { toast } from '@/hooks/use-toast'
import type { AlertRule, AlertRuleCreate } from '@/types/alert'
import { Loader2 } from 'lucide-react'

// Dialog form for creating or editing an alert rule with monitor and type selection
interface AlertRuleFormProps {
  rule?: AlertRule
  open: boolean
  onClose: () => void
  preselectedMonitorId?: string
}

const ALERT_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'slack', label: 'Slack Webhook' },
  { value: 'webhook', label: 'Custom Webhook' },
] as const

export function AlertRuleForm({ rule, open, onClose, preselectedMonitorId }: AlertRuleFormProps) {
  const createMutation = useCreateAlertRule()
  const updateMutation = useUpdateAlertRule()
  const { data: monitorsData } = useMonitors(1, 100)

  const [form, setForm] = useState({
    monitor_id: rule?.monitor_id ?? preselectedMonitorId ?? '',
    alert_type: (rule?.alert_type ?? 'email') as 'email' | 'slack' | 'webhook',
    threshold_down_minutes: rule?.threshold_down_minutes ?? 5,
    cooldown_minutes: rule?.cooldown_minutes ?? 15,
    target: rule?.target ?? '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.monitor_id || !form.target.trim()) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' })
      return
    }

    const payload: AlertRuleCreate = {
      alert_type: form.alert_type,
      threshold_down_minutes: form.threshold_down_minutes,
      cooldown_minutes: form.cooldown_minutes,
      target: form.target.trim(),
    }

    try {
      if (rule) {
        await updateMutation.mutateAsync({ alertId: rule.id, data: payload })
        toast({ title: 'Alert rule updated' })
      } else {
        await createMutation.mutateAsync({ monitorId: form.monitor_id, data: payload })
        toast({ title: 'Alert rule created' })
      }
      onClose()
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit Alert Rule' : 'New Alert Rule'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Monitor</Label>
            <Select
              value={form.monitor_id}
              onValueChange={(v) => setForm({ ...form, monitor_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a monitor" />
              </SelectTrigger>
              <SelectContent>
                {(monitorsData?.monitors ?? []).map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Alert Type</Label>
            <Select
              value={form.alert_type}
              onValueChange={(v) => setForm({ ...form, alert_type: v as 'email' | 'slack' | 'webhook' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALERT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">
              {form.alert_type === 'email'
                ? 'Email Address'
                : form.alert_type === 'slack'
                  ? 'Slack Webhook URL'
                  : 'Webhook URL'}
            </Label>
            <Input
              id="target"
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              placeholder={
                form.alert_type === 'email'
                  ? 'you@example.com'
                  : 'https://hooks.slack.com/...'
              }
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label>Down Threshold (min)</Label>
              <Input
                type="number"
                min={1}
                value={form.threshold_down_minutes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    threshold_down_minutes: parseInt(e.target.value) || 5,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Cooldown (min)</Label>
              <Input
                type="number"
                min={1}
                value={form.cooldown_minutes}
                onChange={(e) =>
                  setForm({ ...form, cooldown_minutes: parseInt(e.target.value) || 15 })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {rule ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
