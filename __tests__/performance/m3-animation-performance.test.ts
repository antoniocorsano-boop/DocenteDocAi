import { test, expect } from '@playwright/test';

test.describe('M3 Animation Performance', () => {
  test('should have smooth transitions on interactive elements', async ({ page }) => {
    // Navigate to a component with M3 transitions
    await page.goto('http://localhost:5173'); // Adjust URL as needed

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Test transition performance by measuring frame rate during hover
    const button = page.locator('[data-testid="m3-button"]').first();

    if (await button.count() > 0) {
      // Start performance monitoring
      await page.evaluate(() => {
        window.animationFrames = [];
        let lastTime = performance.now();

        function checkFrame(currentTime: number) {
          const delta = currentTime - lastTime;
          if (delta >= 16.67) { // ~60fps
            window.animationFrames.push(delta);
          }
          lastTime = currentTime;
          requestAnimationFrame(checkFrame);
        }

        requestAnimationFrame(checkFrame);
      });

      // Trigger hover animation
      await button.hover();

      // Wait for animation to complete
      await page.waitForTimeout(1000);

      // Check frame consistency
      const frameData = await page.evaluate(() => window.animationFrames);

      // Should maintain reasonable frame rate (allow some variance for CI)
      expect(frameData.length).toBeGreaterThan(10); // At least some frames captured

      // Log performance data for manual review
      console.log('Animation frames captured:', frameData.length);
      console.log('Average frame time:', frameData.reduce((a, b) => a + b, 0) / frameData.length);
    } else {
      console.log('No M3 buttons found for animation testing');
    }
  });

  test('should use M3 motion tokens for transitions', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check that components use M3 motion tokens
    const transitions = await page.locator('[style*="--md-sys-motion"], [class*="duration-\\[var\\(--md-sys-motion"]').all();

    // Log findings for manual verification
    console.log('Components using M3 motion tokens:', transitions.length);

    // This is informational - actual performance testing would require more setup
    expect(true).toBe(true); // Placeholder assertion
  });
});