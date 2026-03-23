# DocenteDoc AI — CLAUDE.md

Stack: **React 18 + TypeScript + Vite + MUI v7 + Zustand** — SPA full-client + Server Node.js + Edge Functions Vercel.

---

## Prodotti che condividono questo kernel

| Prodotto        | Moduli condivisi                                              |
| --------------- | ------------------------------------------------------------- |
| DocenteDoc AI   | EmotionalEngine, CognitiveStyleEngine, MergeStrategy          |
| Orbit Jarvis    | orbitEngine, patternDetector, narrativeLayer, attentionRouter |
| Server Adattivo | adaptive.ts, feedbackLoop, memoryConsolidation, embedding     |

---

## Architettura cognitiva — P44.6 (baseline corrente)

```
Input utente
  └─▶ IntakeExpansion          keyword expand (carica/documento/…) — useSmartChat.ts
        └─▶ EmotionalEngine       rileva stato, smoothState, lastPerceivedState
              └─▶ CognitiveStyleEngine  deriveStyle, smoothStyle (EWA 70/30)
                    └─▶ mergeStrategy   P1:safety > P2:style > P3:speed  →  AdaptedStrategy
                          └─▶ SystemPromptBuilder + adaptBlocks  →  risposta adattiva
                                └─▶ UIBlock Layer (P44.6)
                                      ├─▶ PlanEngine        → orbit_plan  (conf ≥ 0.65)
                                      ├─▶ ExplainEngine     → explain     (max 2 items)
                                      ├─▶ ConfidenceEngine  → confidence  (max 3 factors)
                                      ├─▶ WorkSessionEngine → work_session
                                      ├─▶ DecisionCard      → solo se !planPresent / score<0.7 / shouldShow
                                      └─▶ OrbitSuggestion   → ≤3 intent questions
                                            └─▶ Learning loop (recordModeUsage, reveal click, feedback)
```

**File cognitivi chiave:**

| File                                                | Ruolo                                                      |
| --------------------------------------------------- | ---------------------------------------------------------- |
| `src/modules/orchestration/EmotionalEngine.ts`      | segnali → stato → strategia, `lastPerceivedState`          |
| `src/modules/orchestration/CognitiveStyleEngine.ts` | `deriveStyle`, `smoothStyle`, `mergeStrategy`              |
| `src/modules/orchestration/SystemPromptBuilder.ts`  | assembly prompt con sezioni emotional + style              |
| `src/modules/orchestration/ExplainEngine.ts`        | blocco `explain` — `items.slice(0, 2)` hard cap            |
| `src/modules/orchestration/ConfidenceEngine.ts`     | blocco `confidence` — `MAX_FACTORS = 3` hard cap           |
| `src/modules/orchestration/WorkSessionEngine.ts`    | blocco `work_session` unificato                            |
| `src/modules/orbit/OrbitSuggestionEngine.ts`        | ≤3 suggerimenti in forma domanda soft                      |
| `src/hooks/useSmartChat.ts`                         | pipeline 10-step — assembla UIBlock[] per ogni turno       |
| `src/stores/useChatPrefsStore.ts`                   | persist `'chat-prefs-v3'` — profile + style + signals      |
| `src/components/chat/SmartChat.tsx`                 | reveal button, REVEAL_LABEL, recordRevealClick             |
| `src/components/chat/MessageBlockRenderer.tsx`      | PlanCardBlock / DecisionCardBlock / WorkSessionBlock       |
| `src/components/orbit/OrbitDock.tsx`                | drawer suggerimenti, hasDecisionCard guard, MOBILE_PB=30vh |

**Invarianti non violabili del merge engine:**

1. `guidance === 'lead'` → safety override immediato (depth=light, uiDensity=low) — nessuna altra regola prevale
2. `smoothState` e `smoothStyle` non vengono mai bypassati
3. `adaptBlocks` non elimina contenuto — usa solo `hidden: true`
4. Gerarchia fissa: Emotion > Style > Speed

**Invarianti non violabili del UIBlock layer (P44.6):**

5. Gerarchia layer: `Chat > PlanCard > DecisionCard > Orbit` — non negoziabile
6. `orbit_plan` sempre a `index=1` dell'array UIBlock[] (dopo testo assistant) — non spostare
7. `DecisionCard` appare **solo** se `!planPresent || confidence.score < 0.7 || explain.shouldShow`
8. `OrbitDock` silenzioso se `decision_card` o `work_session` presenti negli ultimi 3 messaggi assistant

→ Vedi [docs/COGNITIVE_ARCHITECTURE_P44.6.md](docs/COGNITIVE_ARCHITECTURE_P44.6.md) per diagramma completo (appendice P44.6 in fondo al doc).

---

## Quick Start

```bash
npm install --legacy-peer-deps   # dipendenze (Vercel usa questo flag)
npm run dev                      # dev server → http://localhost:5173
npm run build                    # build produzione in /dist
npm run serve                    # preview build locale (stessa porta)
```

---

## Comandi essenziali

```bash
# Test
npm test                         # Vitest watch mode
npm run test:unit                # Vitest run (CI-safe, no watch)
npm run test:coverage            # coverage v8
npm run test:e2e                 # Playwright su localhost:5173 (avvia dev auto)
npm run test:e2e:smoke           # solo smoke test (chromium, rapido)

# Lint / QA
npm run lint                     # ESLint — include le 4 regole MD3 no-restricted-syntax
npm run lint:fix                 # ESLint con autofix
npm run lint:css                 # Stylelint su src/**/*.css
npm run md3:audit                # alias → npm run lint (ESLint è l'enforcement MD3)
npm run md3:scan:strict          # alias → lint --max-warnings 0 (zero-tolerance)
npm run md3:audit:all            # alias → lint + tsc (audit completo)
npm run md3:validate             # alias → lint + build (gate pre-deploy)

# Storybook
npm run storybook                # dev su http://localhost:6006
npm run build-storybook          # build statica Storybook

# TypeScript check
npx tsc -b --noEmit              # verifica tipi senza emettere file
```

---

## Struttura progetto

```
src/
├── components/          # Componenti UI principali
│   ├── chat/            # SmartChat, InputBar, AssistantMessage, ProgressiveReveal
│   ├── classroom/       # Tab estratti da ClassroomView (Register, Notes, Resources)
│   ├── copilot/         # CopilotDocentePanel + 12 sub-tab + AITabErrorBoundary
│   ├── settings/        # 7 pannelli Settings (SettingsXxx.tsx) + stubs
│   └── ...
├── design-system/       # Layer DS (M3Surface, M3Typography, AppLayout…)
├── hooks/               # Custom hooks (useSmartChat, useOrbitSession, useProactiveSchedule…)
├── modules/
│   ├── orchestration/   # ❗ KERNEL cognitivo — EmotionalEngine, CognitiveStyleEngine,
│   │                    #   SystemPromptBuilder, CognitiveOrchestrator, patternDetector,
│   │                    #   emergentSkillStore, skillRegistry
│   ├── orbit/           # orbitEngine, coordinationEngine, executionEngine,
│   │                    #   narrativeLayer, attentionRouter, agentMapper
│   ├── cognition/       # userBehaviorModel, cognitiveLoad
│   ├── connectors/      # (P3 in corso) email, file, external sync
│   └── session/         # orbitSession
├── services/            # AI proxy, Google Drive, backup, storage
├── stores/              # Zustand stores per dominio
│   ├── useChatPrefsStore.ts     # v3 — emotional profile + cognitive style
│   ├── useUserBehaviorStore.ts  # freq/preferred/ignored/riskTolerance
│   ├── useFlowStore.ts          # orbit flows (persist 'orbit_flows_v1')
│   └── ...
├── theme/               # muiTheme.ts + M3ThemeProvider + token MD3
│   ├── orbitTokens.ts   # CSS custom properties Orbit + ORBIT_BACKGROUND/TEASER/STEP_COLORS
│   ├── orbitTheme.ts    # ORBIT_CSS_VARS, injectOrbitCssVars() — chiamato da main.tsx
│   ├── orbitStates.ts   # stato agente, mobile cap < 600px
│   ├── agentPersonality.ts
│   └── presenceEngine.ts
├── types/               # Tipi TypeScript per dominio (9 moduli)
│   ├── index.ts         # barrel re-export
│   ├── uda.types.ts
│   ├── student.types.ts
│   ├── ai.types.ts
│   └── ...
├── cognition/           # userBehaviorModel, cognitiveLoad, eventMap (copilotHints)
├── utils/               # Utility pure
├── main.tsx             # Entry point
├── tracing.ts           # OpenTelemetry (attivo in prod)
└── sw.ts                # Service Worker (PWA)

server/src/              # Backend Node.js + Express
├── agents/              # Agenti server-side
├── services/
│   ├── adaptive.ts      # Outcome logging, agent scoring (α·success + β·cosine + γ·recency)
│   ├── embedding.ts     # Embedding vettoriale per cosine similarity
│   ├── feedbackLoop.ts  # Ciclo di feedback sul comportamento agente
│   ├── memoryConsolidation.ts  # Cross-session memory merge
│   ├── ranking.ts       # temporalDecay, exponential half-life 7 days
│   └── tagging.ts       # Auto-tagging artefatti AI
├── routes/              # API REST
└── middleware/          # Auth, rate limit, error handling

api/                     # Vercel Edge Functions
└── ai.ts                # Proxy Gemini/Anthropic — SOLO server-side

e2e/                     # Test Playwright
__tests__/               # Test Vitest (unit + integration + visual regression)
```

### Path alias

```typescript
// tsconfig.json — usa sempre @/ per importare da src/
import { UDA } from "@/types"; // → src/types/index.ts (barrel)
import { useAppEngine } from "@/hooks/useAppEngine";
```

---

## Regole MD3 (NON DEROGABILI)

Ogni modifica UI **deve** rispettare Material Design 3:

- **Container visivi**: usa `M3Surface`, `AppLayout`, o wrapper MD3. **Vietato `<div>` per shell/card/layout.**
- **Tipografia**: usa `M3Typography`. Vietato `fontSize` / `fontWeight` inline (stringa rem/px o numero grezzo per il testo — ok numero grezzo per icone).
- **Spacing**: solo token MD3. Vietato spacing hardcoded o non tracciato.
- **Icone**: usa `var(--md-sys-icon-size-{xs|sm|md|lg|xl|2xl})` anziché numeri raw (16/20/24/…).
- **Bottoni/interattivi**: usa componenti MUI v7 o wrapper MD3. Ogni elemento interattivo deve avere `aria-label`.
- **Errori/loader/stati**: usa componenti MD3 dedicati. Vietati `<div>` stilizzati come fallback.
- **Elevation**: solo se semanticamente necessaria MD3. Niente `box-shadow` custom.

Dopo ogni modifica UI, verifica con `npm run lint` (0 errori, 0 warning = conforme MD3).

---

## Gestione dei tipi TypeScript

- **Non aggiungere tipi in `src/types.ts`** (barrel file, 874 righe) — scrivi nel modulo dominio appropriato in `src/types/`.
- Importa sempre dal barrel: `import { UDA } from '@/types'` o `import type { StudentProfile } from '@/types/student.types'`.
- Dopo ogni modifica ai tipi, verifica con `npx tsc -b --noEmit`.

---

## AI proxy (sicurezza)

- **Non usare** `import.meta.env.VITE_GEMINI_API_KEY` nei componenti browser. Le chiavi AI sono **solo server-side**.
- Le chiamate AI passano per `api/ai.ts` (Vercel Edge Function) che usa `GEMINI_API_KEY` / `ANTHROPIC_API_KEY` dal server.
- `window.aistudio` è l'unico fast-path client-side consentito (ambienti AI Studio host).

---

## Variabili d'ambiente

```bash
# .env.local (mai committato)
GEMINI_API_KEY=...              # server-side solo (Vercel Edge)
ANTHROPIC_API_KEY=...           # server-side solo

# Opzionali dev
VITE_ENABLE_GSI_DEV=true        # Abilita Google Sign-In in development
VITE_GSI_CLIENT_ID=...          # Client ID Google OAuth (dev)
VITE_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces  # Tracing locale
```

---

## State management

- **Zustand** (no Redux, no Context per stato globale).
- Store separati per dominio in `src/stores/`.
- I React Context in `src/context/` e `src/contexts/` sono per tema/modal — **non** per dati applicativi.

---

## Testing

- **Vitest** per unit/integration: file in `src/**/*.{test,spec}.{ts,tsx}` e `__tests__/**`.
- **Playwright** per E2E: file in `e2e/`. Dev server viene avviato automaticamente su porta 5173.
- **Visual regression** MD3: `npm run test:visual:md3` → `__tests__/visual-regression/md3-*.spec.ts`.
- Setup Vitest globale: `vitest.setup.tsx` (importato automaticamente).
- I test E2E usano `localhost:5173`; Playwright riutilizza il server esistente se già attivo.

---

## Deploy

- **Vercel** — `vercel.json` configura build, SPA rewrite e header sicurezza.
- Install flag obbligatorio: `--legacy-peer-deps` (già in vercel.json).
- Le Edge Function sono in `api/` (solo `ai.ts`).
- PWA: service worker generato da `vite-plugin-pwa` (injectManifest mode), sorgente in `src/sw.ts`.

---

## Gotchas

- **`src/build-polyfill.js`** deve essere il **primo** import in `vite.config.ts` — non rimuoverlo o riordinarlo.
- **`npm install --legacy-peer-deps`** sempre — dipendenze peer MUI v7 + React 18 non sono ancora stabili.
- **`storybook` project in vitest** usa Playwright browser headless — non è attivo su ogni macchina; se fallisce, lanciare solo `npm run test:unit`.
- **`localStorage.clear()`** in `main.tsx` è commentato come `TEMPORARILY DISABLED` — non riattivare senza consenso esplicito.
- **`temp-${Date.now()}` IDs** nei wizard (AnnualPlanningWizard, ClassPlanningWizard) — pattern esistente, non sostituire con UUID senza allineare tutta la logica di serializzazione.
- **Google Drive GSI**: in production usa variabili Vercel. In dev richiede `VITE_ENABLE_GSI_DEV=true` + client ID valido.
- **Storybook** gira su porta 6006, separata dal dev server.
- **`useChatPrefsStore` usa persist key `'chat-prefs-v3'`** — cambiare la key causa reset automatico (migrazione dati non gestita).
- **`mergeStrategy` gerarchia è non negoziabile** — non aggiungere logica tra P1 safety e output senza aggiornare i test del merge engine.
- **`smoothStyle` EWA 70/30** — non aumentare il peso "30% new" senza test A/B; oscillazioni visive immediate.
- **`orbit_flows_v1` persist key** — non rinominare senza migration; in React Native bisogna migrare a AsyncStorage.
- **`orbitTokens.ts` usa CSS custom properties** — non funziona in React Native senza shim numerico.
- **Server `adaptive.ts`** non lancia mai eccezioni al chiamante; tutti gli errori sono `logger.warn`. Non aggiungere `throw` senza consenso.
- **Encoding UTF-8**: alcuni file sorgente possono contenere double-encoding (es. `â€"` al posto di `—`, `Ã ` al posto di `à`). Usare `scripts/fix-encoding.mjs` per batch-fix. NON aprire/salvare file con editor in Latin-1/Windows-1252.
- **`orbit_plan` sempre a index=1** — `PlanCardBlock` usa `activeStep` come stato locale del componente (non Zustand store); non sollevare senza sprint dedicato.
- **`DecisionCard` è condizionale** — non renderla always-present. La P44.5 `const unify = actionsIdx !== -1` è stata corretta in P44.6; non ripristinare.
- **`hasDecisionCard` guard in `OrbitDock.tsx`** — silenzioso quando una decisione è già in context. Non rimuovere senza aggiornare i test E2E del nudge.
- **`ExplainEngine.items.slice(0,2)` e `ConfidenceEngine.MAX_FACTORS=3`** — hard limits cognitivi. Non aumentare senza test A/B sulla riduzione di carico cognitivo.
- **`INTAKE_KEYWORDS` in `useSmartChat.ts`** — espandono input breve prima di `buildPlan()`. Non rimuovere senza test A/B sul tasso di plan confidence.
- **`orbit_teaser_v1` localStorage key** — cambiare la key causa ri-presentazione del teaser a tutti gli utenti esistenti. Incrementare solo con migration esplicita.
- **`injectOrbitCssVars()` in `main.tsx`** — inietta `--orbit-*` CSS custom properties nel `<head>` prima del primo render. Deve restare la prima chiamata dopo `injectOrbitCssVars` e prima di `<React.StrictMode>`. Idempotente — sicuro chiamarlo più volte.

---

## Componenti chiave (navigazione rapida)

| File                                            | Scopo                                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------ |
| `src/hooks/useSmartChat.ts`                     | Pipeline 10-step: assembla UIBlock[] per ogni turno                            |
| `src/components/chat/MessageBlockRenderer.tsx`  | PlanCardBlock / DecisionCardBlock / WorkSessionBlock                           |
| `src/components/orbit/OrbitDock.tsx`            | Drawer suggerimenti, hasDecisionCard guard, MOBILE_PB=30vh                     |
| `src/components/copilot/AITabErrorBoundary.tsx` | Per-tab error boundary 12 sub-tab CopilotDocentePanel                          |
| `src/components/PrivacyConsentModal.tsx`        | Prima schermata GDPR art.13 (blocking dialog)                                  |
| `src/utils/dataRetention.ts`                    | GDPR B4: cleanup artefatti AI dopo 365 giorni                                  |
| `src/components/UnifiedOnboardingFlow.tsx`      | Onboarding 4-step unificato (Welcome→HowIWork→AI→GDPR)                         |
| `src/components/ui/OrbitTeaser.tsx`             | Walkthrough iniziale 4 slide; gate `orbit_teaser_v1`; skip in `__TEST_MODE`    |
| `src/theme/orbitTheme.ts`                       | `injectOrbitCssVars()` — injector CSS `--orbit-*` vars; chiamato da `main.tsx` |

### Roadmap Orbit (documentazione)

| Documento                         | Contenuto                                                        |
| --------------------------------- | ---------------------------------------------------------------- |
| `docs/ORBIT_ROADMAP_OPERATIVA.md` | Roadmap 10 fasi con sprint consigliati; Fasi 0-5 ✅ Fasi 6-10 ⏳ |
| `docs/ORBIT_VISION_2026.md`       | Visione strategica, opportunità, vincoli, Design System esteso   |

### Privacy / GDPR

- Consenso richiesto al primo avvio via `PrivacyConsentModal` (`privacy_consent_v1` in localStorage).
- `hasPrivacyConsent()` / `recordConsent()` esportate da `PrivacyConsentModal.tsx`.
- `runRetentionCheck()` chiamato a ogni avvio da `main.tsx` — rimuove dati AI scaduti.
- Dati **primari** (UDA, alunni, valutazioni) NON soggetti a auto-delete.
- `cognitiveStyle` e `emotionalProfile` **non vengono mai inviati a endpoint esterni**.
