# DocenteDoc AI — Dossier di Audit PA (Pubblica Amministrazione Italiana)

**Revisione**: 1.0  
**Data**: 18 marzo 2026  
**Commit**: `14aeb093`  
**Autorità di riferimento**: Garante Privacy · AgID · MIUR · Ministero della PA  
**Classificazione**: RISERVATO

---

## 1. Descrizione del sistema

**Denominazione**: DocenteDoc AI  
**Tipologia**: Applicazione web SPA (Single Page Application) di supporto alla didattica per docenti di scuole pubbliche italiane  
**Stack tecnologico**: React 18 + TypeScript + Vite + MUI v7 · Zustand · Vercel Edge Function  
**Modalità di trattamento dati**: full client-side — dati persistono esclusivamente in localStorage/IndexedDB del browser del docente; zero backend proprietario  
**AI integrata**: Gemini 3 Pro Preview (Google) e Anthropic Claude, tramite proxy Vercel Edge (`api/ai.ts`); chiavi AI mai esposte lato client  
**Utenti previsti**: docenti di istituti scolastici di ogni ordine e grado, PA committente  
**Dati trattati**: dati identificativi docente, dati anagrafici e di rendimento studenti (minorenni), UDA, valutazioni, presenze, annotazioni didattiche

---

## 2. Quadro normativo applicabile — Track PA

| Standard                   | Autorità                         | Obbligatorio   | Ambito                                          |
| -------------------------- | -------------------------------- | -------------- | ----------------------------------------------- |
| GDPR UE 2016/679           | Unione Europea / Garante Privacy | ✅ Sì          | Trattamento dati personali studenti e docenti   |
| D.Lgs. 196/2003 aggiornato | Garante Privacy                  | ✅ Sì          | Recepimento GDPR — aspetti nazionali            |
| AgID — Piano Triennale     | Agenzia per l'Italia Digitale    | ✅ Sì (PA)     | Interoperabilità, accessibilità, cloud PA       |
| D.Lgs. 82/2005 (CAC)       | Ministero PA                     | ✅ Sì (PA)     | PEC, firma digitale, documento informatico      |
| DPCM 3 dicembre 2013       | PCM                              | ✅ Sì (PA)     | Conservazione digitale documenti amministrativi |
| MIUR linee guida           | Ministero Istruzione             | ✅ Sì          | Registri elettronici, privacy studenti minori   |
| ISO/IEC 27001:2022         | ISO                              | ⬜ Facoltativo | Sistema di gestione sicurezza informazioni      |

---

## 3. Conformità GDPR UE 2016/679

### 3.1 Principi del trattamento (Art. 5)

| Principio                             | Art.    | Stato       | Evidenza tecnica                                                                                                                 |
| ------------------------------------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Liceità, correttezza, trasparenza     | 5(1)(a) | ✅ Conforme | `PrivacyConsentModal` — consenso esplicito al primo avvio (`CONSENT_KEY = 'privacy_consent_v1'`)                                 |
| Limitazione delle finalità            | 5(1)(b) | ✅ Conforme | Dati usati esclusivamente per supporto didattico, nessuna profilazione commerciale                                               |
| Minimizzazione dei dati               | 5(1)(c) | ✅ Conforme | AI riceve solo tag aggregati, non anagrafiche; `src/cognition/useCaseTelemetry.ts` sanitizza credenziali prima della persistenza |
| Esattezza                             | 5(1)(d) | ✅ Conforme | Docente modifica e controlla tutti i dati in ogni momento                                                                        |
| Limitazione della conservazione       | 5(1)(e) | ✅ Conforme | `src/utils/dataRetention.ts` — retention 365 giorni per artefatti AI; dati primari mai cancellati automaticamente                |
| Integrità e riservatezza              | 5(1)(f) | ⚠️ Parziale | HTTPS, API proxy server-side; **gap**: 2 `dangerouslySetInnerHTML` non sanitizzati in `HelpModal` e `SmartImportModal`           |
| Responsabilizzazione (accountability) | 5(2)    | ⚠️ Parziale | `enterpriseAuditLog.ts` append-only, `complianceDb` rolling log; **gap**: RoPA formale da produrre                               |

### 3.2 Base giuridica (Art. 6)

Trattamento lecito in quanto basato su:

- **Art. 6(1)(a)** — consenso esplicito del docente (PrivacyConsentModal, versione `privacy_consent_v1`)
- **Art. 6(1)(e)** — esecuzione di compito di interesse pubblico (attività didattica PA)

**Gap**: base giuridica non ancora depositata formalmente nella documentazione RoPA.

### 3.3 Dati particolari (Art. 9)

I dati di studenti minorenni non rientrano nella categoria "dati particolari" ex art. 9 GDPR (non dati sanitari, genetici, biometrici). Tuttavia:

- **Art. 8** (consenso minori): richiesto consenso genitoriale per studenti con età < 14 anni per qualsiasi trattamento AI — **Gap G5: non implementato**.

### 3.4 Informativa (Art. 13)

| Soggetto          | Stato           | File                                                                               |
| ----------------- | --------------- | ---------------------------------------------------------------------------------- |
| Docente           | ✅ Implementato | `src/components/PrivacyConsentModal.tsx` — informativa GDPR art. 13 al primo avvio |
| Studente/famiglia | ⛔ Mancante     | Da implementare — workflow consenso genitoriale (**Gap G5**)                       |

### 3.5 Diritti degli interessati

| Diritto       | Art. | Stato       | Note                                                                                                 |
| ------------- | ---- | ----------- | ---------------------------------------------------------------------------------------------------- |
| Accesso       | 15   | ✅ De facto | Docente vede tutti i suoi dati nell'app                                                              |
| Rettifica     | 16   | ✅ De facto | Tutti i dati sono editabili                                                                          |
| Cancellazione | 17   | ⛔ Pendente | `dataRetention.ts` cancella artefatti AI, ma manca UI per right-to-erasure su richiesta (**Gap G8**) |
| Portabilità   | 20   | ⚠️ Parziale | Export DOCX presente, mancante export strutturato JSON/CSV dei dati personali                        |
| Opposizione   | 21   | ✅ De facto | Docente può disabilitare funzioni AI in qualsiasi momento                                            |

### 3.6 Data Processing Agreement (Art. 28)

| Provider               | Ruolo                        | DPA                       | Note                                                                 |
| ---------------------- | ---------------------------- | ------------------------- | -------------------------------------------------------------------- |
| Google (Gemini API)    | Responsabile del trattamento | ⛔ **CRITICO — MANCANTE** | **Gap G1** — blocca deploy PA                                        |
| Anthropic (Claude API) | Responsabile del trattamento | ⛔ **CRITICO — MANCANTE** | **Gap G1** — blocca deploy PA                                        |
| Vercel (hosting Edge)  | Sub-responsabile             | ⚠️ Da verificare          | Vercel Data Processing Agreement disponibile, da firmare formalmente |

> ⚠️ **BLOCCO IMMEDIATO**: il trattamento di dati tramite API LLM senza DPA firmato costituisce violazione diretta dell'Art. 28 GDPR. Deploy PA non consentito fino alla firma dei DPA.

### 3.7 Registro delle attività di trattamento (Art. 30)

**Stato**: ⛔ **MANCANTE** (Gap G3)

`enterpriseAuditLog.ts` traccia le attività operative ma non produce un RoPA conforme all'Art. 30 GDPR. Struttura RoPA richiesta:

- Denominazione e contatti del titolare del trattamento
- Finalità del trattamento
- Categorie di interessati e di dati personali
- Categorie di destinatari
- Trasferimenti verso paesi terzi (Google US, Anthropic US — critico)
- Termini di cancellazione
- Misure di sicurezza

**Azione**: la PA committente deve predisporre il RoPA con il supporto del fornitore.

### 3.8 Data Protection Impact Assessment (Art. 35)

**Stato**: ⚠️ Parziale (Gap G4)

`src/self-compliance/certification/dpiaGenerator.ts` genera automaticamente un draft DPIA con:

- Categorie di dati e soggetti
- Attività di trattamento
- Rischi identificati (12 rischi in `riskAssessment.ts`)
- Test di necessità e proporzionalità

**Gap**: approvazione formale da parte di DPO nominato mancante. Il draft non costituisce DPIA valida.

### 3.9 Responsabile della Protezione dei Dati (Art. 37)

**Stato**: ⛔ **MANCANTE** (Gap G2)

Per scuola pubblica italiana, nomina DPO (Responsabile della Protezione dei Dati) è obbligatoria ex Art. 37(1)(a) GDPR. La PA committente deve:

1. Nominare il DPO con atto formale
2. Comunicarlo al Garante Privacy
3. Pubblicare i contatti del DPO sul sito istituzionale
4. Il DPO deve supervisionare DPIA e RoPA

### 3.10 Violazione dei dati personali (Art. 33)

**Stato**: ⚠️ Parziale (Gap G9)

Rilevamento automatico tecnico: ✅

- `riskMonitor.ts` rileva `gdprViolation` e genera alert CRITICAL
- `complianceDb` traccia ogni anomalia
- `AuditPAPanel.tsx` mostra scenario "Violazione GDPR simulata" per test

Procedura di notifica al Garante entro 72h: ⛔ non implementata (manuale, documentazione da predisporre).

---

## 4. Conformità AgID

### 4.1 Interoperabilità e API

| Requisito                          | Linee Guida AgID                | Stato       | Evidenza                                                                |
| ---------------------------------- | ------------------------------- | ----------- | ----------------------------------------------------------------------- |
| API-first design                   | Linee Guida Interoperabilità v3 | ✅ Conforme | `api/ai.ts` Edge Function con interface tipizzata                       |
| Open Data DCAT-AP_IT               | D.Lgs. 36/2006                  | ✅ Conforme | `openDataPublisher.ts` genera JSON DCAT-AP_IT conforme                  |
| Registro trattamenti automatizzati | Linee Guida IA PA (2024)        | ⚠️ Parziale | `complianceDb` traccia attività, formato non AgID-standard (**Gap G8**) |
| Misure minime sicurezza ICT        | CAD Art. 32                     | ⚠️ Parziale | HTTPS, auth OAuth; **gap**: pentest formale non eseguito (**Gap G6**)   |

### 4.2 Accessibilità (Legge Stanca — L. 4/2004 aggiornata)

| Requisito                                 | Stato             | Azione                                                                        |
| ----------------------------------------- | ----------------- | ----------------------------------------------------------------------------- |
| WCAG 2.1 AA                               | ⛔ Non verificato | Audit accessibilità formale da eseguire (**Gap G6**)                          |
| Dichiarazione di accessibilità (obbl. PA) | ⛔ Mancante       | Da pubblicare su sito dopo audit (**Gap G6**)                                 |
| Componenti UI con `aria-label`            | ✅ Presente       | Ogni elemento interattivo ha `aria-label` esplicito (MD3 compliance)          |
| Contrasto colori MD3                      | ✅ Conforme       | Tema MUI v7 con token MD3 rispetta ratio 4.5:1                                |
| Navigazione da tastiera                   | ✅ Conforme       | Focus trap, skip-link, keyboard navigation in `src/components/accessibility/` |

### 4.3 Cloud PA

| Requisito                   | Stato              | Note                                                                                                                      |
| --------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| CSP qualificato AgID        | ⚠️ Da verificare   | Vercel non è nella lista CSP qualificati AgID. Deploy PA richiede migrazione a CSP qualificato o autorizzazione specifica |
| Residenza dati in Italia/EU | ⚠️ Parziale        | Dati utente: ✅ solo browser locale. Edge Function AI: ⚠️ Vercel US (Gap G12)                                             |
| SLA continuità servizio     | ⛔ Non documentato | Da formalizzare con SLA PA (uptime minimo 99.5%)                                                                          |

### 4.4 SPID / CIE

**Stato**: ⛔ Non integrato

L'autenticazione in produzione usa Google OAuth. Per deploy PA formale potrebbe essere richiesta integrazione SPID/CIE. Da valutare con PA committente.

---

## 5. Conformità D.Lgs. 82/2005 (CAC)

| Requisito CAC                               | Art.        | Stato               | Note                                                               |
| ------------------------------------------- | ----------- | ------------------- | ------------------------------------------------------------------ |
| PEC per comunicazioni ufficiali             | Art. 65     | ⛔ Non implementato | Non applicabile in fase pilota — da valutare per notifiche formali |
| Firma digitale qualificata (eIDAS)          | Art. 20     | ⛔ Non implementato | Export DOCX non è documento firmato digitalmente                   |
| Protocollo informatico                      | Art. 40-bis | ⛔ Non implementato | Documenti generati non protocollati automaticamente                |
| Documento informatico con valore probatorio | Art. 20     | ⚠️ Parziale         | Audit log con timestamp ISO ma senza firma crittografica           |

**Nota**: in fase pilota, il non-rispetto del CAC è tollerato se il sistema è usato come strumento di supporto e i documenti ufficiali sono prodotti con i sistemi PA esistenti. Obbligatorio per uso operativo pieno.

---

## 6. Conformità DPCM 3 dicembre 2013 (conservazione documentale)

**Stato**: ⛔ Piano conservazione da predisporre (Gap G10)

Requisiti DPCM applicabili:

- Piano di conservazione documentale: da redigere
- Conservatore accreditato AgID: da indicare
- Metadati obbligatori per documenti scolastici: da definire
- Audit log immodificabile: ✅ `enterpriseAuditLog` append-only (ma non ha firma crittografica)

**Nota**: in fase pilota, la conservazione DPCM 2013 è rilevante solo se il sistema genera documenti con valore amministrativo formale (verbali, certificazioni). Per uso didattico puro è consigliata ma non immediatamente bloccante.

---

## 7. Conformità MIUR linee guida

| Requisito                                    | Stato               | Evidenza                                                                     |
| -------------------------------------------- | ------------------- | ---------------------------------------------------------------------------- |
| Registro elettronico conforme (DPR 122/2009) | ✅ Conforme         | `registerService.ts`, `RegisterView`, struttura presenze/assenze/ritardi     |
| Privacy studenti minorenni                   | ⚠️ Parziale         | Dati locali, nessuna trasmissione terze parti; informativa famiglie mancante |
| Fascicolo studente digitale                  | ✅ Conforme         | `src/types/student.types.ts`, profilo studente completo                      |
| Continuità educativa tra ordini scolastici   | ⛔ Non implementato | Export strutturato dati studente tra scuole                                  |
| Backup e disaster recovery                   | ✅ Conforme         | Google Drive backup, export manuale, PWA service worker                      |
| Struttura UDA (DM 742/2017)                  | ✅ Conforme         | `UdaEditor` con competenze, fasi, prodotto; framework DigCompEdu             |

---

## 8. Sicurezza applicativa

### 8.1 OWASP Top 10

| Categoria OWASP                 | Stato            | Evidenza                                                                                                            |
| ------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| A01 Broken Access Control       | ✅ Affrontato    | Dati localStorage browser, nessun RBAC lato server necessario                                                       |
| A02 Cryptographic Failures      | ✅ Affrontato    | HTTPS, API key server-side only, nessuna chiave in bundle client                                                    |
| A03 Injection (XSS)             | ⚠️ Parziale      | 4/6 `dangerouslySetInnerHTML` sanitizzati; 2 aperti: `HelpModal` (4 occ.), `SmartImportModal` (1 occ.) — **Gap G8** |
| A03 Injection (SQL)             | ✅ N/A           | Nessun database relazionale server-side                                                                             |
| A04 Insecure Design             | ✅ Affrontato    | Privacy by design, minimizzazione dati, API proxy                                                                   |
| A05 Security Misconfiguration   | ✅ Affrontato    | CSP headers in `vercel.json`, HTTPS enforced                                                                        |
| A06 Vulnerable Components       | ⚠️ Da monitorare | `npm audit` periodico richiesto; `--legacy-peer-deps` in uso                                                        |
| A07 Auth Failures               | ✅ Affrontato    | Google OAuth, nessuna credenziale in localStorage                                                                   |
| A08 Software Integrity Failures | ✅ Affrontato    | CI/CD GitHub Actions, 4 workflow attivi                                                                             |
| A09 Logging Failures            | ✅ Affrontato    | `enterpriseAuditLog`, `tracing.ts` OTel, complianceDb                                                               |
| A10 SSRF                        | ✅ N/A           | Nessuna richiesta server-side a URL utente-forniti                                                                  |

### 8.2 Sanitizzazione HTML (dettaglio)

```
✅ DocumentViewerModal.tsx  — usa sanitizeHTML da securityUtils
✅ ImportStudentsModal.tsx  — usa sanitizeHtml da htmlSanitizer
✅ UseCaseCard.tsx          — usa sanitizeHtml da htmlSanitizer
✅ WorkflowGuide.tsx        — usa sanitizeHtml da htmlSanitizer
⚠️ HelpModal.tsx           — 4 occorrenze non sanitizzate  ← da correggere
⚠️ SmartImportModal.tsx    — 1 occorrenza non sanitizzata  ← da correggere
```

**Azione immediata richiesta**: sanitizzare `HelpModal` e `SmartImportModal` con `sanitizeHtml()` da `src/utils/htmlSanitizer.ts` prima del deploy PA.

---

## 9. Audit trail e tracciabilità operativa

| Componente                       | Funzione                                                                     | Stato             |
| -------------------------------- | ---------------------------------------------------------------------------- | ----------------- |
| `enterpriseAuditLog.ts`          | Log append-only tutte le azioni enterprise + `useCaseId` + `complianceDelta` | ✅ Attivo         |
| `complianceDb` (self-compliance) | Rolling log 1000 attività, 90 report, 500 alert con retention                | ✅ Attivo         |
| `src/tracing.ts` (OpenTelemetry) | Span AI, latenze, trace distribuito                                          | ✅ Attivo in prod |
| `useCaseTelemetry.ts`            | Telemetria per Use Case operativi (UC-P1 → UC-R5) con compliance delta       | ✅ Attivo (nuovo) |
| `auditEngine.ts`                 | Generazione report PA formale da ComplianceRuntimeResult                     | ✅ Attivo         |
| `AuditPAPanel.tsx`               | Simulatore audit con 5 scenari + export PDF                                  | ✅ Attivo         |

**Capacità di audit ex-post**: ✅ — il sistema può produrre un report PALiveAuditReport con findings ordinati per severità, note PA per ogni violazione, score per framework (GDPR/AI_ACT/AGID).

---

## 10. Valutazione di impatto — dati studenti minorenni

I dati degli studenti minorenni sono trattati con le seguenti misure:

- **Localizzazione**: esclusivamente browser del docente (localStorage/IndexedDB) — nessun server
- **Trasmissione AI**: solo dati aggregati e anonimizzati (tag, numero studenti, non anagrafiche)
- **Accesso**: solo il docente autenticato — nessuna condivisione automatica tra docenti
- **Retention**: artefatti AI: 365 giorni; dati primari: permanenti fino a cancellazione manuale
- **Backup**: Google Drive del docente (richiede consenso OAuth esplicito)

**Rischio residuo principale**: possibile inclusione implicita di dati studenti in prompt LLM se il docente inserisce nomi/cognomi nei testi liberi. Da mitigare con istruzione utente + validazione futura del prompt builder.

---

## 11. Findings e verdetto PA

### Findings bloccanti (deploy PA non consentito)

| ID      | Norma             | Descrizione                            | Azione                                    |
| ------- | ----------------- | -------------------------------------- | ----------------------------------------- |
| F-PA-01 | GDPR Art. 28      | DPA assente con Google e Anthropic     | Firmare DPA entro deploy                  |
| F-PA-02 | GDPR Art. 37      | DPO non nominato                       | PA committente nomina DPO                 |
| F-PA-03 | GDPR Art. 30      | RoPA formale assente                   | Redigere RoPA con supporto fornitore      |
| F-PA-04 | GDPR Art. 35      | DPIA non approvata da DPO              | DPO approva draft da `dpiaGenerator.ts`   |
| F-PA-05 | GDPR Art. 8+13    | Informativa studenti minorenni assente | Aggiungere workflow consenso genitoriale  |
| F-PA-06 | AgID / L.4/2004   | Dichiarazione accessibilità assente    | Audit WCAG 2.1 AA + dichiarazione AgID    |
| F-PA-07 | AI Act Art. 26(6) | Piano formazione PA assente            | Predisporre piano formazione obbligatoria |

### Findings non bloccanti (da risolvere post-deploy)

| ID      | Norma         | Descrizione                                           |
| ------- | ------------- | ----------------------------------------------------- |
| F-PA-08 | OWASP XSS     | `HelpModal` e `SmartImportModal` non sanitizzati      |
| F-PA-09 | GDPR Art. 33  | Notifica Garante non automatizzata                    |
| F-PA-10 | GDPR Art. 17  | Cancellazione dati su richiesta non disponibile da UI |
| F-PA-11 | DPCM 2013     | Piano conservazione documentale da predisporre        |
| F-PA-12 | AgID Cloud PA | Vercel non in lista CSP AgID — da valutare migrazione |

### Verdetto finale PA

```
STATO: ⚠️ CONDIZIONATO — NON PRONTO PER DEPLOY PA
MOTIVO: 7 findings bloccanti da risolvere
PUNTEGGIO CORRENTE: 57 / 100
PUNTEGGIO RICHIESTO: ≥ 80 / 100
AZIONI CRITICHE: G1 (DPA), G2 (DPO), G3 (RoPA), G4 (DPIA), G5 (informativa minori),
                 G6 (accessibilità), G7 (formazione PA)
```

---

_Dossier derivato da analisi diretta del codebase — commit `14aeb093`, 18 marzo 2026._
