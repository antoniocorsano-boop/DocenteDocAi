// @ts-nocheck
/**
 * MD3 Critical Screens Visual Regression Tests
 *
 * Tests complete application screens for visual consistency
 * during MD3 token updates. Focuses on user-critical flows
 * and layouts that must remain stable.
 */

import { test, expect } from '@playwright/test';
import {
  MD3_VISUAL_CONFIG,
  waitForMD3Stabilization,
  applyConsistentTheme,
  validateMD3Compliance
} from './config/md3-visual-config';

// Critical user flows that must remain visually stable
const CRITICAL_SCREENS = [
  {
    name: 'landing-page',
    path: '/',
    description: 'Main landing page with hero section'
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    description: 'User dashboard with key metrics'
  },
  {
    name: 'profile-settings',
    path: '/settings/profile',
    description: 'User profile configuration'
  },
  {
    name: 'document-editor',
    path: '/editor',
    description: 'Document editing interface'
  },
  {
    name: 'search-results',
    path: '/search?q=test',
    description: 'Search results page'
  },
  {
    name: 'onboarding-flow',
    path: '/onboarding/step-1',
    description: 'User onboarding first step'
  }
];

// Screen size variations for responsive testing
const VIEWPORT_VARIATIONS = [
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

test.describe('MD3 Critical Screens Visual Regression', () => {
  // Test each critical screen
  CRITICAL_SCREENS.forEach(screen => {
    test.describe(`${screen.name}`, () => {
      test('desktop layout', async ({ page }) => {
        // Set desktop viewport
        await page.setViewportSize(VIEWPORT_VARIATIONS[0]);

        // Navigate to screen
        await page.goto(screen.path);

        // Apply consistent theme and wait for stabilization
        await applyConsistentTheme(page);
        await waitForMD3Stabilization(page);

        // Validate MD3 compliance
        const compliance = await validateMD3Compliance(page);
        expect(compliance.compliance).toBe(true);

        // Take full page screenshot
        await expect(page).toHaveScreenshot(`${screen.name}-desktop.png`, {
          threshold: MD3_VISUAL_CONFIG.thresholds.page,
          fullPage: true,
          ...MD3_VISUAL_CONFIG.screenshot
        });
      });

      // Test responsive variations
      VIEWPORT_VARIATIONS.forEach(viewport => {
        test(`${viewport.name} layout`, async ({ page }) => {
          await page.setViewportSize(viewport);

          await page.goto(screen.path);
          await applyConsistentTheme(page);
          await waitForMD3Stabilization(page);

          const compliance = await validateMD3Compliance(page);
          expect(compliance.compliance).toBe(true);

          await expect(page).toHaveScreenshot(`${screen.name}-${viewport.name}.png`, {
            threshold: MD3_VISUAL_CONFIG.thresholds.page,
            fullPage: true,
            ...MD3_VISUAL_CONFIG.screenshot
          });
        });
      });
    });
  });

  test.describe('Theme Consistency', () => {
    test('light theme baseline', async ({ page }) => {
      await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);

      // Force light theme
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/dashboard');

      await applyConsistentTheme(page);
      await waitForMD3Stabilization(page);

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('theme-light-baseline.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.page,
        fullPage: true,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });

    test('consistent theming across screens', async ({ page }) => {
      await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);

      // Test multiple screens for theme consistency
      const screensToTest = ['/', '/dashboard', '/settings/profile'];

      for (const screenPath of screensToTest) {
        await page.goto(screenPath);
        await applyConsistentTheme(page);
        await waitForMD3Stabilization(page);

        const compliance = await validateMD3Compliance(page);
        expect(compliance.compliance).toBe(true);

        // Take screenshot for comparison
        await expect(page).toHaveScreenshot(`theme-consistency-${screenPath.replace(/\//g, '-')}.png`, {
          threshold: MD3_VISUAL_CONFIG.thresholds.page,
          fullPage: true,
          ...MD3_VISUAL_CONFIG.screenshot
        });
      }
    });
  });

  test.describe('Interactive States', () => {
    test('form interactions', async ({ page }) => {
      await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);
      await page.goto('/settings/profile');

      await applyConsistentTheme(page);
      await waitForMD3Stabilization(page);

      // Test form field focus states
      await page.focus('input[type="text"]');
      await page.waitForTimeout(200); // Allow focus styles to apply

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('form-focus-states.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.component,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });

    test('navigation interactions', async ({ page }) => {
      await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);
      await page.goto('/dashboard');

      await applyConsistentTheme(page);
      await waitForMD3Stabilization(page);

      // Test navigation hover states
      await page.hover('nav a');
      await page.waitForTimeout(200);

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('navigation-hover-states.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.component,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });
  });

  test.describe('Content Variations', () => {
    test('empty states', async ({ page }) => {
      await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);
      await page.goto('/dashboard?empty=true');

      await applyConsistentTheme(page);
      await waitForMD3Stabilization(page);

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('empty-states.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.page,
        fullPage: true,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });

    test('loading states', async ({ page }) => {
      await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);
      await page.goto('/dashboard?loading=true');

      await applyConsistentTheme(page);
      await waitForMD3Stabilization(page);

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('loading-states.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.page,
        fullPage: true,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });

    test('error states', async ({ page }) => {
      await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);
      await page.goto('/dashboard?error=true');

      await applyConsistentTheme(page);
      await waitForMD3Stabilization(page);

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);

      await expect(page).toHaveScreenshot('error-states.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.page,
        fullPage: true,
        ...MD3_VISUAL_CONFIG.screenshot
      });
    });
  });

  test.describe('Performance Impact', () => {
    test('layout stability during token updates', async ({ page }) => {
      await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);
      await page.goto('/dashboard');

      await applyConsistentTheme(page);
      await waitForMD3Stabilization(page);

      // Measure layout stability
      const layoutShifts = await page.evaluate(() => {
        let shifts = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.value > 0) shifts++;
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });

        // Trigger potential layout changes (token updates simulation)
        document.documentElement.style.setProperty('--test-token', '16px');

        return new Promise(resolve => {
          setTimeout(() => {
            observer.disconnect();
            resolve(shifts);
          }, 1000);
        });
      });

      // Layout should remain stable during token updates
      expect(layoutShifts).toBe(0);

      const compliance = await validateMD3Compliance(page);
      expect(compliance.compliance).toBe(true);
    });
  });
});
