# DocenteDoc AI — Analisi del Codebase

**Generato:** 12 Marzo 2026  
**Aggiornato:** 12 Marzo 2026 (Sprint A–E completi — types split, Settings split, ClassroomView split, proxy, OTel)  
**Analizzato da:** Repository Analyzer  
**Versione progetto:** 1.0.0

---

## Panoramica

| Attributo                 | Valore                                       |
| ------------------------- | -------------------------------------------- |
| **Linguaggio primario**   | TypeScript                                   |
| **Framework UI**          | React 18 + MUI v7                            |
| **Design System**         | Material Design 3 (MD3)                      |
| **Build tool**            | Vite 6                                       |
| **Test runner**           | Vitest 4 + Playwright                        |
| **Totale file sorgente**  | 340 (243 TSX + 97 TS)                        |
| **Linee di codice (src)** | ~59.909 (TSX + TS, no test/stories)          |
| **File di test**          | 98 (Vitest) + 13 (Playwright E2E)            |
| **Totale commit**         | 493                                          |
| **Commit più recente**    | `a4201f4b` refactor(classroom) – 12 Mar 2026 |

---

## Stack Tecnologico

### Runtime

| Categoria         | Tecnologia                 | Versione |
| ----------------- | -------------------------- | -------- |
| UI Library        | React                      | ^18.2.0  |
| Component library | MUI Material               | ^7.3.9   |
| Styling engine    | Emotion                    | ^11.14.0 |
| State management  | Zustand                    | ^4.4.0   |
| Charts            | Recharts                   | ^3.7.0   |
| Drag & Drop       | @dnd-kit/core              | ^6.3.1   |
| Document export   | docx, jsPDF, pdf-lib       | varie    |
| Document import   | mammoth (DOCX), pdfjs-dist | varie    |
| Spreadsheet       | papaparse, xlsx            | varie    |
| AI – Anthropic    | @anthropic-ai/sdk          | ^0.78.0  |
| AI – Google       | @google/genai              | ^1.34.0  |
| Observability     | OpenTelemetry (web)        | ^0.208.0 |

### Sviluppo

| Categoria        | Tecnologia                     | Versione |
| ---------------- | ------------------------------ | -------- |
| Build            | Vite                           | ^6.0.0   |
| Type checking    | TypeScript                     | ^5.9.3   |
| Linting          | ESLint 9 + typescript-eslint   | ^9.39.2  |
| CSS Linting      | Stylelint                      | ^17.4.0  |
| Unit test        | Vitest                         | ^4.0.16  |
| E2E              | Playwright                     | ^1.57.0  |
| Visual test      | Storybook 8                    | ^8.6.15  |
| Commit guard     | commitlint + husky             | ^20.3.0  |
| Bundle analysis  | rollup-plugin-visualizer       | ^7.0.1   |
| PWA              | vite-plugin-pwa                | ^1.2.0   |
| Compression      | vite-plugin-compression2       | ^2.5.0   |
| Accessibility    | axe-core, @axe-core/playwright | ^4.11.0  |
| Serverless proxy | @vercel/node                   | ^5.6.15  |

---

## Architettura del Progetto

### Struttura Directory (`src/`)

```
src/
├── components/           (161 file) — Componenti principali dell'app
│   ├── ui/              (52 file)  — Componenti MD3 atomici (M3Button, M3Card…)
│   ├── views/           (6 file)   — Layout di pagina di alto livello
│   ├── charts/          (5 file)   — Grafici (Recharts wrappati)
│   ├── settings/        (13 file)  — Sezioni Impostazioni (7 pannelli estratti + stubs)
│   ├── classroom/       (3 file)   — Tab estratti da ClassroomView (Register, Notes, Resources)
│   ├── dashboard/       (4 file)   — Widget dashboard
│   └── help/            (3 file)   — Componenti modale aiuto
├── nka/                 (20 file)  — NKA Design System (Neurospicy-Kind Approach)
├── utils/               (18 file)  — Utilities: export, storage, AI, date…
├── services/            (13 file)  — AI services, Google Drive, backup
│   └── prompts/         (6 file)   — Prompt template AI
├── hooks/               (8 file)   — Custom React hooks
├── stores/              (7 file)   — Zustand stores
├── design-system/       (5 file)   — Token e primitivi MD3
├── theme/               (4 file)   — MUI theme, CSS tokens, ThemeProvider
├── constants/           (4 file)   — Costanti app (systemManual…)
├── types/               (9 file)   — Tipi per dominio (uda, student, ai, template, analytics, calendar…)
├── contexts/            (3 file)   — React Context providers
├── stories/             (3 file)   — Storybook stories design system
├── main.tsx                        — Entry point app
├── types.ts                        — Tipi globali (incl. DocumentTemplate, ToDoItem…)
└── theme.css / global.css          — Token MD3 CSS custom properties
```

### Pattern Architetturale

Il progetto segue un'architettura **Feature-Component** con separazione orizzontale:

```
┌─────────────────────────────────────────────────┐
│                    UI Layer                      │
│  components/ui (M3* atoms) + nka (NKA DS)       │
├─────────────────────────────────────────────────┤
│               Feature Components                 │
│  components/* — Settings, Calendar, Dashboard… │
├─────────────────────────────────────────────────┤
│              State Management                    │
│  stores/ (Zustand) + contexts/                  │
├─────────────────────────────────────────────────┤
│               Service Layer                      │
│  services/ — AI, Google Drive, Backup           │
├─────────────────────────────────────────────────┤
│            Utilities & Infrastructure            │
│  utils/, hooks/, constants/                     │
└─────────────────────────────────────────────────┘
```

**Persistenza:** `localStorage` + `IndexedDB` (backup) — nessun backend proprio  
**AI Runtime:** dual-provider (Anthropic Claude + Google Gemini) via API key in-browser  
**Export:** DOCX (docx), PDF (jsPDF + pdf-lib), CSV (papaparse), XLSX (xlsx)  
**Cloud:** Google Drive API opzionale (oauth2 PKCE in-browser)

---

## Metriche del Codebase

### File per tipo

| Tipo                            | Numero |
| ------------------------------- | ------ |
| Componenti React (TSX) sorgente | 247    |
| Moduli TypeScript (TS) sorgente | 96     |
| File di test (`.test.tsx`)      | 28     |
| Fogli di stile (CSS)            | 17     |
| Storybook stories               | ~20    |
| Configurazioni (json/yaml)      | 10+    |

### Linee di codice

| Categoria              | LOC         |
| ---------------------- | ----------- |
| TSX sorgente (no test) | 54.616      |
| TS sorgente (no test)  | 13.192      |
| CSS                    | 10.976      |
| **Totale stimato**     | **~78.784** |

### File più grandi (complessità)

| File                       | Linee | Rischio                                                |
| -------------------------- | ----- | ------------------------------------------------------ |
| `types.ts`                 | 874   | 🟡 Barrel re-export — split dominio in `src/types/` ✅ |
| `useAppEngine.ts`          | 963   | 🟠 Medio-Alto                                          |
| `ClassroomView.tsx`        | 548   | 🟡 Medio — 3 tab estratti ✅                           |
| `Calendar.tsx`             | 801   | 🟠 Medio                                               |
| `documentUtils.ts`         | 727   | 🟡 Medio                                               |
| `AnalyticsDashboard.tsx`   | 684   | 🟡 Medio                                               |
| `LessonsPage.tsx`          | 655   | 🟡 Medio                                               |
| `ClassPlanningWizard.tsx`  | 625   | 🟡 Medio                                               |
| `AnnualPlanningWizard.tsx` | 597   | 🟡 Medio                                               |
| `Settings.tsx`             | 137   | ✅ Risolto — 7 sezioni estratte in `settings/`         |

---

## Git Hotspot — File più modificati

I file con il maggior numero di commit sono i candidati principali a refactoring e/o regressioni.

| File                   | Commit tocchi | Note                                       |
| ---------------------- | ------------- | ------------------------------------------ |
| `Settings.tsx`         | 58            | File più churnato — logica molto mista     |
| `Home.tsx`             | 55            | Hub navigazione, modificato frequentemente |
| `App.tsx`              | 48            | Root app — routing e providers             |
| `ProgettazioneHub.tsx` | 43            |                                            |
| `HelpModal.tsx`        | 41            | Contenuto documentazione vivo              |
| `ClassroomView.tsx`    | 41            | Gestione classe — feature ricca            |
| `AssistantFab.tsx`     | 40            | AI chat floating button                    |
| `Calendar.tsx`         | 40            | Calendario lezioni                         |
| `Header.tsx`           | 39            | Navigazione globale                        |
| `main.tsx`             | 39            | Bootstrap — indicativo di cambi infra      |

---

## Design System: MD3

### Principi

Il progetto adotta **Material Design 3** come unico sistema normativo visivo:

- **Token CSS:** variabili `--md-sys-*` definite in `src/theme.css` e `src/global.css`
- **Tipografia:** `'Roboto Flex'` variable font, allineato in `src/theme/muiTheme.ts`
- **Icone:** `material-symbols-outlined` su `<Box component="span" className="material-symbols-outlined">` — nessun uso di MUI Icons Material per icone semantiche
- **Elevation:** token `--md-sys-elevation-*` — nessun box-shadow manuale
- **Spacing:** esclusivamente via token MD3

### NKA (Neurospiky-Kind Approach) Design System

Directory `src/nka/` — sotto-sistema di design dedicato all'accessibilità cognitiva:

- `NKAProvider.tsx` — Global context
- `NKAHeaderAuraButton.tsx` — Pulsante aura header
- `NKANodeCard.tsx` — Knowledge node card
- `NKABottomSheet.tsx` — Bottom sheet per mobile

### Stato Compliance MD3 (12 Mar 2026)

| Check                 | Stato                                             |
| --------------------- | ------------------------------------------------- |
| ESLint                | ✅ 0 errori                                       |
| TypeScript            | ✅ 0 errori                                       |
| Stylelint             | ✅ 0 errori                                       |
| Icon span violations  | ✅ 0 violazioni                                   |
| Font family allineato | ✅ muiTheme = `'Roboto Flex', Roboto, sans-serif` |

---

## Stores Zustand

| Store                               | Responsabilità              |
| ----------------------------------- | --------------------------- |
| `useSettingsStore`                  | Tema, lingua, preferenze UI |
| `useStudentStore` / `useClassStore` | Dati studenti e classi      |
| `useAnalyticsStore`                 | Metriche utilizzo           |
| Altri store                         | Vedi `src/stores/`          |

---

## Servizi AI

Il progetto integra **due provider AI** in modalità client-side:

### Anthropic (Claude)

- SDK: `@anthropic-ai/sdk ^0.78.0`
- Uso: generazione documenti didattici, analisi, chat assistente
- Key: configurata via `.env` locale (mai committata)

### Google Generative AI (Gemini)

- SDK: `@google/genai ^1.34.0`
- Uso: alternativa/fallback ad Anthropic

### Prompt Template

- `src/services/prompts/` — 6 file di prompt strutturati
- Pattern: prompt-as-code, con placeholder per contesto

---

## Sistema di Test

### Vitest (Unit + Integration)

| Metrica       | Valore                               |
| ------------- | ------------------------------------ |
| File di test  | 98 (in `src/__tests__/` e co-locati) |
| Test totali   | ~1.216 (ultimo run)                  |
| Test passanti | 1.216 / 1.216                        |
| Test saltati  | 10                                   |
| Coverage tool | @vitest/coverage-v8                  |

**Struttura test in `__tests__/`:**

```
__tests__/
├── accessibility/
├── components/
├── context/
├── hooks/
├── services/
├── stores/
├── utils/
├── views/
└── visual-regression/
```

### Playwright (E2E)

13 spec file in `e2e/`:

- `smoke.spec.ts` — happy path base
- `annual-planning.spec.ts` — pianificazione annuale
- `assistant-modal.spec.ts` — modale AI
- `cloud-backup.spec.ts` — Google Drive
- `gantt-drag.spec.ts` — drag & drop Gantt
- `gsi.spec.ts` — GSI (Griglia Struttura Intervento)
- `template-flow.spec.ts` — template documenti
- `uda-creation.spec.ts` — creazione UDA

### Storybook

- Storybook 8.6 con addon-a11y, addon-interactions
- Componenti documentati in `src/stories/` e file `*.stories.tsx`
- Visual regression tests in `playwright.visual.config.ts`

---

## Debito Tecnico

### Priorità Alta

| Problema                     | File                       | Dettaglio                                                                                                           |
| ---------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Storage cleanup disabilitato | `main.tsx` L54-57          | `localStorage.clear()` e `indexedDB.deleteDatabase` commentati come TEMPORARILY DISABLED — rimuovere o ripristinare |
| Temp ID pattern              | `AnnualPlanningWizard.tsx` | ID generati con `temp-${Date.now()}` — rischio di collisione                                                        |

### Priorità Media

| Problema                      | File                                                 | Dettaglio                                         |
| ----------------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| `<div>` come container visivo | `ClassAnalytics.tsx`, `ClassCompetencyDashboard.tsx` | Violazione MD3 — da migrare a `Box` / `M3Surface` |
| Commento TODO aperto          | `AuraView.tsx` L30                                   | Layout dipendente da container padre non risolto  |

### Priorità Bassa

| Problema    | Dettaglio                                             |
| ----------- | ----------------------------------------------------- |
| `temp-` IDs | Pattern ricorrente in wizard — non critico ma fragile |

---

## Qualità del Codice

### Punti di Forza

- ✅ **Zero violazioni** ESLint, TypeScript, Stylelint nel run attuale
- ✅ **Test coverage alta**: 1.216 test unitari (98 file Vitest), 13 spec E2E Playwright
- ✅ **Commit convention**: commitlint con Conventional Commits (`feat/fix/refactor/test/chore`)
- ✅ **Accessibilità**: axe-core integrato in Playwright, attributi aria sistematici
- ✅ **PWA**: manifest, service worker, compressione brotli
- ✅ **Observability**: OpenTelemetry configurato (SDK pronto, exporter OTLP)
- ✅ **Security**: nessuna API key nel bundle browser (proxy Vercel), PKCE per OAuth2, sanitizzazione input
- ✅ **Performance**: critical CSS inline, lazy loading, bundle compression
- ✅ **Logger centralizzato**: 0 `console.*` in produzione — tutto via `logger.debug/info/warn/error`
- ✅ **AI proxy sicuro**: `api/ai.ts` Vercel serverless — `GEMINI_API_KEY` mai nel bundle

### Punti di Debolezza

- � **No backend proprio**: tutta la logica risiede nel browser — scalabilità limitata per funzionalità collaborative
- 🟡 **`useAppEngine.ts` (963 righe)**: orchestratore app ancora monolitico — candidato futuro a suddivisione per dominio
- 🟡 **`Calendar.tsx` (801 righe)**: componente con logica view + drag mista — prossimo candidato a refactoring
- 🟡 **ClassSelection.tsx breakpoint**: unico `1fr` residuo non tokenizzato (sintassi MUI sx responsiva — intenzionale)

---

## Build & Deploy

### Scripts principali

```json
"dev"           → vite                    (dev server HMR)
"build"         → tsc -b && vite build    (produzione)
"preview"       → vite preview            (preview locale build)
"test"          → vitest run              (unit test CI)
"test:watch"    → vitest                  (watch mode)
"test:e2e"      → playwright test         (E2E)
"test:coverage" → vitest run --coverage   (coverage report)
"lint"          → eslint src              (linting)
"stylelint"     → stylelint "src/**/*.css"
"storybook"     → storybook dev -p 6006
```

### Pipeline Vite

- Plugin: `@vitejs/plugin-react`, `vite-plugin-pwa`, `vite-plugin-html`, `vite-plugin-compression2`, `rollup-plugin-visualizer`
- Output: `dist/` — ottimizzato per Vercel
- Config deploy: `vercel.json` presente

### Vercel

Progetto configurato per deploy su Vercel (vedi `docs/DEPLOY_VERCEL.md` e `docs/DEPLOYMENT.md`).

---

## Raccomandazioni Prioritarie

### ✅ Completate (sprint A–E)

| #   | Raccomandazione                                                                                    | Sprint        | Commit     |
| --- | -------------------------------------------------------------------------------------------------- | ------------- | ---------- |
| 1   | Rimuovere `console.*` dai file produzione — logger centralizzato                                   | Sprint logger | `dde3519b` |
| 2   | Risolvere `TEMPORARILY DISABLED` in `main.tsx`                                                     | Sprint 3      | —          |
| 3   | Spezzare `Settings.tsx` in sotto-componenti (hook + SettingsGroup)                                 | Sprint 3      | —          |
| 4   | Spezzare `HelpModal.tsx` in 8 sub-panel                                                            | Sprint 3      | —          |
| 5   | Implementare `handleApplyTemplate` in `BatchExportWizard`                                          | Sprint 3      | —          |
| 6   | Logger centralizzato con livelli configurabili                                                     | Sprint logger | `dde3519b` |
| 7   | Tokenizzare `gridTemplateColumns` ricorrenti                                                       | Sprint grid   | `f11a88b4` |
| 8   | Proxy backend per API key AI (Vercel Edge Function)                                                | Sprint proxy  | `f11a88b4` |
| 14  | Tokenizzare `html-template-colors.ts` — già migrato a variabili MD3 ✅                             | pre-esistente | —          |
| A1  | Fix duplicato `KnowledgeBaseEntry` in `types.ts`                                                   | Sprint A      | `—`        |
| A2  | Attivare OpenTelemetry — `import './tracing'` attivo in `main.tsx`                                 | Sprint A      | `—`        |
| B   | Split `types.ts` in 6 moduli dominio (`uda`, `student`, `ai`, `template`, `analytics`, `calendar`) | Sprint B      | `—`        |
| C   | Split `Settings.tsx` (1.285 → 137 righe) — 7 sezioni in `src/components/settings/`                 | Sprint C      | `016eeb93` |
| D   | Rimuovere `VITE_GEMINI_API_KEY` da `VideoAnalysisModal.tsx` — `window.aistudio` unico fast-path    | Sprint D      | `—`        |
| E   | Estrarre 3 tab da `ClassroomView.tsx` (907 → 548 righe) in `src/components/classroom/`             | Sprint E      | `a4201f4b` |

### Piano Sprint — Raccomandazioni Aperte

> **Legenda:** 🔴 bloccante · 🟠 urgente · 🟡 pianificato · ⬜ in attesa

---

#### Sprint A — Quick Wins ✅ Completato

| #   | Priorità | Task                                                                               | File coinvolti                   | Stato |
| --- | -------- | ---------------------------------------------------------------------------------- | -------------------------------- | ----- |
| A1  | 🟡       | Fix duplicato `KnowledgeBaseEntry` in `types.ts`                                   | `src/types.ts`                   | ✅    |
| A2  | 🟡       | Attivare OpenTelemetry: `import './tracing'` attivo, exporter OTLP production-safe | `src/main.tsx`, `src/tracing.ts` | ✅    |

---

#### Sprint B — Split `types.ts` ✅ Completato

| #   | Priorità | Task                                        | File creato                                         | Stato |
| --- | -------- | ------------------------------------------- | --------------------------------------------------- | ----- |
| B1  | 🟠       | Tipi dominio UDA e lezione                  | `src/types/uda.types.ts` (179 righe)                | ✅    |
| B2  | 🟠       | Tipi studente e classe                      | `src/types/student.types.ts` (154 righe)            | ✅    |
| B3  | 🟠       | Tipi template e documenti                   | `src/types/template.types.ts` (72 righe)            | ✅    |
| B4  | 🟠       | Tipi AI / GenAI                             | `src/types/ai.types.ts` (142 righe)                 | ✅    |
| B5  | 🟠       | Tipi analytics e calendario                 | `src/types/analytics.types.ts`, `calendar.types.ts` | ✅    |
| B6  | 🟠       | Barrel re-export                            | `src/types/index.ts`                                | ✅    |
| B7  | 🟠       | `src/types.ts` ridotto a barrel + re-export | `src/types.ts` (874 righe, ancora con tipi Props)   | ✅    |

---

#### Sprint C — Split `Settings.tsx` ✅ Completato (`016eeb93`)

`Settings.tsx` ridotto da 1.285 → **137 righe**. 7 sezioni estratte in `src/components/settings/`.

| #   | Sezione estratta                 | File creato                 | Righe |
| --- | -------------------------------- | --------------------------- | ----- |
| C1  | Interfaccia/Aspetto/Tipografia   | `SettingsInterface.tsx`     | ~280  |
| C2  | Profilo docente                  | `SettingsProfile.tsx`       | ~70   |
| C3  | AI Didattica                     | `SettingsAI.tsx`            | ~340  |
| C4  | Suggerimenti AI dismissati       | `SettingsAISuggestions.tsx` | ~80   |
| C5  | Cloud / Google Drive             | `SettingsCloud.tsx`         | ~120  |
| C6  | Debug / Logging                  | `SettingsDebug.tsx`         | ~100  |
| C7  | Avanzato (API keys, danger zone) | `SettingsAdvanced.tsx`      | ~90   |

---

#### Sprint D — Migrazione `VideoAnalysisModal.tsx` al proxy ✅ Completato

| #   | Task                                                                      | Stato |
| --- | ------------------------------------------------------------------------- | ----- |
| D1  | Rimuovere `VITE_GEMINI_API_KEY` da `VideoAnalysisModal.tsx`               | ✅    |
| D2  | Generazione video ristretta a `window.aistudio` (AI Studio host env only) | ✅    |

---

#### Sprint E — Refactoring `ClassroomView.tsx` ✅ Completato (`a4201f4b`)

`ClassroomView.tsx` ridotto da 907 → **548 righe**. 3 tab estratti in `src/components/classroom/`.

| #   | Task                                           | File creato                 | Righe |
| --- | ---------------------------------------------- | --------------------------- | ----- |
| E1  | Tab Registro presenze (focus grid, attendance) | `ClassroomRegisterTab.tsx`  | 266   |
| E2  | Tab Diario/Note (textarea, voice recorder)     | `ClassroomNotesTab.tsx`     | 77    |
| E3  | Tab Risorse materiali + adattamenti            | `ClassroomResourcesTab.tsx` | 70    |

---

### Sequenza sprint — tutti completati ✅

```
Sprint A ✅ → Sprint B ✅ → Sprint D ✅ → Sprint C ✅ → Sprint E ✅
```

### Prossimi candidati (backlog)

| #   | File               | Righe | Azione suggerita                                        |
| --- | ------------------ | ----- | ------------------------------------------------------- |
| F   | `useAppEngine.ts`  | 963   | Split per dominio (classroom, planning, AI, drive)      |
| G   | `Calendar.tsx`     | 801   | Estrarre logica drag-and-drop e view-switch in sub-hook |
| H   | `documentUtils.ts` | 727   | Split per tipo documento (PDF, DOCX, CSV)               |

---

## Riferimenti Documentazione Esistente

| File                                                                        | Contenuto                 |
| --------------------------------------------------------------------------- | ------------------------- |
| [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)                             | Architettura generale     |
| [docs/DESIGN_SYSTEM_HANDOFF.md](../docs/DESIGN_SYSTEM_HANDOFF.md)           | Handoff design system     |
| [docs/REFACTORING_MUI_V7_ROADMAP.md](../docs/REFACTORING_MUI_V7_ROADMAP.md) | Roadmap migrazione MUI v7 |
| [docs/TESTING.md](../docs/TESTING.md)                                       | Strategy di test          |
| [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md)                               | Guida sviluppo            |
| [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)                                 | Deployment                |
| [docs/ROADMAP.md](../docs/ROADMAP.md)                                       | Roadmap prodotto          |
| [docs/ERROR_LOGGING_SYSTEM.md](../docs/ERROR_LOGGING_SYSTEM.md)             | Sistema di logging errori |

---

_Analisi generata automaticamente il 12 Marzo 2026 — aggiornare dopo ogni milestone significativa._
