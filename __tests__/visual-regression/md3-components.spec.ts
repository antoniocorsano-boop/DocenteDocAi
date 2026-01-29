/**
 * MD3 Component Visual Regression Tests
 *
 * Tests individual MD3 components for visual consistency
 * during token-driven changes. Ensures no hardcoded values
 * are introduced while maintaining visual stability.
 */

import { test, expect } from '@playwright/test';
import {
  MD3_VISUAL_CONFIG,
  waitForMD3Stabilization,
  applyConsistentTheme,
  validateMD3Compliance
} from './config/md3-visual-config';

// Test components that use MD3 tokens
const MD3_COMPONENTS = [
  'M3Button',
  'M3Card',
  'M3TextField',
  'M3Chip',
  'M3Dialog',
  'M3Drawer',
  'M3Fab',
  'M3List',
  'M3Menu',
  'M3NavigationBar',
  'M3Sheet',
  'M3Snackbar',
  'M3Switch',
  'M3Tab',
  'M3TopAppBar'
];

// Test semantic token variations
const SEMANTIC_VARIATIONS = [

  'hover',
  'focus',
  'active',
  'disabled',
  'error',
  'success'
];

test.describe('MD3 Component Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport
    await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);

    // Apply consistent theme
    await applyConsistentTheme(page);

    // Wait for MD3 stabilization
    await waitForMD3Stabilization(page);
  });

  // Test each MD3 component
  MD3_COMPONENTS.forEach(componentName => {
    test.describe(`${componentName}`, () => {
      test('default state', async ({ page }) => {
        // Navigate to component test page
        await page.goto(`/md3-test-harness.html?component=${componentName}&variant=default`);

        // Validate MD3 compliance
        const compliance = await validateMD3Compliance(page);
        expect(compliance.compliance).toBe(true);
        expect(compliance.md3Tokens).toBeGreaterThan(0);

        // Take screenshot with strict threshold
        await expect(page).toHaveScreenshot(`${componentName}-default.png`, {
          threshold: MD3_VISUAL_CONFIG.thresholds.component,
          ...MD3_VISUAL_CONFIG.screenshot
        });
      });

      // Test semantic variations
      SEMANTIC_VARIATIONS.forEach(variation => {
        test(`${variation} state`, async ({ page }) => {
          await page.goto(`/md3-test-harness.html?component=${componentName}&variant=${variation}`);

          const compliance = await validateMD3Compliance(page);
          expect(compliance.compliance).toBe(true);

          await expect(page).toHaveScreenshot(`${componentName}-${variation}.png`, {
            threshold: MD3_VISUAL_CONFIG.thresholds.component,
            ...MD3_VISUAL_CONFIG.screenshot
          });
        });
      });
    });
  });

  test.describe('Semantic Token Changes', () => {
    test('spacing token updates', async ({ page }) => {
      // Test component that uses spacing tokens
      await page.goto('/md3-test-harness.html?component=M3Card&variant=spacing-test');

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);
      expect(compliance.semanticTokens).toBeGreaterThan(0);

      // Use semantic threshold for token-driven changes
      await expect(page).toHaveScreenshot('semantic-spacing-test.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.semantic,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });

    test('color token updates', async ({ page }) => {
      await page.goto('/md3-test-harness.html?component=M3Button&variant=color-test');

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('semantic-color-test.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.semantic,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });

    test('typography token updates', async ({ page }) => {
      await page.goto('/md3-test-harness.html?component=M3TextField&variant=typography-test');

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      // Use typography-specific threshold
      await expect(page).toHaveScreenshot('semantic-typography-test.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.typography,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });
  });

  test.describe('MD3 Compliance Validation', () => {
    test('no hardcoded values in components', async ({ page }) => {
      // Test all components for hardcoded value violations
      for (const componentName of MD3_COMPONENTS) {
        await page.goto(`/md3-test-harness.html?component=${componentName}&variant=default`);

        const compliance = await validateMD3Compliance(page);

        // Ensure no hardcoded values
        expect(compliance.hardcodedValues).toBe(0);

        // Ensure MD3 tokens are being used
        expect(compliance.md3Tokens + compliance.semanticTokens).toBeGreaterThan(0);
      }
    });

    test('semantic token usage', async ({ page }) => {
      await page.goto('/md3-test-harness.html?component=all&variant=semantic-demo');

      const compliance = await validateMD3Compliance(page);

      // Should have significant semantic token usage
      expect(compliance.semanticTokens).toBeGreaterThan(10);
      expect(compliance.hardcodedValues).toBe(0);
    });
  });

  test.describe('Cross-Component Consistency', () => {
    test('button variants across components', async ({ page }) => {
      await page.goto('/md3-test-harness.html?component=button-consistency');

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('button-consistency.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.component,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });

    test('spacing consistency', async ({ page }) => {
      await page.goto('/md3-test-harness.html?component=spacing-consistency');

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('spacing-consistency.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.semantic,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });
  });
});