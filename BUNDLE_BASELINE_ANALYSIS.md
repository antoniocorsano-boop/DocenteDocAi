# Phase 3.2 - Bundle Analysis Report
## Baseline Metrics (January 5, 2026)

**Analysis Date:** January 5, 2026  
**Status:** Phase 3.3 complete, Phase 3.2 starting  
**Baseline:** Pre-optimization metrics for Phase 3.2  

---

## Current Bundle Metrics

### Overall Bundle Size
```
Main bundle (index):        530.26 kB → gzip: 211.29 kB
App bundle:                 754.65 kB → gzip: 243.14 kB
Service Worker:              25.85 kB → gzip:   8.38 kB
Build time:                  10.54s
Module count:                2422
PWA precache entries:        113 (5063.62 KiB total)
```

### Key Observations
- **Main bundle:** 530.26 kB is relatively large for SPA
- **Gzip compression:** 211.29 kB (40% compression ratio)
- **App bundle:** 754.65 kB suggests significant app code
- **Build time:** 10.54s (target <10s, close to threshold)

### Optimization Potential
- **Target main bundle:** <400 kB (gzip <150 kB)
- **Potential savings:** ~130-150 kB (24-28% reduction)
- **Expected gzip savings:** ~60-65 kB (28-31% reduction)

---

## Top-Level Dependencies (Inventory)

### Runtime Dependencies (Production)
```
React & DOM:
- react@18.3.1               ← Core framework
- react-dom@18.3.1           ← DOM rendering

Material UI & Design:
- @mui/material@7.3.6        ← Large dependency (~200+ kB)
- @emotion/react@11.14.0     ← CSS-in-JS (MUI dependency)
- @emotion/styled@11.14.1    ← Styled components
- @fontsource/roboto@5.2.9   ← Font files (~200 kB total)

Utilities & Libraries:
- lodash-es@4.17.22          ← Utility library (~70 kB)
- papaparse@5.5.3            ← CSV parsing
- file-saver@2.0.5           ← File download
- mammoth@1.11.0             ← DOCX parsing
- docx@9.5.1                 ← DOCX generation

PDF Libraries (LARGE):
- jspdf@3.0.4                ← PDF generation (~100+ kB)
- pdf-lib@1.17.1             ← PDF manipulation (~50+ kB)
- pdfjs-dist@5.4.530         ← PDF viewer (~300+ kB!)

Drag & Drop:
- @dnd-kit/core@6.3.1        ← Drag-n-drop hooks
- @dnd-kit/utilities@3.2.2   ← Utilities for dnd

Data & Tracing:
- @google/genai@1.34.0       ← Google AI integration
- @opentelemetry/*           ← Observability/tracing
  - api@1.9.0
  - auto-instrumentations-web@0.54.0
  - exporter-otlp-http@0.26.0
  - exporter-trace-otlp-http@0.208.0
  - sdk-trace-base@2.2.0
  - sdk-trace-web@2.2.0
  - web@0.24.0
```

### Dev Dependencies
```
Testing & Tooling:
- @playwright/test@1.57.0    ← E2E testing
- @testing-library/react@16.3.1
- @testing-library/jest-dom@6.9.1
- vitest@4.0.16              ← Unit testing
- @vitest/coverage-v8@4.0.16

Linting & Type Checking:
- eslint@9.39.2
- @eslint/js@9.39.2
- eslint-plugin-react@7.37.5
- typescript-eslint@8.51.0
- @types/react@18.3.27
- @types/react-dom@18.3.7
- @types/node@20.19.27
- @types/papaparse@5.5.2

Build & Dev:
- vite@7.3.0
- @vitejs/plugin-react@5.1.2
- vite-plugin-pwa@1.2.0
- vite-plugin-html@3.2.2
- jsdom@27.4.0
- fake-indexeddb@6.2.5

Other:
- husky@8.0.3
- lint-staged@15.5.2
- globals@16.5.0
- @axe-core/cli@4.11.0 (accessibility testing)
- @axe-core/playwright@4.11.0
- axe-core@4.11.0
```

---

## Largest Dependencies Analysis

### Estimated Bundle Contribution

| Dependency | Est. Size | Gzip | Notes |
|-----------|-----------|------|-------|
| pdfjs-dist | 300+ kB | 100+ kB | **Critical** - PDF viewer |
| @mui/material | 200+ kB | 60+ kB | **Critical** - UI framework |
| jspdf | 100+ kB | 30+ kB | PDF generation |
| pdf-lib | 50+ kB | 15+ kB | PDF manipulation |
| @emotion/react | 40+ kB | 12+ kB | CSS-in-JS (MUI dependency) |
| @fontsource/roboto | 200 kB | 5 kB | Font files |
| lodash-es | 70+ kB | 25+ kB | Utility library |
| react | 40+ kB | 13+ kB | Framework |
| react-dom | 40+ kB | 13+ kB | Framework |
| OpenTelemetry suite | 50+ kB | 15+ kB | Observability/tracing |
| @google/genai | 40+ kB | 12+ kB | Google AI SDK |

**Total of top 10:** ~900+ kB (uncompressed), ~280+ kB (gzip)

---

## Critical Observations

### 🚨 High Impact Opportunities

1. **PDF Libraries** (pdfjs-dist: 300+ kB)
   - Only used for PDF viewing in reports
   - **Opportunity:** Lazy-load with route code splitting
   - **Estimated savings:** 100-120 kB gzip
   - **Feasibility:** HIGH (can split off reports view)

2. **PDF Generation** (jspdf + pdf-lib: 150+ kB)
   - Used for report export functionality
   - **Opportunity:** Lazy-load with code splitting
   - **Estimated savings:** 40-50 kB gzip
   - **Feasibility:** HIGH (can defer to action)

3. **Material UI** (200+ kB)
   - Core framework for all UI
   - **Opportunity:** Tree-shake unused components
   - **Estimated savings:** 10-30 kB gzip
   - **Feasibility:** MEDIUM (requires careful auditing)

4. **Font Files** (200 kB)
   - Roboto font from @fontsource
   - **Opportunity:** Self-host or use system fonts
   - **Estimated savings:** 150-200 kB (not gzipped)
   - **Feasibility:** MEDIUM (design system impact)

### ⚠️ Medium Impact Items

1. **Lodash-es** (70+ kB)
   - Can often be replaced with ES6 native methods
   - **Estimated savings:** 30-50 kB gzip
   - **Feasibility:** MEDIUM (requires refactoring)

2. **OpenTelemetry** (50+ kB)
   - Observability/tracing for debugging
   - **Opportunity:** Load only in dev/staging
   - **Estimated savings:** 15-20 kB gzip
   - **Feasibility:** MEDIUM (feature flag)

3. **Google GenAI** (40+ kB)
   - Google AI integration
   - **Opportunity:** Lazy-load when feature used
   - **Estimated savings:** 12-15 kB gzip
   - **Feasibility:** MEDIUM (depends on usage)

### ✓ Keep As-Is

1. **React & React-DOM** (80+ kB)
   - Core framework, required
   - Feasibility: NOT APPLICABLE

2. **@emotion/react & @emotion/styled** (40+ kB)
   - MUI dependency, required
   - Feasibility: NOT APPLICABLE

---

## Dependency Optimization Strategy

### Phase 3.2 - Primary Focus

#### Week 1 (Immediate - High ROI)
1. **Route-based code splitting** (estimated -60-80 kB gzip)
   - Split ReportisticaHub → lazy-load PDF libraries
   - Split Calendar, Studio, Settings → lazy-load when needed
   - Move from initial bundle to dynamic chunks

2. **React.memo optimization** (estimated -5-10 kB after code split)
   - Prevent expensive re-renders
   - Reduce runtime memory

#### Week 2 (Secondary - Medium ROI)
3. **Remove unused MUI components** (estimated -10-20 kB gzip)
   - Audit actual usage
   - Tree-shake unused exports

4. **Audit lodash-es usage** (estimated -10-20 kB gzip)
   - Replace with ES6 native methods where possible
   - Keep only essential lodash functions

### Phase 3.3+ (Future)
- Font optimization (serve from CDN, subset fonts)
- OpenTelemetry feature flag (dev only)
- Google GenAI lazy load
- Potential library replacements

---

## Code Splitting Strategy

### Route-Based Splitting Plan

```
Current (Single Bundle):
  dist/assets/index-XXX.js     530.26 kB
  dist/assets/App-XXX.js       754.65 kB

Target (Multiple Chunks):
  dist/assets/index-XXX.js     ~350-380 kB (core)
  dist/assets/reportistica-XXX.js  ~150 kB (PDF libs)
  dist/assets/calendar-XXX.js   ~80 kB
  dist/assets/studio-XXX.js     ~60 kB
  dist/assets/settings-XXX.js   ~40 kB
  dist/assets/classroom-XXX.js  ~50 kB
  
Total: Still ~760 kB, but lazy-loaded on demand
Main bundle: 350-380 kB (40% reduction)
```

### Implementation Targets

**High Priority (Days 1-2):**
- [ ] ReportisticaHub view (contains pdfjs-dist, jspdf, pdf-lib)
- [ ] Calendar view (60 kB, complex rendering)
- [ ] React.memo on Calendar, StudentManager (quick wins)

**Medium Priority (Days 3-4):**
- [ ] Studio view (50 kB)
- [ ] Settings view (30 kB)
- [ ] Classroom view (40 kB)

**Low Priority (Days 5+):**
- [ ] Lodash-es audit
- [ ] MUI tree-shaking
- [ ] Font optimization

---

## Performance Baseline

### Current Application Metrics
```
Build Time:           10.54s
Module Count:         2422
Main Bundle:          530.26 kB (211.29 kB gzip)
Test Pass Rate:       1157/1157 (100%)
```

### Estimated Improvements After Phase 3.2

```
Code Splitting Impact:
- Initial bundle:     530 kB → 350-380 kB (-30-40%)
- Gzip:              211 kB → 150 kB (-29%)
- LCP impact:        ~2.5s → ~1.8-2.0s (-20-30%)
- TTI impact:        ~4.2s → ~3.0-3.5s (-20-30%)

Memoization Impact:
- Calendar render:   ~200ms → ~100ms (-50%)
- Student list:      ~150ms → ~75ms (-50%)
- Modal animations:  ~50-100ms → 30-60ms (-30-40%)

Overall Savings:
- Bundle size:       ~150-200 kB gzip (-70-95 kB)
- LCP improvement:   ~700-900ms (-28-36%)
- TTI improvement:   ~1000-1200ms (-24-29%)
```

---

## Risk Assessment

### Low Risk (Proceed Confidently)
- ✅ Route-based code splitting (proven pattern)
- ✅ React.memo usage (safe, no breaking changes)
- ✅ useMemo/useCallback optimization (safe, no logic changes)

### Medium Risk (Test Carefully)
- ⚠️ Removing dependencies (requires verification)
- ⚠️ Tree-shaking MUI (might break UI if wrong components removed)

### Watch Out For
- Bundle chunk size explosion (set per-chunk budget)
- Network waterfall (preload critical chunks)
- Users on slow networks (chunk loading UX)

---

## Detailed Daily Plan

### Today (January 5) - Phase 3.2.0: Analysis Complete
- ✅ Bundle size baseline captured (530.26 kB)
- ✅ Dependencies analyzed
- ✅ Largest packages identified
- ✅ Code splitting strategy planned
- ✅ Risk assessment completed

### Tomorrow (January 6) - Phase 3.2.1: Code Splitting (Day 1)
- [ ] Implement React.lazy() infrastructure
- [ ] Create Suspense boundaries and loading UI
- [ ] Split ReportisticaHub (highest savings)
- [ ] Split Calendar view
- [ ] Test bundling and chunk sizes
- **Expected outcome:** -80-100 kB gzip savings

### Day 2-3 (January 7-8) - Phase 3.2.1: Code Splitting (Days 2-3)
- [ ] Split Settings, Studio, Classroom
- [ ] Implement React.memo on priority components
- [ ] useMemo/useCallback optimization
- [ ] Performance profiling
- **Expected outcome:** Additional -30-40 kB savings + render improvements

### Day 4-5 (January 9-10) - Phase 3.2.2-3: Dependencies & Final
- [ ] Dependency audit
- [ ] MUI tree-shaking analysis
- [ ] Lodash-es refactoring (if needed)
- [ ] Final testing and metrics
- [ ] Completion report
- **Expected outcome:** -20-30 kB savings + final validation

---

## Success Criteria

### Bundle Size Targets
- ✅ Main bundle: <400 kB (gzip: <150 kB)
- ✅ No individual route chunk >200 kB
- ✅ Savings: >30% from baseline

### Performance Targets
- ✅ LCP: <1.8s (from ~2.5s)
- ✅ TTI: <3.0s (from ~4.2s)
- ✅ Lighthouse: >85 (all metrics)

### Quality Targets
- ✅ Test pass rate: 1157/1157 (0 regressions)
- ✅ Build time: <10s
- ✅ No breaking changes
- ✅ 100% backward compatible

---

## Next Actions

1. **Today:** ✅ Analysis complete, plan finalized
2. **Tomorrow:** Start Phase 3.2.1 (Code Splitting implementation)
3. **Git commit:** Push baseline analysis
4. **Daily updates:** Track metrics and progress

---

**Status:** ✅ **BASELINE ANALYSIS COMPLETE**  
**Ready for:** Phase 3.2.1 (Code Splitting) tomorrow  
**Confidence:** HIGH - clear opportunities identified, low risk approach
