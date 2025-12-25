import { test, expect } from '@playwright/test';

// This test verifies that enabling GSI in development loads the Google Sign-In button.
// It must be executed with environment variables:
// VITE_ENABLE_GSI_DEV=true
// VITE_GSI_CLIENT_ID=<your-dev-client-id>

const enabled = process.env.VITE_ENABLE_GSI_DEV === 'true' && !!process.env.VITE_GSI_CLIENT_ID;

(test as any).skip(!enabled, 'GSI dev not enabled (set VITE_ENABLE_GSI_DEV and VITE_GSI_CLIENT_ID)');

test.describe('Google Sign-In (dev) integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('renders GSI button when dev toggle is enabled', async ({ page }) => {
    // Wait for the sign-in area to show GSI initialization flag
    const locator = page.locator('[data-gsi-loaded="true"]');
    await expect(locator).toBeVisible({ timeout: 10000 });
  });
});