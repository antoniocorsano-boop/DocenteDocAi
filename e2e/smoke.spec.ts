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
  } catch (e) {
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

test.describe('OrarioDoc AI - Smoke Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Diagnostics: capture browser console and page errors into the test runner logs
    page.on('console', msg => {
      try {
        const text = msg.text ? msg.text() : '';
        const prefixes = (process.env.SILENCE_PW_CONSOLE_PREFIXES || '[IndexedDbService],[BackupService],[AssistantFab],PW_CONSOLE').split(',');
        for (let i = 0; i < prefixes.length; i++) {
          const p = prefixes[i];
          if (!p) continue;
          if (text.indexOf(p) !== -1) return; // swallow noisy message
        }
        console.log(`PW_CONSOLE:${msg.type()}: ${msg.text()}`);
      } catch (e) {
        console.error('Error processing console message:', e);
      }
    });
    page.on('pageerror', err => {
      console.error(`PW_PAGE_ERROR: ${err && err.message ? err.message : String(err)}`);
    });

    page.on('close', () => {
      console.error('PW_PAGE_CLOSED');
    });

    // Enable test-mode early so the app bootstrap fast-path will run
    await page.addInitScript(() => {
      (window as { __TEST_MODE?: boolean }).__TEST_MODE = true;
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
    await page.waitForFunction(() => !!(window as { __app_instrumentation?: { appShellMounted?: boolean } }).__app_instrumentation?.appShellMounted, { timeout: 30000 }).catch(() => {});
  });

  test('Flusso di Onboarding (Accesso Rapido)', async ({ page }) => {
    // 1. Support both WelcomeScreen and SignInScreen (legacy vs current)
    const hasWelcome = await page.getByText('Benvenuto, Docente').count().then(c => c > 0);
    const hasSignInManual = (await page.locator('input[placeholder="Nome Docente"]').count()) > 0 || (await page.locator('input[placeholder="Es. Prof. Rossi"]').count()) > 0;

    if (hasWelcome) {
      await expect(page.getByText('Benvenuto, Docente')).toBeVisible();
      await safeClick(page, 'text=Accesso Rapido', 'Accesso Rapido');
      await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      await safeClick(page, 'button:has-text("Entra nella Dashboard")', 'Entra nella Dashboard');
    } else if (hasSignInManual) {
      // Direct manual sign-in using SignInScreen
      if ((await page.locator('input[placeholder="Nome Docente"]').count()) > 0) {
        await page.fill('input[placeholder="Nome Docente"]', 'Test Teacher');
      } else {
        await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      }
      // Click explicit button text if present, else submit the form
      if ((await page.getByText('Entra in Locale').count()) > 0) {
        await safeClick(page, 'text=Entra in Locale', 'Entra in Locale');
      } else if ((await page.getByText('Entra').count()) > 0) {
        await safeClick(page, 'text=Entra', 'Entra');
      } else {
        const submit = page.locator('button[type="submit"]');
        if ((await submit.count()) > 0) await safeClick(page, submit, 'submit');
      }
    } else {
      // Neither found — try a generic fallback: click first actionable button
      const actionable = await page.locator('button').first();
      if ((await actionable.count()) > 0) await safeClick(page, actionable, 'first-actionable');
    }

    // Extra: wait for document ready and reload if needed
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15000 }).catch(() => {});
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
      await expect(page.getByRole('button', { name: /Pianifica|Progett|Orario|Dashboard/ }).first()).toBeVisible({ timeout: 15000 });
  });

  test('Navigazione Core (Orario e Impostazioni)', async ({ page }) => {
    // Setup rapido login (fallback to SignInScreen if WelcomeScreen not present)
    await page.goto('/');
    const hasWelcome = await page.getByText('Benvenuto, Docente').count().then(c => c > 0);
    const hasManual = (await page.locator('input[placeholder="Nome Docente"]').count()) > 0 || (await page.locator('input[placeholder="Es. Prof. Rossi"]').count()) > 0;
    if (hasWelcome) {
      await safeClick(page, 'text=Accesso Rapido', 'Accesso Rapido');
      await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      await safeClick(page, 'button:has-text("Entra nella Dashboard")', 'Entra nella Dashboard');
    } else if (hasManual) {
      if ((await page.locator('input[placeholder="Nome Docente"]').count()) > 0) await page.fill('input[placeholder="Nome Docente"]', 'Test Teacher');
      else await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      if ((await page.getByText('Entra in Locale').count()) > 0) await safeClick(page, 'text=Entra in Locale', 'Entra in Locale');
      else {
        const submit = page.locator('button[type="submit"]');
        if ((await submit.count()) > 0) await safeClick(page, submit, 'submit');
      }
    } else {
      // last-resort: try generic submit
      const submit = page.locator('button[type="submit"]');
      if ((await submit.count()) > 0) await safeClick(page, submit, 'submit');
    }

    // 1. Vai all'Orario
    try {
      await page.waitForSelector('.app-shell', { timeout: 20000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/diagnostic-orario-no-app-shell.png', fullPage: true }).catch(()=>{});
      const bodyText = await page.evaluate(() => document.body.innerText).catch(()=>'');
      console.error('Diagnostic: .app-shell not found. Body text snippet:', bodyText.slice(0, 800));
      throw e;
    }
    await safeClick(page, page.getByRole('button', { name: /Pianifica|Progett|Orario|Dashboard/ }).first(), 'nav-action');
    // Use role-based locator for the nav item to avoid ambiguous text matches
    await expect(page.getByRole('button', { name: /Orario/ }).first()).toBeVisible({ timeout: 10000 });
    // Disambiguate 'Settimana' by selecting the button role (label may also appear as paragraph)
    await expect(page.getByRole('button', { name: /Settimana/ }).first()).toBeVisible({ timeout: 10000 });

    // 2. Apri Impostazioni
    // Open actions/menu on smaller viewports, then click the Impostazioni entry
    await safeClick(page, page.getByRole('button', { name: /Menu/ }).first(), 'menu');
    // The actions popover may render list items as generic elements; use text fallback
    await safeClick(page, 'text=Impostazioni', 'Impostazioni');
    // More robust: wait for the Settings content container and open the 'Profilo & Identità' group
    await page.waitForSelector('.settings-content', { timeout: 15000 });
    // Expand the Profile group if it's collapsed
    await safeClick(page, 'summary:has-text("Profilo & Identità")', 'Apri Profilo & Identità');
    await expect(page.getByLabel('Nome', { exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('Creazione Elemento in Knowledge Base (Mock)', async ({ page }) => {
    // Setup rapido login
    await page.goto('/');
    const hasWelcomeKB = await page.getByText('Benvenuto, Docente').count().then(c => c > 0);
    const hasManualKB = (await page.locator('input[placeholder="Nome Docente"]').count()) > 0 || (await page.locator('input[placeholder="Es. Prof. Rossi"]').count()) > 0;
    if (hasWelcomeKB) {
      await safeClick(page, 'text=Accesso Rapido', 'Accesso Rapido');
      await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      await safeClick(page, 'button:has-text("Entra nella Dashboard")', 'Entra nella Dashboard');
    } else if (hasManualKB) {
      if ((await page.locator('input[placeholder="Nome Docente"]').count()) > 0) await page.fill('input[placeholder="Nome Docente"]', 'Test Teacher');
      else await page.fill('input[placeholder="Es. Prof. Rossi"]', 'Test Teacher');
      if ((await page.getByText('Entra in Locale').count()) > 0) await safeClick(page, 'text=Entra in Locale', 'Entra in Locale');
      else {
        const submit = page.locator('button[type="submit"]');
        if ((await submit.count()) > 0) await safeClick(page, submit, 'submit');
      }
    } else {
      const submit = page.locator('button[type="submit"]');
      if ((await submit.count()) > 0) await safeClick(page, submit, 'submit');
    }

    // Naviga a KB
    try {
      await page.waitForSelector('.app-shell', { timeout: 20000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/diagnostic-kb-no-app-shell.png', fullPage: true }).catch(()=>{});
      const bodyText2 = await page.evaluate(() => document.body.innerText).catch(()=>'');
      console.error('Diagnostic: .app-shell not found before KB navigation. Body text snippet:', bodyText2.slice(0, 800));
      throw e;
    }
    await safeClick(page, page.getByRole('button', { name: /Progetti|Progett|Progetta/ }).first(), 'progetta');
    await safeClick(page, 'text=Knowledge Base', 'Knowledge Base');

    // Verifica stato vuoto
    await expect(page.getByText('Knowledge Base')).toBeVisible();
    // Accept either the new-document button or the upload action used in some builds
    const hasNuovo = (await page.getByText('Nuovo Documento').count()) > 0;
    const hasCarica = (await page.getByText('Carica Documenti').count()) > 0;
    if (!hasNuovo && !hasCarica) {
      // Fallback: check for empty-state indicators
      await expect(page.getByText(/0 file salvati/)).toBeVisible();
    } else if (hasNuovo) {
      await expect(page.getByText('Nuovo Documento')).toBeVisible();
    } else {
      await expect(page.getByText('Carica Documenti')).toBeVisible();
    }
  });

});
