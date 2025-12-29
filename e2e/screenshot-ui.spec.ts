import { test, expect } from '@playwright/test';
import { setTestMode, seedIndexedDB, waitForAppShell } from './helpers';

const SCREENSHOTS = [
  { path: 'dashboard.png', route: '/' },
  { path: 'registro.png', route: '/registro' },
  { path: 'studenti.png', route: '/studenti' },
  { path: 'lezioni.png', route: '/lezioni' },
  { path: 'analytics.png', route: '/analytics' },
  { path: 'impostazioni.png', route: '/impostazioni' },
  // Aggiungi altre view chiave qui
];

test.describe('Screenshot UI principali', () => {
  for (const screen of SCREENSHOTS) {
    test(`Screenshot ${screen.path}`, async ({ page }) => {
      await setTestMode(page);
      await seedIndexedDB(page);
      await page.goto('/');
      await waitForAppShell(page);
      await page.goto(screen.route);
      // Attendi caricamento principale
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(600); // Breve attesa per animazioni
      await page.screenshot({ path: `docs/screenshots/${screen.path}`, fullPage: true });
    });
  }
});
