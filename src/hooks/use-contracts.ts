import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { ContractMonitorBatchResponse, OpenApiPreview } from '@/types/contract'
import type { ReleaseVerification, ReleaseVerificationDetail } from '@/types/release-verification'

export function useOpenApiPreview() {
  return useMutation({
    mutationFn: (document: Record<string, unknown>) =>
      api.post<OpenApiPreview>('/api/v1/contracts/openapi/preview', { document }),
  })
}

export function useCreateContractMonitors() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (monitors: Record<string, unknown>[]) =>
      api.post<ContractMonitorBatchResponse>('/api/v1/contracts/monitors', { monitors }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['monitors'] }),
  })
}

export function useCreateReleaseVerification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ deploymentRef, monitorIds }: { deploymentRef: string; monitorIds: string[] }) =>
      api.post<ReleaseVerification>('/api/v1/release-verifications', {
        deployment_ref: deploymentRef,
        monitor_ids: monitorIds,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['release-verifications'] }),
  })
}

export function useReleaseVerifications() {
  return useQuery({
    queryKey: ['release-verifications'],
    queryFn: () => api.get<ReleaseVerification[]>('/api/v1/release-verifications'),
  })
}

export function useReleaseVerificationDetail() {
  return useMutation({
    mutationFn: (runId: string) => api.get<ReleaseVerificationDetail>(`/api/v1/release-verifications/${runId}`),
  })
}
