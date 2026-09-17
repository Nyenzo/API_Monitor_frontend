import type { CheckResult } from './api'

export interface ReleaseVerification {
  id: string
  user_id: string
  deployment_ref: string
  status: 'running' | 'passed' | 'regressed' | 'incomplete'
  total_checks: number
  passed_checks: number
  failed_checks: number
  started_at: string
  completed_at: string | null
}

export interface ReleaseVerificationDetail extends ReleaseVerification {
  results: CheckResult[]
}
