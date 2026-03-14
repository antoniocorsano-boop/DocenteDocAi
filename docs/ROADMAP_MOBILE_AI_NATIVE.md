# Roadmap — Full Mobile + AI-Native App

> Generata: 2026-03-14 | Stato: In progress | Owner: Dev Team

---

## Sezione 1 — Mobile-First Core

| #   | Task                                                                                               | Priorità  | Stato |
| --- | -------------------------------------------------------------------------------------------------- | --------- | ----- |
| 1   | Audit UI/UX attuale per mobile (< 600px): gap vs UX nativa Google (Drive, Calendar, Gmail)         | 🔴 High   | [x]   |
| 2   | Refactor layout: MD3 Surface, ButtonBase, BottomNavigationRail, Drawer per full mobile interaction | 🔴 High   | [x]   |
| 3   | Accessibilità completa: aria-labels, focus navigation, touch target ≥ 48px                         | 🔴 High   | [x]   |
| 4   | Test navigazione gesture (swipe, scroll, tap, long press) su Android/iOS simulati                  | 🟡 Medium | [x]   |

---

## Sezione 2 — Navigation & Context Flow

| #   | Task                                                                          | Priorità  | Stato |
| --- | ----------------------------------------------------------------------------- | --------- | ----- |
| 5   | Analizzare tutte le route e contesti (UDA → Lessons → Classroom → Dashboard)  | 🔴 High   | [x]   |
| 6   | Gestione contestuale centralizzata: ViewManager + context objects strutturati | 🔴 High   | [x]   |
| 7   | Bottom nav + secondary drawer fully responsive, highlight sezione corrente    | 🔴 High   | [x]   |
| 8   | Quick-action FAB menu (aggiungi lezione, valuta studente) mobile-wide         | 🟡 Medium | [x]   |

---

## Sezione 3 — Dashboard & Analytics

| #   | Task                                                                               | Priorità  | Stato |
| --- | ---------------------------------------------------------------------------------- | --------- | ----- |
| 9   | Dashboard classe: tab Matrici / Radar / Trend / Interventi AI + Recharts           | 🔴 High   | [x]   |
| 10  | `trackAnalyticsEvent` su tutte le interazioni chiave (dashboard, tab, salvataggio) | 🟡 Medium | [x]   |
| 11  | Memoization corretta `classStudentIds` e `lessonsArr` per prevenire re-render      | 🟡 Medium | [x]   |

---

## Sezione 4 — AI e Predizione

| #   | Task                                                                                  | Priorità  | Stato |
| --- | ------------------------------------------------------------------------------------- | --------- | ----- |
| 12  | Algoritmo predittivo "at-risk": rileva studenti a rischio per competenze/performance  | 🔴 High   | [x]   |
| 13  | Pannello AI: suggerimenti proattivi personalizzati (Low / Medium / High priority)     | 🔴 High   | [x]   |
| 14  | Dashboard Excellence: top performer + challenge aggiuntive suggerite                  | 🟡 Medium | [x]   |
| 15  | Integrazione AI plugin: sintesi testi, auto-fill valutazioni, suggerimenti interventi | 🟡 Medium | [ ]   |

---

## Sezione 5 — Full App Intelligence & Smart Suggestions

| #   | Task                                                                                  | Priorità  | Stato |
| --- | ------------------------------------------------------------------------------------- | --------- | ----- |
| 16  | Intelligenza interna contestuale: suggerisci next actions, completamenti, valutazioni | 🟡 Medium | [ ]   |
| 17  | Smart Navigation: anticipa prossima pagina in base a pattern utente                   | 🟢 Low    | [ ]   |
| 18  | Sintesi automatica dati: input docente → resoconto rapido + AI insights               | 🟡 Medium | [ ]   |
| 19  | Plugin-ready: architettura per widget Trello-style, Recharts custom plugins           | 🟢 Low    | [ ]   |

---

## Sezione 6 — Performance & Offline

| #   | Task                                                                    | Priorità  | Stato |
| --- | ----------------------------------------------------------------------- | --------- | ----- |
| 20  | Full offline-first: IndexedDB / localStorage per UDA, Lessons, Students | 🔴 High   | [x]   |
| 21  | Pre-fetch dati successivi per mobile smooth experience                  | 🟡 Medium | [ ]   |
| 22  | Ottimizza bundle + lazy load: Chart, AI Panel caricati solo on demand   | 🟡 Medium | [x]   |

---

## Sezione 7 — Test & Lint

| #   | Task                                                                            | Priorità  | Stato |
| --- | ------------------------------------------------------------------------------- | --------- | ----- |
| 23  | Full test suite coverage (Vitest): mobile, desktop, edge cases                  | 🔴 High   | [x]   |
| 24  | Lint & Prettier: 0 warning/0 error, `useCallback`/`useMemo` deps corrette       | 🔴 High   | [x]   |
| 25  | MD3 compliance audit finale: colori, spacing, aria-labels su tutti i componenti | 🟡 Medium | [x]   |

---

## Sezione 8 — Deployment & Monitoring

| #   | Task                                                                | Priorità  | Stato |
| --- | ------------------------------------------------------------------- | --------- | ----- |
| 26  | CI/CD pipeline: build mobile web, PWA, future native wrapper        | 🔴 High   | [x]   |
| 27  | Telemetria e logging AI + UX per miglioramenti continui             | 🟡 Medium | [ ]   |
| 28  | Documentazione: props, stores, hooks, context per team dev e utenti | 🟡 Medium | [ ]   |

---

## Progresso globale

```
Completati : 20 / 28  (71%)
In corso   :  0
Aperti     :  8

🔴 High    : 0 aperti  ✅ tutti completati
🟡 Medium  : 6 aperti  (#15, #16, #18, #21, #27, #28)
🟢 Low     : 2 aperti  (#17, #19)
```

---

## Legenda

| Simbolo   | Significato                               |
| --------- | ----------------------------------------- |
| 🔴 High   | Bloccante o critico per UX / sicurezza    |
| 🟡 Medium | Importante, pianificabile sprint corrente |
| 🟢 Low    | Desiderabile, backlog                     |
| `[x]`     | Completato                                |
| `[ ]`     | Aperto                                    |

---

_Aggiorna questo file dopo ogni commit atomico. Collega ogni `[x]` al commit hash corrispondente se necessario._
