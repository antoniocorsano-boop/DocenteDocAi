# 📊 Analisi Completa: DocenteDoc AI

**Data Analisi:** 21 Dicembre 2025  
**Versione App:** 4.0.0 RC1 (Release Candidate)  
**Nome Progetto:** OrarioDoc AI / DocenteDoc AI

---

## 🎯 EXECUTIVE SUMMARY

**DocenteDoc AI** è un **ecosistema didattico intelligente** progettato per docenti della scuola italiana. Si tratta di una Progressive Web App (PWA) che combina:

- **Gestione completa del registro di classe** (orari, lezioni, valutazioni)
- **Intelligenza Artificiale integrata** (Google Gemini) per assistenza didattica
- **Privacy-first architecture** con storage locale e backup personale su Google Drive
- **Design System M3 Expressive** per un'esperienza utente moderna e fluida

---

## 🏗️ ARCHITETTURA TECNICA

### Stack Tecnologico

| Componente | Tecnologia | Versione |
|------------|------------|----------|
| **Frontend Framework** | React | 18.2.0 |
| **Linguaggio** | TypeScript | 5.2.2 |
| **Build Tool** | Vite | 5.2.0 |
| **AI Engine** | Google GenAI SDK | 0.1.1 |
| **Styling** | CSS Modulare Nativo | M3 Expressive |
| **Testing** | Vitest + Playwright | - |
| **PWA** | vite-plugin-pwa | 0.19.8 |

### Librerie Chiave

- **Generazione Documenti:** jsPDF, jspdf-autotable, docx, pdf-lib
- **Parsing Documenti:** mammoth, pdfjs-dist
- **File Management:** file-saver, react-dropzone

### Architettura dei Dati

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                 │
│              (React Components + Hooks)              │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────┐
│                  BUSINESS LOGIC LAYER                │
│         (Services: AI, Drive, Backup, DB)            │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────┐
│                   DATA PERSISTENCE                   │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ LocalStorage│  │  IndexedDB   │  │Google Drive│ │
│  │  (Sync)     │  │   (Async)    │  │  (Cloud)   │ │
│  │ Voti, Slots │  │ KB, Files    │  │  Backup    │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Strategia Storage:**
1. **LocalStorage:** Dati leggeri (voti, orari, anagrafica studenti) - accesso sincrono
2. **IndexedDB:** Dati pesanti (Knowledge Base, file caricati) - accesso asincrono
3. **Google Drive:** Backup completo JSON cifrato sul cloud personale dell'utente

---

## 🎨 DESIGN SYSTEM

### M3 Expressive Design Tokens

L'applicazione implementa il **Material Design 3 Expressive**, un sistema di design avanzato con:

- **Token System:** Variabili CSS per colori, tipografia, spaziature, elevazioni
- **Theme Customization:** 11 temi predefiniti + generatore AI di temi personalizzati
- **Dark Mode:** Supporto nativo con switch automatico/manuale
- **Responsive Design:** Mobile-first con breakpoint ottimizzati

### Componenti UI Principali

**Componenti Atomici (M3Components.tsx):**
- `ActionTile`: Tessera interattiva per azioni rapide
- `SectionHeader`: Intestazioni di sezione standardizzate
- `InfoCard`: Card informative con icone e badge

**Layout Components:**
- `Header`: Barra superiore con navigazione e notifiche
- `Menu`: Navigazione bottom bar (mobile-first)
- `ViewManager`: Router interno per gestione viste

---

## 📚 FUNZIONALITÀ CORE

### 1. 🗓️ GESTIONE ORARIO E LEZIONI

**Componenti Chiave:**
- `Timetable.tsx`: Griglia orario settimanale/giornaliero
- `Calendar.tsx`: Vista calendario mensile con eventi
- `LessonsPage.tsx`: Elenco lezioni con filtri
- `LessonView.tsx`: Dettaglio singola lezione

**Funzionalità:**
- ✅ Creazione orario personalizzato (giorni, ore, classi)
- ✅ Assegnazione lezioni a slot temporali
- ✅ Tipologie lezione: Teoria, Disegno, Laboratorio, Test, Verifica, Disposizione, Ricevimento
- ✅ Collegamento lezioni a UDA (Unità di Apprendimento)
- ✅ Materiali didattici allegati
- ✅ Link esterni (Meet, Classroom, ecc.)

### 2. 🎓 GESTIONE STUDENTI E VALUTAZIONI

**Componenti Chiave:**
- `StudentManager.tsx`: Anagrafica studenti
- `StudentProfile.tsx`: Profilo dettagliato studente
- `EvaluationModule.tsx`: Modulo valutazioni
- `UnifiedEvaluationModal.tsx`: Valutazione voto + competenza

**Funzionalità:**
- ✅ Anagrafica completa studenti (nome, cognome, classe, data nascita)
- ✅ Archiviazione storico studenti per anno scolastico
- ✅ Valutazioni multi-tipo: Scritto, Orale, Pratico, Test, Verifica
- ✅ Sistema voti: numerico (1-10) + giudizi (Ottimo, Distinto, Buono, Sufficiente, Insufficiente)
- ✅ Valutazione competenze (livelli A-D standard + DigCompEdu AI)
- ✅ Badge partecipazione (Positivo, Domanda, Collabora, Disturbo)
- ✅ Note comportamentali e osservazioni

### 3. 🧠 INTELLIGENZA ARTIFICIALE

**Modelli AI Disponibili:**
- **Gemini 2.5 Flash** (Rapido): Risposte immediate per task quotidiani
- **Gemini 3 Pro Preview** (Esperto): Analisi profonda per UDA e report complessi

**Componenti AI:**
- `AiAdvisor.tsx`: Consulente AI contestuale
- `LiveAssistant.tsx`: Assistente vocale live per aula
- `Studio.tsx`: Studio AI per generazione contenuti
- `IdeaGeneratorModal.tsx`: Generatore idee didattiche
- `TestGeneratorModal.tsx`: Generatore verifiche automatiche
- `ImageGeneratorModal.tsx`: Generatore immagini didattiche

**Funzionalità AI:**
- ✅ **RAG (Retrieval Augmented Generation):** L'AI legge la Knowledge Base caricata dal docente
- ✅ **Generazione Lezioni:** Bozze lezioni contestualizzate su classe e materia
- ✅ **Generazione Verifiche:** Test con griglia di correzione automatica
- ✅ **Analisi Circolari:** Estrazione automatica info da PDF circolari ministeriali
- ✅ **Analisi Immagini:** OCR e interpretazione immagini didattiche
- ✅ **Analisi Video:** Trascrizione e riassunto video didattici
- ✅ **Suggerimenti Proattivi:** L'app suggerisce la prossima azione logica
- ✅ **Assistente Vocale:** Interazione a mani libere (ottimizzato iOS/Safari)

### 4. 📖 KNOWLEDGE BASE (RAG System)

**Componente:** `KnowledgeBase.tsx`

**Funzionalità:**
- ✅ Upload documenti: PDF, DOCX, TXT
- ✅ Categorizzazione automatica (7 categorie predefinite)
- ✅ Indicizzazione locale per ricerca semantica
- ✅ Integrazione con AI per generazione contenuti contestualizzati

**Categorie KB:**
1. Programmazione & UDA
2. Normativa & Circolari
3. AI Deliverables (output NotebookLM)
4. Materiale Didattico
5. Valutazione & Griglie
6. Inclusione (BES/DSA)
7. Archivio Generale

### 5. 🎯 PROGETTAZIONE DIDATTICA

**Componenti Chiave:**
- `ProgettazioneHub.tsx`: Hub centrale progettazione
- `UdaPlanner.tsx`: Pianificatore UDA
- `AnnualPlanningWizard.tsx`: Wizard pianificazione annuale
- `ClassPlanningWizard.tsx`: Wizard pianificazione classe
- `CurriculumManager.tsx`: Gestione curriculum

**Funzionalità:**
- ✅ Creazione UDA (Unità di Apprendimento)
- ✅ Collegamento UDA a competenze (Europee + DigCompEdu)
- ✅ Timeline Gantt per visualizzazione temporale
- ✅ Fasi UDA con attività e durata
- ✅ Prodotto finale e criteri valutazione
- ✅ Export DOCX per documentazione ufficiale

### 6. 📊 ANALYTICS E REPORTISTICA

**Componenti Chiave:**
- `AnalyticsHub.tsx`: Dashboard analytics
- `ClassAnalytics.tsx`: Analytics per classe
- `ClassDashboard.tsx`: Dashboard classe
- `ReportisticaHub.tsx`: Hub reportistica
- `ConsiglioClasse.tsx`: Consiglio di classe

**Funzionalità:**
- ✅ Grafici trend voti per studente/classe
- ✅ Radar competenze
- ✅ Statistiche presenze/assenze
- ✅ Medie per materia
- ✅ Export PDF/DOCX report
- ✅ Prospetti scrutinio
- ✅ Generazione giudizi sintetici AI

### 7. 🏫 MODALITÀ AULA (Classroom Mode)

**Componenti Chiave:**
- `ClassroomView.tsx`: Vista aula principale
- `ClassroomTools.tsx`: Strumenti aula
- `VoiceNoteRecorder.tsx`: Registratore note vocali

**Funzionalità:**
- ✅ Timer visivo per attività
- ✅ Estrazione casuale studenti
- ✅ Appello rapido
- ✅ Note vocali con trascrizione
- ✅ Badge partecipazione rapidi
- ✅ Valutazione immediata
- ✅ Finalizzazione registro

### 8. 🎒 PORTALE STUDENTE

**Componenti Chiave:**
- `StudentLoginScreen.tsx`: Login studente
- `StudentClassroomView.tsx`: Vista classe studente
- `StudentWorkspace.tsx`: Workspace studente
- `TeacherInbox.tsx`: Inbox docente per consegne

**Funzionalità:**
- ✅ Login semplificato senza password (basato su anagrafica)
- ✅ Diario intelligente (solo lezioni svolte)
- ✅ Visualizzazione compiti assegnati
- ✅ Upload elaborati digitali
- ✅ Consegna diretta al docente

### 9. ⚙️ SETTINGS E PERSONALIZZAZIONE

**Componente:** `Settings.tsx`

**Funzionalità:**
- ✅ Configurazione profilo docente
- ✅ Gestione classi e materie
- ✅ Configurazione orario
- ✅ Personalizzazione tema (11 preset + AI generator)
- ✅ Modalità dark/light/system
- ✅ Backup Google Drive
- ✅ Import/Export dati
- ✅ PIN sicurezza
- ✅ Notifiche e promemoria

### 10. 🔄 CENTRO OPERATIVO

**Componente:** `OperationsCenter.tsx`

**Funzionalità:**
- ✅ Hub centralizzato per tutte le operazioni complesse
- ✅ Wizard guidati (Setup iniziale, Pianificazione annuale, Passaggio anno)
- ✅ Import studenti (CSV, manuale)
- ✅ Export dati (JSON, PDF, DOCX)
- ✅ Gestione backup
- ✅ Suggestion Engine: suggerimenti proattivi basati su stato app

---

## 🔐 PRIVACY E SICUREZZA

### Principi Architetturali

**1. Privacy-First:**
- ✅ Nessun server proprietario
- ✅ Dati salvati localmente nel browser
- ✅ Backup solo su Google Drive personale dell'utente
- ✅ Nessun tracking o analytics terze parti

**2. BYOC (Bring Your Own Cloud):**
- ✅ OAuth 2.0 per autenticazione Google
- ✅ Backup cifrato JSON
- ✅ Utente unico proprietario dei dati

**3. Sicurezza:**
- ✅ PIN di accesso opzionale
- ✅ Modalità colloquio (privacy-safe per genitori)
- ✅ Gestione conflitti sincronizzazione

---

## 🎓 FRAMEWORKS DIDATTICI SUPPORTATI

### 1. Competenze Chiave Europee 2018
- 8 competenze chiave con livelli A-D (Avanzato, Intermedio, Base, Iniziale)

### 2. DigCompEdu 3.0 (AI-Enhanced)
- 21 competenze digitali per docenti
- Livelli A1-C2 (Novizio → Pioniere)
- Focus su AI e tecnologie emergenti

### 3. Certificazione Competenze
- Sistema standard italiano
- Livelli con descrittori dettagliati
- Collegamento voti numerici ↔ livelli

---

## 🚀 WORKFLOW DIDATTICO INTEGRATO

### FASE 1: PROGETTAZIONE (Settembre-Ottobre)
```
Wizard Annuale → Creazione UDA → Upload KB → Pianificazione Timeline
```

### FASE 2: EROGAZIONE (Settimanale/Quotidiano)
```
Orario → Aula Mode → Lezione → Note/Voti → Finalizzazione
```

### FASE 3: VALUTAZIONE (Continuo)
```
Valutazione Unificata → Competenze → Osservazioni → Feedback
```

### FASE 4: ANALISI & REPORTING (Fine Periodo)
```
Analytics Hub → Grafici → Scrutinio → Export Report
```

---

## 📱 PROGRESSIVE WEB APP (PWA)

### Caratteristiche PWA

- ✅ **Installabile:** Può essere installata come app nativa
- ✅ **Offline-First:** Funziona senza connessione internet
- ✅ **Service Worker:** Caching intelligente delle risorse
- ✅ **Manifest:** Icone, splash screen, theme color
- ✅ **Responsive:** Ottimizzata per mobile, tablet, desktop

### Compatibilità

- ✅ Chrome/Edge (Desktop + Mobile)
- ✅ Safari iOS (con ottimizzazioni specifiche)
- ✅ Firefox
- ⚠️ Limitazioni Safari: Service Worker ridotto per sandbox AI Studio

---

## 🎯 CASI D'USO PRINCIPALI

### Scenario A: "L'Innovatore Digitale"
**Profilo:** Docente che usa tablet in classe

**Workflow:**
1. Entra in classe → Apre **Aula View**
2. Avvia **Timer** per attività di gruppo
3. Usa **Estrazione Casuale** per interrogare
4. Detta nota disciplinare con **Voice Notes**
5. Finalizza lezione → Export su registro ufficiale

### Scenario B: "Il Pianificatore Meticoloso"
**Profilo:** Docente che prepara tutto a casa su desktop

**Workflow:**
1. Carica PDF libro di testo in **Knowledge Base**
2. Usa **Studio AI** per generare 3 varianti di verifica
3. Pianifica UDA nel **Gantt** controllando settimane disponibili
4. Analizza grafici in **Analytics Hub** per relazione finale

### Scenario C: "Il Coordinatore di Classe"
**Profilo:** Docente coordinatore che prepara scrutini

**Workflow:**
1. Apre **Consiglio di Classe**
2. Visualizza tabellone voti completo
3. Genera prospetto PDF con medie
4. Usa AI per suggerimenti giudizi sintetici
5. Export DOCX per verbale

---

## 🔧 CONFIGURAZIONE E SETUP

### Prerequisiti
- Node.js (versione recente)
- Gemini API Key (Google AI Studio)
- Browser moderno (Chrome/Edge/Safari)

### Setup Iniziale

```bash
# 1. Installazione dipendenze
npm install

# 2. Configurazione API Key
# Editare .env.local e inserire:
GEMINI_API_KEY=your_api_key_here

# 3. Avvio sviluppo
npm run dev

# 4. Build produzione
npm run build

# 5. Preview build
npm run preview
```

### Wizard Primo Avvio

Al primo accesso, l'app guida l'utente attraverso:
1. **Creazione profilo:** Nome, cognome, email
2. **Configurazione scuola:** Nome istituto, città, tipo scuola
3. **Setup anno scolastico:** Date inizio/fine attività
4. **Prima classe:** Creazione prima classe e materie
5. **Orario base:** Configurazione slot orari

---

## 📊 METRICHE E STATISTICHE

### Complessità Codebase

| Metrica | Valore |
|---------|--------|
| **Componenti React** | ~130 file .tsx |
| **Servizi** | 10 moduli |
| **Hooks Custom** | 4 |
| **Stores** | 3 |
| **Linee CSS** | ~50.000+ |
| **Linee TypeScript** | ~30.000+ |

### Funzionalità Implementate

- ✅ **Gestione Orario:** Completa
- ✅ **Gestione Studenti:** Completa
- ✅ **Valutazioni:** Completa con competenze
- ✅ **AI Integration:** Avanzata (RAG, multi-modal)
- ✅ **Knowledge Base:** Completa
- ✅ **Analytics:** Avanzata con grafici
- ✅ **Export/Import:** Multipli formati
- ✅ **PWA:** Completa
- ✅ **Backup Cloud:** Google Drive integrato
- ✅ **Portale Studente:** Completo

---

## 🎨 DESIGN HIGHLIGHTS

### Identità Visiva

**Logo "Geometric Touch":**
- Design vettoriale interattivo
- Animazione "thinking" durante elaborazioni AI
- Varianti colore basate su tema
- **Easter Egg "Big Bang"**: Sequenza trasformativa attivabile con 5 click (vedi [LOGO_AND_EASTER_EGG.md](../LOGO_AND_EASTER_EGG.md))

**Palette Colori:**
- 11 temi predefiniti (M3 Default, Blue, Teal, Red/Brown, Green, Sunset, Forest, Ocean, Neon Cyber, AI Studio, Workspace)
- Generatore AI temi personalizzati
- Token system per coerenza

**Tipografia:**
- Font system stack ottimizzato
- Scale tipografica M3 (Display, Headline, Title, Body, Label)
- Supporto font personalizzati

### UX Patterns

**Mobile-First:**
- Bottom navigation bar
- Touch targets ≥48px
- Swipe gestures

**Contextual UI:**
- Interfaccia adattiva al contesto (es. Aula Mode con pulsanti grandi)
- ContextualStrip per suggerimenti contestuali
- Guidance Tips disattivabili

**Zero-FOUC:**
- Caricamento tema sincrono
- Prevenzione flash contenuti non stilizzati
- Skeleton screens

---

## 🔮 ROADMAP E SVILUPPI FUTURI

### Fase 6 (Pianificata)

Secondo `docs/PHASE_6_PLAN.md`:

1. **Collaboration Features:**
   - Condivisione UDA tra docenti
   - Co-progettazione in tempo reale

2. **Advanced Analytics:**
   - ML per predizione andamento studenti
   - Clustering automatico profili apprendimento

3. **Extended AI:**
   - Supporto modelli locali (privacy totale)
   - Multi-agent orchestration

4. **Integration Hub:**
   - Connettori nativi Argo/Spaggiari
   - API pubbliche per estensioni

---

## 🏆 VANTAGGI COMPETITIVI

### vs Registro Elettronico Tradizionale

| Caratteristica | DocenteDoc AI | Registro Tradizionale |
|----------------|---------------|----------------------|
| **Privacy** | ✅ Dati locali/Drive personale | ❌ Server terzi |
| **Offline** | ✅ Funziona senza internet | ❌ Richiede connessione |
| **AI Integrata** | ✅ Gemini nativo | ❌ Assente |
| **Personalizzazione** | ✅ Temi, layout, workflow | ❌ Rigido |
| **Velocità** | ✅ Istantanea (SPA) | ❌ Lenta (page reload) |
| **Competenze** | ✅ Integrate con voti | ❌ Separate o assenti |
| **UDA** | ✅ Pianificazione visiva | ❌ Form statici |
| **Costo** | ✅ Gratuito (solo API key) | ❌ Licenze scuola |

### vs Strumenti AI Generici (ChatGPT, Gemini Web)

| Caratteristica | DocenteDoc AI | AI Generica |
|----------------|---------------|-------------|
| **Contesto** | ✅ Conosce studenti, UDA, KB | ❌ Ogni volta da zero |
| **Workflow** | ✅ Integrato in app | ❌ Tool separato |
| **Dati** | ✅ Persistenti e strutturati | ❌ Conversazioni volatili |
| **Privacy** | ✅ Locale + Drive personale | ❌ Server AI provider |
| **Specializzazione** | ✅ Prompt ottimizzati scuola | ❌ Generica |

---

## 🎓 CONCLUSIONI

**DocenteDoc AI** rappresenta un **ecosistema didattico completo** che unisce:

1. **Gestione Tradizionale:** Tutte le funzionalità di un registro elettronico professionale
2. **Intelligenza Artificiale:** AI contestuale che conosce il docente, gli studenti e i contenuti
3. **Privacy Assoluta:** Architettura local-first con backup personale
4. **Design Moderno:** UX fluida e piacevole basata su M3 Expressive
5. **Flessibilità:** Adattabile a ogni ordine di scuola e stile didattico

### Target Utente Ideale

- **Docenti innovatori** che vogliono sperimentare AI in modo sicuro
- **Coordinatori di classe** che necessitano analytics avanzate
- **Docenti di sostegno** che lavorano su personalizzazione e inclusione
- **Formatori** che vogliono documentare e condividere pratiche

### Valore Aggiunto Unico

L'app non sostituisce il registro ufficiale, ma lo **integra e potenzia**, offrendo:
- Spazio di lavoro privato per bozze e sperimentazioni
- AI che impara dal contesto specifico del docente
- Analytics che il registro ufficiale non fornisce
- Workflow ottimizzati per la vita reale dell'insegnante

---

**Documento generato il:** 21 Dicembre 2025  
**Versione Analisi:** 1.0  
**Analista:** Antigravity AI Assistant
