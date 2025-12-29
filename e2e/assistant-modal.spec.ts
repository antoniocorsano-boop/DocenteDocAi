import { test, expect } from '@playwright/test';

// Test E2E: Assistant Modal - apertura e chiusura

test.describe('Assistant Modal', () => {
  // Funzione di login automatica che gestisce anche il banner suggestion
  async function login(page) {
    // Forza modalità test per iniettare utente demo
    await page.addInitScript(() => {
      window.__TEST_MODE = true;
    });
    await page.goto('/');
    // Attendi FAB
    await page.waitForSelector('.assistant-fab-root');
    // Se il banner suggestion è presente, verifica che non blocchi la FAB
    const banner = await page.$('div[role="button"][aria-label]');
    if (banner) {
      // Il banner deve essere in alto e la FAB deve essere cliccabile
      const fab = await page.$('.assistant-fab-root button');
      await expect(fab).toBeVisible();
      await expect(fab).toBeEnabled();
    }
  }

  test('La FAB apre e chiude la modale Assistant', async ({ page }) => {
    await login(page);
    // Clicca la FAB per aprire il menu
    await page.click('.assistant-fab-root button');
    // Clicca la voce "Chat & Suggerimenti" (prima azione)
    await page.getByText('Chat & Suggerimenti').click();
    // La modale deve essere visibile
    await expect(page.locator('.assistant-modal-overlay')).toBeVisible();
    // Clicca la X per chiudere
    await page.click('.assistant-exit-btn');
    // La modale deve scomparire
    await expect(page.locator('.assistant-modal-overlay')).toBeHidden();
  });

  test('La modale non si riapre subito dopo la chiusura', async ({ page }) => {
    await login(page);
    await page.click('.assistant-fab-root button');
    await page.getByText('Chat & Suggerimenti').click();
    await expect(page.locator('.assistant-modal-overlay')).toBeVisible();
    await page.click('.assistant-exit-btn');
    // Attendi un attimo per eventuali effetti collaterali
    await page.waitForTimeout(800);
    // La modale NON deve essere visibile
    await expect(page.locator('.assistant-modal-overlay')).toBeHidden();
  });

  test('La modale si chiude con ESC', async ({ page }) => {
    await login(page);
    await page.click('.assistant-fab-root button');
    await page.getByText('Chat & Suggerimenti').click();
    await expect(page.locator('.assistant-modal-overlay')).toBeVisible();
    // Premi ESC
    await page.keyboard.press('Escape');
    await expect(page.locator('.assistant-modal-overlay')).toBeHidden();
  });
});
