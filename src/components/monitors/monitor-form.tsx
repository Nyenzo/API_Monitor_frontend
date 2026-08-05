import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateMonitor, useUpdateMonitor } from '@/hooks/use-monitors'
import { toast } from '@/hooks/use-toast'
import type { Monitor, MonitorCreate, MonitorUpdate } from '@/types/monitor'
import { Loader2 } from 'lucide-react'

// Form for creating or editing a monitor with client-side validation
interface MonitorFormProps {
  monitor?: Monitor
  mode: 'create' | 'edit'
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const

export function MonitorForm({ monitor, mode }: MonitorFormProps) {
  const navigate = useNavigate()
  const createMutation = useCreateMonitor()
  const updateMutation = useUpdateMonitor(monitor?.id ?? '')

  const [form, setForm] = useState({
    name: monitor?.name ?? '',
    url: monitor?.url ?? '',
    method: monitor?.method ?? 'GET',
    headers: monitor?.headers ? JSON.stringify(monitor.headers, null, 2) : '{}',
    body: monitor?.body ?? '',
    interval_seconds: monitor?.interval_seconds ?? 60,
    timeout_ms: monitor?.timeout_ms ?? 5000,
    expected_status: monitor?.expected_status ?? 200,
    expected_body_contains: monitor?.expected_body_contains ?? '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.url.trim()) errs.url = 'URL is required'
    try {
      new URL(form.url)
    } catch {
      if (form.url.trim()) errs.url = 'Invalid URL format'
    }
    try {
      JSON.parse(form.headers)
    } catch {
      errs.headers = 'Invalid JSON'
    }
    if (form.interval_seconds < 30) errs.interval_seconds = 'Minimum 30 seconds'
    if (form.timeout_ms < 1000) errs.timeout_ms = 'Minimum 1000ms'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      name: form.name.trim(),
      url: form.url.trim(),
      method: form.method,
      headers: JSON.parse(form.headers),
      body: form.body || '',
      interval_seconds: form.interval_seconds,
      timeout_ms: form.timeout_ms,
      expected_status: form.expected_status,
      expected_body_contains: form.expected_body_contains || '',
    }

    try {
      if (mode === 'create') {
        const created = await createMutation.mutateAsync(payload as MonitorCreate)
        toast({ title: 'Monitor created', description: `"${created.name}" is now being monitored.` })
        navigate({ to: '/monitors/$monitorId', params: { monitorId: created.id } })
      } else if (monitor) {
        await updateMutation.mutateAsync(payload as MonitorUpdate)
        toast({ title: 'Monitor updated' })
        navigate({ to: '/monitors/$monitorId', params: { monitorId: monitor.id } })
      }
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
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'New Monitor' : 'Edit Monitor'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="My API Monitor"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
            <div className="space-y-2">
              <Label>Method</Label>
              <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HTTP_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://api.example.com/health"
              />
              {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headers">Headers (JSON)</Label>
            <Textarea
              id="headers"
              value={form.headers}
              onChange={(e) => setForm({ ...form, headers: e.target.value })}
              className="font-mono text-xs"
              rows={3}
            />
            {errors.headers && <p className="text-xs text-destructive">{errors.headers}</p>}
          </div>

          {['POST', 'PUT', 'PATCH'].includes(form.method) && (
            <div className="space-y-2">
              <Label htmlFor="body">Request Body</Label>
              <Textarea
                id="body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="font-mono text-xs"
                rows={3}
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="interval">Interval (seconds)</Label>
              <Input
                id="interval"
                type="number"
                min={30}
                value={form.interval_seconds}
                onChange={(e) =>
                  setForm({ ...form, interval_seconds: parseInt(e.target.value) || 60 })
                }
              />
              {errors.interval_seconds && (
                <p className="text-xs text-destructive">{errors.interval_seconds}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (ms)</Label>
              <Input
                id="timeout"
                type="number"
                min={1000}
                value={form.timeout_ms}
                onChange={(e) =>
                  setForm({ ...form, timeout_ms: parseInt(e.target.value) || 5000 })
                }
              />
              {errors.timeout_ms && <p className="text-xs text-destructive">{errors.timeout_ms}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_status">Expected Status</Label>
              <Input
                id="expected_status"
                type="number"
                min={100}
                max={599}
                value={form.expected_status}
                onChange={(e) =>
                  setForm({ ...form, expected_status: parseInt(e.target.value) || 200 })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body_contains">Expected Body Contains</Label>
            <Input
              id="body_contains"
              value={form.expected_body_contains}
              onChange={(e) => setForm({ ...form, expected_body_contains: e.target.value })}
              placeholder="Optional substring to look for in response"
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/monitors' })}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {mode === 'create' ? 'Create Monitor' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
