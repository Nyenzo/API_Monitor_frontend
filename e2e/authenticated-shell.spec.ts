import { test, expect } from '@playwright/test'

test('logout redirects away from protected content', async ({ page }) => {
  await page.goto('/settings')
  await page.getByRole('button', { name: 'Account menu' }).click()
  await page.getByRole('menuitem', { name: 'Log out' }).click()

  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
})

test('deleted or unavailable monitor has a recovery state', async ({ page }) => {
  await page.goto('/monitors/00000000-0000-0000-0000-000000000000')

  await expect(page.getByRole('heading', { name: 'Monitor unavailable' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to monitors' }).click()
  await expect(page).toHaveURL(/\/monitors$/)
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('includes and opens Release Checks', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('button', { name: 'Toggle menu' }).click()
    await page.getByRole('link', { name: 'Release Checks' }).click()

    await expect(page).toHaveURL(/\/release-verifications/)
    await expect(page.getByRole('heading', { name: 'Verify critical API contracts' })).toBeVisible()
  })
})
