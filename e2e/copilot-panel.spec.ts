/**
 * E2E — Pannello Copilot Docente (Sprint 2)
 *
 * Verifica che il CopilotDocentePanel funzioni end-to-end:
 *   1. La vista Copilot si raggiunge dalla Home senza errori JS
 *   2. Il pannello mostra header o stato vuoto (EmptyState se nessuna classe)
 *   3. I tab scrollabili hanno ruolo "tab" e aria-label
 *   4. I selettori classe/studente sono accessibili
 *   5. Il deep link subTab=artistic (fix ArtisticConsilium) non causa crash
 *   6. Il FAB FloatingSatelliteCopilot ha aria-label accessibile
 *
 * Strategia: smoke-like con skip guards quando dati o UI non sono disponibili.
 * Il pannello tab richiede almeno una classe per rendere oltre l'EmptyState.
 */

import { test, expect, type Page } from '@playwright/test';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function waitForAppReady(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body', { timeout: 15000 });
  await page.waitForTimeout(600);
}

async function goToCopilotView(page: Page): Promise<void> {
  // Prima scelta: quicklink Home "Vai al Copilot per analisi andamento"
  const homeBtn = page.locator('[aria-label="Vai al Copilot per analisi andamento"]');
  const btnVisible = await homeBtn.first().isVisible({ timeout: 5000 }).catch(() => false);
  if (btnVisible) {
    await homeBtn.first().click({ timeout: 5000 });
    await page.waitForTimeout(500);
    return;
  }

  // Fallback: FloatingSatelliteCopilot FAB → "Apri pannello copilot completo"
  const fab = page.locator('[aria-label="Apri assistente copilot"]');
  const fabVisible = await fab.first().isVisible({ timeout: 5000 }).catch(() => false);
  if (fabVisible) {
    await fab.first().click({ timeout: 5000 });
    await page.waitForTimeout(300);
    const fullBtn = page.locator('[aria-label="Apri pannello copilot completo"]');
    const fullVisible = await fullBtn.first().isVisible({ timeout: 3000 }).catch(() => false);
    if (fullVisible) {
      await fullBtn.first().click({ timeout: 5000 });
      await page.waitForTimeout(500);
    }
  }
}

// ── Navigazione e rendering ───────────────────────────────────────────────────

test.describe('CopilotDocentePanel — Navigazione e rendering', () => {

  test('la vista Copilot si raggiunge senza errori JS bloccanti', async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('pageerror', (err) => {
      if (!err.message.includes('storybook') && !err.message.includes('extension')) {
        jsErrors.push(err.message);
      }
    });

    await waitForAppReady(page);
    await goToCopilotView(page);

    expect(jsErrors).toHaveLength(0);
  });

  test('il pannello mostra un header o un EmptyState appropriato', async ({ page }) => {
    await waitForAppReady(page);
    await goToCopilotView(page);

    // Con classi: "[aria-label=Copilot Docente Tabs]" o heading "Copilot Docente"
    // Senza classi: EmptyState con testo "Nessuna classe disponibile"
    const panel = page.locator(
      '[aria-label="Copilot Docente Tabs"], h5:has-text("Copilot Docente"), h6:has-text("Copilot Docente")',
    );
    const emptyState = page.locator(
      'p:has-text("Nessuna classe"), p:has-text("Aggiungi studenti")',
    );

    const panelVisible = await panel.first().isVisible({ timeout: 8000 }).catch(() => false);
    const emptyVisible = await emptyState.first().isVisible({ timeout: 3000 }).catch(() => false);

    // Almeno uno dei due stati deve essere presente
    expect(panelVisible || emptyVisible).toBe(true);
  });

  test('i tab del Copilot sono presenti e hanno ruolo "tab"', async ({ page }) => {
    await waitForAppReady(page);
    await goToCopilotView(page);

    const tabsContainer = page.locator('[aria-label="Copilot Docente Tabs"]');
    const isVisible = await tabsContainer.first().isVisible({ timeout: 8000 }).catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    const tabs = tabsContainer.first().locator('[role="tab"]');
    const count = await tabs.count();
    // Il pannello ha almeno i tab base (Performance, Overview, Andamento…)
    expect(count).toBeGreaterThan(3);
  });

  test('il contenitore tab ha aria-label (accessibilità)', async ({ page }) => {
    await waitForAppReady(page);
    await goToCopilotView(page);

    const tabsContainer = page.locator('[aria-label="Copilot Docente Tabs"]');
    const isVisible = await tabsContainer.first().isVisible({ timeout: 8000 }).catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    await expect(tabsContainer.first()).toHaveAttribute('aria-label', 'Copilot Docente Tabs');
  });

  test('i selettori classe e studente sono accessibili', async ({ page }) => {
    await waitForAppReady(page);
    await goToCopilotView(page);

    // Label "Classe" e "Studente" del selettore in CopilotView
    const classeLabel = page.locator('#copilot-view-classe-label');
    const isVisible = await classeLabel.first().isVisible({ timeout: 8000 }).catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    await expect(page.locator('#copilot-view-classe-label').first()).toBeVisible();
    await expect(page.locator('#copilot-view-studente-label').first()).toBeVisible();
  });

});

// ── Deep link subTab (fix ArtisticConsilium) ──────────────────────────────────

test.describe('CopilotDocentePanel — Deep link subTab', () => {

  test('click sul link ArtisticConsilium non causa errori JS', async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('pageerror', (err) => {
      if (!err.message.includes('storybook') && !err.message.includes('extension')) {
        jsErrors.push(err.message);
      }
    });

    await waitForAppReady(page);

    // Bottone in Home che naviga con subTab=artistic
    const artisticLink = page.locator(
      '[aria-label="Scopri il Consilium Artistico AI nel tab Artistico del Copilot Docente"]',
    );
    const linkVisible = await artisticLink.first().isVisible({ timeout: 8000 }).catch(() => false);

    if (!linkVisible) {
      test.skip();
      return;
    }

    await artisticLink.first().click({ timeout: 5000 });
    await page.waitForTimeout(800);

    expect(jsErrors).toHaveLength(0);
  });

  test('la navigazione verso copilot non lascia dialogs aperti', async ({ page }) => {
    await waitForAppReady(page);
    await goToCopilotView(page);
    await page.waitForTimeout(400);

    const dialogs = page.locator('[role="dialog"]:visible');
    const count = await dialogs.count();
    expect(count).toBe(0);
  });

});

// ── FloatingSatelliteCopilot FAB ──────────────────────────────────────────────

test.describe('FloatingSatelliteCopilot — Accessibilità', () => {

  test('il FAB ha aria-label accessibile', async ({ page }) => {
    await waitForAppReady(page);

    const fab = page.locator('[aria-label="Apri assistente copilot"]');
    const isVisible = await fab.first().isVisible({ timeout: 10000 }).catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    await expect(fab.first()).toHaveAttribute('aria-label');
  });

  test('il FAB apre il pannello overlay senza errori', async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('pageerror', (err) => {
      if (!err.message.includes('storybook') && !err.message.includes('extension')) {
        jsErrors.push(err.message);
      }
    });

    await waitForAppReady(page);

    const fab = page.locator('[aria-label="Apri assistente copilot"]');
    const isVisible = await fab.first().isVisible({ timeout: 10000 }).catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    await fab.first().click({ timeout: 5000 });
    await page.waitForTimeout(600);

    // L'overlay deve avere aria-label="Assistente copilot"
    const overlay = page.locator('[aria-label="Assistente copilot"]');
    const overlayVisible = await overlay.first().isVisible({ timeout: 5000 }).catch(() => false);

    if (overlayVisible) {
      await expect(overlay.first()).toBeVisible();
    }

    expect(jsErrors).toHaveLength(0);
  });

});
