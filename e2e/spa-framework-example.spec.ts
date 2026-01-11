/**
 * Esempio di test SPA usando il nuovo framework
 * Dimostra pattern corretti per testare navigazione client-side
 */

import { test } from '@playwright/test';
import {
  SPATestSuite,
  NavigationPatterns,
  SPADebugHelper
} from './utils/spa-test-utils';

class DocenteDocTestSuite extends SPATestSuite {
  protected debug: SPADebugHelper;

  constructor(page: any) {
    super(page);
    this.debug = new SPADebugHelper(page);
  }

  /**
   * Test navigazione base con framework SPA
   */
  async testBasicNavigation() {
    await test.step('Setup SPA test environment', async () => {
      await this.setup();
    });

    await test.step('Navigate to Orario', async () => {
      await this.navigation.navigateToView(
        NavigationPatterns.ORARIO,
        NavigationPatterns.VIEW_SELECTORS.ORARIO
      );
      await this.navigation.verifyViewActive(NavigationPatterns.VIEW_SELECTORS.ORARIO);
    });

    await test.step('Navigate to Progetta', async () => {
      await this.navigation.navigateToView(
        NavigationPatterns.PROGETTA,
        NavigationPatterns.VIEW_SELECTORS.PROGETTA
      );
      await this.navigation.verifyViewActive(NavigationPatterns.VIEW_SELECTORS.PROGETTA);
    });

    await test.step('Cascade navigation: Progetta → Knowledge Base', async () => {
      await this.navigation.navigateCascade([
        {
          button: NavigationPatterns.PROGETTA,
          expectedSelector: NavigationPatterns.VIEW_SELECTORS.PROGETTA
        },
        {
          button: NavigationPatterns.KNOWLEDGE_BASE,
          expectedSelector: NavigationPatterns.VIEW_SELECTORS.KNOWLEDGE_BASE
        }
      ]);
    });

    await test.step('Verify cascade navigation completed', async () => {
      await this.navigation.verifyViewActive(NavigationPatterns.VIEW_SELECTORS.KNOWLEDGE_BASE);
    });
  }

  /**
   * Test interazioni comuni con framework SPA
   */
  async testCommonInteractions() {
    await test.step('Setup SPA test environment', async () => {
      await this.setup();
    });

    await test.step('Navigate to Settings', async () => {
      await this.navigation.navigateToView(
        NavigationPatterns.SETTINGS,
        NavigationPatterns.VIEW_SELECTORS.SETTINGS
      );
    });

    await test.step('Interact with form elements', async () => {
      // Esempio di interazione con input
      const inputSelector = 'input[name="setting-name"], [data-testid="setting-input"]';
      await this.interaction.typeText(inputSelector, 'Test Setting Value');

      // Esempio di clic su pulsante
      const saveButton = 'button:has-text("Salva"), [data-testid="save-button"]';
      await this.interaction.clickAndWait(saveButton);
    });

    await test.step('Verify interaction results', async () => {
      // Verifica che il setting sia stato salvato
      await this.page.waitForSelector('[data-testid="success-message"], .success');
    });
  }
}

test.describe('SPA Navigation Framework Examples', () => {
  let suite: DocenteDocTestSuite;

  test.beforeEach(async ({ page }) => {
    suite = new DocenteDocTestSuite(page);
  });

  test('Basic SPA Navigation with Framework', async () => {
    await suite.testBasicNavigation();
  });

  test('Common SPA Interactions with Framework', async () => {
    await suite.testCommonInteractions();
  });

  test('Debug Navigation State', async ({ page }) => {
    const debug = new SPADebugHelper(page);
    await page.goto('http://localhost:5173');

    await debug.logNavigationState();
    await debug.captureDebugScreenshot('spa-navigation-state');
  });
});