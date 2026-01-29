# MD3 Visual Regression Testing Strategy

## Overview

**MD3 Visual Regression Testing** provides automated visual validation for MD3 Gold compliance, ensuring that token-driven changes don't introduce unintended visual regressions while supporting legitimate MD3 refactors.

### Architecture

```
┌─────────────────┐
│   MD3 Tokens    │ ← System of truth (--md-sys-*)
│                 │
└─────────────────┘
        ↓
┌─────────────────┐
│ Visual Baseline │ ← Approved snapshots (token-driven)
│   (Snapshots)   │
└─────────────────┘
        ↓
┌─────────────────┐
│   Test Runner   │ ← Playwright + custom MD3 logic
│                 │
└─────────────────┘
        ↓
┌─────────────────┐
│   CI Pipeline   │ ← Non-blocking validation
│                 │
└─────────────────┘
```

---

## 1. Component-Level Visual Testing

### Test Structure

Create `__tests__/visual-regression/md3-components.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { MD3_VISUAL_CONFIG } from './config/md3-visual-config';

test.describe('MD3 Component Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure consistent MD3 theme loading
    await page.addStyleTag({
      content: MD3_VISUAL_CONFIG.consistentTheme
    });

    // Set deterministic viewport
    await page.setViewportSize(MD3_VISUAL_CONFIG.viewport);
  });

  // Test individual components in isolation
  test('M3Button - All Variants', async ({ page }) => {
    await page.goto('/md3-test-harness');

    // Wait for MD3 tokens to load
    await page.waitForFunction(() => {
      return window.getComputedStyle(document.documentElement)
        .getPropertyValue('--md-sys-color-primary') !== '';
    });

    // Capture button variants
    await expect(page.locator('[data-md3-test="button-variants"]'))
      .toHaveScreenshot('m3-button-all-variants.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.component
      });
  });

  // Test semantic token usage
  test('Semantic Token Components', async ({ page }) => {
    await page.goto('/semantic-token-showcase');

    await expect(page.locator('[data-semantic-test="spacing-demo"]'))
      .toHaveScreenshot('semantic-spacing-demo.png', {
        threshold: MD3_VISUAL_CONFIG.thresholds.semantic
      });
  });
});
```

### Configuration File

Create `__tests__/visual-regression/config/md3-visual-config.ts`:

```typescript
export const MD3_VISUAL_CONFIG = {
  // Consistent viewport for all tests
  viewport: { width: 1280, height: 720 },

  // Visual diff thresholds (percentage)
  thresholds: {
    component: 0.001,    // 0.1% - very strict for components
    semantic: 0.005,     // 0.5% - slightly lenient for semantic changes
    page: 0.01          // 1.0% - more lenient for full pages
  },

  // Consistent theme loading
  consistentTheme: `
    :root {
      /* Force light mode for consistent testing */
      --md-sys-color-background: #FEF7FF;
      --md-sys-color-on-background: #1D1B20;
      color-scheme: light;
    }
  `,

  // MD3-aware selectors
  selectors: {
    md3Components: '[class*="m3-"], [data-md3]',
    semanticTokens: '[style*="--app-"]',
    tokenDriven: ':not([style*="px"]):not([style*="rem"]):not([style*="em"])'
  }
};
```

---

## 2. Critical Screens Testing

### Screen Categories

```typescript
// __tests__/visual-regression/md3-screens.spec.ts

test.describe('MD3 Critical Screens', () => {
  test('Home Dashboard - MD3 Compliance', async ({ page }) => {
    await page.goto('/');

    // Wait for critical MD3 elements
    await page.waitForSelector('[data-md3-critical="dashboard"]');

    // Verify semantic token usage
    const semanticElements = await page.locator('[style*="--app-"]').count();
    expect(semanticElements).toBeGreaterThan(10); // Minimum semantic usage

    await expect(page).toHaveScreenshot('home-dashboard-md3.png', {
      threshold: MD3_VISUAL_CONFIG.thresholds.page,
      fullPage: true
    });
  });

  test('Form Components - Token Consistency', async ({ page }) => {
    await page.goto('/forms-demo');

    // Verify no hardcoded values
    const hardcodedElements = await page.locator('[style*="px"], [style*="rem"], [style*="em"]').count();
    expect(hardcodedElements).toBe(0);

    await expect(page.locator('[data-form-section]'))
      .toHaveScreenshot('forms-token-consistency.png');
  });
});
```

### Test Harness Page

Create `public/md3-test-harness.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MD3 Test Harness</title>
  <link rel="stylesheet" href="/src/global.css">
</head>
<body>
  <div data-md3-test="button-variants">
    <!-- M3Button variants for visual testing -->
    <button class="m3-button m3-button-filled">Filled</button>
    <button class="m3-button m3-button-outlined">Outlined</button>
    <button class="m3-button m3-button-text">Text</button>
  </div>

  <div data-semantic-test="spacing-demo">
    <!-- Semantic token demonstration -->
    <div style="padding: var(--app-spacing-container); margin-bottom: var(--app-spacing-element);">
      <h1 style="font-size: var(--app-text-title);">Semantic Spacing Demo</h1>
      <p style="font-size: var(--app-text-body);">This demonstrates semantic token usage.</p>
    </div>
  </div>
</body>
</html>
```

---

## 3. Visual Diff Governance Rules

### Acceptable Visual Changes

#### ✅ ALLOWED: MD3 Token-Driven Changes
```typescript
// These changes are expected and acceptable:
const ACCEPTABLE_CHANGES = {
  // Spacing adjustments via token changes
  spacing: 'var(--md-sys-spacing-4) → var(--md-sys-spacing-5)',

  // Typography scale updates
  typography: 'var(--md-sys-typescale-body-large) → var(--md-sys-typescale-body-medium)',

  // Motion timing adjustments
  motion: 'var(--md-sys-motion-duration-medium) → var(--md-sys-motion-duration-short)',

  // Semantic token mapping changes
  semantic: 'var(--app-spacing-container) → var(--md-sys-spacing-6)',

  // Color token updates (theme changes)
  color: 'var(--md-sys-color-primary) → new brand color'
};
```

#### ❌ FORBIDDEN: Hardcoded Value Regressions
```typescript
// These changes indicate MD3 violations:
const FORBIDDEN_CHANGES = {
  // Introduction of hardcoded values
  hardcoded: 'var(--md-sys-spacing-4) → 16px',

  // Loss of token usage
  detokenization: 'var(--md-sys-color-primary) → #6750a4',

  // Inconsistent spacing
  inconsistency: '8px spacing → 12px spacing (without token)',

  // Layout breaks from token changes
  layoutBreak: 'Component width changes unexpectedly'
};
```

### Diff Analysis Algorithm

```typescript
function analyzeVisualDiff(diffResult: VisualDiffResult): DiffClassification {
  const { changedElements, diffPercentage } = diffResult;

  // Check for MD3 token changes (acceptable)
  if (isTokenDrivenChange(changedElements)) {
    return { type: 'ACCEPTABLE', reason: 'MD3 token update' };
  }

  // Check for hardcoded value introduction (forbidden)
  if (containsHardcodedValues(changedElements)) {
    return { type: 'FORBIDDEN', reason: 'Hardcoded value regression' };
  }

  // Check diff threshold
  if (diffPercentage > MD3_VISUAL_CONFIG.thresholds.page) {
    return { type: 'REVIEW_REQUIRED', reason: 'Large unexpected change' };
  }

  return { type: 'UNKNOWN', reason: 'Manual review needed' };
}

function isTokenDrivenChange(elements: Element[]): boolean {
  return elements.every(el => {
    const styles = getComputedStyle(el);
    // Check if all changed properties use MD3 tokens
    return Object.keys(styles).every(prop =>
      styles[prop].includes('var(--md-sys-') ||
      styles[prop].includes('var(--app-)')
    );
  });
}
```

---

## 4. CI Integration Strategy

### Non-Blocking CI Pipeline

Update `.github/workflows/md3-visual-gate.yml`:

```yaml
name: MD3 Visual Regression Gate

on:
  pull_request:
    branches: [main, develop]
    paths:
      - 'src/**/*.tsx'
      - 'src/**/*.ts'
      - 'src/**/*.css'
      - 'src/design-system/**'

jobs:
  md3-visual-regression:
    name: MD3 Visual Regression
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🏗️ Build application
        run: npm run build

      - name: 📸 Run MD3 Visual Tests
        id: visual-tests
        run: |
          npm run test:visual
        continue-on-error: true

      - name: 🔍 Analyze Visual Diffs
        if: always()
        run: |
          # Analyze visual diff results
          node scripts/analyze-md3-visual-diffs.js
        continue-on-error: true

      - name: 📊 Generate Visual Report
        if: always()
        run: |
          echo "## 🎨 MD3 Visual Regression Report" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY

          if [ "${{ steps.visual-tests.outcome }}" == "success" ]; then
            echo "✅ **All visual tests passed**" >> $GITHUB_STEP_SUMMARY
            echo "No MD3 visual regressions detected." >> $GITHUB_STEP_SUMMARY
          else
            echo "⚠️ **Visual differences detected**" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "### Analysis Required" >> $GITHUB_STEP_SUMMARY
            echo "Please review the visual diff artifacts to determine if changes are:" >> $GITHUB_STEP_SUMMARY
            echo "- ✅ **Acceptable**: MD3 token updates" >> $GITHUB_STEP_SUMMARY
            echo "- ❌ **Forbidden**: Hardcoded value regressions" >> $GITHUB_STEP_SUMMARY
            echo "- 🤔 **Review Needed**: Unexpected changes" >> $GITHUB_STEP_SUMMARY
          fi

      - name: 📤 Upload Visual Diffs
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diffs-${{ github.run_id }}
          path: |
            __tests__/visual-regression/**/*.png
            test-results/
          retention-days: 30

  # Separate job for MD3 compliance check
  md3-compliance-check:
    name: MD3 Compliance Check
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🔍 Run MD3 Compliance Scan
        run: |
          # This WILL fail the pipeline on MD3 violations
          npm run lint
          npx eslint src/ --max-warnings 0

      - name: ✅ MD3 Compliance Verified
        run: |
          echo "🔒 MD3 Gold compliance confirmed"
```

### Analysis Script

Create `scripts/analyze-md3-visual-diffs.js`:

```javascript
const fs = require('fs');
const path = require('path');

function analyzeVisualDiffs() {
  const testResultsDir = 'test-results';
  const visualResults = JSON.parse(
    fs.readFileSync(path.join(testResultsDir, 'results.json'), 'utf8')
  );

  let acceptableChanges = 0;
  let forbiddenChanges = 0;
  let reviewNeeded = 0;

  visualResults.suites.forEach(suite => {
    suite.specs.forEach(spec => {
      spec.tests.forEach(test => {
        if (test.results[0]?.status === 'failed') {
          const classification = classifyVisualDiff(test);
          switch (classification.type) {
            case 'ACCEPTABLE':
              acceptableChanges++;
              break;
            case 'FORBIDDEN':
              forbiddenChanges++;
              break;
            default:
              reviewNeeded++;
          }
        }
      });
    });
  });

  console.log(`Acceptable changes: ${acceptableChanges}`);
  console.log(`Forbidden changes: ${forbiddenChanges}`);
  console.log(`Review needed: ${reviewNeeded}`);

  // Exit with error if forbidden changes detected
  if (forbiddenChanges > 0) {
    console.error('❌ Forbidden visual changes detected!');
    process.exit(1);
  }
}

function classifyVisualDiff(test) {
  // Implement diff classification logic
  // This would analyze the actual visual diff data
  return { type: 'REVIEW_NEEDED' };
}

analyzeVisualDiffs();
```

---

## 5. Environment Determinism

### Consistent Test Environment

```typescript
// __tests__/visual-regression/config/test-environment.ts

export const TEST_ENVIRONMENT = {
  // Fixed viewport for consistency
  viewport: { width: 1280, height: 720 },

  // Consistent browser settings
  browser: {
    headless: true,
    args: [
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  },

  // Font loading strategy
  fonts: {
    waitForFonts: true,
    fontDisplay: 'swap'
  },

  // MD3 theme stabilization
  theme: {
    waitForTokens: `
      () => {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        return styles.getPropertyValue('--md-sys-color-primary') !== '';
      }
    `,
    stabilizationDelay: 1000
  }
};
```

### Cross-Environment Consistency

```bash
# CI environment variables for consistent testing
export PW_BASE_URL=http://localhost:5173
export MD3_VISUAL_STABLE=true
export FONT_LOADING=deterministic
export THEME_LOADING=synchronous
```

---

## 6. Governance Workflow

### For Developers

1. **Before Committing**: Run local visual tests
   ```bash
   npm run test:visual
   ```

2. **On Visual Diffs**: Classify changes
   - Token updates → Accept
   - Hardcoded values → Reject
   - Unexpected → Review with team

3. **Updating Baselines**: Only for approved MD3 changes
   ```bash
   npm run test:visual:update
   ```

### For CI/CD

1. **PR Validation**: Non-blocking visual checks
2. **Merge Gate**: MD3 compliance blocking
3. **Release**: Full visual regression suite

### Quality Gates

- **Unit Tests**: MD3 token validation
- **Integration Tests**: Component rendering
- **Visual Tests**: Appearance validation
- **E2E Tests**: User journey validation

---

## Tooling Recommendations

### Primary Tools
- **Playwright**: Visual regression testing
- **Custom MD3 Logic**: Token-aware diff analysis
- **GitHub Actions**: CI integration

### Supporting Tools
- **Chromium/Puppeteer**: Headless browser consistency
- **Docker**: Environment standardization
- **Visual Diff Tools**: For manual review

### Configuration Files
- `playwright.visual.config.ts`: Test runner config
- `MD3_VISUAL_CONFIG`: MD3-specific settings
- `test-environment.ts`: Environment consistency

This strategy ensures visual regression testing supports MD3 evolution while preventing hardcoded value regressions, maintaining full MD3 Gold compliance.</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\MD3_VISUAL_REGRESSION_STRATEGY.md