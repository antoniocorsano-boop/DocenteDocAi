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

test.describe('DocenteDoc AI - Template Manager Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const initialBodyText = await page.evaluate(() => document.body.innerText);
    console.log('Initial body text:', initialBodyText.substring(0, 100));

    // Handle onboarding if present
    const hasSignInManual = (await page.getByPlaceholder('Es. Prof. Rossi').count()) > 0;
    console.log('Has sign in manual:', hasSignInManual);

    if (hasSignInManual) {
      await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      await page.waitForTimeout(500);
      
      const loginButton = page.getByText('Entra in Locale');
      console.log('Login button count:', await loginButton.count());
      
      await safeClick(page, loginButton, 'Entra in Locale');
    }

    // Wait for app shell
    try {
      await page.waitForSelector('.app-shell', { timeout: 10000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/login-failed.png', fullPage: true });
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log('Body text after login attempt:', bodyText);
      throw e;
    }
  });

  test('should create and edit a template with real-time preview', async ({ page }) => {
    // 1. Navigate to Progettazione
    await safeClick(page, page.getByLabel('Progettazione - UDA, Rubriche, PDP'), 'Progettazione Tile');
    await expect(page.getByText('Progettazione', { exact: true })).toBeVisible();

    // 2. Open Template Manager
    await safeClick(page, page.getByText('Template', { exact: true }), 'Template Card');
    await expect(page.getByText('Gestione Template')).toBeVisible();

    // 3. Start creating a new template
    await safeClick(page, 'button:has-text("Nuovo Template")', 'Nuovo Template Button');
    await expect(page.getByText('Crea Template')).toBeVisible();

    // 4. Fill basic info
    await page.fill('input#template-name', 'E2E Test Template');
    await page.selectOption('select#template-type', 'uda');
    await page.fill('textarea#template-desc', 'Descrizione del template di test E2E');

    // 5. Go to HTML Content tab
    await safeClick(page, 'button:has-text("Contenuto HTML")', 'Contenuto HTML Tab');

    // 6. Edit Header and check preview
    const headerTextarea = page.locator('textarea#html-header');
    await headerTextarea.fill('<h1 class="e2e-test-header">Intestazione Test</h1>');

    // 7. Verify preview updates (Live indicator should be visible)
    await expect(page.getByText('Live')).toBeVisible();
    
    // Check if the preview contains our new header
    // The preview is inside an iframe or just a div? In TemplateManager it's a div with dangerouslySetInnerHTML
    const preview = page.locator('[aria-label="Anteprima del documento"]');
    await expect(preview).toContainText('Intestazione Test');

    // 8. Add some CSS
    await safeClick(page, 'button:has-text("Configurazione")', 'Back to Config'); // Just to test tab switching
    await safeClick(page, 'button:has-text("Contenuto HTML")', 'Back to HTML');
    
    const cssTextarea = page.locator('textarea#custom-css');
    await cssTextarea.fill('.e2e-test-header { color: rgb(255, 0, 0); }');

    // 9. Save the template
    await safeClick(page, 'button:has-text("Salva")', 'Save Button');

    // 10. Verify it's in the list
    await expect(page.getByRole('heading', { name: 'E2E Test Template' })).toBeVisible();
    await expect(page.getByText('UDA', { exact: true }).first()).toBeVisible();

    // 11. Close Template Manager
    await safeClick(page, 'button:has-text("Chiudi")', 'Close Button');
    await expect(page.getByText('Gestione Template')).not.toBeVisible();
  });
});
