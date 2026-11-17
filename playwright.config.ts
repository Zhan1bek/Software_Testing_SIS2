import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from './data/env';

/** GitHub Actions, GitLab CI and Jenkins (via `environment`) set CI=true. Locally it is unset. */
const isCI = !!process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Every test creates its own data, so they can run in parallel and in any order.
     It also makes --shard split individual tests, not whole files (5 files, 4 shards). */
  fullyParallel: true,
  /* A forgotten test.only must fail CI instead of silently running one test. */
  forbidOnly: isCI,
  /* Retry in CI only — locally a red test must stay red. A test that passes on a retry
     is reported as "flaky", not green and not red. */
  retries: isCI ? 2 : 0,
  /* The application is a shared public server: keep the load polite. */
  workers: isCI ? 2 : 3,
  /* A full checkout talks to a remote API several times; 30 s default is tight. */
  timeout: 60_000,
  /* Under parallel load the public API answers in 2–4 s per call; a login redirect needs several. */
  expect: { timeout: 15_000 },
  reporter: isCI
    ? [
        ['list'],                                           // readable job log
        ['github'],                                         // failures as annotations on the PR
        ['blob'],                                           // one zip per shard, merged later
        ['junit', { outputFile: 'reports/junit.xml' }],     // understood by every CI tool
      ]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    /* Relative page.goto('/auth/login'). Overridable with the BASE_URL variable. */
    baseURL: BASE_URL,
    /* The Toolshop marks elements with data-test, not data-testid. */
    testIdAttribute: 'data-test',
    /* CI: the trace of the first retry, i.e. of exactly the attempt that failed before.
       Locally there are no retries, so keep the trace of any failure instead. */
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
