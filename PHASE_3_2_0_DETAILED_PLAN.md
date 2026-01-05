# Phase 3.2.0 - Bundle Analysis & Optimization Planning
## Detailed Execution Plan (Today)

**Date:** January 5, 2026  
**Duration:** 2-3 hours  
**Objective:** Establish performance baseline and create detailed optimization roadmap  

---

## Task Checklist

### Task 1: Generate Bundle Size Baseline (45 min)

**Step 1.1: Build and capture metrics**
```bash
# Clean previous build
rm -rf dist

# Build with current configuration
npm run build 2>&1 | tee build_output.txt

# Capture key metrics:
# - Total bundle size
# - Gzip size
# - Module count
# - Build time
```

**Step 1.2: Analyze with Vite's built-in reporting**
```bash
# Vite provides size information during build
# Look for output like:
# ✓ built in Xs
# dist/assets/index-XXX.js   530.26 kB │ gzip:  211.29 kB
```

**Step 1.3: Create baseline file**
Create `BUNDLE_BASELINE_METRICS.md`:
```
# Bundle Size Baseline
Date: January 5, 2026 (Phase 3.3 completion)

## Metrics
- Main bundle: XXX kB (gzip: XXX kB)
- Build time: XXs
- Total modules: 2422
- Test pass rate: 1157/1157

## Chunk breakdown
(if using code splitting)
```

---

### Task 2: Dependency Analysis (45 min)

**Step 2.1: List all dependencies**
```bash
npm list --depth=0 > dependencies_list.txt
```

**Step 2.2: Analyze package sizes**
```bash
# For each major dependency, check size:
npm view {package-name} dist.unpackedSize
npm view @mui/material dist.unpackedSize
npm view react dist.unpackedSize
npm view react-dom dist.unpackedSize
npm view vite dist.unpackedSize
```

**Step 2.3: Check for duplicates**
```bash
npm ls | grep -E "^\s{2}[^@]" | sort | uniq -d
```

**Step 2.4: Document findings**
Create `DEPENDENCY_ANALYSIS.md`:
```
# Dependency Analysis

## Largest Dependencies
1. @mui/material: XXX kB
2. react-dom: XXX kB
3. react: XXX kB
...

## Duplicate Dependencies
(list any found)

## Unused Dependencies  
(list candidates for removal)

## Optimization Opportunities
- Replace XXX with YYY (saves X kB)
- Remove unused XXX (saves X kB)
...
```

---

### Task 3: Route Structure & Code Splitting Strategy (45 min)

**Step 3.1: Review route configuration**
```bash
# Find main router file
find src -name "*router*" -o -name "*route*" | head -10
```

**Step 3.2: Map views and sizes (estimate)**
```
Routes (current):
├── / (Dashboard)
│   ├── ReportisticaHub (~80 kB)
│   ├── StudentManager (~30 kB)
│   ├── Evaluations (~25 kB)
│   └── Analytics (~20 kB)
├── /calendar (~60 kB)
├── /studio (~50 kB)
├── /settings (~30 kB)
└── /classroom/:id (~40 kB)

Keep in main bundle:
- Core hooks
- Modal components (low threshold)
- Common utilities
- Theme/design tokens
```

**Step 3.3: Create code splitting map**
Create `CODE_SPLITTING_STRATEGY.md`:
```
# Code Splitting Strategy

## Priority 1 (High Impact)
- ReportisticaHub: 80 kB savings
- Calendar: 60 kB savings
- Studio: 50 kB savings

## Priority 2 (Medium Impact)
- Settings: 30 kB savings
- Classroom: 40 kB savings

## Keep in Main Bundle
- Common layouts
- Navigation components
- Modal/Popover containers
- Shared hooks

## Expected Savings
- Initial bundle: -150-200 kB (28-37% reduction)
- Total gzip: 211 kB → 150 kB (29% reduction)
```

---

### Task 4: Performance Bottleneck Identification (30 min)

**Step 4.1: Run Chrome DevTools analysis**
1. Open app in Chrome with dev server
2. Open Performance tab
3. Start recording
4. Navigate through app (all main routes)
5. Stop recording
6. Analyze flame chart

**Key metrics to check:**
- FCP (First Contentful Paint): Target <1.5s
- LCP (Largest Contentful Paint): Target <1.8s
- TTI (Time to Interactive): Target <3.0s
- CLS (Cumulative Layout Shift): Target <0.1

**Step 4.2: React Profiler analysis**
```javascript
// In browser console:
// Enable React Profiler
// Repeat common actions:
// - Load calendar (100 days)
// - Load students list (500+ items)
// - Open/close modal
// - Navigate routes

// Screenshot results
```

**Step 4.3: Document findings**
Create `PERFORMANCE_BOTTLENECKS.md`:
```
# Performance Bottleneck Report

## Current Metrics
- FCP: X.XXs
- LCP: X.XXs
- TTI: X.XXs
- CLS: X.XX

## Identified Bottlenecks
1. Calendar rendering (> 100ms for full month)
2. StudentManager list with 500+ items (slow scroll)
3. Route transitions (~300-400ms)
4. Modal animations (target <50ms)

## Root Causes
- Missing React.memo on expensive components
- Full list renders (should use virtualization)
- Large route bundles loaded synchronously
- Inefficient calculations in render

## Priority Fixes
1. Route code splitting (immediate impact)
2. React.memo on Calendar (quick win)
3. Virtual scrolling for StudentManager (if needed)
4. useMemo optimization (incremental)
```

---

### Task 5: Create Optimization Priority Matrix (30 min)

**Analyze impact vs. effort:**

| Initiative | Est. Savings | Effort | Impact | Days | Priority |
|-----------|---|--------|--------|------|----------|
| Code split ReportisticaHub | 80 kB | 3h | High | 1 | P1 |
| Code split Calendar | 60 kB | 2h | High | 1 | P1 |
| React.memo Calendar | - | 1h | High | 0.5 | P1 |
| Remove unused deps | 50 kB | 2h | High | 1 | P1 |
| Code split Settings | 30 kB | 1h | Medium | 0.5 | P2 |
| Code split Classroom | 40 kB | 2h | Medium | 1 | P2 |
| useCallback in lists | - | 1h | Medium | 0.5 | P2 |
| useMemo optimization | - | 2h | Medium | 1 | P2 |

**Create `OPTIMIZATION_PRIORITY_MATRIX.md`**

---

### Task 6: Create Daily Execution Plan (30 min)

**Day 1 (Tomorrow) - Code Splitting Phase 1:**
```
- 09:00-10:00: React.lazy() infrastructure
- 10:00-11:30: ReportisticaHub lazy loading
- 11:30-12:00: Testing & verification
- 13:00-14:00: Calendar lazy loading
- 14:00-15:00: Testing & bundling
- 15:00-17:00: React.memo on priority components
- 17:00: Daily summary & metrics
```

**Day 2 - Code Splitting Phase 2 & Runtime Optimization:**
```
- 09:00-10:00: Studio view lazy loading
- 10:00-11:00: Classroom view lazy loading
- 11:00-12:00: Testing & bundle verification
- 13:00-15:00: React.memo expansion
- 15:00-17:00: useMemo/useCallback optimization
- 17:00: Performance profiling
```

**Day 3-4 - Dependency & Final Optimization:**
```
- 09:00-10:00: Dependency audit
- 10:00-12:00: Remove unused packages
- 13:00-14:00: Test suite validation
- 14:00-16:00: Final performance testing
- 16:00-17:00: Metrics collection & report
```

**Create `EXECUTION_TIMELINE.md`**

---

## Files to Create Today

1. ✅ **PHASE_3_2_KICKOFF_PLAN.md** (already created)
2. **BUNDLE_BASELINE_METRICS.md** - Current bundle analysis
3. **DEPENDENCY_ANALYSIS.md** - Package audit
4. **CODE_SPLITTING_STRATEGY.md** - Route splitting plan
5. **PERFORMANCE_BOTTLENECKS.md** - Profiling results
6. **OPTIMIZATION_PRIORITY_MATRIX.md** - Impact/effort analysis
7. **EXECUTION_TIMELINE.md** - Daily detailed plan

---

## Verification Checklist

Before moving to Day 1 (Code Splitting):

- [ ] Build completes successfully (2422 modules)
- [ ] Current bundle size documented (~530 kB)
- [ ] Test suite still passing (1157/1157)
- [ ] Route structure mapped clearly
- [ ] Bottlenecks identified and prioritized
- [ ] Priority matrix created
- [ ] Daily timeline finalized
- [ ] All documentation created

---

## Success Criteria for Today

✅ **Metrics captured:**
- Bundle size baseline: 530.26 kB (gzip: 211.29 kB)
- Build time: ~12.55s
- Module count: 2422
- Test pass rate: 1157/1157

✅ **Analysis complete:**
- 5+ large dependencies identified
- 3-5 code splitting opportunities mapped
- 2-3 bottlenecks identified
- P1/P2 priority matrix created

✅ **Documentation:**
- 7 analysis documents created
- Execution timeline detailed
- Daily plan finalized

✅ **Team ready:**
- Clear roadmap for tomorrow
- Success metrics defined
- Risk mitigation planned

---

## Ready for Day 1 Tomorrow?

**Checklist:**
- [ ] All analysis documents reviewed
- [ ] Team alignment on approach
- [ ] Dev environment ready
- [ ] Test suite verified
- [ ] Git branch ready for Day 1 work

**Expected Outcome by End of Today:**
- Clear performance baseline
- Detailed optimization roadmap
- Team ready to execute Day 1 (Code Splitting)
- Estimated 18-24 hours work for Phase 3.2 total

---

**Status:** ✅ **PHASE 3.2.0 READY TO EXECUTE**  
**Next:** Run analysis tasks and create documentation  
**Target Completion:** Today by 17:00
