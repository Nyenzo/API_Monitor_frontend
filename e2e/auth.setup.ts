import { test as setup, expect } from '@playwright/test'

const E2E_EMAIL = process.env.E2E_EMAIL ?? 'test@example.com'
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'testpassword123'

// Log in once and persist session state for all authenticated tests
setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill(E2E_EMAIL)
  await page.getByLabel('Password').fill(E2E_PASSWORD)
  await page.getByRole('button', { name: 'Sign In' }).click()

  // Wait for redirect to dashboard after successful login
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

  // Save signed-in state to re-use across tests
  await page.context().storageState({ path: 'e2e/.auth/user.json' })
})
