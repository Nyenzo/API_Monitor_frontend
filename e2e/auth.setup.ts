import { test as setup, expect } from '@playwright/test'

const E2E_EMAIL = process.env.E2E_EMAIL
const E2E_PASSWORD = process.env.E2E_PASSWORD

// Log in once and persist session state for all authenticated tests
setup('authenticate', async ({ page }) => {
  if (!E2E_EMAIL || !E2E_PASSWORD) {
    setup.skip(true, 'Set E2E_EMAIL and E2E_PASSWORD to run authenticated browser flows.')
    return
  }

  await page.goto('/login')
  await page.getByLabel('Email').fill(E2E_EMAIL)
  await page.getByLabel('Password').fill(E2E_PASSWORD)
  await page.getByRole('button', { name: 'Sign In', exact: true }).click()

  // Wait for redirect to dashboard after successful login
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

  // Save signed-in state to re-use across tests
  await page.context().storageState({ path: 'e2e/.auth/user.json' })
})
