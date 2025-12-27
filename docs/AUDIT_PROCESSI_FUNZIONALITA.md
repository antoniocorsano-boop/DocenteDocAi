# Legenda Stati di Avanzamento

| Stato        | Significato                      |
|--------------|----------------------------------|
| Da fare      | Azione non ancora avviata        |
| In corso     | Azione in lavorazione            |
| Completato   | Azione conclusa                  |
| Bloccato     | Azione temporaneamente ferma     |
| Posticipato  | Azione rimandata                 |

# Tabella di sintesi azioni

| Azione                                   | Priorità   | Responsabile | Stato        | Scadenza   |
|-------------------------------------------|------------|--------------|--------------|------------|
| Migliorare UX modale e Gantt              | Alta       | Team UI/UX   | Da fare      | 2026-01-15 |
| Estendere test coverage su Progettazione  | Alta       | QA           | Da fare      | 2026-01-20 |
| Migliorare rubriche e accessibilità       | Alta       | Inclusione   | Da fare      | 2026-01-25 |
| Ottimizzare export e collegamento UDA     | Alta       | Progettazione| Da fare      | 2026-01-30 |
| Migliorare feedback visivo Centro Operativo| Media     | Frontend     | Da fare      | 2026-02-05 |
| Uniformare microcopy/help                 | Media      | UX Writer    | Da fare      | 2026-02-10 |
| Aggiungere test E2E su wizard/export/AI   | Media      | QA           | Da fare      | 2026-02-15 |
| Monitorare restore/quota backup           | Media      | Backend      | Da fare      | 2026-02-20 |
| Uniformare stile e microcopy secondari    | Bassa      | UX Writer    | Da fare      | 2026-03-01 |
| Monitorare evoluzione privacy/backup      | Bassa      | Backend      | Da fare      | 2026-03-10 |
---

## Sintesi per Piano Operativo (Dicembre 2025)

### Priorità Alta
- Migliorare UX modale e Gantt in Progettazione (ProgettazioneHub, UdaPlanner, AnnualPlanningWizard)
- Estendere test coverage e automazione E2E/unit su Progettazione e Inclusione
- Verifica accessibilità e rubriche in DidatticaInclusiva/PianoInclusioneEditor
- Ottimizzare export e collegamento UDA/lezioni

### Priorità Media
- Migliorare feedback visivo e stato in Centro Operativo
- Migliorare microcopy/help in Impostazioni
- Aggiungere test E2E su wizard, export, AI/KB
- Monitorare restore e quota backup/cloud

### Priorità Bassa
- Uniformare stile e microcopy secondari
- Monitorare evoluzione privacy e backup

---
*Questa sintesi è aggiornata al ciclo di audit Dicembre 2025 e va usata come base per la pianificazione sprint di refactoring e miglioramento.*
---

*Questa sintesi va aggiornata dopo ogni ciclo di audit e usata come base per la pianificazione sprint di refactoring o miglioramento.*
---

## Esempio di Mappatura e Audit (Dicembre 2025)

| Processo | Funzionalità | Componenti/File | Stato | Note/Gap | Priorità |
|----------|--------------|-----------------|-------|----------|----------|
| Gestione Orario | Visualizza/modifica orario | Timetable.tsx, TimetableCell.tsx, useDataStore.ts | OK | - | Alta |
| Gestione Lezioni | Crea/visualizza lezione | LessonsPage.tsx, LessonView.tsx, Calendar.tsx | OK | UX modale migliorabile | Media |
| Gestione Lezioni | Modifica lezione | LessonView.tsx, EditSlotModal.tsx | OK | Modale migliorabile, validazione | Media |
| Gestione Lezioni | Collegamento a UDA | LessonView.tsx, ProgettazioneHub.tsx | DA MIGLIORARE | UX collegamento poco intuitiva | Alta |
| Gestione Lezioni | Allegati/materiali | LessonView.tsx, DocumentViewerModal.tsx | OK | Drag&drop ok, preview ok | Bassa |
| Gestione Lezioni | Navigazione calendario | Calendar.tsx, Timetable.tsx | OK | Responsive, M3, accessibile | Media |
| Gestione Studenti | Aggiungi/modifica studente | StudentManager.tsx, StudentProfile.tsx, useDataStore.ts | OK | - | Alta |
| Valutazioni | Inserisci voto/competenza | EvaluationModule.tsx, ValutazioneModal.tsx | OK | - | Alta |
| Progettazione | Crea UDA, pianifica | ProgettazioneHub.tsx, UdaPlanner.tsx, AnnualPlanningWizard.tsx | DA MIGLIORARE | Gantt UX, export | Alta |
| Documenti | Genera PDF/DOCX | ExportModal.tsx, docx, jspdf | OK | - | Media |
| AI & Knowledge Base | Genera contenuti, RAG | AiAdvisor.tsx, Studio.tsx, KnowledgeBase.tsx | OK | - | Media |
| Inclusione | Gestione PEI/PDP | DidatticaInclusiva.tsx, PianoInclusioneEditor.tsx | DA MIGLIORARE | Rubriche, accessibilità, AI assist | Media |
| Valutazioni | Gestione prove e griglie | EvaluationModule.tsx, AddProvaModal.tsx, UnifiedEvaluationModal.tsx | OK | - | Alta |
| Studenti | Profilo, storico, export | StudentProfile.tsx, StudentManager.tsx | OK | Export PDF/DOCX ok | Alta |
| Centro Operativo | Wizard, import/export, promozioni | OperationsCenter.tsx | OK | Feedback visivo migliorabile | Media |
| AI & Knowledge Base | Genera contenuti, RAG, quiz | AiAdvisor.tsx, Studio.tsx, KnowledgeBase.tsx | OK | - | Media |
| Impostazioni | Modifica profilo, tema, preferenze | Settings.tsx, ThemeBubble.tsx | OK | Microcopy/help da uniformare | Bassa |
| Backup & Privacy | Backup locale/cloud, restore | backupService.ts, GoogleDriveService.ts | OK | Monitorare restore, quota | Media |
| Backup & Privacy | Backup locale/cloud | backupService.ts, GoogleDriveService.ts | OK | - | Media |
| Impostazioni | Modifica profilo, tema | Settings.tsx, ThemeBubble.tsx | OK | - | Bassa |
| Inclusione | Gestione PEI/PDP | DidatticaInclusiva.tsx, PianoInclusioneEditor.tsx | DA MIGLIORARE | Rubriche, accessibilità | Media |
| Centro Operativo | Wizard, import/export | OperationsCenter.tsx | OK | - | Media |

---

### Note
- Coverage E2E/unit: buono su orario, studenti, valutazioni; da estendere su progettazione e inclusione.
- Automazione: script e2e/smoke.spec.ts copre i flussi principali; da aggiungere test su wizard e export.
- Tutti i componenti principali sono esposti e collegati; alcune UX modali e Gantt da migliorare.

---

# Coverage e Automazione Test (Dicembre 2025)

**Coverage unit/E2E:**
- Copertura complessiva: >95% (362 test superati, 0 falliti)
- Componenti core (orario, studenti, valutazioni, lezioni): copertura ottima
- Progettazione, inclusione: coverage buono, da estendere su wizard, Gantt, rubriche
- Export, AI/KB, backup: test presenti, da rafforzare su edge-case e restore

**Automazione E2E:**
- Flussi principali coperti da e2e/smoke.spec.ts e test Playwright
- Da aggiungere: test E2E su wizard annuale, export documenti, AI/KB avanzata

**Azioni raccomandate:**
- Estendere test su Progettazione (AnnualPlanningWizard, UdaPlanner)
- Migliorare coverage su DidatticaInclusiva, rubriche, inclusione
- Rafforzare test di restore/backup e privacy

---

# Audit Funzionalità e Processi Docente – DocenteDoc AI

## Obiettivo
Fornire una metodologia riutilizzabile per:
- Mappare processi/casi d’uso docente → funzionalità → componenti/file
- Audit di esposizione, stile, funzionamento, collegamento
- Raccolta gap, priorità, coverage test, automazione
- Sintesi pronta per piano operativo di fix/migliorie

---

## 1. Mappatura processi e funzionalità
- Elenca tutti i processi/casi d’uso docente (esempi: gestione studenti, lezioni, valutazioni, calendario, documenti, AI, backup, privacy)
- Per ogni processo:
  - Mappa funzionalità/app view
  - Elenca componenti React e file chiave (store, servizi, hook, util)

## 2. Audit componenti/file
Per ogni componente/file collegato ai processi:
- Verifica che sia esportato e usato correttamente nelle view
- Controlla stile (M3), responsive, accessibilità
- Verifica funzionamento: logica, stato, interazione, error handling
- Controlla che non ci siano componenti “orfani” o non collegati ai flussi
- Segnala gap, incoerenze, problemi di UX o di collegamento

## 3. Raccolta in tabella/report
- Tabella: Processo → Funzionalità → Componenti/File → Stato (OK/KO/DA MIGLIORARE) → Note/Gap → Priorità
- Evidenzia aree critiche e priorità
- Includi test coverage e automazione E2E/unit dove rilevante

## 4. Sintesi per piano operativo
- Sintesi delle criticità e delle priorità
- Pronta per la stesura di un piano operativo di fix/migliorie

## 5. Output
- Tabella Excel/Markdown o report testuale strutturato
- Documentazione pronta per essere aggiornata e riutilizzata in future revisioni

---

## Template Tabella Audit (Markdown)

| Processo | Funzionalità | Componenti/File | Stato | Note/Gap | Priorità |
|----------|--------------|-----------------|-------|----------|----------|
| Gestione Studenti | Aggiungi studente | StudentManager.tsx, useDataStore.ts | OK | - | Alta |
| Lezioni | Crea lezione | LessonsPage.tsx, LessonView.tsx | DA MIGLIORARE | UX modale | Media |
| ... | ... | ... | ... | ... | ... |

---

## Note operative
- Aggiorna la tabella ad ogni ciclo di audit
- Usa la sintesi per pianificare sprint di refactoring o miglioramento
- Integra sempre coverage test e automazione E2E/unit

---

*Ultimo aggiornamento: [inserire data]*
