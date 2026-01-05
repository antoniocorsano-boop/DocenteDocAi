# Phase 3.2 - Performance Optimization
## Week 1 Kickoff & Bundle Analysis Plan

**Status:** 🚀 **STARTING TODAY**  
**Date Started:** January 5, 2026  
**Target Duration:** 1.5-2 weeks (accelerated)  
**Goal:** Reduce bundle size by 30%, improve LCP by 28%  

---

## Executive Summary

Phase 3.2 focuses on performance optimization through:
1. **Code Splitting** - Route-based lazy loading
2. **Bundle Analysis** - Identify and optimize large dependencies
3. **Runtime Performance** - Component memoization and rendering optimization
4. **Asset Optimization** - Fonts, images, and static resources

**Current Metrics:**
- Main bundle: 530.26 kB (gzip: 211.29 kB)
- Build time: 12.55s (stable from Phase 3.3)
- Modules: 2422
- Test coverage: 1157/1157 (100%)

**Target Metrics:**
- Main bundle: <400 kB (gzip: <150 kB)
- LCP: ~1.8s (from ~2.5s)
- Build time: <10s
- Lighthouse score: >85 (all metrics)

---

## Phase 3.2 Phases

### Phase 3.2.0: Analysis & Planning (Today - 2-3 hours)
**Objective:** Understand current bundle composition and identify optimization opportunities

**Tasks:**
1. ✅ Create bundle size baseline report
2. ✅ Analyze largest dependencies
3. ✅ Map route structure for code splitting
4. ✅ Identify performance bottlenecks
5. ✅ Plan optimization strategy

**Deliverables:**
- Bundle analysis report
- Dependency optimization plan
- Route-based code splitting map
- Performance baseline metrics

**Expected Outcome:** Clear roadmap for Days 1-5

---

### Phase 3.2.1: Code Splitting Implementation (Days 1-3, ~12 hours)
**Objective:** Implement route-based lazy loading to reduce initial bundle

**Primary Targets:**
1. **ReportisticaHub** (~80 kB) - Largest view
2. **Calendar** (~60 kB) - Complex component
3. **Studio** (~50 kB) - Content creation
4. **Settings** (~30 kB) - Configuration

**Implementation Steps:**
1. Set up React.lazy() + Suspense boundaries
2. Lazy-load route components
3. Create loading placeholders
4. Test chunk loading
5. Validate build output

**Expected Savings:** 150-200 kB (initial bundle reduction)

---

### Phase 3.2.2: Runtime Performance (Days 3-4, ~8 hours)
**Objective:** Optimize component rendering and memoization

**Focus Areas:**
1. **React.memo for expensive components**
   - Calendar component (complex re-renders)
   - StudentManager list (frequent updates)
   - EventActionPopover (frequent opens/closes)

2. **useMemo optimizations**
   - Heavy calculations in lists
   - Filter/sort operations
   - Computed properties

3. **useCallback optimizations**
   - Event handlers in lists
   - Debounced search functions
   - Modal handlers

**Expected Improvements:**
- List rendering: <100ms for 1000 items
- Modal open/close: <50ms
- Scroll performance: 60 FPS maintained

---

### Phase 3.2.3: Dependency Optimization (Day 4-5, ~6 hours)
**Objective:** Audit and replace/remove large dependencies

**Analysis Plan:**
1. List all npm dependencies with sizes
2. Identify unused packages
3. Find lightweight alternatives
4. Test compatibility
5. Update imports

**Common Opportunities:**
- Material Icons → Material Symbols (already done ✓)
- Moment.js → Date-fns (if used)
- Lodash → Native ES6 (where applicable)
- Large polyfills → Check browser support

**Expected Savings:** 50-100 kB

---

## Today's Detailed Plan (Phase 3.2.0)

### Task 1: Bundle Size Analysis (30 min)

**Step 1.1: Create baseline report**
```bash
npm run build 2>&1 | grep -E "(kB|modules)"
npm list | wc -l  # Dependency count
```

**Step 1.2: Analyze large files**
```bash
# Install bundle analyzer if not present
npm install --save-dev vite-plugin-visualizer

# Add to vite.config.ts:
visualizer({
  open: true,
  gzipSize: true,
  brotliSize: true,
})
```

**Step 1.3: Generate visualization**
```bash
npm run build -- --analyze
```

**Deliverable:** `BUNDLE_BASELINE_REPORT.md` with:
- Total bundle size (gzip)
- Top 20 largest chunks/dependencies
- Module count breakdown
- Unused dependencies list

### Task 2: Route Structure Analysis (30 min)

**Step 2.1: Map current routes**
- Review router configuration
- List all main routes
- Estimate component sizes
- Identify heavy views

**Step 2.2: Plan code splitting strategy**
```
Routes to split (priority order):
1. /reportistica - ReportisticaHub (80+ kB)
2. /calendar - CalendarView (60+ kB)  
3. /studio - StudioView (50+ kB)
4. /settings - SettingsView (30+ kB)
5. /classroom/:id - ClassroomView (40+ kB)

Keep in main bundle:
- / - Dashboard (entry point)
- /students - StudentManager (frequently used)
- Modal & Popover components
- Shared utilities & hooks
```

**Deliverable:** `CODE_SPLITTING_PLAN.md`

### Task 3: Performance Bottleneck Analysis (30 min)

**Step 3.1: Chrome DevTools baseline**
- Measure initial load (Cold start)
- Measure navigation between routes
- Identify slow components
- Check FCP, LCP, TTI metrics

**Step 3.2: React Profiler analysis**
- Profile Calendar rendering (100 days)
- Profile StudentManager with 500+ items
- Identify unnecessary re-renders
- Spot heavy computations

**Step 3.3: Network analysis**
- Check bundle chunk sizes
- Analyze lazy-load patterns
- Identify request waterfalls

**Deliverable:** `PERFORMANCE_BASELINE_REPORT.md` with:
- Current FCP, LCP, TTI
- Largest rendering bottlenecks
- Memory usage patterns
- Network waterfall visualization

### Task 4: Optimization Priority Matrix (15 min)

**Create impact vs. effort assessment:**

| Optimization | Bundle Savings | Effort | Impact | Priority |
|--------------|---|--------|--------|----------|
| Code split ReportisticaHub | 80 kB | 3h | High | P1 |
| Code split Calendar | 60 kB | 2h | High | P1 |
| React.memo Calendar | - | 1h | High | P1 |
| Code split Settings | 30 kB | 1h | Medium | P2 |
| Remove unused deps | 50 kB | 2h | High | P1 |
| useCallback in lists | - | 1h | Medium | P2 |
| useMemo optimization | - | 2h | Medium | P2 |

**Focus on P1 items first** (highest impact, reasonable effort)

### Task 5: Create Phase 3.2 Plan Document (15 min)

**Output:** Comprehensive plan with:
1. Executive summary
2. Current state analysis
3. Optimization roadmap
4. Daily breakdown
5. Success metrics
6. Risk assessment

---

## Current State Snapshot

### Build Metrics (as of Phase 3.3 completion)
```
✓ Build: 2422 modules
✓ Build time: 12.55s (stable)
✓ Test pass rate: 1157/1157 (100%)
✓ PWA: 113 entries precached
✓ Regressions: 0
```

### Known Performance Characteristics
- **Calendar rendering:** ~200ms for full month view
- **StudentManager list:** Starts slowing at 500+ items
- **Navigation:** ~300-400ms route transition
- **Modals:** ~50-100ms open/close
- **Search:** Debounced to 300ms input delay

### Optimization Opportunities Identified
1. Route-based code splitting (high impact, proven pattern)
2. React.memo on expensive components (quick win)
3. Virtual scrolling for long lists (if needed after analysis)
4. Dependency size audit (unknown potential)
5. Font loading optimization (incremental)

---

## Next Steps (Today)

### Immediate (Today, 2-3 hours)
- [ ] Run bundle analyzer
- [ ] Create baseline metrics
- [ ] Document current route structure
- [ ] Identify largest dependencies
- [ ] Create optimization priority list

### Tomorrow (Days 1-2, Phase 3.2.1)
- [ ] Implement React.lazy() for priority routes
- [ ] Add Suspense boundaries
- [ ] Create loading UI placeholders
- [ ] Test code splitting functionality
- [ ] Validate chunk sizes

### This Week (Days 3-5, Phases 3.2.2 & 3.2.3)
- [ ] Implement React.memo on expensive components
- [ ] Add useMemo/useCallback optimizations
- [ ] Audit and remove unused dependencies
- [ ] Final performance testing
- [ ] Create completion report

---

## Success Criteria

### Bundle Size
- ✅ Main bundle <400 kB (gzip <150 kB)
- ✅ Individual route chunks <200 kB each
- ✅ Largest dependency audit completed

### Runtime Performance
- ✅ LCP <1.8s (target)
- ✅ List rendering <100ms for 1000 items
- ✅ Modal animations 60 FPS
- ✅ No janky scrolling

### Build & Tests
- ✅ Build time <10s
- ✅ All 1157 tests passing (0 regressions)
- ✅ Zero breaking changes
- ✅ 100% backward compatible

### Verification
- ✅ Lighthouse audit >85 (all metrics)
- ✅ Performance monitoring in place
- ✅ Metrics tracked over time

---

## Phase 3.2 Timeline

```
Today (Planning):
  - 14:00: Bundle analysis & route mapping
  - 15:00: Bottleneck identification
  - 16:00: Priority matrix creation
  - 17:00: Daily plan finalization

Tomorrow (Code Splitting - Day 1):
  - 09:00: React.lazy() setup
  - 11:00: ReportisticaHub splitting
  - 14:00: Calendar splitting
  - 17:00: Testing & validation

Day 2 (Code Splitting & Runtime - Days 2-3):
  - 09:00: Remaining route splits
  - 12:00: React.memo implementation
  - 15:00: useMemo/useCallback optimization
  - 17:00: Performance profiling

Day 3 (Dependencies & Final - Days 4-5):
  - 09:00: Dependency audit
  - 12:00: Remove unused packages
  - 14:00: Final performance testing
  - 16:00: Report generation
  - 17:00: Phase 3.2 completion sign-off
```

**Estimated Total:** 18-24 hours over 5 working days

---

## Monitoring & Metrics

### Before & After Comparison
Will track:
- Bundle size (total, gzip)
- LCP (Largest Contentful Paint)
- FCP (First Contentful Paint)
- TTI (Time to Interactive)
- Lighthouse scores
- Build time
- Module count

### Continuous Monitoring
- Add bundle size budget to CI/CD
- Track performance metrics per build
- Alert on regressions
- Weekly performance reports

---

## Risks & Mitigation

### Risk 1: Code Splitting Breaks Route Navigation
**Mitigation:**
- Comprehensive testing of all routes
- Fallback error boundaries
- Gradual rollout with feature flags

### Risk 2: Dynamic Imports Reduce Performance
**Mitigation:**
- Careful chunk size management
- Preload critical chunks
- Measure actual improvements before/after

### Risk 3: Test Suite Slowdown
**Mitigation:**
- Run tests in parallel
- Cache dependencies
- Optimize test setup

### Risk 4: Memory Usage Increases
**Mitigation:**
- Monitor memory during load
- Implement cleanup/gc triggers
- Set memory budgets

---

## Ready to Begin? ✅

### Prerequisites Met
- ✅ Phase 3.3 complete (100% WCAG AA)
- ✅ Test suite stable (1157/1157)
- ✅ Build pipeline working (12.55s)
- ✅ Git history clean
- ✅ Documentation comprehensive

### Team Readiness
- ✅ Performance analysis tools available
- ✅ Chrome DevTools set up
- ✅ Bundle analyzer ready
- ✅ Metrics collection planned

**Status:** ✅ **READY TO START PHASE 3.2**

---

**Next Action:** Execute Phase 3.2.0 tasks (bundle analysis) today  
**Expected Completion:** Phase 3.2 fully complete by January 10, 2026  
**Final Review:** January 10, 2026 evening
