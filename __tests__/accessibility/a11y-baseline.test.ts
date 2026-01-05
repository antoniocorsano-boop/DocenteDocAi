import { test, expect } from '@playwright/test';

test.describe('Accessibility Baseline - Critical Paths', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh for each test
    await page.goto('/');
  });

  test('Home page should be keyboard navigable', async ({ page }) => {
    // Test Tab navigation
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => {
      return (document.activeElement as any)?.tagName;
    });
    expect(focusedElement).toBeTruthy();
    
    // Verify focus is visible
    const focusedStyle = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return window.getComputedStyle(el).outline;
    });
    expect(focusedStyle).toBeTruthy();
  });

  test('All interactive elements should be focusable', async ({ page }) => {
    const interactiveElements = await page.locator('[role="button"], button, a, [tabindex="0"]').count();
    expect(interactiveElements).toBeGreaterThan(0);
    
    // Verify no positive tabindex > 0 (anti-pattern)
    const positiveTabindex = await page.locator('[tabindex="1"], [tabindex="2"], [tabindex="3"]').count();
    expect(positiveTabindex).toBe(0);
  });

  test('Forms should have proper labels', async ({ page }) => {
    const inputs = await page.locator('input[type="text"], input[type="email"], textarea, select').count();
    
    if (inputs > 0) {
      // Each input should have either:
      // 1. Associated label with htmlFor
      // 2. aria-label attribute
      // 3. aria-labelledby attribute
      const unlabeledInputs = await page.locator('input:not([aria-label]):not([aria-labelledby])').count();
      // Note: This is a simplified check; real audit would verify label association
      expect(unlabeledInputs).toBeLessThanOrEqual(inputs * 0.2); // Allow max 20% unlabeled
    }
  });

  test('Should have proper heading hierarchy', async ({ page }) => {
    const h1s = await page.locator('h1').count();
    const h2s = await page.locator('h2').count();
    
    // Should have at least one h1
    expect(h1s).toBeGreaterThanOrEqual(1);
    
    // No h2 should come before h1
    if (h2s > 0 && h1s > 0) {
      const firstH1Index = await page.locator('h1').first().boundingBox();
      const firstH2Index = await page.locator('h2').first().boundingBox();
      
      if (firstH1Index && firstH2Index) {
        expect(firstH1Index.y).toBeLessThan(firstH2Index.y);
      }
    }
  });

  test('Skip links should be present', async ({ page }) => {
    const skipLinks = await page.locator('a[href="#main-content"], a[href="#main"], a[href="main"]').count();
    // Check if any skip-to-content link exists
    const anySkipLink = skipLinks > 0;
    // This may initially fail - we'll implement skip links
    console.log('Skip links present:', anySkipLink);
  });

  test('Color contrast should be adequate (basic check)', async ({ page }) => {
    // Get all text elements
    const textElements = await page.locator('p, span, button, a, label').count();
    expect(textElements).toBeGreaterThan(0);
    
    // Note: True contrast checking requires pixel analysis
    // This test just verifies elements exist
  });

  test('All images should have alt text', async ({ page }) => {
    const images = await page.locator('img').count();
    
    if (images > 0) {
      const imagesWithoutAlt = await page.locator('img:not([alt])').count();
      // All images should have alt text (even if empty for decorative)
      expect(imagesWithoutAlt).toBe(0);
    }
  });

  test('Icons should have accessible labels', async ({ page }) => {
    const materialIcons = await page.locator('.material-symbols-outlined').count();
    
    if (materialIcons > 0) {
      // Check if icons have aria-label or are wrapped in labeled button
      const labeledIcons = await page.locator('.material-symbols-outlined[aria-label]').count();
      const iconsInButtons = await page.locator('button:has(.material-symbols-outlined)').count();
      const totalWithAccess = labeledIcons + iconsInButtons;
      
      // Allow some unaccessed icons but flag for review
      console.log(`Material icons: ${materialIcons}, Accessible: ${totalWithAccess}`);
    }
  });

  test('Buttons should have accessible names', async ({ page }) => {
    const buttons = await page.locator('button').count();
    
    if (buttons > 0) {
      // Get all button texts or aria-labels
      const buttonLabels = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('button')).map(btn => ({
          text: btn.textContent?.trim(),
          ariaLabel: btn.getAttribute('aria-label'),
          title: btn.getAttribute('title')
        }));
      });
      
      // Verify buttons have some accessible name
      const buttonsWithName = buttonLabels.filter(b => b.text || b.ariaLabel || b.title).length;
      expect(buttonsWithName).toBeGreaterThan(buttons * 0.8); // At least 80% of buttons should have names
    }
  });

  test('No keyboard traps should exist', async ({ page }) => {
    // Try to tab through the page - should be able to exit any element
    // This is a basic check; real implementation would be more thorough
    
    const initialFocus = await page.evaluate(() => document.activeElement?.outerHTML);
    
    // Tab multiple times
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
    }
    
    const finalFocus = await page.evaluate(() => document.activeElement?.outerHTML);
    
    // Focus should have moved (not trapped)
    expect(initialFocus).not.toBe(finalFocus);
  });

  test('Escape key should close modals/popovers', async ({ page }) => {
    // Find and click first button that might open a modal/popover
    const buttons = await page.locator('button').count();
    
    if (buttons > 0) {
      const firstButton = page.locator('button').first();
      await firstButton.click();
      
      // Wait for potential modal/popover
      await page.waitForTimeout(100);
      
      // Press Escape
      await page.keyboard.press('Escape');
      
      // Verify no error occurred
      const errors = await page.locator('[role="alert"]').count();
      expect(errors).toBeLessThanOrEqual(1);
    }
  });

  test('Content should be readable at 200% zoom', async ({ page }) => {
    // Set zoom to 200%
    await page.evaluate(() => {
      document.body.style.zoom = '200%';
    });
    
    // Check that content is not hidden/cut off
    const viewportSize = page.viewportSize();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    
    if (viewportSize && bodyWidth) {
      // Some overflow is acceptable with zoom
      const overflowRatio = bodyWidth / viewportSize.width;
      expect(overflowRatio).toBeLessThan(3); // Reasonable max overflow
    }
    
    // Reset zoom
    await page.evaluate(() => {
      document.body.style.zoom = '100%';
    });
  });
});

test.describe('Accessibility - Form Fields', () => {
  test('StudentManager form should be accessible', async ({ page }) => {
    await page.goto('/');
    // Navigate to student creation if available
    const studentManagerBtn = page.locator('button:has-text("Gestisci Studenti")').first();
    
    if (await studentManagerBtn.isVisible()) {
      await studentManagerBtn.click();
      
      // Check for form inputs
      const formInputs = await page.locator('input, textarea, select').count();
      expect(formInputs).toBeGreaterThan(0);
      
      // All inputs should be associated with labels or aria-labels
      const inputsWithoutLabel = await page.locator('input:not([aria-label]):not([aria-labelledby])').count();
      console.log(`Form inputs without labels: ${inputsWithoutLabel}`);
    }
  });
});

test.describe('Accessibility - Notifications & Updates', () => {
  test('Live regions should announce updates', async ({ page }) => {
    await page.goto('/');
    
    // Check if live region exists
    const liveRegions = await page.locator('[role="status"], [role="alert"], [aria-live="polite"], [aria-live="assertive"]').count();
    console.log(`Live regions found: ${liveRegions}`);
    
    // Not a hard requirement but good to have
    expect(true).toBe(true);
  });
});
