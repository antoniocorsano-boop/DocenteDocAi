import { test, expect } from '@playwright/test';
import { Page, Locator } from '@playwright/test';

// Helper: robust click with fallback to DOM click when locator fails
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

test.describe('DocenteDoc AI - UDA Creation Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Handle onboarding if present
    const hasSignInManual = (await page.getByPlaceholder('Es. Prof. Rossi').count()) > 0;
    if (hasSignInManual) {
      await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      await safeClick(page, page.getByText('Entra in Locale'), 'Entra in Locale');
    }

    // Wait for app shell
    await page.waitForSelector('.app-shell', { timeout: 15000 });
  });

  test('should create a new UDA and verify it in the list', async ({ page }) => {
    // 1. Navigate to Progettazione
    await safeClick(page, page.getByLabel('Progettazione - UDA, Rubriche, PDP'), 'Progettazione Tile');
    await expect(page.getByText('Progettazione Didattica')).toBeVisible();

    // 2. Open UDA Planner
    await safeClick(page, page.getByText('UDA', { exact: true }), 'UDA Card');
    await expect(page.getByText('Unità di Apprendimento')).toBeVisible();

    // 3. Start creating a new UDA
    await safeClick(page, 'button:has-text("Nuova UDA")', 'Nuova UDA Button');
    await expect(page.getByText('Nuovo Progetto')).toBeVisible();

    // 4. Fill basic info
    // Using getByLabel for TextField components
    await page.getByLabel('Titolo UDA').fill('UDA Test E2E');
    await page.getByLabel('Classe').fill('III A');
    await page.getByLabel('Materia').fill('Italiano');

    // 5. Save
    await safeClick(page, 'button:has-text("Salva Progetto")', 'Salva Button');
    
    // 6. Verify it appears in the list
    await expect(page.getByText('UDA Test E2E')).toBeVisible();
    await expect(page.getByText('III A')).toBeVisible();
  });
});
