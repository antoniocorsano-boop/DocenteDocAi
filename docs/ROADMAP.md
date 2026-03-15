# Roadmap di Sviluppo

Stato di avanzamento delle funzionalità di OrarioDoc AI.

---

## 🔴 Fase 7: Miglioramento Usabilità, Accessibilità e Audit (IN CORSO)

**Obiettivo:** Allineamento a standard Material Design 3, WCAG 2.1 AA, privacy-first e audit processi.

### Milestone principali

- **UX Modale e Gantt:** Refactoring modali (full-screen mobile, focus, chiusura chiara), drag&drop e feedback visivo Gantt, stepper/breadcrumb wizard.
- **Accessibilità Rubriche:** Navigazione tastiera, aria-label, colori a contrasto, tooltip e aiuti contestuali, test axe-core.
- **Feedback Visivo Centro Operativo:** Snackbar/toast persistenti con undo, indicatori di stato, stato UI centralizzato.
- **Microcopy e Help:** Uniformare testi, tooltip/help inline, centralizzazione per localizzazione.
- **Export e Collegamento UDA/Lezioni:** Flusso drag&drop, selezione rapida, validazione export PDF/DOCX.
- **Backup & Privacy:** Stato backup/restore visibile, gestione quota, notifiche errori/limiti.
- **Testing & Coverage:** Estensione test unit/E2E su wizard, export, AI/KB, backup/restore, coverage >95%.

### Collegamento con Audit

Le milestone e le scadenze sono allineate alla tabella di sintesi azioni in `docs/AUDIT_PROCESSI_FUNZIONALITA.md`.

---

### 🟢 Fase 1: Core & UI (COMPLETATA)

- **[FATTO] Design System M3 Expressive:** Refactoring completo CSS in architettura modulare (5 livelli).
- **[FATTO] Identità Visiva:** Nuovo logo interattivo e supporto Dark Mode.
- **[FATTO] Ottimizzazione Mobile:** Layout responsivi e matrici adattive.

### 🟢 Fase 2: Potenziamento AI (COMPLETATA)

- **[FATTO] Hybrid Knowledge Base:** Supporto file illimitati via IndexedDB + RAG.
- **[FATTO] Live Assistant 2.0:** Assistente vocale con capacità di lettura/scrittura dati e ricerca documenti.
- **[FATTO] Studio AI:** Generatore Verifiche, Immagini e Analisi Circolari.

### 🟢 Fase 3: Integrazione & Export (COMPLETATA)

- **[FATTO] Modulo "Registro Bridge":** Payload per estensioni browser.
- **[FATTO] Dati Demo:** Caricamento robusto di dati di prova.
- **[FATTO] Reportistica:** Export PDF/DOCX per tutti i moduli.

### 🟢 Fase 4: Personalizzazione & Cloud (COMPLETATA)

- **[FATTO] Theme Studio AI:** Generatore temi personalizzati da prompt.
- **[FATTO] Google Drive Sync:** Backup automatico e sicuro su cloud personale.
- **[FATTO] Analytics Hub:** Dashboard con grafici (Trend, Radar) e insight AI.
- **[FATTO] Timeline Gantt:** Nuova visualizzazione per la progettazione annuale.

### 🟢 Fase 5: Student Portal & Interazione (COMPLETATA)

- **[FATTO] Autenticazione Semplificata:** Login studente tramite anagrafica (Zero-Password).
- **[FATTO] Dashboard Studente:** Vista dedicata "Diario di Classe" con filtro compiti intelligenti.
- **[FATTO] Upload Compiti:** Consegna elaborati digitali direttamente nel fascicolo.
- **[FATTO] Teacher Inbox:** Flusso di correzione rapida per il docente.

### � Fase 6: Release Candidate & Hardening (COMPLETATA)

- **[FATTO] Fix Critici:** Risolti Race Condition su Backup, Audio Context su Safari/iOS, Tipi TypeScript e FOUC del Tema.
- **[FATTO] Sicurezza Kiosk:** Implementazione Web Lock API per la modalità studente.
- **[FATTO] Resilienza AI:** Retry logic automatica per le chiamate Gemini API.
- **[FATTO] Testing E2E:** Suite completa con Playwright per i flussi critici.
- **[FATTO] Refactoring Stato:** Migrazione da "God Object" a Context/Zustand per performance estreme.
- **[FATTO] Audit Finale:** Verifica accessibilità, micro-interazioni (Tooltip, Snackbar, Loader, Badge), validazione Problems panel e performance.
- **[FATTO] Documentazione finale:** CHANGELOG, JSDOC, guide migrazione.
- **[DA FARE] Release:** Deploy versione stabile (Vercel).

### 🔵 Fase 8: Quality of Life & Intelligenza Adattiva (IN CORSO — 26/28 completati, 93%)

_Obiettivo: completare le feature Medium/Low priorità rimaste dalla Fase 7._

#### ✅ Completati (tutti i 🔴 High + tutti i 🟡 Medium)

- **[FATTO] #15 AI plugin — sintesi testi:** "Riepilogo AI Classe" in ReportisticaHub; auto-fill valutazioni già in CompetencyEvaluationModal.
- **[FATTO] #16 Suggerimenti contestuali AI:** `SuggestionBanner` MD3 visibile in App.tsx, wired su `activeSuggestion` da store.
- **[FATTO] #18 Sintesi dati:** `handleGenerateAiClassSummary` in ReportisticaHub, salvataggio Report + toast.
- **[FATTO] #21 Pre-fetch bundle:** `usePrefetch` hook + `PREFETCH_MAP` in viewRegistry.ts; warm-load chunk adiacenti al cambio view.
- **[FATTO] #27 Telemetria:** `useTelemetry` hook con helpers tipizzati (`trackFeatureUsage`, `trackNavigation`, `trackAiInteraction`, `trackDocumentGenerated`).
- **[FATTO] #28 JSDoc:** Module-level doc in `useAppEngine.ts`; JSDoc su 4 funzioni chiave di `aiService.ts`.

#### 🟢 Da completare (🟢 Low)

- **[DA FARE] #17 Smart Navigation:** Anticipa la prossima pagina basandosi sui pattern d'uso (ML client-side o euristica).
- **[DA FARE] #19 Plugin-ready architecture:** Architettura widget Trello-style per estensioni future.

---

## 🤖 AI Pipeline Intelligente — Livelli 1–6 (COMPLETATO — tag: `level-6-ready`)

_Commit finale: `419da3b7` — 1733 test passati, 123 file, 12 skip intenzionali_

Serie di Sprint per costruire un motore di raccomandazione pedagogica end-to-end:  
ognuno si integra sui dati del precedente, formando una pipeline a strati.

| Sprint       | Livello                 | Modulo principale                                                                                                   | Dipendenze      |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------- |
| Sprint 1     | Dati                    | `classroomSimulator` + `scenarioGenerator`                                                                          | —               |
| Sprint 2     | Predizione rischio      | `predictStudentRisk`                                                                                                | Sprint 1        |
| Sprint 3     | Benchmark simulazione   | `benchmarkMetrics` + `simulationStore`                                                                              | Sprints 1–2     |
| Sprint 4     | Spiegabilità AI         | `decisionExplainer` + `AIAuditViewer`                                                                               | Sprints 1–2     |
| Sprint 5     | Fairness & bias         | `biasReport` + `BiasAuditPanel`                                                                                     | Sprints 1–4     |
| Sprint 6     | Allineamento pedagogico | `bloomsClassifier` + `alignmentScorer` + `pedagogyReport`                                                           | Sprints 1–5     |
| Sprint 7     | Trust Score             | `trustScoreEngine` + `trustReport` + `TrustScorePanel`                                                              | Sprints 1–6     |
| **Sprint 8** | **Decision Support**    | **`lessonRecommender` · `activityGenerator` · `curriculumAdvisor` · `recommendationStore` · `RecommendationPanel`** | **Sprints 1–7** |

### Sprint 8 — AI Decision Support (Level 6)

**Nuovi file** (`src/ai/recommendation/`):

- `lessonRecommender.ts` — engine core: combina `PedagogyReport` + `TrustReport` + `BenchmarkMetrics` → `Recommendation[]` ordinati per `impactScore`
  - 4 `RecommendationAction`: `adjustContent` · `addExercise` · `reschedule` · `highlightRisk`
  - 3 `source`: `pedagogy` · `trust` · `simulation`
  - Soglie: `PEDAGOGY_TARGET=0.65`, `TRUST_TARGET=0.60`, `F1_TARGET=0.70`
  - Deduplicazione per `source::action::title`, sort decrescente per `impactScore [0–1]`

- `activityGenerator.ts` — converte una `Recommendation` in 1–3 `Activity` mirate per livello Bloom:
  - Activity 1: quiz Bloom sempre incluso
  - Activity 2: esercizio di ordine superiore se `addExercise | reschedule`
  - Activity 3: scenario what-if se `impactScore ≥ 0.50`
  - `targetBloomFromAction()`: `addExercise→apply`, `adjustContent→understand`, `reschedule→analyze`, `highlightRisk→evaluate`

- `curriculumAdvisor.ts` — analisi curriculum su `Lezione[]`:
  - Densità tematica (troppi argomenti per lezione)
  - Diversità metodologica (< 4 tipi distinti)
  - HOTS ratio (< 30% Laboratorio/Test/Verifica)
  - Gap di verifica (> 6 lezioni senza valutazione)
  - Copertura obiettivi (< 50% lezioni con `obiettivi` dichiarati)

- `recommendationStore.ts` — Zustand store efimero (pattern `trustStore`):
  - State: `recommendations[]`, `computing`, `error`, `lastComputedAt`
  - Actions: `compute(pedagogyReports, trustReports, benchmarks)` · `clear()`
  - Errore esplicito se tutti e tre gli array sono vuoti

**DevTools** (`src/ai/devtools/`):

- `RecommendationPanel.tsx` — Row 8 in `AIInspectorPanel`:
  - Header: chip urgenza (critical/high/medium/low) + contatore + pulsante "Ricalcola"
  - Card per raccomandazione: titolo, descrizione, `LinearProgress` impactScore, chip azione, chip sorgente
  - Pulsante "Simula effetto" → `useSimulationStore().actions.runBatch(5)`
  - Pulsante "Applica" → stub (funzionalità futura)
  - `<PluginSlot slot="studio-tools" context={{ recommendations }} />` in fondo

**Test** (`src/ai/recommendation/__tests__/recommendation.test.ts`): **42 test**, 0 falliti:

- `generateRecommendations`: 13 test (empty, soglie, dedup, sort, bounds)
- `generateActivity`: 11 test (cardinalità, Bloom mapping, what-if, exercise)
- `targetBloomFromAction`: 4 test
- `generateCurriculumRecommendations`: 7 test (empty, tipo unico, svolta, sort, bounds)
- `useRecommendationStore`: 6 test (init, compute, error, clear)

---

## [2026-03-14] CopilotDocentePanel Fase 1 — COMPLETATO

- Implementati: CopilotPerformancePanel (studenti a rischio/eccellenza), CopilotHealthOverviewPanel (overview salute classe)
- Modularizzazione: tabs, props tipizzati, wiring filtri/AI, integrazione in AnalyticsHub
- Compliance: MD3 (MUI v7, InfoCard, SectionHeader, badge, trend), spacing e tipografia secondo audit
- Lint/TS: 0 errori, 0 warning
- Commit: "feat(copilot): fase 1 mvp — modular panels, md3/ts clean"
- Pronto per QA e validazione docente

---

## [2026-03-14] CopilotDocentePanel Fase 2 — COMPLETATO

- Aggiunti tab Andamento (trend AI, AITrendPanel) ed Esportazione (ExportModal) nel CopilotDocentePanel
- Wiring props, mock settings, MD3/TS clean
- Commit: "feat(copilot): trend+export tab"
- Pronto per QA e validazione docente

---

---

## [2026-03-15] Sprint 8 — AI Decision Support — COMPLETATO

- Engine raccomandazioni (`lessonRecommender.ts`): combina Pedagogia + Trust + Simulazione → `Recommendation[]` ordinati per urgenza
- Activity generator (`activityGenerator.ts`): 1–3 attività Bloom-mirate per raccomandazione
- Curriculum advisor (`curriculumAdvisor.ts`): 5 analisi macro (densità, HOTS, gap verifica, obiettivi, metodi)
- Zustand store (`recommendationStore.ts`): state machine con compute/clear e gestione errori
- DevTools Panel (`RecommendationPanel.tsx`): Row 8 in AIInspectorPanel con chip urgenza, SimulationLab e PluginSlot
- 42 test, 1733 totali (123 file, 12 skip), `tsc --noEmit` pulito
- Commit: `419da3b7` — tag Git: `level-6-ready`

_Ultimo aggiornamento: v4.2 — Sprint 8 (Livello 6) completato — a cura di GitHub Copilot_
