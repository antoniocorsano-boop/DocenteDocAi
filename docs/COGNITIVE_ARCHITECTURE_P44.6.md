# Cognitive Architecture P44.6 — DocenteDoc AI

**Data:** 2026-03-22  
**Commit baseline:** `dfc8f705`  
**Status:** implementato, stabile, 0 errori TS/lint

---

## 1. Visione del sistema

DocenteDoc AI non è un chatbot.  
È un **sistema cognitivo adattivo con modello operativo interno dell'utente**.

Ogni turno di conversazione alimenta tre layer paralleli:

| Layer                  | Scala temporale           | Funzione                                  |
| ---------------------- | ------------------------- | ----------------------------------------- |
| Emotional Engine       | istantanea (per turno)    | rileva stato cognitivo corrente           |
| Cognitive Style Engine | sessione / cross-sessione | modella preferenze strutturali stabili    |
| Merge Engine           | per turno (output)        | risolve conflitti con gerarchia esplicita |

---

## 2. Architettura a layer — diagramma

```
┌─────────────────────────────────────────────────────────────────┐
│                         INPUT UTENTE                            │
│                     (testo, modo, azioni UI)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EMOTIONAL ENGINE                            │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │ detectSignals() │───▶│ resolveState()   │                   │
│  └─────────────────┘    └────────┬─────────┘                   │
│                                  │                              │
│                          smoothState()  ◀── prevState           │
│                                  │                              │
│                    ┌─────────────▼──────────────┐              │
│                    │     resolveStrategy()       │              │
│                    │  (blends EmotionalProfile)  │              │
│                    └─────────────┬──────────────┘              │
│                                  │                              │
│          updateEmotionalMemory() │  ← scrive lastPerceivedState │
│                                  │                              │
│          ┌───────────────────────▼───────────────────────┐     │
│          │              EmotionalMemory                   │     │
│          │  frustrationCount · flowScore                  │     │
│          │  preferredDepth · lastPerceivedState           │     │
│          └───────────────────────────────────────────────┘     │
└────────────────────────────┬────────────────────────────────────┘
                             │  EmotionalStrategy
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  COGNITIVE STYLE ENGINE                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Segnali cumulativi (CognitiveStyleSignals)              │  │
│  │  revealClicks · deepModeUsageCount · fastModeUsageCount  │  │
│  │  totalTurns · suggestionAccepted · blocked Turns         │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
│                    deriveStyle()                                │
│                    smoothStyle()  70% prev + 30% new            │
│                             │                                   │
│                    ┌────────▼────────┐                         │
│                    │  CognitiveStyle │                         │
│                    │  structure      │                         │
│                    │  autonomy       │                         │
│                    │  speedPref      │                         │
│                    │  exploration    │                         │
│                    └────────────────┘                         │
└────────────────────────────┬────────────────────────────────────┘
                             │  CognitiveStyle + EmotionalStrategy
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MERGE ENGINE (P39.6)                       │
│                                                                 │
│   PRIORITY 1 — Sicurezza emotiva                               │
│     if guidance === 'lead':                                     │
│       depth = 'light'  ·  uiDensity = 'low'  →  RETURN        │
│                                                                 │
│   PRIORITY 2 — Preferenza stile (utente stabile)               │
│     structure=high  →  uiDensity='high'                        │
│     structure=low   →  uiDensity='low'                         │
│     exploration=high →  delete maxBlocks (nessun cap)           │
│     autonomy=high   →  depth floor 'medium'                    │
│     structure=high + autonomy=low + guidance=none              │
│                     →  guidance='suggest'                      │
│                                                                 │
│   PRIORITY 3 — Preferenza ritmo (fine-tuning)                  │
│     speedPref=deliberate →  depth 'medium' → 'deep'            │
│     speedPref=fast       →  depth capped 'medium' · maxBlocks=6│
└────────────────────────────┬────────────────────────────────────┘
                             │  AdaptedStrategy (finale)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 SYSTEM PROMPT + UI ADAPTATION                   │
│                                                                 │
│  SystemPromptBuilder                                            │
│    buildPersonaSection()                                        │
│    buildModeSection()                                           │
│    buildEmotionalSection()   ◀── AdaptedStrategy               │
│    buildStyleSection()       ◀── CognitiveStyle                 │
│                                                                 │
│  adaptBlocks()               ◀── AdaptedStrategy + style hint  │
│    exploration=high  →  tutti i blocchi visibili               │
│    structure=high    →  maxBlocks + 1                          │
│    structure=low     →  maxBlocks - 1                          │
│    default           →  strategia emotional                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              INTERAZIONE UTENTE + LEARNING LOOP                 │
│                                                                 │
│  SmartChat reveal button   →  recordRevealClick()              │
│  Mode changes              →  recordSuggestionAccepted/Rejected │
│  Per-turn                  →  recordModeUsage()                │
│                                                                 │
│  Telemetria:                                                    │
│    observe('cognitive.style.updated', { … })     [ogni turno]  │
│    observe('chat.emotional.transition', { … })   [su cambio]   │
│    observe('chat.emotional.signal', { … })       [ogni turno]  │
│    observe('chat.response.completed', { … })     [ogni turno]  │
│                                                                 │
│  Persistenza:                                                   │
│    useChatPrefsStore v3  (localStorage, Zustand persist)       │
│      emotionalProfile · cognitiveStyle                         │
│      cognitiveStyleSignals · revealClickCount                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. File chiave e responsabilità

| File                                                | Layer          | Responsabilità principale                                                                |
| --------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| `src/modules/orchestration/EmotionalEngine.ts`      | Emotional      | detectSignals, resolveState, smoothState, resolveStrategy, adaptBlocks, EmotionalProfile |
| `src/modules/orchestration/CognitiveStyleEngine.ts` | Cognitive      | deriveStyle, smoothStyle, mergeStrategy, buildStyleSection, recordModeUsage              |
| `src/modules/orchestration/SystemPromptBuilder.ts`  | Output         | assembla system prompt con sezioni emotional + style                                     |
| `src/hooks/useSmartChat.ts`                         | Orchestrazione | pipeline completa per turno, telemetria, aggiornamento store                             |
| `src/stores/useChatPrefsStore.ts`                   | Persistenza    | v3 — emotionalProfile, cognitiveStyle, signals, revealClickCount                         |
| `src/components/chat/SmartChat.tsx`                 | UI             | progressive reveal, REVEAL_LABEL, recordRevealClick                                      |
| `src/components/chat/InputBar.tsx`                  | UI             | PLACEHOLDER_MAP, auto-apply suggestions, tracking                                        |

---

## 4. Invarianti del sistema

**Non violare mai:**

1. `guidance === 'lead'` → il sistema entra in modalità sicurezza. Nessuna altra regola prevale.
2. `tone === 'reassuring'` → non modificare verso proattivo tramite style bias.
3. `smoothState` e `smoothStyle` → non bypassare mai i filtri di transizione.
4. Il merge engine ha gerarchia fissa: Emotion > Style Preference > Speed.
5. `adaptBlocks` non elimina MAI contenuto — usa solo `hidden: true` + reveal button.

---

## 5. Telemetria — eventi emessi

| Evento                      | Quando           | Payload chiave                                           |
| --------------------------- | ---------------- | -------------------------------------------------------- |
| `cognitive.style.updated`   | ogni turno       | structure, autonomy, speedPreference, exploration, turns |
| `chat.emotional.transition` | cambio di stato  | from, to, frustration, flow                              |
| `chat.emotional.signal`     | ogni turno       | state, tone, depth, guidance                             |
| `chat.response.completed`   | ogni turno       | mode, emotionalState, blocksShown, blocksTotal           |
| `merge.rule.applied`        | ogni turno (DEV) | rule, priority, emotional, structure, exploration        |
| `cognitive.style.drift`     | drift rilevato   | field, from, to (3 cambi consecutivi)                    |

---

## 6. Fase 4 — Explainability & Trasparenza (Fase 4)

### 6.1 `_debug` su `EmotionalStrategy`

Il campo opzionale `_debug?: { ruleApplied: string; priority: 1|2|3 }` è stato aggiunto all'interfaccia `EmotionalStrategy` (in `EmotionalEngine.ts`). Viene popolato da `mergeStrategy` **solo in `import.meta.env.DEV`**, garantendo che Vite lo escluda dal bundle di produzione tramite tree-shaking.

### 6.2 Regole tracciate da `mergeStrategy`

| Identificatore        | Trigger                                                  | Priority |
| --------------------- | -------------------------------------------------------- | -------- |
| `P1:safety`           | `guidance === 'lead'`                                    | 1        |
| `P2:structure-high`   | `style.structure === 'high'`                             | 2        |
| `P2:structure-low`    | `style.structure === 'low'`                              | 2        |
| `P2:exploration-high` | `style.exploration === 'high'`                           | 2        |
| `P2:autonomy-high`    | `style.autonomy === 'high' && depth === 'light'`         | 2        |
| `P2:suggest`          | `structure=high + autonomy=low + guidance=none`          | 2        |
| `P2:no-op`            | Nessuna regola P2 o P3 applicata                         | 2        |
| `P3:deliberate`       | `speedPreference === 'deliberate' && depth === 'medium'` | 3        |
| `P3:fast`             | `speedPreference === 'fast' && tone !== 'reassuring'`    | 3        |

Le regole si accumulano: es. `P2:structure-high + P2:exploration-high` indica che entrambe hanno modificato il risultato nello stesso turno.

### 6.3 `CognitiveDebugPanel`

Componente dev-only in `src/components/chat/CognitiveDebugPanel.tsx`.  
Attivazione: `?debug=cognitive` nella URL (solo in dev).

Mostra:

- **Emotional Profile** — `baselineState`, `adaptability`, `updateCount`
- **Cognitive Style** — tutti e 4 i campi (`structure`, `autonomy`, `speedPreference`, `exploration`)
- **Signals** — tutti i contatori raw da `CognitiveStyleSignals` + `revealClickCount`
- **Last Merge Rule** — aggiornato in real-time via `registerObserver` sull'evento `merge.rule.applied`

Il panel si registra come observer al mount e si deregistra all'unmount (pulizia garantita dal ritorni di `registerObserver`).

---

## 7. Commit history P38-P39.6 + Fase 4

| Commit     | Tag           | Contenuto                                                                           |
| ---------- | ------------- | ----------------------------------------------------------------------------------- |
| `a4003769` | P38.5+P38.6   | EmotionalEngine, learning layer, progressive reveal                                 |
| `ff228673` | stabilization | smoothState, REVEAL_LABEL, stronger profile influence                               |
| `9d976415` | P39           | CognitiveStyleEngine, store v3, applyStyleBias                                      |
| `3cfdbb4a` | P39.5         | smoothStyle, style-aware adaptBlocks, telemetria                                    |
| `dfc8f705` | P39.6         | mergeStrategy, lastPerceivedState, gerarchia esplicita                              |
| `1f1f6c59` | Fase 3        | Human-in-the-Loop: sliders override, feedback chips, drift alert                    |
| `(Fase 4)` | Fase 4        | `_debug` su EmotionalStrategy, `observe('merge.rule.applied')`, CognitiveDebugPanel |

---

## Appendice — P44.6: UIBlock Layer System

**Data:** 2026-03-23 | **Status:** implementato, stabile, 0 errori TS/lint

### Estensione della pipeline P39.6

A partire da P44.6 la pipeline è stata estesa con un **UIBlock Layer** che si interpone tra l'output del MergeEngine e il rendering finale:

```
… AdaptedStrategy
      └─▶ SystemPromptBuilder + adaptBlocks  →  risposta adattiva
            └─▶ UIBlock Layer (P44.6)
                  ├─▶ IntakeExpansion     keyword expand prima di buildPlan()
                  ├─▶ PlanEngine          → orbit_plan   (conf ≥ 0.65, index=1)
                  ├─▶ ExplainEngine       → explain      (max 2 items)
                  ├─▶ ConfidenceEngine    → confidence   (max 3 factors)
                  ├─▶ WorkSessionEngine   → work_session (se flusso attivo)
                  ├─▶ DecisionCard        → condizionale (!planPresent / score<0.7 / shouldShow)
                  └─▶ OrbitSuggestionEngine → ≤3 intent questions (domande soft)
```

### Gerarchia layer — NON NEGOZIABILE

```
Chat > PlanCard > DecisionCard > Orbit
```

| Layer        | UIBlock type    | Regola di attivazione                                         |
| ------------ | --------------- | ------------------------------------------------------------- |
| PlanCard     | `orbit_plan`    | `confidence ≥ 0.65` — sempre a `index=1` dell'array           |
| DecisionCard | `decision_card` | `!planPresent \|\| score < 0.7 \|\| explain.shouldShow`       |
| Orbit nudge  | —               | silenzioso se `decision_card`/`work_session` nei 3 ultimi msg |

### Invarianti P44.6 (aggiuntivi rispetto a P39.6)

5. Gerarchia layer `Chat > PlanCard > DecisionCard > Orbit` — non negoziabile
6. `orbit_plan` sempre a `index=1` dell'array UIBlock[] — non spostare
7. `DecisionCard` solo se `!planPresent || confidence.score < 0.7 || explain.shouldShow`
8. `OrbitDock` silenzioso se decision_card/work_session negli ultimi 3 messaggi assistant

### Hard limits cognitivi

| Modulo                     | Limite                   | Costante                  |
| -------------------------- | ------------------------ | ------------------------- |
| `ExplainEngine.ts`         | max 2 explaining items   | `items.slice(0, 2)`       |
| `ConfidenceEngine.ts`      | max 3 fattori            | `MAX_FACTORS = 3`         |
| `OrbitSuggestionEngine.ts` | max 3 suggerimenti       | `suggestions.slice(0, 3)` |
| `OrbitDock.tsx`            | max height drawer mobile | `MOBILE_PB = '30vh'`      |

### Intake keyword expansion

```ts
// useSmartChat.ts
const INTAKE_KEYWORDS = [
  "carica",
  "documento",
  "upload",
  "allega",
  "file",
  "programma",
  "programmazione",
];
// input breve con keyword → espandi prima di buildPlan()
const planInput =
  hasIntakeKw && trimmed.length < 20
    ? `${trimmed} — analizza e prepara un piano di lavoro`
    : trimmed;
```

### File chiave P44.6

| File                                             | Ruolo                                               |
| ------------------------------------------------ | --------------------------------------------------- |
| `src/hooks/useSmartChat.ts`                      | Pipeline 10-step: assembla UIBlock[]                |
| `src/modules/orchestration/ExplainEngine.ts`     | explain block, items capped at 2                    |
| `src/modules/orchestration/ConfidenceEngine.ts`  | confidence block, MAX_FACTORS=3                     |
| `src/modules/orchestration/WorkSessionEngine.ts` | work_session block unificato                        |
| `src/modules/orbit/OrbitSuggestionEngine.ts`     | ≤3 domande soft intent                              |
| `src/components/chat/MessageBlockRenderer.tsx`   | PlanCardBlock, DecisionCardBlock, WorkSessionBlock  |
| `src/components/orbit/OrbitDock.tsx`             | drawer, hasDecisionCard guard                       |
| `src/types/uiBlocks.ts`                          | discriminated union UIBlock + orbit_plan.steps type |

### Commit history P44.x

| Commit range | Tag              | Contenuto                                                                    |
| ------------ | ---------------- | ---------------------------------------------------------------------------- |
| P44.1        | Chat FAB         | `Fab` + `ChatIcon` sempre visibile su mobile in SmartChat.tsx                |
| P44.2        | OrbitDock        | `MOBILE_PB` `70vh` → `30vh`                                                  |
| P44.3        | PlanStep         | step type esteso con `action?` e `autoExecutable?`                           |
| P44.4        | OrbitSuggestion  | esteso con `predictedIntent?`                                                |
| P44.5        | UIBlock pipeline | DecisionCard, PlanCard activeStep, intake keywords, cognitive caps           |
| P44.6        | Layer hierarchy  | DecisionCard condizionale, orbit_plan inject diretto, Orbit intent questions |
