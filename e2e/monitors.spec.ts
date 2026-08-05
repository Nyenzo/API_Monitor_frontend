import { test, expect } from '@playwright/test'

test.describe('Monitors List', () => {
  test('loads monitors page', async ({ page }) => {
    await page.goto('/monitors')
    await expect(page.getByRole('heading', { name: /monitors/i })).toBeVisible()
  })

  test('shows new monitor button', async ({ page }) => {
    await page.goto('/monitors')
    await expect(page.getByRole('link', { name: /new monitor|add monitor/i }).or(
      page.getByRole('button', { name: /new monitor|add monitor/i })
    )).toBeVisible()
  })

  test('can navigate to new monitor form', async ({ page }) => {
    await page.goto('/monitors')
    await page.getByRole('link', { name: /new monitor|add monitor/i }).or(
      page.getByRole('button', { name: /new monitor|add monitor/i })
    ).click()
    await expect(page).toHaveURL(/\/monitors\/new/)
  })
})

test.describe('New Monitor Form', () => {
  test('shows the creation form', async ({ page }) => {
    await page.goto('/monitors/new')
    await expect(page.getByRole('heading', { name: /new monitor/i })).toBeVisible()
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/url/i)).toBeVisible()
  })

  test('prevents submit with empty fields', async ({ page }) => {
    await page.goto('/monitors/new')
    const submitBtn = page.getByRole('button', { name: /create|save|submit/i })
    await submitBtn.click()
    // Should remain on the new monitor page
    await expect(page).toHaveURL(/\/monitors\/new/)
  })
})

test.describe('Settings Page', () => {
  test('loads settings page', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible()
  })
})

test.describe('Alerts Page', () => {
  test('loads alerts page', async ({ page }) => {
    await page.goto('/alerts')
    await expect(page.getByRole('heading', { name: /alerts/i })).toBeVisible()
  })
})
