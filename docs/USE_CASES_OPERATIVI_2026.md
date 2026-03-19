# Casi d'Uso Operativi Reali — DocenteDoc AI

**Data analisi**: 2026-03-18  
**Metodo**: ricostruzione diretta da codice sorgente, moduli AI, layer compliance e flussi UI  
**Baseline tecnica**: commit `14aeb093` + Sprint 10–15 (presenti nel codebase)  
**Autore analisi**: Senior Product Analyst + AI Compliance Expert (PA italiana)

---

## Avvertenza metodologica

Ogni caso è stato derivato **esclusivamente da moduli esistenti e codice attivo**. Dove il sistema non offre copertura reale, il gap è segnalato esplicitamente. Nessuna funzionalità è stata dedotta da naming o marketing.

---

## A — PROGETTAZIONE

---

### UC-P1 — Pianificazione annuale assistita da AI

**Contesto reale**: docente a casa, settembre, deve redigere il piano di lavoro annuale per la propria materia.

**Azione docente**: apre `AnnualPlanningWizard` (6 step: _context → situation → methodology → sequence → milestones → document_), seleziona classe e materia, carica eventualmente file dalla Knowledge Base.

**Supporto del sistema** (moduli reali):

- Step 2: `generateSituazionePartenza()` in `aiService.ts` — genera la _Situazione di Partenza_ della classe sulla base dei tag inseriti + file KB selezionati
- Step 4: `suggestAnnualPlan()` — propone una sequenza di UDA con ore, titoli, argomenti
- Step 6: esporta documento DOCX via `generateHtmlDocxBlob()` + `saveAs()`
- Stato persiste nelle store (UDA → `useAcademicStore`, eventi → store calendario)

**AI coinvolta**: generazione (Gemini 3 Pro Preview, via Edge Function `api/ai.ts`). Nessuna elaborazione AI lato client.

**Compliance attivata**:

- **GDPR Art. 5(1)(c)**: i dati classe inviati al modello devono essere minimizzati — l'app passa solo tag e numero studenti, non anagrafiche
- **MIUR**: struttura UDA allineata a framework DigCompEdu, EU 2018, DM 742/2017

**Insight mostrato**: conferma step-by-step con stato generazione ("Generazione situazione…" / "Piano generato"). Nessun alert compliance in questa fase.

**Azioni possibili**: modifica titoli/ore UDA proposte, aggiunge fasi manualmente, esporta il documento in DOCX.

**Evidenze generate**: UDA salvate in store con `id: uda-${Date.now()}`, log `logger.audit()` per ogni salvataggio.

**Impatto su audit**: `usageProfile.udaCreated` incrementato → sblocca la regola `L2-1` di `getNextAction` (promuove il docente a tier successivo nel decision engine).

---

### UC-P2 — Creazione UDA con mapping competenze europee

**Contesto reale**: preparazione di un'Unità di Apprendimento, singola materia, fase di progettazione curricolare.

**Azione docente**: apre `UdaPlanner` → `UdaEditor`, compila titolo, classe, materia, fasi, prodotto finale; seleziona competenze da un picker con filtro per framework.

**Supporto del sistema**:

- `UdaEditor` contiene un `CompetencyPicker` con tutti i framework supportati: `DigCompEdu 3.0 (AI)`, `Competenze Chiave Europee (2018)`, `Primo Ciclo — DM 742/2017`, `Educazione Civica — L. 92/2019`, `DigComp 2.2`, `Orientamento — DM 328/2022`, `Assi Culturali — DM 139/2007`
- Il campo `competencyIds[]` associa la UDA alle competenze selezionate
- `Guidance` component mostra suggerimenti contestuali

**AI coinvolta**: nessuna in questa azione specifica (l'AI entra nel UC-P1 per la proposta della sequenza; qui il docente progetta manualmente).

**Compliance attivata**: nessuna attivazione automatica. Il sistema non valida la correttezza didattica della UDA rispetto a una norma.

> ⚠️ **Gap rilevato**: non esiste un controllo automatico che verifichi che la UDA soddisfi i requisiti minimi normativi (es. ore minime per materia da POF/PTOF). Questa validazione è assente.

**Insight mostrato**: toast "UDA salvata" via `useUIStore.showToast()`.

**Evidenze generate**: `Uda` con `competencyIds[]`, `phases[]`, `id`, timestamp. Log audit via `logger.audit()`.

**Impatto su audit**: `udaCreated` ora > 0 → copilotBrain non mostrerà più `L2-1` come azione primaria; analytics disponibili.

---

## B — EROGAZIONE

---

### UC-E1 — Registro presenze e annotazioni giornaliere

**Contesto reale**: in classe, a inizio lezione o subito dopo.

**Azione docente**: apre `RegisterView` o il tab registro in `ClassroomView`, marca presenze/assenze/ritardi, aggiunge eventuale annotazione.

**Supporto del sistema**:

- `registerService.ts` gestisce la persistenza del registro
- `ClassroomView` aggrega il registro con le annotazioni e la vista studenti
- `QuickNotePopover` per annotazioni rapide on-the-fly
- Persistenza via `indexedDbService.ts` (dati locali, nessun backend proprio)

**AI coinvolta**: nessuna per l'inserimento presenze. L'AI entra successivamente nella fase analitica (UC-V2).

**Compliance attivata**:

- **GDPR Art. 9**: le presenze sono dati personali di studenti minorenni; il sistema non li trasmette a terze parti, persistono solo localmente (localStorage/IndexedDB)
- **MIUR linee guida registri elettronici**: il formato è conforme alla struttura richiesta

**Insight mostrato**: nessun insight AI nella fase di inserimento. Il sistema mostra il conteggio assenze cumulato per studente.

**Evidenze generate**: registro aggiornato, timestamp operazione.

**Impatto su audit**: dati di presenza alimentano il profilo studente → base per predizione rischio (UC-V2).

---

### UC-E2 — Lezione con assistant panel in tempo reale

**Contesto reale**: durante la lezione in aula, docente vuole supporto didattico contestuale o vuole creare una lezione improvvisata.

**Azione docente**: apre `LessonAssistantPanel` o `ImpromptuLessonModal`, richiede suggerimenti per l'attività corrente o genera una lezione ex novo con AI.

**Supporto del sistema**:

- `LessonAssistantPanel` — suggerimenti contestuali in base alla materia e alla classe corrente
- `CreateLessonFromAiModal` — genera struttura di lezione via Gemini
- `LiveAssistant` / `LiveAssistantModal` — assistente attivo durante l'erogazione
- Lezione salvata in store → incrementa `usageProfile.lessonsCreated`

**AI coinvolta**: generazione (Gemini, via Edge Function). Il docente vede la risposta dell'AI come struttura lezione modificabile.

**Compliance attivata**:

- **AI Act Art. 13**: l'AI genera contenuto didattico — l'app deve dichiarare l'impiego di AI al docente (fatto via `AIExplainabilityPanel` nel caso sia abilitato)
- **GDPR**: nessun dato studente viene inviato all'AI in questa fase (solo contesto classe anonimizzato)

**Insight mostrato**: struttura lezione proposta con argomenti, metodologia, timing. Il docente può modificare prima di salvare.

**Azioni possibili**: salva lezione, modifica contenuto, aggiunge allo storico.

**Evidenze generate**: `Lezione` in store, timestamp, materia, classe.

**Impatto su audit**: `lessonsCreated >= 3` sblocca la regola `L1-2` — il copilot può ora fare suggerimenti curricolari precisi. `copilotRequests++` sblocca `L1-3`.

---

### UC-E3 — Raccomandazioni curricolari AI on-demand

**Contesto reale**: dopo 2–3 settimane di lezione, il docente vuole valutare la propria didattica e ricevere suggerimenti concreti.

**Azione docente**: apre `CopilotDocentePanel` → tab `CopilotRecommendationPanel`, clicca **"Calcola"**.

**Supporto del sistema** (pipeline reale in 4 step sequenziali):

1. `generateCurriculumRecommendations(lessons)` — analisi aderenza curriculum
2. `generatePedagogyReport(lessons, udas)` — report pedagogico con metodologie rilevate
3. Trust pipeline parallela:
   - `predictStudentRisk()` — score rischio per studente (0–1)
   - `explainClass()` — spiegazione decisioni AI per la classe
   - `generateBiasReport()` — rilevamento bias su valutazioni storiche
   - `generateTrustReport()` — report di affidabilità del sistema AI
4. `generateRecommendations([pedagogy], [trust], [])` — merge e ranking per `impactScore` desc

**AI coinvolta**: tutto AI (Gemini). Pipeline completamente generativa. Il docente vede action chips: `adjustContent` / `addExercise` / `reschedule` / `highlightRisk`.

**Compliance attivata**:

- **AI Act Art. 13–14**: `explainClass()` soddisfa l'obbligo di spiegabilità — spiega le basi della raccomandazione
- **GDPR Art. 5(1)(c) — minimizzazione**: `biasReport` lavora su dati aggregati, non anagrafiche individuali
- **AI Act Art. 9(2)**: la presenza di `trustReport` implementa la supervisione del sistema di gestione del rischio AI

**Insight mostrato**: card per ogni raccomandazione con `impactScore`, categoria (adjustContent/etc.), descrizione. Pulsante **"Genera attività"** produce una proposta di attività concreta.

**Azioni possibili**: espande l'activity card, copia la proposta, implementa la raccomandazione.

**Evidenze generate**: `Recommendation[]` con impactScore, `Activity[]` generate, log consulta copilot.

**Impatto su audit**: `copilotRequests > 0` → regola `L1-3` superata; bias report disponibile per eventuale audit PA (sezione equità algoritmica AI Act).

---

## C — VALUTAZIONE

---

### UC-V1 — Inserimento valutazioni e analisi griglia classe

**Contesto reale**: dopo una verifica scritta o orale, docente inserisce i voti per tutta la classe.

**Azione docente**: apre `EvaluationModule` → tab **griglia**, clicca "Aggiungi prova" (`AddProvaModal`), definisce tipo (Scritto/Orale/Pratico/Test), materia, data, argomento. Poi inserisce voti per singolo studente via `UnifiedEvaluationModal` o in bulk via `BulkEvaluationModal`.

**Supporto del sistema**:

- `EvaluationModule` ha 3 view tab: `grid` (matrice studenti × prove) / `summary` (statistiche) / `risk` (studenti a rischio)
- `calculatePerformance()` calcola performance score aggregato per studente
- `ExportModal` per esportazione griglia in CSV/XLSX

**AI coinvolta**: nessuna per l'inserimento. `calculatePerformance()` è algoritmo deterministico.

**Compliance attivata**:

- **GDPR Art. 9**: i voti scolastici sono dati personali di minori — persistono solo localmente (IndexedDB), nessun invio a terzi

**Insight mostrato**: colori nella griglia segnalano performance (rosso per voti sotto soglia), badge sul tab `risk` se ci sono studenti a rischio.

**Azioni possibili**: apre profilo studente (`StudentProfile`), visualizza andamento storico, esporta griglia.

**Evidenze generate**: `Valutazione[]` con `voto`, `tipo`, `data`, `materia`, `studenteId`.

**Impatto su audit**: dati di valutazione alimentano il modello predittivo (UC-V2) e il bias report (UC-E3).

---

### UC-V2 — Predizione rischio abbandono scolastico studenti

**Contesto reale**: metà quadrimestre, prima del consiglio di classe o dello scrutinio intermedio.

**Azione docente**: apre `EvaluationModule` → tab **risk**, oppure `RiskPredictionPanel` nel contesto analytics.

**Supporto del sistema**:

- `predictStudentRisk()` in `src/ai/prediction/` — calcola `riskProbability: number (0–1)` per ogni studente sulla base dei dati di valutazione e presenze
- Classificazione: alto (≥ 0.7, color `error`) / medio (≥ 0.4, color `secondary`) / basso (color `tertiary`)
- `analyticsAgent.run()` nel layer enterprise calcola anche un `atRiskCount` aggregato (~8% sentinel baseline)

**AI coinvolta**: modello predittivo ML-based (lato client, non generativo). Nessuna chiamata Gemini per questa funzione.

**Compliance attivata**:

- **AI Act Art. 13–14**: profiling automatico di studenti minorenni → obbligo di notifica e spiegabilità. Il sistema produce `rationale` per ogni predizione
- **GDPR Art. 22**: decisione automatizzata su individui — il docente deve mantenere il controllo umano (il panel mostra solo una raccomandazione, non esegue azioni autonome)
- **GDPR Art. 5(1)(c)**: i dati usati sono solo quelli pertinenti (voti + presenze, non dati sensibili aggiuntivi)

**Insight mostrato**: `"3 studenti ad alto rischio — intervento consigliato"`. Ogni studente mostra la barra di rischio con percentuale e label.

**Azioni possibili**: apre profilo studente, aggiunge nota di intervento, attiva piano inclusione (`PianoInclusione`), segnala al coordinatore.

**Evidenze generate**: `StudentRiskPrediction[]` con `riskProbability`, `rationale`, `studentId`. Signal `PERFORMANCE_ALERT` emesso in `decisionMemory` se threshold critica.

**Impatto su audit**: signal `PERFORMANCE_ALERT` nella `DecisionTimeline` (categoria "studenti"); se severity `critical`, copilotBrain lo espone come azione primaria TIER 0.

---

### UC-V3 — Valutazione per competenze e generazione e-Portfolio

**Contesto reale**: fine UDA, docente deve certificare le competenze raggiunte da ogni studente.

**Azione docente**: apre `CompetencyEvaluationModal`, seleziona studente e UDA, assegna livelli per ogni competenza mappata tramite `RubricEditor`; poi genera e-Portfolio studente.

**Supporto del sistema**:

- `RubricEditor` — editor rubrica con livelli (es. base/intermedio/avanzato/eccellente)
- `CompetencyLevelsView` — visualizzazione radar dei livelli per studente
- `CompetencyManager` — gestione portfolio competenze a lungo termine
- `StudentEPortfolioModal` — genera documento e-portfolio per lo studente
- `AiSuggestionsPanel` — suggerisce esempi di descrittori per la rubrica via AI

**AI coinvolta**: generazione (Gemini) per i suggerimenti di descrittori di rubrica. Non per l'assegnazione finale (sempre umana).

**Compliance attivata**:

- **MIUR DM 742/2017 (Primo Ciclo)**: la struttura della rubrica è allineata al decreto
- **GDPR**: l'e-Portfolio contiene dati personali valutati — export solo con consenso (gestito dal livello di accesso)

**Insight mostrato**: radar chart delle competenze per studente; `AiSuggestionsPanel` propone esempi di livello.

**Evidenze generate**: `ValutazioneCompetenza[]` con `livello`, `competenzaId`, `udaId`, `studenteId`; documento e-Portfolio esportabile.

**Impatto su audit**: competenze certificate disponibili per dichiarazione di accessibilità AGID e verbalizzazione scrutinio.

---

## D — REPORTING / AUDIT

---

### UC-R1 — Monitoraggio compliance normativa in tempo reale

**Contesto reale**: lavoro quotidiano o prima di un'ispezione. Il docente/referente privacy vuole sapere se il sistema è conforme.

**Azione docente**: apre `CopilotDocentePanel` → tab `LiveCompliancePanel`.

**Supporto del sistema**:

- `useComplianceRuntime()` — calcola in tempo reale:
  - **Live score** (0–100) con stato `compliant` / `warning` / `non_compliant`
  - **Framework scores** separati: GDPR / AI Act / AgID
  - **Violations list**: ogni violazione ha `severity` (critical/high/medium/low), articolo normativo, fix suggerito, pulsante remediation
- Remediation actions disponibili: `run_compliance_cycle` / `enable_human_approval` / `export_audit` / `contact_dpo`
- Sotto-tab integrato: **GovernancePanel** + **AuditPAPanel**

**AI coinvolta**: nessuna. Il runtime compliance è rule-based deterministico.

**Compliance attivata**: GDPR, AI Act, AgID — monitorati simultaneamente con score separati.

**Insight mostrato**: `"Score GDPR: 78 — 2 violazioni attive"`. Ogni violazione collassabile mostra la "Nota Revisore PA" e il fix concreto.

**Azioni possibili**: esegue remediation in-app (abilita approvazione umana, avvia ciclo audit), esporta report, contatta DPO.

**Evidenze generate**: compliance log aggiornato, score storicizzato.

**Impatto su audit**: `decisionMemory.complianceStatus` aggiornato (`gdpr: 'warning'` o `'critical'`) → copilotBrain espone la regola `E0-3` come azione primaria TIER 0.

---

### UC-R2 — Simulazione audit PA con verbale ufficiale

**Contesto reale**: un dirigente o referente qualità si prepara a un'ispezione AgID/Garante Privacy, o vuole verificare la readiness prima di uno scrutinio pubblico.

**Azione docente/dirigente**: apre `AuditPAPanel`, seleziona scenario (1 scenario produzione live + 4 simulazioni predefinite: scenario corretto / violazione GDPR / AI Act non conforme / AgID degradato).

**Supporto del sistema**:

- `useAuditSimulator()` → genera `PALiveAuditReport`:
  - **Global score** (percentuale)
  - `complianceStatus`: `CONFORME` / `PARZIALMENTE_CONFORME` / `NON_CONFORME`
  - `certificationReadiness`: `PRONTO` / `CONDIZIONATO` / `NON_PRONTO`
  - **Findings** ordinati (bloccanti prima): ogni finding ha severity, articolo, "Nota Revisore PA" collassabile, fix suggerito
  - **Drift indicator**: `improving` / `stable` / `degrading` rispetto all'audit precedente
- `generateAuditVerbalePDF()` — genera PDF verbale ufficiale
- `useAuditHistory()` — storico simulazioni con trend

**AI coinvolta**: nessuna. Il simulatore è rule-based sulla configurazione governance + compliance runtime.

**Compliance attivata**: GDPR, AI Act, AgID — tutti con score separati nel framework.

**Insight mostrato**: findings con colori severity (rosso critical → arancione medium → blu low), trend freccia, pulsanti fix per ogni finding aperto.

**Azioni possibili**: esporta verbale PDF, applica remediation al finding, segna come risolto, ripete simulazione post-fix per verificare miglioramento score.

**Evidenze generate**: `PALiveAuditReport` JSON, PDF verbale con firma governance, storico in `useAuditHistory`.

**Impatto su audit**: ogni simulazione registrata → drift detection calcola `improving/stable/degrading`. Score di certificazione disponibile per dichiarazione AGID.

---

### UC-R3 — Nomina ruoli obbligatori AI Act + GDPR (Governance)

**Contesto reale**: onboarding istituzionale della scuola o verifica annuale degli adempimenti normativi.

**Azione docente/dirigente**: apre `GovernancePanel`, compila i 4 ruoli obbligatori con nome/email.

**Supporto del sistema**:

- `useGovernanceStore` (Zustand) — persiste `GovernanceConfig`
- I 4 ruoli richiesti con le relative basi normative:
  - **DPO** — `GDPR Art. 37` (obbligatorio per PA su larga scala)
  - **Responsabile AI** — `AI Act Art. 9(2)` (supervisione sistema gestione del rischio)
  - **Responsabile Audit Interno** — `AI Act Art. 17` (sistema qualità e audit periodici)
  - **Titolare del Trattamento** — `GDPR Art. 4(7)` (determina finalità del trattamento)
- Barra di completezza 0–100% con messaggio di stato
- La `governanceConfig` confluisce automaticamente nel PDF verbale PA (UC-R2)

**AI coinvolta**: nessuna.

**Compliance attivata**:

- **AI Act Art. 9** e **GDPR Art. 37** — finding del simulatore PA su questi articoli si risolve quando i campi sono compilati

**Insight mostrato**: `"Governance incompleta — AI Act Art. 9 non soddisfatto"` con indicazione dei ruoli mancanti; passa a verde `"Governance AI Act Art. 9 conforme"` quando tutti compilati.

**Evidenze generate**: `GovernanceConfig` nel Zustand store, timestamp ultimo aggiornamento.

**Impatto su audit**: il finding "Governance" nell'`AuditPAPanel` viene marcato come risolto → score globale aumenta; PDF verbale include i nominativi per ogni ruolo.

---

### UC-R4 — Brain Dashboard: azione primaria personalizzata + audit trail

**Contesto reale**: ogni mattina, o ogni volta che il docente apre l'app. Il sistema mostra cosa fare adesso, non dati grezzi.

**Azione docente**: apre `IntelligentDashboard` (interno al `CopilotDocentePanel`).

**Supporto del sistema**:

- `useNextAction()` → `copilotBrain.getCopilotPrimaryAction()` → `getNextAction()` (regole TIER 0–5) → `rankingEngine.rankActions()` con `ScoringFactors`:
  - `basePriority` da tier (100/80/60/40/20/10)
  - `userAffinity` da `UserBehaviorProfile` (preferred +15, ignored −20)
  - `urgency` da signals (critical +25, warning +10)
  - `complianceWeight` (+30 se GDPR/AgID non ok)
  - `recencyBoost` (+5 se non eseguita nelle ultime 24h)
- `explainAction(rankedAction)` → `ActionExplanation` con `headline`, `reasons[]`, `dataUsed[]`, `confidence`, `normativeRef`
- `useProactiveNotifications()` → toast anti-fatigue (max 1 critical/5min, max 1 suggestion/30min)
- `DecisionTimeline` — timeline con filtri (Normativa/Studenti/Documenti/Sistema), cluster eventi entro 5min, anomalie rilevate (blocking consecutivi, approval delay > 1h)

**AI coinvolta**: il ranking è algoritmo deterministico personalizzato su `UserBehaviorProfile` (apprendimento incrementale lato client). Non AI generativa.

**Compliance attivata**:

- **GDPR**: signal `APPROVAL_REQUIRED` se ci sono approvazioni pendenti → esposto come E0-2 (TIER 0)
- **AgID**: signal `COMPLIANCE_UPDATE` → aggiorna status
- **AI Act**: `explainAction()` soddisfa l'obbligo di trasparenza AI Art. 13 (il pulsante "Perché questo?" mostra headline + reasons[])

**Insight mostrato**: `PrimaryActionCard` con titolo, descrizione, CTA; `SecondaryActionsList` max 2 azioni; `SystemStatusPanel` con complianceStatus + pendingApprovals + riskLevel; toast proattivo `"3 approvazioni in attesa"`.

**Azioni possibili**: clicca CTA → naviga alla view target; "Perché?" → apre `ExplainabilityPanel`; accetta/ignora toast.

**Evidenze generate**:

- `enterpriseAuditLog.record('copilot_action_executed')` per ogni CTA cliccato
- `UserBehaviorProfile` aggiornato: `onActionExecuted(id)` incrementa frequenza; se freq > 3 entra in `preferredActions`; se ignorata 2+ volte entra in `ignoredActions`

**Impatto su audit**: ogni interazione è tracciata nell'audit log immutabile. Il profilo comportamentale migliora il ranking continuamente. La `DecisionTimeline` è il registro cronologico leggibile dall'auditor.

---

### UC-R5 — Elaborazione documento normativo (circolare MIUR) con approvazione HITL

**Contesto reale**: la segreteria o il dirigente riceve una circolare ministeriale (es. aggiornamento GDPR scolastico, decreto AgID) e deve integrarla nel sistema.

**Azione**: carica il documento nell'area enterprise del sistema → avvia `orchestrator.processRegulatoryDocument(doc)`.

**Supporto del sistema** (pipeline completa):

1. `enterpriseAuditLog.record('agent_started')` — traccia inizio
2. `regulatoryAgent.parse(doc)` — estrae `normativeRefs` dal catalogo keywords (GDPR, ISO, AgID, DPCM, CAC/D.Lgs. 82/2005); produce `summary` e `approvalLevel` (segreteria/dirigente/ministry/governo)
3. `approvalGate.submit()` — crea `ApprovalRequest` con `approvalChain[]`, `kgImpact` (minor/major se > 3 norme trovate), `payload`
4. `kgEnterpriseBridge.stage()` — i nodi KG sono **messi in staging** (non scritti al grafo) in attesa di approvazione
5. `decisionMemory.emitSignal('APPROVAL_REQUIRED', 'critical')` — il Copilot Brain inserisce subito `E0-2` come azione primaria

**AI coinvolta**: nessuna — il parsing normativo è rule-based su un catalogo hardcoded di keywords. L'AI non è coinvolta nell'analisi dei documenti ufficiali.

> ⚠️ **Limite rilevato**: il `regulatoryAgent` estrae norme solo se il documento contiene le keywords del catalogo (es. "gdpr", "agid", "iso 27001"). Documenti con terminologia diversa non vengono riconosciuti.

**Compliance attivata**:

- **GDPR Art. 5-9** (se documento contiene "protezione dati")
- **AgID** (se contiene "agenzia per l'italia digitale")
- **DPCM 3 dicembre 2013** (conservazione digitale, Art. 43)
- **D.Lgs. 82/2005** (CAC — PEC, firma digitale)

**Insight mostrato**: toast critico `"Approvazione richiesta: [titolo doc] — N norme trovate"`. Il Brain Dashboard mostra `E0-2` come PrimaryActionCard con CTA "Approva".

**Azioni possibili** del dirigente:

- Esamina payload (`ApprovalRequest`)
- Approva → `approvalGate.resolve()` → `kgEnterpriseBridge.commit()` → nodi scritti nel Knowledge Graph
- Rifiuta → staged write eliminato, signal chiuso

**Evidenze generate** (in `enterpriseAuditLog`, append-only):  
`agent_started` → `agent_completed` → `approval_submitted` → `approval_resolved` → `kg_write_committed` (o `kg_write_rejected`)  
Ogni entry ha `complianceTags[]`, `sessionId`, `tenantId`, `timestamp` ISO 8601.

**Impatto su audit**: Knowledge Graph aggiornato con normative approvate → `decisionMemory.complianceStatus` aggiornato → sblocca/migliora score LiveCompliancePanel → riduce penalità nel simulatore PA.

---

## Mappa dipendenze tra casi d'uso

```
UC-P1 (planning wizard)
  └─→ UC-P2 (UDA editor) ← salva competenze per UC-V3

UC-E1 (presenze) ──────┐
UC-V1 (voti) ──────────┼─→ UC-V2 (risk prediction) ──→ signal PERFORMANCE_ALERT
                        └─→ UC-E3 (raccomandazioni AI) ← bias report

UC-E2 (lezione) ──→ lessonsCreated++ ──→ sblocca L1-2 in UC-R4

UC-R1 (compliance runtime) ──→ decisionMemory.complianceStatus ──→ UC-R4 Brain Dashboard (E0-3)
UC-R2 (audit PA) ──→ PDF verbale ← UC-R3 (governance roles)
UC-R5 (doc normativo) ──→ approvalGate ──→ UC-R4 (E0-2 azione primaria)
```

---

## Gap e incoerenze rilevate

| #   | Descrizione                                                                                                                                                                                | Modulo coinvolto       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| G1  | `regulatoryAgent` riconosce norme solo da keywords hardcoded — circolari tecniche non standard non vengono parsate                                                                         | `regulatoryAgent.ts`   |
| G2  | Nessuna validazione automatica che una UDA soddisfi i requisiti minimi orari del PTOF/POF                                                                                                  | `UdaPlanner.tsx`       |
| G3  | `predictStudentRisk()` usa una baseline sentinel fissa (~8%) — non è calibrata su dati reali della classe fino a N > soglia minima                                                         | `analyticsAgent.ts`    |
| G4  | La `DecisionTimeline` mostra anomalie (blocking consecutivi, approval delay > 1h) ma non emette un signal autonomo: il docente deve aprire il pannello per vederle                         | `DecisionTimeline.tsx` |
| G5  | Il `biasReport` segnala potenziali bias ma non specifica quale attributo protetto è a rischio (GDPR Art. 9 — non vengono trattati attributi sensibili) — la copertura normativa è parziale | `biasReport.ts`        |

---

## Indice dei file sorgente citati

| Modulo                           | Percorso                                                              |
| -------------------------------- | --------------------------------------------------------------------- |
| `AnnualPlanningWizard`           | `src/components/AnnualPlanningWizard.tsx`                             |
| `UdaPlanner` / `UdaEditor`       | `src/components/UdaPlanner.tsx`                                       |
| `EvaluationModule`               | `src/components/EvaluationModule.tsx`                                 |
| `RegisterView` / `ClassroomView` | `src/components/RegisterView.tsx`, `src/components/ClassroomView.tsx` |
| `CopilotRecommendationPanel`     | `src/components/copilot/CopilotRecommendationPanel.tsx`               |
| `RiskPredictionPanel`            | `src/components/RiskPredictionPanel.tsx`                              |
| `IntelligentDashboard`           | `src/components/copilot/IntelligentDashboard.tsx`                     |
| `LiveCompliancePanel`            | `src/components/copilot/LiveCompliancePanel.tsx`                      |
| `AuditPAPanel`                   | `src/components/copilot/AuditPAPanel.tsx`                             |
| `GovernancePanel`                | `src/components/copilot/GovernancePanel.tsx`                          |
| `DecisionTimeline`               | `src/components/copilot/DecisionTimeline.tsx`                         |
| `copilotBrain`                   | `src/cognition/copilotBrain.ts`                                       |
| `getNextAction`                  | `src/cognition/decisionEngine/getNextAction.ts`                       |
| `rankingEngine`                  | `src/cognition/rankingEngine.ts`                                      |
| `explainAction`                  | `src/cognition/explainAction.ts`                                      |
| `notificationEngine`             | `src/cognition/notificationEngine.ts`                                 |
| `decisionMemory`                 | `src/cognition/decisionMemory.ts`                                     |
| `userBehaviorModel`              | `src/cognition/userBehaviorModel.ts`                                  |
| `actionRegistry`                 | `src/cognition/actionRegistry.ts`                                     |
| `orchestrator`                   | `src/services/enterprise/orchestrator.ts`                             |
| `regulatoryAgent`                | `src/services/enterprise/regulatoryAgent.ts`                          |
| `approvalGate`                   | `src/services/enterprise/approvalGate.ts`                             |
| `kgEnterpriseBridge`             | `src/services/enterprise/kgEnterpriseBridge.ts`                       |
| `enterpriseAuditLog`             | `src/services/enterprise/enterpriseAuditLog.ts`                       |
| `complianceManifest`             | `src/services/enterprise/complianceManifest.ts`                       |
| `analyticsAgent`                 | `src/services/enterprise/agents/analyticsAgent.ts`                    |
| `aiService`                      | `src/services/aiService.ts`                                           |

---

_Documento generato da analisi diretta del codice — 2026-03-18_  
_Aggiornare a ogni sprint che modifica flussi, compliance o moduli AI_
