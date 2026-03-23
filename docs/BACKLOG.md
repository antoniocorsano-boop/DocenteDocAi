# ðŸ—‚ï¸ BACKLOG OPERATIVO â€” DocenteDoc AI

_Ultimo aggiornamento: 2026-03-23_

## Status legenda

- âœ… Completato
- ðŸ”„ In corso
- â³ Pending
- âŒ Bloccato

---

## Fase 0 â€” SovranitÃ  Operativa (Layer Zero) âœ… COMPLETATA

| File                                                      | Stato |
| --------------------------------------------------------- | ----- |
| `src/types/sovereignty.types.ts`                          | âœ…   |
| `src/stores/useSovereigntyStore.ts`                       | âœ…   |
| `src/cognition/sovereigntyRouter.ts`                      | âœ…   |
| `src/cognition/executeCopilotAction.ts` â€” Step 0.5 gate | âœ…   |
| `src/cognition/copilotBrain.ts` â€” applySOVFilter        | âœ…   |
| `src/components/onboarding/SovereigntyOnboarding.tsx`     | âœ…   |
| `src/components/governance/GovernanceControlPanel.tsx`    | âœ…   |
| `src/components/copilot/GovernancePanel.tsx` â€” wired    | âœ…   |
| `src/main.tsx` â€” hasSov gate                            | âœ…   |
| `src/types/index.ts` â€” barrel export                    | âœ…   |

---

## Backlog sprint corrente (2026-03-19)

| ID  | PrioritÃ   | Fase / Epic                    | Task principale                       | Sub-task                                                                                    | Output verificabile                       | Stato |
| --- | ---------- | ------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------- | ----- |
| C1  | ðŸ”´ Alta  | Consistenza Engine (F1)        | Centralizzare RuntimeConsistencyState | Mappare stati residui, definire default, implementare singleton                             | Test e2e senza stati incoerenti           | âœ…   |
| C2  | ðŸ”´ Alta  | Consistenza Engine (F1)        | Sincronizzare moduli chiave           | adaptiveAssistant, useCaseTelemetry, complianceRuntime, auditSimulator                      | Report simulazione audit positivo         | âœ…   |
| C3  | ðŸ”´ Alta  | Consistenza Engine (F1)        | Blocchi hard                          | Disabilita use case se AI disattiva, blocca use case che richiedono AI senza autorizzazione | Test rollback controllato                 | âœ…   |
| C4  | ðŸŸ¡ Media | Consistenza Engine (F1)        | Reset intelligente                    | Reset non distruttivo, test rollback su 5 scenari                                           | Comportamento deterministico verificato   | âœ…   |
| C5  | ðŸ”´ Alta  | Assistente Docente (F2)        | UI Assistente docente                 | Layout principale, sidebar notifiche, modal azioni contestuali                              | Demo funzionante                          | âœ…   |
| C6  | ðŸ”´ Alta  | Assistente Docente (F2)        | Flussi guidati                        | Valutazione, Feedback, Report (PDF/CSV)                                                     | Log suggerimenti contestuali verificabili | âœ…   |
| C7  | ðŸ”´ Alta  | Assistente Docente (F2)        | Suggerimenti contestuali              | Avvisi GDPR, approvazione umana, alert dati sensibili                                       | Suggerimenti attivi in flusso reale       | âœ…   |
| C8  | ðŸŸ¡ Media | Assistente Docente (F2)        | Integrazione con Adaptive Control     | Leggere stato runtime, suggerire azioni corrette dinamicamente                              | Flusso completo testato                   | âœ…   |
| C9  | ðŸ”´ Alta  | Documentazione Automatica (F4) | Generatore DPIA                       | Lettura runtime, evidenzia rischi AI/dati sensibili                                         | PDF generati pronti per gara              | âœ…   |
| C10 | ðŸ”´ Alta  | Documentazione Automatica (F4) | Report Compliance                     | GDPR, AI Act, AgID                                                                          | Documenti automatizzati e verificabili    | âœ…   |
| C11 | ðŸŸ¡ Media | Documentazione Automatica (F4) | Verbale audit PDF                     | Modello PDF standard, firma digitale integrata                                              | PDF firmabile                             | âœ…   |
| C12 | ðŸŸ¡ Media | Documentazione Automatica (F4) | Documentazione tecnica                | Architettura generale, descrizione moduli, manuale rapido                                   | Documentazione completa                   | âœ…   |
| C13 | ðŸ”´ Alta  | Governance Panel (F3)          | Dashboard avanzata                    | Stato AI, stato compliance, drift                                                           | Dashboard operativa                       | âœ…   |
| C14 | ðŸ”´ Alta  | Governance Panel (F3)          | Gestione dati                         | Consensi utenti, export dati, cancellazioni GDPR                                            | Test gestione dati                        | âœ…   |
| C15 | ðŸŸ¡ Media | Governance Panel (F3)          | Audit trail navigabile                | Lista eventi cronologica, filtri per modulo/utente                                          | Audit trail navigabile                    | âœ…   |
| C16 | ðŸŸ¡ Media | Governance Panel (F3)          | Config escalation                     | Definizione livelli approvazione, notifiche anomalie                                        | Escalation funzionante                    | âœ…   |
| C17 | ðŸ”´ Alta  | Deploy + Hardening (F5)        | Persistenza                           | Audit trail, telemetry                                                                      | Persistenza verificata                    | âœ…   |
| C18 | ðŸ”´ Alta  | Deploy + Hardening (F5)        | Backup & Recovery                     | Procedure automatiche giornaliere, test recovery scenari                                    | Backup & recovery testati                 | âœ…   |
| C19 | ðŸŸ¡ Media | Deploy + Hardening (F5)        | Feature Flags                         | AI on/off per tenant, rollout graduale                                                      | Feature flags attivi                      | âœ…   |
| C20 | ðŸ”´ Alta  | Deploy + Hardening (F5)        | Logging strutturato                   | JSON logs centralizzati, alert errori critici                                               | Logging verificabile                      | âœ…   |
| C21 | ðŸ”´ Alta  | Deploy + Hardening (F5)        | Test completi                         | Unit test, integration test, compliance test GDPR/AI Act                                    | Deploy PA-ready testato                   | âœ…   |

---

## Note operative

- Task **Alta** prioritÃ  â†’ esecuzione immediata (C1â€“C3, C5â€“C7, C9â€“C10, C13â€“C14, C17â€“C18, C20â€“C21)
- Task **Media** prioritÃ  â†’ parallelizzabili o verifiche secondarie
- Ogni task con sub-task ha una **checklist interna** di completamento
- Ogni task produce un **output verificabile** (test, PDF, dashboard, log)

---

## Tracciamento sessioni

### Sessione 2026-03-20 â€” COMPLETATA âœ…

**TypeScript: 0 errori** â€” build pulita verificata con `npx tsc -b --noEmit`

**File creati:**

- âœ… C1â€“C4: `src/cognition/runtimeConsistency.ts`
- âœ… C5â€“C7: `src/components/assistant/TeacherAssistantPanel.tsx`
- âœ… C9: `src/components/certification/DPIAViewerPanel.tsx`
- âœ… C10: `src/services/complianceReportGenerator.ts`
- âœ… C13: `src/components/governance/GovernanceDashboard.tsx`
- âœ… C14: `src/hooks/useGdprDataManager.ts`
- âœ… C17: `src/utils/persistenceVerifier.ts`
- âœ… C18: `src/components/governance/BackupRecoveryPanel.tsx`
- âœ… C19: `src/services/featureFlags.ts`
- âœ… C20: `src/utils/structuredLogger.ts`
- âœ… C21: `__tests__/cognition/runtimeConsistency.test.ts`

**Fix TypeScript applicati:**

- `GovernanceDashboard.tsx`: `report.score` â†’ `liveScore`, `v.description` â†’ `v.message`, `v.suggestion` â†’ `v.suggestedFix`
- `complianceReportGenerator.ts`: `runAuditScenario` â†’ `runAuditSimulation(db, id)`, `.global` â†’ (rimosso `*100`), `.suggestion/.description` â†’ `.suggestedFix/.message`
- `TeacherAssistantPanel.tsx`, `BackupRecoveryPanel.tsx`, `persistenceVerifier.ts`: slog arg order (category first), `variant="filled"â†’"contained"`

âœ… C8: Integrazione Adaptive Control in TeacherAssistantPanel
âœ… C11: `src/services/auditVerbaleGenerator.ts` + `src/components/governance/AuditVerbalePanel.tsx`
âœ… C12: `docs/ARCHITETTURA_TECNICA.md`
âœ… C15: `src/components/governance/AuditTrailPanel.tsx`
âœ… C16: `src/components/governance/EscalationConfigPanel.tsx`

### Sessione 2026-03-20 â€” Sales Pack Module â€” COMPLETATA âœ…

**Nuovi file creati:**

- âœ… SP1: `src/modules/salesPack/types.ts` â€” SalesPack e SalesPackMeta types
- âœ… SP2: `src/modules/salesPack/salesPackGenerator.ts` â€” aggregazione moduli runtime
- âœ… SP3: `src/modules/salesPack/salesPackStore.ts` â€” Zustand persist + versioning per tenant
- âœ… SP4: `src/modules/salesPack/salesPackService.ts` â€” createSalesPack, getSalesPackById, deleteSalesPack
- âœ… SP5: `src/modules/salesPack/salesPackExporter.ts` â€” PDF export (iframe print), copyDocumentText
- âœ… SP6: `src/components/admin/SalesPackPanel.tsx` â€” UI admin (isAdmin gate, lista pack, export, preview)
- âœ… SP7: `__tests__/modules/salesPack.test.ts` â€” 22 test (22/22 passano)

**Fix TypeScript applicati:**

- `salesPackGenerator.ts`: DPIA type: `conductedAtâ†’date`, `necessityAssessmentâ†’necessityTest`, `processor/dpoConsultationâ†’dpo`, `approvedâ†’approvalStatus`, rimossi `technicalMeasures`/`organizationalMeasures` non esistenti
- `salesPackGenerator.ts`: SystemMode: `'manual'â†’'offline_only'` (campo non valido)

**Stato finale:** 0 errori TypeScript, 22/22 test passano.

### Sessione 2026-03-19 â€” COMPLETATA âœ…

_Creazione file base, implementazione epics F1-F5, prime correzioni TypeScript._

## Status legenda

- âœ… Completato
- ðŸ”„ In corso
- â³ Pending
- âŒ Bloccato

---

## Fase 0 â€” SovranitÃ  Operativa (Layer Zero) âœ… COMPLETATA

| File                                                      | Stato |
| --------------------------------------------------------- | ----- |
| `src/types/sovereignty.types.ts`                          | âœ…   |
| `src/stores/useSovereigntyStore.ts`                       | âœ…   |
| `src/cognition/sovereigntyRouter.ts`                      | âœ…   |
| `src/cognition/executeCopilotAction.ts` â€” Step 0.5 gate | âœ…   |
| `src/cognition/copilotBrain.ts` â€” applySOVFilter        | âœ…   |
| `src/components/onboarding/SovereigntyOnboarding.tsx`     | âœ…   |
| `src/components/governance/GovernanceControlPanel.tsx`    | âœ…   |
| `src/components/copilot/GovernancePanel.tsx` â€” wired    | âœ…   |
| `src/main.tsx` â€” hasSov gate                            | âœ…   |
| `src/types/index.ts` â€” barrel export                    | âœ…   |

---

## Backlog sprint corrente (2026-03-19)

| ID  | PrioritÃ   | Fase / Epic                    | Task principale                       | Sub-task                                                                                    | Output verificabile                       | Stato |
| --- | ---------- | ------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------- | ----- |
| C1  | ðŸ”´ Alta  | Consistenza Engine (F1)        | Centralizzare RuntimeConsistencyState | Mappare stati residui, definire default, implementare singleton                             | Test e2e senza stati incoerenti           | â³    |
| C2  | ðŸ”´ Alta  | Consistenza Engine (F1)        | Sincronizzare moduli chiave           | adaptiveAssistant, useCaseTelemetry, complianceRuntime, auditSimulator                      | Report simulazione audit positivo         | â³    |
| C3  | ðŸ”´ Alta  | Consistenza Engine (F1)        | Blocchi hard                          | Disabilita use case se AI disattiva, blocca use case che richiedono AI senza autorizzazione | Test rollback controllato                 | â³    |
| C4  | ðŸŸ¡ Media | Consistenza Engine (F1)        | Reset intelligente                    | Reset non distruttivo, test rollback su 5 scenari                                           | Comportamento deterministico verificato   | â³    |
| C5  | ðŸ”´ Alta  | Assistente Docente (F2)        | UI Assistente docente                 | Layout principale, sidebar notifiche, modal azioni contestuali                              | Demo funzionante                          | â³    |
| C6  | ðŸ”´ Alta  | Assistente Docente (F2)        | Flussi guidati                        | Valutazione, Feedback, Report (PDF/CSV)                                                     | Log suggerimenti contestuali verificabili | â³    |
| C7  | ðŸ”´ Alta  | Assistente Docente (F2)        | Suggerimenti contestuali              | Avvisi GDPR, approvazione umana, alert dati sensibili                                       | Suggerimenti attivi in flusso reale       | â³    |
| C8  | ðŸŸ¡ Media | Assistente Docente (F2)        | Integrazione con Adaptive Control     | Leggere stato runtime, suggerire azioni corrette dinamicamente                              | Flusso completo testato                   | â³    |
| C9  | ðŸ”´ Alta  | Documentazione Automatica (F4) | Generatore DPIA                       | Lettura runtime, evidenzia rischi AI/dati sensibili                                         | PDF generati pronti per gara              | â³    |
| C10 | ðŸ”´ Alta  | Documentazione Automatica (F4) | Report Compliance                     | GDPR, AI Act, AgID                                                                          | Documenti automatizzati e verificabili    | â³    |
| C11 | ðŸŸ¡ Media | Documentazione Automatica (F4) | Verbale audit PDF                     | Modello PDF standard, firma digitale integrata                                              | PDF firmabile                             | âœ…   |
| C12 | ðŸŸ¡ Media | Documentazione Automatica (F4) | Documentazione tecnica                | Architettura generale, descrizione moduli, manuale rapido                                   | Documentazione completa                   | âœ…   |
| C13 | ðŸ”´ Alta  | Governance Panel (F3)          | Dashboard avanzata                    | Stato AI, stato compliance, drift                                                           | Dashboard operativa                       | â³    |
| C14 | ðŸ”´ Alta  | Governance Panel (F3)          | Gestione dati                         | Consensi utenti, export dati, cancellazioni GDPR                                            | Test gestione dati                        | â³    |
| C15 | ðŸŸ¡ Media | Governance Panel (F3)          | Audit trail navigabile                | Lista eventi cronologica, filtri per modulo/utente                                          | Audit trail navigabile                    | â³    |
| C16 | ðŸŸ¡ Media | Governance Panel (F3)          | Config escalation                     | Definizione livelli approvazione, notifiche anomalie                                        | Escalation funzionante                    | â³    |
| C17 | ðŸ”´ Alta  | Deploy + Hardening (F5)        | Persistenza                           | Audit trail, telemetry                                                                      | Persistenza verificata                    | â³    |
| C18 | ðŸ”´ Alta  | Deploy + Hardening (F5)        | Backup & Recovery                     | Procedure automatiche giornaliere, test recovery scenari                                    | Backup & recovery testati                 | â³    |
| C19 | ðŸŸ¡ Media | Deploy + Hardening (F5)        | Feature Flags                         | AI on/off per tenant, rollout graduale                                                      | Feature flags attivi                      | â³    |
| C20 | ðŸ”´ Alta  | Deploy + Hardening (F5)        | Logging strutturato                   | JSON logs centralizzati, alert errori critici                                               | Logging verificabile                      | â³    |
| C21 | ðŸ”´ Alta  | Deploy + Hardening (F5)        | Test completi                         | Unit test, integration test, compliance test GDPR/AI Act                                    | Deploy PA-ready testato                   | â³    |

---

## Note operative

- Task **Alta** prioritÃ  â†’ esecuzione immediata (C1â€“C3, C5â€“C7, C9â€“C10, C13â€“C14, C17â€“C18, C20â€“C21)
- Task **Media** prioritÃ  â†’ parallelizzabili o verifiche secondarie
- Ogni task con sub-task ha una **checklist interna** di completamento
- Ogni task produce un **output verificabile** (test, PDF, dashboard, log)

---

## Sicurezza — Issue aperte (2026-03-23)

| Severità   | Pacchetto                 | Advisory                                  | Azione                                               | Sprint              |
| ---------- | ------------------------- | ----------------------------------------- | ---------------------------------------------------- | ------------------- |
| ✅ RISOLTO | `xlsx` (SheetJS)          | GHSA-4r6h-8v6p-xvw6 + GHSA-5pgg-2g8v-p4x9 | Migrato a `exceljs@^4.x` — `xlsx` rimosso 2026-03-23 | ✅                  |
| 🔴 HIGH    | `undici` / `@vercel/node` | 7× CVE (DoS, CRLF, WS)                    | Aggiornare `@vercel/node@5.6.18` (breaking)          | Sprint post-release |

**Note:**

- `jspdf@4.2.1` ✅ aggiornato 2026-03-23 — CRITICO risolto
- `xlsx` ✅ rimosso 2026-03-23 — migrazione a `exceljs`: `importService.ts` usa exceljs, test aggiornati, vite chunk rinominato `excel-vendor`.
- `undici/@vercel/node`: lato server/deploy, non impatta il client React in produzione.

---

## Tracciamento sessioni

### Sessione 2026-03-19 â€” In corso

- [ ] C1: `src/cognition/runtimeConsistency.ts` â€” singleton store
- [ ] C2: Sync moduli (adaptiveAssistant, useCaseTelemetry, complianceRuntime, auditSimulator)
- [ ] C3: Hard block AI gate (use case â†’ sovereigntyRouter)
- [ ] C5: `src/components/assistant/TeacherAssistantPanel.tsx`
- [ ] C6: Flussi guidati (Valutazione / Feedback / Report)
- [ ] C7: Suggerimenti contestuali GDPR/approval
- [ ] C9: `src/services/dpiaGenerator.ts` + UI
- [ ] C10: `src/services/complianceReportGenerator.ts`
- [ ] C13: `src/components/governance/GovernanceDashboard.tsx`
- [ ] C14: GDPR data management hooks + UI
- [ ] C17: Audit trail + telemetry persist verification
- [ ] C18: Backup & recovery service
- [ ] C20: Structured logging (JSON centralizzato)
- [ ] C21: Test suite compliance
