# Piano di Test Programmatico: OrarioDoc AI

**Versione:** 1.0
**Data:** 2024-07-30
**Autore:** Frontend Engineer

---

## 🎯 1. Obiettivo Generale

L'obiettivo di questo piano di test è assicurare l'affidabilità, la stabilità, la coerenza funzionale e visiva dell'applicazione **OrarioDoc AI**. Ci proponiamo di:
*   Prevenire regressioni a seguito di nuove implementazioni, modifiche o refactoring del codice.
*   Garantire che le funzionalità critiche, in particolare quelle legate all'Intelligenza Artificiale e alla gestione dei dati, operino come previsto.
*   Mantenere un'esperienza utente di alta qualità, con particolare attenzione alla reattività, all'accessibilità e alla coerenza con il Material Design 3.

---

## 2. Ambito del Test

Questo piano copre i seguenti aspetti dell'applicazione:

*   **Funzionalità Core:** Gestione dell'orario, studenti, valutazioni, eventi, UDA, rubriche, note, registro.
*   **Funzionalità AI:** Assistente vocale live, generazione di contenuti (lezioni, verifiche, immagini, riassunti), analisi documenti (circolari, pedagogica, situazioni di partenza), suggerimenti proattivi, generazione temi.
*   **Persistenza & Sincronizzazione Dati:** Salvataggio locale (IndexedDB), backup e ripristino con Google Drive, gestione dei conflitti di sincronizzazione.
*   **Interfaccia Utente (UI) & User Experience (UX):** Navigazione tra le viste, reattività dei componenti (modali, liste, form), coerenza visiva dei temi e delle animazioni.
*   **Generazione Documenti:** Esportazione di report e documenti in formati PDF e DOCX.
*   **Utilities:** Funzioni di parsing (CSV, voti), sanitizzazione HTML, calcoli analitici.

---

## 3. Strategia di Test

Adotteremo una strategia di test a piramide, concentrandoci su test automatizzati a basso livello per rapidità e copertura, integrati da test a più alto livello.

### 3.1. Test Unitari (Vitest, @jest/globals)
*   **Cosa:** Verificano le singole unità di codice isolate (funzioni, classi, componenti React senza dipendenze complesse).
*   **Dove:** `utils/`, `services/`, `hooks/useAppEngine` e componenti React con logica di business interna.
*   **Esempio di Copertura Attuale:** `aiService.test.ts`, `googleDriveService.test.ts`, `backupAndIndexedDb.test.ts`, `evaluationUtils.test.ts`, `csvUtils.test.ts`, `analyticsUtils.test.ts`, `securityUtils.test.ts`, `suggestionUtils.test.ts`.

### 3.2. Test di Componente (Vitest, @testing-library/react)
*   **Cosa:** Verificano il rendering e l'interazione dei componenti React in isolamento o con dipendenze mockate.
*   **Dove:** `components/`.
*   **Esempio di Copertura Attuale:** `AnnualPlanningWizard.test.tsx`, `Calendar.test.tsx`, `EvaluationModule.test.tsx`, `LiveAssistant.test.tsx`, `SmartDocumentEditor.test.tsx`, `Timetable.test.tsx`.

### 3.3. Test di Integrazione (Vitest, @testing-library/react, Mocks)
*   **Cosa:** Verificano l'interazione tra più unità di codice o componenti, simulando flussi utente complessi.
*   **Dove:** `hooks/useAppEngine` (per l'integrazione di servizi), componenti che interagiscono pesantemente con altri (es. `ModalManager` che apre `LessonView` o `StudentProfile`).
*   **Mocks:** Utilizzo estensivo di `vi.mock` per isolare dalle API esterne (Google GenAI, Google Drive).

### 3.4. Test End-to-End (E2E) (Futuro)
*   **Cosa:** Simulano il comportamento completo dell'utente attraverso l'intera applicazione in un ambiente browser reale.
*   **Dove:** Tool come Playwright o Cypress.
*   **Stato:** Non ancora implementati in questo piano, ma raccomandati per la Fase 3 del piano di miglioramento.

### 3.5. Test Esplorativi/Accettazione Utente (Manuale)
*   **Cosa:** Eseguiti manualmente per verificare aspetti non facilmente automatizzabili o per "sentire" l'esperienza utente generale.
*   **Dove:** Tutti i moduli, con focus su UX/UI e flussi complessi.

---

## 4. Aree di Test Dettagliate e Priorità

### 4.1. Core Data Management (Priorità: Alta)
*   **Obiettivo:** Assicurare la corretta gestione del ciclo di vita (CRUD) di tutti gli oggetti dati.
*   **Scenari:**
    *   Creazione/modifica/eliminazione di studenti, lezioni, UDA, eventi, valutazioni.
    *   Validazione dei campi obbligatori.
    *   Corretto filtraggio e ordinamento nelle liste.
*   **Componenti Chiave:** `useAppEngine`, `StudentManager`, `EvaluationModule`, `UdaPlanner`, `Calendar`.

### 4.2. AI Functionality (Priorità: Alta)
*   **Obiettivo:** Verificare che l'AI generi risposte accurate e che i tool AI si integrino correttamente con i dati dell'app.
*   **Scenari:**
    *   **`LiveAssistant`:**
        *   Avvio/stop sessione e accuratezza della trascrizione.
        *   Esecuzione di *tutti* i tool dichiarati (es. `navigate`, `createCalendarEvent`, `addEvaluation`, `scheduleLesson`, `searchWeb`, `getStudentInfo`) con input vocali simulati.
        *   Corretta mappatura dei nomi degli studenti agli ID interni (es. "Metti 7 a Rossi" -> `studenteId` corretto).
        *   Feedback visivo (`AiThinkingGem`) durante l'elaborazione.
    *   **`Studio AI`:**
        *   Generazione di `summary`, `key_points`, `qa`, `flashcards`, `presentation`, `document`, `image`, `quiz` utilizzando la `KnowledgeBase`.
        *   Corretta gestione dell'`API Key` per i modelli Imagen/Veo.
    *   **`LessonView` (Analisi Pedagogica):** Verificare l'output di `analyzeLessonPedagogy`.
    *   **`Settings` (Theme Studio):** `generateThemeFromPrompt` con output JSON valido.
    *   **`SmartImportModal`:** `refactorProgrammazione` per ristrutturare documenti.
*   **Componenti Chiave:** `LiveAssistant`, `Studio`, `LessonView`, `Settings`, `SmartImportModal`, `aiService.ts`.

### 4.3. Data Persistence & Sync (Priorità: Alta)
*   **Obiettivo:** Garantire che i dati siano salvati localmente in modo affidabile e sincronizzati con Google Drive.
*   **Scenari:**
    *   `loadBackup`, `saveBackup`, `clearIndexedDB` e `saveKbContentToIndexedDB` (IndexedDB/LocalStorage).
    *   `initTokenClient`, `requestAccessToken`, `uploadBackup`, `downloadBackup`, `getBackupMetadata` (Google Drive).
    *   Ciclo completo di backup automatico (`autoSyncEnabled`).
    *   Corretta apparizione e logica di risoluzione del `SyncConflictModal`.
    *   Persistenza del `lastSyncTime` anche dopo i riavvii dell'app.
    *   Gestione degli errori di rete o API durante la sincronizzazione.
*   **Componenti Chiave:** `useAppEngine`, `backupService.ts`, `indexedDbService.ts`, `googleDriveService.ts`, `SyncConflictModal`, `Settings`.

### 4.4. Navigation (Priorità: Media)
*   **Obiettivo:** Assicurare un comportamento intuitivo e prevedibile della navigazione.
*   **Scenari:**
    *   `handleNavigate` e `handleBack` che rispettano lo stack di navigazione.
    *   Visibilità del pulsante "Indietro" (`Header`) basata sulla storia.
    *   Corretta selezione degli item del `Menu` principale.
    *   Navigazione contestuale (es. da `ClassSelection` a `ClassDashboard`).
    *   Conferma di uscita da `aula-session` se ci sono modifiche in bozza.
*   **Componenti Chiave:** `useAppEngine`, `Header`, `Menu`, `ViewManager`.

### 4.5. UI/UX Consistency (Priorità: Media)
*   **Obiettivo:** Verificare che l'interfaccia sia reattiva, coesa e rispetti il Material Design 3.
*   **Scenari:**
    *   `LessonView`: Rendering Mobile-First, reattività dopo `onUpdateLesson`.
    *   `StudentProfile`: Corretta visualizzazione dei tab, delle statistiche e dei contenuti dinamici.
    *   `EventModal`: Selezione visiva del tipo di evento.
    *   `AiThinkingGem`: Corretta visibilità durante l'elaborazione AI.
    *   Layout a griglia, tipografia, palette colori applicati globalmente.
    *   Animazioni e transizioni fluide dei modali.
*   **Componenti Chiave:** `LessonView`, `StudentProfile`, `EventModal`, `AiThinkingGem`, `ModalManager`, `theme.css`.

### 4.6. Document Generation (Priorità: Media)
*   **Obiettivo:** Assicurare che i documenti esportati siano completi, ben formattati e includano tutti i dati pertinenti.
*   **Scenari:**
    *   `StudentProfile`: Export DOCX/PDF con tutti i dettagli (overview, voti, competenze, note di ricevimento).
    *   `LessonView`: Export DOCX/PDF con obiettivi, svolgimento, materiali, adattamenti.
    *   `UdaPlanner`: Export DOCX/PDF per UDA (modalità docente e studente).
    *   `SmartDocumentEditor`: Export DOCX del contenuto dell'editor.
    *   `TestPreviewModal`: Export DOCX/PDF delle verifiche (con/senza soluzioni).
    *   Corretta conversione HTML -> DOCX (`generateHtmlDocxBlob`).
*   **Componenti Chiave:** `documentUtils.ts`, `StudentProfile`, `LessonView`, `UdaPlanner`, `SmartDocumentEditor`, `TestPreviewModal`.

### 4.7. Input/Output Utilities (Priorità: Media)
*   **Obiettivo:** Verificare la robustezza delle funzioni di utilità che elaborano dati.
*   **Scenari:**
    *   `csvUtils.ts`: `parseCSVWithHeaders` con vari formati CSV (virgole, punti e virgole, virgolette, righe vuote).
    *   `documentUtils.ts`: `extractTextFromFile` per diversi tipi di file (txt, docx, pdf).
    *   `analyticsUtils.ts`: `parseGrade` per tutti i formati di voto, calcoli per trend, radar e distribuzione.
    *   `securityUtils.ts`: `sanitizeHTML` per prevenire XSS con input malevoli.
*   **Componenti Chiave:** `csvUtils.ts`, `documentUtils.ts`, `analyticsUtils.ts`, `securityUtils.ts`.

---

## 5. Strumenti di Test

*   **Test Runner:** [Vitest](https://vitest.dev/)
*   **Test di Componente/Integrazione React:** [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
*   **Mocking:** `vi.mock` di Vitest (compatibile con la sintassi Jest) per isolare le dipendenze esterne (Google GenAI, Google Drive API, `navigator.mediaDevices`, `MediaRecorder`, `AudioContext`).
*   **Assertion Library:** `expect` globale (Vitest/Jest).
*   **DOM Environment:** `jsdom` (integrato in Vitest).

---

## 6. Processo di Esecuzione e Integrazione

*   **Esecuzione Automatica:** I test (`npm test`) verranno eseguiti in ambiente di Continuous Integration (CI) ad ogni push sui rami principali e per ogni Pull Request.
*   **Output Report:** I risultati dei test verranno stampati sulla console CI. In futuro, è auspicabile l'integrazione con un tool di reportistica più avanzato.
*   **Code Coverage:** Il report di copertura del codice verrà generato con Vitest per identificare le aree dell'applicazione meno testate e guidare l'espansione della suite di test.

---

## 7. Manutenzione del Piano

Questo piano è un documento vivo e verrà aggiornato regolarmente:
*   **Revisione Trimestrale:** Per allinearsi agli obiettivi di sviluppo e alle modifiche architetturali.
*   **Aggiornamento Post-Feature:** Dopo l'implementazione di ogni nuova funzionalità significativa, verranno aggiunti o modificati i test pertinenti.
*   **Feedback dagli Utenti:** I problemi segnalati dagli utenti in produzione (bug report) verranno analizzati per creare nuovi scenari di test, trasformando le regressioni in test automatici.

---