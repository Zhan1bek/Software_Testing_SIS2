import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from './data/env';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Every test creates its own data, so they can run in parallel and in any order. */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry in CI only — locally a red test must stay red. */
  retries: process.env.CI ? 2 : 0,
  /* The application is a shared public server: keep the load polite. */
  workers: process.env.CI ? 2 : 3,
  /* A full checkout talks to a remote API several times; 30 s default is tight. */
  timeout: 60_000,
  /* Under parallel load the public API answers in 2–4 s per call; a login redirect needs several. */
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    /* Relative page.goto('/auth/login') */
    baseURL: BASE_URL,
    /* The Toolshop marks elements with data-test, not data-testid. */
    testIdAttribute: 'data-test',
    /* Retries are off locally, so keep a trace of any failure, not only of retries. */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
