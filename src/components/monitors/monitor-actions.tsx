import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useDeleteMonitor, useToggleMonitor, useTestMonitor } from '@/hooks/use-monitors'
import { toast } from '@/hooks/use-toast'
import type { Monitor } from '@/types/monitor'
import { Loader2, Pause, Play, Trash2, Zap, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'

// Action buttons for test, toggle, edit, and delete with confirmation dialog
interface MonitorActionsProps {
  monitor: Monitor
}

export function MonitorActions({ monitor }: MonitorActionsProps) {
  const navigate = useNavigate()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const deleteMutation = useDeleteMonitor()
  const toggleMutation = useToggleMonitor()
  const testMutation = useTestMonitor()

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(monitor.id)
      toast({ title: 'Monitor deleted' })
      navigate({ to: '/monitors' })
    } catch (err: unknown) {
      toast({
        title: 'Failed to delete',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      })
    }
    setDeleteOpen(false)
  }

  async function handleToggle() {
    try {
      await toggleMutation.mutateAsync({
        monitorId: monitor.id,
        isActive: !monitor.is_active,
      })
      toast({ title: monitor.is_active ? 'Monitor paused' : 'Monitor resumed' })
    } catch (err: unknown) {
      toast({
        title: 'Toggle failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  async function handleTest() {
    try {
      const result = await testMutation.mutateAsync(monitor.id) as {
        success: boolean; status_code: number | null; response_time_ms: number | null; error_message: string
      }
      toast({
        title: result.success ? 'Check passed' : 'Check failed',
        description: result.error_message
          ? result.error_message
          : `Status ${result.status_code} — ${result.response_time_ms}ms`,
        variant: result.success ? 'default' : 'destructive',
      })
    } catch (err: unknown) {
      toast({
        title: 'Test failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleTest}
        disabled={testMutation.isPending}
      >
        {testMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Zap className="h-4 w-4 mr-1" />
        )}
        Test Now
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        disabled={toggleMutation.isPending}
      >
        {monitor.is_active ? (
          <>
            <Pause className="h-4 w-4 mr-1" />
            Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-1" />
            Resume
          </>
        )}
      </Button>

      <Link to="/monitors/$monitorId/edit" params={{ monitorId: monitor.id }}>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </Link>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Monitor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{monitor.name}&rdquo;? This will also delete
              all check results and alert rules. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
