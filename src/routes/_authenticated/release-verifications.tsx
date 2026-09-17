import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, FileCode2, Rocket, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateContractMonitors, useCreateReleaseVerification, useOpenApiPreview, useReleaseVerificationDetail, useReleaseVerifications } from '@/hooks/use-contracts'
import { useMonitors } from '@/hooks/use-monitors'
import { toast } from '@/hooks/use-toast'

export const Route = createFileRoute('/_authenticated/release-verifications')({
  component: ReleaseVerificationsPage,
})

function ReleaseVerificationsPage() {
  const [documentText, setDocumentText] = useState('')
  const [selectedOperations, setSelectedOperations] = useState<string[]>([])
  const [requiredPathsByOperation, setRequiredPathsByOperation] = useState<Record<string, string>>({})
  const [selectedMonitors, setSelectedMonitors] = useState<string[]>([])
  const [deploymentRef, setDeploymentRef] = useState('')
  const preview = useOpenApiPreview()
  const createContracts = useCreateContractMonitors()
  const createVerification = useCreateReleaseVerification()
  const verificationDetail = useReleaseVerificationDetail()
  const releaseVerifications = useReleaseVerifications()
  const { data: monitorData } = useMonitors(1, 100)
  const contractMonitors = (monitorData?.monitors ?? []).filter((monitor) => monitor.monitor_kind === 'contract')

  async function previewDocument() {
    try {
      const document = JSON.parse(documentText) as Record<string, unknown>
      const result = await preview.mutateAsync(document)
      setSelectedOperations(result.operations.map((operation) => operation.operation_id))
      setRequiredPathsByOperation({})
    } catch (error) {
      toast({ title: 'OpenAPI import failed', description: error instanceof Error ? error.message : 'Paste valid OpenAPI JSON.', variant: 'destructive' })
    }
  }

  async function createSelectedContracts() {
    const operations = preview.data?.operations.filter((operation) => selectedOperations.includes(operation.operation_id)) ?? []
    if (!operations.length) return
    try {
      const result = await createContracts.mutateAsync(operations.map((operation) => ({
        name: operation.name,
        url: operation.url,
        method: operation.method,
        expected_status: operation.expected_status,
        monitor_kind: 'contract',
        contract_operation_id: operation.operation_id,
        required_json_paths: (requiredPathsByOperation[operation.operation_id] ?? '')
          .split(',')
          .map((path) => path.trim())
          .filter(Boolean),
      })))
      setSelectedMonitors(result.monitors.map((monitor) => monitor.id))
      toast({ title: 'Contract monitors created', description: `${result.monitors.length} critical operations are ready for release checks.` })
    } catch (error) {
      toast({ title: 'Could not create contract monitors', description: error instanceof Error ? error.message : 'Try again.', variant: 'destructive' })
    }
  }

  async function runVerification() {
    if (!deploymentRef.trim() || !selectedMonitors.length) {
      toast({ title: 'Add a deployment reference and select at least one contract monitor.', variant: 'destructive' })
      return
    }
    try {
      const run = await createVerification.mutateAsync({ deploymentRef: deploymentRef.trim(), monitorIds: selectedMonitors })
      await verificationDetail.mutateAsync(run.id)
    } catch (error) {
      toast({ title: 'Release verification could not run', description: error instanceof Error ? error.message : 'Try again.', variant: 'destructive' })
    }
  }

  async function viewVerification(runId: string) {
    try {
      await verificationDetail.mutateAsync(runId)
    } catch (error) {
      toast({ title: 'Could not load release evidence', description: error instanceof Error ? error.message : 'Try again.', variant: 'destructive' })
    }
  }

  const detail = verificationDetail.data

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">RELEASE CONFIDENCE</p>
        <h1 className="text-3xl font-bold tracking-tight">Verify critical API contracts</h1>
        <p className="mt-2 text-muted-foreground">Turn your OpenAPI document into live release checks, then keep the evidence with the deployment.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileCode2 className="h-5 w-5" /> Import critical operations</CardTitle>
          <CardDescription>Paste an OpenAPI 3.x JSON document. Static operations with declared 2xx responses can become contract monitors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={documentText} onChange={(event) => setDocumentText(event.target.value)} rows={9} className="font-mono text-xs" placeholder='{"openapi":"3.0.3","servers":[{"url":"https://api.example.com"}],"paths":{...}}' />
          <Button onClick={previewDocument} disabled={!documentText.trim() || preview.isPending}>{preview.isPending ? 'Reading contract...' : 'Preview operations'}</Button>
          {preview.data && (
            <div className="space-y-3 rounded-lg border p-4">
              <p className="font-medium">{preview.data.title} - select customer-critical operations</p>
              {preview.data.operations.map((operation) => (
                <div key={operation.operation_id} className="rounded-md p-2 hover:bg-accent">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" checked={selectedOperations.includes(operation.operation_id)} onChange={() => setSelectedOperations((current) => current.includes(operation.operation_id) ? current.filter((id) => id !== operation.operation_id) : [...current, operation.operation_id])} />
                    <span className="min-w-0 text-sm"><strong>{operation.method}</strong> {operation.name}<br /><span className="break-all text-xs text-muted-foreground">{operation.url} expects {operation.expected_status}</span></span>
                  </label>
                  {selectedOperations.includes(operation.operation_id) && (
                    <div className="ml-7 mt-2 max-w-md space-y-1">
                      <Label htmlFor={`paths-${operation.operation_id}`} className="text-xs">Required JSON fields (optional)</Label>
                      <Input id={`paths-${operation.operation_id}`} value={requiredPathsByOperation[operation.operation_id] ?? ''} onChange={(event) => setRequiredPathsByOperation((current) => ({ ...current, [operation.operation_id]: event.target.value }))} placeholder="data.id, data.status" />
                    </div>
                  )}
                </div>
              ))}
              <Button onClick={createSelectedContracts} disabled={!selectedOperations.length || createContracts.isPending}>{createContracts.isPending ? 'Creating...' : 'Create contract monitors'}</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5" /> Run release verification</CardTitle>
          <CardDescription>Name the deployment, choose the critical contracts, and receive a release decision with failure evidence.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md space-y-2"><Label htmlFor="deployment-ref">Deployment reference</Label><Input id="deployment-ref" value={deploymentRef} onChange={(event) => setDeploymentRef(event.target.value)} placeholder="2026-09-17.2 or git SHA" /></div>
          {contractMonitors.length ? contractMonitors.map((monitor) => (
            <label key={monitor.id} className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-accent">
              <input type="checkbox" checked={selectedMonitors.includes(monitor.id)} onChange={() => setSelectedMonitors((current) => current.includes(monitor.id) ? current.filter((id) => id !== monitor.id) : [...current, monitor.id])} />
              <span className="text-sm"><strong>{monitor.name}</strong><br /><span className="text-xs text-muted-foreground">{monitor.method} {monitor.url}</span></span>
            </label>
          )) : <p className="text-sm text-muted-foreground">Import contract operations above to create your first release checks.</p>}
          <Button onClick={runVerification} disabled={createVerification.isPending || !selectedMonitors.length}>{createVerification.isPending ? 'Running checks...' : 'Run verification'}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent release decisions</CardTitle>
          <CardDescription>Open a deployment to review its persisted check evidence.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {releaseVerifications.isLoading && <p className="text-sm text-muted-foreground">Loading release history...</p>}
          {releaseVerifications.isError && <p className="text-sm text-destructive">Release history could not be loaded.</p>}
          {!releaseVerifications.isLoading && !releaseVerifications.isError && !releaseVerifications.data?.length && <p className="text-sm text-muted-foreground">No release verifications yet.</p>}
          {releaseVerifications.data?.map((run) => (
            <button key={run.id} type="button" onClick={() => viewVerification(run.id)} className="flex w-full items-center justify-between rounded-md border p-3 text-left text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span><strong>{run.deployment_ref}</strong><br /><span className="text-xs text-muted-foreground">{new Date(run.started_at).toLocaleString()} - {run.total_checks} critical checks</span></span>
              <span className={run.status === 'passed' ? 'font-medium text-green-700' : run.status === 'running' ? 'font-medium text-muted-foreground' : 'font-medium text-destructive'}>{run.status === 'passed' ? 'Passed' : run.status === 'regressed' ? 'Regressed' : run.status === 'running' ? 'Running' : 'Incomplete'}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {detail && <Card className={detail.status === 'passed' ? 'border-green-500/50' : 'border-destructive/50'}>
        <CardHeader><CardTitle className="flex items-center gap-2">{detail.status === 'passed' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-destructive" />}{detail.status === 'passed' ? 'Release passed' : 'Release regressed'}: {detail.deployment_ref}</CardTitle><CardDescription>{detail.passed_checks} passed, {detail.failed_checks} failed out of {detail.total_checks} critical checks.</CardDescription></CardHeader>
        <CardContent className="space-y-2">{detail.results.map((result) => <div key={result.id} className="rounded-md border p-3 text-sm"><strong className={result.success ? 'text-green-700' : 'text-destructive'}>{result.success ? 'Passed' : 'Failed'}</strong> - HTTP {result.status_code ?? 'none'} - {result.response_time_ms ?? 0}ms{result.error_message && <p className="mt-1 text-muted-foreground">{result.error_message}</p>}</div>)}</CardContent>
      </Card>}
    </div>
  )
}
