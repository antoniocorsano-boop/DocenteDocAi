import { test, expect } from '@playwright/test';

test.describe('M3 Responsive Compatibility', () => {
  test('M3Button should be responsive across breakpoints', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.goto('http://localhost:5173');

    // Test mobile layout
    const mobileButton = page.locator('[data-testid="m3-button"]').first();
    if (await mobileButton.count() > 0) {
      await expect(mobileButton).toBeVisible();
      const mobileBox = await mobileButton.boundingBox();
      expect(mobileBox?.width).toBeLessThan(375); // Should fit mobile screen
    }

    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    const tabletButton = page.locator('[data-testid="m3-button"]').first();
    if (await tabletButton.count() > 0) {
      await expect(tabletButton).toBeVisible();
      const tabletBox = await tabletButton.boundingBox();
      expect(tabletBox?.width).toBeLessThan(768);
    }

    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    const desktopButton = page.locator('[data-testid="m3-button"]').first();
    if (await desktopButton.count() > 0) {
      await expect(desktopButton).toBeVisible();
    }
  });

  test('M3Card should maintain proportions across breakpoints', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173');

    // Test card responsiveness
    const cards = page.locator('[data-testid*="card"], .card, [class*="card"]').all();
    for (const card of await cards) {
      const box = await card.boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(375);
        expect(box.height).toBeGreaterThan(50); // Minimum usable height
      }
    }
  });

  test('M3Form elements should be touch-friendly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173');

    // Test form inputs are touch-friendly (minimum var(--app-spacing-touch) touch target)
    const inputs = page.locator('input, textarea, select, button').all();
    for (const input of await inputs) {
      const box = await input.boundingBox();
      if (box && box.width > 0 && box.height > 0) {
        expect(box.height).toBeGreaterThanOrEqual(44); // WCAG touch target
      }
    }
  });

  test('M3 components should not overflow containers', async ({ page }) => {
    // Test various breakpoints
    const breakpoints = [
      { width: 320, height: 568 }, // Small mobile
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1024, height: 768 }, // Small desktop
      { width: 1920, height: 1080 } // Large desktop
    ];

    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.goto('http://localhost:5173');

      // Check for horizontal overflow
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      expect(bodyBox?.width).toBeLessThanOrEqual(breakpoint.width);

      // Check for M3 components overflow
      const m3Components = page.locator('[class*="m3"], [data-testid*="m3"]').all();
      for (const component of await m3Components) {
        const box = await component.boundingBox();
        if (box) {
          expect(box.x + box.width).toBeLessThanOrEqual(breakpoint.width);
        }
      }
    }
  });
});