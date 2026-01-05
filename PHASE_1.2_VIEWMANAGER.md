# 🔧 Phase 1.2 - Refactor ViewManager.tsx

**File**: `src/components/ViewManager.tsx`  
**Problem**: 25 eslint errors - unused imports and variables  
**Priority**: HIGH - Core Component  
**Time**: ~1 hour

---

## 📊 Error Analysis

### Unused Imports (Line 7)

```typescript
// ❌ PROBLEMATIC - 9 unused types imported
import {
  AppState,
  AppActions,
  View,
  EventoCalendario,          // ← UNUSED
  Lezione,                    // ← UNUSED (but used indirectly in destructuring)
  RegisterEntry,
  Studente,
  KnowledgeBaseEntry,         // ← UNUSED
  Rubrica,                    // ← UNUSED
  PianoInclusione,            // ← UNUSED
  GiudizioPeriodico,          // ← UNUSED
  Competenza,
  LessonScheduleInput,        // ← UNUSED
  EvaluationInput,            // ← UNUSED
  UdaCreateInput,             // ← UNUSED
  Uda,
  Report
} from '../types';
```

### Unused Destructured Variables (Lines 26-28)

```typescript
// ❌ DESTRUCTURED BUT NOT USED
const {
  user,                 // ✓ Used
  students,             // ✓ Used
  slots,                // ✓ Used
  activeSuggestion,     // ← UNUSED (line 26)
  dismissedSuggestions, // ✓ Used
  isGlobalAiLoading,    // ← UNUSED (line 26)
  installPrompt,        // ✓ Used
  notifiche,            // ← UNUSED (line 26)
  settings,             // ✓ Used
  lessons,              // ✓ Used
  evaluations,          // ✓ Used (line 28)
  competencyEvals,      // ← UNUSED (line 28)
  feedSources,          // ← UNUSED (line 27)
  studentProfileContext,// ← UNUSED (line 27)
  // ... more
} = appState;
```

### Unused Handler Functions (Lines 37-66)

```typescript
// ❌ HANDLERS DEFINED BUT NOT USED
const {
  setCreateLessonContext,     // ✓ Used
  setLessonViewContext,       // ✓ Used
  setIsLiveAssistantModalOpen,// ✓ Used
  setActiveSlotKey,           // ← UNUSED
  setEditingSlotKey,          // ← UNUSED (line 40)
  setIsLoadingModalOpen,       // ✓ Used
  // ...
  handleNavigate,             // ← UNUSED (line 49)
  handleBack,                 // ✓ Used
  handleLoadDemoData,         // ← UNUSED (line 49)
  handleCleanDemoData,        // ← UNUSED (line 50)
  handleShowSlotActions,      // ← UNUSED (line 51)
  handleAiSuggest,            // ← UNUSED (line 52)
  // ...
  toggleModal                 // ← UNUSED (line 66)
} = actions;
```

---

## ✅ Solution Strategy

### Approach: Clean Removal

Remove only what's provably unused. Some variables are:
- Set in destructuring for clarity (ok to keep)
- Used in dead code (should remove)
- Reserved for future use (document with comment)

---

## 🔍 Detailed Line-by-Line Analysis

### Unused Imports to Remove

```typescript
// Remove these from line 7 import:
- EventoCalendario    (no usage in file)
- KnowledgeBaseEntry  (no usage in file)
- Rubrica             (no usage in file)
- PianoInclusione     (no usage in file)
- GiudizioPeriodico   (no usage in file)
- LessonScheduleInput (no usage in file)
- EvaluationInput     (no usage in file)
- UdaCreateInput      (no usage in file)

// KEEP these:
- AppState, AppActions, View, Lezione, RegisterEntry, Studente,
- Competenza, Uda, Report
```

### Unused Destructured Variables to Remove (Line 26-28)

```typescript
// ✓ KEEP (used in file):
user, students, slots, dismissedSuggestions, installPrompt, notifiche, 
settings, lessons, evaluations, uda, eventi, knowledgeBase, corpora, 
rubriche, pianiInclusione, giudizi, reportistica, draftRegister, 
finalizedRegister, aiSettings, themeState, backupState, driveSyncState, 
studentProfileContext, curricula, submissions, orientamentoActivities, 
ePortfolioEntries, studentOrientamentoStates

// ✗ REMOVE (not used):
activeSuggestion      (declared line 26, no usage)
isGlobalAiLoading     (declared line 26, no usage)
notifiche             (declared line 26, but NOT used - verify!)
feedSources           (declared line 27, no usage)
competencyEvals       (declared line 28, no usage)
```

### Unused Handler Functions to Remove (Lines 37-66)

```typescript
// Grep for usage, then remove if not found:
- setActiveSlotKey       (no usage)
- setEditingSlotKey      (no usage at line 40)
- handleNavigate         (no usage at line 49)
- handleLoadDemoData     (no usage at line 49)
- handleCleanDemoData    (no usage at line 50)
- handleShowSlotActions  (no usage at line 51)
- handleAiSuggest        (no usage at line 52)
- toggleModal            (no usage at line 66)
```

---

## 🛠️ Implementation Steps

### Step 1: Remove Unused Imports

```typescript
// BEFORE (line 7)
import { AppState, AppActions, View, EventoCalendario, Lezione, RegisterEntry, Studente, KnowledgeBaseEntry, Rubrica, PianoInclusione, GiudizioPeriodico, Competenza, LessonScheduleInput, EvaluationInput, UdaCreateInput, Uda, Report } from '../types';

// AFTER
import { AppState, AppActions, View, Lezione, RegisterEntry, Studente, Competenza, Uda, Report } from '../types';
```

### Step 2: Remove Unused Destructured Variables

```typescript
// BEFORE (lines 26-28)
const {
  user, students, slots, activeSuggestion, dismissedSuggestions, isGlobalAiLoading, 
  installPrompt, notifiche, settings,
  lessons, evaluations, competencyEvals, uda, eventi, knowledgeBase, corpora, rubriche, 
  pianiInclusione, giudizi, reportistica, feedSources, draftRegister, finalizedRegister, 
  aiSettings, themeState, backupState, driveSyncState, studentProfileContext, curricula, 
  submissions, orientamentoActivities, ePortfolioEntries, studentOrientamentoStates
} = appState;

// AFTER
const {
  user, students, slots, dismissedSuggestions, installPrompt, notifiche, settings,
  lessons, evaluations, uda, eventi, knowledgeBase, corpora, rubriche, 
  pianiInclusione, giudizi, reportistica, draftRegister, finalizedRegister, 
  aiSettings, themeState, backupState, driveSyncState, studentProfileContext, curricula, 
  submissions, orientamentoActivities, ePortfolioEntries, studentOrientamentoStates
} = appState;
```

### Step 3: Remove Unused Handler Functions

```typescript
// BEFORE (lines 37-66)
const {
  setCreateLessonContext,
  setLessonViewContext,
  setIsLiveAssistantModalOpen,
  setActiveSlotKey,            // ← REMOVE
  setEditingSlotKey,           // ← REMOVE
  // ... many more
  handleNavigate,              // ← REMOVE
  handleLoadDemoData,          // ← REMOVE
  handleCleanDemoData,         // ← REMOVE
  handleShowSlotActions,       // ← REMOVE
  handleAiSuggest,             // ← REMOVE
  // ...
  toggleModal                  // ← REMOVE
} = actions;

// AFTER
const {
  setCreateLessonContext,
  setLessonViewContext,
  setIsLiveAssistantModalOpen,
  setIsLoadingModalOpen,
  setLoadingModalMessage,
  setCircularAnalysisModal,
  setIsRegisterImportOpen
} = modals;

const {
  setLessons, setEvaluations, setUda,
  setEventi, setKnowledgeBase, setCorpora, setRubriche, setPianiInclusione,
  setGiudizi, setReportistica, setDraftRegister, setFinalizedRegister, 
  setCurricula, setSubmissions, dismissSuggestion,
  setStudentProfileContext, showToast,
  handleBack, handleEditSlot, onScheduleLesson, handleAddEvaluation,
  handleCreateUda, handleAddNote, onMarkAttendance,
  setViewContext, onSaveUda, onSaveReport, onSaveEvent, onAddLessons,
  handleGradeSubmission, handleOpenOperations,
  setOrientamentoActivities, setEPortfolioEntries, setStudentOrientamentoStates,
  importStudents, importEvaluations
} = actions;
```

---

## 📋 Verification Checklist

```bash
# After changes:

# 1. Grep for each removed variable to confirm no usage
grep -n "activeSuggestion\|isGlobalAiLoading\|competencyEvals" src/components/ViewManager.tsx
# Should return NOTHING

# 2. Run lint on file
npm run lint src/components/ViewManager.tsx
# Should show 0 errors

# 3. Run tests to ensure rendering works
npm run test:unit -- src/components/ViewManager

# 4. Full lint
npm run lint
```

---

## 🔗 Dependencies

- Must complete BEFORE: Phase 1.3 (ModalManager)
- May affect: Component tests
- No breaking changes (only removing unused)

---

## ✨ Expected Result

```
BEFORE:
npm run lint src/components/ViewManager.tsx
✖ 25 problems (25 errors, 0 warnings)

AFTER:
npm run lint src/components/ViewManager.tsx
✓ 0 problems
```

---

## 🚨 Risk Assessment

**Risk Level**: LOW
- Only removing unused code
- No functional changes
- Tests should still pass
- Import changes = compile-time check

**Test After**: 
- Render main views
- Check no runtime errors
- Verify component mounting

---

## 📝 Implementation Checklist

- [ ] Remove 8 unused imports from line 7
- [ ] Remove 15 unused destructured appState variables
- [ ] Remove 8 unused handler functions
- [ ] Grep verify no usage of removed vars
- [ ] Run `npm run lint src/components/ViewManager.tsx`
- [ ] Run `npm run test:unit`
- [ ] Verify component renders in all views
- [ ] Commit: "refactor(ViewManager): remove unused imports and variables"

---

**Ready to proceed?** → See [LINT_REFACTOR_PLAN.md](LINT_REFACTOR_PLAN.md) for next phases.
