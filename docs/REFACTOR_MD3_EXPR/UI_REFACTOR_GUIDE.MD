# UI Refactor Guide – M3 Expressive

## Linee guida generali
- Rimuovere stili inline e Tailwind hardcoded.
- Sostituire componenti legacy con M3Expressive equivalenti.
- Applicare token M3 (colori, spacing, typography, elevation).
- Mantieni tipizzazione TypeScript rigorosa.
- Sub-componenti complessi separati se necessario.
- Log / audit di azioni utente: click, apertura/chiusura modali, salvataggi.

## Viste principali (priorità)
1. UDA Planner
   - Path: `onNavigate('uda')`
   - Pattern: griglia, timeline, card, form
2. Studio AI
   - Path: `onNavigate('studio')`
   - Pattern: hero section, action cards
3. Knowledge Base
   - Path: `onNavigate('knowledge-base')`
   - Pattern: liste e card, filtri
4. Lessons
   - Path: `onNavigate('lessons')`
   - Pattern: griglia, timeline, card
5. Rubriche
   - Path: `onNavigate('rubriche')`
   - Pattern: tabelle, valutazioni colorate
6. Reportistica
   - Path: `onNavigate('reportistica')`
   - Pattern: export, anteprime, pulsanti
7. Register
   - Path: `onNavigate('register', selectedClass)`
   - Pattern: tabelle, input, colori stati
8. Evaluations
   - Path: `onNavigate('evaluations', selectedClass)`
   - Pattern: griglie di voti
9. Class Competency Dashboard
   - Path: `onNavigate('class-competency-dashboard', selectedClass)`
   - Pattern: metriche, grafici, card
10. Teacher Inbox
    - Path: `onNavigate('teacher-inbox')`
    - Pattern: lista notifiche, badge
11. Improvement Guide
    - Path: `onNavigate('improvement-guide', selectedClass)`
    - Pattern: card con dati, grafici
12. Consiglio di Classe
    - Path: `onNavigate('consiglio-di-classe', selectedClass)`
    - Pattern: tabelle grandi
13. Studenti
    - Path: `onNavigate('studenti', selectedClass)`
    - Pattern: liste, avatar, filtri
14. Didattica Inclusiva
    - Path: `onNavigate('didattica-inclusiva', selectedClass)`
    - Pattern: card e form modulari

## Indicazioni extra
- Inizia da viste dashboard-like (UDA Planner, Studio AI) → più usate e simili a ProgettazioneHub.
- Evita modali isolate a meno che non abbiano layout complessi.
- Dopo ogni refactor → build e test per zero errori.
- Segnala pattern non coperti dal documento.
