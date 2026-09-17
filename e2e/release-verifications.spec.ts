import { expect, test } from '@playwright/test'

const timestamp = '2026-09-17T12:00:00.000Z'
const monitor = {
  id: 'contract-monitor-e2e',
  user_id: 'e2e-user',
  name: 'Create customer',
  url: 'https://api.example.com/customers',
  method: 'POST',
  headers: {},
  body: '',
  interval_seconds: 300,
  timeout_ms: 10_000,
  expected_status: 201,
  expected_body_contains: '',
  monitor_kind: 'contract',
  contract_operation_id: 'createCustomer',
  required_json_paths: ['data.id'],
  is_active: true,
  last_check_success: null,
  last_checked_at: null,
  created_at: timestamp,
  updated_at: timestamp,
}

const run = {
  id: 'release-run-e2e',
  user_id: 'e2e-user',
  deployment_ref: 'release-e2e-1',
  status: 'regressed',
  total_checks: 1,
  passed_checks: 0,
  failed_checks: 1,
  started_at: timestamp,
  completed_at: timestamp,
}

test('imports a critical operation and displays persisted regression evidence', async ({ page }) => {
  let contractCreated = false

  await page.route('**/api/v1/**', async (route) => {
    const request = route.request()
    const path = new URL(request.url()).pathname
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

    if (path === '/api/v1/contracts/openapi/preview' && request.method() === 'POST') {
      return json({
        title: 'Example API',
        operations: [{
          operation_id: 'createCustomer',
          name: 'Create customer',
          url: 'https://api.example.com/customers',
          method: 'POST',
          expected_status: 201,
        }],
      })
    }
    if (path === '/api/v1/contracts/monitors' && request.method() === 'POST') {
      contractCreated = true
      return json({ monitors: [monitor] }, 201)
    }
    if (path === '/api/v1/monitors' && request.method() === 'GET') {
      return json({ monitors: contractCreated ? [monitor] : [], total: contractCreated ? 1 : 0, page: 1, per_page: 100 })
    }
    if (path === '/api/v1/release-verifications' && request.method() === 'POST') return json(run, 201)
    if (path === '/api/v1/release-verifications/release-run-e2e' && request.method() === 'GET') {
      return json({
        ...run,
        results: [{
          id: 'result-e2e',
          monitor_id: monitor.id,
          timestamp,
          status_code: 200,
          response_time_ms: 240,
          success: false,
          response_size_bytes: 120,
          error_message: 'Expected status 201, got 200',
          response_snippet: '{}',
          created_at: timestamp,
        }],
      })
    }
    if (path === '/api/v1/release-verifications' && request.method() === 'GET') return json([])

    return json({ detail: `Unexpected mocked request: ${request.method()} ${path}` }, 404)
  })

  await page.goto('/release-verifications')
  await expect(page.getByRole('heading', { name: 'Verify critical API contracts' })).toBeVisible()

  await page.getByPlaceholder('{"openapi":"3.0.3"').fill(JSON.stringify({ openapi: '3.0.3' }))
  await page.getByRole('button', { name: 'Preview operations' }).click()
  await expect(page.getByRole('checkbox', { name: /POST Create customer/i })).toBeChecked()
  await page.getByLabel('Required JSON fields (optional)').fill('data.id')
  await page.getByRole('button', { name: 'Create contract monitors' }).click()

  await expect(page.getByRole('checkbox', { name: /Create customer POST/i })).toBeChecked()
  await page.getByLabel('Deployment reference').fill(run.deployment_ref)
  await page.getByRole('button', { name: 'Run verification' }).click()

  await expect(page.getByRole('heading', { name: 'Release regressed: release-e2e-1' })).toBeVisible()
  await expect(page.getByText('Expected status 201, got 200')).toBeVisible()
})
