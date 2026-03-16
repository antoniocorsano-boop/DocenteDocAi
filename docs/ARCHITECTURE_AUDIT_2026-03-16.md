# DocenteDoc AI — Technical Architecture Report

**Date:** 16 March 2026 | **Analyst:** Senior Software Architect | **Version:** 1.0

---

## 1. Repository Structure

```
repo-root/
├── api/                    Edge Function (Vercel) — AI proxy + school data
├── audit/                  Build artefacts: bundle-stats.html, Lighthouse reports
├── constants/              App-wide constants (systemManual.ts + 3 others)
├── docs/                   ~40 architecture / roadmap / handoff markdown docs
├── e2e/                    Playwright end-to-end test suite (~15 spec files)
├── maintenance/            Maintenance scripts and helpers
├── public/                 Static assets, fonts, icons
├── reports/                QA / audit output artefacts
├── scripts/                Build-time scripts (MD3 audit, migration, CI helpers)
├── src/
│   ├── ai/                 21-subdirectory AI domain layer (~80 files)
│   │   ├── audit/          AI decision audit trail + IndexedDB persistence
│   │   ├── cache/          In-memory AI response cache (2 Maps)
│   │   ├── classHealth/    Class health index computation
│   │   ├── contextEngine/  Risk / excellence analyzers + suggestion engine
│   │   ├── copilot/        Copilot commands, engines, trend engine (+ actions/)
│   │   ├── devtools/       11 TSX debug/inspection panels (AIDevToolsPanel)
│   │   ├── engine/         aiEngine.ts [DEPRECATED — shim still imported]
│   │   ├── explainability/ Confidence model, decision explainer, risk factors
│   │   ├── fairness/       Disparate-impact detector, bias reports
│   │   ├── funding/        Funding AI + BANDI_CATALOGO (mock data)
│   │   ├── lessonAssistant/ Activity suggester, gap analyzer
│   │   ├── maturita/       Maturità readiness pipeline
│   │   ├── migration/      localStorage schema v1→v2 migrator
│   │   ├── orchestrator/   unifiedOrchestrator.ts (canonical entry point)
│   │   ├── pedagogy/       Blooms classifier, pedagogy report
│   │   ├── pipeline/       aiPipeline.ts [@deprecated], useAIPipeline hook
│   │   ├── prediction/     Student + class risk prediction (OLS)
│   │   ├── recommendation/ Lesson recommender, activity generator
│   │   ├── simulation/     Classroom simulator + scenario generator
│   │   ├── telemetry/      OTel AI span logger (circular buffer 200)
│   │   └── trust/          Trust score engine + store
│   ├── components/         ~183 root TSX files + subdirectories
│   │   ├── accessibility/  Skip-link, focus trap helpers
│   │   ├── charts/         7 Recharts wrappers
│   │   ├── classroom/      3 classroom sub-tab components
│   │   ├── copilot/        15 Copilot panels + maturita/ (10 files)
│   │   ├── dashboard/      7 dashboard metric components
│   │   ├── help/           11 help/onboarding components
│   │   ├── settings/       14 settings panel components
│   │   ├── teacher-dashboard/ 7 root + tabs/ (6 tab components)
│   │   ├── ui/             63 MD3 design-system wrappers + 24 visual snapshots
│   │   ├── views/          6 specialised view components
│   │   └── viewRegistry.ts 34+ lazy-loaded view configs
│   ├── constants/          4 constant modules
│   ├── context/ contexts/  1 + 3 React Context providers (theme/modal only)
│   ├── design-system/      12 DS token/component files + tokens/ (MD3 CSS vars)
│   ├── fixtures/           Test fixtures
│   ├── hooks/              13 custom hooks (useAppEngine, usePersistence, etc.)
│   ├── nka/                24 files — Neural Knowledge Architecture module
│   ├── pages/landing/      3 public landing page components
│   ├── services/           15 service files + prompts/ (6 prompt templates)
│   ├── stores/             10 Zustand stores
│   ├── stories/            3 Storybook design-system stories
│   ├── styles/             1 global SCSS/CSS
│   ├── theme/              4 files (muiTheme, tokens, theme, md3ZIndex)
│   ├── types/              11 domain type modules + barrel index
│   └── utils/              23 utility modules
├── templates/              Document templates
├── test-results/           Playwright artifacts
├── tools/                  Internal build/migration tools
├── __tests__/              Vitest unit/integration + visual-regression specs
├── vitest.config.ts / vitest.setup.tsx
├── playwright.config.ts / playwright.visual.config.ts
├── vite.config.ts
├── package.json
└── vercel.json
```

---

## 2. Technology Stack

| Layer                    | Technology                            | Version | Notes                                              |
| ------------------------ | ------------------------------------- | ------- | -------------------------------------------------- |
| **Frontend framework**   | React                                 | 18.2    | SPA, React.lazy throughout                         |
| **Language**             | TypeScript                            | 5.9     | Strict mode, path alias `@/`                       |
| **UI library**           | MUI v7 + Material Design 3            | 7.3.9   | Custom MD3 token layer on top                      |
| **State management**     | Zustand                               | 4.4     | 10 stores, `actions` namespace pattern             |
| **Build tool**           | Vite                                  | 6.0     | `build-polyfill.js` must be first import           |
| **CSS-in-JS**            | Emotion (MUI peer)                    | 11.x    | `sx` prop + CSS variables                          |
| **Charts**               | Recharts                              | 3.7     | Wrapped in `src/components/charts/`                |
| **Drag & drop**          | @dnd-kit                              | 6.3     | Gantt / timetable                                  |
| **AI — LLM (primary)**   | Google Gemini (`@google/genai`)       | 1.34    | Model: `gemini-3-pro-preview` (hardcoded majority) |
| **AI — LLM (secondary)** | Anthropic SDK                         | 0.78    | Key configured but **zero call sites in source**   |
| **AI proxy**             | Vercel Edge Function                  | —       | `api/ai.ts` — security perimeter for API keys      |
| **Offline storage**      | Dexie (IndexedDB)                     | 4.3     | BackupDB v3, Data DB v2                            |
| **Local persistence**    | `zustand/middleware/persist`          | —       | 3 AI stores → localStorage                         |
| **Document generation**  | docx, jspdf, pdf-lib, pdfjs-dist      | —       | Full DOCX/PDF pipeline                             |
| **CSV/Excel**            | PapaParse, xlsx                       | —       | Import/export students + lessons                   |
| **Google integrations**  | Drive v3 + GSI, Gmail API, NotebookLM | —       | Global `google`/`gapi` objects                     |
| **PWA**                  | vite-plugin-pwa                       | 1.2     | InjectManifest mode, `src/sw.ts`                   |
| **Tracing**              | OpenTelemetry (OTLP + Web)            | 2.2     | No-op unless endpoint configured                   |
| **Unit tests**           | Vitest                                | 4.0     | jsdom, 30/22/22/32% coverage thresholds            |
| **E2E tests**            | Playwright                            | 1.57    | Auto-starts dev server on 5173                     |
| **Visual regression**    | Vitest (snapshots)                    | —       | MD3 component snap tests                           |
| **Linting**              | ESLint 9 + Stylelint                  | —       | Flat config, pre-commit via Husky                  |
| **CI/CD**                | GitHub Actions                        | —       | 4 workflows: lint, test, release-gate, e2e-smoke   |
| **Hosting**              | Vercel                                | —       | `--legacy-peer-deps`, SPA rewrites, Edge Functions |

---

## 3. Architectural Pattern

### Current Pattern: **Layered Monolithic UI with Feature-Oriented AI Sub-system**

The app is a single-page monolith structured into horizontal layers (types → stores → services → hooks → components → views), with a vertically-oriented AI sub-system (`src/ai/`) that has its own internal feature-folder organization.

```
View layer        components/ + pages/
Orchestration     useAppEngine.ts → ViewManager.tsx
State layer       src/stores/ (10 Zustand stores)
Service layer     src/services/ (15 services)
AI domain         src/ai/ (21 subdirectories, pure functions + stores)
Type contracts    src/types/ (11 modules) + src/types.ts (barrel)
Infrastructure    IndexedDB / localStorage / Google Drive / Vercel Edge
```

### Strengths

- **Clear domain segregation in stores** — 5 stores map 1:1 to domains; consistent `actions` namespace prevents accidental state mutation.
- **Security-first API layer** — single Edge Function acts as the only key bearer; SSRF allowlist, payload size guard, method restriction all present.
- **Aggressive lazy loading** — 34+ views are `React.lazy()`; predictive prefetch via `useSmartNavigation` learns user navigation patterns; reduces TTI meaningfully.
- **Deep MD3 compliance tooling** — 10+ `npm run md3:*` scripts, CSS audit, CI enforcement; no other Italian EDU SaaS has this level of design-system governance.
- **Self-contained AI domain** — `src/ai/` is almost entirely pure TypeScript functions with no UI coupling; independently testable.
- **OTel tracing** — zero-cost in production without endpoint; available for SaaS telemetry when needed.

### Architectural Weaknesses

- **God hook:** `useAppEngine.ts` (~700 lines) owns navigation, all store aggregation, backup, Google Drive sync, telemetry toggling, deep-link parsing, and toast management. It is the single most complex file in the project and a change magnet.
- **ViewManager is a prop funnel:** passes full `AppState + AppActions` (~35+ props) through a `switch`/`case` over 26 view names. Adding a view requires touching 4 files (types, registry, drawer, manager).
- **No event bus:** all cross-cutting concerns (AI result ready → store hydration, navigation prediction → prefetch, backup dirty → save) flow through shared Zustand subscriptions or direct hook-to-hook coupling. Side effects are difficult to trace.
- **Three overlapping AI entry points:** `aiEngine.ts` (deprecated), `aiPipeline.ts` (deprecated), `unifiedOrchestrator.ts` (current) co-exist and are all still imported somewhere.
- **Dual barrel problem:** `src/types.ts` (874 lines, inline `View` type, 40+ view IDs) PLUS `src/types/index.ts` (re-exports everything) — two layers of `export *` create circular-export risk and impede tree-shaking.

---

## 4. Module Identification

| Module                    | Location                                                                           | Responsibility                                                   | Depends on                                                              |
| ------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Academic Core**         | `src/stores/useAcademicStore.ts`                                                   | Lessons, slots, UDA, register, curricula, events                 | usePersistence, types/uda.types                                         |
| **Student Core**          | `src/stores/useStudentStore.ts`                                                    | Students, evaluations, competencies, portfolios, PIP             | usePersistence, types/student.types                                     |
| **System / User**         | `src/stores/useSystemStore.ts`                                                     | User profile, notifications, KB, templates, analytics            | usePersistence, types/ai.types                                          |
| **Settings**              | `src/stores/useSettingsStore.ts`                                                   | App settings, AI settings, theme state                           | usePersistence                                                          |
| **UI State**              | `src/stores/useUIStore.ts`                                                         | Modal state, toast, backup/drive sync state, navigation history  | —                                                                       |
| **App Orchestrator**      | `src/hooks/useAppEngine.ts`                                                        | Aggregates all stores; navigation, backup, Drive sync, telemetry | All 5 stores, backupService, googleDriveService, useTelemetry           |
| **Persistence**           | `src/hooks/usePersistence.ts` + `src/services/backupService.ts`                    | Debounced IndexedDB auto-save/restore                            | Dexie, useAcademic/useStudent/useSystem/useSettings                     |
| **AI Pipeline**           | `src/ai/orchestrator/unifiedOrchestrator.ts`                                       | Canonical AI analysis entry point for full-class report          | pedagogy, prediction, explainability, trust, fairness, bias sub-modules |
| **AI Recommendation**     | `src/ai/recommendation/`                                                           | Lesson recommendations + Bloom-matched activity generation       | pedagogy, trust, simulation sub-modules                                 |
| **AI Copilot**            | `src/ai/copilot/` + `src/components/copilot/`                                      | Teacher assistant, trend forecasts, planning, communication      | aiClient, recommendation, contextEngine                                 |
| **AI Maturità**           | `src/ai/maturita/` + `src/components/copilot/maturita/`                            | Exam readiness pipeline for 6 compliance sections                | curriculum, pedagogy, prediction, explainability, trust, bias           |
| **AI Context Engine**     | `src/ai/contextEngine/`                                                            | Risk/excellence detection from raw student data                  | — (pure functions)                                                      |
| **AI Devtools**           | `src/ai/devtools/`                                                                 | In-app debug UI for AI internals                                 | aiCache, aiTelemetry, aiEngine, trust, explainability stores            |
| **NKA**                   | `src/nka/`                                                                         | Neural Knowledge Architecture — knowledge graph visualization    | aiClient, aiPipeline                                                    |
| **View Navigation**       | `src/components/viewRegistry.ts` + `ViewManager.tsx` + `SecondaryNavDrawer.tsx`    | View routing, lazy loading, nav drawer                           | types/View, all 34+ view components                                     |
| **Design System**         | `src/components/ui/` + `src/design-system/` + `src/theme/`                         | MD3-compliant visual components and token layer                  | MUI v7, Emotion                                                         |
| **Google Drive / Backup** | `src/services/googleDriveService.ts` + `backupService.ts`                          | Cloud backup, IndexedDB persistence, schema migration            | Dexie, google global                                                    |
| **AI Service / Client**   | `src/services/aiService.ts` + `aiClient.ts`                                        | LLM calls (Gemini), retry logic, model routing                   | `api/ai.ts` Edge Function                                               |
| **Document Generation**   | `src/services/` (docx/pdf), `src/utils/templateUtils.ts`                           | PDF and DOCX export of UDA, reports, plans                       | docx, jspdf, pdf-lib                                                    |
| **Import Service**        | `src/services/importService.ts` + `src/ai/migration/`                              | CSV/Excel import + schema migration                              | papaparse, xlsx                                                         |
| **Simulation Lab**        | `src/ai/simulation/`                                                               | Synthetic class generation, scenario benchmarking                | prediction, pedagogy, trust                                             |
| **Funding**               | `src/ai/funding/` + `src/components/copilot/FundingPanel.tsx`                      | Funding/grant matching, candidatura AI draft                     | aiClient, useFundingStore                                               |
| **Telemetry**             | `src/tracing.ts` + `src/ai/telemetry/aiTelemetry.ts` + `src/hooks/useTelemetry.ts` | OTel tracing + AI interaction tracking                           | OTel SDK                                                                |
| **Landing**               | `src/pages/landing/`                                                               | Public landing page / onboarding                                 | — (isolated)                                                            |

---

## 5. Dependency Graph

```
Browser Entry
└── main.tsx
    └── useAppEngine.ts  ← GOD HOOK — reads/writes all state
        ├── useAcademicStore  ←── usePersistence ──→ backupService ──→ IndexedDB
        ├── useStudentStore   │
        ├── useSystemStore    │
        ├── useSettingsStore  │
        ├── useUIStore
        ├── googleDriveService  (global google/gapi)
        └── useTelemetry  →  useSystemStore

ViewManager.tsx  ← receives full AppState+AppActions from useAppEngine
    └── switch/case 26 views
        └── [per view] React.lazy() component
              └── directly imports: own stores, AI modules, services

AI Flow (no event bus — all imperative):
CopilotRecommendationPanel
    ├── runUnifiedAnalysis()  ← unifiedOrchestrator
    │     ├── generatePedagogyReport()
    │     ├── predictStudentRisk()  →  explainClass()  →  generateTrustReport()
    │     ├── generateBiasReport()
    │     └── generateRecommendations()  →  generateActivity()
    └── useAIMaturitaStore.hydrate()  ← side-effect into store

aiClient.ts  →  api/ai.ts (Edge Function)  →  Google Gemini REST API
                                           ×   Anthropic SDK (imported but unused)
```

### Tight Coupling Hotspots

| Hotspot                          | Problem                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| `useAppEngine.ts`                | Imported by `App.tsx`; owns entire application lifecycle in one hook                        |
| `ViewManager.tsx`                | 26-arm `switch` over `View` union — must be edited for every new route                      |
| `CopilotRecommendationPanel.tsx` | Imports 8 AI modules directly with no orchestration boundary                                |
| `src/types.ts`                   | 874-line barrel; `View` union with 40+ string literals forces multi-file edits per new view |
| `googleDriveService.ts`          | Depends on `window.google`, `window.gapi`, and `window.tokenClient` globally                |

### Circular Dependency Risk

`src/types.ts` `export *` from `src/types/index.ts` which `export *` from 11 domain modules, several of which import back from `src/types`. This double-barrel creates a potential circular chain hard to detect at compile time.

---

## 6. Copilot / AI Integration

### Architecture

```
Client Browser
  ├── Pure AI modules (src/ai/**)   ← no LLM, pure TypeScript functions
  │     risk/prediction, pedagogy, trust, recommendation, simulation
  └── LLM-calling path
        aiClient.ts  (callAiWithRetry: 3 retries, 30s/call, 60s budget)
            ↓
        api/ai.ts  (Vercel Edge Function — key bearer)
            ↓
        Google Gemini API  (model: gemini-3-pro-preview / gemini-3-flash-preview)
```

### Where AI Is Integrated

| Integration Point             | Type                          | LLM?           | Notes                                                 |
| ----------------------------- | ----------------------------- | -------------- | ----------------------------------------------------- |
| `aiService.ts`                | High-level service functions  | Yes            | 15+ functions, Italian pedagogical persona            |
| `src/ai/orchestrator/`        | Full-class analysis pipeline  | No             | Pure computation                                      |
| `src/ai/recommendation/`      | Lesson + activity recommender | No             | Pure, OLS-based scoring                               |
| `src/ai/prediction/`          | Student risk prediction       | No             | Additive risk model                                   |
| `src/ai/copilot/`             | Teacher assistant commands    | Partial        | `copilotEngine.ts` calls aiClient for some commands   |
| `src/nka/`                    | Knowledge graph AI layout     | Yes (optional) | `wizardAI.llm.ts` calls aiClient                      |
| `src/ai/funding/FundingAI.ts` | Grant recommendation          | Yes            | Candidatura draft via LLM                             |
| `src/services/prompts/`       | Modular prompt templates      | —              | Reusable prompt builders                              |
| `api/ai.ts`                   | Edge proxy                    | Yes            | School search (MIUR CSV), school KB crawl, generic AI |

### Key Findings

- **`aiSettings.model` is partially ignored** — ~60% of `aiService.ts` functions hardcode `gemini-3-pro-preview` regardless of user setting.
- **Anthropic SDK installed** (`@anthropic-ai/sdk 0.78`) but has **zero call sites** anywhere in source — dead dependency inflating the bundle.
- **No streaming AI responses** — all LLM calls block on `generateContent()` completion.
- **No AI response caching at the LLM level** — `aiCache.ts` is in-memory per-session only; cache is lost on page reload.
- **GDPR/PA Maturità sections are hardcoded stubs** — 3 of 6 maturità sections have permanent blockers that cannot resolve computationally; they require manual compliance data entry but no UI exists for that.

---

## 7. Event & Workflow Architecture

### Current State: **No event-driven architecture present.**

All inter-module communication is synchronous and imperative:

- Store mutations trigger Zustand subscriptions (reactive reads only, no workflow chaining).
- AI results are returned synchronously and immediately rendered or stored via direct `.hydrate()` calls.
- Side effects exist inside React `useEffect` hooks (implicit, not auditable).
- `usePersistence` uses `setTimeout` debounce — the closest thing to an async workflow trigger.

### Areas Where Event-Driven Architecture (EDA) Would Add Value

| Area                   | Current Problem                                                                | EDA Opportunity                                                                      |
| ---------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| AI pipeline completion | `CopilotRecommendationPanel` calls `hydrate()` directly inside a render effect | `ai:pipeline:completed` event → store updates, telemetry, toast notification         |
| Auto-save              | Debounced via `setTimeout` in `usePersistence`                                 | `state:dirty` event → worker-based queue with back-pressure                          |
| Google Drive sync      | Polled at interval in `useAppEngine`                                           | `backup:sync:requested`, `backup:sync:completed` events                              |
| Navigation prediction  | `useSmartNavigation` updates localStorage inline                               | `nav:transition` event → prediction model update → prefetch trigger                  |
| Student risk alerts    | Recalculated inside render cycles                                              | `student:risk:changed` event → notification store                                    |
| AI LLM call            | Fire-and-forget with retry                                                     | `ai:request:queued`, `ai:request:retry`, `ai:response:received`, `ai:request:failed` |

---

## 8. Code Quality Analysis

| Area                           | Status              | Details                                                                                                                                                 |
| ------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Modularity (AI domain)**     | ✅ Good             | `src/ai/` is 21 coherent subdirectories of pure functions; independently testable                                                                       |
| **Modularity (UI/components)** | ⚠ Needs improvement | `src/components/` has 183 root-level files; many are not grouped into feature folders                                                                   |
| **Separation of concerns**     | ⚠ Needs improvement | `useAppEngine.ts` mixes navigation, backup, analytics, Drive sync, store init in 700+ lines                                                             |
| **Type safety**                | ⚠ Needs improvement | `nka/` modules have blanket `/* eslint-disable @typescript-eslint/no-explicit-any */`; `design-system/index.ts` uses 4+ `as any` casts                  |
| **Duplication**                | ⚠ Needs improvement | Three AI entry points (`aiEngine`, `aiPipeline`, `unifiedOrchestrator`) — same computation path, 2 deprecated                                           |
| **Test coverage**              | 🔴 Critical         | Thresholds: 30% statements / 22% branches / 22% functions / 32% lines. Production app with 1740 tests passing but 68%+ of code untested                 |
| **Dependency hygiene**         | ⚠ Needs improvement | `@testing-library/react`, `jsdom`, `lighthouse`, `chrome-launcher` in `dependencies` (not `devDependencies`) — inflates Vercel install                  |
| **Component size**             | ⚠ Needs improvement | `CopilotRecommendationPanel.tsx`, `ViewManager.tsx`, `useAppEngine.ts` significantly exceed 200-line guideline                                          |
| **Lint discipline**            | ✅ Good             | ESLint exit 0 on full codebase; violations suppressed with explicit disable comments (auditable)                                                        |
| **Accessibility**              | ✅ Good             | `aria-label` on all interactive elements enforced, focus traps, keyboard navigation hooks present                                                       |
| **Security**                   | ✅ Good             | API keys server-side only; SSRF allowlist; payload size guard; no `eval`, no XSS vectors found                                                          |
| **Dead code**                  | ⚠ Needs improvement | `aiEngine.ts` (@deprecated, still imported), `aiPipeline.ts` (@deprecated), Anthropic SDK (installed, unused), `M3Menu` (@deprecated comment in barrel) |

---

## 9. Reusable Components

| Component                | Location                                                     | Reason                                                          |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------------------------- |
| `M3Surface`              | `src/components/ui/M3Surface.tsx`                            | Pure MD3 surface wrapper, elevation 0–5, no app-domain coupling |
| `M3Typography`           | `src/components/ui/M3Typography.tsx`                         | Semantic text wrapper, role-based variants, no state            |
| `AppLayout`              | `src/components/ui/AppLayout.tsx`                            | Shell/nav container, app-agnostic MD3 layout                    |
| `ActivityList`           | `src/components/teacher-dashboard/ActivityList.tsx`          | Pure `Activity[]` renderer; no store dependency                 |
| `LessonCard`             | `src/components/teacher-dashboard/LessonCard.tsx`            | Pure Lezione display card; stateless                            |
| `StudentCard`            | `src/components/teacher-dashboard/StudentCard.tsx`           | Stateless student display with configurable risk flag           |
| `ExplainableInsightChip` | `src/components/copilot/ExplainableInsightChip.tsx`          | Self-contained chip + popover for AI confidence; no store       |
| `PerformanceHeatmap`     | `src/components/copilot/PerformanceHeatmap.tsx`              | Pure grade grid renderer; data-in, SVG-out                      |
| `StudentTrendChart`      | `src/components/copilot/StudentTrendChart.tsx`               | Recharts sparkline; pure component                              |
| `SectionBadge`           | `src/components/copilot/maturita/SectionBadge.tsx`           | Score chip; no domain coupling                                  |
| `GlobalProgressBar`      | `src/components/copilot/maturita/GlobalProgressBar.tsx`      | Weighted progress bar; pure                                     |
| `MaturitaSectionWrapper` | `src/components/copilot/maturita/MaturitaSectionWrapper.tsx` | Collapsible section shell; domain-agnostic                      |
| `csvImporter.ts`         | `src/components/teacher-dashboard/csvImporter.ts`            | Pure parse functions; no side effects                           |
| `useDebounce`            | `src/hooks/useDebounce.ts`                                   | Generic, zero coupling                                          |
| `useOnlineStatus`        | `src/hooks/useOnlineStatus.ts`                               | Generic navigator wrapper                                       |
| `callAiWithRetry`        | `src/services/aiClient.ts`                                   | Reusable retry/timeout wrapper for any AI call                  |

---

## 10. Refactoring Candidates

| Module                                        | Problem                                                                                              | Recommendation                                                                                                                |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `useAppEngine.ts` (~700 lines)                | God hook: mixes navigation, backup, Drive sync, store init, deep-link parsing, analytics in one file | Split into: `useNavigation`, `useBackupSync`, `useDriveSync`, `useAppInit`; keep `useAppEngine` as thin composition root      |
| `ViewManager.tsx` (26-arm switch)             | Adding a view requires editing 4 files; switch scales O(n) with view count                           | Replace switch with data-driven registry lookup: `VIEW_CONFIGS[currentView].componentProps(state, actions)`                   |
| `src/types.ts` (874-line barrel)              | Double-barrel with `src/types/index.ts`; `View` union type (40+ string literals) lives inline        | Merge into single `src/types/index.ts`; move `View` to `src/types/navigation.types.ts`; remove inline definitions from barrel |
| `CopilotRecommendationPanel.tsx`              | Imports 8 AI modules directly; orchestration logic mixed with render                                 | Extract orchestration into `useCopilotRecommendations` hook; panel becomes pure display                                       |
| `aiService.ts`                                | `aiSettings.model` parameter silently ignored; 60% of functions hardcode model name                  | Unify model selection: single `resolveModel(settings, tier: 'pro'\|'flash')` helper used everywhere                           |
| `src/ai/engine/aiEngine.ts` + `aiPipeline.ts` | Both `@deprecated` but still imported                                                                | Delete both; migrate remaining consumers to `unifiedOrchestrator.ts`                                                          |
| `googleDriveService.ts`                       | Uses `declare const google: any`, `declare const gapi: any` — no type safety; assumes global init    | Add `@types/google.accounts` (community), guard all access via `isDriveAvailable()` predicate                                 |
| `src/components/` root (183 files)            | Feature-unaware flat folder; impossible to locate feature files by function                          | Group into feature folders: `classroom/`, `academic/`, `evaluation/`, `navigation/`, etc.                                     |
| `usePersistence.ts`                           | Debounce implemented with bare `setTimeout` + `useRef` inside a hook                                 | Replace with `useDebouncedCallback` from the existing `useDebounce.ts` hook                                                   |
| `nka/` module (24 files)                      | Multiple files with blanket `any` disable comments; `userContext: any` signatures throughout         | Define `NKAUserContext` type interface; remove blanket eslint-disable blocks                                                  |

---

## 11. Rewrite Candidates

| Module                                                                 | Reason                                                                               | Risk if Kept                                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `src/ai/engine/aiEngine.ts`                                            | Deprecated, still imported by DevTools — confusion about which pipeline is canonical | Low-severity confusion risk; can accumulate new consumers by accident                     |
| `src/ai/pipeline/aiPipeline.ts` + `useAIPipeline.ts`                   | Deprecated pipeline still used by NKA module                                         | Divergence from `unifiedOrchestrator` output schema if either is updated                  |
| `api/ai.ts` (Anthropic path)                                           | Anthropic SDK installed and documented but zero call sites exist; dead weight        | ~80KB production bundle hit; misleading architecture docs                                 |
| `src/ai/maturita/maturitaPipeline.ts` — GDPR/Accessibilità/PA sections | 3 of 6 sections are hardcoded permanent blockers with no resolution path             | No value to user; creates false impression of completeness; blocks "Gold Compliant" claim |
| `src/ai/cache/aiCache.ts`                                              | Two in-memory Maps without LRU / TTL / size limits; reset on every page load         | Memory leak risk under heavy AI DevTools usage; 0 benefit for long sessions               |

---

## 12. Technical Debt Assessment

### Overall Score: **5.5 / 10**

_The codebase shows mature engineering in the AI domain, security layer, and design system governance, held back by monolithic orchestration, low test coverage, and accumulated deprecated code._

| Debt Source                         | Severity   | Description                                                                                    |
| ----------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| **Test coverage (22–34%)**          | High       | 68%+ of code has no automated safety net; refactoring is high-risk                             |
| **God hook `useAppEngine`**         | High       | Single 700-line file is a change magnet and cannot be unit-tested in isolation                 |
| **Dual barrel type system**         | Medium     | `src/types.ts` 874 lines + `src/types/index.ts` — tree-shaking impediment, circular risk       |
| **Three AI pipeline entry points**  | Medium     | Developer cognitive overhead; deprecated code still being imported                             |
| **Anthropic SDK dead dependency**   | Medium     | Installed, no call sites, ~80KB bundle waste, misleading documentation                         |
| **Dev packages in `dependencies`**  | Medium     | `@testing-library/react`, `jsdom`, `lighthouse` in prod deps — inflates Vercel install time    |
| **`View` union type (40+ strings)** | Medium     | Every new view requires editing 4 files; no compile-time enforcement of handler registration   |
| **No AI response streaming**        | Medium     | UX blocks on full LLM completion; poor perceived performance for long generations              |
| **In-memory AI cache (no TTL/LRU)** | Low-Medium | Memory leak risk; no cross-session benefit                                                     |
| **Hardcoded model names**           | Low        | `aiSettings.model` user preference partially ignored; silent degradation of user configuration |
| **`temp-${Date.now()}` IDs**        | Low        | Intentional pattern but fragile if serialization ever requires stable IDs                      |
| **Runtime CSS `<style>` injection** | Low        | Media-query injected in JSX; bypasses Stylelint, harder to audit and override                  |

---

## 13. Scalability Assessment

| Dimension                        | Score | Assessment                                                                                                                                                                                               |
| -------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Modular plugins**              | 5/10  | `pluginRegistry.ts` and `usePluginWidgets.ts` exist but are not deeply integrated; no formal plugin contract or sandboxing                                                                               |
| **Event-driven automation**      | 2/10  | No event bus present; all workflows require imperative hook-to-hook wiring; adding EDA requires architectural investment                                                                                 |
| **AI copilots**                  | 7/10  | `src/ai/` is well-structured pure-function domain; adding new AI capabilities is straightforward; bottleneck is `aiService.ts` model routing                                                             |
| **Predictive workflows**         | 6/10  | Prediction models (OLS risk, trend forecasts) are production-ready; integration into UI is ad hoc without a workflow scheduling layer                                                                    |
| **Multi-device UX**              | 6/10  | PWA + service worker present; MUI v7 responsive; `RESPONSIVE_RULES.md` documents breakpoints; gesture support (`gesture-mobile.spec.ts`); but complex views (Gantt, timetable) not designed mobile-first |
| **Multi-tenant / multi-school**  | 2/10  | Single-user model (one `UserProfile`); no tenant isolation, no role-based access control beyond single docente role                                                                                      |
| **Horizontal feature expansion** | 4/10  | Flat `src/components/` with 183 root files + 4-file-per-view registration overhead limits sustainable growth                                                                                             |

---

## 14. Suggested Architecture Evolution

### Phase A — Foundation (0–3 months)

**1. Split `useAppEngine.ts` into focused hooks**

```
useAppInit      → store hydration, schema migration, privacy consent, GDPR retention
useNavigation   → view transitions, history, deep links, smart prediction
useBackupSync   → debounced IndexedDB save/restore
useDriveSync    → Google Drive upload/download at configurable intervals
```

**Benefit:** Each hook becomes independently testable; eliminates the change magnet.

**2. Data-driven view routing**
Replace `ViewManager.tsx` switch/case with:

```ts
// viewRegistry already contains VIEW_CONFIGS; extend it:
VIEW_CONFIGS[view].resolveProps(state: AppState, actions: AppActions) => ComponentProps
// ViewManager becomes a 20-line generic renderer
```

**Benefit:** New views require editing only `types/navigation.types.ts` + `viewRegistry.ts` (2 files, not 4).

**3. Consolidate type system**
Merge `src/types.ts` into `src/types/index.ts`; move `View` union to `src/types/navigation.types.ts`.
**Benefit:** Single source of truth; removes circular export risk.

---

### Phase B — Event Bus (3–6 months)

**Introduce a lightweight typed event bus** (e.g., `mitt` or custom):

```ts
// src/events/appEventBus.ts
type AppEvents = {
  "ai:pipeline:completed": { className: string; result: UnifiedAIResult };
  "state:dirty": { source: StoreName };
  "backup:sync:requested": { trigger: "auto" | "manual" };
  "nav:transition": { from: View; to: View };
  "student:risk:changed": {
    studentId: string;
    level: "low" | "medium" | "high";
  };
};
```

**Benefit:** Decouples AI completion → store hydration → UI notification → telemetry chain; enables workflow composition without nested `useEffect` chains.

---

### Phase C — AI Orchestration Layer (6–9 months)

**Formalize the AI orchestration contract:**

```ts
// src/ai/orchestrator/types.ts (expand existing)
interface AIWorkflowStep {
  id;
  fn;
  dependencies: string[];
  timeout;
}
interface AIWorkflow {
  id;
  steps: AIWorkflowStep[];
  onComplete;
  onError;
}
// runWorkflow(wf, context) → Promise<WorkflowResult>
```

**Add streaming support** via `generateContentStream()` in Gemini SDK — improve perceived LLM performance.
**Add persistent AI cache** (IndexedDB, TTL 24h, LRU 100 entries) — reduce Gemini API costs on repeated reports.
**Benefit:** Observable, retryable, composable AI pipelines; auditability for GDPR/PA compliance.

---

### Phase D — Feature Modules (9–12 months)

**Restructure `src/components/` into feature modules:**

```
src/features/
  academic/           (timetable, lessons, UDA, register)
  classroom/          (students, evaluations, competencies)
  copilot/            (AI panels, recommendations, maturità)
  planning/           (annual plan, class plan wizard)
  documents/          (PDF/DOCX generation)
  analytics/          (dashboard, reports, funding)
  nka/                (knowledge graph)
  teacher-dashboard/  (new unified dashboard)
```

**Benefit:** Co-location of feature types, stores, hooks, components, and tests; scales with contributor count.

---

### Phase E — Multi-Role Expansion (12+ months)

- Add **role-based access control** (`docente`, `dirigente`, `genitore`, `studente`) to `UserProfile`.
- Introduce **tenant isolation** for school-level data boundaries.
- **Plugin SDK** — formalize `pluginRegistry.ts` into a proper sandboxed contract with `PluginManifest`.

---

## 15. Documentation Needed

| Document               | Status                                        | Priority                                                           |
| ---------------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| `README.md` (root)     | ✅ Exists                                     | —                                                                  |
| `CLAUDE.md`            | ✅ Exists, well-maintained                    | —                                                                  |
| Architecture document  | ✅ `docs/ARCHITECTURE.md` exists              | Review and align with reality post-Phase A                         |
| Developer guide        | ✅ `docs/DEVELOPMENT.md`                      | Needs: event bus conventions, feature module structure             |
| AI integration guide   | ✅ `docs/ai-context-engine-implementation.md` | Needs: orchestrator entry points, deprecated path removal timeline |
| API documentation      | ✅ `docs/INTERNAL_API.md`                     | Needs: `api/ai.ts` actions, error codes, rate limit behavior       |
| Roadmap                | ✅ `docs/ROADMAP.md`                          | Needs: EDA phase, multi-role scope                                 |
| Contribution guide     | ❌ Missing                                    | **High** — no `CONTRIBUTING.md`                                    |
| Test patterns guide    | ✅ `docs/TEST_PATTERNS.md`                    | Needs: coverage targets per module, snapshot update policy         |
| Security model         | ✅ `SECURITY.md`                              | Needs: Anthropic key removal note, per-IP rate limit gap           |
| Plugin SDK spec        | ❌ Missing                                    | **Medium** — plugin registry exists without contract               |
| Event bus conventions  | ❌ Missing                                    | **High** once EDA is introduced                                    |
| Schema migration guide | ❌ Missing                                    | **Medium** — `schemaMigration.ts` pattern undocumented             |

---

## 16. Final Engineering Summary

### A) SAFE TO KEEP

| Item                                                                                                   | Priority |
| ------------------------------------------------------------------------------------------------------ | -------- |
| `src/ai/` pure-function domain (recommendation, prediction, explainability, trust, fairness, pedagogy) | High     |
| Zustand store architecture (5 domain stores + actions namespace pattern)                               | High     |
| `api/ai.ts` Edge Function — security perimeter, SSRF list, key isolation                               | High     |
| MD3 design system tooling (`src/components/ui/`, `src/design-system/`, 10x `md3:*` scripts)            | High     |
| `useSmartNavigation` + `usePrefetch` — predictive lazy loading                                         | Medium   |
| `src/services/aiClient.ts` `callAiWithRetry` pattern                                                   | High     |
| OTel tracing setup (`src/tracing.ts`)                                                                  | Medium   |
| `usePersistence.ts` + `backupService.ts` — IndexedDB strategy                                          | Medium   |
| Privacy / GDPR layer (`PrivacyConsentModal`, `dataRetention.ts`)                                       | High     |
| CI/CD workflows (lint, test, release-gate, e2e-smoke)                                                  | High     |
| `src/components/teacher-dashboard/` (new, already clean)                                               | Medium   |
| Playwright E2E test suite                                                                              | High     |

---

### B) SHOULD BE REFACTORED

| Item                                                                               | Priority   |
| ---------------------------------------------------------------------------------- | ---------- |
| `useAppEngine.ts` → split into 4 focused hooks                                     | **High**   |
| `ViewManager.tsx` → data-driven registry lookup                                    | **High**   |
| `src/types.ts` barrel → merge into `src/types/index.ts`, extract `View` type       | **High**   |
| `aiService.ts` model routing → `resolveModel(settings, tier)` helper               | **Medium** |
| `CopilotRecommendationPanel.tsx` → extract `useCopilotRecommendations` hook        | **Medium** |
| `googleDriveService.ts` → type the global `google`/`gapi` objects                  | **Medium** |
| `nka/` module → replace `any` with typed `NKAUserContext`                          | **Medium** |
| `package.json` → move test/audit packages from `dependencies` to `devDependencies` | **High**   |
| `src/components/` root (183 files) → feature folder grouping                       | **Medium** |
| `src/ai/cache/aiCache.ts` → add TTL + LRU eviction + IndexedDB persistence         | **Medium** |
| Coverage thresholds → increase progressively toward 60%+ (roadmap item #23)        | **High**   |

---

### C) SHOULD BE REWRITTEN

| Item                                                                                                              | Priority             |
| ----------------------------------------------------------------------------------------------------------------- | -------------------- |
| `src/ai/engine/aiEngine.ts` (deprecated) → delete, migrate DevTools import to orchestrator                        | **High**             |
| `src/ai/pipeline/aiPipeline.ts` + `useAIPipeline.ts` (deprecated) → delete, migrate NKA consumer                  | **High**             |
| `api/ai.ts` Anthropic path → remove Anthropic SDK entirely (or implement actual usage)                            | **Medium**           |
| `maturitaPipeline.ts` GDPR/PA/Accessibilità sections → replace hardcoded stubs with data-entry-backed computation | **Medium**           |
| Cross-module AI workflow → event bus + typed workflow engine replacing imperative `useEffect` chains              | **High** (long-term) |

---

_End of Technical Architecture Report — DocenteDoc AI, 16 March 2026_
