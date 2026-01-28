# MD3 COMPONENT CONTRACTS — LEGACY MIGRATION STRATEGY

**PHASE 6 — FILE-BY-FILE REMEDIATION PLAN**

---

## 📊 AUDIT SUMMARY

**Total violations:** 386  
**Total files:** 84  
**Scanned components:** 253

**Date:** 28 Gennaio 2026  
**Report:** `reports/md3-component-contract-violations.json`

---

## 🎯 PRIORITY QUEUE (Top 30 Files)

| Priority | File | Violations | Types |
|----------|------|------------|-------|
| 🔥 P1 | `src/components/EvaluationModule.tsx` | 21 | inlineStyleMotion (11), inlineStyleLayout (10) |
| 🔥 P1 | `src/components/ClassPlanningWizard.tsx` | 14 | inlineStyleLayout (12), inlineStyleMotion (2) |
| 🔥 P1 | `src/components/FlowMode.tsx` | 13 | inlineStyleMotion (8), inlineStyleLayout (5) |
| 🔥 P1 | `src/components/AnalyticsDashboard.tsx` | 12 | inlineStyleMotion (12) |
| 🔥 P1 | `src/components/ClassroomView.tsx` | 12 | inlineStyleMotion (9), inlineStyleLayout (3) |
| 🔥 P1 | `src/components/Settings.tsx` | 12 | inlineStyleMotion (7), inlineStyleLayout (5) |
| ⚠️ P2 | `src/components/HelpModal.tsx` | 10 | inlineStyleMotion (6), inlineStyleLayout (4) |
| ⚠️ P2 | `src/components/LessonsPage.tsx` | 10 | inlineStyleMotion (6), inlineStyleLayout (4) |
| ⚠️ P2 | `src/components/AnnualPlanningWizard.tsx` | 9 | inlineStyleLayout (9) |
| ⚠️ P2 | `src/components/RegisterImportDialog.tsx` | 9 | inlineStyleMotion (5), inlineStyleLayout (4) |
| ⚠️ P2 | `src/components/CreateLessonFromAiModal.tsx` | 8 | inlineStyleMotion (5), inlineStyleLayout (3) |
| ⚠️ P2 | `src/components/ImportStudentsModal.tsx` | 8 | inlineStyleMotion (5), inlineStyleLayout (3) |
| ⚠️ P2 | `src/components/SmartImportModal.tsx` | 8 | inlineStyleMotion (4), inlineStyleLayout (4) |
| ⚠️ P3 | `src/components/ClassCompetencyDashboard.tsx` | 7 | inlineStyleMotion (5), inlineStyleLayout (2) |
| ⚠️ P3 | `src/components/StudentClassroomView.tsx` | 7 | inlineStyleMotion (4), inlineStyleLayout (3) |
| ⚠️ P3 | `src/components/charts/BarChart.tsx` | 6 | forbiddenProps (4), hardcodedSizeProps (2) |
| ⚠️ P3 | `src/components/ChipInputList.tsx` | 6 | inlineStyleMotion (6) |
| ⚠️ P3 | `src/components/ImageAnalysisModal.tsx` | 6 | inlineStyleMotion (4), inlineStyleLayout (2) |
| ⚠️ P3 | `src/components/SlotActionModal.tsx` | 6 | inlineStyleMotion (4), inlineStyleLayout (2) |
| ⚠️ P3 | `src/components/UdaExportModal.tsx` | 6 | inlineStyleMotion (4), inlineStyleLayout (2) |
| ✅ P4 | `src/components/AssistantModal.tsx` | 5 | inlineStyleLayout (4), inlineStyleMotion (1) |
| ✅ P4 | `src/components/ConsiglioClasse.tsx` | 5 | inlineStyleMotion (3), inlineStyleLayout (2) |
| ✅ P4 | `src/components/DidatticaInclusiva.tsx` | 5 | inlineStyleMotion (3), inlineStyleLayout (2) |
| ✅ P4 | `src/components/MaterialPickerModal.tsx` | 5 | inlineStyleMotion (3), inlineStyleLayout (2) |
| ✅ P4 | `src/components/PassaggioAnnoWizard.tsx` | 5 | inlineStyleMotion (3), inlineStyleLayout (2) |
| ✅ P4 | `src/components/ui/TextField.tsx` | 5 | inlineStyleMotion (3), inlineStyleLayout (2) |
| ✅ P4 | `src/components/charts/AdvancedCharts.tsx` | 4 | inlineStyleLayout (3), forbiddenProps (1) |
| ✅ P4 | `src/components/ConsiglioClasseWizard.tsx` | 4 | inlineStyleMotion (2), inlineStyleLayout (2) |
| ✅ P4 | `src/components/Logo.tsx` | 4 | inlineStyleMotion (2), inlineStyleLayout (2) |
| ✅ P4 | `src/components/OrientamentoDashboard.tsx` | 4 | inlineStyleMotion (3), inlineStyleLayout (1) |

---

## 📋 MIGRATION WORKFLOW

### STEP 1: Setup Environment

```bash
# Ensure all protection layers are active
npm run md3:component:audit        # Baseline audit
npm run lint                        # ESLint baseline
npm test                            # Test suite baseline

# Create working branch
git checkout -b phase6/component-contracts-remediation
```

### STEP 2: File-by-File Remediation

**For each file in priority queue:**

1. **Audit specific file**
   ```bash
   # Run full audit to get JSON report
   npm run md3:component:audit
   
   # Open report
   cat reports/md3-component-contract-violations.json | jq '.violations[] | select(.file == "src/components/EvaluationModule.tsx")'
   ```

2. **Analyze violations**
   - Read violation types
   - Identify patterns (repeated inline styles, etc.)
   - Plan refactor strategy

3. **Apply fixes**

   **Pattern A: Forbidden Props → CSS Class**
   ```tsx
   // Before
   <Component width="200px" padding="16px" />
   
   // After
   <Component className="my-component-layout" />
   ```
   ```css
   /* In component CSS */
   .my-component-layout {
     width: var(--md-sys-spacing-50);
     padding: var(--md-sys-spacing-4);
   }
   ```

   **Pattern B: Inline Style Layout → MD3 Tokens**
   ```tsx
   // Before
   <div style={{ width: '100px', padding: '16px' }}>
   
   // After
   <div style={{ width: 'var(--md-sys-spacing-25)', padding: 'var(--md-sys-spacing-4)' }}>
   ```

   **Pattern C: Inline Style Motion → MD3 Tokens**
   ```tsx
   // Before
   <div style={{ transition: '200ms ease-in-out' }}>
   
   // After
   <div style={{ transition: `transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)` }}>
   ```

   **Pattern D: Utility className → MD3 Class**
   ```tsx
   // Before
   <div className="w-full p-4 bg-blue-500">
   
   // After
   <div className="m3-surface-container">
   ```

4. **Validate changes**
   ```bash
   # Visual check (dev server)
   npm run dev
   
   # ESLint validation
   npm run lint src/components/YourFile.tsx
   
   # Test validation
   npm test
   
   # Re-run audit
   npm run md3:component:audit
   ```

5. **Commit incrementally**
   ```bash
   git add src/components/YourFile.tsx
   git commit -m "fix(md3): Phase 6 - EvaluationModule.tsx component contract compliance
   
   - Remove forbidden props (width, height)
   - Convert inline styles to MD3 tokens
   - Replace utility classes with m3- prefixed classes
   
   Violations fixed: 21
   Types: inlineStyleMotion (11), inlineStyleLayout (10)
   Ref: MD3_COMPONENT_CONTRACTS.md"
   ```

### STEP 3: Validation Checkpoints

**After every 5 files:**
```bash
# Full audit
npm run md3:component:audit

# Full test suite
npm test

# Visual regression (if available)
npm run test:visual

# Track progress
echo "Files completed: X/84" >> phase6-progress.txt
```

### STEP 4: Final Validation

```bash
# Clean audit
npm run md3:component:audit
# Expected: EXIT 0, 0 violations

# Clean ESLint
npm run lint
# Expected: No design-system/* errors

# All tests passing
npm test
# Expected: All tests PASS

# Build succeeds
npm run build
# Expected: Successful build
```

---

## 🔄 BATCH PROCESSING STRATEGY

### Low-Risk Batch (P4 files, <5 violations)

**Can be processed in groups of 3-5 files:**

```bash
# Example batch
src/components/AssistantModal.tsx
src/components/ConsiglioClasse.tsx
src/components/DidatticaInclusiva.tsx

# Apply same patterns across files
# Test batch together
# Single commit for batch
```

### Medium-Risk (P2-P3, 6-10 violations)

**Process individually or pairs:**

```bash
# One at a time or max 2 files
src/components/HelpModal.tsx
src/components/LessonsPage.tsx

# Individual validation
# Separate commits
```

### High-Risk (P1, >10 violations)

**ALWAYS process individually:**

```bash
# One file per session
src/components/EvaluationModule.tsx

# Thorough testing
# Visual verification
# Dedicated commit
```

---

## ⚠️ SPECIAL CASES

### Charts Components

**Issue:** `forbiddenProps` on SVG elements (width, height)

**Solution:** SVG attributes are **ALLOWED** (not React props):
```tsx
// ✅ ALLOWED — SVG attributes
<svg width="100%" height={chartHeight} viewBox="...">
  <rect width={barWidth} height={barHeight} />
</svg>

// ❌ FORBIDDEN — React component props
<Chart width="200px" height="100px" />
```

**Action:** May require ESLint rule exemption for SVG context.

### Dynamic Styles (JS-calculated values)

**Issue:** Dynamic values can't be pure CSS

**Solution:** Inline styles with token composition:
```tsx
// ✅ ALLOWED — Dynamic with tokens
const gridColumns = `repeat(${count}, 1fr)`;
<div style={{
  display: 'grid',
  gridTemplateColumns: gridColumns,
  gap: 'var(--md-sys-spacing-4)'
}}>
```

### Third-Party Components

**Issue:** Library components with forbidden props

**Solution:** Wrapper pattern:
```tsx
// ❌ Can't modify library
import { ExternalComponent } from 'library';

// ✅ Create MD3 wrapper
export function M3ExternalComponent({ ...props }) {
  return (
    <div className="m3-external-wrapper">
      <ExternalComponent {...props} />
    </div>
  );
}
```

---

## 📈 PROGRESS TRACKING

### Metrics to Track

```json
{
  "totalFiles": 84,
  "totalViolations": 386,
  "filesCompleted": 0,
  "violationsFixed": 0,
  "priority": {
    "P1": { "total": 6, "completed": 0 },
    "P2": { "total": 7, "completed": 0 },
    "P3": { "total": 11, "completed": 0 },
    "P4": { "total": 6, "completed": 0 }
  },
  "violationTypes": {
    "inlineStyleMotion": { "total": 181, "fixed": 0 },
    "inlineStyleLayout": { "total": 170, "fixed": 0 },
    "forbiddenProps": { "total": 17, "fixed": 0 },
    "inlineStyleZIndex": { "total": 13, "fixed": 0 },
    "classNameUtilities": { "total": 3, "fixed": 0 },
    "hardcodedSizeProps": { "total": 2, "fixed": 0 }
  }
}
```

### Update Command

```bash
# After each file
npm run md3:component:audit
node scripts/track-phase6-progress.js  # Generate progress report
```

---

## ✅ COMPLETION CRITERIA

**Phase 6 remediation is COMPLETE when:**

1. ✅ Audit clean: `npm run md3:component:audit` → EXIT 0
2. ✅ No ESLint errors: `npm run lint` → 0 design-system/* errors
3. ✅ All tests passing: `npm test` → 100% pass
4. ✅ Build succeeds: `npm run build` → No errors
5. ✅ Visual regression: No unintended layout changes
6. ✅ JSON report: `totalViolations === 0`
7. ✅ Pre-commit hook: Active and passing

---

## 🚀 POST-REMEDIATION

### Phase 6 Lock

```bash
# Activate pre-commit hook
# Update .husky/pre-commit to include component contract audit

# Tag release
git tag -a phase6-complete -m "Phase 6: Component Contracts COMPLETE"
git push --tags

# Update execution plan
# Mark Phase 6 as ✅ COMPLETE & LOCKED
```

### Next Phase (TBD)

- Component library refactor (optional)
- Visual regression automation
- Performance optimization
- Developer tooling improvements

---

## 📞 SUPPORT

**Issues during remediation:**

1. Check `docs/MD3_COMPONENT_CONTRACTS.md` (troubleshooting section)
2. Review JSON report for specific violation details
3. Run `npm run lint` for ESLint guidance
4. Consult best practices in documentation

**Blockers:**

- Create GitHub issue with label `phase6-remediation`
- Include file path, violation type, proposed fix
- Tag as `governance` for priority review

---

**END OF MIGRATION STRATEGY**

**Date:** 28 Gennaio 2026  
**Status:** READY FOR EXECUTION  
**Priority:** Start with P1 files (6 files, 82 violations)
