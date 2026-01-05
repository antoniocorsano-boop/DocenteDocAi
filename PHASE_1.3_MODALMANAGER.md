# 🔧 Phase 1.3 - Refactor ModalManager.tsx

**File**: `src/components/ModalManager.tsx`  
**Problem**: 12 eslint errors - unused imports and variables  
**Priority**: HIGH - Modal Logic  
**Time**: ~45 minutes

---

## 📊 Quick Analysis

```
Total Errors: 12
- Unused Imports: 6
- Unused Variables: 6
```

---

## 🔍 Errors Breakdown

### Unused Imports (Line 11-18)

```typescript
// ❌ Lines 11-18
import {
  EventoCalendario,        // ← UNUSED
  KnowledgeBaseEntry,      // ← UNUSED
  Uda,                     // ← UNUSED
  Studente,                // ← UNUSED
  PianoInclusione,         // ← UNUSED
  AiSettings               // ← UNUSED
} from '../types';
```

### Unused Variables (Lines 28-31)

```typescript
// ❌ Lines 28-31
const {
  evaluations,            // ← UNUSED
  competencyEvals,        // ← UNUSED
  finalizedRegister       // ← UNUSED
} = useDataStore(...);

// ❌ Lines 29
const {
  handleNavigate,         // ← UNUSED
  handleLoadDemoData,     // ← UNUSED
  handlePromoteStudents,  // ← UNUSED
  handleResetYearData,    // ← UNUSED
  handleExportData        // ← UNUSED
} = actions;
```

---

## ✅ Solution

### Simple: Remove All

These variables are **objectively unused**. Safe to remove:

```typescript
// REMOVE FROM IMPORTS (line 11-18)
- EventoCalendario
- KnowledgeBaseEntry
- Uda
- Studente
- PianoInclusione
- AiSettings

// REMOVE FROM DESTRUCTURING (line 28-31)
- evaluations
- competencyEvals
- finalizedRegister
- handleNavigate
- handleLoadDemoData
- handlePromoteStudents
- handleResetYearData
- handleExportData
```

---

## 🛠️ Implementation (5 minutes)

### Edit 1: Remove Imports

```typescript
// BEFORE
import {
  EventoCalendario,
  KnowledgeBaseEntry,
  Uda,
  Studente,
  PianoInclusione,
  AiSettings
} from '../types';

// AFTER
// (Remove entire import if nothing left)
// OR keep only used types
```

### Edit 2: Remove Variables

```typescript
// BEFORE
const {
  evaluations,
  competencyEvals,
  finalizedRegister
} = useDataStore(...);

// AFTER
// (Remove or keep only if used)
```

```typescript
// BEFORE
const {
  handleNavigate,
  handleLoadDemoData,
  handlePromoteStudents,
  handleResetYearData,
  handleExportData
} = actions;

// AFTER
// (Remove all five)
```

---

## 🧪 Verification

```bash
# Check file
npm run lint src/components/ModalManager.tsx

# Should return:
# ✓ 0 problems

# Run tests
npm run test:unit -- ModalManager
```

---

## 📋 Checklist

- [ ] Remove 6 unused imports
- [ ] Remove 4 unused appState variables
- [ ] Remove 5 unused action handlers
- [ ] Run lint: `npm run lint src/components/ModalManager.tsx`
- [ ] Run tests
- [ ] Commit: "refactor(ModalManager): remove unused imports and variables"

---

**Duration**: ~45 minutes  
**Difficulty**: TRIVIAL  
**Risk**: NONE

**Ready?** → Proceed to Phase 2 when all Phase 1 complete.
