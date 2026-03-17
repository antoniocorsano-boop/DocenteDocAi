# Release Plan v1.0 — DocenteDoc AI

## Sistema Cognitivo Evolutivo per il Docente

**Data:** Marzo 2026  
**Obiettivo:** Rilasciare una versione stabile, coerente e deployabile del sistema Copilot evolutivo

---

# 1. VISIONE DELLA RELEASE

La v1.0 deve garantire:

> Il docente riesce a svolgere attività reali seguendo i suggerimenti del sistema, percependo un miglioramento progressivo del proprio modo di lavorare.

---

# 2. ARCHITETTURA TARGET

## Flusso principale

```
Evento → Cognition → Insight → Suggestion → UI → Azione → Feedback → Evoluzione
```

## Layer coinvolti

- Cognition Layer
- Suggestion Layer
- Artistic Layer
- Teacher Model
- UI Layer

---

# 3. FASI DI IMPLEMENTAZIONE

---

## FASE 1 — HARDENING CORE (PRIORITÀ ALTA)

### Obiettivo

Stabilizzare il sistema cognitivo e il motore decisionale

### Task

- [x] Creare `DecisionContract.ts`
- [x] Validazione suggerimenti (max 3, actionKey obbligatorio)
- [x] Implementare deduplicazione suggerimenti
- [x] Implementare cooldown suggerimenti
- [x] Aggiungere `reason` a ogni suggerimento
- [x] Validazione eventi (`eventMap` enforcement)

### Deliverable

- SuggestionEngine stabile
- Nessun suggerimento incoerente

---

## FASE 2 — OSSERVABILITÀ E DEBUG

### Obiettivo

Rendere il sistema comprensibile e tracciabile

### Task

- [x] Creare `EventLogger.ts`
- [x] Logging eventi strutturato
- [x] Implementare `replayEvents(sessionId)`
- [x] Disabilitare debug in produzione

### Deliverable

- Sistema tracciabile
- Debug possibile post-deploy

---

## FASE 3 — TEACHER MODEL COMPLETO

### Obiettivo

Abilitare personalizzazione reale

### Task

- [x] Estendere TeacherModel:
  - capabilityLevel
  - usagePatterns
  - completedActions
  - ignoredSuggestions
- [x] Persistenza con versioning
- [x] Migration system (v2 → v3)
- [x] Safe hydration

### Deliverable

- Modello utente stabile e persistente

---

## FASE 4 — FEEDBACK LOOP

### Obiettivo

Far evolvere il sistema con l'utente

### Task

- [x] `onSuggestionAccepted(actionKey)`
- [x] `onSuggestionIgnored(actionKey)`
- [x] Aggiornamento modello utente
- [x] Adattamento priorità suggerimenti

### Deliverable

- Sistema adattivo reale

---

## FASE 5 — INTEGRAZIONE ARTISTICA

### Obiettivo

Integrare il layer culturale nel flusso cognitivo

### Task

- [x] Collegare ArtisticConsilium a SuggestionEngine
- [x] Attivazione condizionale (livello ≥ 2 + contesto didattico attivo)
- [x] Validazione output (no genericità)
- [x] Coerenza con UDA e contesto

### Deliverable

- AI artistica utile e non decorativa

---

## FASE 6 — UX & FILOSOFIA

### Obiettivo

Garantire coerenza con i principi del sistema

### Task

- [x] Aggiungere `reason` visibile nei suggerimenti (`AIExplainabilityPanel`, `ExplainableInsightChip`)
- [x] Garantire max 3 suggerimenti
- [x] Eliminare comportamenti intrusivi
- [x] UI adattiva per livello utente (`Home.tsx` differenzia per `journeyLevel`)

### Deliverable

- UX chiara, non invasiva, evolutiva ✅

---

## FASE 7 — PERFORMANCE & STABILITÀ

### Obiettivo

Rendere il sistema fluido e affidabile

### Task

- [x] Debounce eventi CognitionBus (`DEBOUNCE_MS=150`, `INSTANT_EVENTS` per eventi critici)
- [x] Lazy loading moduli pesanti (`lazyStores.ts` — PDF, XLSX, DnD lazy)
- [x] Ottimizzazione rendering (analisi confermata: `useMemo`/`useCallback` su tutti i path pesanti — `ClassCompetencyDashboard`, `ClassroomView`, `AggregatedDashboard`, `useAppEngine` — nessun critical path non memoizzato)
- [x] ErrorBoundary globale (`ErrorBoundary.tsx` in `main.tsx` + `AITabErrorBoundary.tsx`)

### Deliverable

- App fluida e resiliente

---

## FASE 8 — SICUREZZA

### Obiettivo

Protezione base del sistema

### Task

- [x] Validazione dati persistiti (`storage.ts` — try-catch + type guard su ogni read)
- [x] Protezione XSS: `htmlSanitizer.ts` ora usa DOMPurify (`ALLOWED_TAGS` whitelist, no regex custom)
- [x] Guard produzione su `EventLogger.ts` (`if (!import.meta.env.DEV) return` — nessun write in produzione)

### Deliverable

- Protezione base attiva

---

## FASE 9 — TEST

### Tipologie

#### Cognitive Tests

- [x] Simulazione flussi eventi
- [x] Verifica suggerimenti corretti

#### Regression Tests

- [x] Stabilità suggerimenti (54/54 ✅)
- [x] Nessuna regressione logica

#### Store / Migration Tests

- [x] Test migrazione `useTeacherModelStore` v2→v3 (`useTeacherModelStore.migration.test.ts` — 15 test)

#### UX Tests

- [x] Comprensibilità
- [x] Non ridondanza

#### E2E Tests

- [x] Flusso cognitivo base e2e (`cognitive-journey.spec.ts` — 9 test: home load, nav, max-3 chips, no modali intrusivi, TeacherModel v3 persistenza)

> Stato attuale: **1937/1937 test passati | 12 skip intenzionali | 131/131 file** (build `e04397a0`)  
> Dettaglio: 22 ArtisticConsilium + 54 cognitivi + 15 migrazione store + 98 useAppEngine + 1748 resto suite

---

## FASE 10 — BUILD & DEPLOY

### Task

- [x] `npm run dev` — avvia correttamente (Vite 6.4.1, porta 5173/5174)
- [x] `npm run build` — ✓ built in ~34s, 0 errori (warning .br/.gz overwrite — artefatto PWA plugin, non bloccante)
- [x] Config `.env.production` — `.env.example` completo + sezione variabili in `docs/DEPLOY_VERCEL.md`
- [x] Disabilitazione logger in prod (`import.meta.env.DEV` guard in `EventLogger.ts`)
- [x] Deploy su Vercel — `git push main` eseguito (commit `e04397a0`), auto-deploy triggerato

---

# 4. DEPLOYMENT

## Piattaforme consigliate

- Vercel (configurazione presente in `vercel.json`)
- Netlify

## Strategia

- Deploy automatico da Git
- Preview per branch
- Produzione da `main`

---

# 5. KPI (MONITORAGGIO)

## Metriche chiave

| Metrica                    | Target                      |
| -------------------------- | --------------------------- |
| Suggestion Acceptance Rate | > 30%                       |
| Task Completion Rate       | > 60%                       |
| Time to First Value        | < 2 min                     |
| Suggestion Relevance       | alta (feedback qualitativo) |

---

# 6. VALIDAZIONE UTENTE

## Test obbligatori

### Onboarding

- Creazione classe
- Primo suggerimento utile

### Didattica

- Creazione UDA
- Suggerimenti contestuali

### Esplorazione

- Nessuna intrusività

---

# 7. RISCHI

| Rischio                | Mitigazione                                     |
| ---------------------- | ----------------------------------------------- |
| Troppi suggerimenti    | `DecisionContract.MAX_SUGGESTIONS = 3` hard cap |
| Suggerimenti generici  | `reason` obbligatorio + gate contesto didattico |
| Automazioni invisibili | Ogni azione richiede conferma utente            |
| Incoerenza tra moduli  | `DecisionContract` come unica fonte normativa   |

---

# 8. STRATEGIA DI RILASCIO

## v1.0.0

- Sistema stabile
- Copilot funzionante
- Artistic layer integrato

## v1.1.0

- Miglioramento suggerimenti
- UI adattiva per livello completa

## v1.2.0

- Personalizzazione avanzata
- `preferredReminderTime` in `TeacherPreferences`

---

# 9. PRINCIPI GUIDA

```
Non imporre
Suggerire
Accompagnare
Evolvere
```

---

# 10. DEFINIZIONE DI SUCCESSO

La release è riuscita se:

- L'utente segue i suggerimenti spontaneamente
- Il sistema riduce il carico cognitivo
- Il docente percepisce crescita

---

# 11. EVOLUZIONI FUTURE

- Segreteria intelligente (auto-task orchestration)
- Automazioni controllate
- Modello psico-cognitivo (affaticamento, motivazione)
- Analytics docente longitudinale
- EventLogger persistito con retention configurabile

---

# CONCLUSIONE

Questo non è solo un rilascio.

È l'attivazione di un sistema che:

> accompagna il docente nel diventare più consapevole, efficace e creativo nel suo lavoro.
