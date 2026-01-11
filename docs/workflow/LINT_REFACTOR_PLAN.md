# 📋 REFACTOR PLAN - Lint Debt Resolution

**Data**: January 5, 2026  
**Obiettivo**: Ridurre da 208 errori a 0 errori lint  
**Timeline**: 4 fasi sequenziali (1-2 giorni)  

---

## 📊 Situazione Attuale

```
Errori: 208 (blocca commit)
- no-unused-vars: 85+
- no-explicit-any: 70+
- Unused handlers: 20+

Warnings: 101 (discussioni in review)
- explicit-module-boundary-types: 85+
- ban-ts-comment: 3
- no-unsafe-function-type: 1
```

---

## 🎯 FASE 1 - Refactor Prioritario (4-6 ore)

### 1.1️⃣ File: `src/utils/dataValidator.ts` 🔴 **38 ERRORI**

**Problema**: Tutti i parametri di funzione sono tipizzati come `any`

**Impatto**: 
- Viola type safety
- Blocca pre-commit hook
- Crit icale per data validation

**Azione Richiesta**:

```typescript
// ❌ CURRENT
export const validateBackupData = (data: any): BackupData | null => {
  // ...
}

// ✅ TARGET
export const validateBackupData = (data: unknown): BackupData | null => {
  if (typeof data !== 'object' || data === null) return null;
  // ...
}
```

**Steps**:
1. Read file completo per mappare tutti gli `any`
2. Creare proper types per ogni parametro
3. Usare type guards e `unknown` instead of `any`
4. Verificare con `npm run lint src/utils/dataValidator.ts`

**Time**: ~1 ora

---

### 1.2️⃣ File: `src/components/ViewManager.tsx` 🔴 **25 ERRORI**

**Problema**: 
- 9 import non utilizzati
- 15 destructured variables non usate

**Impatto**:
- Codice pulito
- Riduce complexity
- Blocca commit

**Azione Richiesta**:

```typescript
// ❌ CURRENT - Linea 7
import {
  EventoCalendario,      // ← UNUSED
  Rubrica,               // ← UNUSED
  PianoInclusione,       // ← UNUSED
  // ... 6 more
} from '../types';

// ✅ TARGET
import { 
  // Only keep used types
} from '../types';

// ❌ CURRENT - Linea 26
const {
  activeSuggestion,      // ← UNUSED
  isGlobalAiLoading,     // ← UNUSED
  notifiche,             // ← UNUSED
  // ... 12 more
} = useDataStore(...);

// ✅ TARGET
const {
  // Only destructure what's used
} = useDataStore(...);
```

**Steps**:
1. Grep per ogni import/variable - determina se usato
2. Rimuovere import inutilizzati
3. Rimuovere destructuring inutilizzati
4. Re-test: `npm run test:unit`
5. Verify lint: `npm run lint src/components/ViewManager.tsx`

**Time**: ~1 ora

---

### 1.3️⃣ File: `src/components/ModalManager.tsx` 🔴 **12 ERRORI**

**Problema**:
- 6 import non usati
- 6 handler variables non assegnati

**Azione Richiesta**:

```typescript
// ❌ CURRENT - Linea 11-18
import {
  EventoCalendario,
  KnowledgeBaseEntry,
  // ... 4 more
} from '../types';

// ✅ TARGET - Rimuovi if unused

// ❌ CURRENT - Linea 28-31
const {
  evaluations,           // ← NOT USED
  competencyEvals,       // ← NOT USED
  handleNavigate,        // ← NOT USED
} = useStore(...);

// ✅ TARGET - Rimuovi inutilizzati
```

**Steps**:
1. Analizza ogni import e variable
2. Option A: Rimuovere (se veramente inutilizzato)
3. Option B: Implementare logica se necessaria
4. Verify: `npm run lint src/components/ModalManager.tsx`

**Time**: ~45 minuti

---

## 💪 FASE 2 - Type Annotations Sprint (2-3 ore)

### 2.1️⃣ File: `src/services/aiService.ts` 🟡 **32 WARNINGS**

**Problema**: 32 funzioni senza return type annotations

**Azione Richiesta**:

```typescript
// ❌ CURRENT
const generatePrompt = (context) => {
  // ...
  return "prompt text";
}

// ✅ TARGET
const generatePrompt = (context: AIContext): string => {
  // ...
  return "prompt text";
}
```

**Steps**:
1. List tutte le funzioni con warning
2. Determinare return type (analyzeType)
3. Aggiungere `: ReturnType` a ciascuna
4. Aggiungere parameter types se mancano
5. `npm run lint src/services/aiService.ts`

**Time**: ~1.5 ore

**Tool**: Refactoring automatico possibile con:
```bash
npx eslint src/services/aiService.ts --fix --rule '@typescript-eslint/explicit-function-return-type: error'
```

---

### 2.2️⃣ File: `src/services/backupService.ts` 🟡 **2 WARNINGS**

**Azione Richiesta**:
- Add return types su 2 funzioni
- Simple fix, <10 minuti

---

## 📋 FASE 3 - GitHub Issue Templates (30 minuti)

### 3.1 Create `.github/ISSUE_TEMPLATE/lint-debt.md`

```markdown
---
name: Lint Debt - Type Safety
about: Track TypeScript type safety and linting issues
labels: ['lint-debt', 'medium-priority']
---

## Description
[Describe the lint issue]

## File(s) Affected
- `src/path/to/file.ts`

## Current State
```typescript
// Current problematic code
```

## Target State
```typescript
// Desired state after fix
```

## Lint Rule
- `@typescript-eslint/no-explicit-any`
- `@typescript-eslint/explicit-function-return-type`
- etc.

## Priority
- [ ] Critical (blocks deployment)
- [ ] High (affects type safety)
- [ ] Medium (code quality)
```

---

## ✅ FASE 4 - Verification & Monitoring (30 minuti)

### 4.1 Run Comprehensive Check

```bash
npm run lint:metrics         # Generate metrics snapshot
npm run lint                 # Full lint check
npm run test:unit            # Verify tests still pass
npm run build                # Verify build succeeds
```

### 4.2 Expected Results

```
BEFORE:
✖ 309 problems (208 errors, 101 warnings)

AFTER (Target):
✖ 0 problems (0 errors, 0 warnings)
```

---

## 📅 Timeline & Dependencies

```
├─ Phase 1 (Refactor Prioritario)
│  ├─ 1.1 dataValidator.ts     [1h]   ✓ INDEPENDENT
│  ├─ 1.2 ViewManager.tsx      [1h]   ✓ INDEPENDENT
│  └─ 1.3 ModalManager.tsx     [45m]  ✓ INDEPENDENT
│
├─ Phase 2 (Type Annotations)
│  ├─ 2.1 aiService.ts         [1.5h] ✓ INDEPENDENT
│  └─ 2.2 backupService.ts     [10m]  ✓ INDEPENDENT
│
├─ Phase 3 (GitHub Setup)
│  └─ 3.1 Issue templates      [30m]  ✓ INDEPENDENT
│
└─ Phase 4 (Verification)
   ├─ 4.1 Lint metrics         [10m]  ✓ After phases 1-2
   └─ 4.2 Final checks         [20m]  ✓ After 4.1

TOTAL TIME: ~6-7 hours
```

---

## 🎓 Priorità di Esecuzione

### HIGH PRIORITY (Blocca Commit)

1. **Phase 1.1** - dataValidator.ts (38 errori)
   - Type safety CRITICAL
   - Blocca pre-commit
   - ~1 ora

2. **Phase 1.2** - ViewManager.tsx (25 errori)
   - Core component
   - Blocca commit
   - ~1 ora

3. **Phase 1.3** - ModalManager.tsx (12 errori)
   - Lower count
   - Still blocking
   - ~45 minuti

### MEDIUM PRIORITY (Warnings)

4. **Phase 2.1** - aiService.ts (32 warnings)
   - Non-blocking
   - Important for maintainability
   - ~1.5 ore

5. **Phase 2.2** - backupService.ts (2 warnings)
   - Non-blocking
   - Quick fix
   - ~10 minuti

### LOW PRIORITY (Infrastructure)

6. **Phase 3** - GitHub templates
   - Setup future tracking
   - ~30 minuti

7. **Phase 4** - Verification
   - Post-refactor validation
   - ~30 minuti

---

## 🛠️ Commands Ready-to-Use

```bash
# Check specific file
npm run lint src/utils/dataValidator.ts
npm run lint src/components/ViewManager.tsx
npm run lint src/components/ModalManager.tsx

# Auto-generate return types (experimental)
npx eslint src/services/aiService.ts --fix

# Full verification
npm run lint
npm run test:unit
npm run lint:metrics

# Pre-commit test
npm run prepare  # Init husky
git add .
git commit -m "refactor: fix lint debt - type safety"
```

---

## 📍 Success Criteria

- ✅ 0 errors from `npm run lint`
- ✅ All 1152 tests pass
- ✅ Pre-commit hook accepts commits
- ✅ GitHub Actions CI passes
- ✅ Type coverage > 95%

---

## 🚨 Risk Assessment

**Low Risk**:
- Removing unused imports = safe
- Adding type annotations = safe
- Changes are localized

**Testing Required**:
- Run `npm run test:unit` after each phase
- Verify no functional changes
- Check component rendering

---

## 📞 Support & Escalation

If stuck:
1. Check `docs/LINT_GOVERNANCE.md` for policy
2. Use `npm run lint:heal` for analysis
3. Check specific rule docs: https://typescript-eslint.io/rules/
4. Create GitHub issue with `lint-debt` tag

---

**Plan Created**: January 5, 2026  
**Status**: Ready for Execution  
**Owner**: Engineering Team
