import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const usesLocalDevServer = process.env.PLAYWRIGHT_BASE_URL === undefined;

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // When the dev server compiles several pages at once, it can corrupt `.next/dev/prerender-manifest.json` and answer 500 to every page until restarted. One worker avoids that; a deployed preview can take parallel tests.
  workers: usesLocalDevServer ? 1 : undefined,
  // The dev server compiles each page on its first visit, which can take close to a minute. A deployed preview needs no such allowance.
  timeout: usesLocalDevServer ? 120_000 : 30_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    // Fixes the Accept-Language header, so the middleware sends `/` to `/en`.
    locale: 'en-US',
    trace: 'retain-on-failure',
    // Lets one machine use an installed, signed browser such as `msedge`, for example where Windows Smart App Control blocks Playwright's own Chromium. Unset, tests use Playwright's Chromium.
    channel: process.env.PLAYWRIGHT_CHANNEL,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: usesLocalDevServer
    ? {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180_000,
      }
    : undefined,
});
