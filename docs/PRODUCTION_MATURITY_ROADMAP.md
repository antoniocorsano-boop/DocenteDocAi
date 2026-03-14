# DocenteDoc AI — Production / Enterprise Maturity Roadmap

## Level 4 → 5/6 | Target: March 2026 – May 2026

**Prepared:** 2026-03-14  
**Audience:** Senior engineers, product owner, QA lead

---

## 0. Baseline Assessment

| Dimension     | Current Level | Evidence                                                                                                                         |
| ------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| AI Engine     | 4             | `runAIAnalysis` hash-cached, audit ring-buffer, `aiPipeline` parallel orchestrator, no unified entry-point, no schema versioning |
| UI/UX         | 4             | MD3 CopilotDocentePanel, 11 sub-tabs, no React ErrorBoundary, `competenze` prop dead                                             |
| Dataset       | 4             | 3-class `classGenerator.ts` simulation, no edge-case coverage, no schema docs                                                    |
| Test/CI       | 4.5           | 1216 unit tests, no AI-panel E2E, `aiTelemetry.ts` disconnected from OTel provider                                               |
| Beta Features | 3.5           | Lesson assistant, prediction, communication engine present but not fully integrated or monitored                                 |

### Critical Gaps (Extracted from Codebase Survey)

1. **Engine Duality**: `aiEngine` (cached + audited) vs `aiPipeline` (no cache, no audit, richer result) coexist. No single unified entry-point.
2. **Audit Trail Ephemeral**: In-memory ring-buffer — cleared on page reload, not exportable.
3. **`aiTelemetry.ts` Disconnected**: File exists but no OTLP spans wire from AI modules → zero AI observability in production.
4. **No AI-Panel E2E Tests**: All Playwright tests cover navigation/Gantt/Drive; Copilot panel has zero E2E coverage.
5. **No Schema Versioning**: `AISnapshot`, `AIPipelineResult`, `AIAnalysisResult` lack `schemaVersion` — localStorage migrations unguarded.
6. **`aiPipeline` Bypasses Cache**: `runAIPipeline` rebuilds context on every call with no memoization.
7. **No Error Boundaries**: CopilotDocentePanel's 11 sub-tabs crash silently to parent.
8. **Snapshot Schema Anemic**: Only 4 scalars persisted per snapshot — limits historical trend fidelity.

---

## 1. Target Architecture (Level 5/6)

```
┌──────────────────────────────────────────────────────────────────────┐
│                     UnifiedAIOrchestrator v2                         │
│  runAnalysis(context, opts?)                                         │
│    ├─ cache check (hash) ──────── HIT → return + audit "cache-hit"  │
│    ├─ MISS → parallel execution:                                     │
│    │    ├─ computeClassHealthIndex()                                 │
│    │    ├─ riskAnalyzer + excellenceAnalyzer                         │
│    │    ├─ trendEngine.generateForecasts()                           │
│    │    ├─ predictClassRisk() + predictStudentRisk()                 │
│    │    └─ askLessonAssistant() [lazy / opt-in]                     │
│    ├─ AuditTrail (persisted to IndexedDB, exportable)               │
│    ├─ OTel span per step (aiTelemetry wired to provider)            │
│    └─ schemaVersion stamped on every result                         │
│                                                                      │
│  UnifiedAIResult (v2, superset of AIAnalysisResult)                 │
│    classHealth, risks, excellence, suggestions, predictions,         │
│    riskPredictions, lessonAssistant?, stats, schemaVersion           │
└──────────────────────────────────────────────────────────────────────┘
         │                           │
   useAIPipeline (hook)         useAISnapshotStore (Zustand)
   memoized + abort-safe         v2 schema + Dexie/IndexedDB

         │
   CopilotDocentePanel v2
      AIErrorBoundary wrapper
      each sub-tab lazy-loaded (React.lazy)
      Onboarding overlay (first-run)
      Feedback widget (thumbs/flag)
```

---

## 2. Sprint Plan

### Sprint 1 (Week 1–2): Foundation — AI Engine Unification & Observability

**Goal:** Single canonical entry-point, wired telemetry, persistent audit trail.  
**Risk:** Low (all changes internal to `src/ai/`, no UI changes).

#### 2.1 Architectural Changes

| File                                         | Change                                                                                                    |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/ai/orchestrator/unifiedOrchestrator.ts` | **NEW** — replaces dual `aiEngine` / `aiPipeline` call sites                                              |
| `src/ai/orchestrator/types.ts`               | **NEW** — `UnifiedAIResult`, `UnifiedAIOptions`, `schemaVersion = 2`                                      |
| `src/ai/engine/aiEngine.ts`                  | **MODIFY** — deprecation notice, re-export from orchestrator for backward compat                          |
| `src/ai/pipeline/aiPipeline.ts`              | **MODIFY** — add hash caching (reuse `buildContextHash`), remove code duplication                         |
| `src/ai/audit/auditTrail.ts`                 | **MODIFY** — replace ring-buffer with Dexie.js IDB write; add `exportAuditJSON()`                         |
| `src/ai/audit/auditTypes.ts`                 | **MODIFY** — add `schemaVersion: number` to `AIAuditTrail`                                                |
| `src/ai/telemetry/aiTelemetry.ts`            | **MODIFY** — wire to OTel `WebTracerProvider`; add `startAISpan(name)` returning span                     |
| `src/tracing.ts`                             | **MODIFY** — export `getTracer()` so `aiTelemetry` can import it                                          |
| `src/ai/migration/schemaMigration.ts`        | **NEW** — `migrateAISnapshot(raw)` v1→v2 guard                                                            |
| `src/stores/useAISnapshotStore.ts`           | **MODIFY** — add `schemaVersion`, `classAverage`, `predictions` to `AISnapshot`; call migrator on hydrate |

#### 2.2 Type Changes (strict, no `any`)

```typescript
// src/ai/orchestrator/types.ts
export const AI_SCHEMA_VERSION = 2 as const;

export interface UnifiedAIResult {
  readonly schemaVersion: typeof AI_SCHEMA_VERSION;
  classHealth: ClassHealthIndex;
  risks: AISuggestion[];
  excellence: AISuggestion[];
  suggestions: AISuggestion[];
  predictions: StudentForecast[];
  riskPredictions: StudentRiskPrediction[];
  lessonAssistant: LessonAssistantResponse | null; // null until explicitly requested
  classAverage: number;
  atRiskCount: number;
  excellenceCount: number;
  stats: AIRunStats;
  auditId: string; // links to persisted AuditTrail
}

export interface UnifiedAIOptions {
  includeLessonAssistant?: boolean; // default false (perf budget)
  forceFresh?: boolean; // bypass cache
  batchIds?: string[]; // future: batch multiple classes
}
```

#### 2.3 Audit Trail Persistence

```typescript
// Dexie schema (src/ai/audit/auditDb.ts)
class AuditDatabase extends Dexie {
  audits!: Table<PersistedAuditTrail>;
  constructor() {
    super("docentedoc-audit");
    this.version(1).stores({ audits: "++id, className, date, engineVersion" });
  }
}
```

- Ring-buffer kept as L1 (fast reads); Dexie is L2 (persistence, export).
- `exportAuditJSON(className?, dateRange?)` → `Blob` for download.
- Max 500 records per class; prune on write.

#### 2.4 OTel Integration

```typescript
// src/ai/telemetry/aiTelemetry.ts — additions
import { getTracer } from "@/tracing";

export function startAISpan(
  name: string,
  attrs?: Record<string, string | number>,
): Span {
  const span = getTracer().startSpan(`ai.${name}`);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => span.setAttribute(k, v));
  return span;
}
```

Spans injected in: `computeClassHealthIndex`, `runRiskAnalysis`, `generateForecasts`, `predictClassRisk`, `askLessonAssistant`.

#### 2.5 Success Criteria — Sprint 1

- [ ] `npm run build` zero TypeScript errors
- [ ] `runAIAnalysis` and `runAIPipeline` call sites compile against `UnifiedAIResult` via re-exports
- [ ] `auditRecorder.test.ts` + new `unifiedOrchestrator.test.ts` pass
- [ ] `aiTelemetry` emits spans visible in OTel Console exporter (DEV mode)
- [ ] Audit records survive page reload (IndexedDB present in DevTools > Application)
- [ ] `useAISnapshotStore` hydrates v1 snapshots without crash (migration unit test)

---

### Sprint 2 (Week 3–4): Test/CI Hardening — E2E Coverage ≥ 90%

**Goal:** Playwright E2E for every AI panel tab, coverage gate enforced in CI, strict lint.  
**Risk:** Medium (E2E adds CI time; new Playwright fixtures needed).

#### 3.1 New E2E Files

| File                              | Covers                                                                 |
| --------------------------------- | ---------------------------------------------------------------------- |
| `e2e/copilot-panel.spec.ts`       | Opens CopilotDocentePanel; cycles all 11 tabs; checks no console.error |
| `e2e/ai-health-score.spec.ts`     | Health score widget renders with correct grade label (ottimo/buono…)   |
| `e2e/ai-predictions.spec.ts`      | Predizione tab shows per-student forecast rows                         |
| `e2e/ai-explainability.spec.ts`   | Spiegabilità tab: expand rationale card, check aria-labels             |
| `e2e/ai-audit-export.spec.ts`     | Dev Tools tab: click "Esporta Audit" → file download triggered         |
| `e2e/ai-lesson-assistant.spec.ts` | Planning tab: lesson gap suggestions render within 3 s                 |

E2E fixtures approach:

```typescript
// e2e/fixtures/aiFixtures.ts
import { test as base } from "@playwright/test";
export const test = base.extend({
  withDemoClass: async ({ page }, use) => {
    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.setItem("docentedoc-demo-mode", "true");
    });
    await page.reload();
    await use(page);
  },
});
```

#### 3.2 Coverage Configuration

```typescript
// vitest.config.ts — additions
coverage: {
  provider: 'v8',
  thresholds: {
    lines: 90,
    functions: 85,
    branches: 80,
    statements: 90,
  },
  include: ['src/ai/**', 'src/stores/**', 'src/hooks/**'],
  exclude: ['src/ai/simulation/**'],   // generator != business logic
}
```

#### 3.3 Automated Checks (CI / pre-commit)

```yaml
# .github/workflows/ci.yml  (new or extend existing)
jobs:
  quality:
    steps:
      - run: npm run lint # ESLint 0 errors
      - run: npx tsc -b --noEmit # strict TypeScript
      - run: npm run test:unit -- --coverage # coverage gate
      - run: npm run test:e2e:smoke # smoke (< 2 min)
  e2e-ai:
    steps:
      - run: npm run test:e2e -- --grep "copilot|ai-health|ai-predictions|ai-explain"
```

#### 3.4 New Unit Tests Required

| File                                                        | Tests                                                                                |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/ai/orchestrator/__tests__/unifiedOrchestrator.test.ts` | cache-hit, cache-miss, audit written, OTel span started, `forceFresh` bypasses cache |
| `src/ai/migration/__tests__/schemaMigration.test.ts`        | v1 → v2 migration, unknown version throws                                            |
| `src/ai/audit/__tests__/auditDb.test.ts`                    | IDB write/read/export, prune to 500                                                  |
| `src/ai/telemetry/__tests__/aiTelemetry.test.ts`            | span starts/ends, attributes present                                                 |
| `e2e/copilot-panel.spec.ts`                                 | all 11 tabs render without error                                                     |

#### 3.5 Success Criteria — Sprint 2

- [ ] `npm run test:coverage` reports ≥ 90% lines for `src/ai/**`
- [ ] All 6 new E2E specs pass in CI (Chromium headless)
- [ ] Zero new ESLint violations introduced (`npm run lint` clean)
- [ ] `npx tsc -b --noEmit` exits 0 with `strict: true`
- [ ] CI pipeline completes in < 8 minutes (unit + smoke combined)

---

### Sprint 3 (Week 5–6): UI/UX — Error Boundaries, Onboarding, Feedback

**Goal:** Production-grade UI resilience, first-run onboarding, user feedback loop.  
**Risk:** Low/Medium (additive UI changes; no existing API changes).

#### 4.1 Error Boundaries

```typescript
// src/components/ai/AIErrorBoundary.tsx  (NEW)
// Wraps any AI sub-panel; shows MD3 M3Surface + retry button on crash.
interface AIErrorBoundaryProps {
  panelName: string;
  children: React.ReactNode;
}
```

Apply to every tab in `CopilotDocentePanel`:

```tsx
// CopilotDocentePanel.tsx — each tab becomes:
{tab === 0 && (
  <AIErrorBoundary panelName="Performance">
    <CopilotPerformancePanel ... />
  </AIErrorBoundary>
)}
```

#### 4.2 Lazy Loading Sub-Tabs

```tsx
// Code-split heavy tabs to reduce initial bundle
const CopilotPredictionPanel = React.lazy(
  () => import("./copilot/CopilotPredictionPanel"),
);
const AIExplainabilityPanel = React.lazy(
  () => import("./copilot/AIExplainabilityPanel"),
);
```

Wrap each `React.lazy` in `<React.Suspense fallback={<AITabSkeleton />}>`.

#### 4.3 Onboarding (First-Run)

```typescript
// src/components/ai/AIOnboardingOverlay.tsx  (NEW)
// Shown once per user (localStorage 'ai-onboarding-v1-done' flag).
// Steps: 1) Health Score explanation  2) Risk/Excellence tabs  3) Predictions
// MD3 Dialog with stepper, skip button.
```

#### 4.4 Feedback Widget

```typescript
// src/components/ai/AIFeedbackWidget.tsx  (NEW)
// Thumbs-up / thumbs-down + optional text field per AI suggestion.
// Persisted to localStorage 'ai-feedback-v1' (array of FeedbackRecord).
// Exportable from Dev Tools tab as JSON.

interface FeedbackRecord {
  suggestionId: string;
  className: string;
  vote: "up" | "down";
  comment?: string;
  timestamp: string; // ISO
  engineVersion: string;
}
```

Attach `<AIFeedbackWidget>` to each `AISuggestion` card in `CopilotPerformancePanel`.

#### 4.5 `competenze` Prop Cleanup

Remove dead `competenze` from `CopilotDocentePanelProps` or properly wire it to the sub-tabs that need competency data (currently unused).

#### 4.6 Success Criteria — Sprint 3

- [ ] `CopilotDocentePanel` renders without crash when any sub-module throws (AIErrorBoundary test)
- [ ] Onboarding overlay shown on first visit; skipped on subsequent visits
- [ ] Feedback votes persisted to localStorage and visible in Dev Tools export
- [ ] No `competenze` TypeScript warning in `CopilotDocentePanel` props
- [ ] `npm run md3:audit` reports 0 new violations (no `<div>` wrappers introduced)
- [ ] Lighthouse Performance score ≥ 85 (lazy loading reduces initial JS parse)

---

### Sprint 4 (Week 7–8): Dataset, Beta Stabilization & Production Monitoring

**Goal:** Richer datasets with documented edge cases; stabilize Beta features; production observability dashboard.  
**Risk:** Low (additive). Beta stabilization is feature-complete, not new features.

#### 5.1 Dataset Improvements

| File                                            | Change                                                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/ai/simulation/classGenerator.ts`           | **MODIFY** — add edge-case profiles: all-zero evals, single student, 30+ students, bimodal class distribution |
| `src/ai/simulation/edgeCaseDatasets.ts`         | **NEW** — 8 named edge-case fixtures used in unit tests                                                       |
| `docs/DATASET_DOCUMENTATION.md`                 | **NEW** — schema, field semantics, distribution assumptions, known biases                                     |
| `src/ai/simulation/__tests__/edgeCases.test.ts` | **NEW** — `UnifiedAIOrchestrator` does not throw on any edge-case fixture                                     |

Edge case catalogue:

1. Empty class (0 students)
2. Single student, no evaluations
3. All students at exactly 5.5 (threshold boundary)
4. 30 students, all at risk (stress test)
5. 30 students, all excellent
6. Class with only 1 evaluation per student
7. Mixed: 50% at-risk, 50% excellent (bimodal)
8. Class with `undefined`/`null` evaluation scores (defensive)

#### 5.2 Beta Feature Stabilization

| Feature                        | Action                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Lesson Assistant**           | Move from `includeLessonAssistant: false` default → `true` when `betaMode` enabled in settings; add `<React.Suspense>` + retry |
| **Class Communication Engine** | Add unit test for `generateCommunicationDraft()`; surface in Comunicazione tab with feedback widget                            |
| **Risk Predictions**           | `StudentRiskPrediction.probability` clamped to `[0.0, 1.0]`; add confidence interval display in Predizione tab                 |
| **`useAIBeta` hook**           | Verify it reads from `useSystemStore.betaMode`; add `isBetaFeatureEnabled(key)` selector pattern                               |

#### 5.3 Production Monitoring

```typescript
// src/ai/telemetry/productionMonitor.ts  (NEW)
// Collects:
//   - AI run latency histogram (percentile tracking via sliding window)
//   - Cache hit rate (hourly rolling)
//   - Error rate per module
//   - Feedback sentiment ratio
// Exposes: getMonitoringReport() → MonitoringReport (serializable JSON)
// Surfaced in Dev Tools tab as real-time dashboard.

interface MonitoringReport {
  period: string;
  aiRunLatencyP50Ms: number;
  aiRunLatencyP95Ms: number;
  cacheHitRate: number; // 0.0–1.0
  errorsByModule: Record<string, number>;
  feedbackSentimentRatio: number; // up/(up+down)
  totalRuns: number;
}
```

#### 5.4 `schemaVersion` Migration Guard

```typescript
// src/ai/migration/schemaMigration.ts
const MIGRATIONS: Record<number, (data: unknown) => unknown> = {
  1: migrateV1toV2,
};

export function migrateAISnapshot(raw: unknown): AISnapshot {
  // version-stamps, transforms, validates with Zod or manual type guard
}
```

Add `z` (Zod) validation for `AISnapshot` hydration from localStorage — already in `package.json` dependencies via MUI.

> **Note:** If Zod is not a declared dependency, use manual type guards — do not add new dependencies without aligning with [CLAUDE.md](../CLAUDE.md) constraint.

#### 5.5 Documentation

```
docs/
├── PRODUCTION_MATURITY_ROADMAP.md  ← this file
├── DATASET_DOCUMENTATION.md        ← NEW Sprint 4
├── AI_AUDIT_TRAIL_GUIDE.md         ← NEW Sprint 1
└── BETA_FEATURES_STATUS.md         ← NEW Sprint 4
```

#### 5.6 Success Criteria — Sprint 4

- [ ] All 8 edge-case fixtures run through `UnifiedAIOrchestrator` without crash
- [ ] `askLessonAssistant` is enabled by default in Beta Mode
- [ ] `MonitoringReport` generates in Dev Tools tab with real latency data
- [ ] `migrateAISnapshot` handles v1 → v2 gracefully (no data loss)
- [ ] `DATASET_DOCUMENTATION.md` + `BETA_FEATURES_STATUS.md` committed
- [ ] Zero new `any` types introduced across all 4 sprints (CI check: `tsconfig strict + noImplicitAny`)

---

## 3. Complete File Manifest

### New Files

```
src/ai/orchestrator/
  unifiedOrchestrator.ts      ← canonical entry point
  types.ts                    ← UnifiedAIResult, UnifiedAIOptions, AI_SCHEMA_VERSION
  __tests__/
    unifiedOrchestrator.test.ts

src/ai/migration/
  schemaMigration.ts
  __tests__/
    schemaMigration.test.ts

src/ai/audit/
  auditDb.ts                  ← Dexie IDB schema + CRUD

src/ai/telemetry/
  productionMonitor.ts
  __tests__/
    aiTelemetry.test.ts
    productionMonitor.test.ts

src/ai/simulation/
  edgeCaseDatasets.ts
  __tests__/
    edgeCases.test.ts

src/components/ai/
  AIErrorBoundary.tsx
  AIOnboardingOverlay.tsx
  AIFeedbackWidget.tsx
  AITabSkeleton.tsx

e2e/
  copilot-panel.spec.ts
  ai-health-score.spec.ts
  ai-predictions.spec.ts
  ai-explainability.spec.ts
  ai-audit-export.spec.ts
  ai-lesson-assistant.spec.ts
  fixtures/
    aiFixtures.ts

docs/
  DATASET_DOCUMENTATION.md
  AI_AUDIT_TRAIL_GUIDE.md
  BETA_FEATURES_STATUS.md
```

### Modified Files

```
src/ai/engine/aiEngine.ts           — deprecation shim → orchestrator
src/ai/pipeline/aiPipeline.ts       — add caching, schemaVersion
src/ai/audit/auditTrail.ts          — dual write: ring-buffer + Dexie
src/ai/audit/auditTypes.ts          — add schemaVersion, auditId
src/ai/telemetry/aiTelemetry.ts     — wire to OTel provider
src/ai/simulation/classGenerator.ts — edge-case profiles
src/tracing.ts                      — export getTracer()
src/stores/useAISnapshotStore.ts    — v2 schema, migration on hydrate
src/components/CopilotDocentePanel.tsx  — ErrorBoundary, lazy tabs, onboarding trigger, dead prop cleanup
vitest.config.ts                    — coverage thresholds
.github/workflows/ci.yml            — coverage gate + E2E AI job
```

---

## 4. Sprint Timeline

```
Week  1   │ S1: Engine unification + OTel wiring
Week  2   │ S1: Audit persistence (Dexie) + schema versioning + migration guard
Week  3   │ S2: Unit test coverage push (target 90%) + new test files
Week  4   │ S2: E2E Playwright AI specs + CI workflow additions
Week  5   │ S3: AIErrorBoundary + lazy loading (CopilotDocentePanel refactor)
Week  6   │ S3: Onboarding overlay + Feedback widget
Week  7   │ S4: Edge-case datasets + lessonAssistant Beta stabilization
Week  8   │ S4: productionMonitor + docs + final level-6 audit
           │
           └──── RELEASE GATE ────────────────────────────────────────────
```

---

## 5. Success Criteria by Level

### Level 5 (end of Sprint 2)

| Criterion                | Metric                                                            |
| ------------------------ | ----------------------------------------------------------------- |
| Single AI entry-point    | `unifiedOrchestrator.ts` is the only call site in production code |
| Audit persisted          | Records survive page reload, exportable as JSON                   |
| OTel AI spans observable | Spans visible in OTLP collector / DEV console                     |
| Test coverage AI modules | ≥ 90% lines (`src/ai/**`)                                         |
| E2E AI coverage          | ≥ 6 Playwright specs, all green in CI                             |
| TypeScript strict        | `npx tsc -b --noEmit` exits 0 with `strict: true`                 |
| Schema versioned         | All persisted AI data stamped with `schemaVersion`                |
| CI pipeline gated        | Coverage + lint + TypeScript fail the build on regression         |

### Level 6 (end of Sprint 4)

| Criterion                 | Metric                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| Error resilience          | No AI sub-tab crash propagates to parent (ErrorBoundary tests pass)                        |
| Onboarding                | First-run overlay displayed; skip remembered in localStorage                               |
| User feedback loop        | Thumbs up/down persisted + exportable from Dev Tools tab                                   |
| Edge-case robustness      | All 8 edge-case fixtures pass `UnifiedAIOrchestrator` without throw                        |
| Beta features integrated  | LessonAssistant enabled in Beta Mode, monitored, rate < 1% error                           |
| Production monitoring     | `MonitoringReport` available in-app with real latency P50/P95                              |
| Documentation complete    | `DATASET_DOCUMENTATION.md`, `AI_AUDIT_TRAIL_GUIDE.md`, `BETA_FEATURES_STATUS.md` committed |
| Zero technical debt items | All 8 critical gaps from baseline survey resolved                                          |

---

## 6. Constraints Compliance

| Constraint                                     | How Satisfied                                                                                                                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Must not break existing `AIAnalysisResult` API | `unifiedOrchestrator` re-exports match `AIAnalysisResult` shape; both `aiEngine.ts` and `aiPipeline.ts` become thin shims — call sites compile unchanged                    |
| All TypeScript strict, no `any`                | CI check `tsc -b --noEmit` enforced from Sprint 2 onwards; all new files typed with explicit return types and `readonly` where applicable                                   |
| Audit integrated safely                        | Dual-write pattern (ring-buffer + IDB) means no data loss if Dexie write fails; ring-buffer remains functional fallback                                                     |
| Telemetry integrated safely                    | OTel spans are fire-and-forget; span errors do not propagate to AI result (caught internally in `startAISpan`)                                                              |
| Beta Mode gated                                | `isBetaFeatureEnabled('lessonAssistant')` check before including `LessonAssistantResponse`; disabled for non-beta users                                                     |
| MD3 compliance                                 | All new UI components (`AIErrorBoundary`, `AIOnboardingOverlay`, `AIFeedbackWidget`) use `M3Surface`, `M3Typography`, MUI v7 components — verified with `npm run md3:audit` |

---

## 7. Visual Radar — Maturity Levels

```
            AI Engine
               6
              /|\
             / | \
        4───/──5──\──→ 6  (target end Sprint 2)
           /   |   \
          /    |    \
Beta ←──3.5  Dataset  4.5── Test/CI
         \    |    /
          \   |   /
           \  |  /
            4───
          UI/UX

Legend:
  ── Current (March 14, 2026)
  ── Target end Sprint 2 (April 11, 2026): AI Engine 5, Test/CI 5.5
  ── Target end Sprint 4 (May 9, 2026):   All dimensions ≥ 5.5
```

### Expected Dimension Progression

| Dimension     | Current | Sprint 1-2 | Sprint 3-4 |
| ------------- | ------- | ---------- | ---------- |
| AI Engine     | 4       | **5.5**    | **6**      |
| UI/UX         | 4       | 4          | **5.5**    |
| Dataset       | 4       | 4          | **5.5**    |
| Test/CI       | 4.5     | **5.5**    | **6**      |
| Beta Features | 3.5     | 4          | **5.5**    |

---

## 8. Risk Register

| Risk                                                               | Probability | Impact | Mitigation                                                                                               |
| ------------------------------------------------------------------ | ----------- | ------ | -------------------------------------------------------------------------------------------------------- |
| Dexie dependency adds bundle weight                                | Medium      | Low    | Dexie adds ~5 KB gzip; audit DB is loaded lazily only when `exportAuditJSON` called                      |
| OTel `getTracer()` export breaks tree-shaking                      | Low         | Low    | Wrap in conditional: `if (import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT)`                             |
| E2E AI tests flaky in CI (async AI computation)                    | Medium      | Medium | Use `page.waitForSelector('[data-testid="health-score"]')` with 5 s timeout; mock AI in fast smoke tests |
| `UnifiedAIResult` migration breaks `CopilotDocentePanel` consumers | Low         | High   | Superset design — all existing fields preserved; re-exports alias old names                              |
| Coverage 90% gate fails on first CI run                            | High        | Low    | Exclude `simulation/**` from gate; run coverage locally before merging the Vitest config change          |
| Zod not in dependencies                                            | Medium      | Low    | Use manual type guards in `schemaMigration.ts`; add Zod only if team approves in PR                      |

---

## 9. Definition of Done

A sprint is **Done** when:

1. All success criteria checked off.
2. `npm run build` exits 0.
3. `npm run test:unit` exits 0 (no skipped, no flaky).
4. `npm run lint` exits 0 — zero errors, zero warnings.
5. `npx tsc -b --noEmit` exits 0.
6. `npm run md3:audit` exits 0 — no new violations.
7. PR reviewed by at least one team member.
8. `CLAUDE.md` + `MD3_AUDIT.md` updated if new patterns introduced.

---

_End of Roadmap — DocenteDoc AI Production Maturity Plan v1.0_
