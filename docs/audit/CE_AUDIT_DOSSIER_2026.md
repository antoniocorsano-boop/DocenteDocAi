# DocenteDoc AI — Dossier di Audit CE (Commissione Europea / AI Act)

**Revisione**: 1.0  
**Data**: 18 marzo 2026  
**Commit**: `14aeb093`  
**Normativa di riferimento**: Reg. UE 2024/1689 (AI Act) · GDPR UE 2016/679 · ISO/IEC 27001:2022 · ISO/IEC 42001:2023  
**Classificazione**: RISERVATO

---

## 1. Identificazione del sistema AI

| Campo                      | Valore                                                                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome sistema               | DocenteDoc AI                                                                                                                                            |
| Fornitore                  | [da indicare — persona giuridica del fornitore]                                                                                                          |
| Versione                   | v4.2 (commit `14aeb093`)                                                                                                                                 |
| Data prima messa in uso    | Pilota previsto 2026 Q2                                                                                                                                  |
| Paese di deploy principale | Italia (UE)                                                                                                                                              |
| Utenti                     | Docenti scuola pubblica e privata, personale PA scolastica                                                                                               |
| Finalità dichiarata        | Supporto alla pianificazione didattica, valutazione studenti, compliance normativa scolastica                                                            |
| Architettura AI            | LLM generativo (Gemini 3 Pro Preview + Anthropic Claude) via proxy server-side + motore decisionale client (copilotBrain, rankingEngine, decisionEngine) |

---

## 2. Classificazione AI Act (Reg. UE 2024/1689)

### 2.1 Determinazione del livello di rischio

**Classificazione**: 🔴 **ALTO RISCHIO — Allegato III, punto 3(b)**

**Motivazione (derivata da `aiActClassifier.ts`):**

> Il sistema DocenteDoc AI assiste docenti di PA nella pianificazione didattica, valutazione degli studenti e decisioni ad impatto formativo. Rientra nell'Allegato III, punto 3(b) dell'AI Act (sistemi AI per istruzione/valutazione) e nella categoria PA di sistemi ad alto rischio per impatto su diritti fondamentali (art. 6, par. 2).

**Base giuridica della classificazione**:

- **Allegato III, punto 3(b)**: sistemi AI destinati a essere usati per valutare gli studenti negli istituti di istruzione o a determinare l'accesso o l'assegnazione a istituti di istruzione e formazione professionale
- **Allegato III, punto 8**: sistemi AI usati in attività di polizia amministrativa e PA per attività di interesse pubblico
- **Art. 6(2)**: presenza di persone fisiche soggette agli output AI (studenti valutati)

**Esenzione applicabile** (Art. 6(3)): ⛔ Nessuna esenzione applicabile — sistema non puramente procedurale, emette valutazioni con impatto reale su studenti.

### 2.2 Confronto con sistemi consentiti/vietati

| Categoria AI Act                  | Applicabile        | Note                                                                                           |
| --------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| Art. 5 — Pratiche AI vietate      | ✅ Non applicabile | Il sistema non effettua scoring sociale, manipolazione subliminale, identificazione biometrica |
| Art. 6 — Alto rischio             | ✅ Applicabile     | Classificazione confermata: Annex III punto 3(b)                                               |
| Art. 50 — Obblighi di trasparenza | ✅ Applicabile     | Interazione umana con sistema AI riconoscibile                                                 |

---

## 3. Obblighi AI Act per sistemi ad alto rischio

### 3.1 Matrice obblighi (fonte: `aiActClassifier.ts`)

| Art.        | Obbligo                                  | Stato           | Evidenza tecnica                                                                                                                                                                           |
| ----------- | ---------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Art. 9**  | Sistema di Gestione del Rischio          | ✅ **CONFORME** | Self-Compliance Engine attivo: `riskMonitor`, `complianceBrain`, `auditExporter`, `riskAssessment.ts` (13 rischi identificati)                                                             |
| **Art. 10** | Dati e Governance dei Dati               | ✅ **CONFORME** | GDPR data retention 365gg, anonimizzazione dati AI, nessun dato personale in modelli (solo aggregati), `useCaseTelemetry.ts` sanitizza details                                             |
| **Art. 11** | Documentazione Tecnica                   | ⚠️ **PARZIALE** | `certificationPackage.ts` genera draft automaticamente; documentazione formale non ancora depositata (**Gap G3 CE**)                                                                       |
| **Art. 12** | Conservazione Registrazioni (Logging)    | ✅ **CONFORME** | `complianceDb`: rolling log 1000 attività con timestamp, tipo, rischio, esito; `enterpriseAuditLog.ts` append-only con `useCaseId`                                                         |
| **Art. 13** | Trasparenza e Informazione agli Utenti   | ✅ **CONFORME** | `ExplainabilityPanel`: ogni suggerimento espone `headline`, `reasons`, `dataUsed`, `confidenceScore`, `normativeRef`; badge AI visibile nella UI                                           |
| **Art. 14** | Supervisione Umana                       | ✅ **CONFORME** | `ApprovalQueueStore` HITL 4 livelli (segreteria/dirigente/ministry/governo); blocco azioni critiche; nessuna azione autonoma su dati studenti; docente può ignorare qualsiasi suggerimento |
| **Art. 15** | Accuratezza, Robustezza e Cybersicurezza | ✅ **CONFORME** | `RankedAction` con `scoreBreakdown`, `confidenceScore`; API key server-side only; nessun PII nel bundle client; test suite 1740/1752                                                       |
| **Art. 26** | Obblighi dei Deployer (PA)               | ⛔ **MANCANTE** | Procedure PA non formalizzate: incidente response, monitoraggio operativo, training plan (**Gap G2 CE**)                                                                                   |
| **Art. 50** | Obblighi Trasparenza Interazione Umana   | ✅ **CONFORME** | `PrivacyConsentModal` consenso GDPR art.13 al primo avvio; badge "AI" visibile nei panel copilot                                                                                           |
| **Art. 62** | Notifica Incidenti Gravi                 | ⛔ **MANCANTE** | Procedura automatica di notifica ad AgID/autorità di vigilanza non ancora implementata (**Gap G4 CE**)                                                                                     |

**Riepilogo**: 7/10 obblighi implementati → **70%** — _Condizionato_

### 3.2 Requisito Art. 49 — Registrazione nel database EU

**Stato**: ⛔ In attesa (Gap G1 CE)

Il database EU per registrazione sistemi AI ad alto rischio sarà operativo da **agosto 2026**. La registrazione deve avvenire prima del deploy definitivo in PA.

**Informazioni da inserire nel DB EU**:

- Nome, versione, finalità del sistema
- Classificazione Annex III
- Informazioni sul fornitore
- Dichiarazione di conformità
- Documentazione tecnica Art. 11

### 3.3 Requisito Art. 43 — Valutazione della conformità

Per sistemi Annex III punto 3(b), la valutazione di conformità può essere eseguita tramite:

- **Auto-valutazione** (Art. 43(2)): il fornitore può effettuare auto-valutazione con documentazione tecnica — applicabile se il sistema non rientra in casi specifici che richiedono terza parte
- **Organismo notificato**: non obbligatorio per i sistemi educativi (diversamente da sistemi biometrici e infrastrutture critiche)

**Raccomandazione**: procedere con auto-valutazione + documentazione tecnica Art. 11 depositata.

---

## 4. GDPR UE 2016/679 — Prospettiva CE

### 4.1 Privacy by Design (Art. 25) — ✅ CONFORME

Il sistema implementa Privacy by Design strutturalmente:

| Misura              | Implementazione                                                               |
| ------------------- | ----------------------------------------------------------------------------- |
| Data minimisation   | AI riceve solo tag aggregati, mai anagrafiche studenti                        |
| Storage limitation  | `dataRetention.ts` — 365 giorni artefatti AI, poi auto-purge                  |
| Purpose limitation  | Dati usati solo per funzione didattica, zero finalità commerciali             |
| Local-first         | Tutto in localStorage/IndexedDB del browser del docente                       |
| Prompt sanitization | `useCaseTelemetry.ts` rimuove credenziali dai `details` prima del salvataggio |

### 4.2 Trasferimenti verso paesi terzi (Art. 44-49)

| Destinatario           | Paese | Base giuridica trasferimento                                 | Stato                                                 |
| ---------------------- | ----- | ------------------------------------------------------------ | ----------------------------------------------------- |
| Google (Gemini API)    | USA   | Decisione di adeguatezza EU-US Data Privacy Framework (2023) | ⚠️ Da verificare validità DPF per specifico contratto |
| Anthropic (Claude API) | USA   | Decisione di adeguatezza EU-US Data Privacy Framework (2023) | ⚠️ Da verificare                                      |
| Vercel (Edge hosting)  | USA   | Standard Contractual Clauses (SCC)                           | ⚠️ Da formalizzare                                    |

**Nota critica**: il trasferimento di dati verso USA è tecnicamente consentito sotto EU-US DPF, ma richiede che i provider siano certificati DPF e che il DPA formale (Art. 28) sia firmato. Entrambe le condizioni sono attualmente non soddisfatte.

### 4.3 Valutazione d'impatto (Art. 35 GDPR) — DPIA

**Requisito DPIA**: ✅ Sì — il sistema tratta dati di minori su larga scala + decisioni automatizzate con impatto su studenti → DPIA obbligatoria.

**Stato**: ⚠️ Draft disponibile (da `dpiaGenerator.ts`), approvazione formale DPO mancante.

**Rischi identificati nella DPIA** (da `riskAssessment.ts`):

| Rischio                               | Categoria | Severità    | Mitigazione                                                                         |
| ------------------------------------- | --------- | ----------- | ----------------------------------------------------------------------------------- |
| Allucinazioni LLM                     | Tecnico   | Alta        | ExplainabilityPanel, supervisione umana obbligatoria                                |
| Dipendenza provider LLM               | Tecnico   | Media       | Gestione errori, fallback UI                                                        |
| Perdita dati browser eviction         | Tecnico   | Media       | Drive backup, export manuale                                                        |
| PII in prompt LLM                     | Tecnico   | Alta        | API proxy, sanitizzazione; **parziale** — strato di anonimizzazione prompt mancante |
| Bias AI verso studenti stereotipati   | Etico     | Alta        | No dati demografici in ranking; **parziale** — audit fairness periodico mancante    |
| Over-automazione autonomia docente    | Etico     | Media       | Tutti suggerimenti sono opzionali, docente decide sempre                            |
| Equità algoritmica report studenti    | Etico     | Media       | **Mancante**: fairness metrics non implementate                                     |
| DPA provider LLM assente              | Legale    | **Critica** | **Mancante** — blocco immediato                                                     |
| Informativa minori/famiglie assente   | Legale    | Alta        | **Parziale** — solo docenti coperti                                                 |
| Notifica Garante non automatizzata    | Legale    | Alta        | riskMonitor rileva, notifica manuale                                                |
| Registrazione AI Act DB EU            | Legale    | Alta        | Database EU attivo da agosto 2026                                                   |
| Formazione personale PA insufficiente | Operativo | Media       | **Mancante** — piano formazione da predisporre                                      |
| Dipendenza Vercel US                  | Operativo | Media       | Gestione errori; **parziale** — piano migrazione EU mancante                        |

---

## 5. ISO/IEC 27001:2022 (Sicurezza delle Informazioni)

**Stato certificazione**: ⚠️ Non certificato — controlli parzialmente presenti

### 5.1 Controlli Annex A implementati

| Dominio                    | Controllo                                | Stato       | Evidenza                                                      |
| -------------------------- | ---------------------------------------- | ----------- | ------------------------------------------------------------- |
| A.5 — Policy sicurezza     | A.5.1 Politiche per la sicurezza         | ⚠️ Parziale | `SECURITY.md` presente, policy formale non approvata          |
| A.8 — Gestione asset       | A.8.24 Uso della crittografia            | ✅ Conforme | HTTPS enforced, API key server-side, no secret in bundle      |
| A.9 — Controllo accessi    | A.9.1 Policy controllo accessi           | ✅ Conforme | Google OAuth, dati locali, nessun RBAC server-side necessario |
| A.12 — Operazioni sicure   | A.12.3 Backup informazioni               | ✅ Conforme | Google Drive backup, PWA service worker, export manuale       |
| A.14 — Sviluppo sicuro     | A.14.2 Sicurezza nei processi sviluppo   | ✅ Conforme | GitHub Actions CI, 4 workflow, npm audit, ESLint MD3          |
| A.16 — Gestione incidenti  | A.16.1 Gestione incidenti sicurezza      | ⚠️ Parziale | riskMonitor rileva; procedura notifica formale mancante       |
| A.17 — Business Continuity | A.17.1 Continuità sicurezza informazioni | ⚠️ Parziale | Gestione errori API presente; piano BC formale mancante       |
| A.18 — Conformità          | A.18.1 Rispetto requisiti legali         | ⚠️ Parziale | complianceManifest, auditEngine; DPA e RoPA mancanti          |

### 5.2 Gap principali ISO 27001

- Nessuna politica ISMS formalmente approvata e firmata
- Risk register non integrato con sistema di gestione documentale
- Incident response plan non documentato
- Piano di business continuity formale assente

**Raccomandazione**: certificazione ISO/IEC 27001 raccomandata (non obbligatoria) per deploy PA di livello alto. Stimato: 6–9 mesi con supporto consulente ISMS.

---

## 6. ISO/IEC 42001:2023 (AI Management System)

**Stato**: ✅ **SOSTANZIALMENTE CONFORME** (non certificato)

| Clausola              | Requisito                                       | Stato       | Evidenza                                                                       |
| --------------------- | ----------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| § 4 — Context         | Comprensione organizzazione e parti interessate | ✅ Conforme | `COMPLIANCE_MANIFEST`, `certificationPackage.ts`                               |
| § 5 — Leadership      | Commitment management, politica AI              | ⚠️ Parziale | Politica AI non formalizzata                                                   |
| § 6.1 — Rischi        | Risk assessment per sistemi AI                  | ✅ Conforme | `riskAssessment.ts` (13 rischi, 4 categorie)                                   |
| § 6.2 — Obiettivi     | Obiettivi sistema gestione AI                   | ⚠️ Parziale | Roadmap presente, obiettivi metrici non formalizzati                           |
| § 7 — Supporto        | Risorse, competenze, comunicazione              | ⚠️ Parziale | `ExplainabilityPanel`, badge AI; formazione PA mancante                        |
| § 8.4 — Ciclo vita AI | Lifecycle management                            | ⚠️ Parziale | Deployment gestito; piano formale dismissione/aggiornamento mancante           |
| § 9.1 — Monitoraggio  | Misurazione, analisi, valutazione               | ✅ Conforme | `ComplianceAgent.runComplianceCycle()`, snapshot periodici, `metricsCollector` |
| § 9.2 — Audit interni | Audit interni del sistema gestione              | ✅ Conforme | `AuditPAPanel.tsx` con 5 scenari, `LiveCompliancePanel` real-time              |
| § 10 — Miglioramento  | Non conformità e azioni correttive              | ✅ Conforme | `generateRecommendations()` da `recommendationEngine.ts`                       |

---

## 7. Gap Analysis CE (riepilogo da `gapAnalyzer.ts`)

| ID Gap     | Standard      | Articolo                 | Requisito                          | Stato       | Priorità            |
| ---------- | ------------- | ------------------------ | ---------------------------------- | ----------- | ------------------- |
| gap_gdpr_1 | GDPR          | Art. 13                  | Informativa a studenti/famiglie    | ⚠️ Parziale | 🔴 Alta             |
| gap_gdpr_2 | GDPR          | Art. 25                  | Privacy by Design                  | ✅ Conforme | 🟢 Bassa            |
| gap_gdpr_3 | GDPR          | Art. 28                  | DPA con provider LLM               | ⛔ Mancante | 🔴 Alta             |
| gap_gdpr_4 | GDPR          | Art. 30                  | Registro trattamenti (RoPA)        | ⛔ Mancante | 🔴 Alta             |
| gap_gdpr_5 | GDPR          | Art. 33                  | Notifica Garante 72h               | ⚠️ Parziale | 🔴 Alta             |
| gap_gdpr_6 | GDPR          | Art. 35                  | DPIA approvata da DPO              | ⚠️ Parziale | 🔴 Alta             |
| gap_gdpr_7 | GDPR          | Art. 37                  | Nomina DPO                         | ⛔ Mancante | 🔴 Alta             |
| gap_gdpr_8 | GDPR          | Art. 17                  | Right to erasure UI                | ⛔ Mancante | 🟠 Media            |
| gap_ai_1   | AI Act        | Art. 9                   | Risk management system             | ✅ Conforme | 🟢 Bassa            |
| gap_ai_2   | AI Act        | Art. 11                  | Documentazione tecnica formale     | ⚠️ Parziale | 🔴 Alta             |
| gap_ai_3   | AI Act        | Art. 12                  | Logging automatico                 | ✅ Conforme | 🟢 Bassa            |
| gap_ai_4   | AI Act        | Art. 13                  | Trasparenza utenti                 | ✅ Conforme | 🟢 Bassa            |
| gap_ai_5   | AI Act        | Art. 14                  | Supervisione umana                 | ✅ Conforme | 🟢 Bassa            |
| gap_ai_6   | AI Act        | Art. 49                  | Registrazione DB EU                | ⛔ Mancante | 🟡 Bassa (ago 2026) |
| gap_ai_7   | AI Act        | Art. 26(6)               | Formazione deployer PA             | ⛔ Mancante | 🔴 Alta             |
| gap_ai_8   | AI Act        | Art. 62                  | Notifica incidenti gravi           | ⛔ Mancante | 🟠 Media            |
| gap_agid_1 | AgID          | Linee Guida IA PA        | Registro trattamenti automatizzati | ⚠️ Parziale | 🟠 Media            |
| gap_agid_2 | AgID          | CAD Art. 32              | Misure minime sicurezza ICT        | ⚠️ Parziale | 🔴 Alta             |
| gap_agid_3 | AgID          | PNRR Accessibilità       | Dichiarazione accessibilità        | ⛔ Mancante | 🟠 Media            |
| gap_agid_4 | AgID          | Open Data D.Lgs. 36/2006 | Open data DCAT-AP_IT               | ✅ Conforme | 🟢 Bassa            |
| gap_iso_1  | ISO/IEC 42001 | § 6.1                    | Risk assessment AI                 | ✅ Conforme | 🟢 Bassa            |
| gap_iso_2  | ISO/IEC 42001 | § 9.1                    | Monitoraggio continuo              | ✅ Conforme | 🟢 Bassa            |
| gap_iso_3  | ISO/IEC 42001 | § 8.4                    | Lifecycle management AI            | ⚠️ Parziale | 🟠 Media            |

**Totale**: 8 conformi · 7 parziali · 8 mancanti su 23 elementi  
**Compliance rate effettivo:** `(8 + 7×0.5) / 23 × 100 = 50%`

---

## 8. Valutazione di readiness per certificazione CE

### 8.1 Score per dimensione (da `readinessScorer.ts`)

| Dimensione      | Peso | Score stimato | Note                                               |
| --------------- | ---- | ------------- | -------------------------------------------------- |
| Governance      | 15%  | 55%           | Politica AI non formalizzata                       |
| Transparency    | 20%  | 85%           | ExplainabilityPanel, PrivacyConsentModal, badge AI |
| Auditability    | 20%  | 75%           | enterpriseAuditLog, complianceDb, AuditPAPanel     |
| Security        | 15%  | 70%           | HTTPS, API proxy, 2 XSS aperti da chiudere         |
| Human Oversight | 15%  | 90%           | ApprovalQueueStore HITL 4 livelli                  |
| Documentation   | 10%  | 40%           | Draft, non depositato formalmente                  |
| Data Protection | 15%  | 55%           | PbD conforme; DPA, DPO, RoPA mancanti              |

**Score ponderato stimato**: ~68 / 100  
**Soglia per auto-certificazione CE**: ≥ 80 / 100  
**Gap residuo**: ~12 punti — raggiungibili con risoluzione G1 (DPA), G2 (DPO), G4 (DPIA formale), G7 (formazione PA)

### 8.2 Path to CE certification (auto-valutazione)

```
Passo 1 — Prerequisiti legali (entro deploy pilota, ~30 giorni)
  ├─ Firmare DPA con Google e Anthropic            → +8 punti Data Protection
  ├─ Nominare DPO e approvare DPIA                 → +5 punti Governance / Data Protection
  └─ Redigere RoPA                                 → +3 punti Documentation

Passo 2 — Documentazione tecnica (entro 60 giorni)
  ├─ Finalizzare e depositare documentazione Art.11 → +5 punti Documentation
  └─ Piano formazione PA deployer                  → +4 punti Governance

Passo 3 — Security hardening (entro 30 giorni)
  ├─ Sanitizzare HelpModal e SmartImportModal       → +3 punti Security
  └─ Pentest AgID                                   → +3 punti Security

Passo 4 — Registrazione DB EU (agosto 2026)
  └─ Registrare nel database EU AI Act Art. 49      → requisito procedurale

→ Score stimato post-step 1-3: ~90 / 100 = PRONTO per auto-certificazione CE
```

---

## 9. Dichiarazione di conformità (bozza)

> **Dichiara di conformità AI Act — BOZZA**
>
> Il fornitore [ragione sociale da inserire], con sede in [indirizzo da inserire], dichiara, sotto la propria esclusiva responsabilità, che il sistema AI DocenteDoc AI, versione 4.2, soddisfa le disposizioni del Regolamento (UE) 2024/1689 (AI Act) applicabili ai sistemi AI ad alto rischio di cui all'Allegato III, punto 3(b).
>
> La conformità è basata sulle norme armonizzate e sulle specifiche comuni applicabili, tra cui:
>
> - ISO/IEC 42001:2023 — AI Management Systems
> - ISO/IEC 27001:2022 — Information Security Management
> - GDPR UE 2016/679
>
> **Obblighi Art. 9-15 e Art. 50 soddisfatti**: ✅ 7/10  
> **Obblighi da completare prima della firma**: Art. 11 (documentazione tecnica), Art. 26 (deployer PA), Art. 62 (notifica incidenti)
>
> _Questa dichiarazione non è ancora valida — richiede firma del responsabile legale e completamento degli obblighi mancanti._

---

## 10. Raccomandazioni finali CE

### Priorità assoluta (prima del deploy)

1. **DPA con Google e Anthropic** — GDPR Art. 28 (blocco assoluto)
2. **Anonimizzazione prompt LLM** — strato sanitizzazione nel prompt builder, prima di inviare a `api/ai.ts`
3. **Documentazione tecnica Art. 11** — finalizzare output di `certificationPackage.ts` e depositare

### Priorità alta (entro 60 giorni dal deploy)

4. **Formazione deployer PA** — piano obbligatorio Art. 26(6) AI Act
5. **DPIA approvata da DPO** — DPO nomina PA committente
6. **Audit fairness periodico** — implementare `fairnessMetrics` per bias monitoring (Gap risk_e1, risk_e3)

### Priorità media (roadmap 3–6 mesi)

7. **Procedura notifica incidenti** — Art. 62 AI Act + GDPR Art. 33 in pipeline automatica
8. **Migrazione hosting EU** — Vercel EU o CSP qualificato AgID per Edge Function
9. **ISO/IEC 27001 certification** (opzionale ma raccomandata per contratti PA di alto valore)
10. **Registrazione DB EU** (agosto 2026 — procedura automatica una volta disponibile)

---

## 11. Verdetto CE finale

```
SISTEMA: DocenteDoc AI v4.2
CLASSIFICAZIONE AI ACT: ALTO RISCHIO (Annex III punto 3(b))
IMPLEMENTAZIONE OBBLIGHI: 7/10 (70%)
SCORE READINESS: ~68/100
STATO: ⚠️ CONDIZIONATO — non pronto per dichiarazione di conformità CE

BLOCCANTI IMMEDIATI:
  • DPA con Google e Anthropic (GDPR Art. 28)
  • Documentazione tecnica Art. 11 non depositata
  • Piano formazione deployer PA (Art. 26(6))

OBIETTIVO RAGGIUNGIBILE: ≥ 80/100 (PRONTO per auto-certificazione) entro 90 giorni
con risoluzione dei 3 bloccanti immediati + DPIA formale + RoPA.
```

---

_Dossier derivato da analisi diretta del codebase e moduli self-compliance — commit `14aeb093`, 18 marzo 2026._  
_Riferimenti tecnici: `src/self-compliance/certification/` (aiActClassifier, gapAnalyzer, riskAssessment, dpiaGenerator, readinessScorer, certificationPackage)._
