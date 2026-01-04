# DocenteDoc AI - Documentazione API Interna

Questa documentazione è destinata ai manutentori del progetto e descrive i principali servizi e utility che compongono la logica di business dell'applicazione.

## 1. AI Service (`src/services/aiService.ts`)

Il servizio AI gestisce tutte le interazioni con i modelli Google Gemini. Utilizza `aiClient.ts` per le chiamate di basso livello e `aiPrompts.ts` per la generazione dei prompt.

### Funzioni Principali

#### `chatWithAi(aiSettings, messages, context?)`
Gestisce una conversazione multi-turno con il modello.
- **Input**: `messages` (array di `ChatMessage`), `context` (opzionale, per istruzioni di sistema).
- **Output**: `Promise<ChatMessage>`.

#### `getPIPSuggestion(aiSettings, student, evaluations, competencyEvaluations, competencies, section)`
Genera suggerimenti per il Piano di Inclusione (PEI/PDP).
- **Input**: Dati dello studente, valutazioni e la sezione specifica (es. 'puntiDiForza' o 'obj-Matematica').
- **Output**: `Promise<string>`.

#### `getProactiveSuggestions(aiSettings, state)`
Analizza lo stato globale (studenti, voti, UDA) per generare suggerimenti proattivi nella dashboard.
- **Output**: `Promise<AiSuggestion[]>`.

#### `analyzeCircularDocument(aiSettings, source)`
Analizza il testo di una circolare scolastica per estrarre informazioni chiave.
- **Output**: `Promise<CircularAnalysisResult>`.

#### `generateQuiz(aiSettings, corpus, config)`
Genera un quiz (scelta multipla, vero/falso, aperte) basandosi su un testo di riferimento (corpus).
- **Output**: `Promise<GeneratedQuiz>`.

### Utility Interne
- `cleanAndParseJson<T>(text)`: Estrae e valida oggetti JSON dalle risposte Markdown dei modelli.
- `ensureString(content)`: Garantisce che l'input per l'AI sia sempre una stringa valida.

---

## 2. Document Utils (`src/utils/documentUtils.ts`)

Gestisce la generazione di documenti PDF e DOCX, oltre all'estrazione di testo da file caricati. Utilizza librerie pesanti caricate dinamicamente (`pdf-lib`, `docx`, `jspdf`, `mammoth`).

### Generazione Documenti

#### `generateHomeworkPdf(lesson, settings)`
Crea una scheda compiti e materiali in formato PDF per gli studenti.
- **Output**: `Promise<Blob>`.

#### `generateCertificazioneCompetenzePdf(student, competencyData, settings)`
Genera il documento ufficiale di certificazione delle competenze (formato A4).
- **Output**: `Promise<Blob>`.

#### `generateHtmlDocxBlob(htmlContent, title?)`
Converte contenuto HTML in un file Word (.docx).
- **Output**: `Promise<Blob>`.

#### `generateStudentProfilePdf(student, evaluations, competencyEvaluations, settings)`
Genera un report completo del profilo studente con grafici di performance (tramite `evaluationUtils`).

### Estrazione Testo

#### `extractTextFromFile(file)`
Funzione universale per estrarre testo da `.txt`, `.pdf`, `.docx`, `.json`, ecc.
- Utilizza `pdfjs-dist` per i PDF e `mammoth` per i DOCX.
- **Output**: `Promise<string>`.

### Utility File
- `saveAs(blob, name)`: Triggera il download del browser per un Blob.
- `viewPdfInNewTab(blob)`: Apre un PDF in una nuova scheda del browser.
- `blobToBase64Parts(blob)`: Converte un Blob in stringa Base64 per l'invio all'AI.

---

## 3. Register Service (`src/services/registerService.ts`)

Gestisce l'integrazione con i registri elettronici italiani (Argo, Spaggiari, Axios).

### Funzioni
- `getExportGuidance(provider)`: Restituisce istruzioni testuali su come esportare i dati dal registro specifico.
- `syncDirect(config)`: (Placeholder) Predisposizione per sincronizzazione API diretta.

---

## 4. Import Service (`src/services/importService.ts`)

Gestisce il parsing e la mappatura dei dati importati da file esterni.

### Funzioni
- `parseFile(file)`: Rileva automaticamente il formato (CSV, Excel, JSON) e lo processa.
- `getRawData(file)`: Estrae header e righe grezze per permettere all'utente di effettuare il mapping manuale delle colonne.
- `mapRawData(data, mapping)`: Converte i dati grezzi mappati in oggetti `Studente` e `Valutazione`.
