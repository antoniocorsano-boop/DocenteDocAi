# 🗂️ BACKLOG OPERATIVO — DocenteDoc AI

_Ultimo aggiornamento: 2026-03-20_

## Status legenda

- ✅ Completato
- 🔄 In corso
- ⏳ Pending
- ❌ Bloccato

---

## Fase 0 — Sovranità Operativa (Layer Zero) ✅ COMPLETATA

| File                                                    | Stato |
| ------------------------------------------------------- | ----- |
| `src/types/sovereignty.types.ts`                        | ✅    |
| `src/stores/useSovereigntyStore.ts`                     | ✅    |
| `src/cognition/sovereigntyRouter.ts`                    | ✅    |
| `src/cognition/executeCopilotAction.ts` — Step 0.5 gate | ✅    |
| `src/cognition/copilotBrain.ts` — applySOVFilter        | ✅    |
| `src/components/onboarding/SovereigntyOnboarding.tsx`   | ✅    |
| `src/components/governance/GovernanceControlPanel.tsx`  | ✅    |
| `src/components/copilot/GovernancePanel.tsx` — wired    | ✅    |
| `src/main.tsx` — hasSov gate                            | ✅    |
| `src/types/index.ts` — barrel export                    | ✅    |

---

## Backlog sprint corrente (2026-03-19)

| ID  | Priorità | Fase / Epic                    | Task principale                       | Sub-task                                                                                    | Output verificabile                       | Stato |
| --- | -------- | ------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------- | ----- |
| C1  | 🔴 Alta  | Consistenza Engine (F1)        | Centralizzare RuntimeConsistencyState | Mappare stati residui, definire default, implementare singleton                             | Test e2e senza stati incoerenti           | ✅    |
| C2  | 🔴 Alta  | Consistenza Engine (F1)        | Sincronizzare moduli chiave           | adaptiveAssistant, useCaseTelemetry, complianceRuntime, auditSimulator                      | Report simulazione audit positivo         | ✅    |
| C3  | 🔴 Alta  | Consistenza Engine (F1)        | Blocchi hard                          | Disabilita use case se AI disattiva, blocca use case che richiedono AI senza autorizzazione | Test rollback controllato                 | ✅    |
| C4  | 🟡 Media | Consistenza Engine (F1)        | Reset intelligente                    | Reset non distruttivo, test rollback su 5 scenari                                           | Comportamento deterministico verificato   | ✅    |
| C5  | 🔴 Alta  | Assistente Docente (F2)        | UI Assistente docente                 | Layout principale, sidebar notifiche, modal azioni contestuali                              | Demo funzionante                          | ✅    |
| C6  | 🔴 Alta  | Assistente Docente (F2)        | Flussi guidati                        | Valutazione, Feedback, Report (PDF/CSV)                                                     | Log suggerimenti contestuali verificabili | ✅    |
| C7  | 🔴 Alta  | Assistente Docente (F2)        | Suggerimenti contestuali              | Avvisi GDPR, approvazione umana, alert dati sensibili                                       | Suggerimenti attivi in flusso reale       | ✅    |
| C8  | 🟡 Media | Assistente Docente (F2)        | Integrazione con Adaptive Control     | Leggere stato runtime, suggerire azioni corrette dinamicamente                              | Flusso completo testato                   | ✅    |
| C9  | 🔴 Alta  | Documentazione Automatica (F4) | Generatore DPIA                       | Lettura runtime, evidenzia rischi AI/dati sensibili                                         | PDF generati pronti per gara              | ✅    |
| C10 | 🔴 Alta  | Documentazione Automatica (F4) | Report Compliance                     | GDPR, AI Act, AgID                                                                          | Documenti automatizzati e verificabili    | ✅    |
| C11 | 🟡 Media | Documentazione Automatica (F4) | Verbale audit PDF                     | Modello PDF standard, firma digitale integrata                                              | PDF firmabile                             | ✅    |
| C12 | 🟡 Media | Documentazione Automatica (F4) | Documentazione tecnica                | Architettura generale, descrizione moduli, manuale rapido                                   | Documentazione completa                   | ✅    |
| C13 | 🔴 Alta  | Governance Panel (F3)          | Dashboard avanzata                    | Stato AI, stato compliance, drift                                                           | Dashboard operativa                       | ✅    |
| C14 | 🔴 Alta  | Governance Panel (F3)          | Gestione dati                         | Consensi utenti, export dati, cancellazioni GDPR                                            | Test gestione dati                        | ✅    |
| C15 | 🟡 Media | Governance Panel (F3)          | Audit trail navigabile                | Lista eventi cronologica, filtri per modulo/utente                                          | Audit trail navigabile                    | ✅    |
| C16 | 🟡 Media | Governance Panel (F3)          | Config escalation                     | Definizione livelli approvazione, notifiche anomalie                                        | Escalation funzionante                    | ✅    |
| C17 | 🔴 Alta  | Deploy + Hardening (F5)        | Persistenza                           | Audit trail, telemetry                                                                      | Persistenza verificata                    | ✅    |
| C18 | 🔴 Alta  | Deploy + Hardening (F5)        | Backup & Recovery                     | Procedure automatiche giornaliere, test recovery scenari                                    | Backup & recovery testati                 | ✅    |
| C19 | 🟡 Media | Deploy + Hardening (F5)        | Feature Flags                         | AI on/off per tenant, rollout graduale                                                      | Feature flags attivi                      | ✅    |
| C20 | 🔴 Alta  | Deploy + Hardening (F5)        | Logging strutturato                   | JSON logs centralizzati, alert errori critici                                               | Logging verificabile                      | ✅    |
| C21 | 🔴 Alta  | Deploy + Hardening (F5)        | Test completi                         | Unit test, integration test, compliance test GDPR/AI Act                                    | Deploy PA-ready testato                   | ✅    |

---

## Note operative

- Task **Alta** priorità → esecuzione immediata (C1–C3, C5–C7, C9–C10, C13–C14, C17–C18, C20–C21)
- Task **Media** priorità → parallelizzabili o verifiche secondarie
- Ogni task con sub-task ha una **checklist interna** di completamento
- Ogni task produce un **output verificabile** (test, PDF, dashboard, log)

---

## Tracciamento sessioni

### Sessione 2026-03-20 — COMPLETATA ✅

**TypeScript: 0 errori** — build pulita verificata con `npx tsc -b --noEmit`

**File creati:**

- ✅ C1–C4: `src/cognition/runtimeConsistency.ts`
- ✅ C5–C7: `src/components/assistant/TeacherAssistantPanel.tsx`
- ✅ C9: `src/components/certification/DPIAViewerPanel.tsx`
- ✅ C10: `src/services/complianceReportGenerator.ts`
- ✅ C13: `src/components/governance/GovernanceDashboard.tsx`
- ✅ C14: `src/hooks/useGdprDataManager.ts`
- ✅ C17: `src/utils/persistenceVerifier.ts`
- ✅ C18: `src/components/governance/BackupRecoveryPanel.tsx`
- ✅ C19: `src/services/featureFlags.ts`
- ✅ C20: `src/utils/structuredLogger.ts`
- ✅ C21: `__tests__/cognition/runtimeConsistency.test.ts`

**Fix TypeScript applicati:**

- `GovernanceDashboard.tsx`: `report.score` → `liveScore`, `v.description` → `v.message`, `v.suggestion` → `v.suggestedFix`
- `complianceReportGenerator.ts`: `runAuditScenario` → `runAuditSimulation(db, id)`, `.global` → (rimosso `*100`), `.suggestion/.description` → `.suggestedFix/.message`
- `TeacherAssistantPanel.tsx`, `BackupRecoveryPanel.tsx`, `persistenceVerifier.ts`: slog arg order (category first), `variant="filled"→"contained"`

✅ C8: Integrazione Adaptive Control in TeacherAssistantPanel
✅ C11: `src/services/auditVerbaleGenerator.ts` + `src/components/governance/AuditVerbalePanel.tsx`
✅ C12: `docs/ARCHITETTURA_TECNICA.md`
✅ C15: `src/components/governance/AuditTrailPanel.tsx`
✅ C16: `src/components/governance/EscalationConfigPanel.tsx`

### Sessione 2026-03-20 — Sales Pack Module — COMPLETATA ✅

**Nuovi file creati:**

- ✅ SP1: `src/modules/salesPack/types.ts` — SalesPack e SalesPackMeta types
- ✅ SP2: `src/modules/salesPack/salesPackGenerator.ts` — aggregazione moduli runtime
- ✅ SP3: `src/modules/salesPack/salesPackStore.ts` — Zustand persist + versioning per tenant
- ✅ SP4: `src/modules/salesPack/salesPackService.ts` — createSalesPack, getSalesPackById, deleteSalesPack
- ✅ SP5: `src/modules/salesPack/salesPackExporter.ts` — PDF export (iframe print), copyDocumentText
- ✅ SP6: `src/components/admin/SalesPackPanel.tsx` — UI admin (isAdmin gate, lista pack, export, preview)
- ✅ SP7: `__tests__/modules/salesPack.test.ts` — 22 test (22/22 passano)

**Fix TypeScript applicati:**

- `salesPackGenerator.ts`: DPIA type: `conductedAt→date`, `necessityAssessment→necessityTest`, `processor/dpoConsultation→dpo`, `approved→approvalStatus`, rimossi `technicalMeasures`/`organizationalMeasures` non esistenti
- `salesPackGenerator.ts`: SystemMode: `'manual'→'offline_only'` (campo non valido)

**Stato finale:** 0 errori TypeScript, 22/22 test passano.

### Sessione 2026-03-19 — COMPLETATA ✅

_Creazione file base, implementazione epics F1-F5, prime correzioni TypeScript._

## Status legenda

- ✅ Completato
- 🔄 In corso
- ⏳ Pending
- ❌ Bloccato

---

## Fase 0 — Sovranità Operativa (Layer Zero) ✅ COMPLETATA

| File                                                    | Stato |
| ------------------------------------------------------- | ----- |
| `src/types/sovereignty.types.ts`                        | ✅    |
| `src/stores/useSovereigntyStore.ts`                     | ✅    |
| `src/cognition/sovereigntyRouter.ts`                    | ✅    |
| `src/cognition/executeCopilotAction.ts` — Step 0.5 gate | ✅    |
| `src/cognition/copilotBrain.ts` — applySOVFilter        | ✅    |
| `src/components/onboarding/SovereigntyOnboarding.tsx`   | ✅    |
| `src/components/governance/GovernanceControlPanel.tsx`  | ✅    |
| `src/components/copilot/GovernancePanel.tsx` — wired    | ✅    |
| `src/main.tsx` — hasSov gate                            | ✅    |
| `src/types/index.ts` — barrel export                    | ✅    |

---

## Backlog sprint corrente (2026-03-19)

| ID  | Priorità | Fase / Epic                    | Task principale                       | Sub-task                                                                                    | Output verificabile                       | Stato |
| --- | -------- | ------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------- | ----- |
| C1  | 🔴 Alta  | Consistenza Engine (F1)        | Centralizzare RuntimeConsistencyState | Mappare stati residui, definire default, implementare singleton                             | Test e2e senza stati incoerenti           | ⏳    |
| C2  | 🔴 Alta  | Consistenza Engine (F1)        | Sincronizzare moduli chiave           | adaptiveAssistant, useCaseTelemetry, complianceRuntime, auditSimulator                      | Report simulazione audit positivo         | ⏳    |
| C3  | 🔴 Alta  | Consistenza Engine (F1)        | Blocchi hard                          | Disabilita use case se AI disattiva, blocca use case che richiedono AI senza autorizzazione | Test rollback controllato                 | ⏳    |
| C4  | 🟡 Media | Consistenza Engine (F1)        | Reset intelligente                    | Reset non distruttivo, test rollback su 5 scenari                                           | Comportamento deterministico verificato   | ⏳    |
| C5  | 🔴 Alta  | Assistente Docente (F2)        | UI Assistente docente                 | Layout principale, sidebar notifiche, modal azioni contestuali                              | Demo funzionante                          | ⏳    |
| C6  | 🔴 Alta  | Assistente Docente (F2)        | Flussi guidati                        | Valutazione, Feedback, Report (PDF/CSV)                                                     | Log suggerimenti contestuali verificabili | ⏳    |
| C7  | 🔴 Alta  | Assistente Docente (F2)        | Suggerimenti contestuali              | Avvisi GDPR, approvazione umana, alert dati sensibili                                       | Suggerimenti attivi in flusso reale       | ⏳    |
| C8  | 🟡 Media | Assistente Docente (F2)        | Integrazione con Adaptive Control     | Leggere stato runtime, suggerire azioni corrette dinamicamente                              | Flusso completo testato                   | ⏳    |
| C9  | 🔴 Alta  | Documentazione Automatica (F4) | Generatore DPIA                       | Lettura runtime, evidenzia rischi AI/dati sensibili                                         | PDF generati pronti per gara              | ⏳    |
| C10 | 🔴 Alta  | Documentazione Automatica (F4) | Report Compliance                     | GDPR, AI Act, AgID                                                                          | Documenti automatizzati e verificabili    | ⏳    |
| C11 | 🟡 Media | Documentazione Automatica (F4) | Verbale audit PDF                     | Modello PDF standard, firma digitale integrata                                              | PDF firmabile                             | ✅    |
| C12 | 🟡 Media | Documentazione Automatica (F4) | Documentazione tecnica                | Architettura generale, descrizione moduli, manuale rapido                                   | Documentazione completa                   | ✅    |
| C13 | 🔴 Alta  | Governance Panel (F3)          | Dashboard avanzata                    | Stato AI, stato compliance, drift                                                           | Dashboard operativa                       | ⏳    |
| C14 | 🔴 Alta  | Governance Panel (F3)          | Gestione dati                         | Consensi utenti, export dati, cancellazioni GDPR                                            | Test gestione dati                        | ⏳    |
| C15 | 🟡 Media | Governance Panel (F3)          | Audit trail navigabile                | Lista eventi cronologica, filtri per modulo/utente                                          | Audit trail navigabile                    | ⏳    |
| C16 | 🟡 Media | Governance Panel (F3)          | Config escalation                     | Definizione livelli approvazione, notifiche anomalie                                        | Escalation funzionante                    | ⏳    |
| C17 | 🔴 Alta  | Deploy + Hardening (F5)        | Persistenza                           | Audit trail, telemetry                                                                      | Persistenza verificata                    | ⏳    |
| C18 | 🔴 Alta  | Deploy + Hardening (F5)        | Backup & Recovery                     | Procedure automatiche giornaliere, test recovery scenari                                    | Backup & recovery testati                 | ⏳    |
| C19 | 🟡 Media | Deploy + Hardening (F5)        | Feature Flags                         | AI on/off per tenant, rollout graduale                                                      | Feature flags attivi                      | ⏳    |
| C20 | 🔴 Alta  | Deploy + Hardening (F5)        | Logging strutturato                   | JSON logs centralizzati, alert errori critici                                               | Logging verificabile                      | ⏳    |
| C21 | 🔴 Alta  | Deploy + Hardening (F5)        | Test completi                         | Unit test, integration test, compliance test GDPR/AI Act                                    | Deploy PA-ready testato                   | ⏳    |

---

## Note operative

- Task **Alta** priorità → esecuzione immediata (C1–C3, C5–C7, C9–C10, C13–C14, C17–C18, C20–C21)
- Task **Media** priorità → parallelizzabili o verifiche secondarie
- Ogni task con sub-task ha una **checklist interna** di completamento
- Ogni task produce un **output verificabile** (test, PDF, dashboard, log)

---

## Tracciamento sessioni

### Sessione 2026-03-19 — In corso

- [ ] C1: `src/cognition/runtimeConsistency.ts` — singleton store
- [ ] C2: Sync moduli (adaptiveAssistant, useCaseTelemetry, complianceRuntime, auditSimulator)
- [ ] C3: Hard block AI gate (use case → sovereigntyRouter)
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
