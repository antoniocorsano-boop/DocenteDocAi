import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173'; // Cambia se la porta è diversa

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
      await page.goto(BASE_URL + screen.route);
      // Attendi caricamento principale
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(600); // Breve attesa per animazioni
      await page.screenshot({ path: `docs/screenshots/${screen.path}`, fullPage: true });
    });
  }
});
