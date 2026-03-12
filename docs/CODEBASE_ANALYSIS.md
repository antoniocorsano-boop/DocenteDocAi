# DocenteDoc AI — Analisi del Codebase

**Generato:** 12 Marzo 2026  
**Analizzato da:** Repository Analyzer  
**Versione progetto:** 1.0.0

---

## Panoramica

| Attributo                 | Valore                                           |
| ------------------------- | ------------------------------------------------ |
| **Linguaggio primario**   | TypeScript                                       |
| **Framework UI**          | React 18 + MUI v7                                |
| **Design System**         | Material Design 3 (MD3)                          |
| **Build tool**            | Vite 6                                           |
| **Test runner**           | Vitest 4 + Playwright                            |
| **Totale file sorgente**  | 377 (275 TSX + 102 TS)                           |
| **Linee di codice (src)** | ~78.784 (TSX: 54.616 + TS: 13.192 + CSS: 10.976) |
| **File di test**          | 28 (Vitest) + 13 (Playwright E2E)                |
| **Totale commit**         | 488                                              |
| **Commit più recente**    | `da8f6783` fix(typography) – 12 Mar 2026         |

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

| Categoria       | Tecnologia                     | Versione |
| --------------- | ------------------------------ | -------- |
| Build           | Vite                           | ^6.0.0   |
| Type checking   | TypeScript                     | ^5.9.3   |
| Linting         | ESLint 9 + typescript-eslint   | ^9.39.2  |
| CSS Linting     | Stylelint                      | ^17.4.0  |
| Unit test       | Vitest                         | ^4.0.16  |
| E2E             | Playwright                     | ^1.57.0  |
| Visual test     | Storybook 8                    | ^8.6.15  |
| Commit guard    | commitlint + husky             | ^20.3.0  |
| Bundle analysis | rollup-plugin-visualizer       | ^7.0.1   |
| PWA             | vite-plugin-pwa                | ^1.2.0   |
| Compression     | vite-plugin-compression2       | ^2.5.0   |
| Accessibility   | axe-core, @axe-core/playwright | ^4.11.0  |

---

## Architettura del Progetto

### Struttura Directory (`src/`)

```
src/
├── components/           (161 file) — Componenti principali dell'app
│   ├── ui/              (52 file)  — Componenti MD3 atomici (M3Button, M3Card…)
│   ├── views/           (6 file)   — Layout di pagina di alto livello
│   ├── charts/          (5 file)   — Grafici (Recharts wrappati)
│   ├── settings/        (5 file)   — Sezioni della schermata Impostazioni
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
├── types/               (3 file)   — Tipi TypeScript condivisi
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

| File                       | Linee | Rischio                     |
| -------------------------- | ----- | --------------------------- |
| `Settings.tsx`             | 1.378 | 🔴 Alto — candidato a split |
| `HelpModal.tsx`            | 1.123 | 🔴 Alto — candidato a split |
| `ClassroomView.tsx`        | 907   | 🟠 Medio-Alto               |
| `Dashboard.tsx`            | 884   | 🟠 Medio-Alto               |
| `Calendar.tsx`             | 841   | 🟠 Medio-Alto               |
| `AnalyticsDashboard.tsx`   | 715   | 🟠 Medio                    |
| `LessonsPage.tsx`          | 685   | 🟡 Medio                    |
| `ClassPlanningWizard.tsx`  | 672   | 🟡 Medio                    |
| `ReportisticaHub.tsx`      | 670   | 🟡 Medio                    |
| `AnnualPlanningWizard.tsx` | 644   | 🟡 Medio                    |

---

## Git Hotspot — File più modificati

I file con il maggior numero di commit sono i candidati principali a refactoring e/o regressioni.

| File                   | Commit tocchi | Note                                       |
| ---------------------- | ------------- | ------------------------------------------ |
| `Settings.tsx`         | 54            | File più churnato — logica molto mista     |
| `Home.tsx`             | 53            | Hub navigazione, modificato frequentemente |
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
| File di test  | 28 (in `src/__tests__/` e co-locati) |
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

| Problema                     | File                                                   | Dettaglio                                                                                                           |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| God component                | `Settings.tsx` (1.378 righe)                           | Dovrebbe essere suddiviso in sotto-sezioni indipendenti                                                             |
| God component                | `HelpModal.tsx` (1.123 righe)                          | Contenuto documentazione hardcoded in JSX                                                                           |
| Console.log in produzione    | `UdaPlanner.tsx`, `ProgettazioneHub.tsx` (12 ciascuno) | Debug statements attivi non rimossi                                                                                 |
| Storage cleanup disabilitato | `main.tsx` L54-57                                      | `localStorage.clear()` e `indexedDB.deleteDatabase` commentati come TEMPORARILY DISABLED — rimuovere o ripristinare |
| Temp ID pattern              | `AnnualPlanningWizard.tsx`                             | ID generati con `temp-${Date.now()}` — rischio di collisione                                                        |

### Priorità Media

| Problema                       | File                                                                              | Dettaglio                                                           |
| ------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Console.log                    | `BatchExportWizard.tsx` (7), `ReportisticaHub.tsx` (4), `ConsiglioClasse.tsx` (4) | Debug statements da rimuovere prima di prod                         |
| `<div>` come container visivo  | `ClassAnalytics.tsx`, `ClassCompetencyDashboard.tsx`, `BatchExportWizard.tsx`     | Violazione MD3 — da migrare a `Box` / `M3Surface`                   |
| Template mock non implementato | `BatchExportWizard.tsx` L148                                                      | `handleApplyTemplate` mostra solo un toast, non applica il template |
| Commento TODO aperto           | `AuraView.tsx` L30                                                                | Layout dipendente da container padre non risolto                    |

### Priorità Bassa

| Problema             | Dettaglio                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Tracing disabilitato | `import './tracing'` commentato in main.tsx — OpenTelemetry configurato ma non attivo         |
| HTML template colors | `src/utils/html-template-colors.ts` — colori hardcoded HEX documentati ma non tokenizzati MD3 |
| `temp-` IDs          | Pattern ricorrente in wizard — non critico ma fragile                                         |

---

## Qualità del Codice

### Punti di Forza

- ✅ **Zero violazioni** ESLint, TypeScript, Stylelint nel run attuale
- ✅ **Test coverage alta**: 1.216 test unitari, 13 spec E2E
- ✅ **Commit convention**: commitlint con Conventional Commits (`feat/fix/refactor/test/chore`)
- ✅ **Accessibilità**: axe-core integrato in Playwright, attributi aria sistematici
- ✅ **PWA**: manifest, service worker, compressione brotli
- ✅ **Observability**: OpenTelemetry configurato (SDK pronto, exporter OTLP)
- ✅ **Security**: nessuna API key nel codice, PKCE per OAuth2, sanitizzazione input
- ✅ **Performance**: critical CSS inline, lazy loading, bundle compression

### Punti di Debolezza

- 🔴 **Componenti "god"**: `Settings.tsx` e `HelpModal.tsx` superano 1.000 righe
- 🟠 **Console.log in produzione**: ~60+ chiamate attive (escluse stories), nessun logger centralizzato
- 🟠 **AI key client-side**: le API key Anthropic/Google sono gestite in-browser — rischio esposizione se l'app è pubblica
- 🟡 **No backend proprio**: tutta la logica risiede nel browser — scalabilità limitata per funzionalità collaborative
- 🟡 **Duplicate `gridTemplateColumns`**: pattern CSS inline ripetuto in molti componenti — candidato a token/utility

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

### Immediato

1. **Rimuovere console.log** dai file di produzione (`UdaPlanner.tsx`, `ProgettazioneHub.tsx`, `BatchExportWizard.tsx` etc.) — usare un logger centralizzato con livelli configurabili
2. **Risolvere TEMPORARILY DISABLED** in `main.tsx` — decidere se il cleanup storage deve tornare attivo o essere rimosso definitivamente

### Breve termine

3. **Spezzare `Settings.tsx`** in sotto-componenti (`GeneralSettings`, `AISettings`, `InterfaceSettings` ecc.) — già presenti parzialmente in `src/components/settings/`
4. **Spezzare `HelpModal.tsx`** — estrarre il contenuto documentazione in file MDX o JSON separati
5. **Implementare `handleApplyTemplate`** in `BatchExportWizard.tsx` — attualmente è uno stub

### Medio termine

6. **Logger centralizzato**: sostituire `console.*` con un modulo logger che rispette `NODE_ENV` / feature flag
7. **Tokenizzare `gridTemplateColumns`** ricorrenti — creare utility token MD3 o styled components
8. **Revisione gestione API key**: valutare un proxy backend (Vercel Edge Function) per non esporre le chiavi AI nel bundle browser

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
