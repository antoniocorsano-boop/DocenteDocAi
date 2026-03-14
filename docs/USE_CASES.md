# Analisi dei Casi d'Uso & Filosofia di Progetto

**DocenteDoc AI** non è un semplice registro elettronico parallelo. È un **Ecosistema di Produttività Didattica** (Educational Productivity Ecosystem) progettato per colmare il vuoto tra la burocrazia rigida dei registri ufficiali e la flessibilità necessaria nella vita reale dell'insegnante.

Questo documento analizza come l'app si inserisce nei flussi operativi quotidiani.

---

## 1. Filosofia e Chiavi di Lettura

Per comprendere DocenteDoc AI, bisogna analizzare tre pilastri fondamentali che guidano ogni scelta di design:

### 🛡️ Privacy-First & Cloud Personale

- **Il Problema:** I docenti esitano a inserire dati sensibili (note personali, osservazioni comportamentali, bozze) su piattaforme terze sconosciute.
- **La Soluzione DocenteDoc:**
  - **Local-First:** L'app funziona interamente nel browser. Nessun dato lascia il dispositivo senza permesso.
  - **BYOC (Bring Your Own Cloud):** La sincronizzazione non avviene su server proprietari, ma direttamente sul **Google Drive personale** dell'utente. L'utente è l'unico proprietario dei dati.

### 🤖 AI come "Copilota", non "Pilota"

- **Il Problema:** L'AI generativa spesso produce contenuti generici o allucinazioni se non contestualizzata.
- **La Soluzione DocenteDoc:**
  - **RAG (Retrieval Augmented Generation):** L'AI non inventa, ma legge la **Knowledge Base** (PTOF, Programmazioni) caricata dal docente.
  - **Human-in-the-loop:** L'AI propone (bozze lezioni, suggerimenti voti), il docente dispone e salva.

### 🎨 UX Cognitiva (MD3 Expressive)

- **Il Problema:** I software scolastici sono spesso complessi, lenti e visivamente affaticanti.
- **La Soluzione DocenteDoc:**
  - **Design Emozionale:** Uso di colori semantici, animazioni fluide e layout "Bento" per ridurre il carico cognitivo.
  - **Contestualità:** L'interfaccia cambia in base al contesto (es. in "Aula" i pulsanti sono grandi per l'uso in piedi da tablet).
  - **Mobile-first floating nav:** Su schermi ≤840px header e barra di navigazione flottano con margini e angoli arrotondati (MD3 expression), evitando sovrapposizioni con il contenuto principale.

---

## 2. Il Ciclo Didattico Integrato (The Loop)

I casi d'uso sono organizzati secondo il flusso naturale dell'anno scolastico.

### FASE 1: PROGETTAZIONE (Settembre - Ottobre)

_Il momento della strategia, della definizione degli obiettivi e della struttura._

| Caso d'Uso                   | Attività Docente                                 | Funzionalità App                                                                            | View                       |
| :--------------------------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------ | :------------------------- |
| **Pianificazione Annuale**   | Definire UDA, monte ore e scadenze.              | **Wizard Annuale & Timeline Gantt**                                                         | `progettazione-hub`, `uda` |
| **Gestione UDA**             | Creare, modificare, duplicare UDA come template. | **UDA Planner** — Gantt, competenze, fasi, valutazione. Duplica come template con un click. | `uda`                      |
| **Gestione Lezioni**         | Strutturare le lezioni collegate alle UDA.       | **Lezioni**                                                                                 | `lessons`                  |
| **Curriculum**               | Mappare gli obiettivi curricolari.               | **Curriculum Manager**                                                                      | `curriculum-manager`       |
| **Analisi Contesto**         | Studiare la classe e i BES/DSA.                  | **Didattica Inclusiva** — generazione AI situazione di partenza.                            | `didattica-inclusiva`      |
| **Creazione Materiali**      | Preparare slide, riassunti e test.               | **Studio AI** — quiz, flashcard e verifiche dai PDF caricati.                               | `studio`                   |
| **Knowledge Base**           | Caricare PTOF, libri di testo, circolari.        | **Knowledge Base** — indicizzazione documenti per RAG.                                      | `knowledge-base`           |
| **Rubriche Valutative**      | Definire griglie di valutazione.                 | **Rubriche Manager**                                                                        | `rubriche`                 |
| **Livelli di Competenza**    | Configurare la scala A-D per materia.            | **Livelli di Competenza**                                                                   | `competency-levels`        |
| **Documentazione Ufficiale** | Scrivere la programmazione disciplinare.         | **Reportistica Hub** — export DOCX pronto per protocollo.                                   | `reportistica`             |

### FASE 2: EROGAZIONE (Settimanale/Quotidiano)

_Il momento dell'aula, della gestione live e dell'imprevisto._

| Caso d'Uso              | Attività Docente                               | Funzionalità App                                                             | View               |
| :---------------------- | :--------------------------------------------- | :--------------------------------------------------------------------------- | :----------------- |
| **Gestione Lezione**    | Fare l'appello, gestire la disciplina.         | **Aula View + Registro** — badge comportamentali, timer, estrazione casuale. | `aula`, `register` |
| **Orario Settimanale**  | Consultare e gestire il proprio orario.        | **Orario**                                                                   | `timetable`        |
| **Agenda / Calendario** | Pianificare attività e scadenze.               | **Agenda**                                                                   | `calendario`       |
| **Assistente Live**     | Supporto real-time durante la lezione.         | **Assistente Live** — suggerimenti inclusione, adattamenti BES/DSA.          | `live-assistant`   |
| **Orientamento**        | Supportare studenti nelle scelte post-diploma. | **Orientamento Dashboard**                                                   | `orientamento`     |
| **Inbox Docente**       | Gestire comunicazioni e notifiche interne.     | **Inbox Docente**                                                            | `teacher-inbox`    |

### FASE 3: VALUTAZIONE (Continuo)

_Il momento della misurazione e del feedback._

| Caso d'Uso                      | Attività Docente                                        | Funzionalità App                                                                           | View                         |
| :------------------------------ | :------------------------------------------------------ | :----------------------------------------------------------------------------------------- | :--------------------------- |
| **Verifica Formativa**          | Dare voti e feedback sulle competenze.                  | **Valutazioni** — voto numerico + livello competenza (A-D) in un'unica schermata.          | `evaluations`                |
| **Osservazione Soft Skills**    | Valutare autonomia e collaborazione.                    | **Rubriche Manager** — griglie preimpostate per ciò che sfugge ai voti numerici.           | `rubriche`                   |
| **Dashboard Competenze Classe** | Visione aggregata dei livelli per classe.               | **Dashboard Competenze**                                                                   | `class-competency-dashboard` |
| **Creazione Verifiche**         | Preparare il testo della verifica.                      | **Studio AI** — verifica + griglia di correzione generata dagli stessi documenti della KB. | `studio`                     |
| **Piano di Miglioramento**      | Definire azioni di recupero per studenti in difficoltà. | **Piano di Miglioramento**                                                                 | `improvement-guide`          |

### FASE 4: ANALISI & REPORTING (Fine Periodo)

_Il momento della sintesi, degli scrutini e dei colloqui._

| Caso d'Uso               | Attività Docente                   | Funzionalità App                                                      | View                                     |
| :----------------------- | :--------------------------------- | :-------------------------------------------------------------------- | :--------------------------------------- |
| **Monitoraggio Classe**  | Capire come sta andando la classe. | **Analisi Classe** — grafici trend e radar con interpretazione AI.    | `analytics`                              |
| **Colloqui Genitori**    | Mostrare l'andamento al genitore.  | **Scheda Studente** — vista privacy-safe con grafici chiari.          | `studenti`                               |
| **Scrutinio**            | Proporre voti e giudizi.           | **Consiglio di Classe** — medie, PDF prospetto, giudizi sintetici AI. | `consiglio-di-classe`                    |
| **Presentazione Classe** | Esporre i risultati al consiglio.  | **Presentazione Docente**                                             | `teacher-presentation-view`              |
| **Area Studenti**        | Condividere materiali e feedback.  | **Area Studenti / Spazio Studente**                                   | `student-dashboard`, `student-workspace` |

---

## 3. Mappa delle Sezioni (Navigation)

### Navigazione Primaria (NavRail / BottomNav)

| View                | Label        | Contesto                    |
| :------------------ | :----------- | :-------------------------- |
| `home`              | Home         | Dashboard personale         |
| `timetable`         | Orario       | Gestione orario settimanale |
| `progettazione-hub` | Progetta     | Hub centrale progettazione  |
| `aula`              | Classi       | Gestione classi e registro  |
| `orientamento`      | Orientamento | Dashboard orientamento      |
| `calendario`        | Agenda       | Calendario e scadenze       |

### Navigazione Secondaria (Drawer "Altro")

**Strumenti Classe:** Studenti · Valutazioni · Registro · Analisi Classe · Dashboard Competenze · Consiglio di Classe · Inbox Docente · Piano di Miglioramento

**Pianificazione:** Lezioni · UDA · Rubriche · Didattica Inclusiva · Curriculum Manager · Livelli di Competenza

**Risorse & AI:** Studio AI · Knowledge Base · Reportistica

**Altre Sezioni:** Orientamento · Agenda · Area Studenti

---

## 4. Scenari d'Uso Reali (Personas)

### Scenario A: "L'Innovatore Digitale"

_Usa l'app su tablet in classe (≤840px — floating nav attiva)._

1.  Entra in classe, apre **Aula** → seleziona la classe.
2.  Avvia il **Timer** per un'attività di gruppo nel Registro.
3.  Usa **Estrazione Casuale** per interrogare.
4.  Segna un'osservazione rapida sulla scheda studente.
5.  A fine lezione, naviga via **"Altro"** → Valutazioni per registrare i voti.

### Scenario B: "Il Pianificatore Meticoloso"

_Usa l'app su desktop a casa (NavigationRail visibile)._

1.  Carica il PDF del libro di testo nella **Knowledge Base**.
2.  Usa **Studio AI** per generare 3 varianti di verifica scritta.
3.  Pianifica le UDA nel **UDA Planner** (Gantt) controllando le settimane disponibili.
4.  Duplica un'UDA come template per la classe parallela con un click.
5.  Analizza i grafici in **Analisi Classe** per preparare la relazione finale.

### Scenario C: "Il Coordinatore"

_Usa l'app per la gestione del Consiglio di Classe._

1.  Apre **Consiglio di Classe** per aggregare le proposte di voto.
2.  Genera il prospetto PDF per lo scrutinio.
3.  Usa **Dashboard Competenze** per la visione trasversale della classe.
4.  Prepara la **Presentazione Docente** per l'incontro con i genitori.

---

## 5. Vantaggi Strategici (Perché DocenteDoc AI?)

1.  **Indipendenza:** Non dipendi dalla connessione internet della scuola (funziona Offline con Service Worker PWA).
2.  **Velocità:** Nessun caricamento lento tra le pagine. SPA full-client con lazy loading per view. Interfaccia reattiva immediata.
3.  **Intelligenza Contestuale:** L'AI conosce i tuoi studenti e i tuoi documenti (RAG). Non devi ripetere il contesto ogni volta (es. "Fammi una verifica per la 3A" → l'AI sa già chi sono e cosa hanno studiato).
4.  **Visione Olistica:** Unisce Voti (quantitativo) e Competenze (qualitativo) in un'unica vista, cosa che molti registri elettronici separano rigidamente.
5.  **Privacy by Design:** Tutti i dati restano nel browser. Il backup è sul proprio Google Drive — nessun server proprietario intermedio.
6.  **Mobile-Ready:** Layout floating navigation su ≤840px — usabile comodamente da tablet in piedi davanti alla classe.
