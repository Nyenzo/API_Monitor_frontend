import { test as teardown } from '@playwright/test'

teardown('delete auth state', async () => {
  // Nothing to clean up — auth state file is gitignored
})
