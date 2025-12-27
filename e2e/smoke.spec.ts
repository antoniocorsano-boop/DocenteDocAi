
import { test, expect } from '@playwright/test';

test.describe('OrarioDoc AI - Smoke Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Diagnostics: capture browser console and page errors into the test runner logs
    page.on('console', msg => {
      try { console.log(`PW_CONSOLE:${msg.type()}: ${msg.text()}`); } catch (e) {}
    });
    page.on('pageerror', err => {
      try { console.error(`PW_PAGE_ERROR: ${err && err.message ? err.message : String(err)}`); } catch (e) {}
    });
    page.on('close', () => {
      try { console.error('PW_PAGE_CLOSED'); } catch (e) {}
    });

    // Enable test-mode early so the app bootstrap fast-path will run
    await page.addInitScript(() => {
      (window as any).__TEST_MODE = true;
    });
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
              knowledgeBase: [],
              notifiche: [],
              // minimal settings
              settings: {},
              aiSettings: {},
              themeState: null
            };
            store.put(payload, BACKUP_KEY);
            tx.oncomplete = () => { db.close(); resolve(); };
            tx.onerror = () => { db.close(); resolve(); };
          };
          req.onerror = () => { resolve(); };
        } catch (e) { resolve(); }
      });
    });
    // Now navigate to app root which will load the backup and set the user
    await page.goto('/');
    await page.reload();
    // Wait for instrumentation to indicate the app shell mounted
    await page.waitForFunction(() => !!(window as any).__app_instrumentation?.appShellMounted, { timeout: 15000 }).catch(() => {});
  });

  test('Flusso di Onboarding (Accesso Rapido)', async ({ page }) => {
    // 1. Support both WelcomeScreen and SignInScreen (legacy vs current)
    const hasWelcome = await page.getByText('Benvenuto, Docente').count().then(c => c > 0);
    const hasSignInManual = (await page.locator('input[placeholder="Nome Docente"]').count()) > 0 || (await page.locator('input[placeholder="Es. Prof. Rossi"]').count()) > 0;

    if (hasWelcome) {
      await expect(page.getByText('Benvenuto, Docente')).toBeVisible();
      await page.click('text=Accesso Rapido');
      await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      await page.click('button:has-text("Entra nella Dashboard")');
    } else if (hasSignInManual) {
      // Direct manual sign-in using SignInScreen
      if ((await page.locator('input[placeholder="Nome Docente"]').count()) > 0) {
        await page.fill('input[placeholder="Nome Docente"]', 'Test Teacher');
      } else {
        await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      }
      // Click explicit button text if present, else submit the form
      if ((await page.getByText('Entra in Locale').count()) > 0) {
        await page.click('text=Entra in Locale');
      } else if ((await page.getByText('Entra').count()) > 0) {
        await page.click('text=Entra');
      } else {
        await page.click('button[type="submit"]').catch(() => {});
      }
    } else {
      // Neither found — try a generic fallback: click first actionable button
      const actionable = await page.locator('button').first();
      if ((await actionable.count()) > 0) await actionable.click().catch(() => {});
    }

    // Extra: wait for document ready and reload if needed
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(300);
    await page.reload();
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(300);

    // 5. Verifica che l'App Shell sia visibile dopo login
    try {
      await page.waitForSelector('.app-shell', { timeout: 20000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/onboarding-app-shell-fail.png', fullPage: true });
      // Log all visible text for debugging
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.error('App shell not found. Body text:', bodyText);
      throw e;
    }
    // Ensure primary navigation or dashboard action exists (accept actual nav labels)
    // Use role=button with name regex and pick first match to avoid ambiguous multiple elements
    await expect(page.getByRole('button', { name: /Pianifica|Progetti|Progetta|Orario|Dashboard/ }).first()).toBeVisible({ timeout: 15000 });
  });

  test('Navigazione Core (Orario e Impostazioni)', async ({ page }) => {
    // Setup rapido login (fallback to SignInScreen if WelcomeScreen not present)
    await page.goto('/');
    const hasWelcome = await page.getByText('Benvenuto, Docente').count().then(c => c > 0);
    const hasManual = (await page.locator('input[placeholder="Nome Docente"]').count()) > 0 || (await page.locator('input[placeholder="Es. Prof. Rossi"]').count()) > 0;
    if (hasWelcome) {
      await page.click('text=Accesso Rapido');
      await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      await page.click('button:has-text("Entra nella Dashboard")');
    } else if (hasManual) {
      if ((await page.locator('input[placeholder="Nome Docente"]').count()) > 0) await page.fill('input[placeholder="Nome Docente"]', 'Test Teacher');
      else await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      if ((await page.getByText('Entra in Locale').count()) > 0) await page.click('text=Entra in Locale');
      else await page.click('button[type="submit"]').catch(()=>{});
    } else {
      // last-resort: try generic submit
      await page.click('button[type="submit"]').catch(()=>{});
    }

    // 1. Vai all'Orario
    await page.waitForSelector('.app-shell', { timeout: 10000 });
    await page.click('text=Pianifica', { timeout: 10000 }); // ActionTile "Pianifica" o Nav Item "Orario"
    await expect(page.getByText('Orario')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Settimana')).toBeVisible({ timeout: 10000 });

    // 2. Apri Impostazioni
    await page.click('button[aria-label="Impostazioni"]');
    await expect(page.getByText('Profilo & Identità')).toBeVisible();
    
    // 3. Verifica persistenza nome
    await expect(page.locator('input[value="Test Teacher"]')).toBeVisible();
  });

  test('Creazione Elemento in Knowledge Base (Mock)', async ({ page }) => {
    // Setup rapido login
    await page.goto('/');
    const hasWelcomeKB = await page.getByText('Benvenuto, Docente').count().then(c => c > 0);
    const hasManualKB = (await page.locator('input[placeholder="Nome Docente"]').count()) > 0 || (await page.locator('input[placeholder="Es. Prof. Rossi"]').count()) > 0;
    if (hasWelcomeKB) {
      await page.click('text=Accesso Rapido');
      await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      await page.click('button:has-text("Entra nella Dashboard")');
    } else if (hasManualKB) {
      if ((await page.locator('input[placeholder="Nome Docente"]').count()) > 0) await page.fill('input[placeholder="Nome Docente"]', 'Test Teacher');
      else await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      if ((await page.getByText('Entra in Locale').count()) > 0) await page.click('text=Entra in Locale');
      else await page.click('button[type="submit"]').catch(()=>{});
    } else {
      await page.click('button[type="submit"]').catch(()=>{});
    }

    // Naviga a KB
    await page.waitForSelector('.app-shell', { timeout: 10000 });
    await page.click('text=Progetti', { timeout: 10000 }); // Hub
    await page.click('text=Knowledge Base', { timeout: 10000 }); // Card

    // Verifica stato vuoto
    await expect(page.getByText('Knowledge Base')).toBeVisible();
    await expect(page.getByText('Nuovo Documento')).toBeVisible();
  });

});
