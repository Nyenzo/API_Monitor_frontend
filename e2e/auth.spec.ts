import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  // Use fresh context without saved auth state for these tests
  test.use({ storageState: { cookies: [], origins: [] } })

  test('shows login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('shows validation on empty submit', async ({ page }) => {
    await page.goto('/login')
    // HTML5 required validation prevents submission with empty fields
    await page.getByRole('button', { name: 'Sign In' }).click()
    // Should remain on the login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('shows link to signup page', async ({ page }) => {
    await page.goto('/login')
    const signupLink = page.getByRole('link', { name: /sign up|create/i })
    await expect(signupLink).toBeVisible()
  })
})

test.describe('Signup Page', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('shows signup form', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Confirm Password')).toBeVisible()
  })

  test('shows link to login page', async ({ page }) => {
    await page.goto('/signup')
    const loginLink = page.getByRole('link', { name: /sign in|log in/i })
    await expect(loginLink).toBeVisible()
  })
})

test.describe('Auth Guard', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('redirects unauthenticated users away from dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 })
  })

  test('redirects unauthenticated users away from monitors', async ({ page }) => {
    await page.goto('/monitors')
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 })
  })
})
