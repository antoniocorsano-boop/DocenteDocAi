# Analisi critica componenti Modali e Gantt – DocenteDoc AI

## 1. Modali

### Punti di forza
- Uso di hook dedicato (`useModalAccessibility`) per accessibilità.
- Attributi ARIA corretti (`role="dialog"`, `aria-modal="true"`).
- Componenti modulari (es. `AddEvaluationModal`, `AddProvaModal`, `AddSourceModal`, `AddStudentModal`).
- Uso di `M3Dialog` per coerenza con Material Design 3.

### Criticità
- Responsive: alcune classi CSS (es. `max-w-lg`, `max-w-3xl`) non garantiscono sempre esperienza full-screen su mobile.
- Gestione focus: da verificare la restituzione del focus all’elemento trigger e la gestione del tab loop.
- Chiusura: manca sempre un bottone chiudi visibile e accessibile in alto a destra.
- Overlay: da verificare la copertura e l’accessibilità dell’overlay su tutti i dispositivi.
- Animazioni: presenti ma da testare su dispositivi lenti.

## 2. Gantt (ProgettazioneHub)

### Punti di forza
- Implementazione Gantt Timeline 2.0 dinamica e real-time.
- Struttura a container, header, body, lanes, eventi, indicatori.
- Indicatori visivi (oggi, eventi, barre, icone Material).
- Responsive parziale tramite `minWidth` e griglie dinamiche.

### Criticità
- Drag&drop: non implementato per spostamento eventi/barre.
- Feedback visivo: mancano tooltip contestuali, highlight su hover/drag, feedback su azioni.
- Stepper/breadcrumb: assente per wizard multi-step.
- Accessibilità: da verificare navigazione tastiera e ARIA.
- Mobile: usabilità limitata su schermi piccoli, scroll orizzontale poco intuitivo.

## 3. Raccomandazioni
- Uniformare pattern modali (header, chiusura, focus, full-screen mobile).
- Introdurre drag&drop e feedback visivo avanzato in Gantt.
- Migliorare accessibilità (tabindex, aria-label, focus management) sia per modali che per Gantt.
- Testare e ottimizzare animazioni e overlay su dispositivi lenti/mobile.
- Introdurre stepper/breadcrumb per wizard complessi.

---

*Ultimo aggiornamento: 27/12/2025*