# MD3 Z-INDEX GOVERNANCE

**DocenteDoc AI - Phase 4 Deliverable**  
**Generated**: January 28, 2026  
**Status**: ✅ **ANTI-REGRESSION ACTIVE**

---

## 📋 EXECUTIVE SUMMARY

### Obiettivo

Sostituire **TUTTI** i valori numerici `z-index` con token MD3 centralizzati per garantire:

1. ✅ **Coerenza visiva**: stack order prevedibile e manutenibile
2. ✅ **Governance**: single source of truth per layering
3. ✅ **Anti-regressione**: commit blocco automatico se violazioni
4. ✅ **Type-safety**: ESLint + TypeScript enforcement

---

## 🔒 REGOLE VINCOLANTI (NON-NEGOTIABLE)

### ❌ VIETATO

```tsx
// ❌ Z-index numerico diretto
<div style={{ zIndex: 1000 }} />

// ❌ Z-index da costante JavaScript
import { Z_INDEX } from './zIndex';
<div style={{ zIndex: Z_INDEX.modal }} />

// ❌ Z-index in CSS con valore numerico
.modal { z-index: 1300; }

// ❌ Variabili CSS non-MD3
z-index: var(--z-modal);
```

### ✅ OBBLIGATORIO

```tsx
// ✅ Token MD3 in TSX
<div style={{ zIndex: 'var(--md-sys-z-modal)' }} />

// ✅ Token MD3 in CSS
.modal { z-index: var(--md-sys-z-modal); }

// ✅ Solo var(--md-sys-z-*) syntax
```

---

## 📦 SISTEMA DI TOKEN MD3

### Token Disponibili

**File**: `src/design-system/tokens/md3-z-index.css`

```css
:root {
  /* Base layer - Contenuto standard */
  --md-sys-z-base: 0;

  /* Content layer - Contenuto sollevato (cards, panels) */
  --md-sys-z-content: 100;

  /* Overlay layer - Backdrop, scrim, drawer */
  --md-sys-z-overlay: 200;

  /* Modal layer - Dialogs, modals */
  --md-sys-z-modal: 300;

  /* Tooltip layer - Tooltip, popover */
  --md-sys-z-tooltip: 400;

  /* Snackbar layer - Notifiche, toast, snackbar */
  --md-sys-z-snackbar: 500;
}
```

---

## 🎯 USAGE GUIDELINES

### Quando usare quale token

| Componente | Token | Valore | Caso d'uso |
|------------|-------|--------|------------|
| **Base content** | `--md-sys-z-base` | 0 | Default per tutti gli elementi |
| **Cards, Panels** | `--md-sys-z-content` | 100 | Contenuto sollevato, cards |
| **Backdrop, Scrim** | `--md-sys-z-overlay` | 200 | Overlay semi-trasparente |
| **Modal, Dialog** | `--md-sys-z-modal` | 300 | Finestre modali |
| **Tooltip** | `--md-sys-z-tooltip` | 400 | Tooltip, popover |
| **Snackbar** | `--md-sys-z-snackbar` | 500 | Notifiche toast |

---

## 🛠️ MIGRATION GUIDE

### Esempi di Conversione

#### React/TSX

**Before**:
```tsx
<div style={{ zIndex: 1300 }}>Modal</div>
```

**After**:
```tsx
<div style={{ zIndex: 'var(--md-sys-z-modal)' }}>Modal</div>
```

---

#### CSS

**Before**:
```css
.fab {
  z-index: 1200;
}
```

**After**:
```css
.fab {
  z-index: var(--md-sys-z-snackbar);
}
```

---

#### TypeScript Constants (DEPRECATED)

**Before**:
```ts
// ❌ DEPRECATO - NON USARE
export const Z_INDEX = {
  modal: 1300,
  fab: 1200
};
```

**After**:
```ts
// ✅ Usare direttamente token CSS
// Importare in component:
style={{ zIndex: 'var(--md-sys-z-modal)' }}
```

> ⚠️ **ATTENZIONE**: `src/design-system/zIndex.ts` è **DEPRECATO** e sarà rimosso.

---

## 🔍 AUDIT & ENFORCEMENT

### Automated Audit Script

**Comando**:
```bash
npm run md3:zindex:audit
```

**Script**: `scripts/md3-zindex-audit.cjs`

**Funzioni**:
- ✅ Scansiona 421 file in `src/`
- ✅ Rileva z-index numerici
- ✅ Rileva costanti JS (`Z_INDEX.*`)
- ✅ Rileva variabili non-MD3 (`var(--z-*)`)
- ✅ Report dettagliato per file/linea

**Output Esempio**:
```
❌ Z-INDEX AUDIT FAILED

🚫 Found 105 violations:

📄 src/components/AssistantFab.tsx
   Line 278: cssZIndex
   z-index: 1300;
   → Found: z-index: 1300
```

---

### ESLint Rule (Real-Time)

**File**: `eslint-rules/no-numeric-zindex.mjs`

**Configurazione**: `eslint.config.mjs`
```javascript
{
  'custom/no-numeric-zindex': 'error'
}
```

**Comportamento**:
- ❌ Blocca `zIndex: 1000` → **ERROR**
- ❌ Blocca `Z_INDEX.modal` → **ERROR**
- ✅ Consente `zIndex: "var(--md-sys-z-modal)"` → **OK**

---

### Pre-Commit Hook (Git)

**File**: `.husky/pre-commit`

**Script**:
```bash
echo "🔍 Running MD3 Z-INDEX Governance Audit..."
node ./scripts/md3-zindex-audit.cjs

if [ $? -ne 0 ]; then
    echo "❌ COMMIT BLOCKED: Numeric z-index values detected"
    exit 1
fi
```

**Comportamento**:
- ✅ **0 violazioni** → Commit consentito
- ❌ **≥1 violazioni** → **COMMIT BLOCCATO**

---

### Test Anti-Regressione (Vitest)

**File**: `__tests__/m3-regression.test.ts`

**Test Suite**:
```typescript
describe('MD3 Z-INDEX GOVERNANCE — STEP 4 ANTI-REGRESSION', () => {
  it('MUST reject numeric z-index values');
  it('MUST reject z-index from JavaScript constants');
  it('MUST require z-index to use MD3 tokens only');
  it('MUST have all required z-index tokens defined');
  it('MUST reject inline zIndex CSS property in style objects');
  it('MUST allow only var() syntax for z-index');
});
```

**Esecuzione**:
```bash
npm test -- __tests__/m3-regression.test.ts
```

**Risultato**:
```
✓ MD3 Z-INDEX GOVERNANCE — STEP 4 ANTI-REGRESSION (6)
  ✓ MUST reject numeric z-index values 0ms
  ✓ MUST reject z-index from JavaScript constants 0ms
  ✓ MUST require z-index to use MD3 tokens only 0ms
  ✓ MUST have all required z-index tokens defined 155ms
  ✓ MUST reject inline zIndex CSS property in style objects 0ms
  ✓ MUST allow only var() syntax for z-index 0ms
```

---

## 📊 AUDIT REPORT (2026-01-28)

### Statistiche Globali

| Metrica | Valore |
|---------|--------|
| **File scansionati** | 421 |
| **Violazioni totali** | 105 |
| **File con violazioni** | 28 |
| **Token MD3 definiti** | 6 |
| **Protezioni attive** | 4 (audit, ESLint, hook, test) |

---

### Top Violatori

| File | Violazioni | Priority |
|------|------------|----------|
| `src/layout.css` | 25 | 🔴 **CRITICO** |
| `src/modules.css` | 18 | 🔴 **CRITICO** |
| `src/components/AssistantFab.tsx` | 6 | 🟡 **ALTO** |
| `src/design-system/zIndex.ts` | 9 | 🟠 **DEPRECARE** |
| `src/nka/*.tsx` | 5 | 🟡 **ALTO** |

---

### Esempi di Violazioni Rilevate

#### 1. Numeric zIndex in TSX
```tsx
// src/components/AssistantFab.tsx:278
<div style={{ zIndex: 1300 }}>
  {/* content */}
</div>
```

**Fix**:
```tsx
<div style={{ zIndex: 'var(--md-sys-z-modal)' }}>
  {/* content */}
</div>
```

---

#### 2. Numeric z-index in CSS
```css
/* src/layout.css:111 */
.navigation-rail {
  z-index: 1200;
}
```

**Fix**:
```css
.navigation-rail {
  z-index: var(--md-sys-z-content);
}
```

---

#### 3. JavaScript Constants (DEPRECATED)
```tsx
// src/components/ModalContext.tsx:161
container.style.zIndex = Z_INDEX.modal.backdrop.toString();
```

**Fix**:
```tsx
container.style.zIndex = 'var(--md-sys-z-overlay)';
```

---

#### 4. Non-MD3 CSS Variables
```css
/* src/theme.css:1198 */
.modal-backdrop {
  z-index: var(--z-modal-backdrop);
}
```

**Fix**:
```css
.modal-backdrop {
  z-index: var(--md-sys-z-overlay);
}
```

---

## 🚨 BREAKING CHANGES

### File da Deprecare

#### ❌ `src/design-system/zIndex.ts`

**Motivazione**: Costanti JavaScript numeriche violano governance MD3

**Azione**:
1. NON importare più `Z_INDEX` da questo file
2. Usare direttamente token CSS: `var(--md-sys-z-*)`
3. Rimuovere file dopo migrazione completa

---

### Variabili CSS Obsolete

Le seguenti variabili CSS **NON** sono conformi MD3:

```css
/* ❌ OBSOLETE - NON USARE */
--z-nav
--z-modal
--z-modal-backdrop
--z-assistant-fab
--z-tooltip
--z-snackbar
```

**Sostituire con**:

```css
/* ✅ USARE SOLO QUESTI */
--md-sys-z-base
--md-sys-z-content
--md-sys-z-overlay
--md-sys-z-modal
--md-sys-z-tooltip
--md-sys-z-snackbar
```

---

## 📋 REMEDIATION CHECKLIST

### Priority 1 - CRITICAL (43 violations)

- [ ] **`src/layout.css`** (25 violations)
  - Sostituire tutti `z-index: 10` con token appropriati
  - Sostituire `var(--z-nav)` con `var(--md-sys-z-content)`
  
- [ ] **`src/modules.css`** (18 violations)
  - Mappare z-index numerici ai token MD3
  - Rimuovere classi utility `.z-10`, `.z-20`

---

### Priority 2 - HIGH (20 violations)

- [ ] **`src/components/AssistantFab.tsx`** (6 violations)
  - Line 278: `z-index: 1300` → `var(--md-sys-z-modal)`
  - Line 305: `z-index: 1198` → `var(--md-sys-z-content)`
  - Line 324: `z-index: 1199` → `var(--md-sys-z-content)`
  - Line 213: Remove `Z_INDEX.assistant.fab`
  
- [ ] **`src/design-system/zIndex.ts`** (9 violations)
  - **DEPRECARE INTERO FILE**
  - Migrare tutte le importazioni a token CSS

- [ ] **`src/nka/`** (5 violations)
  - `NKABottomSheet.tsx`: 3 violations
  - `nka.css`: 2 violations

---

### Priority 3 - MEDIUM (42 violations)

- [ ] **Global CSS files**
  - `src/components/components.css` (7 violations)
  - `src/global.css` (1 violation)
  - `src/design-system/legacyStyles.css` (2 violations)
  
- [ ] **Component-specific**
  - `NavigationRail.tsx` (3 violations)
  - `Snackbar.tsx` (1 violation)
  - `Tooltip.tsx` (1 violation)
  - Altri componenti minori (28 violations)

---

## 🎓 BEST PRACTICES

### 1. Sempre usare token MD3

```tsx
// ✅ CORRETTO
<Modal style={{ zIndex: 'var(--md-sys-z-modal)' }} />

// ❌ ERRATO
<Modal style={{ zIndex: 1300 }} />
```

---

### 2. Non creare nuovi token custom

Se nessun token esistente si adatta, **NON** creare `--z-custom-thing`.

**Invece**:
1. Valuta quale layer MD3 si avvicina di più
2. Se necessario, proponi aggiunta token in `md3-z-index.css`
3. Documenta la decisione

---

### 3. TypeScript type-safety

```tsx
// ✅ Type-safe z-index
type ZIndex = `var(--md-sys-z-${string})`;

interface ModalProps {
  zIndex?: ZIndex;
}
```

---

### 4. CSS class over inline styles

**Preferire**:
```css
.modal {
  z-index: var(--md-sys-z-modal);
}
```

**Evitare**:
```tsx
<div style={{ zIndex: 'var(--md-sys-z-modal)' }} />
```

---

## 📞 SUPPORT & TROUBLESHOOTING

### Come risolvere violazioni

1. **Esegui audit**:
   ```bash
   npm run md3:zindex:audit
   ```

2. **Leggi output**: Identifica file/linea con violazione

3. **Scegli token MD3**: Vedi tabella [Usage Guidelines](#-usage-guidelines)

4. **Sostituisci valore**: Usa `var(--md-sys-z-*)`

5. **Verifica**: Ricontrolla con `npm run md3:zindex:audit`

---

### Commit bloccato?

**Errore**:
```
❌ COMMIT BLOCKED: Numeric z-index values detected
```

**Soluzione**:
1. Esegui `npm run md3:zindex:audit`
2. Correggi violazioni nel file staged
3. Riprova commit

---

### ESLint errors in editor?

**Errore**:
```
error  Numeric z-index values are forbidden. Use MD3 tokens: var(--md-sys-z-*)  custom/no-numeric-zindex
```

**Soluzione**:
1. Sostituisci valore numerico con token MD3
2. Salva file (ESLint auto-fix se configurato)

---

## 📅 RELEASE NOTES

### Version 1.0.0 - 2026-01-28

**Phase 4 - Step 4 Completed**

**Features**:
- ✅ Token system creato (6 token MD3)
- ✅ Audit script completo (421 file scansionati)
- ✅ ESLint rule attiva (ERROR severity)
- ✅ Pre-commit hook configurato (blocco automatico)
- ✅ Test anti-regressione (6 test Vitest)

**Violations Detected**:
- 🚫 105 violazioni totali
- 📄 28 file coinvolti
- 🔴 Priority 1: 43 violations (layout/modules)

**Breaking Changes**:
- ❌ `src/design-system/zIndex.ts` → DEPRECATO
- ❌ Variabili CSS `--z-*` → Obsolete

**Next Steps**:
- 📋 Remediation 105 violations
- 📘 Documentation training
- 🔄 CI/CD integration

---

## 📖 REFERENCES

- **Governance Contract**: `MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md`
- **Cleanup Plan**: `MD3_CLEANUP_EXECUTION_PLAN.md`
- **Token File**: `src/design-system/tokens/md3-z-index.css`
- **Audit Script**: `scripts/md3-zindex-audit.cjs`
- **ESLint Rule**: `eslint-rules/no-numeric-zindex.mjs`
- **Tests**: `__tests__/m3-regression.test.ts`

---

## 🔒 COMPLIANCE STATEMENT

**DocenteDoc AI is committed to MD3 STRICT GOVERNANCE.**

All z-index values **MUST** use MD3 tokens exclusively:
- `var(--md-sys-z-base)`
- `var(--md-sys-z-content)`
- `var(--md-sys-z-overlay)`
- `var(--md-sys-z-modal)`
- `var(--md-sys-z-tooltip)`
- `var(--md-sys-z-snackbar)`

**NO EXCEPTIONS.**

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-01-28  
**Phase**: 4 - Step 4 Complete  
**Status**: ✅ **ANTI-REGRESSION ACTIVE**
