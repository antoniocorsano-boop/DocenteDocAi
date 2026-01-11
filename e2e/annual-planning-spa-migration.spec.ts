/**
 * Annual Planning Test - Migrato ai Pattern SPA
 * Dimostra come applicare i nuovi utility SPA ai test esistenti
 */

import { test, expect } from '@playwright/test';
import {
  SPATestSuite,
  NavigationPatterns,
  SPADebugHelper
} from './utils/spa-test-utils';

class AnnualPlanningTestSuite extends SPATestSuite {
  protected debug: SPADebugHelper;

  constructor(page: any) {
    super(page);
    this.debug = new SPADebugHelper(page);
  }

  /**
   * Test migrato che usa i pattern SPA invece dei vecchi pattern MPA
   */
  async testAnnualPlanningWizardSPA() {
    await test.step('Setup SPA test environment', async () => {
      await this.setup();
    });

    await test.step('Navigate to Progettazione using SPA patterns', async () => {
      // Usa il nuovo helper di navigazione SPA invece di safeClick
      await this.navigation.navigateToView(
        NavigationPatterns.PROGETTA,
        NavigationPatterns.VIEW_SELECTORS.PROGETTA
      );

      // Verifica che siamo nella vista corretta
      await expect(this.page.getByText('Progettazione', { exact: true })).toBeVisible();
    });

    await test.step('Open Annual Planning Wizard', async () => {
      // Usa gli helper di interazione SPA invece di safeClick
      await this.interaction.clickAndWait(
        this.page.getByText('Wizard Annuale'),
        { waitForStable: true }
      );

      await expect(this.page.getByText('Progettazione Annuale Guidata')).toBeVisible();
    });

    await test.step('Complete wizard step 1 - Academic Year', async () => {
      // Seleziona anno accademico
      await this.interaction.clickAndWait(
        this.page.getByText('2024/2025'),
        { waitForStable: true }
      );

      // Procedi al passo successivo
      await this.interaction.clickAndWait(
        this.page.getByText('Continua'),
        { waitForStable: true }
      );
    });

    await test.step('Complete wizard step 2 - Subject Selection', async () => {
      // Seleziona una materia (esempio)
      await this.interaction.clickAndWait(
        this.page.getByText('Matematica'),
        { waitForStable: true }
      );

      // Procedi
      await this.interaction.clickAndWait(
        this.page.getByText('Continua'),
        { waitForStable: true }
      );
    });

    await test.step('Complete wizard step 3 - Class Selection', async () => {
      // Seleziona una classe
      await this.interaction.clickAndWait(
        this.page.getByText('1A'),
        { waitForStable: true }
      );

      // Finalizza wizard
      await this.interaction.clickAndWait(
        this.page.getByText('Crea Programmazione'),
        { waitForStable: true }
      );
    });

    await test.step('Verify wizard completion', async () => {
      // Verifica che il wizard sia completato e siamo tornati alla vista principale
      await expect(this.page.getByText('Programmazione Annuale Completata')).toBeVisible();

      // Verifica che possiamo navigare altrove (SPA ancora funzionante)
      await this.navigation.navigateToView(
        NavigationPatterns.ORARIO,
        NavigationPatterns.VIEW_SELECTORS.ORARIO
      );
    });
  }

  /**
   * Test di debug per verificare stato navigazione durante sviluppo
   */
  async debugNavigationState() {
    await test.step('Load app and check navigation state', async () => {
      await this.page.goto('http://localhost:5173');
      await this.page.waitForLoadState('domcontentloaded');

      await this.debug.logNavigationState();
      await this.debug.captureDebugScreenshot('annual-planning-navigation-state');
    });
  }
}

test.describe('DocenteDoc AI - Annual Planning Wizard (SPA Patterns)', () => {
  let suite: AnnualPlanningTestSuite;

  test.beforeEach(async ({ page }) => {
    suite = new AnnualPlanningTestSuite(page);
  });

  test('Complete Annual Planning Wizard with SPA Patterns', async () => {
    await suite.testAnnualPlanningWizardSPA();
  });

  test('Debug Navigation State for Annual Planning', async () => {
    await suite.debugNavigationState();
  });
});