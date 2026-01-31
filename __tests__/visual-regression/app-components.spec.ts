/**
 * DocenteDoc AI App Components Visual Regression Tests
 *
 * Tests the newly implemented components from Phase 2:
 * - Card component with variants and loading states
 * - Navigation component with keyboard navigation
 * - Home component with real-time features
 * - Header component with logout functionality
 *
 * Creates baseline snapshots to prevent visual regressions
 * during future MD3 token updates.
 */

import { test, expect } from '@playwright/test';
import {
  MD3_VISUAL_CONFIG,
  waitForMD3Stabilization,
  applyConsistentTheme,
  validateMD3Compliance
} from './config/md3-visual-config';

// Test our app's critical components implemented in Phase 2
const APP_COMPONENTS = [
  {
    name: 'Card',
    path: '/component-test-harness.html?component=Card',
    description: 'Card component with variants, loading states, and error handling'
  },
  {
    name: 'Navigation',
    path: '/component-test-harness.html?component=Navigation',
    description: 'Navigation component with keyboard navigation and badges'
  },
  {
    name: 'Home',
    path: '/component-test-harness.html?component=Home',
    description: 'Home component with real-time clock and lesson management'
  },
  {
    name: 'Header',
    path: '/component-test-harness.html?component=Header',
    description: 'Header component with logout dialog and AI indicators'
  }
];

// Test variants for each component
const COMPONENT_VARIANTS = [
  'default',
  'loading',
  'error',
  'success',
  'hover',
  'focus',
  'active'
];

test.describe('DocenteDoc AI App Components Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for component testing
    await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);

    // Apply consistent theme
    await applyConsistentTheme(page);

    // Wait for MD3 stabilization
    await waitForMD3Stabilization(page);
  });

  // Test each app component
  APP_COMPONENTS.forEach(component => {
    test.describe(`${component.name} Component`, () => {
      test('default state', async ({ page }) => {
        // Navigate to component test page
        await page.goto(component.path);

        // Validate MD3 compliance
        const compliance = await validateMD3Compliance(page);
        expect(compliance.compliance).toBe(true);
        expect(compliance.md3Tokens + compliance.semanticTokens).toBeGreaterThan(0);

        // Take screenshot with strict threshold
        await expect(page).toHaveScreenshot(`${component.name.toLowerCase()}-default.png`, {
          threshold: MD3_VISUAL_CONFIG.thresholds.component,
          ...MD3_VISUAL_CONFIG.screenshot
        });
      });

      // Test component variants
      COMPONENT_VARIANTS.forEach(variant => {
        test(`${component.name} ${variant} state`, async ({ page }) => {
          await page.goto(`${component.path}?variant=${variant}`);

          const compliance = await validateMD3Compliance(page);
          expect(compliance.compliance).toBe(true);

          await expect(page).toHaveScreenshot(`${component.name.toLowerCase()}-${variant}.png`, {
            threshold: MD3_VISUAL_CONFIG.thresholds.component,
            ...MD3_VISUAL_CONFIG.screenshot
          });
        });
      });
    });
  });

  test.describe('Component Integration', () => {
    test('components on dashboard page', async ({ page }) => {
      // Test components in their actual usage context
      await page.goto('/dashboard');

      await applyConsistentTheme(page);
      await waitForMD3Stabilization(page);

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      // Screenshot of dashboard with all components
      await expect(page).toHaveScreenshot('dashboard-components-integration.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.page,
        fullPage: true,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });

    test('responsive component behavior', async ({ page }) => {
      // Test components at different viewport sizes
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/dashboard');

        await applyConsistentTheme(page);
        await waitForMD3Stabilization(page);

        const compliance = await validateMD3Compliance(page);
        expect(compliance.compliance).toBe(true);

        await expect(page).toHaveScreenshot(`dashboard-${viewport.name}-responsive.png`, {
          threshold: MD3_VISUAL_CONFIG.thresholds.page,
          fullPage: true,
          ...MD3_VISUAL_CONFIG.screenshot
        });
      }
    });
  });

  test.describe('MD3 Token Compliance', () => {
    test('no hardcoded values in app components', async ({ page }) => {
      // Test all our app components for hardcoded value violations
      for (const component of APP_COMPONENTS) {
        await page.goto(component.path);

        const compliance = await validateMD3Compliance(page);

        // Ensure no hardcoded values
        expect(compliance.hardcodedValues).toBe(0);

        // Ensure MD3 tokens are being used
        expect(compliance.md3Tokens + compliance.semanticTokens).toBeGreaterThan(0);
      }
    });

    test('semantic token usage in components', async ({ page }) => {
      await page.goto('/dashboard');

      const compliance = await validateMD3Compliance(page);

      // Should have significant semantic token usage
      expect(compliance.semanticTokens).toBeGreaterThan(5);
      expect(compliance.hardcodedValues).toBe(0);
    });
  });

  test.describe('Interactive States', () => {
    test('card hover and focus states', async ({ page }) => {
      await page.goto('/components/card');

      // Test hover state
      await page.hover('[data-testid="card"]');
      await page.waitForTimeout(200);

      const hoverCompliance = await validateMD3Compliance(page);
      expect(hoverCompliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('card-hover-state.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.component,
        ...MD3_VISUAL_CONFIG.screenshot
      });

      // Test focus state
      await page.focus('[data-testid="card"]');
      await page.waitForTimeout(200);

      const focusCompliance = await validateMD3Compliance(page);
      expect(focusCompliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('card-focus-state.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.component,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });

    test('navigation keyboard interaction', async ({ page }) => {
      await page.goto('/components/navigation');

      // Test keyboard navigation
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('navigation-keyboard-focus.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.component,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });

    test('header logout interaction', async ({ page }) => {
      await page.goto('/components/header');

      // Click logout button to open dialog
      await page.click('[data-testid="logout-button"]');
      await page.waitForTimeout(500);

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('header-logout-dialog.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.component,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });
  });
});