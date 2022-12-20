import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const webServer: PlaywrightTestConfig["webServer"] = [
  {
    command: "pnpm --filter @donum/web dev:server",
    port: 3000,
    timeout: 60000,
    reuseExistingServer: !process.env.CI,
  },
  {
    command: "pnpm --filter @donum/widget dev",
    port: 5173,
    timeout: 60000,
    reuseExistingServer: !process.env.CI,
  },
  {
    command: "pnpm --filter @donum/events-server dev",
    port: 8000,
    timeout: 60000,
    reuseExistingServer: !process.env.CI,
  },
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "@donum",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "@donum/web",
      testDir: "./apps/web/tests",
      testMatch: /.*\.spec\.tsx?/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.WEBAPP_BASE_URL ?? "http://localhost:3000",
      },
    },
    {
      name: "@donum/events-server",
      testDir: "./apps/events-server/tests",
      testMatch: /.*\.spec\.ts/,
      use: {
        baseURL: process.env.EVENTS_SERVER_URL ?? "http://localhost:8000",
      },
    },
    {
      name: "@donum/widget",
      testDir: "./apps/widget/tests",
      testMatch: /.*\.spec\.tsx?/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.WIDGET_BASE_URL ?? "http://localhost:5173",
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  webServer,
};

export default config;
