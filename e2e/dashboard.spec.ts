import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('loads dashboard page', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('displays summary cards section', async ({ page }) => {
    await page.goto('/dashboard')
    // Summary cards should render (even if loading or empty)
    await expect(page.getByText(/overview|monitored endpoints/i)).toBeVisible()
  })

  test('sidebar navigation is visible', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /monitors/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /alerts/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /settings/i })).toBeVisible()
  })

  test('can navigate to monitors via sidebar', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /monitors/i }).click()
    await expect(page).toHaveURL(/\/monitors/)
  })

  test('can navigate to alerts via sidebar', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /alerts/i }).click()
    await expect(page).toHaveURL(/\/alerts/)
  })
})
