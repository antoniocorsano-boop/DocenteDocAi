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
    // Navigate to the app first so that IndexedDB writes happen on the correct origin (localhost:5173)
    await page.goto('/');
    // Inject test backup into IDB on the correct origin, then reload so the app reads it fresh
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
              // minimal settings — onboarded:true prevents wizard from blocking tests
              settings: { onboarded: true },
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
    // Reload so the app reads the freshly injected backup from IndexedDB
    await page.reload();
    // Wait for app shell to mount - simplified for SPA
    await page.waitForFunction(() => {
      return document.readyState === 'complete' &&
             !!document.querySelector('.app-shell-container, [role="navigation"]');
    }, { timeout: 15000 }).catch(() => {
      console.log('App shell not ready, continuing anyway');
    });
  });

  test('Flusso di Onboarding (Accesso Rapido)', async ({ page }) => {
    // Controlla se siamo già loggati - usa aria-label dei pulsanti di navigazione
    const isAlreadyLoggedIn = await page.locator('.app-shell-container').isVisible().catch(() => false) ||
                              await page.getByRole('button', { name: /^Orario$/ }).isVisible().catch(() => false) ||
                              await page.getByRole('button', { name: /^Progetta$/ }).isVisible().catch(() => false) ||
                              await page.getByRole('button', { name: /^Classi$/ }).isVisible().catch(() => false) ||
                              await page.locator('[aria-label="Navigazione principale"]').isVisible().catch(() => false);

    console.log('Login detection - app-shell visible:', await page.locator('.app-shell-container').isVisible().catch(() => false));
    console.log('Login detection - Orario visible:', await page.getByRole('button', { name: /^Orario$/ }).isVisible().catch(() => false));
    console.log('Login detection - Progetta visible:', await page.getByRole('button', { name: /^Progetta$/ }).isVisible().catch(() => false));
    console.log('Login detection - Classi visible:', await page.getByRole('button', { name: /^Classi$/ }).isVisible().catch(() => false));
    console.log('Login detection - Final result:', isAlreadyLoggedIn);

    if (!isAlreadyLoggedIn) {
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
    } else {
      console.log('User already logged in via test mode - skipping onboarding flow');
    }

    // Attendi che la pagina sia completamente caricata - SPA pattern
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15000 });

    // Verifica che il DOM sia pronto - aspetta elementi di navigazione (semplificato)
    await page.waitForFunction(() => {
      return !!(
        // Controlla che il documento sia pronto
        document.readyState === 'complete' &&
        // Controlla che ci siano elementi di navigazione
        document.querySelector('[role="navigation"], nav, .nav') &&
        // Controlla che non ci siano spinner di caricamento
        !document.querySelector('.loading-spinner, [aria-busy="true"]')
      );
    }, { timeout: 20000 });
    try {
      await page.waitForSelector('.app-shell-container', { timeout: 20000 });
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
    // Setup rapido login con miglior sincronizzazione SPA
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Attendi che la pagina sia completamente caricata - SPA pattern
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15000 });

    // Verifica che il DOM sia pronto - aspetta elementi di navigazione (semplificato)
    await page.waitForFunction(() => {
      return !!(
        // Controlla che il documento sia pronto
        document.readyState === 'complete' &&
        // Controlla che ci siano elementi di navigazione
        document.querySelector('[role="navigation"], nav, .nav') &&
        // Controlla che non ci siano spinner di caricamento
        !document.querySelector('.loading-spinner, [aria-busy="true"]')
      );
    }, { timeout: 20000 });

    // Controlla se siamo già loggati - usa aria-label dei pulsanti di navigazione
    const isAlreadyLoggedIn = await page.locator('.app-shell-container').isVisible().catch(() => false) ||
                              await page.getByRole('button', { name: /^Orario$/ }).isVisible().catch(() => false) ||
                              await page.getByRole('button', { name: /^Progetta$/ }).isVisible().catch(() => false) ||
                              await page.getByRole('button', { name: /^Classi$/ }).isVisible().catch(() => false) ||
                              await page.locator('[aria-label="Navigazione principale"]').isVisible().catch(() => false);

    console.log('Login detection - Navigazione Core - app-shell visible:', await page.locator('.app-shell-container').isVisible().catch(() => false));
    console.log('Login detection - Navigazione Core - Orario visible:', await page.getByRole('button', { name: /^Orario$/ }).isVisible().catch(() => false));
    console.log('Login detection - Navigazione Core - Progetta visible:', await page.getByRole('button', { name: /^Progetta$/ }).isVisible().catch(() => false));
    console.log('Login detection - Navigazione Core - Final result:', isAlreadyLoggedIn);

    if (!isAlreadyLoggedIn) {
      // Login con approccio più robusto
      const hasWelcome = await page.getByText('Benvenuto, Docente').isVisible().catch(() => false);
      const hasSignInManual = await page.locator('input[placeholder*="Nome Docente"], input[placeholder*="Prof"]').isVisible().catch(() => false);

      if (hasWelcome) {
        await expect(page.getByText('Benvenuto, Docente')).toBeVisible({ timeout: 10000 });
        await page.getByText('Accesso Rapido').click();
        await page.locator('input[placeholder*="Prof"]').fill('Test Teacher');
        await page.getByRole('button', { name: /Entra.*Dashboard/i }).click();
      } else if (hasSignInManual) {
        const input = page.locator('input[placeholder*="Nome Docente"], input[placeholder*="Prof"]').first();
        await input.fill('Test Teacher');

        if (await page.getByText('Entra in Locale').isVisible()) {
          await page.getByText('Entra in Locale').click();
        } else {
          await page.getByRole('button', { name: /Entra|Submit/i }).first().click();
        }
      } else {
        // Fallback: cerca qualsiasi pulsante di submit - screenshot diagnostico per Navigazione Core
        await page.screenshot({ path: 'test-results/login-page-diagnostic-navigazione.png', fullPage: true });
        console.log('Login page diagnostic - Navigazione Core test - looking for submit button');

        // Lista tutti i pulsanti disponibili per debug
        const allButtons = await page.locator('button').allTextContents();
        console.log('Available buttons:', allButtons);

        await page.getByRole('button', { name: /submit|entra|login/i }).first().click();
      }
    } else {
      console.log('User already logged in via test mode - skipping manual login');
    }

    // Attendi che l'app shell sia completamente montata
    // Miglior sincronizzazione: aspetta funzione globale invece di selettore
    await page.waitForFunction(() => {
      return !!(
        // Controlla che l'app shell esista
        document.querySelector('.app-shell-container') &&
        // Controlla che non ci siano spinner di caricamento
        !document.querySelector('.loading-spinner, [aria-busy="true"]') &&
        // Controlla che il documento sia pronto
        document.readyState === 'complete' &&
        // Controlla che ci siano elementi di navigazione
        document.querySelector('[role="navigation"], nav, .nav')
      );
    }, { timeout: 30000 });

    // Verifica che l'app shell sia visibile
    await expect(page.locator('.app-shell-container')).toBeVisible({ timeout: 10000 });

    // 1. Naviga all'Orario usando il pulsante della NavigationRail
    // Usa selector più robusto per il pulsante Orario
    const orarioButton = page.getByRole('button', { name: /scheduleOrario|Orario|Pianifica/i }).first();
    await expect(orarioButton).toBeVisible({ timeout: 10000 });
    await orarioButton.click();

    // Attendi che la navigazione sia completata - aspetta elementi specifici del Timetable
    await page.waitForFunction(() => {
      return !!(
        // Controlla il titolo dell'orario
        document.querySelector('*')?.textContent?.includes('Il Mio Orario') ||
        document.querySelector('*')?.textContent?.includes('Planning Settimanale') ||
        // Controlla la presenza di giorni della settimana
        document.querySelector('*')?.textContent?.includes('Lunedì') ||
        document.querySelector('*')?.textContent?.includes('Martedì')
      );
    }, { timeout: 15000 });

    // Verifica elementi specifici della pagina Orario
    await expect(page.getByText('Il Mio Orario')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Planning Settimanale')).toBeVisible({ timeout: 10000 });

    // 2. Apri Impostazioni con miglior gestione errori
    try {
      // Clicca sul menu hamburger/settings
      const menuButton = page.getByRole('button', { name: /Menu|Impostazioni|Settings/i }).first();
      await expect(menuButton).toBeVisible({ timeout: 5000 });
      await menuButton.click();

      // Attendi che il menu si apra
      await page.waitForTimeout(500);

      // Clicca su Impostazioni
      const settingsLink = page.getByText('Impostazioni').first();
      await expect(settingsLink).toBeVisible({ timeout: 5000 });
      await settingsLink.click();

      // Verifica che la pagina Impostazioni sia caricata
      await expect(page.getByRole('heading', { name: 'Impostazioni' })).toBeVisible({ timeout: 10000 });

    } catch (error) {
      // Fallback: screenshot per debug
      await page.screenshot({ path: 'test-results/settings-navigation-fail.png', fullPage: true });
      console.error('Settings navigation failed:', error);
      throw error;
    }
  });

  test('Creazione Elemento in Knowledge Base (Mock)', async ({ page }) => {
    // Setup rapido login con miglior sincronizzazione SPA
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Attendi che la pagina sia completamente caricata - SPA pattern
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15000 });

    // Verifica che il DOM sia pronto - aspetta elementi di navigazione (semplificato)
    await page.waitForFunction(() => {
      return !!(
        // Controlla che il documento sia pronto
        document.readyState === 'complete' &&
        // Controlla che ci siano elementi di navigazione
        document.querySelector('[role="navigation"], nav, .nav') &&
        // Controlla che non ci siano spinner di caricamento
        !document.querySelector('.loading-spinner, [aria-busy="true"]')
      );
    }, { timeout: 20000 });

    // Controlla se siamo già loggati - usa aria-label dei pulsanti di navigazione
    const isAlreadyLoggedIn = await page.locator('.app-shell-container').isVisible().catch(() => false) ||
                              await page.getByRole('button', { name: /^Orario$/ }).isVisible().catch(() => false) ||
                              await page.getByRole('button', { name: /^Progetta$/ }).isVisible().catch(() => false) ||
                              await page.getByRole('button', { name: /^Classi$/ }).isVisible().catch(() => false) ||
                              await page.locator('[aria-label="Navigazione principale"]').isVisible().catch(() => false);

    console.log('Login detection - Knowledge Base - app-shell visible:', await page.locator('.app-shell-container').isVisible().catch(() => false));
    console.log('Login detection - Knowledge Base - Orario visible:', await page.getByRole('button', { name: /^Orario$/ }).isVisible().catch(() => false));
    console.log('Login detection - Knowledge Base - Progetta visible:', await page.getByRole('button', { name: /^Progetta$/ }).isVisible().catch(() => false));
    console.log('Login detection - Knowledge Base - Final result:', isAlreadyLoggedIn);

    if (!isAlreadyLoggedIn) {
      // Login con approccio più robusto
      const hasWelcomeKB = await page.getByText('Benvenuto, Docente').isVisible().catch(() => false);
      const hasManualKB = await page.locator('input[placeholder*="Nome Docente"], input[placeholder*="Prof"]').isVisible().catch(() => false);

      if (hasWelcomeKB) {
        await page.getByText('Accesso Rapido').click();
        await page.locator('input[placeholder*="Prof"]').fill('Test Teacher');
        await page.getByRole('button', { name: /Entra.*Dashboard/i }).click();
      } else if (hasManualKB) {
        const input = page.locator('input[placeholder*="Nome Docente"], input[placeholder*="Prof"]').first();
        await input.fill('Test Teacher');

        if (await page.getByText('Entra in Locale').isVisible()) {
          await page.getByText('Entra in Locale').click();
        } else {
          await page.getByRole('button', { name: /Entra|Submit/i }).first().click();
        }
      } else {
        // Fallback: cerca qualsiasi pulsante di submit - screenshot diagnostico per Knowledge Base
        await page.screenshot({ path: 'test-results/login-page-diagnostic-kb.png', fullPage: true });
        console.log('Login page diagnostic - Knowledge Base test - looking for submit button');

        // Lista tutti i pulsanti disponibili per debug
        const allButtons = await page.locator('button').allTextContents();
        console.log('Available buttons:', allButtons);

        await page.getByRole('button', { name: /submit|entra|login/i }).first().click();
      }
    } else {
      console.log('User already logged in via test mode - skipping manual login');
    }

    // Attendi che l'app shell sia completamente montata
    await page.waitForFunction(() => {
      return !!(
        document.querySelector('.app-shell-container') &&
        !document.querySelector('.loading-spinner, [aria-busy="true"]') &&
        document.readyState === 'complete' &&
        document.querySelector('[role="navigation"], nav, .nav')
      );
    }, { timeout: 30000 });

    // Verifica che l'app shell sia visibile
    await expect(page.locator('.app-shell-container')).toBeVisible({ timeout: 10000 });

    // Naviga a Knowledge Base con approccio SPA-native a cascata
    try {
      // Prima: Click "Progetta" per andare alla view progettazione-hub
      const progettaButton = page.getByRole('button', { name: /design_servicesProgetta|Progetta|Progett/i }).first();
      await expect(progettaButton).toBeVisible({ timeout: 10000 });
      await progettaButton.click();

      // Attendi che la view progettazione-hub sia caricata (DOM-based)
      await page.waitForFunction(() => {
        return !!(
          document.querySelector('h1, h2')?.textContent?.includes('Progettazione') ||
          document.querySelector('*')?.textContent?.includes('Progettazione') ||
          document.querySelector('.planning, .progettazione') ||
          // Oppure aspetta che i pulsanti delle card siano visibili
          document.querySelector('button')?.textContent?.includes('Knowledge Base')
        );
      }, { timeout: 15000 });

      // Attendi un po' per il rendering delle card
      await page.waitForTimeout(1000);

      // Seconda: Click sulla card "Knowledge Base" nella view
      const kbCard = page.getByRole('button', { name: /Knowledge Base/ }).first();
      await expect(kbCard).toBeVisible({ timeout: 10000 });
      await kbCard.click();

      // Attendi che la navigazione sia completata - aspetta contenuto specifico KB
      await page.waitForFunction(() => {
        const bodyText = document.body.textContent ?? '';
        return !!(
          // Controlla il titolo della sezione (qualsiasi tag heading)
          bodyText.includes('Knowledge Base') ||
          // Controlla il pulsante "Carica Documenti"
          Array.from(document.querySelectorAll('button')).some(b => (b.textContent ?? '').includes('Carica Documenti')) ||
          // Controlla la card di sincronia NotebookLM
          document.querySelector('[data-testid*="notebook"], [class*="notebook"]') ||
          document.querySelector('main .knowledge-base-folder-grid') ||
          document.querySelector('main .knowledge-base-file-list')
        );
      }, { timeout: 20000 });

      // Verifica che siamo nella pagina corretta
      await expect(page.getByRole('heading', { name: 'Knowledge Base' })).toBeVisible({ timeout: 10000 });
      // Verifica anche che ci siano elementi specifici della Knowledge Base
      await expect(page.getByText('Carica Documenti')).toBeVisible({ timeout: 5000 });

      // Verifica stato della Knowledge Base (vuota o con contenuto)
      const hasNuovo = await page.getByText('Nuovo Documento').isVisible().catch(() => false);
      const hasCarica = await page.getByText('Carica Documenti').isVisible().catch(() => false);
      const hasEmptyState = await page.getByText(/0 file salvati/).isVisible().catch(() => false);

      if (hasNuovo) {
        await expect(page.getByText('Nuovo Documento')).toBeVisible();
      } else if (hasCarica) {
        await expect(page.getByText('Carica Documenti')).toBeVisible();
      } else if (hasEmptyState) {
        await expect(page.getByText(/0 file salvati/)).toBeVisible();
      } else {
        // Fallback: verifica che ci sia qualche indicatore di KB
        await expect(page.locator('.kb-container, .knowledge-base, [data-testid*="kb"]')).toBeVisible({ timeout: 5000 });
      }

    } catch (error) {
      // Screenshot per debug
      await page.screenshot({ path: 'test-results/kb-navigation-fail.png', fullPage: true });
      console.error('Knowledge Base navigation failed:', error);
      throw error;
    }
  });
});
