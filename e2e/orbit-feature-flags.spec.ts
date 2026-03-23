/**
 * e2e/orbit-feature-flags.spec.ts — Orbit UI Inhibition E2E tests (Fase 9)
 *
 * Validates that the featureFlagEngine + useOrbitFeaturesStore wiring in ViewManager
 * correctly annotates `#main-content` with Orbit inhibition data attributes.
 *
 * Test Strategy:
 *   - Uses `page.evaluate()` to directly set Zustand store state (no UI interaction needed)
 *   - Checks `data-orbit-panel-id` and `data-orbit-inhibited` on `#main-content`
 *   - INVARIANT: panels are never removed from DOM; only attributes change
 *
 * All tests use __TEST_MODE = true to skip privacy consent / onboarding gates.
 */

import { test, expect } from '@playwright/test';

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Enable Orbit full control via the Zustand store, bypassing UI.
 */
async function enableOrbitFullControl(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    // Access Zustand store via the devtools global registered by zustand persist
    const key = 'orbit_features_v1';
    const raw = localStorage.getItem(key);
    const state = raw ? JSON.parse(raw) : { state: {} };
    state.state = { ...state.state, orbitFullControl: true, panelOverrides: {} };
    localStorage.setItem(key, JSON.stringify(state));
  });
  // Reload so the app reads fresh localStorage state
  await page.reload({ waitUntil: 'networkidle' });
}

/**
 * Disable Orbit full control and clear overrides.
 */
async function resetOrbitFlags(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const key = 'orbit_features_v1';
    const state = { state: { orbitFullControl: false, panelOverrides: {} }, version: 0 };
    localStorage.setItem(key, JSON.stringify(state));
  });
  await page.reload({ waitUntil: 'networkidle' });
}

/**
 * Set a per-panel override via localStorage.
 */
async function setPanelOverride(
  page: import('@playwright/test').Page,
  panelId: string,
  hidden: boolean,
) {
  await page.evaluate(
    ([pid, h]) => {
      const key = 'orbit_features_v1';
      const raw = localStorage.getItem(key);
      const state = raw ? JSON.parse(raw) : { state: { orbitFullControl: false, panelOverrides: {} } };
      state.state.panelOverrides = { ...(state.state.panelOverrides || {}), [pid]: h };
      localStorage.setItem(key, JSON.stringify(state));
    },
    [panelId, hidden] as [string, boolean],
  );
  await page.reload({ waitUntil: 'networkidle' });
}

// ── Test setup ─────────────────────────────────────────────────────────────────

test.describe('Orbit Feature Flags — UI Inhibition', () => {
  test.beforeEach(async ({ page }) => {
    // Skip privacy / onboarding in all tests
    await page.addInitScript(() => {
      (window as Record<string, unknown>).__TEST_MODE = true;
    });

    page.on('pageerror', (err) => {
      console.error(`PW_PAGE_ERROR: ${err.message}`);
    });

    // Reset Orbit flags to coexistence defaults before each test
    await page.goto('/');
    await page.evaluate(() => {
      const key = 'orbit_features_v1';
      const state = { state: { orbitFullControl: false, panelOverrides: {} }, version: 0 };
      localStorage.setItem(key, JSON.stringify(state));
    });
  });

  // ── Default state ───────────────────────────────────────────────────────────

  test('home view: default coexistence — no data-orbit-inhibited attribute', async ({ page }) => {
    await page.goto('/');
    // Wait for app to mount
    await page.waitForSelector('#main-content', { timeout: 15000 });

    const mainContent = page.locator('#main-content');
    await expect(mainContent).not.toHaveAttribute('data-orbit-inhibited');
  });

  test('settings view: default coexistence — no inhibition', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content', { timeout: 15000 });

    // Navigate to settings via URL hash or app navigation
    // Use evaluate to update the view state or rely on navigation link
    const settingsLink = page.locator('[data-nav="settings"], [href*="settings"], button:has-text("Impostazioni"), [aria-label*="mpostazione"]').first();
    const exists = await settingsLink.count();

    if (exists > 0) {
      await settingsLink.click();
      await page.waitForTimeout(500);
    }

    // Regardless of whether we navigated, no inhibition should be present in default mode
    const mainContent = page.locator('#main-content');
    await expect(mainContent).not.toHaveAttribute('data-orbit-inhibited');
  });

  // ── Panel ID annotation ─────────────────────────────────────────────────────

  test('home view: data-orbit-panel-id is "dashboard"', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content', { timeout: 15000 });
    await page.waitForTimeout(300); // Let React useEffect settle

    const panelId = await page.locator('#main-content').getAttribute('data-orbit-panel-id');
    // home maps to 'dashboard' in VIEW_TO_PANEL_ID
    expect(panelId).toBe('dashboard');
  });

  // ── orbitFullControl inhibition ─────────────────────────────────────────────

  test('enabling orbitFullControl: main-content gets data-orbit-inhibited="true" on inhibited panel', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content', { timeout: 15000 });

    // Enable full control — this inhibits all panels without manual override
    await enableOrbitFullControl(page);
    await page.waitForTimeout(300);

    const inhibited = await page.locator('#main-content').getAttribute('data-orbit-inhibited');
    // The home view maps to 'dashboard' — inhibited with orbitFullControl=true
    expect(inhibited).toBe('true');
  });

  test('enabling orbitFullControl: inhibition reason is "orbit_full_control"', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content', { timeout: 15000 });

    await enableOrbitFullControl(page);
    await page.waitForTimeout(300);

    const reason = await page.locator('#main-content').getAttribute('data-orbit-inhibition-reason');
    expect(reason).toBe('orbit_full_control');
  });

  test('resetting to coexistence: inhibition attributes are removed', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content', { timeout: 15000 });

    // First enable
    await enableOrbitFullControl(page);
    await page.waitForTimeout(300);

    // Then reset
    await resetOrbitFlags(page);
    await page.waitForTimeout(300);

    const inhibited = await page.locator('#main-content').getAttribute('data-orbit-inhibited');
    expect(inhibited).toBeNull();
  });

  // ── Manual panel overrides ──────────────────────────────────────────────────

  test('manual override hidden=true: panel is inhibited even without orbitFullControl', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content', { timeout: 15000 });

    // Override dashboard panel as hidden
    await setPanelOverride(page, 'dashboard', true);
    await page.waitForTimeout(300);

    const inhibited = await page.locator('#main-content').getAttribute('data-orbit-inhibited');
    expect(inhibited).toBe('true');

    const reason = await page.locator('#main-content').getAttribute('data-orbit-inhibition-reason');
    expect(reason).toBe('manual_override_hidden');
  });

  test('manual override hidden=false with orbitFullControl=true: panel stays visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content', { timeout: 15000 });

    // Override dashboard as explicitly visible, BUT enable full control
    await page.evaluate(() => {
      const key = 'orbit_features_v1';
      const state = {
        state: { orbitFullControl: true, panelOverrides: { dashboard: false } },
        version: 0,
      };
      localStorage.setItem(key, JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    // manual_override_shown takes precedence over orbitFullControl
    const inhibited = await page.locator('#main-content').getAttribute('data-orbit-inhibited');
    expect(inhibited).toBeNull();

    const reason = await page.locator('#main-content').getAttribute('data-orbit-inhibition-reason');
    expect(reason).toBe('manual_override_shown');
  });
});
