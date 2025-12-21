# Analisi dei Casi d'Uso & Filosofia di Progetto

**OrarioDoc AI** non è un semplice registro elettronico parallelo. È un **Ecosistema di Produttività Didattica** (Educational Productivity Ecosystem) progettato per colmare il vuoto tra la burocrazia rigida dei registri ufficiali e la flessibilità necessaria nella vita reale dell'insegnante.

Questo documento analizza come l'app si inserisce nei flussi operativi quotidiani.

---

## 1. Filosofia e Chiavi di Lettura

Per comprendere OrarioDoc AI, bisogna analizzare tre pilastri fondamentali che guidano ogni scelta di design:

### 🛡️ Privacy-First & Cloud Personale
*   **Il Problema:** I docenti esitano a inserire dati sensibili (note personali, osservazioni comportamentali, bozze) su piattaforme terze sconosciute.
*   **La Soluzione OrarioDoc:**
    *   **Local-First:** L'app funziona interamente nel browser. Nessun dato lascia il dispositivo senza permesso.
    *   **BYOC (Bring Your Own Cloud):** La sincronizzazione non avviene su server proprietari, ma direttamente sul **Google Drive personale** dell'utente. L'utente è l'unico proprietario dei dati.

### 🤖 AI come "Copilota", non "Pilota"
*   **Il Problema:** L'AI generativa spesso produce contenuti generici o allucinazioni se non contestualizzata.
*   **La Soluzione OrarioDoc:**
    *   **RAG (Retrieval Augmented Generation):** L'AI non inventa, ma legge la **Knowledge Base** (PTOF, Programmazioni) caricata dal docente.
    *   **Human-in-the-loop:** L'AI propone (bozze lezioni, suggerimenti voti), il docente dispone e salva.

### 🎨 UX Cognitiva (M3 Expressive)
*   **Il Problema:** I software scolastici sono spesso complessi, lenti e visivamente affaticanti.
*   **La Soluzione OrarioDoc:**
    *   **Design Emozionale:** Uso di colori semantici, animazioni fluide e layout "Bento" per ridurre il carico cognitivo.
    *   **Contestualità:** L'interfaccia cambia in base al contesto (es. in "Aula" i pulsanti sono grandi per l'uso in piedi da tablet).

---

## 2. Il Ciclo Didattico Integrato (The Loop)

I casi d'uso sono organizzati secondo il flusso naturale dell'anno scolastico.

### FASE 1: PROGETTAZIONE (Settembre - Ottobre)
*Il momento della strategia, della definizione degli obiettivi e della struttura.*

| Caso d'Uso | Attività Docente | Funzionalità App | Vantaggio Competitivo |
| :--- | :--- | :--- | :--- |
| **Pianificazione Annuale** | Definire UDA, monte ore e scadenze. | **Wizard Annuale & Timeline Gantt** | Visualizzazione grafica delle sovrapposizioni e calcolo automatico delle settimane. |
| **Analisi Contesto** | Studiare la classe e i BES/DSA. | **Didattica Inclusiva & Situazione Partenza AI** | L'AI genera l'analisi della situazione di partenza basandosi sui tag inseriti. |
| **Creazione Materiali** | Preparare slide, riassunti e test. | **Studio AI & Knowledge Base** | Generazione automatica di Quiz e Flashcard dai PDF del libro di testo. |
| **Documentazione Ufficiale** | Scrivere la programmazione disciplinare. | **Reportistica Hub (Export DOCX)** | Creazione del documento formale pronto per il protocollo in un click. |

### FASE 2: EROGAZIONE (Settimanale/Quotidiano)
*Il momento dell'aula, della gestione live e dell'imprevisto.*

| Caso d'Uso | Attività Docente | Funzionalità App | Vantaggio Competitivo |
| :--- | :--- | :--- | :--- |
| **Gestione Lezione** | Fare l'appello, gestire la disciplina. | **Aula View & Strumenti (Timer/Estrazione)** | Tutto in una schermata. Badge comportamentali rapidi (gamification). |
| **Adattamento Inclusivo** | Modificare la lezione per BES/DSA. | **Live Assistant (Inclusione)** | Suggerimenti real-time su misure compensative per specifici alunni. |
| **Annotazioni Rapide** | Segnare note mentre si spiega. | **Note Vocali & Trascrizione** | Dettare note al volo senza interrompere il flusso della lezione. |
| **Imprevisti** | Supplenze o ore buche. | **Lezione Improvvisata & Idee AI** | Generazione immediata di una scaletta di lezione su un argomento a scelta. |

### FASE 3: VALUTAZIONE (Continuo)
*Il momento della misurazione e del feedback.*

| Caso d'Uso | Attività Docente | Funzionalità App | Vantaggio Competitivo |
| :--- | :--- | :--- | :--- |
| **Verifica Formativa** | Dare voti e feedback sulle competenze. | **Valutazione Unificata** | Inserimento simultaneo di Voto (numerico) e Livello Competenza (A-D). |
| **Osservazione Soft Skills** | Valutare autonomia e collaborazione. | **Modulo Osservazione** | Griglie preimpostate per valutare ciò che sfugge ai voti numerici. |
| **Creazione Verifiche** | Preparare il testo della verifica. | **Test Generator (Studio AI)** | L'AI crea la verifica e la griglia di correzione dai documenti caricati. |

### FASE 4: ANALISI & REPORTING (Fine Periodo)
*Il momento della sintesi, degli scrutini e dei colloqui.*

| Caso d'Uso | Attività Docente | Funzionalità App | Vantaggio Competitivo |
| :--- | :--- | :--- | :--- |
| **Monitoraggio Classe** | Capire come sta andando la classe. | **Analytics Hub** | Grafici a linea (trend) e radar (competenze) con interpretazione AI. |
| **Colloqui Genitori** | Mostrare l'andamento al genitore. | **Modalità Colloquio & Scheda Studente** | Vista privacy-safe (nasconde altri alunni) con grafici chiari per i genitori. |
| **Scrutinio** | Proporre voti e giudizi. | **Consiglio di Classe Wizard** | Calcolo medie, generazione PDF prospetto e suggerimento giudizi sintetici con AI. |
| **Passaggio Dati** | Copiare i voti sul registro ufficiale. | **Registro Bridge (JSON)** | Export formattato per estensioni browser o copia-incolla intelligente. |

---

## 3. Matrice Funzionalità / Attori

| Modulo | Docente (Standard) | Docente (Sostegno/Potenziamento) | Coordinatore di Classe | Studente (Kiosk Mode) |
| :--- | :--- | :--- | :--- | :--- |
| **Orario** | Gestione turni e lezioni | Pianificazione interventi mirati | Visione d'insieme | Visione lezioni svolte |
| **Progetta** | Creazione UDA e Lezioni | Adattamento materiali (Studio AI) | Verifica coerenza programmazioni | - |
| **Aula** | Registro e Note | Osservazione comportamenti | - | Check-in (futuro) |
| **Valutazione** | Voti e Competenze | Griglie differenziate (Rubriche) | Analisi tabellone voti | - |
| **Analytics** | Trend materia | Monitoraggio singolo alunno | Reportistica per Consiglio | - |
| **Settings** | Backup Drive e Temi | - | - | - |

---

## 4. Scenari d'Uso Reali (Personas)

### Scenario A: "L'Innovatore Digitale"
*Usa l'app su Tablet in classe.*
1.  Entra in classe, apre **Aula View**.
2.  Avvia il **Timer** per un'attività di gruppo.
3.  Usa **Estrazione Casuale** per interrogare.
4.  Detta una nota disciplinare con la voce.
5.  A fine lezione, clicca "Finalizza" e usa il **Bridge** per copiare tutto su Argo/Spaggiari.

### Scenario B: "Il Pianificatore Meticoloso"
*Usa l'app su Desktop a casa.*
1.  Carica il PDF del libro di testo nella **Knowledge Base**.
2.  Usa **Studio AI** per generare 3 varianti di verifica scritta.
3.  Pianifica le UDA nel **Gantt** controllando le settimane disponibili.
4.  Analizza i grafici in **Analytics Hub** per preparare la relazione finale.

---

## 5. Vantaggi Strategici (Perché OrarioDoc AI?)

1.  **Indipendenza:** Non dipendi dalla connessione internet della scuola (funziona Offline).
2.  **Velocità:** Nessun caricamento lento tra le pagine. Interfaccia reattiva immediata.
3.  **Intelligenza Contestuale:** L'AI conosce i tuoi studenti e i tuoi documenti. Non devi ripetere il contesto ogni volta (es. "Fammi una verifica per la 3A" -> L'AI sa già chi sono e cosa hanno studiato).
4.  **Visione Olistica:** Unisce Voti (quantitativo) e Competenze (qualitativo) in un'unica vista, cosa che molti registri elettronici separano rigidamente.
