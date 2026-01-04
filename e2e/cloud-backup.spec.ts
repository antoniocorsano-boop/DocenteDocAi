import { test, expect } from '@playwright/test';
import { Page, Locator } from '@playwright/test';

// Helper: robust click
async function safeClick(page: Page, selectorOrLocator: string | Locator, label?: string) {
  const isString = typeof selectorOrLocator === 'string';
  const locator = isString ? page.locator(selectorOrLocator) : selectorOrLocator;
  try {
    await locator.first().waitFor({ state: 'visible', timeout: 15000 });
    await locator.first().click({ timeout: 15000 });
    return;
  } catch {
    try {
      if (isString) {
        await page.evaluate((s: string) => {
          const el = document.querySelector(s) as HTMLElement | null;
          if (el) el.click();
        }, selectorOrLocator);
      } else {
        await locator.first().evaluate((el: HTMLElement) => el.click());
      }
    } catch (e2) {
      console.warn('safeClick failed for', label || selectorOrLocator, e2);
    }
  }
}

test.describe('DocenteDoc AI - Cloud Backup Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mock Google Identity Services
    await page.addInitScript(() => {
      (window as unknown as { google: unknown }).google = {
        accounts: {
          oauth2: {
            initTokenClient: (config: { callback: (resp: unknown) => void }) => ({
              requestAccessToken: () => {
                config.callback({ access_token: 'mock-access-token' });
              }
            }),
            revoke: (_token: string, callback: () => void) => {
              callback();
            }
          }
        }
      };
      // Mock GAPI
      (window as unknown as { gapi: unknown }).gapi = {
        load: (_name: string, options: { callback?: () => void }) => {
          if (options.callback) options.callback();
        },
        client: {
          init: () => Promise.resolve(),
        }
      };
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const hasSignInManual = (await page.getByPlaceholder('Es. Prof. Rossi').count()) > 0;
    if (hasSignInManual) {
      await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      await safeClick(page, page.getByText('Entra in Locale'), 'Entra in Locale');
    }
    await page.waitForSelector('.app-shell', { timeout: 20000 });
  });

  test('should connect to Google Drive and simulate backup', async ({ page }) => {
    // 1. Open Settings
    await safeClick(page, page.getByLabel('Impostazioni'), 'Settings Rail Item');
    // The title in Settings.tsx is "Impostazioni" inside a SectionHeader
    await expect(page.getByText('Impostazioni', { exact: true })).toBeVisible();

    // 2. Open Backup Cloud section
    // We need to find the summary with "Dati & Cloud"
    await safeClick(page, page.getByText('Dati & Cloud'), 'Cloud Group');
    
    // 3. Check if "Connetti" button is visible (assuming not authenticated yet)
    const connectBtn = page.getByRole('button', { name: 'Connetti' });
    await expect(connectBtn).toBeVisible();

    // 4. Click Connetti (triggers our mock)
    await safeClick(page, connectBtn, 'Connect Button');

    // 5. Verify state change to "Google Drive Connesso"
    await expect(page.getByText('Google Drive Connesso')).toBeVisible({ timeout: 10000 });
    
    // 6. Verify "Salva" button is now visible
    const saveBtn = page.getByRole('button', { name: 'Salva' });
    await expect(saveBtn).toBeVisible();

    // 7. Simulate a sync (will fail in real fetch but we check the UI state)
    // We could mock fetch too if we want to see "Success" toast
    await page.route('https://www.googleapis.com/drive/v3/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ files: [] })
      });
    });

    await safeClick(page, saveBtn, 'Save Button');
    
    // Check for syncing state or toast (depending on implementation)
    // Since we mocked fetch, it might show a success toast
    // await expect(page.getByText('Backup completato')).toBeVisible();
  });
});
