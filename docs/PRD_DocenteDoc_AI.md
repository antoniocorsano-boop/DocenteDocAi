Status: APPROVATO  
Versione: 1.1  
Data: 2026-01  

# Product Requirements Document (PRD) - DocenteDoc AI

## Stato di Verità del Prodotto

Questo PRD è derivato esclusivamente dall'analisi del codice sorgente, documentazione tecnica e roadmap presenti nel repository. Le funzionalità sono classificate come:

- **Verificate**: Componenti e servizi direttamente osservati nel codice
- **Assunte**: Funzionalità dedotte da naming, commenti, TODO o roadmap, ma non direttamente implementate al momento dell'analisi
- **Future**: Funzionalità pianificate ma non ancora avviate

L'analisi è basata su file chiave: README.md, roadmap, documentazione API, package.json, componenti React principali e tipi TypeScript. Non sono state inventate funzionalità non presenti nel codice.

---

## 1. Visione del Prodotto

DocenteDoc AI è un assistente AI intelligente e local-first progettato specificamente per docenti italiani, che combina gestione didattica completa con capacità generative avanzate basate su Google Gemini. L'applicazione offre un'esperienza utente moderna e accessibile, compliant con Material Design 3, focalizzata sull'ottimizzazione del lavoro docente attraverso automazione intelligente e interfaccia intuitiva.

## 2. Problema da Risolvere

I docenti italiani affrontano sfide significative nella gestione quotidiana delle attività scolastiche:

- **Carico amministrativo elevato**: Gestione manuale di classi, studenti, valutazioni, pianificazione didattica e documentazione
- **Difficoltà nella creazione di contenuti**: Generazione di verifiche, materiali didattici e analisi richiede tempo significativo
- **Limitazioni tecnologiche**: Strumenti esistenti spesso non integrati, non locali e non ottimizzati per il contesto scolastico italiano
- **Accessibilità e usabilità**: Interfacce non sempre intuitive, specialmente per docenti meno esperti di tecnologia
- **Privacy e sicurezza**: Necessità di controllo locale dei dati sensibili degli studenti

DocenteDoc AI risolve questi problemi fornendo una suite integrata che automatizza compiti ripetitivi e genera contenuti personalizzati, mantenendo il controllo locale dei dati.

## 3. Target Utenti e Personas

### Persona Primaria: Docente di Scuola Secondaria
- **Profilo**: Insegnante di materie scientifiche o umanistiche in scuole superiori (14-19 anni)
- **Esigenze**: Gestione classi 20-25 studenti, pianificazione annuale, valutazioni periodiche, creazione materiali didattici
- **Pain Points**: Tempo limitato per attività amministrative, necessità di contenuti differenziati, integrazione con registri elettronici
- **Goal**: Ottimizzare tempo di preparazione didattica, migliorare qualità materiali, facilitare comunicazione con studenti/genitori

### Persona Secondaria: Docente di Scuola Media
- **Profilo**: Insegnante scuola media (11-14 anni) con focus su didattica inclusiva
- **Esigenze**: Gestione piani individualizzati, valutazione competenze, attività orientamento
- **Pain Points**: Complessità gestione PEI/PDP, documentazione certificazioni competenze

### Persona Terziaria: Coordinatore Didattico
- **Profilo**: Responsabile dipartimento o coordinatore di classe
- **Esigenze**: Visione d'insieme classi multiple, analytics performance, pianificazione curricolare
- **Pain Points**: Aggregazione dati da fonti multiple, reporting istituzionale

## 4. Use Case Principali

### UC1: Pianificazione Didattica Annuale
**Attore**: Docente  
**Scenario**: Pianificazione UDA (Unità Didattiche di Apprendimento) per anno scolastico  
**Flusso**: Creazione curriculum → definizione obiettivi → generazione timeline Gantt → assegnazione risorse

### UC2: Gestione Valutazioni e Competenze
**Attore**: Docente  
**Scenario**: Valutazione periodica studenti con focus competenze  
**Flusso**: Inserimento valutazioni → analisi performance → generazione giudizi → certificazione competenze

### UC3: Generazione Contenuti Didattici
**Attore**: Docente  
**Scenario**: Creazione verifica personalizzata  
**Flusso**: Selezione corpus → configurazione parametri → generazione AI → preview e modifica

### UC4: Analisi e Reportistica
**Attore**: Docente/Coordinatore  
**Scenario**: Analisi performance classe  
**Flusso**: Raccolta dati → generazione analytics → export report → condivisione

### UC5: Interazione Studente-Docente
**Attore**: Studente  
**Scenario**: Consegna compito digitale  
**Flusso**: Accesso portale studente → upload elaborato → docente correzione → feedback AI

## 5. Funzionalità

### Verificate (Direttamente Osservate nel Codice)

#### Core Didattico
- **Gestione Classi e Studenti**: Componenti per CRUD classi e studenti presenti (es. StudentManager, ClassHub)
- **Pianificazione Lezioni**: Componenti per creazione lezioni e UDA (es. LessonsPage, UdaPlanner)
- **Valutazioni**: Sistema di valutazioni osservato (es. EvaluationModule, CompetencyEvaluationModal)
- **Registro Elettronico**: Meccanismi di import/export e placeholder di integrazione dedotti da commenti e componenti (es. RegisterImportDialog)

#### AI Assistant
- **Generatore Verifiche**: Servizio AI per generazione quiz osservato (aiService.ts)
- **Generatore Immagini**: Componente ImageGeneratorModal presente
- **Analisi Circolari**: CircolareAnalysisModal e servizio associato
- **Live Assistant**: AssistantModal e chat conversazionale
- **Knowledge Base**: Componente KnowledgeBase e servizi di archiviazione

#### Analytics e Reportistica
- **Dashboard Analytics**: AnalyticsDashboard e AnalyticsHub componenti
- **Report Export**: Servizi di generazione PDF/DOCX (documentUtils.ts)
- **Timeline Gantt**: GanttBar e TimelineView componenti

#### Student Portal
- **Autenticazione Studente**: StudentLoginScreen presente
- **Diario di Classe**: StudentClassroomView osservato
- **Upload Compiti**: HomeworkSubmission componente
- **Teacher Inbox**: TeacherInbox per correzione

#### Personalizzazione e Cloud
- **Theme Studio AI**: m3-theme-generator.ts osservato
- **Google Drive Sync**: Servizi di backup dedotti da configurazione
- **Hybrid Knowledge Base**: Supporto file via IndexedDB confermato

### Assunte (Dedotte da Naming, Commenti, TODO, Roadmap)

#### UX e Accessibilità (In Corso Secondo Roadmap)
- **Modali Full-Screen Mobile**: Assunto da roadmap, componenti modal presenti ma ottimizzazione mobile dedotta
- **Focus Management**: Assunto da audit accessibilità pianificato
- **Feedback Visivo**: Snackbar e notifiche osservate, ma persistenza assunta
- **Microcopy**: Uniformazione testi dedotta da roadmap

#### Testing e Qualità
- **Suite E2E Completa**: Playwright configurato, test osservati
- **Audit Accessibilità**: WCAG compliance assunta da roadmap
- **Resilienza AI**: Retry logic dedotto da servizi AI
- **Performance**: Ottimizzazioni assunte da configurazione Vite

### Future (Pianificate ma Non Avviate)

#### Integrazioni Avanzate
- **API Registri Dirette**: Placeholder in registerService.ts
- **Collaborazione Multi-Docente**: Non osservata nel codice attuale
- **Integrazione LMS**: Non implementata

#### AI Enhancement
- **Personalizzazione Avanzata**: Non osservata
- **Analisi Predictiva**: Non implementata
- **Content Curation**: Non presente

#### Mobile App Nativa
- **PWA Ottimizzata**: PWA base osservata, ottimizzazioni assunte
- **Offline-First**: Local-first architecture presente, espansioni future

## 6. Flussi Utente Principali

### Flusso 1: Setup Iniziale
1. Accesso applicazione → caricamento dati demo
2. Configurazione profilo docente
3. Import studenti da registro elettronico
4. Setup AI (configurazione API key Google Gemini)
5. Personalizzazione tema

### Flusso 2: Pianificazione Didattica
1. Accesso "Progettazione Hub"
2. Creazione/selezione classe
3. Definizione UDA con wizard guidato
4. Assegnazione timeline Gantt
5. Generazione materiali automatica

### Flusso 3: Lezione Giornaliera
1. Accesso vista classe
2. Registrazione presenze
3. Creazione lezione impromptu
4. Assegnazione compiti
5. Valutazione veloce studenti

### Flusso 4: Valutazione Periodica
1. Accesso "Valutazioni"
2. Selezione periodo/studente
3. Inserimento voti/competenze
4. Generazione giudizi AI-assistiti
5. Export documentazione

### Flusso 5: Interazione Studente
1. Studente accede portale
2. Visualizza diario classe
3. Carica elaborato
4. Docente riceve notifica
5. Correzione con feedback AI

## 7. Requisiti Non Funzionali

### Performance
- **Caricamento**: Tempi di caricamento ottimizzati per web app
- **Responsività**: Interfaccia fluida e reattiva
- **Offline**: Funzionalità core operative senza connessione

### Sicurezza e Privacy
- **Local-First**: Dati sensibili sempre locali, sync opzionale
- **Crittografia**: Backup cloud crittografati end-to-end
- **GDPR Compliance**: Controllo dati, diritto oblio, minimizzazione dati

### Accessibilità
- **WCAG 2.1 AA**: Contrasto colori, navigazione tastiera, screen reader
- **Mobile-First**: Touch targets appropriati, gesture intuitive
- **Inclusività**: Supporto disabilità motorie/cognitive

### Scalabilità
- **Classi**: Supporto per classi multiple
- **Studenti**: Gestione di dataset studenti significativi
- **File**: Knowledge base estensibile

### Affidabilità
- **Uptime**: Alta disponibilità come PWA
- **Recovery**: Auto-recovery da crash, backup automatici
- **Error Handling**: Graceful degradation, user feedback chiaro

## 8. Vincoli Tecnici e di Design

### Architetturali
- **Local-First Architecture**: IndexedDB + LocalStorage prioritari
- **Component-Driven**: Atomic Design pattern
- **Type-Safe**: TypeScript end-to-end
- **Progressive Enhancement**: Core funzionante senza JS avanzato

### Tecnologici
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Material Design 3 tokens only (no hardcoded values)
- **State**: Zustand (modular stores)
- **AI**: Google Gemini 1.5 Pro
- **Storage**: IndexedDB (dati), LocalStorage (config)
- **Deployment**: Vercel (CDN, Edge functions)

### Design System
- **Material Design 3**: Compliance 100% obbligatoria
- **No Hardcoded Values**: Solo token MD3 (`var(--md-sys-*)`)
- **Expressive Variant**: Glassmorphism, dynamic colors, high-radius corners
- **Typography Scale**: MD3 typescale completa
- **Color System**: Dynamic palette adattiva

### Browser Support
- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **PWA**: Installabile, offline-capable

## 9. Obiettivi di Successo

### Utente
- **Soddisfazione**: Migliorare l'esperienza docente attraverso automazione
- **Completamento Task**: Facilitare il completamento dei flussi didattici principali
- **Risparmio Tempo**: Ridurre il tempo dedicato ad attività amministrative
- **Adozione**: Aumentare l'utilizzo attivo dell'applicazione

### Prodotto
- **Performance**: Mantenere elevati standard di performance e accessibilità
- **Affidabilità**: Minimizzare errori e crash, gestire gracefully le API AI
- **Engagement**: Supportare sessioni di lavoro prolungate
- **Retention**: Mantenere utenti attivi nel tempo

### Business
- **Crescita**: Espandere la base utenti docente
- **Conversion**: Evoluzione verso modelli di monetizzazione sostenibile
- **Supporto**: Ridurre il carico di supporto tecnico

## 10. Rischi e Assunzioni

### Rischi Tecnici
- **API Limits Google Gemini**: Rate limiting potrebbe impattare generazione contenuti
- **Browser Storage Limits**: IndexedDB potrebbe saturare su dataset molto grandi
- **Offline Synchronization**: Conflitti sync potrebbero corrompere dati locali

### Rischi di Prodotto
- **Regolamentazione Privacy**: Cambi GDPR potrebbero richiedere modifiche architetturali
- **Concorrenza**: Nuovi competitor AI potrebbero erodere market share
- **Dipendenza Google**: Cambi policy Gemini potrebbero interrompere funzionalità

### Rischi Utente
- **Adoption Resistance**: Docenti tradizionalisti potrebbero resistere cambiamento
- **Skill Gap**: Curva apprendimento potrebbe essere troppo ripida per alcuni utenti
- **Data Migration**: Import da sistemi legacy potrebbe perdere informazioni

### Assunzioni
- **AI Reliability**: Gemini manterrà qualità generazione attuale
- **Browser Evolution**: PWA APIs continueranno evoluzione positiva
- **Regulatory Stability**: Nessun cambio significativo privacy laws italiano
- **User Technical Literacy**: Utenti hanno competenze base informatica
- **Network Availability**: Accesso internet disponibile per sync (non obbligatorio)

## 11. Fuori Scope

### Non Implementati
- **Multi-Tenant**: Nessuna gestione istituti scolastici multi-docente
- **Real-Time Collaboration**: Condivisione simultanea documenti
- **Third-Party Integrations**: Solo Google Drive, no altri cloud providers
- **Mobile Native Apps**: Solo PWA, no app store native
- **Advanced Analytics**: No machine learning predittivo complesso
- **Internationalization**: Solo lingua italiana supportata

### Esclusi per Compliance
- **Data Sharing**: Nessuna condivisione dati studenti tra istituti
- **External APIs**: Solo servizi Google ufficiali (Drive, Gemini)
- **Monetization Features**: No advertising, solo subscription model futuro

## 12. Uso del Documento

Questo PRD:
- è il riferimento per decisioni di prodotto e roadmap
- NON è una specifica di implementazione
- NON garantisce disponibilità immediata delle funzionalità

Questo PRD è la source of truth del progetto DocenteDoc AI.
Ogni refactor, feature o modifica:

deve essere coerente con il PRD

non può introdurre funzionalità fuori scope

deve indicare se una feature è Verificata, Assunta o Future

Se una richiesta viola il PRD, segnalalo esplicitamente.

---

*Questo PRD sarà aggiornato trimestralmente basato su feedback utenti e evoluzione roadmap. Versione 1.1 - Gennaio 2026*