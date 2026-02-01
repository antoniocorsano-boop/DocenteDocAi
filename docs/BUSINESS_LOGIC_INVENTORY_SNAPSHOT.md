# Inventario Logica di Business — DocenteDoc AI

Nota: questo documento è una "fotografia" della logica di business e delle regole di dominio che devono essere preservate prima di un refactor totale della UI. Ignora UI/CSS/componenti.

## 1. MODELLI DI DOMINIO

- **Student (Studente)**
  - file di origine: `docs/USE_CASES.md` (concettuale); possibile implementazione in `src/models/student.*` o `src/store`
  - descrizione: rappresenta un alunno con identificativi, profilo (BES/DSA flags), storico voti, competenze, note comportamentali e metadata privacy (consensi, cloud sync ownership).

- **Class (Classe / Gruppo)**
  - file di origine: `docs/USE_CASES.md` (concettuale); possibile implementazione in `src/models/class.*`
  - descrizione: contenitore di studenti, orario delle lezioni, UDA assegnate, calendario scrutini e relativi parametri di valutazione.

- **Lesson / Lezione**
  - file di origine: `docs/USE_CASES.md`; `src/components/Home.tsx` (view di riferimento)
  - descrizione: istanza di erogazione (data/ora), aula, attività svolte, presenze, timer, note vocali e trascrizioni, badge comportamentali.

- **UDA (Unità Didattica di Apprendimento)**
  - file di origine: `docs/USE_CASES.md`
  - descrizione: unità di pianificazione annuale con monte ore, obiettivi, competenze mappate, scadenze e materiali (Knowledge Base links).

- **Vote / Voto**
  - file di origine: `docs/USE_CASES.md`
  - descrizione: voto numerico associato a valutazione; può essere accompagnato da livello competenza qualitativo (es. A-D), peso e metadata (tipologia verifica, periodo).

- **Competency (Competenza / Rubrica)**
  - file di origine: `docs/USE_CASES.md`
  - descrizione: competenze mappate alle attività, con livelli (A..D o rubriche), mapping verso voti e calcolo medie/indicatori.

- **Attendance / Presenza**
  - file di origine: `docs/USE_CASES.md`
  - descrizione: registro presenza/assenza per le lezioni, estrazioni casuali e badge rapidi.

- **KnowledgeBase / Document Repository**
  - file di origine: `docs/USE_CASES.md`
  - descrizione: raccolta PDF / PTOF / Programmazioni caricati dall'insegnante e usati dal RAG / Studio AI.

- **AnalyticsEntity (Trend, Radar)**
  - file di origine: `docs/USE_CASES.md`
  - descrizione: oggetti usati per rappresentare trend temporali di voti, radar per competenze e report sintetici per colloqui/scrutini.

- **Export / Registro Bridge (JSON/DOCX)**
  - file di origine: `docs/USE_CASES.md`
  - descrizione: artefatti di esportazione (JSON per bridge, DOCX per report ufficiali) con mapping campi necessari per sistemi esterni.

## 2. SERVIZI DI BUSINESS

- **Scheduling / Timetable Service**
  - file di origine: `docs/USE_CASES.md` (Gantt, wizard annuale); prob. `src/services/schedule.*`
  - responsabilità: calcolo settimane disponibili, assegnazione monte ore UDA, rilevazione conflitti e timeline.
  - input/output: UDA definitions + calendar => schedule (set di lesson slots, warning su sovrapposizioni).
  - dipendenze: calendario locale, regole monte ore per UDA.

- **Lesson Management Service**
  - file di origine: `docs/USE_CASES.md`; UI in `src/components/Aula*` / `Home.tsx`
  - responsabilità: creare/finalizzare lezioni, registrare presenze, note, timer, estrazioni casuali.
  - input/output: lesson metadata => lesson record (persisted).
  - dipendenze: PersistenceService, Attendance logic, NoteService.

- **Attendance / Rollcall Service**
  - file di origine: `docs/USE_CASES.md`
  - responsabilità: segnare presenze, generare estrazioni casuali, badge comportamentali rapidi.
  - input/output: student list + attendance action => updated attendance records.
  - dipendenze: Lesson Management, Persistence.

- **Assessment / Valutazione Service**
  - file di origine: `docs/USE_CASES.md`
  - responsabilità: inserimento voti, associazione competenze (A..D), calcolo medie e griglie per scrutinio.
  - input/output: voti/competenze raw => voto medio, matrici competenze, suggerimenti per scrutinio.
  - dipendenze: Competency mapping, PersistenceService, ExportService.

- **Competency Mapping Service**
  - file di origine: `docs/USE_CASES.md`
  - responsabilità: mappare voti numerici a livelli competenza (e viceversa), gestire rubriche e scale.
  - input/output: voto numerico / osservazione => livello competenza e pesi.
  - dipendenze: ruleset definito nelle programmazioni / UDA metadata.

- **AI Orchestration Service (RAG / Studio AI / Test Generator)**
  - file di origine: `docs/USE_CASES.md` (Studio AI, RAG); prob. `src/services/ai/*` o `src/lib/ai*`
  - responsabilità: eseguire retrieval sulla KnowledgeBase (PTOF, Programmazioni, PDF), generare bozze di lezioni, verifiche, griglie di correzione e analisi di partenza.
  - input/output: prompt + KB context => bozza contenuti, quiz, riepiloghi, suggerimenti giudizi.
  - dipendenze: KnowledgeBase store, embedding/index store, LLM provider, RAG retriever, human-in-the-loop UI (per conferma).

- **Report / Export Service**
  - file di origine: `docs/USE_CASES.md` (Export DOCX, Registro Bridge JSON)
  - responsabilità: generare documenti ufficiali (DOCX/PDF) e JSON per integrazione con registry esterni.
  - input/output: class data, voti, competenze => DOCX/JSON export.
  - dipendenze: templating engine, PersistenceService.

- **Persistence / Sync / Backup Service (Local-first + Google Drive BYOC)**
  - file di origine: `docs/USE_CASES.md` ("Local-First", "Google Drive personal")
  - responsabilità: salvataggio locale, sincronizzazione opzionale su Google Drive personale, gestione conflitti, export/import offline.
  - input/output: data model => persisted file(s) + sync status.
  - dipendenze: browser storage APIs (IndexedDB / local files), Google Drive APIs (OAuth), offline-first conflict rules.

- **Notes & Voice Transcription Service**
  - file di origine: `docs/USE_CASES.md`
  - responsabilità: acquisizione note vocali, trascrizione, associazione a lezione/studenti.
  - input/output: audio => text transcript linked to lesson.
  - dipendenze: speech-to-text provider, PersistenceService.

- **Analytics Service**
  - file di origine: `docs/USE_CASES.md` (Analytics Hub)
  - responsabilità: calcoli trend, radar competenze, KPI classe/studente, generazione dataset per visualizzazioni e testo interpretativo via AI.
  - input/output: historical records => analytics models (timeseries, competence radar), narrative summaries.
  - dipendenze: PersistenceService, AI Orchestration (for interpretazioni).

- **Bridge Service (Registro Bridge / Copy-Paste Helper)**
  - file di origine: `docs/USE_CASES.md`
  - responsabilità: trasformare dati interni in formati compatibili con sistemi esterni (es. Argo/Spaggiari), fornire copy-friendly payload.
  - input/output: internal export => formatted JSON / clipboard data.
  - dipendenze: ExportService, rules per target esterno.

## 3. FLUSSI APPLICATIVI

- **Flusso: Gestione Lezione (Aula View)**
  - sequenza funzioni coinvolte (concettuale):
    1. Schedule Service: individua lesson slot attivo.
    2. Lesson Management: crea sessione lezione (start).
    3. Attendance Service: registra presenze (appello).
    4. Notes Service: registra note vocali / trascrizioni.
    5. Badge Service: segnala comportamenti rapidi.
    6. Lesson Management: finalizza lezione (close) -> persist.
    7. Bridge/Export (opzionale): esporta summary verso registro ufficiale.
  - stato modificato: lesson record (aperto->chiuso), attendance records, notes, badge events.

- **Flusso: Valutazione Continua**
  - sequenza:
    1. Assessment Service: inserimento voto/competenza.
    2. Competency Mapping: assegna livello competenza e aggiorna rubriche.
    3. Persistence: salva voto + metadata (tipo verifica, data).
    4. Analytics Service: aggiorna trends e radar.
    5. ExportService: (opzionale) include in report/print.
  - stato modificato: voti, competenze aggregate, analytics caches.

- **Flusso: Creazione Verifica / Test Generator (AI)**
  - sequenza:
    1. User/UI richiama AI Orchestration con contesto (classe, UDA, KB).
    2. RAG retriever: estrae documenti rilevanti dalla KnowledgeBase.
    3. LLM genera bozze di domande + griglia correzione.
    4. Human-in-the-loop: docente rivede/modifica.
    5. PersistenceService: salva verifica e griglia.
  - stato modificato: new assessment templates, KB usage logs.

- **Flusso: Pianificazione Annuale (Wizard / Gantt)**
  - sequenza:
    1. User definisce UDA e monte ore.
    2. Scheduling Service calcola timeline e settimane disponibili.
    3. Detect conflicts -> warning list.
    4. Persist schedule draft.
  - stato modificato: master schedule, UDA assignments.

- **Flusso: Analytics & Scrutinio**
  - sequenza:
    1. Analytics Service aggrega dati voti/competenze.
    2. AI Orchestration genera interpretazione narrativa e suggerimenti voti.
    3. Human-in-the-loop confeziona giudizi.
    4. ExportService genera PDF prospetto per scrutinio.
  - stato modificato: report files, suggested final grades.

## 4. LOGICA AD ALTO VALORE

- **Calcoli non banali**
  - Calcolo medie pesate per periodi e per tipologia verifica (es. sommatoria pesata da rubriche).
  - Aggregazione competenze: mappatura voto numerico -> livello A..D e aggregazione su UDA/classe con gestione di pesi e soglie.
  - Timeline/Gantt calculation: convertire monte ore UDA in settimane disponibile rispettando vincoli (festività, ore già occupate).

- **Regole didattiche**
  - Dualità Voto-Competenza: ogni voto numerico può avere corrispondente livello competenza; entrambi devono essere mantenuti sincronizzati e coerenti.
  - Human-in-the-loop AI: qualsiasi output AI rimane proposta finché non finalizzato dal docente (must preserve provenance + KB reference).
  - Privacy-first persistence: dati sensibili non devono essere sincronizzati automaticamente; utente decide destinazione (local-first, BYOC Google Drive).

- **Automatismi costruiti**
  - RAG su KnowledgeBase: retrieval contestuale dai materiali caricati per contestualizzare generazione verifiche e piani.
  - Test Generator che produce anche griglia di correzione automaticamente.
  - Bridge export format per facilitare copia incolla verso registri ufficiali.

## 5. ELEMENTI DA PRESERVARE ASSOLUTAMENTE

- KnowledgeBase + RAG pipeline: indice/embedding + retriever e mapping documenti -> LLM prompts (contesto docente).
- Mapping Voto <-> Competenza (rubriche) e regole per calcolo medie / soglie per scrutinio.
- Persistence offline-first + BYOC Google Drive sync (ownership dei dati).
- Export templates (DOCX, JSON) per registro ufficiale e scrutinio.
- Human-in-the-loop provenance: ogni output AI deve essere tracciabile (documenti sorgente usati, timestamp, versione modello).
- Finalizzazione lezione (apertura/chiusura) con tutte le entità collegate (presenze, note, badge) come singolo transaction record.
- Analytics aggregations e interpretazioni AI per colloqui e report (trend + radar).
- Voice note -> transcription linkage with lesson/student metadata.
- Tutte le regole relative a privacy e consenso (Local-first + BYOC) documentate in persistence workflows.

---

Versione: inventario generato come checklist di salvataggio.
Origine principale dei concetti: `docs/USE_CASES.md` (concettuale) e file UI letti (es. `src/components/Home.tsx`).
Se desideri, eseguo una scansione file-system completa e arricchisco ogni voce con path-esatti delle implementazioni (file/linee).

## 6. Mappatura implementazioni (file / range trovati)

Di seguito le implementazioni concrete riscontrate nel repository per le voci critiche dell'inventario. Ogni voce include il file e un range di righe utili per partire nella revisione.

- **KnowledgeBase / RAG pipeline**: [src/services/indexedDbService.ts](src/services/indexedDbService.ts#L1-L220) — gestione IndexedDB per contenuti pesanti KB (save/load/delete/clear). Vedi anche: [src/stores/useSystemStore.ts](src/stores/useSystemStore.ts#L1-L220) (store KB).

- **AI Orchestration / Prompts / Generazione contenuti**: [src/services/aiService.ts](src/services/aiService.ts#L1-L120) (core generation, lesson/quizzes, analysis), e [src/services/aiClient.ts](src/services/aiClient.ts#L1-L120) (client & retry logic). Prompts in [src/services/prompts/\*\*](src/services/prompts/planning.ts#L1-L200).

- **Persistence / Backups (local-first)**: [src/services/backupService.ts](src/services/backupService.ts#L1-L220) — backup su IndexedDB, salvataggi/restore; [src/services/indexedDbService.ts](src/services/indexedDbService.ts#L1-L320) (KB heavy content). Hook che coordina il salvataggio: [src/hooks/usePersistence.ts](src/hooks/usePersistence.ts#L1-L180).

- **Google Drive (BYOC sync + uploads)**: [src/services/googleDriveService.ts](src/services/googleDriveService.ts#L1-L220) — init token, uploadBackup, pick folder, uploadNotebookSource (NotebookLM integration). Vedi anche: [src/services/notebooklmService.ts](src/services/notebooklmService.ts#L1-L260).

- **Import / Export / Bridge**: Import routines: [src/services/importService.ts](src/services/importService.ts#L1-L220) (CSV/XLSX/JSON imports, mapping voti); Export/templates: [src/design-system/html-template-colors.ts](src/design-system/html-template-colors.ts#L1-L120) (HTML templates), export-related UI: [src/components/AddSourceModal.tsx](src/components/AddSourceModal.tsx#L1-L220) and export modal CSS in [src/layout.css](src/layout.css#L4842-L4890).

- **Assessment / Valutazione (store & prompts)**: Store e funzioni: [src/stores/useStudentStore.ts](src/stores/useStudentStore.ts#L1-L220) (evaluations, competencyEvals, add/update/import), [src/services/prompts/analysis.ts](src/services/prompts/analysis.ts#L1-L140) (AI analysis of evaluations). UI modals: [src/components/AddEvaluationModal.tsx](src/components/AddEvaluationModal.tsx#L1-L220), [src/components/AddProvaModal.tsx](src/components/AddProvaModal.tsx#L1-L220).

- **Rubriche / Competency mapping**: [src/stores/useAcademicStore.ts](src/stores/useAcademicStore.ts#L1-L140) (rubriche, saveRubrica), prompts/tools for extraction: [src/services/prompts/tools.ts](src/services/prompts/tools.ts#L1-L160).

- **Scheduling / Timetable / Gantt**: default settings & constants: [src/constants.ts](src/constants.ts#L1-L220) (DEFAULT_TIMETABLE_SETTINGS), scheduler entry points and hooks referenced in: [src/hooks/useAppEngine.ts](src/hooks/useAppEngine.ts#L1-L120) (handleExportData and related orchestration). Search points: `getLessonSequencePrompt` in AI service for planning flows.

- **Lesson management / Aula view**: component and orchestration hooks: [src/components/Home.tsx](src/components/Home.tsx#L1-L220) (home/aula entry), lesson orchestration in [src/hooks/useAppEngine.ts](src/hooks/useAppEngine.ts#L560-L980) (handlers: handleExportData, handleAiSuggestionFromHome, onAddLessonsWrapper).

- **Voice notes / Transcription (linkage)**: UI file inputs and notebook uploads: [src/components/AddSourceModal.tsx](src/components/AddSourceModal.tsx#L1-L220), upload helper: [src/services/notebooklmService.ts](src/services/notebooklmService.ts#L1-L260).

- **Analytics / Dashboard**: stores & metrics: [src/stores/DashboardStore.ts](src/stores/DashboardStore.ts#L1-L220) (metrics and aggregation helpers), analytics prompts: [src/services/prompts/analysis.ts](src/services/prompts/analysis.ts#L1-L140).

---

Se vuoi, procedo a:

- inserire questi riferimenti direttamente sotto ogni voce dell'inventario (commit + push su `legacy-freeze`), oppure
- generare un report CSV/JSON con tutte le mappature trovate per revisione automatica.

Fatto: prima scansione completata e riferimenti inseriti nel documento. Prossimo: aggiornare `docs/BUSINESS_LOGIC_INVENTORY.md` (se vuoi anche con link a snippet estratti) e committare.
