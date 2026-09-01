import { defineConfig, devices } from '@playwright/test'

const hasE2ECredentials = Boolean(process.env.E2E_EMAIL && process.env.E2E_PASSWORD)
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    channel: 'chrome',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'public',
      testMatch: /auth\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
    },
    ...(hasE2ECredentials
      ? [
          { name: 'setup', testMatch: /.*\.setup\.ts/, teardown: 'cleanup' },
          { name: 'cleanup', testMatch: /global\.teardown\.ts/ },
          {
            name: 'chromium',
            use: {
              ...devices['Desktop Chrome'],
              storageState: 'e2e/.auth/user.json',
            },
            dependencies: ['setup'],
            testIgnore: [/.*\.setup\.ts/, /auth\.spec\.ts/],
          },
        ]
      : []),
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
})
