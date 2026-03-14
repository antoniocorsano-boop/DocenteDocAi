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

_Ultimo aggiornamento: v4.1 — 26/28 task completati (93%) — a cura di GitHub Copilot_
