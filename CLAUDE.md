# DocenteDoc AI — CLAUDE.md

App web per docenti italiani: pianificazione UDA, annotazioni, analisi AI, backup Google Drive.  
Stack: **React 18 + TypeScript + Vite + MUI v7 + Zustand** — SPA full-client, nessun backend proprio.

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
│   ├── classroom/       # Tab estratti da ClassroomView (Register, Notes, Resources)
│   ├── settings/        # 7 pannelli Settings (SettingsXxx.tsx) + stubs
│   └── ...
├── design-system/       # Layer DS (M3Surface, M3Typography, AppLayout…)
├── hooks/               # Custom hooks
├── services/            # AI proxy, Google Drive, backup, storage
├── stores/              # Zustand stores per dominio
├── theme/               # muiTheme.ts + M3ThemeProvider + token MD3
├── types/               # Tipi TypeScript per dominio (9 moduli)
│   ├── index.ts         # barrel re-export
│   ├── uda.types.ts
│   ├── student.types.ts
│   ├── ai.types.ts
│   ├── template.types.ts
│   └── ...
├── utils/               # Utility pure
├── main.tsx             # Entry point
├── tracing.ts           # OpenTelemetry (attivo in prod)
└── sw.ts                # Service Worker (PWA)

api/
└── ai.ts                # Vercel Edge Function — proxy Gemini/Anthropic

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

---

## Stato Progetto — Marzo 2026

### Pipeline AI — COMPLETATA (Sprint 1–9)

| Sprint | Feature                                           | Stato |
| ------ | ------------------------------------------------- | ----- |
| 1–4    | Core UDA planner, classroom, evaluation           | ✅    |
| 5–6    | AI Decision Support (raccomandazioni, predizione) | ✅    |
| 7–8    | Copilot panel, spiegabilità, telemetria           | ✅    |
| 9      | Audit Level 6, fix deficit, R1–R6 risolti         | ✅    |

- **Test baseline**: 1740 passed / 1752 total (12 intentional skip), 0 failing
- **Ultimo commit stabile**: `10a48791` — fix(audit): risoluzione completa deficit Livello 6
- **CI**: 4 GitHub Actions workflow attivi (lint, test, release-gate, e2e-smoke)

### Componenti Pilot (aggiunti post-audit)

| File                                            | Scopo                                                                            |
| ----------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/components/copilot/AITabErrorBoundary.tsx` | Per-tab error boundary per i 12 sub-tab del CopilotDocentePanel (no page reload) |
| `src/components/PrivacyConsentModal.tsx`        | Prima schermata GDPR art.13 (blocking dialog, localStorage persistence)          |
| `src/utils/dataRetention.ts`                    | GDPR B4: cleanup automatico artefatti AI dopo 365 giorni                         |

### Privacy / GDPR

- Consenso utente richiesto al primo avvio via `PrivacyConsentModal` (`privacy_consent_v1` in localStorage).
- `hasPrivacyConsent()` / `recordConsent()` esportate da `PrivacyConsentModal.tsx`.
- Data retention: `runRetentionCheck()` chiamato a ogni avvio da `main.tsx` — rimuove dati AI scaduti.
- Dati **primari** del docente (UDA, alunni, valutazioni) NON soggetti a auto-delete.

### Prossimi obiettivi

- **Pilota**: consenso + retention wired ✅ — pronto per deploy pilota
- **GDPR completo** (2–3 mesi): registro trattamenti, DPA, right-to-erasure UI
- **Certificazione PA** (9–12 mesi): SPID, dichiarazione accessibilità, pentest, AGID
