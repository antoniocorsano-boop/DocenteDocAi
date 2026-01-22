/**
 * SPA-Native E2E Test Utilities
 * Framework per testare applicazioni React SPA con navigazione client-side
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * Utility per navigazione SPA con attesa DOM-based
 */
export class SPANavigationHelper {
  constructor(private page: Page) {}

  /**
   * Naviga a una vista SPA aspettando cambiamenti DOM invece di URL
   */
  async navigateToView(
    navigationButton: string | RegExp,
    expectedViewSelector: string,
    options: {
      timeout?: number;
      waitForStable?: boolean;
    } = {}
  ): Promise<void> {
    const { timeout = 10000, waitForStable = true } = options;

    // Trova e clicca il pulsante di navigazione
    const navButton = this.page.locator('button, [role="button"]').filter({
      hasText: navigationButton
    });

    await expect(navButton).toBeVisible({ timeout });
    await navButton.click();

    // Aspetta che la vista sia visibile nel DOM
    await expect(this.page.locator(expectedViewSelector)).toBeVisible({
      timeout
    });

    // Aspetta stabilità DOM se richiesto
    if (waitForStable) {
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(500); // Buffer per rendering React
    }
  }

  /**
   * Navigazione a cascata (es: Progetta → Knowledge Base)
   */
  async navigateCascade(
    steps: Array<{
      button: string | RegExp;
      expectedSelector: string;
    }>,
    options: { timeout?: number } = {}
  ): Promise<void> {
    for (const step of steps) {
      await this.navigateToView(
        step.button,
        step.expectedSelector,
        options
      );
    }
  }

  /**
   * Verifica che una vista sia attiva
   */
  async verifyViewActive(viewSelector: string, timeout = 5000): Promise<void> {
    await expect(this.page.locator(viewSelector)).toBeVisible({ timeout });
  }

  /**
   * Aspetta che la navigazione sia completata
   */
  async waitForNavigationComplete(): Promise<void> {
    // Aspetta che eventuali transizioni siano finite
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(300);

    // Verifica che non ci siano elementi di loading
    const loadingElements = this.page.locator('[aria-busy="true"], .loading, .spinner');
    await expect(loadingElements).toHaveCount(0, { timeout: 2000 }).catch(() => {
      // Ignora se non ci sono elementi di loading
    });
  }
}

/**
 * Utility per gestione stato applicazione SPA
 */
export class SPAStateHelper {
  constructor(private page: Page) {}

  /**
   * Verifica che l'app sia in stato "logged in"
   */
  async verifyLoggedInState(timeout = 10000): Promise<void> {
    // Usa la stessa logica del smoke test funzionante
    // Aspetta che ci siano pulsanti di navigazione visibili (indicatore di login completato)
    const navButtons = this.page.locator('button, [role="button"]').filter({
      hasText: /scheduleOrario|Orario|Pianifica|progetta|Progetta|Design|classi|Classi|Students|settings|Impostazioni/i
    });

    try {
      await expect(navButtons.first()).toBeVisible({ timeout });
    } catch (e) {
      await this.page.screenshot({ path: `test-results/verifyLoggedInState-fail.png`, fullPage: true });
      const bodyText = await this.page.evaluate(() => document.body.innerText);
       
      console.error('verifyLoggedInState: navButtons not visible. Body text:', bodyText);
      throw e;
    }

    // Verifica che non ci sia onboarding (opzionale, potrebbe non esserci)
    const onboarding = this.page.locator('[data-testid="onboarding"], .onboarding');
    await expect(onboarding).toHaveCount(0, { timeout: 2000 }).catch(() => {
      // Ignora se onboarding è presente (non è un errore bloccante)
    });
  }

  /**
   * Inietta dati di test nell'applicazione
   */
  async injectTestData(testData: unknown): Promise<void> {
    await this.page.evaluate((data) => {
      // Inietta dati nel localStorage/IndexedDB come farebbe l'app
      localStorage.setItem('test-mode', 'true');
      localStorage.setItem('test-data', JSON.stringify(data));

      // Trigger evento per notificare l'app
      window.dispatchEvent(new CustomEvent('test-data-injected', { detail: data }));
    }, testData);
  }

  /**
   * Reset stato applicazione per test isolati
   */
  async resetAppState(): Promise<void> {
    try {
      // Vai alla home page invece di reload forzato
      await this.page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
      await this.page.waitForTimeout(500); // Aspetta che React carichi

      // Prova ad accedere a localStorage in modo sicuro
      await this.page.evaluate(() => {
        try {
          // Clear storage se possibile
          if (typeof localStorage !== 'undefined') {
            localStorage.clear();
          }
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.clear();
          }

          // Clear IndexedDB se presente
          if (typeof indexedDB !== 'undefined' && window.indexedDB) {
            // Nota: indexedDB delete richiede più tempo, saltiamo per ora
          }
        } catch (e) {
          // Ignora errori di sicurezza
          console.warn('Could not clear storage:', e);
        }
      }).catch(() => {
        // Ignora errori di evaluate
      });
    } catch {
      // Fallback: solo goto
      await this.page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    }
  }
}

/**
 * Utility per interazioni comuni SPA
 */
export class SPAInteractionHelper {
  constructor(private page: Page) {}

  /**
   * Clicca elemento con attesa stabilità
   */
  async clickAndWait(
    selector: string | Locator,
    options: {
      waitForStable?: boolean;
      timeout?: number;
    } = {}
  ): Promise<void> {
    const { waitForStable = true, timeout = 5000 } = options;

    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;

    await expect(element).toBeVisible({ timeout });
    await element.click();

    if (waitForStable) {
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Digita testo con debounce per evitare conflitti React
   */
  async typeText(
    selector: string | Locator,
    text: string,
    options: {
      clear?: boolean;
      delay?: number;
    } = {}
  ): Promise<void> {
    const { clear = true, delay = 100 } = options;

    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;

    if (clear) {
      await element.clear();
    }

    await element.type(text, { delay });
    await this.page.waitForTimeout(200); // Debounce per React
  }

  /**
   * Aspetta che un elemento sia stabile (non cambi più)
   */
  async waitForStableElement(
    selector: string,
    timeout = 5000
  ): Promise<void> {
    const element = this.page.locator(selector);

    // Aspetta che sia visibile
    await expect(element).toBeVisible({ timeout });

    // Monitora cambiamenti per stabilità
    let lastContent = '';
    let stableCount = 0;
    const maxStableChecks = 5;

    for (let i = 0; i < maxStableChecks; i++) {
      const currentContent = await element.textContent() || '';
      if (currentContent === lastContent) {
        stableCount++;
        if (stableCount >= 3) break; // Stabile per 3 controlli
      } else {
        stableCount = 0;
        lastContent = currentContent;
      }
      await this.page.waitForTimeout(200);
    }
  }
}

/**
 * Test suite base per SPA
 */
export class SPATestSuite {
  protected navigation: SPANavigationHelper;
  protected state: SPAStateHelper;
  protected interaction: SPAInteractionHelper;

  constructor(protected page: Page) {
    this.navigation = new SPANavigationHelper(page);
    this.state = new SPAStateHelper(page);
    this.interaction = new SPAInteractionHelper(page);
  }

  /**
   * Setup comune per tutti i test SPA
   */
  async setup(): Promise<void> {
    await this.state.resetAppState();
    await this.page.goto('http://localhost:5173');
    await this.state.verifyLoggedInState();
  }

  /**
   * Teardown comune
   */
  async teardown(): Promise<void> {
    // Cleanup se necessario
  }
}

/**
 * Pattern comuni di navigazione per DocenteDoc
 */
export const NavigationPatterns = {
  // Navigazione principale
  ORARIO: /scheduleOrario|Orario|Pianifica/i,
  PROGETTA: /progetta|Progetta|Design/i,
  CLASSI: /classi|Classi|Students/i,
  SETTINGS: /settings|Impostazioni|Settings/i,

  // Viste specifiche
  KNOWLEDGE_BASE: /knowledge.?base|Base.?Conoscenza/i,
  TIMETABLE: /timetable|Orario|Schedules/i,

  // Selettori DOM per verifica navigazione
  VIEW_SELECTORS: {
    ORARIO: '[data-view="timetable"], [data-testid="timetable-view"]',
    PROGETTA: '[data-view="progettazione-hub"], [data-testid="progettazione-view"]',
    CLASSI: '[data-view="classi"], [data-testid="classi-view"]',
    SETTINGS: '[data-view="settings"], [data-testid="settings-view"]',
    KNOWLEDGE_BASE: '[data-view="knowledge-base"], [data-testid="kb-view"]'
  }
} as const;

/**
 * Utility per debug navigazione SPA
 */
export class SPADebugHelper {
  constructor(private page: Page) {}

  /**
   * Log dello stato corrente della navigazione
   */
  async logNavigationState(): Promise<void> {
    const currentUrl = this.page.url();
    const visibleViews = await this.page.locator('[data-view], [data-testid*="view"]').all();

    console.log('=== SPA Navigation State ===');
    console.log('URL:', currentUrl);

    for (const view of visibleViews) {
      const viewId = await view.getAttribute('data-view') || await view.getAttribute('data-testid');
      const isVisible = await view.isVisible();
      console.log(`View ${viewId}: ${isVisible ? 'visible' : 'hidden'}`);
    }

    console.log('=== End Navigation State ===');
  }

  /**
   * Cattura screenshot con timestamp per debug
   */
  async captureDebugScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `debug-${name}-${timestamp}.png`,
      fullPage: true
    });
  }
}