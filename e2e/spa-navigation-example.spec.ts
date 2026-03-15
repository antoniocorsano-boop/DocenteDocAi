import { test, expect } from '@playwright/test';
import { Page, Locator } from '@playwright/test';

/**
 * SPA Navigation Example - Best Practices for Single-Page Application Testing
 *
 * Rules:
 * 1. Never rely on URL changes for navigation detection
 * 2. Wait for DOM content using page.waitForFunction() or locator.waitFor()
 * 3. Use robust clicking with fallback to page.evaluate()
 * 4. Detect existing login state
 * 5. Add [NAVIGATION] logs for debugging
 * 6. Use increased timeouts for fragile operations
 * 7. Assert on visible DOM elements, not URLs
 * 8. Keep code simple and readable
 */

// Detect if user is already logged in
async function isLoggedIn(page: Page): Promise<boolean> {
  // Check for navigation elements that indicate logged-in state
  const navElements = [
    page.locator('button[aria-label*="settings"], button[aria-label*="menu"]'),
    page.locator('nav, [role="navigation"]'),
    page.getByText('Orario'),
    page.getByText('Progetta'),
    page.getByText('Classi')
  ];

  for (const element of navElements) {
    try {
      if (await element.isVisible({ timeout: 2000 })) {
        return true;
      }
    } catch {
      // Continue checking other elements
    }
  }

  return false;
}

// Perform quick login for test mode
async function performQuickLogin(page: Page) {
  console.log('[LOGIN] Starting quick login process');

  // Check for welcome screen
  const hasWelcome = await page.getByText('Benvenuto, Docente').isVisible().catch(() => false);
  if (hasWelcome) {
    await page.getByText('Accesso Rapido').click();
    await page.locator('input[placeholder*="Prof"]').fill('Test Teacher');
    await page.getByRole('button', { name: /Entra.*Dashboard/i }).click();
    return;
  }

  // Check for manual login form
  const hasManualLogin = await page.locator('input[placeholder*="Nome Docente"], input[placeholder*="Prof"]').isVisible().catch(() => false);
  if (hasManualLogin) {
    const input = page.locator('input[placeholder*="Nome Docente"], input[placeholder*="Prof"]').first();
    await input.fill('Test Teacher');

    if (await page.getByText('Entra in Locale').isVisible()) {
      await page.getByText('Entra in Locale').click();
    } else {
      await page.getByRole('button', { name: /Entra|Submit/i }).first().click();
    }
    return;
  }

  // Fallback: look for any submit button
  const submitButton = page.getByRole('button', { name: /submit|entra|login/i }).first();
  if (await submitButton.isVisible({ timeout: 5000 })) {
    await submitButton.click();
  }
}

test.describe('SPA Navigation Example - Best Practices', () => {

  test.beforeEach(async ({ page }) => {
    // Enable test-mode early so the app bootstrap fast-path will run
    await page.addInitScript(() => {
      (window as { __TEST_MODE?: boolean }).__TEST_MODE = true;
    });

    // Inject test data for faster loading
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        try {
          const DB_NAME = 'OrarioDocAI_BackupDB';
          const STORE_NAME = 'app_state';
          const BACKUP_KEY = 'latest_backup';

          const req = indexedDB.open(DB_NAME, 3);
          req.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
          };
          req.onsuccess = () => {
            const db = req.result;
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const payload = {
              user: { id: 'test-local', displayName: 'Test Teacher' },
              students: [],
              lessons: [],
              slots: {},
              evaluations: [],
              udas: [],
              events: [],
              settings: {
                nomeIstituto: 'Test School',
                activityStartDate: '2024-09-01',
                activityEndDate: '2025-06-30'
              },
              timestamp: Date.now(),
              version: 'test'
            };
            store.put(payload, BACKUP_KEY);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve(); // Continue even if DB fails
          };
          req.onerror = () => resolve(); // Continue even if DB fails
        } catch (e) {
          resolve(); // Continue even if setup fails
        }
      });
    });

    // Setup console logging for debugging
    page.on('console', msg => {
      const text = msg.text();
      // Filter out noisy messages
      if (!text.includes('[IndexedDbService]') && !text.includes('[BackupService]')) {
        console.log(`PW_CONSOLE: ${text}`);
      }
    });

    page.on('pageerror', err => {
      console.error(`PW_PAGE_ERROR: ${err.message}`);
    });

    // Navigate to app and reload to load test data
    await page.goto('/');
    await page.reload();

    // Wait for app shell to mount
    await page.waitForFunction(() => !!(window as { __app_instrumentation?: { appShellMounted?: boolean } }).__app_instrumentation?.appShellMounted, { timeout: 30000 }).catch(() => {});
  });

  test('Complete SPA Navigation Flow: Login → Timetable → Knowledge Base', async ({ page }) => {
    console.log('[TEST] Starting SPA navigation test');

    // Step 1: Check login state and login if necessary
    console.log('[LOGIN] Checking login state');
    const alreadyLoggedIn = await isLoggedIn(page);

    if (!alreadyLoggedIn) {
      console.log('[LOGIN] User not logged in, performing quick login');
      await performQuickLogin(page);

      // Wait for login to complete and navigation to appear
      try {
        await page.waitForFunction(() => {
          return !!document.querySelector('[role="navigation"], nav') &&
                 !!document.querySelector('.app-shell-container');
        }, { timeout: 20000 });
      } catch (e) {
        await page.screenshot({ path: 'test-results/login-waitForFunction-fail.png', fullPage: true });
        const bodyText = await page.evaluate(() => document.body.innerText);
        // eslint-disable-next-line no-console
        console.error('Login waitForFunction failed. Body text:', bodyText);
        throw e;
      }

      console.log('[LOGIN] Login completed successfully');
    } else {
      console.log('[LOGIN] User already logged in, skipping login');
    }

    // Verify we're in the main app interface
    try {
      await expect(page.locator('.app-shell-container')).toBeVisible({ timeout: 10000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/app-shell-container-fail.png', fullPage: true });
      const bodyText = await page.evaluate(() => document.body.innerText);
      // eslint-disable-next-line no-console
      console.error('App shell container not visible. Body text:', bodyText);
      throw e;
    }

    // Step 3: Navigate to Timetable
    console.log('[NAVIGATION] Starting navigation to Timetable');

    // Find and click the "Orario" button in NavigationRail
    const orarioButton = page.getByRole('button', { name: /Orario|Pianifica/i }).first();
    try {
      await expect(orarioButton).toBeVisible({ timeout: 10000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/orario-button-fail.png', fullPage: true });
      const bodyText = await page.evaluate(() => document.body.innerText);
      // eslint-disable-next-line no-console
      console.error('Orario button not visible. Body text:', bodyText);
      throw e;
    }

    console.log('[NAVIGATION] Clicking Orario button');
    await orarioButton.click();

    // Wait for Timetable content to load (DOM-based detection, no URL change)
    console.log('[NAVIGATION] Waiting for Timetable content to appear');
    try {
      await page.waitForFunction(() => {
        return !!(
          // Check for timetable-specific content
          document.querySelector('h1, h2, h3')?.textContent?.includes('Orario') ||
          document.querySelector('*')?.textContent?.includes('Il Mio Orario') ||
          document.querySelector('*')?.textContent?.includes('Planning Settimanale') ||
          // Check for day names that appear in timetable
          document.querySelector('*')?.textContent?.includes('Lunedì') ||
          document.querySelector('*')?.textContent?.includes('Martedì')
        );
      }, { timeout: 20000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/timetable-waitForFunction-fail.png', fullPage: true });
      const bodyText = await page.evaluate(() => document.body.innerText);
      // eslint-disable-next-line no-console
      console.error('Timetable waitForFunction failed. Body text:', bodyText);
      throw e;
    }

    console.log('[NAVIGATION] Timetable navigation completed');

    // Verify Timetable elements are visible
    try {
      await expect(page.getByText('Il Mio Orario')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Planning Settimanale')).toBeVisible({ timeout: 5000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/timetable-elements-fail.png', fullPage: true });
      const bodyText = await page.evaluate(() => document.body.innerText);
      // eslint-disable-next-line no-console
      console.error('Timetable elements not visible. Body text:', bodyText);
      throw e;
    }

    console.log('[VERIFICATION] Timetable elements verified');

    // Step 4: Navigate to Knowledge Base (two-step navigation)
    console.log('[NAVIGATION] Starting navigation to Knowledge Base');

    // First: Click "Progetta" to go to progettazione-hub view
    const progettaButton = page.getByRole('button', { name: /Progetta|Progett/i }).first();
    try {
      await expect(progettaButton).toBeVisible({ timeout: 10000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/progetta-button-fail.png', fullPage: true });
      const bodyText = await page.evaluate(() => document.body.innerText);
      // eslint-disable-next-line no-console
      console.error('Progetta button not visible. Body text:', bodyText);
      throw e;
    }

    console.log('[NAVIGATION] Clicking Progetta button');
    await progettaButton.click();

    // Wait for progettazione-hub view to load
    try {
      await page.waitForFunction(() => {
        return !!(
          document.querySelector('h1, h2')?.textContent?.includes('Progettazione') ||
          document.querySelector('*')?.textContent?.includes('Progettazione') ||
          document.querySelector('.planning, .progettazione')
        );
      }, { timeout: 15000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/progettazione-waitForFunction-fail.png', fullPage: true });
      const bodyText = await page.evaluate(() => document.body.innerText);
      // eslint-disable-next-line no-console
      console.error('Progettazione waitForFunction failed. Body text:', bodyText);
      throw e;
    }

    console.log('[NAVIGATION] Progettazione hub loaded');

    // Wait a bit for cards to render
    await page.waitForTimeout(1000);

    // Second: Click "Knowledge Base" card within the view
    const kbCard = page.getByRole('button', { name: /Knowledge Base/ }).first();
    try {
      await expect(kbCard).toBeVisible({ timeout: 10000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/kb-card-fail.png', fullPage: true });
      const bodyText = await page.evaluate(() => document.body.innerText);
      // eslint-disable-next-line no-console
      console.error('Knowledge Base card not visible. Body text:', bodyText);
      throw e;
    }

    console.log('[NAVIGATION] Clicking Knowledge Base card');
    await kbCard.click();

    // Wait for Knowledge Base content to load
    console.log('[NAVIGATION] Waiting for Knowledge Base content to appear');
    try {
      await page.waitForFunction(() => {
        return !!(
          // Check for Knowledge Base title
          document.querySelector('h1, h2')?.textContent?.includes('Knowledge Base') ||
          // Check for Knowledge Base specific elements
          document.querySelector('button')?.textContent?.includes('Carica Documenti') ||
          document.querySelector('*')?.textContent?.includes('Archivio fonti') ||
          // Check for folder grid or file list
          document.querySelector('.knowledge-base-folder-grid, .knowledge-base-file-list')
        );
      }, { timeout: 25000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/kb-waitForFunction-fail.png', fullPage: true });
      const bodyText = await page.evaluate(() => document.body.innerText);
      // eslint-disable-next-line no-console
      console.error('Knowledge Base waitForFunction failed. Body text:', bodyText);
      throw e;
    }

    console.log('[NAVIGATION] Knowledge Base navigation completed');

    // Step 5: Verify Knowledge Base elements are visible
    try {
      // Accept any of the possible texts depending on app state
      await expect(
        page.getByText('Knowledge Base').or(page.getByText('Base della Conoscenza')).first()
      ).toBeVisible({ timeout: 5000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/kb-elements-fail.png', fullPage: true });
      const bodyText = await page.evaluate(() => document.body.innerText);
      // eslint-disable-next-line no-console
      console.error('Knowledge Base elements not visible. Body text:', bodyText);
      throw e;
    }

    console.log('[VERIFICATION] Knowledge Base elements verified');
    console.log('[TEST] SPA navigation test completed successfully');
  });

});