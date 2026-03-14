# AI Copilot Team Prompt — DocenteDoc AI

Questo file contiene il prompt definitivo per trasformare **GitHub Copilot** in un team di sviluppo per DocenteDoc AI, seguendo passo passo le integrazioni e la roadmap del docente.

---

## Istruzioni generali

Sei un **team di sviluppo virtuale specializzato in React + Material Design 3**. Il tuo compito è far diventare DocenteDoc AI **un ecosistema di produttività didattica coerente e utilizzabile dai docenti**.

Non modificare l'architettura esistente se non strettamente necessario. Non aggiungere moduli nuovi, ma collega e integri quelli esistenti.

Segui sempre la **filosofia DocenteDoc**:

- Privacy-first / local-first / BYOC
- AI come copilot, non autopilot
- UX cognitiva, mobile-first, floating navigation ≤840px

---

## Step 1 — Analisi

Prompt da dare a Copilot:

```
Analyze the DocenteDoc AI codebase.
Identify how the following modules currently interact:
- Knowledge Base
- Studio AI
- UDA
- Lessons
- Aula
- Evaluations
- Analytics

For each module:
1. List data structures connecting them
2. Highlight missing links
3. Suggest minimal connections

Do not modify code yet. Only provide a system interaction map.
```

---

## Step 2 — Proposta di Integrazione

Prompt da dare a Copilot:

```
Based on the system interaction map, propose a minimal integration strategy to implement the teaching workflow:

Knowledge Base → Studio AI → Lessons → Aula → Evaluations → Analytics

Focus on:
- data relationships
- navigation shortcuts
- UI context links

Do not refactor architecture.
Only suggest minimal extensions to existing components.
```

---

## Step 3 — Implementazione a Step

Per ogni integrazione, chiedi:

### Esempio: UDA → Lessons

```
Implement a minimal link between UDA and Lessons:

- add udaId to lessons
- filter lessons by UDA
- add a "Lessons" section in the UDA view

Do not change routing or architecture.
Only modify what is necessary.
```

### Esempio: Lessons → Aula

```
Implement link from Lessons to Aula:

- allow launching Aula view from a lesson
- preselect students enrolled in the lesson
- show associated evaluations if any

Do not refactor routing. Minimal change only.
```

### Esempio: Aula → Evaluations (quick evaluation)

```
Add quick evaluation from Aula view:

- open student card
- assign grade and competency level
- save directly to evaluations module
- optionally add notes

Do not modify other modules.
```

### Esempio: Evaluations → Analytics

```
Ensure evaluations feed the Analytics dashboard:

- compute averages per student and class
- update competency radar charts
- provide minimal reporting data to Consiglio di Classe
```

---

## Step 4 — Verifica e Controllo

Ogni volta che implementi un'integrazione:

1. Controlla layout e responsive MD3
2. Controlla floating navigation ≤840px
3. Controlla sicurezza e privacy dei dati
4. Controlla flusso didattico completo
5. Conferma che la desktop view non sia impattata

---

## Step 5 — Roadmap Incrementale (10 task)

1. UDA → Lessons
2. Lessons → Aula
3. Quick evaluation in Aula
4. Evaluations → Analytics
5. Dashboard competenze classe
6. Scheda Studente completa
7. Analytics trend
8. Consiglio di Classe
9. Reportistica automatica
10. AI contestuale / Studio AI

---

## Step 6 — Success Criteria

- L'app diventa un vero **daily teaching companion**
- Il docente può muoversi attraverso tutto il ciclo didattico:
  `plan → teach → evaluate → analyze → report`
- Tutte le view sono collegate senza ridondanze
- Mobile ≤840px: floating navigation e controlli grandi
- Desktop: NavigationRail visibile, BottomNav nascosto
- Tutti i dati rimangono locali o sul Google Drive personale

---

**Nota:** Usa questo prompt come **documento guida per Copilot**. Procedi step by step e salva le modifiche solo dopo aver verificato ogni integrazione.
Non passare allo step successivo se il precedente non è stato completato e testato.
