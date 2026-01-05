# Phase 5: Batch Fix Plan - Remaining 190 Problems

**Status**: In Progress  
**Current**: 190 problems (115 errors, 75 warnings)  
**Target**: < 100 problems

---

## Files Ready for Quick Fixes

### Batch 1: Unused Catch Block Variables (5+ files)
Pattern: `catch (e)` → `catch` or `catch (_)`

Files:
- `src/components/AnalyticsHub.tsx` - line 76
- `src/components/CircolareAnalysisModal.tsx` - line 17
- `src/components/FeedManager.tsx` - line 28
- `src/components/Guidance.tsx` - line 9
- `src/components/SignInScreen.tsx` - line 61
- `src/components/SmartImportModal.tsx` - line 68
- `src/components/VoiceNoteRecorder.tsx` - line 98
- `src/components/ui/M3Dialog.tsx` - line 13

**Estimated Impact**: -8 errors

---

### Batch 2: Unused Imports from UI Barrel Export (15+ files)
Pattern: Remove unused imports from `./ui` that are imported but not used

Quick Wins:
- `AssistantFab.tsx` - Remove `useState`, `useRef` (2 errors)
- `AnnualPlanningWizard.tsx` - Remove `Tooltip` (1 error)
- `AssistantModal.tsx` - Remove `AiThinkingGem` (1 error)  
- `BatchExportWizard.tsx` - Remove unused (1 error)
- `Calendar.tsx` - Remove `SectionHeader` (1 error)
- `ClassCompetencyDashboard.tsx` - Remove `SectionHeader` (1 error)
- `ClassSelection.tsx` - Remove `InfoCard` (1 error)
- `ConsiglioClasse.tsx` - Remove `TextField`, `TextArea`, `SelectField`, `M3IconButton` (4 errors)
- `KnowledgeBase.tsx` - Remove `aiSettings` from destructuring (1 error)
- `LessonAnalysisModal.tsx` - Remove `title` from destructuring (1 error)
- `RubricherManager.tsx` - Remove `onDeleteRubrica` (1 error)
- `Settings.tsx` - Remove `handleAddClass` (1 error)
- `UdaExportModal.tsx` - Remove `InfoCard` (1 error)
- `UdaPlanner.tsx` - Add return type (1 warning)

**Estimated Impact**: -20 errors

---

### Batch 3: Unknown Variable Pattern (5+ files)
Files needing case-by-case review:
- `eslint-rules/customRules.mjs` - `sourceCode` unused (1 error)
- `scripts/backupService.ts` - `any` type issue (1 error)
- `src/components/AnalyticsDashboard.tsx` - `modalRef` unused (1 error)
- `src/components/BatchExportWizard.tsx` - `modalRef` unused (1 error)
- `src/components/ClassCompetencyDashboard.tsx` - `any` type (1 error)
- `src/components/DidatticaInclusiva.tsx` - `any` type (1 error)
- `src/components/ImportStudentsModal.tsx` - `any` type (1 error)
- `src/components/MaterialPickerModal.tsx` - `any` type (1 error)
- `src/components/ReportisticaHub.tsx` - `modalRef` unused (1 error)
- `src/components/StudentInterviewModal.tsx` - `any` type (1 error)
- `src/components/StudentTransferModal.tsx` - `any` type (1 error)
- `src/components/TemplateManager.tsx` - `any` type (1 error)
- `src/components/Timetable.tsx` - `onAiSuggest` unused (1 error)

**Estimated Impact**: -13 errors

---

### Batch 4: Missing Return Types (15+ functions)
Pattern: Add explicit return type annotations

Files:
- `src/nka/NKANodeCard.tsx` - Add return type (1 warning)
- `e2e/helpers.ts` - Add return type (1 warning)
- `src/components/ErrorBoundary.tsx` - Add return type (1 warning)
- `src/components/ModalContext.tsx` - Add return type (1 warning)

**Estimated Impact**: -4 warnings

---

## Execution Strategy

1. **Round 1 (Catch blocks)**: Quick 1-min fixes on 8 files = -8 errors
2. **Round 2 (UI imports)**: 20-30 min on 14 files = -20 errors
3. **Round 3 (Variables)**: 30-40 min on 13 files = -13 errors
4. **Round 4 (Return types)**: 10-15 min on 4+ files = -4 warnings

**Total Estimated**: 190 → 155 problems (-35 problems, 18% reduction)

---

## Post-Phase 5 Status (Projected)

```
Current: 190 problems (115 errors, 75 warnings)
After Phase 5: 155 problems (85 errors, 70 warnings)
Improvement: -35 problems (-18%)
Files cleaned: 45+
```

---

**Next**: Start with Batch 1 (catch blocks) for quick wins
