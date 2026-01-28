# MD3 LEGACY REMEDIATION — PRIORITY QUEUE & EXECUTION PLAN

**Status**: 🔄 IN PROGRESS  
**Start Date**: 2026-01-28  
**Total Legacy Violations**: 386  
**Total Legacy Files**: 109  
**CI/CD Gate**: ✅ ACTIVE (blocks new violations)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## VIOLATION BREAKDOWN

| Type | Count | % |
|------|-------|---|
| `inlineStyleMotion` | 181 | 46.9% |
| `inlineStyleLayout` | 170 | 44.0% |
| `forbiddenProps` | 17 | 4.4% |
| `inlineStyleZIndex` | 13 | 3.4% |
| `hardcodedSizeProps` | 2 | 0.5% |
| `classNameUtilities` | 3 | 0.8% |

**Primary Issue**: Inline styles con hardcoded motion e layout values (90.9% delle violations)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## BATCH STRATEGY

### Batch Organization

**Criteria**:
1. **Risk Level**: P1 (🔥) > P2 (⚠️) > P3/P4 (✅)
2. **Violation Count**: High violators first
3. **Complexity**: Start with isolated components
4. **Dependencies**: Avoid cross-component refactors initially

**Batch Size**: 5-8 files per batch (target: ~50-80 violations per batch)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## BATCH 1 — HIGH PRIORITY MODALS (P1)

**Target**: 74 violations (19.2%)  
**Files**: 6  
**Estimated Time**: 2-3 hours  
**Risk**: Medium (modals are isolated)

| # | File | Violations | Types |
|---|------|------------|-------|
| 1 | `src/components/EvaluationModule.tsx` | 21 | Motion (11), Layout (10) |
| 2 | `src/components/ClassPlanningWizard.tsx` | 14 | Layout (12), Motion (2) |
| 3 | `src/components/FlowMode.tsx` | 13 | Motion (8), Layout (5) |
| 4 | `src/components/AnalyticsDashboard.tsx` | 12 | Motion (12) |
| 5 | `src/components/ClassroomView.tsx` | 12 | Motion (9), Layout (3) |
| 6 | `src/components/Settings.tsx` | 12 | Motion (7), Layout (5) |

**Success Criteria**:
- ✅ All inline styles use MD3 tokens
- ✅ ESLint passes
- ✅ Audit shows 0 violations for these files
- ✅ Test suite passes (32/32)
- ✅ Visual regression: no layout changes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## BATCH 2 — MEDIUM PRIORITY MODALS (P2)

**Target**: 62 violations (16.1%)  
**Files**: 7  
**Estimated Time**: 2 hours  
**Risk**: Low (self-contained dialogs)

| # | File | Violations | Types |
|---|------|------------|-------|
| 1 | `src/components/HelpModal.tsx` | 10 | Motion (6), Layout (4) |
| 2 | `src/components/LessonsPage.tsx` | 10 | Motion (6), Layout (4) |
| 3 | `src/components/AnnualPlanningWizard.tsx` | 9 | Layout (9) |
| 4 | `src/components/RegisterImportDialog.tsx` | 9 | Motion (5), Layout (4) |
| 5 | `src/components/CreateLessonFromAiModal.tsx` | 8 | Motion (5), Layout (3) |
| 6 | `src/components/ImportStudentsModal.tsx` | 8 | Motion (5), Layout (3) |
| 7 | `src/components/SmartImportModal.tsx` | 8 | Motion (4), Layout (4) |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## BATCH 3 — DASHBOARDS & VIEWS (P3)

**Target**: 46 violations (11.9%)  
**Files**: 8  
**Estimated Time**: 2 hours  
**Risk**: Medium (complex layouts)

| # | File | Violations | Types |
|---|------|------------|-------|
| 1 | `src/components/ClassCompetencyDashboard.tsx` | 7 | Motion (5), Layout (2) |
| 2 | `src/components/StudentClassroomView.tsx` | 7 | Motion (4), Layout (3) |
| 3 | `src/components/ChipInputList.tsx` | 6 | Motion (6) |
| 4 | `src/components/ImageAnalysisModal.tsx` | 6 | Motion (4), Layout (2) |
| 5 | `src/components/SlotActionModal.tsx` | 6 | Motion (4), Layout (2) |
| 6 | `src/components/UdaExportModal.tsx` | 6 | Motion (4), Layout (2) |
| 7 | `src/components/charts/BarChart.tsx` | 6 | ForbiddenProps (4), HardcodedSize (2) |
| 8 | `src/components/AssistantModal.tsx` | 5 | Layout (4), Motion (1) |

**Special Note**: BarChart has `forbiddenProps` — requires component API refactor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## BATCH 4 — UI COMPONENTS & WIZARDS (P4)

**Target**: 35 violations (9.1%)  
**Files**: 8  
**Estimated Time**: 1.5 hours  
**Risk**: Low

| # | File | Violations | Types |
|---|------|------------|-------|
| 1 | `src/components/ConsiglioClasse.tsx` | 5 | Motion (3), Layout (2) |
| 2 | `src/components/DidatticaInclusiva.tsx` | 5 | Motion (3), Layout (2) |
| 3 | `src/components/MaterialPickerModal.tsx` | 5 | Motion (3), Layout (2) |
| 4 | `src/components/PassaggioAnnoWizard.tsx` | 5 | Motion (3), Layout (2) |
| 5 | `src/components/ui/TextField.tsx` | 5 | Motion (3), Layout (2) |
| 6 | `src/components/ConsiglioClasseWizard.tsx` | 4 | Motion (2), Layout (2) |
| 7 | `src/components/Logo.tsx` | 4 | Motion (2), Layout (2) |
| 8 | `src/components/OrientamentoDashboard.tsx` | 4 | Motion (3), Layout (1) |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## BATCH 5+ — REMAINING FILES (P4-P5)

**Target**: 169 violations (43.8%)  
**Files**: ~80  
**Strategy**: Group by component type (charts, modals, forms, etc.)

**Approach**:
- Group similar components together
- Use automated patterns where possible
- Bulk validation per group

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## REMEDIATION PATTERNS

### Pattern 1: Inline Style Motion → Token

```tsx
// ❌ BEFORE
style={{ transition: '200ms ease-in-out' }}

// ✅ AFTER
style={{ 
  transition: `opacity var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard)` 
}}
```

### Pattern 2: Inline Style Layout → Token

```tsx
// ❌ BEFORE
style={{ padding: '16px', gap: '12px' }}

// ✅ AFTER
style={{ 
  padding: 'var(--md-sys-spacing-4)', 
  gap: 'var(--md-sys-spacing-3)' 
}}
```

### Pattern 3: Forbidden Props → CSS Class

```tsx
// ❌ BEFORE
<BarChart width={400} height={300} />

// ✅ AFTER
<BarChart className="bar-chart-container" />
```

```css
/* bar-chart-container.css */
.bar-chart-container {
  width: var(--md-sys-spacing-100);
  height: var(--md-sys-spacing-75);
}
```

### Pattern 4: Z-Index Inline → Token

```tsx
// ❌ BEFORE
style={{ zIndex: 1000 }}

// ✅ AFTER
style={{ zIndex: 'var(--md-sys-z-modal)' }}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## VALIDATION WORKFLOW (AFTER EACH BATCH)

### Step 1: ESLint

```bash
npm run lint
# Expected: ✅ No errors
```

### Step 2: Audit Scripts

```bash
npm run md3:theme:audit
npm run md3:motion:audit
npm run md3:component:audit
# Expected: ✅ 0 violations for modified files
```

### Step 3: Test Suite

```bash
npm test
# Expected: ✅ 32/32 passing
```

### Step 4: Build

```bash
npm run build
# Expected: ✅ Build successful
```

### Step 5: Visual Check

```bash
npm run dev
# Manual verification: no layout changes
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## PROGRESS TRACKING

### Batch Status

| Batch | Files | Violations | Status | Date | Notes |
|-------|-------|------------|--------|------|-------|
| Batch 1 | 6 | 74 | 🔄 READY | - | High priority modals |
| Batch 2 | 7 | 62 | ⏸️ PENDING | - | Medium priority modals |
| Batch 3 | 8 | 46 | ⏸️ PENDING | - | Dashboards & views |
| Batch 4 | 8 | 35 | ⏸️ PENDING | - | UI components |
| Batch 5+ | ~80 | 169 | ⏸️ PENDING | - | Remaining files |

### Overall Progress

```
Violations Resolved: 0 / 386 (0.0%)
Files Completed: 0 / 109 (0.0%)

Progress: [                    ] 0%
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## EXPECTED TIMELINE

| Phase | Duration | Violations | Completion % |
|-------|----------|------------|--------------|
| Batch 1 | 2-3 hours | 74 | 19.2% |
| Batch 2 | 2 hours | 62 | 35.3% |
| Batch 3 | 2 hours | 46 | 47.2% |
| Batch 4 | 1.5 hours | 35 | 56.3% |
| Batch 5+ | 8-10 hours | 169 | 100% |
| **Total** | **15-18 hours** | **386** | **100%** |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## NEXT ACTION

**START BATCH 1**

Files ready for remediation:
1. EvaluationModule.tsx
2. ClassPlanningWizard.tsx
3. FlowMode.tsx
4. AnalyticsDashboard.tsx
5. ClassroomView.tsx
6. Settings.tsx

**Command to begin**:
```bash
# Start with first file
code src/components/EvaluationModule.tsx
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**STATUS**: Priority Queue created, ready for file-by-file remediation
