
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PW_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* Scommentare per testare su mobile e altri browser
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],
  webServer: {
    // During local E2E debugging prefer the dev server so changes in `src/` are
    // reflected immediately. CI can still use preview by overriding this.
    command: 'npm run dev -- --port 5173',
    url: process.env.PW_BASE_URL || 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
