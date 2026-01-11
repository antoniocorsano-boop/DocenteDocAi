# Guida al Testing E2E SPA - DocenteDoc AI

## Panoramica

Questa guida documenta le best practices per testare applicazioni React SPA (Single Page Application) con Playwright, focalizzandosi sui pattern specifici di DocenteDoc AI.

## Pattern SPA vs MPA

### ❌ Pattern MPA (Tradizionale - NON USARE)
```typescript
// Aspetta cambiamenti URL (non succede in SPA)
await page.waitForURL('**/timetable');

// Navigazione basata su reload di pagina
await page.click('button');
await page.waitForLoadState('networkidle');
```

### ✅ Pattern SPA (Corretto)
```typescript
// Aspetta cambiamenti DOM
await expect(page.locator('.timetable-view')).toBeVisible();

// Navigazione basata su stato React
await page.click('button[aria-label*="Orario"]');
await page.waitForTimeout(300); // Buffer per React rendering
```

## Utility SPA Framework

### SPANavigationHelper
Gestisce navigazione client-side con attesa DOM-based:

```typescript
import { SPANavigationHelper, NavigationPatterns } from './utils/spa-test-utils';

const navigation = new SPANavigationHelper(page);

// Navigazione semplice
await navigation.navigateToView(
  NavigationPatterns.PROGETTA,
  NavigationPatterns.VIEW_SELECTORS.PROGETTA
);

// Navigazione a cascata (Progetta → Knowledge Base)
await navigation.navigateCascade([
  { button: NavigationPatterns.PROGETTA, expectedSelector: NavigationPatterns.VIEW_SELECTORS.PROGETTA },
  { button: NavigationPatterns.KNOWLEDGE_BASE, expectedSelector: NavigationPatterns.VIEW_SELECTORS.KNOWLEDGE_BASE }
]);
```

### SPAStateHelper
Gestisce stato applicazione e setup test:

```typescript
const state = new SPAStateHelper(page);

// Setup per ogni test
await state.resetAppState();
await page.goto('http://localhost:5173');
await state.verifyLoggedInState();

// Iniezione dati test
await state.injectTestData({ user: 'test-user', demoMode: true });
```

### SPAInteractionHelper
Gestisce interazioni comuni con stabilità:

```typescript
const interaction = new SPAInteractionHelper(page);

// Click con attesa stabilità
await interaction.clickAndWait('button.save', { waitForStable: true });

// Input con debounce React
await interaction.typeText('input.name', 'Test Value', { delay: 100 });

// Aspetta elemento stabile
await interaction.waitForStableElement('.result-list');
```

## Pattern di Navigazione Comuni

### NavigationPatterns
Pattern centralizzati per tutti i test:

```typescript
// Pulsanti navigazione
NavigationPatterns.ORARIO        // /scheduleOrario|Orario|Pianifica/i
NavigationPatterns.PROGETTA      // /progetta|Progetta|Design/i
NavigationPatterns.KNOWLEDGE_BASE // /knowledge.?base|Base.?Conoscenza/i

// Selettori vista attivi
NavigationPatterns.VIEW_SELECTORS.ORARIO         // '[data-view="timetable"]'
NavigationPatterns.VIEW_SELECTORS.PROGETTA       // '[data-view="progettazione-hub"]'
NavigationPatterns.VIEW_SELECTORS.KNOWLEDGE_BASE // '[data-view="knowledge-base"]'
```

## Esempi di Test

### Test Base con Framework
```typescript
import { test } from '@playwright/test';
import { SPATestSuite, NavigationPatterns } from './utils/spa-test-utils';

class MyTestSuite extends SPATestSuite {
  async testNavigation() {
    await test.step('Setup', async () => {
      await this.setup();
    });

    await test.step('Navigate to feature', async () => {
      await this.navigation.navigateToView(
        NavigationPatterns.PROGETTA,
        NavigationPatterns.VIEW_SELECTORS.PROGETTA
      );
    });

    await test.step('Verify feature works', async () => {
      await expect(page.getByText('Progettazione')).toBeVisible();
    });
  }
}

test('My Feature Test', async ({ page }) => {
  const suite = new MyTestSuite(page);
  await suite.testNavigation();
});
```

### Test Interattivo
```typescript
await test.step('Fill form', async () => {
  await interaction.typeText('input.title', 'Test Title');
  await interaction.clickAndWait('button.submit');
  await interaction.waitForStableElement('.success-message');
});
```

## Configurazione Playwright

### Progetti Ottimizzati
```typescript
// playwright.config.ts
projects: [
  {
    name: 'chromium-stable',
    use: { ...devices['Desktop Chrome'] },
    testMatch: ['**/smoke.spec.ts'], // Test critici
  },
  {
    name: 'spa-navigation',
    use: {
      ...devices['Desktop Chrome'],
      launchOptions: {
        args: ['--disable-web-security', '--disable-background-timer-throttling']
      }
    },
    testMatch: ['**/spa-*.spec.ts'], // Test SPA framework
  }
]
```

## Best Practices

### 1. Aspetta DOM, non URL
```typescript
// ❌ SBAGLIATO
await page.click('button');
await page.waitForURL('**/new-page');

// ✅ CORRETTO
await page.click('button');
await expect(page.locator('.new-view')).toBeVisible();
```

### 2. Usa Timeout Appropriati
```typescript
// Timeout brevi per interazioni veloci
await expect(element).toBeVisible({ timeout: 5000 });

// Timeout più lunghi per navigazione complessa
await navigation.navigateToView(button, selector, { timeout: 10000 });
```

### 3. Buffer per React Rendering
```typescript
await page.click('button');
await page.waitForTimeout(300); // Lascia tempo a React di renderizzare
```

### 4. Selettori Robusti
```typescript
// Preferisci aria-label e data-testid
await page.click('[aria-label="Progettazione"]');
await expect(page.locator('[data-testid="result-list"]')).toBeVisible();

// Fallback con regex per testi variabili
await page.click('button').filter({ hasText: /scheduleOrario|Orario|Pianifica/i });
```

### 5. Test Isolati
```typescript
test.beforeEach(async ({ page }) => {
  // Reset stato per ogni test
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto('http://localhost:5173');
});
```

## Debug e Troubleshooting

### SPADebugHelper
```typescript
const debug = new SPADebugHelper(page);

// Log stato navigazione corrente
await debug.logNavigationState();

// Screenshot per debug
await debug.captureDebugScreenshot('navigation-issue');
```

### Trace Analysis
```bash
# Abilita trace per debug
npx playwright test --headed --trace on

# Visualizza trace
npx playwright show-trace trace.zip
```

## Metriche di Successo

- **Stabilità**: Tutti i test passano con `--repeat-each=3`
- **Performance**: Tempi esecuzione < 10s per test smoke
- **Affidabilità**: Zero false positive/negative
- **Manutenibilità**: Pattern riutilizzabili e documentati

## Risorse Aggiuntive

- [Playwright SPA Testing Guide](https://playwright.dev/docs/navigations)
- [React Testing Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [SPA Navigation Patterns](./utils/spa-test-utils.ts)
- [Esempi Test](./spa-framework-example.spec.ts)</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\E2E_SPA_TESTING_GUIDE.md