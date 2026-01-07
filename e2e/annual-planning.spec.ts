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

test.describe('DocenteDoc AI - Annual Planning Wizard Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const hasSignInManual = (await page.getByPlaceholder('Es. Prof. Rossi').count()) > 0;
    if (hasSignInManual) {
      await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      await safeClick(page, page.getByText('Entra in Locale'), 'Entra in Locale');
    }
    await page.waitForSelector('.app-shell', { timeout: 20000 });
  });

  test('should complete the annual planning wizard steps', async ({ page }) => {
    // 1. Navigate to Progettazione
    await safeClick(page, page.getByLabel('Progettazione - UDA, Rubriche, PDP'), 'Progettazione Tile');
    await expect(page.getByText('Progettazione', { exact: true })).toBeVisible();

    // 2. Open Wizard Annuale
    await safeClick(page, page.getByText('Wizard Annuale'), 'Wizard Annuale Card');
    await expect(page.getByText('Progettazione Annuale Guidata')).toBeVisible();

    // Step 1: Context
    await expect(page.getByText('1. Definisci il Contesto')).toBeVisible();
    await page.getByRole('button', { name: 'Avanti' }).click();

    // Step 2: Situation
    await expect(page.getByText('2. Analisi della Classe')).toBeVisible({ timeout: 10000 });
    // Select some tags
    await page.getByText('Vivace', { exact: true }).click();
    await page.getByText('Collaborativa', { exact: true }).click();
    await page.fill('textarea[placeholder*="Dettagli specifici"]', 'Classe molto attiva e partecipe.');
    await page.getByRole('button', { name: 'Avanti' }).click();

    // Step 3: Methodology
    await expect(page.getByText('3. Obiettivi e Metodologie')).toBeVisible({ timeout: 10000 });
    await page.fill('textarea[id="wizard-methodology-text"]', 'Utilizzo di Flipped Classroom e Debate.');
    await page.getByRole('button', { name: 'Avanti' }).click();

    // Step 4: Sequence
    await expect(page.getByText('4. Piano Annuale UDA')).toBeVisible({ timeout: 10000 });
    await page.fill('input[id="wizard-new-uda-title"]', 'UDA Test E2E');
    await page.fill('input[id="wizard-new-uda-hours"]', '15');
    await page.getByRole('button', { name: 'Aggiungi' }).click();
    await expect(page.getByText('UDA Test E2E').first()).toBeVisible();
    await page.getByRole('button', { name: 'Calcola' }).click();

    // Step 5: Preview
    await expect(page.getByText('5. Anteprima Temporale')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Conferma' }).click();

    // Step 6: Document
    await expect(page.getByText('Pianificazione Completata!')).toBeVisible({ timeout: 10000 });
    
    // Verify export buttons are present
    await expect(page.getByText('Genera Documento Programmazione')).toBeVisible();
    
    // Close wizard
    await page.getByTitle('Chiudi wizard').click();
    await expect(page.getByText('Pianificazione Completata!')).not.toBeVisible();
  });
});
