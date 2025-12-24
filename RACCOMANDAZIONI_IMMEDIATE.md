# 🎯 Raccomandazioni Immediate - DocenteDoc AI

**Data:** 24 Dicembre 2025  
**Priorità:** ALTA  
**Tempo Stimato:** 1-2 settimane

---

## 🚨 AZIONI URGENTI (Da fare subito)

### 1. Sanitizzazione HTML (SICUREZZA - PRIORITÀ MASSIMA)

**Problema:** 18 occorrenze di `dangerouslySetInnerHTML` senza sanitizzazione  
**Rischio:** Cross-Site Scripting (XSS)  
**Tempo:** 2 giorni

**Implementazione:**

```bash
# 1. Installare DOMPurify
npm install dompurify @types/dompurify --save
```

```typescript
// 2. Creare utility in src/utils/securityUtils.ts
import DOMPurify from 'dompurify';

/**
 * Sanitizza HTML per prevenire XSS
 * @param html - HTML grezzo da sanitizzare
 * @param allowedTags - Tag HTML permessi (default: base formatting)
 * @returns HTML sanitizzato sicuro
 */
export const sanitizeHtml = (
  html: string, 
  allowedTags?: string[]
): string => {
  const config = {
    ALLOWED_TAGS: allowedTags || ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false
  };
  
  return DOMPurify.sanitize(html, config);
};
```

```typescript
// 3. Usare in tutti i componenti
// PRIMA (NON SICURO):
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// DOPO (SICURO):
import { sanitizeHtml } from '../utils/securityUtils';

<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
```

**File da modificare:**
```bash
# Trovare tutte le occorrenze
grep -rn "dangerouslySetInnerHTML" src --include="*.tsx"
```

---

### 2. Logger Service (QUALITÀ - PRIORITÀ ALTA)

**Problema:** 85 `console.log` in produzione  
**Rischio:** Performance, debug info esposta  
**Tempo:** 1 giorno

**Implementazione:**

```typescript
// src/utils/logger.ts
const isDev = import.meta.env.DEV;
const isTest = import.meta.env.MODE === 'test';

export const logger = {
  /**
   * Log di debug (solo development)
   */
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  
  /**
   * Warning (solo development)
   */
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  
  /**
   * Error (sempre attivo, critici)
   */
  error: (...args: any[]) => {
    console.error(...args);
    // TODO: Integrare Sentry qui in futuro
  },
  
  /**
   * Info (solo development)
   */
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  }
};

// Export default per import semplificato
export default logger;
```

**Migrare il codice:**

```typescript
// PRIMA:
console.log('✅ useAppEngine OK:', result);
console.error('Error:', e);

// DOPO:
import logger from '../utils/logger';

logger.log('✅ useAppEngine OK:', result);
logger.error('Error:', e);
```

**Ricerca e sostituzione globale:**
```bash
# Trovare tutti i console.*
grep -rn "console\." src --include="*.ts" --include="*.tsx" > console_audit.txt
```

---

### 3. Migliorare Type Safety (QUALITÀ - PRIORITÀ ALTA)

**Problema:** 262 usi di `any`  
**Obiettivo:** Ridurre a <130 (-50%)  
**Tempo:** 1 settimana

**Strategia:**

#### A. Tipizzare risposte Google GenAI

```typescript
// src/types.ts - Aggiungere tipi mancanti
export interface GenAIGroundingChunk {
  web?: {
    title: string;
    uri: string;
  };
}

export interface GenAICandidate {
  groundingMetadata?: {
    groundingChunks: GenAIGroundingChunk[];
  };
}

export interface GenAIResponse {
  text: string;
  candidates?: GenAICandidate[];
}
```

```typescript
// src/services/aiService.ts - Usare tipi
// PRIMA:
response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {

// DOPO:
response.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach((chunk: GenAIGroundingChunk) => {
  if (chunk.web?.uri && chunk.web?.title) {
    sources.push({ title: chunk.web.title, uri: chunk.web.uri });
  }
});
```

#### B. Usare `unknown` invece di `any`

```typescript
// PRIMA:
const processData = (data: any) => {
  return data.value;
}

// DOPO:
const processData = (data: unknown): string => {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    const obj = data as { value: string };
    return obj.value;
  }
  throw new Error('Invalid data format');
}
```

#### C. Lazy Store Typing

```typescript
// src/stores/lazyStores.ts
// PRIMA:
let _useDataStoreInstance: any = null;

// DOPO:
import { create } from 'zustand';
import type { DataState } from './useDataStore';

type UseDataStore = ReturnType<typeof create<DataState>>;
let _useDataStoreInstance: UseDataStore | null = null;
```

---

### 4. Setup Test Base (QUALITÀ - PRIORITÀ MEDIA)

**Problema:** Test coverage <5%  
**Obiettivo Fase 1:** Raggiungere 30% (servizi + utils)  
**Tempo:** 3-4 giorni

**Implementazione:**

```typescript
// __tests__/services/aiService.test.ts
import { describe, test, expect } from 'vitest';
import { cleanAndParseJson } from '../../src/services/aiService';

describe('aiService - cleanAndParseJson', () => {
  test('should extract JSON from markdown code block', () => {
    const input = '```json\n{"key": "value"}\n```';
    const result = cleanAndParseJson(input);
    expect(result).toEqual({ key: 'value' });
  });
  
  test('should parse plain JSON', () => {
    const input = '{"key": "value"}';
    const result = cleanAndParseJson(input);
    expect(result).toEqual({ key: 'value' });
  });
  
  test('should throw error on invalid JSON', () => {
    const input = 'not json';
    expect(() => cleanAndParseJson(input)).toThrow();
  });
});
```

```typescript
// __tests__/utils/suggestionUtils.test.ts
import { describe, test, expect } from 'vitest';
import { analyzeSystemState } from '../../src/utils/suggestionUtils';

describe('suggestionUtils - analyzeSystemState', () => {
  test('should suggest initial setup when no data', () => {
    const result = analyzeSystemState({
      students: [],
      slots: {},
      udas: []
    });
    expect(result.suggestionId).toBe('initial-setup');
  });
  
  test('should suggest UDA planning when students exist', () => {
    const result = analyzeSystemState({
      students: [{ id: '1', nome: 'Test' }],
      slots: { 'slot1': {} },
      udas: []
    });
    expect(result.suggestionId).toBe('plan-uda');
  });
});
```

**Eseguire test:**
```bash
npm run test:unit
```

---

## 📋 CHECKLIST IMPLEMENTAZIONE

### Settimana 1

- [ ] **Giorno 1-2:** Sanitizzazione HTML
  - [ ] Installare DOMPurify
  - [ ] Creare `sanitizeHtml` utility
  - [ ] Trovare tutte le 18 occorrenze di `dangerouslySetInnerHTML`
  - [ ] Applicare sanitizzazione
  - [ ] Testare manualmente
  
- [ ] **Giorno 3:** Logger Service
  - [ ] Creare `src/utils/logger.ts`
  - [ ] Sostituire 20 `console.log` critici (App.tsx, useAppEngine.ts)
  - [ ] Testare in dev e production build
  
- [ ] **Giorno 4-5:** Type Safety - Fase 1
  - [ ] Creare tipi per GenAI responses
  - [ ] Refactorare `aiService.ts` (50+ any)
  - [ ] Refactorare lazy stores typing

### Settimana 2

- [ ] **Giorno 6-8:** Type Safety - Fase 2
  - [ ] Refactorare components con più `any` (top 10)
  - [ ] Sostituire `any` con `unknown` + type guards dove appropriato
  - [ ] Verificare build senza errori TypeScript
  
- [ ] **Giorno 9-10:** Setup Test Base
  - [ ] Scrivere test per `aiService` (cleanAndParseJson, buildSystemInstruction)
  - [ ] Scrivere test per `suggestionUtils`
  - [ ] Scrivere test per `evaluationUtils` (già testato, estendere)
  - [ ] Raggiungere 30% coverage su utils

---

## 🛠️ COMANDI UTILI

### Analisi Codice

```bash
# Contare 'any' nel codice
grep -r "any" src --include="*.ts" --include="*.tsx" | wc -l

# Trovare console.log
grep -rn "console\." src --include="*.ts" --include="*.tsx"

# Trovare dangerouslySetInnerHTML
grep -rn "dangerouslySetInnerHTML" src --include="*.tsx"

# Analisi complessità (richiede eslint-plugin-complexity)
npx eslint src --ext .ts,.tsx --no-eslintrc --plugin complexity --rule 'complexity: [error, 10]'
```

### Build & Test

```bash
# Build produzione
npm run build

# Preview build
npm run preview

# Test con coverage
npm run test:unit -- --coverage

# E2E tests
npm run e2e
```

### Type Checking

```bash
# Controllo TypeScript
npx tsc --noEmit

# Controllo strict
npx tsc --noEmit --strict
```

---

## 📊 METRICHE DA MONITORARE

### Pre-Implementazione (Baseline)

- ✅ `any` occorrences: **262**
- ✅ `console.*` statements: **85**
- ✅ `dangerouslySetInnerHTML` unsafe: **18**
- ✅ Test coverage: **<5%**
- ✅ TypeScript errors: **0** (con strict mode)

### Post-Implementazione (Target)

- 🎯 `any` occurrences: **<130** (-50%)
- 🎯 `console.*` in production: **0**
- 🎯 `dangerouslySetInnerHTML` unsafe: **0**
- 🎯 Test coverage: **30%** (utils + services)
- 🎯 TypeScript errors: **0** (maintained)

---

## ⚠️ ATTENZIONI DURANTE REFACTORING

### 1. Non rompere funzionalità esistenti

```bash
# Prima di ogni commit, verificare che l'app funzioni
npm run dev
# Testare manualmente feature critiche:
# - Login
# - Creazione lezione
# - Valutazione studente
# - Backup/Restore
```

### 2. Commit incrementali

```bash
# Non fare mega-commit, dividere per feature
git add src/utils/logger.ts
git commit -m "feat: add logger service to replace console statements"

git add src/components/App.tsx
git commit -m "refactor: use logger instead of console in App.tsx"
```

### 3. Testing dopo ogni change significativo

```bash
# Dopo ogni gruppo di modifiche
npm run test:unit
npm run build
```

### 4. Documentare breaking changes

Se qualche refactoring cambia API interne, documentare in `CHANGELOG.md`:

```markdown
## [4.2.0] - 2025-12-24

### Changed
- **BREAKING**: Removed `console.log` from production builds
  - Use `import logger from '@/utils/logger'` instead
- Sanitized all HTML rendering with DOMPurify
  - `dangerouslySetInnerHTML` now uses `sanitizeHtml()` wrapper

### Added
- Logger service for development debugging
- HTML sanitization utility
- Test suite for core services (30% coverage)
```

---

## 🎓 RISORSE & RIFERIMENTI

### Documentazione

- [DOMPurify](https://github.com/cure53/DOMPurify) - HTML Sanitization
- [Vitest](https://vitest.dev/) - Unit Testing
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type Safety

### Best Practices

- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [React Security Best Practices](https://react.dev/learn/you-might-not-need-an-effect#security)
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

## 💡 CONCLUSIONE

Queste **4 azioni prioritarie** migliorano significativamente:

1. ✅ **Sicurezza:** XSS prevention con sanitizzazione
2. ✅ **Qualità:** Logger professionale, type safety migliorato
3. ✅ **Manutenibilità:** Test base per refactoring sicuri
4. ✅ **Performance:** Meno console.log in produzione

**Tempo totale stimato:** 1-2 settimane  
**Impatto:** 🔴 ALTO  
**Difficoltà:** 🟡 MEDIA

**Prossimi passi dopo queste azioni:**
- Setup CI/CD (GitHub Actions)
- Accessibility audit
- Performance optimization
- Documentazione JSDoc

---

**Documento creato:** 24 Dicembre 2025  
**Versione:** 1.0  
**Prossima review:** Dopo implementazione (stimato: Gennaio 2026)
