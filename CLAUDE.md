# DocenteDoc AI — CLAUDE.md

> **Sistema cognitivo adattivo** per docenti italiani. Non è un'app: è un'intelligenza che impara lo stile di chi la usa.  
> Ogni layer condiviso tra tutti i prodotti dell'ecosistema — ciò che cresce qui cresce ovunque.

Stack principale: **React 18 + TypeScript + Vite + MUI v7 + Zustand** — SPA full-client + Server Node.js + Edge Functions Vercel.

---

## Ecosistema & Prodotti

Il codice di questo repo è il **kernel condiviso** di un ecosistema in espansione:

| Prodotto             | Stato             | Layer cognitivo condiviso                                     |
| -------------------- | ----------------- | ------------------------------------------------------------- |
| **DocenteDoc AI**    | ✅ Pilota pronto  | EmotionalEngine, CognitiveStyleEngine, MergeStrategy          |
| **Orbit Jarvis**     | 🔄 P2–P4 in corso | orbitEngine, patternDetector, narrativeLayer, attentionRouter |
| **Server Adattivo**  | ✅ Operativo      | adaptive.ts, feedbackLoop, memoryConsolidation, embedding     |
| **Mobile (RN/Expo)** | 📋 Pianificato    | 12 moduli logica pura già mobile-ready                        |

**Principio fondante:** ogni innovazione cognitiva (nuovo pattern emotional, nuovo layer style, nuovo segnale) migra immediatamente in tutti i prodotti. Il sistema si autoalimenta: più impara da DocenteDoc, più diventa intelligente in Orbit e viceversa.

---

## Architettura cognitiva — P39.6 (baseline corrente)

```
Input utente
  └─▶ EmotionalEngine          rileva stato, smoothState, lastPerceivedState
        └─▶ CognitiveStyleEngine  deriveStyle, smoothStyle (EWA 70/30)
              └─▶ mergeStrategy    P1:safety > P2:style > P3:speed  →  AdaptedStrategy
                    └─▶ SystemPromptBuilder + adaptBlocks  →  risposta adattiva
                          └─▶ Learning loop (recordModeUsage, reveal click, feedback)
```

**File cognitivi chiave:**

| File                                                | Ruolo                                                 |
| --------------------------------------------------- | ----------------------------------------------------- |
| `src/modules/orchestration/EmotionalEngine.ts`      | segnali → stato → strategia, `lastPerceivedState`     |
| `src/modules/orchestration/CognitiveStyleEngine.ts` | `deriveStyle`, `smoothStyle`, `mergeStrategy`         |
| `src/modules/orchestration/SystemPromptBuilder.ts`  | assembly prompt con sezioni emotional + style         |
| `src/hooks/useSmartChat.ts`                         | pipeline completa per turno (10 step)                 |
| `src/stores/useChatPrefsStore.ts`                   | persist `'chat-prefs-v3'` — profile + style + signals |
| `src/components/chat/SmartChat.tsx`                 | reveal button, REVEAL_LABEL, recordRevealClick        |

**Invarianti non violabili del merge engine:**

1. `guidance === 'lead'` → safety override immediato (depth=light, uiDensity=low) — nessuna altra regola prevale
2. `smoothState` e `smoothStyle` non vengono mai bypassati
3. `adaptBlocks` non elimina contenuto — usa solo `hidden: true`
4. Gerarchia fissa: Emotion > Style > Speed

→ Vedi [docs/COGNITIVE_ARCHITECTURE_P39.6.md](docs/COGNITIVE_ARCHITECTURE_P39.6.md) per diagramma completo.

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
│   ├── orbitTokens.ts   # CSS custom properties Orbit
│   ├── orbitStates.ts   # stato agente, mobile cap < 600px
│   ├── agentPersonality.ts
│   └── presenceEngine.ts
├── types/               # Tipi TypeScript per dominio (9 moduli)
│   ├── index.ts         # barrel re-export
│   ├── uda.types.ts
│   ├── student.types.ts
│   ├── ai.types.ts
│   └── ...
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

---

## Stato Progetto — Marzo 2026

### Ciclo Cognitivo Adattivo — COMPLETATO (P38–P39.6)

| Sprint/Phase | Feature                                                        | Commit     | Stato |
| ------------ | -------------------------------------------------------------- | ---------- | ----- |
| P38.5–P38.6  | EmotionalEngine L1-L4b, learning layer, progressive reveal     | `a4003769` | ✅    |
| P38.7        | smoothState, REVEAL_LABEL dinamica, stronger profile influence | `ff228673` | ✅    |
| P39          | CognitiveStyleEngine, store v3, applyStyleBias                 | `9d976415` | ✅    |
| P39.5        | smoothStyle, style-aware adaptBlocks, telemetria               | `3cfdbb4a` | ✅    |
| P39.6        | mergeStrategy (gerarchia esplicita), lastPerceivedState        | `dfc8f705` | ✅    |

### Pipeline AI Core — COMPLETATA (Sprint 1–9)

| Sprint | Feature                                           | Stato |
| ------ | ------------------------------------------------- | ----- |
| 1–4    | Core UDA planner, classroom, evaluation           | ✅    |
| 5–6    | AI Decision Support (raccomandazioni, predizione) | ✅    |
| 7–8    | Copilot panel, spiegabilità, telemetria           | ✅    |
| 9      | Audit Level 6, fix deficit, R1–R6 risolti         | ✅    |

### Orbit Jarvis — IN CORSO (P2–P4)

| Phase | Feature                                                                | Stato |
| ----- | ---------------------------------------------------------------------- | ----- |
| P1    | Core ThumbMenu, Skills registry, OrchestrationContext                  | ✅    |
| P2    | Teacher skills, Landing overlays (schedule/class/lesson)               | 🔄    |
| P3    | Connectors (email, file, external sync), mock-first                    | 🔄    |
| P4    | userBehaviorStore → buildContext, automation levels, InlineActionStrip | 📋    |

### Metriche baseline

- **Test**: 1740 passed / 1752 total (12 intentional skip), 0 failing
- **Ultimo commit stabile**: `dfc8f705` — P39.6 merge engine
- **CI**: 4 GitHub Actions workflow attivi (lint, test, release-gate, e2e-smoke)

### Componenti Pilot (post-audit)

| File                                            | Scopo                                                 |
| ----------------------------------------------- | ----------------------------------------------------- |
| `src/components/copilot/AITabErrorBoundary.tsx` | Per-tab error boundary 12 sub-tab CopilotDocentePanel |
| `src/components/PrivacyConsentModal.tsx`        | Prima schermata GDPR art.13 (blocking dialog)         |
| `src/utils/dataRetention.ts`                    | GDPR B4: cleanup artefatti AI dopo 365 giorni         |

### Privacy / GDPR

- Consenso richiesto al primo avvio via `PrivacyConsentModal` (`privacy_consent_v1` in localStorage).
- `hasPrivacyConsent()` / `recordConsent()` esportate da `PrivacyConsentModal.tsx`.
- `runRetentionCheck()` chiamato a ogni avvio da `main.tsx` — rimuove dati AI scaduti.
- Dati **primari** (UDA, alunni, valutazioni) NON soggetti a auto-delete.
- `cognitiveStyle` e `emotionalProfile` **non vengono mai inviati a endpoint esterni**.

---

## Visione Ecosistema — Il Kernel Cognitivo Condiviso

```
┌─────────────────────────────────────────────────────────────────┐
│                     KERNEL COGNITIVO CONDIVISO                  │
│                                                                 │
│  EmotionalEngine  ←──────────────────────────────────────────┐ │
│  CognitiveStyleEngine                                         │ │
│  mergeStrategy (P1:safety > P2:style > P3:speed)             │ │
│  patternDetector · narrativeLayer · attentionRouter           │ │
│  userBehaviorModel · emergentSkillStore                       │ │
│  adaptive.ts · feedbackLoop · memoryConsolidation             │ │
└──────────────────────┬────────────────────────────────────────┘ │
                       │ ogni apprendimento si propaga            │
         ┌─────────────┼──────────────┬──────────────────┐       │
         ▼             ▼              ▼                   ▼       │
  DocenteDoc AI   Orbit Jarvis    Server API       Mobile RN/Expo │
  (teacher SPA)   (workplace AI)  (agent scoring)  (in piano)    │
         │             │              │                   │       │
         └─────────────┴──────────────┴───────────────────┘       │
                       │ feedback aggregato                        │
                       └──────────────────────────────────────────┘
```

**Legge del sistema:** una nuova regola emotiva, uno stile appreso, un pattern comportamentale — nascono in un prodotto e diventano patrimonio di tutti. Il sistema cresce come un unico organismo.

### Roadmap Prodotti

| Prodotto        | Prossimi passi                                                              | Documenti                                                                 |
| --------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| DocenteDoc AI   | UX adattiva avanzata, HITL corrections, explainability                      | [RELEASE_PLAN_V2_ADAPTIVE.md](docs/RELEASE_PLAN_V2_ADAPTIVE.md)           |
| Orbit Jarvis    | P2 teacher skills, P3 connectors, P4 automation                             | [ORBIT_PHASE24_PLAN.md](docs/ORBIT_PHASE24_PLAN.md)                       |
| Server Adattivo | embedding quality pipeline, cross-product agent scoring                     | [ARCHITECTURE_AUDIT_2026-03-16.md](docs/ARCHITECTURE_AUDIT_2026-03-16.md) |
| Mobile RN/Expo  | 12 moduli logica pura già portabili; AsyncStorage shim; JarvisNexus rewrite | [ORBIT_MOBILE_ROADMAP.md](docs/ORBIT_MOBILE_ROADMAP.md)                   |

### Principi di evoluzione

1. **Zero divergenza cognitiva** — se `mergeStrategy` aggiunge una regola, tutti i prodotti la ricevono.
2. **Mobile-first logic** — ogni nuovo modulo di logica pura deve restare zero-dep da DOM/browser API.
3. **Server feeds clients** — `memoryConsolidation` e `feedbackLoop` alimentano il profilo utente cross-sessione; i client leggono, non scrivono direttamente al DB.
4. **Un test per ogni regola cognitiva** — ogni comportamento del merge engine ha un test unitario corrispondente.
5. **Telemetria come linguaggio comune** — ogni prodotto emette gli stessi eventi OpenTelemetry; Grafana vede tutto.

### Prossimi obiettivi trasversali

- **Pilota DocenteDoc**: consenso + retention ✅ → deploy Vercel → feedback reale docenti
- **Orbit P2**: landing overlays + teacher skills → testing con docente pilota
- **Cross-product memory**: `memoryConsolidation.ts` → profilo utente che migra da DocenteDoc a Orbit
- **GDPR completo** (2–3 mesi): registro trattamenti, DPA, right-to-erasure UI
- **Certificazione PA** (9–12 mesi): SPID, dichiarazione accessibilità, pentest, AGID
- **Mobile alpha** (6–9 mesi): 12 moduli logica pura + AsyncStorage shim + JarvisNexus RN
