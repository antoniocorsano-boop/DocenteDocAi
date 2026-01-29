/**
 * MD3 Visual Regression Testing Configuration
 *
 * Provides consistent, deterministic visual testing environment
 * compatible with MD3 Gold governance and semantic token layer.
 */

export const MD3_VISUAL_CONFIG = {
  // Consistent viewport for all tests (16:9 aspect ratio)
  viewport: { width: 1280, height: 720 },

  // Visual diff thresholds (percentage of pixels changed)
  thresholds: {
    // Very strict for individual components
    component: 0.001,    // 0.1% - catches even minor token changes

    // Slightly lenient for semantic token demos
    semantic: 0.005,     // 0.5% - allows for semantic relationship changes

    // More lenient for full pages (accounts for dynamic content)
    page: 0.01,          // 1.0% - balances accuracy with practicality

    // Special threshold for typography changes
    typography: 0.003    // 0.3% - typography changes are visually significant
  },

  // Consistent theme loading for deterministic results
  consistentTheme: `
    :root {
      /* Force light mode for consistent testing */
      color-scheme: light;

      /* Ensure MD3 tokens are loaded before screenshots */
      --md3-visual-test-ready: true;
    }

    /* Disable animations during visual testing */
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    /* Ensure fonts are loaded */
    * {
      font-display: swap !important;
    }
  `,

  // MD3-aware element selectors
  selectors: {
    // Components using MD3 classes or data attributes
    md3Components: '[class*="m3-"], [data-md3], [data-md3-test]',

    // Elements using semantic tokens
    semanticTokens: '[style*="--app-"]',

    // Elements using MD3 system tokens
    md3Tokens: '[style*="--md-sys-"]',

    // Token-driven elements (no hardcoded values)
    tokenDriven: ':not([style*="px"]):not([style*="rem"]):not([style*="em"]):not([style*="#"])'
  },

  // Test environment stabilization
  stabilization: {
    // Wait for MD3 tokens to be available
    waitForTokens: `
      () => {
        const root = document.documentElement;
        const styles = getComputedStyle(root);

        // Check critical MD3 tokens are loaded
        const criticalTokens = [
          '--md-sys-color-primary',
          '--md-sys-spacing-4',
          '--md-sys-typescale-body-large-font-size'
        ];

        return criticalTokens.every(token =>
          styles.getPropertyValue(token).trim() !== ''
        );
      }
    `,

    // Additional stabilization delay (ms)
    delay: 500,

    // Retry configuration
    retries: 3,
    retryDelay: 1000
  },

  // Screenshot configuration
  screenshot: {
    // Capture full page by default
    fullPage: false,

    // Omit background for consistent results
    omitBackground: false,

    // Quality setting for PNGs
    quality: 100,

    // Animation handling
    animations: 'disabled' as const,

    // Caret handling
    caret: 'hide' as const
  },

  // Browser configuration for consistency
  browser: {
    // Force consistent color profile
    colorScheme: 'light' as const,

    // Reduce motion for consistent animations
    reducedMotion: 'reduce' as const,

    // Disable hardware acceleration variations
    hardwareAcceleration: false
  }
};

/**
 * Helper function to wait for MD3 token stabilization
 */
export async function waitForMD3Stabilization(page: any): Promise<void> {
  // Wait for tokens to be available
  await page.waitForFunction(MD3_VISUAL_CONFIG.stabilization.waitForTokens);

  // Additional stabilization delay
  await page.waitForTimeout(MD3_VISUAL_CONFIG.stabilization.delay);
}

/**
 * Helper function to apply consistent theme
 */
export async function applyConsistentTheme(page: any): Promise<void> {
  await page.addStyleTag({
    content: MD3_VISUAL_CONFIG.consistentTheme
  });
}

/**
 * Helper function to validate MD3 compliance in test
 */
export async function validateMD3Compliance(page: any): Promise<{
  semanticTokens: number;
  md3Tokens: number;
  hardcodedValues: number;
  compliance: boolean;
}> {
  const result = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    let semanticTokens = 0;
    let md3Tokens = 0;
    let hardcodedValues = 0;

    allElements.forEach(el => {
      const style = getComputedStyle(el);

      // Check for semantic tokens
      if (style.cssText.includes('--app-')) {
        semanticTokens++;
      }

      // Check for MD3 system tokens
      if (style.cssText.includes('--md-sys-')) {
        md3Tokens++;
      }

      // Check for hardcoded values (violations)
      const hardcodedPatterns = [
        /\d+px/, /\d+rem/, /\d+em/, /\d+vh/, /\d+vw/, /\d+vmin/, /\d+vmax/,
        /#[0-9a-fA-F]{3,8}/, /rgb\(/, /hsl\(/
      ];

      hardcodedPatterns.forEach(pattern => {
        if (pattern.test(style.cssText)) {
          hardcodedValues++;
        }
      });
    });

    return {
      semanticTokens,
      md3Tokens,
      hardcodedValues,
      compliance: hardcodedValues === 0
    };
  });

  return result;
}