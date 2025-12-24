# 🗺️ DocenteDoc AI - Mappa Architetturale

> **Visualizzazione completa dell'ecosistema applicativo**

---

## 📐 ARCHITETTURA A LIVELLI

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                         │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Header     │  │  ViewManager │  │     Menu     │             │
│  │  (Top Bar)   │  │   (Router)   │  │ (Bottom Nav) │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      VISTE PRINCIPALI                         │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │  │
│  │  │  Home  │ │ Orario │ │Progetta│ │  Aula  │ │Analytics│    │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐                            │  │
│  │  │Valuta  │ │Settings│ │Studenti│                            │  │
│  │  └────────┘ └────────┘ └────────┘                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    MODALI E OVERLAYS                          │  │
│  │  • AiAdvisor           • LiveAssistant    • Studio           │  │
│  │  • KnowledgeBase       • OperationsCenter • HelpModal        │  │
│  │  • ImageAnalysis       • VideoAnalysis    • CircularAnalysis │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYER                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    useAppEngine Hook                          │  │
│  │  ┌────────────────────┐  ┌────────────────────┐              │  │
│  │  │   AppState         │  │   Actions          │              │  │
│  │  │  • user            │  │  • handleNavigate  │              │  │
│  │  │  • students        │  │  • handleBack      │              │  │
│  │  │  • lessons         │  │  • setUser         │              │  │
│  │  │  • slots           │  │  • addStudent      │              │  │
│  │  │  • evaluations     │  │  • addLesson       │              │  │
│  │  │  • udas            │  │  • saveEvaluation  │              │  │
│  │  │  • knowledgeBase   │  │  • ...             │              │  │
│  │  └────────────────────┘  └────────────────────┘              │  │
│  │  ┌────────────────────┐                                       │  │
│  │  │   Modals State     │                                       │  │
│  │  │  • isHelpOpen      │                                       │  │
│  │  │  • isStudioOpen    │                                       │  │
│  │  │  • ...             │                                       │  │
│  │  └────────────────────┘                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                           │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  aiService   │  │ driveService │  │ backupService│             │
│  │              │  │              │  │              │             │
│  │ • generate   │  │ • auth       │  │ • export     │             │
│  │ • analyze    │  │ • upload     │  │ • import     │             │
│  │ • suggest    │  │ • download   │  │ • restore    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │kbIndexedDb   │  │ gmailService │  │ aiPrompts    │             │
│  │              │  │              │  │              │             │
│  │ • addDoc     │  │ • send       │  │ • templates  │             │
│  │ • search     │  │ • fetch      │  │ • contexts   │             │
│  │ • delete     │  │              │  │              │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE LAYER                          │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ LocalStorage │  │  IndexedDB   │  │ Google Drive │             │
│  │   (Sync)     │  │   (Async)    │  │   (Cloud)    │             │
│  │              │  │              │  │              │             │
│  │ • app_state  │  │ • KB docs    │  │ • Backup.json│             │
│  │ • settings   │  │ • embeddings │  │              │             │
│  │ • theme      │  │ • files      │  │              │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Google GenAI │  │ Google Drive │  │ Google OAuth │             │
│  │   (Gemini)   │  │     API      │  │     2.0      │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUSSO DATI PRINCIPALE

```
┌─────────────┐
│    USER     │
│  Interacts  │
└──────┬──────┘
       │
       ↓
┌─────────────────────┐
│   UI Component      │
│  (es. Home.tsx)     │
└──────┬──────────────┘
       │ calls action
       ↓
┌─────────────────────┐
│  useAppEngine       │
│  actions.xxx()      │
└──────┬──────────────┘
       │
       ├─→ [Opzione A: Aggiorna solo stato locale]
       │   └→ setState() → re-render
       │
       ├─→ [Opzione B: Chiama servizio]
       │   ↓
       │   ┌──────────────────┐
       │   │   Service        │
       │   │ (es. aiService)  │
       │   └──────┬───────────┘
       │          │
       │          ├─→ API esterna (Gemini)
       │          ├─→ IndexedDB
       │          └─→ Google Drive
       │          │
       │          ↓
       │   ┌──────────────────┐
       │   │   Response       │
       │   └──────┬───────────┘
       │          │
       └──────────┘
       │
       ↓
┌─────────────────────┐
│  Update AppState    │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│   Re-render UI      │
└─────────────────────┘
```

---

## 🎯 ROUTING INTERNO (ViewManager)

```
┌─────────────────────────────────────────────────────────────┐
│                      ViewManager.tsx                         │
│                                                              │
│  view === 'home'       → <Home />                           │
│  view === 'orario'     → <Timetable />                      │
│  view === 'progetta'   → <ProgettazioneHub />               │
│  view === 'aula'       → <ClassroomView />                  │
│  view === 'valutazione'→ <EvaluationModule />               │
│  view === 'analytics'  → <AnalyticsHub />                   │
│  view === 'settings'   → <Settings />                       │
│  view === 'studenti'   → <StudentManager />                 │
│  view === 'lesson'     → <LessonView />                     │
│  view === 'student'    → <StudentProfile />                 │
│  view === 'uda'        → <UdaPlanner />                     │
│  view === 'calendar'   → <Calendar />                       │
│  view === 'register'   → <RegisterView />                   │
│  view === 'notebook'   → <NotebookView />                   │
│  view === 'consiglio'  → <ConsiglioClasse />                │
│  view === 'reportistica'→ <ReportisticaHub />               │
│  view === 'didattica_inclusiva' → <DidatticaInclusiva />   │
│  view === 'class_dashboard' → <ClassDashboard />            │
│  view === 'student_classroom' → <StudentClassroomView />    │
│                                                              │
│  + viewContext per passare parametri                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 ARCHITETTURA AI

```
┌─────────────────────────────────────────────────────────────┐
│                      AI ORCHESTRATION                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              aiService.ts (Orchestrator)               │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              aiClient.ts (API Wrapper)                 │ │
│  │  • Gestisce connessione Gemini                         │ │
│  │  • Rate limiting                                       │ │
│  │  • Error handling                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              aiPrompts.ts (Prompt Library)             │ │
│  │  • Template prompt per ogni funzionalità               │ │
│  │  • Context injection (studenti, KB, UDA)               │ │
│  │  • Few-shot examples                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Knowledge Base (RAG System)                  │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  kbIndexedDbService.ts                           │ │ │
│  │  │  • Indicizzazione documenti                      │ │ │
│  │  │  • Ricerca semantica                             │ │ │
│  │  │  • Chunking e embeddings                         │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Google Gemini API                         │ │
│  │  • gemini-2.5-flash (rapido)                          │ │
│  │  • gemini-3-pro-preview (esperto)                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

FUNZIONI AI DISPONIBILI:
┌─────────────────────────────────────────────────────────────┐
│ • generateLessonContent()      → Bozza lezione              │
│ • generateTestQuestions()      → Verifica + griglia         │
│ • generateUdaPhases()          → Fasi UDA                   │
│ • analyzeImage()               → OCR + interpretazione      │
│ • analyzeVideo()               → Trascrizione + riassunto   │
│ • analyzeCircular()            → Estrazione info circolari  │
│ • suggestGrades()              → Suggerimenti voti          │
│ • generateJudgment()           → Giudizio sintetico         │
│ • generateIdeas()              → Idee didattiche            │
│ • transcribeVoice()            → Speech-to-text             │
│ • chatWithContext()            → Chat contestuale           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 MODELLO DATI PRINCIPALE

```
AppState
├── user: UserProfile
│   ├── id
│   ├── displayName
│   ├── email
│   └── photoURL
│
├── students: Studente[]
│   ├── id
│   ├── nome, cognome
│   ├── classe
│   ├── dataNascita
│   └── history: StudentHistoryRecord[]
│
├── lessons: Record<id, Lezione>
│   ├── id
│   ├── classe, materia
│   ├── contenuto
│   ├── svolta
│   ├── tipoLezione
│   ├── obiettivi, compiti
│   └── materialiDidattici[]
│
├── slots: Record<key, Slot>
│   ├── giorno, ora
│   ├── classe, materia
│   └── lezioneId
│
├── evaluations: Valutazione[]
│   ├── id
│   ├── studenteId
│   ├── materia, data
│   ├── tipo, voto
│   └── argomento, note
│
├── udas: Uda[]
│   ├── id
│   ├── title, classe, materia
│   ├── introduction, finalProduct
│   ├── competencyIds[]
│   └── phases: UdaPhase[]
│
├── competencyEvaluations: CompetencyEvaluation[]
│   ├── studenteId
│   ├── competenzaId
│   ├── livelloId
│   └── evidenze
│
├── events: CalendarEvent[]
│   ├── id, title, date
│   ├── type (deadline, scrutinio, colloquio, ...)
│   └── linkedUdaId
│
├── knowledgeBase: KnowledgeBaseEntry[]
│   ├── id, fileName
│   ├── content, mimeType
│   ├── category
│   └── isGenerated
│
├── settings: TimetableSettings
│   ├── timeSlots, classi, disciplines
│   ├── schoolType, nomeInsegnante
│   ├── visualTheme, uiMode
│   ├── backupFolderId
│   └── aiSettings
│
├── themeState: ThemeState
│   ├── mode (light/dark/system)
│   ├── customizationName
│   └── customColors
│
└── notifiche: Notifica[]
    ├── id, titolo, messaggio
    ├── data, letta
    ├── type
    └── payload
```

---

## 🎨 DESIGN SYSTEM TOKENS

```
┌─────────────────────────────────────────────────────────────┐
│                    M3 EXPRESSIVE TOKENS                      │
│                                                              │
│  COLOR SYSTEM                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Primary Palette                                        │ │
│  │  --sys-primary                                         │ │
│  │  --sys-on-primary                                      │ │
│  │  --sys-primary-container                               │ │
│  │  --sys-on-primary-container                            │ │
│  │                                                        │ │
│  │ Secondary Palette (+ Tertiary, Error, ...)            │ │
│  │                                                        │ │
│  │ Surface Palette                                        │ │
│  │  --sys-surface                                         │ │
│  │  --sys-surface-variant                                 │ │
│  │  --sys-on-surface                                      │ │
│  │  --sys-outline                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  TYPOGRAPHY                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ --font-display-large    (57px / 64px)                  │ │
│  │ --font-headline-large   (32px / 40px)                  │ │
│  │ --font-title-large      (22px / 28px)                  │ │
│  │ --font-body-large       (16px / 24px)                  │ │
│  │ --font-label-large      (14px / 20px)                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ELEVATION                                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ --elevation-1  (0 2px 4px rgba(0,0,0,0.1))            │ │
│  │ --elevation-2  (0 4px 8px rgba(0,0,0,0.12))           │ │
│  │ --elevation-3  (0 8px 16px rgba(0,0,0,0.14))          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  SPACING                                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ --spacing-xs   (4px)                                   │ │
│  │ --spacing-sm   (8px)                                   │ │
│  │ --spacing-md   (16px)                                  │ │
│  │ --spacing-lg   (24px)                                  │ │
│  │ --spacing-xl   (32px)                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  SHAPE                                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ --shape-corner-xs   (4px)                              │ │
│  │ --shape-corner-sm   (8px)                              │ │
│  │ --shape-corner-md   (12px)                             │ │
│  │ --shape-corner-lg   (16px)                             │ │
│  │ --shape-corner-xl   (28px)                             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 SECURITY & PRIVACY ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    PRIVACY-FIRST DESIGN                      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              USER DEVICE (Browser)                     │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  LocalStorage (Encrypted with PIN)               │ │ │
│  │  │  • Voti, Registro, Anagrafica                    │ │ │
│  │  │  • NO dati sensibili in chiaro                   │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  IndexedDB                                       │ │ │
│  │  │  • Knowledge Base (documenti caricati)           │ │ │
│  │  │  • File pesanti                                  │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Service Worker                                  │ │ │
│  │  │  • Cache risorse statiche                        │ │ │
│  │  │  • Offline-first                                 │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↕                                 │
│                    (OAuth 2.0 HTTPS)                         │
│                            ↕                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         USER'S GOOGLE DRIVE (Personal Cloud)          │ │
│  │                                                        │ │
│  │  • Backup completo JSON cifrato                       │ │
│  │  • Utente = unico proprietario                        │ │
│  │  • NO server proprietari terzi                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↕                                 │
│                      (API HTTPS)                             │
│                            ↕                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         GOOGLE GEMINI API (Stateless)                 │ │
│  │                                                        │ │
│  │  • Nessuna persistenza dati utente                    │ │
│  │  • Prompt + Context → Response                        │ │
│  │  • NO training su dati utente                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

PRINCIPI CHIAVE:
✅ Local-First: Dati primari nel browser
✅ BYOC: Bring Your Own Cloud (Google Drive personale)
✅ Zero-Trust: Nessun server proprietario
✅ Encryption: PIN per dati sensibili
✅ Stateless AI: Gemini non memorizza conversazioni
```

---

## 🚀 DEPLOYMENT PIPELINE

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                      │
│                                                              │
│  LOCAL DEVELOPMENT                                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  npm run dev                                           │ │
│  │  ↓                                                     │ │
│  │  Vite Dev Server (HMR)                                │ │
│  │  ↓                                                     │ │
│  │  http://localhost:5173                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  BUILD                                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  npm run build                                         │ │
│  │  ↓                                                     │ │
│  │  TypeScript Compilation                               │ │
│  │  ↓                                                     │ │
│  │  Vite Bundle (dist/)                                  │ │
│  │  • index.html                                         │ │
│  │  • assets/index-[hash].js                             │ │
│  │  • assets/index-[hash].css                            │ │
│  │  • service-worker.js                                  │ │
│  │  • manifest.json                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  PREVIEW                                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  npm run preview                                       │ │
│  │  ↓                                                     │ │
│  │  Vite Preview Server                                  │ │
│  │  ↓                                                     │ │
│  │  http://localhost:4173                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  DEPLOYMENT                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Opzione A: Vercel                                     │ │
│  │  • vercel deploy                                       │ │
│  │  • Auto HTTPS, CDN, Edge Functions                    │ │
│  │                                                        │ │
│  │  Opzione B: Netlify                                    │ │
│  │  • netlify deploy --prod                              │ │
│  │  • Auto HTTPS, CDN, Serverless                        │ │
│  │                                                        │ │
│  │  Opzione C: GitHub Pages                              │ │
│  │  • gh-pages -d dist                                   │ │
│  │  • Free hosting, HTTPS                                │ │
│  │                                                        │ │
│  │  Opzione D: Firebase Hosting                          │ │
│  │  • firebase deploy                                    │ │
│  │  • Google Cloud CDN                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 TESTING ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                      TESTING STRATEGY                        │
│                                                              │
│  UNIT TESTS (Vitest)                                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  __tests__/                                            │ │
│  │  • utils.test.ts                                       │ │
│  │  • services.test.ts                                    │ │
│  │  • components.test.tsx                                 │ │
│  │                                                        │ │
│  │  npm run test                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  E2E TESTS (Playwright)                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  e2e/                                                  │ │
│  │  • login.spec.ts                                       │ │
│  │  • lesson-creation.spec.ts                             │ │
│  │  • evaluation.spec.ts                                  │ │
│  │                                                        │ │
│  │  npx playwright test                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  LINTING & FORMATTING                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  npm run lint    → ESLint                             │ │
│  │  npm run format  → Prettier                           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
┌─────────────────────────────────────────────────────────────┐
│                    RESPONSIVE DESIGN                         │
│                                                              │
│  MOBILE (< 768px)                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Single column layout                                │ │
│  │  • Bottom navigation bar                               │ │
│  │  • Touch targets ≥ 48px                                │ │
│  │  • Hamburger menu                                      │ │
│  │  • Swipe gestures                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  TABLET (768px - 1024px)                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Two column layout                                   │ │
│  │  • Side navigation (collapsible)                       │ │
│  │  • Larger cards                                        │ │
│  │  • Split views                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  DESKTOP (> 1024px)                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Three column layout                                 │ │
│  │  • Persistent side navigation                          │ │
│  │  • Hover states                                        │ │
│  │  • Keyboard shortcuts                                  │ │
│  │  • Multi-panel views                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 PERFORMANCE OPTIMIZATION

```
┌─────────────────────────────────────────────────────────────┐
│                  PERFORMANCE STRATEGIES                      │
│                                                              │
│  CODE SPLITTING                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Lazy loading componenti pesanti                     │ │
│  │  • Dynamic imports per viste                           │ │
│  │  • Chunk optimization (Vite)                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  CACHING                                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Service Worker cache                                │ │
│  │  • Browser cache (immutable assets)                    │ │
│  │  • LocalStorage/IndexedDB                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  RENDERING                                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • React.memo per componenti puri                      │ │
│  │  • useMemo/useCallback per calcoli pesanti            │ │
│  │  • Virtual scrolling liste lunghe                      │ │
│  │  • Debounce input utente                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ASSETS                                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Minification CSS/JS                                 │ │
│  │  • Tree shaking                                        │ │
│  │  • Image optimization                                  │ │
│  │  • Font subsetting                                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

**Documento creato:** 21 Dicembre 2025  
**Versione:** 1.0  
**Autore:** Antigravity AI Assistant
