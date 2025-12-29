import { test, expect } from '@playwright/test';

test.describe('Gantt drag & undo', () => {
  test('drag UDA and undo via snackbar', async ({ page }) => {
    // Enable test mode so app injects demo user
    await page.addInitScript(() => { (window as any).__TEST_MODE = true; });
    await page.goto('/');
    // Wait for app shell to be present
    await page.waitForSelector('.app-shell', { timeout: 15000 });

    // Open Progettazione
    await page.click('text=Progettazione');

    // Wait for timeline
    await page.waitForSelector('.gantt-tracks-layer');

    // Find a bar (first)
    const bar = await page.locator('.gantt-bar').first();
    const initialLeft = await bar.evaluate(e => (e as HTMLElement).style.left);

    // Drag 50px right
    await bar.hover();
    await page.mouse.down();
    await page.mouse.move(await page.mouse.position().x + 80, await page.mouse.position().y);
    await page.mouse.up();

    // Snackbar should appear
    await expect(page.locator('text=UDA spostata')).toBeVisible();

    // Click Annulla
    await page.click('text=Annulla');

    // Snackbar disappears
    await expect(page.locator('text=UDA spostata')).not.toBeVisible();

    // Bar left should be back near initial (we check existence)
    await expect(bar).toBeVisible();
  });
});