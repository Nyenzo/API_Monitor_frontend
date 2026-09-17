import type { Monitor, MonitorCreate } from './monitor'

export interface OpenApiOperation {
  operation_id: string
  name: string
  url: string
  method: string
  expected_status: number
}

export interface OpenApiPreview {
  title: string
  operations: OpenApiOperation[]
}

export interface ContractMonitorBatchResponse {
  monitors: Monitor[]
}

export interface ContractMonitorCreate extends MonitorCreate {
  monitor_kind: 'contract'
  contract_operation_id: string
}
