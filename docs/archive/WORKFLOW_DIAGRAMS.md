# 🔄 DocenteDoc AI - Diagrammi di Flusso Workflow

> **Visualizzazione dei flussi operativi principali dell'applicazione**

---

## 1️⃣ WORKFLOW: CREAZIONE LEZIONE CON AI

```
┌─────────────────────────────────────────────────────────────┐
│ USER: Clicca "Crea Lezione" da Orario/Progettazione         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ UI: Apre CreateLessonFromAiModal                            │
│ • Input: classe, materia, argomento                         │
│ • Opzione: usa Knowledge Base                               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ USER: Inserisce dati e clicca "Genera con AI"               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPONENT: Chiama aiService.getLessonSuggestion()           │
│ • Passa: classe, materia, argomento, KB content             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ AI SERVICE: aiService.ts                                    │
│ 1. Costruisce prompt con aiPrompts.getLessonSuggestionPrompt│
│ 2. Inietta contesto KB se disponibile                       │
│ 3. Chiama Gemini API (gemini-3-flash-preview)               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ GEMINI API: Elabora richiesta                               │
│ • Analizza KB documents                                     │
│ • Genera: contenuto, obiettivi, compiti, adattamenti        │
│ • Restituisce JSON strutturato                              │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ AI SERVICE: cleanAndParseJson()                             │
│ • Pulisce risposta da markdown                              │
│ • Valida JSON                                               │
│ • Restituisce oggetto Lezione parziale                      │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPONENT: Mostra anteprima lezione generata                │
│ • USER può modificare campi                                 │
│ • USER clicca "Salva"                                       │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ ACTIONS: actions.onScheduleLesson()                         │
│ 1. Crea nuovo ID lezione                                    │
│ 2. Aggiunge a lessons state                                 │
│ 3. Se slot specificato, collega lezione a slot              │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ PERSISTENCE: usePersistence hook                            │
│ • Salva in LocalStorage                                     │
│ • Trigger backup automatico (se abilitato)                  │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ UI: Chiude modale, aggiorna vista orario                    │
│ ✅ Lezione creata e visibile                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ WORKFLOW: KNOWLEDGE BASE RAG

```
┌─────────────────────────────────────────────────────────────┐
│ USER: Apre Knowledge Base, clicca "Carica Documento"        │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ UI: File picker (PDF, DOCX, TXT)                            │
│ USER: Seleziona file                                        │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPONENT: KnowledgeBase.tsx                                │
│ 1. Legge file con FileReader                                │
│ 2. Se PDF: usa pdfjs-dist per estrarre testo                │
│ 3. Se DOCX: usa mammoth per convertire                      │
│ 4. Se TXT: legge direttamente                               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPONENT: Crea KnowledgeBaseEntry                          │
│ • id: kb-{timestamp}                                        │
│ • fileName, content, mimeType                               │
│ • category: auto-detect o manuale                           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ ACTIONS: actions.setKnowledgeBase()                         │
│ • Aggiunge entry a knowledgeBase array                      │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ INDEXEDDB SERVICE: saveKbContentToIndexedDB()               │
│ • Salva content pesante in IndexedDB                        │
│ • Mantiene solo metadata in LocalStorage                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ UI: Documento visibile in lista KB                          │
│ ✅ Pronto per essere usato da AI                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ UTILIZZO KB IN AI (RAG):                                    │
│                                                              │
│ USER: Genera lezione/verifica con AI                        │
│         ↓                                                    │
│ AI SERVICE: Recupera KB entries rilevanti                   │
│         ↓                                                    │
│ Costruisce prompt: "Basandoti su: {KB_CONTENT}..."          │
│         ↓                                                    │
│ GEMINI: Genera risposta contestualizzata                    │
│         ↓                                                    │
│ ✅ Output AI informato da documenti reali del docente       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3️⃣ WORKFLOW: VALUTAZIONE STUDENTE

```
┌─────────────────────────────────────────────────────────────┐
│ USER: Da StudentProfile o EvaluationModule                  │
│ Clicca "Aggiungi Valutazione"                               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ UI: Apre UnifiedEvaluationModal                             │
│ Form con:                                                    │
│ • Studente (pre-selezionato)                                │
│ • Materia, Data, Tipo (Scritto/Orale/...)                   │
│ • Voto (numerico o giudizio)                                │
│ • Competenza (opzionale)                                    │
│ • Livello competenza (A-D)                                  │
│ • Argomento, Note                                           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ USER: Compila form e clicca "Salva"                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPONENT: Validazione input                                │
│ • Voto valido? (1-10 o giudizio)                            │
│ • Data valida?                                              │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ ACTIONS: actions.handleAddEvaluation()                      │
│ 1. Crea Valutazione object                                  │
│    • id: eval-{timestamp}                                   │
│    • studenteId, materia, data, tipo, voto                  │
│ 2. Aggiunge a evaluations array                             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ SE competenza selezionata:                                  │
│ ACTIONS: Crea anche CompetencyEvaluation                    │
│ • studenteId, competenzaId, livelloId                       │
│ • Aggiunge a competencyEvals array                          │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ PERSISTENCE: Salva in LocalStorage                          │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ UI: Aggiorna StudentProfile e Analytics                     │
│ • Ricalcola media voti                                      │
│ • Aggiorna grafici trend                                    │
│ • Aggiorna radar competenze                                 │
│ ✅ Valutazione registrata                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4️⃣ WORKFLOW: BACKUP GOOGLE DRIVE

```
┌─────────────────────────────────────────────────────────────┐
│ USER: Settings → Backup → "Connetti Google Drive"           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ ACTIONS: handleConnectDrive()                               │
│ 1. Chiama initTokenClient() con OAuth config                │
│ 2. Apre popup Google OAuth                                  │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ GOOGLE OAUTH: USER autorizza app                            │
│ • Scope: drive.file (solo file creati dall'app)             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ CALLBACK: Riceve access token                               │
│ • Salva in memoria (non persistente)                        │
│ • Aggiorna driveSyncState.isAuthenticated = true            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ USER: Clicca "Sincronizza su Drive"                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ ACTIONS: handleSyncToDrive()                                │
│ 1. Controlla conflitti (remote vs local timestamp)          │
│ 2. Se conflitto → mostra SyncConflictModal                  │
│ 3. Altrimenti procede                                       │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ DRIVE SERVICE: uploadBackup()                               │
│ 1. Serializza tutto lo stato app in JSON                    │
│    • dataState (students, lessons, evaluations...)          │
│    • settingsState (settings, theme, ai)                    │
│    • uiState (backup, sync, navigation)                     │
│ 2. Converte dismissedSuggestions Set → Array               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ GOOGLE DRIVE API:                                           │
│ 1. Cerca file esistente "OrarioDoc_Backup.json"             │
│ 2. Se esiste → UPDATE (PATCH)                               │
│ 3. Se non esiste → CREATE (POST)                            │
│ 4. Upload in cartella configurata o root                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ SUCCESS:                                                     │
│ • Aggiorna driveSyncState.lastSyncTime                      │
│ • Mostra toast "Backup completato!"                         │
│ ✅ Dati al sicuro su Drive personale                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ RESTORE DA DRIVE:                                           │
│                                                              │
│ USER: Clicca "Ripristina da Drive"                          │
│         ↓                                                    │
│ DRIVE SERVICE: downloadBackup()                             │
│         ↓                                                    │
│ Scarica JSON da Drive                                       │
│         ↓                                                    │
│ ACTIONS: loadFromBackup()                                   │
│ • Ripristina tutti gli store Zustand                        │
│ • Salva KB in IndexedDB                                     │
│         ↓                                                    │
│ ✅ App ripristinata allo stato salvato                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 5️⃣ WORKFLOW: MODALITÀ AULA (CLASSROOM MODE)

```
┌─────────────────────────────────────────────────────────────┐
│ USER: Da Orario, clicca su slot con lezione                 │
│ Seleziona "Inizia Lezione"                                  │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ ACTIONS: handleStartClassroom()                             │
│ 1. Crea RegisterEntry draft                                 │
│    • slotKey, lessonId, classe, materia                     │
│    • studentAttendance: {} (vuoto)                          │
│    • status: 'draft'                                        │
│ 2. Salva in draftRegister                                   │
│ 3. Naviga a 'aula-session' view                             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ UI: ClassroomView.tsx                                       │
│ Layout:                                                      │
│ • Header: Classe, Materia, Timer                            │
│ • Lista studenti con quick actions                          │
│ • Toolbar: Timer, Estrazione, Note Vocali                   │
│ • Footer: Finalizza/Annulla                                 │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ USER ACTIONS durante lezione:                               │
│                                                              │
│ A) APPELLO                                                  │
│    • Clicca icona presenza/assenza studente                 │
│    • Aggiorna draftRegister.studentAttendance               │
│                                                              │
│ B) BADGE PARTECIPAZIONE                                     │
│    • Clicca badge (Positivo/Domanda/Collabora/Disturbo)     │
│    • Crea Valutazione tipo partecipazione                   │
│                                                              │
│ C) VALUTAZIONE RAPIDA                                       │
│    • Clicca voto studente                                   │
│    • Apre QuickEvaluationModal                              │
│    • Salva valutazione                                      │
│                                                              │
│ D) NOTE VOCALI                                              │
│    • Clicca microfono                                       │
│    • Registra audio                                         │
│    • Trascrizione automatica (Web Speech API)               │
│    • Salva in notebookNotes                                 │
│                                                              │
│ E) TIMER ATTIVITÀ                                           │
│    • Avvia timer (es. 15 min)                               │
│    • Countdown visibile                                     │
│    • Alert al termine                                       │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ USER: Clicca "Finalizza Lezione"                            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPONENT: Validazione                                      │
│ • Appello fatto?                                            │
│ • Contenuto lezione confermato?                             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ ACTIONS:                                                     │
│ 1. Marca lezione.svolta = true                              │
│ 2. Sposta RegisterEntry da draft a finalized               │
│ 3. Aggiorna lessons state                                   │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ UI: Torna a vista Orario                                    │
│ • Slot ora mostra lezione svolta (checkmark)                │
│ ✅ Registro compilato e salvato                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6️⃣ WORKFLOW: ANALYTICS E GRAFICI

```
┌─────────────────────────────────────────────────────────────┐
│ USER: Naviga a Analytics Hub                                │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPONENT: AnalyticsHub.tsx                                 │
│ 1. Legge evaluations, competencyEvals, students             │
│ 2. Filtra per classe/materia selezionata                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ CALCOLO METRICHE:                                           │
│                                                              │
│ A) MEDIA VOTI PER STUDENTE                                  │
│    evaluations                                              │
│      .filter(e => e.studenteId === student.id)              │
│      .map(e => RATING_TO_VALUE[e.voto])                     │
│      .reduce(avg)                                           │
│                                                              │
│ B) TREND TEMPORALE                                          │
│    evaluations                                              │
│      .sort(by date)                                         │
│      .map(e => {x: date, y: voto})                          │
│                                                              │
│ C) COMPETENZE RADAR                                         │
│    competencyEvals                                          │
│      .groupBy(competenzaId)                                 │
│      .map(livello => punteggio)                             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ RENDERING GRAFICI:                                          │
│ • LineChart (components/charts/LineChart.tsx)               │
│   → Trend voti nel tempo                                    │
│                                                              │
│ • RadarChart (components/charts/RadarChart.tsx)             │
│   → Competenze su assi multipli                             │
│                                                              │
│ • BarChart (components/charts/BarChart.tsx)                 │
│   → Distribuzione voti per materia                          │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ OPZIONALE: AI INSIGHTS                                      │
│ USER: Clicca "Analizza con AI"                              │
│         ↓                                                    │
│ AI SERVICE: Invia dati analytics a Gemini                   │
│         ↓                                                    │
│ GEMINI: Genera insights testuali                            │
│ • "Lo studente mostra miglioramento in..."                  │
│ • "Attenzione a calo in..."                                 │
│         ↓                                                    │
│ UI: Mostra insights sotto grafici                           │
└─────────────────────────────────────────────────────────────┘
```

---

**Documento creato:** 21 Dicembre 2025  
**Versione:** 1.0
