# Cognitive Architecture P39.6 — DocenteDoc AI

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

| Evento                      | Quando          | Payload chiave                                           |
| --------------------------- | --------------- | -------------------------------------------------------- |
| `cognitive.style.updated`   | ogni turno      | structure, autonomy, speedPreference, exploration, turns |
| `chat.emotional.transition` | cambio di stato | from, to, frustration, flow                              |
| `chat.emotional.signal`     | ogni turno      | state, tone, depth, guidance                             |
| `chat.response.completed`   | ogni turno      | mode, emotionalState, blocksShown, blocksTotal           |

---

## 6. Commit history P38-P39.6

| Commit     | Tag           | Contenuto                                              |
| ---------- | ------------- | ------------------------------------------------------ |
| `a4003769` | P38.5+P38.6   | EmotionalEngine, learning layer, progressive reveal    |
| `ff228673` | stabilization | smoothState, REVEAL_LABEL, stronger profile influence  |
| `9d976415` | P39           | CognitiveStyleEngine, store v3, applyStyleBias         |
| `3cfdbb4a` | P39.5         | smoothStyle, style-aware adaptBlocks, telemetria       |
| `dfc8f705` | P39.6         | mergeStrategy, lastPerceivedState, gerarchia esplicita |
