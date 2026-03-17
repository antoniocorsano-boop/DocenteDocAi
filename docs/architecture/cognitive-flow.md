# Architettura Flusso Cognitivo — Copilot Evolutivo

## Principio Fondante

```
Evento → Insight → Suggestione → Azione → Apprendimento → Evoluzione
```

---

## Diagramma High-Level

```
[USER ACTION]
     ↓
[EventEmitter / Hook]
     ↓
[CognitionBus]                          src/cognition/CognitionBus.ts
     ↓
┌──────────────────────────────┐
│        COGNITION LAYER       │
├──────────────────────────────┤
│ - eventMap.ts                │        src/cognition/eventMap.ts
│ - WorkflowPatternDetector    │        src/cognition/WorkflowPatternDetector.ts
│ - UsageTracker               │        src/cognition/UsageTracker.ts
│ - CapabilityEngine           │        src/cognition/CapabilityEngine.ts
└──────────────────────────────┘
     ↓
[INSIGHT GENERATION]
     ↓
┌──────────────────────────────┐
│      SUGGESTION LAYER        │
├──────────────────────────────┤
│ - SuggestionEngine           │        src/cognition/SuggestionEngine.ts
│ - CopilotPredictions         │        src/copilot/CopilotPredictions.ts
│ - ArtisticConsilium          │        src/services/ArtisticConsilium.ts
└──────────────────────────────┘
     ↓
[SUGGESTIONS ARRAY (max 3)]
     ↓
┌──────────────────────────────┐
│           UI LAYER           │
├──────────────────────────────┤
│ - CopilotActionsBar          │        src/components/copilot/CopilotActionsBar.tsx
│ - CopilotDocentePanel        │        src/components/CopilotDocentePanel.tsx
│ - ArtisticConsiliumPanel     │        src/components/copilot/ArtisticConsiliumPanel.tsx
│ - JourneyProgressPanel       │        src/components/journey/JourneyProgressPanel.tsx
└──────────────────────────────┘
     ↓
[USER ACTION (CTA)]
     ↓
[CognitionBus.emit()]
     ↓
(LOOP CONTINUA)
```

---

## Dettaglio Flusso

### 1. Evento Utente

Esempi di eventi:

- `class.first_student_added`
- `workspace.configured`
- `book.account.linked`
- `uda.created`
- `artistic.suggestions.generated`

Trigger nel codice:

```ts
cognitionBus.emit("workspace.configured", payload);
```

Il catalogo completo degli eventi è in `src/cognition/eventMap.ts`.

---

### 2. Cognition Layer

#### WorkflowPatternDetector (`src/cognition/WorkflowPatternDetector.ts`)

Rileva sequenze comportamentali su buffer temporale (3h).  
Esempio:

```
session.started → workspace.configured → onboardingWorkflow
```

#### CapabilityEngine (`src/cognition/CapabilityEngine.ts`)

Calcola il livello del docente e la progressione nel journey:

| Livello numerico | JourneyLevel |
| ---------------- | ------------ |
| 1                | esploratore  |
| 2                | praticante   |
| 3–4              | maestro      |

Funzioni chiave: `toJourneyLevel(capabilityLevel)`, `computeJourneyProgress(model)`.

#### UsageTracker (`src/cognition/UsageTracker.ts`)

Ascolta eventi dal bus e aggiorna il profilo di utilizzo (`usageProfile`) nello store:

- `featuresDiscovered`
- `bookServicesLinked`
- `workspaceConfigured`
- +1 `featuresDiscovered` su `artistic.suggestions.generated`

---

### 3. Insight

Output tipico dal CapabilityEngine / WorkflowPatternDetector:

```ts
{
  type: 'workflow_detected',
  pattern: 'onboardingWorkflow',
  confidence: 0.8,
}
```

---

### 4. Suggestion Layer

#### SuggestionEngine (`src/cognition/SuggestionEngine.ts`)

Aggrega suggerimenti da:

- **CATALOGUE** statico filtrato per livello, punteggio AI, cooldown, personalMode
- **ArtisticConsilium** (async, solo praticante/maestro)

Funzioni esposte:

- `generateNextActions(ctx: SuggestionContext)` → sincrono, max 3 dal catalogo
- `generateArtisticNextActions(ctx: SuggestionContext)` → asincrono, chiama il pipeline AI artistico

#### CopilotPredictions (`src/copilot/CopilotPredictions.ts`)

Suggerimenti operativi (quick-actions) mostrati nella `CopilotActionsBar`.  
Shape: `{ id, label, description?, actionKey, actionPayload?, priority }`.

#### ArtisticConsilium (`src/services/ArtisticConsilium.ts`)

Pipeline creativa/educativa: genera attività artistiche contestuali tramite AI.

- `generateArtisticSuggestions(context: ArtisticContext)` → async, chiama Gemini/Anthropic
- `getQuickArtisticHint(udaTitle?)` → sincrono, hint rapido per la CopilotActionsBar
- `initArtisticConsilium(onHint)` → idempotente, registra 5 handler sul CognitionBus

---

### 5. Output Suggerimenti

```ts
// Formato CopilotPredictions (chip bar / hint)
{
  id: 'artistic.quick.1234',
  label: 'Attività artistiche creative',
  actionKey: 'artistic.open',
  actionPayload: {},
  priority: 2,
}

// Formato teacherModel (nextActions / journey)
{
  id: 'sug-artistic.ai.a1',
  type: 'feature',
  message: 'Mosaico storico (60 min) — Crea un mosaico visivo…',
  targetView: 'copilot',
  icon: 'palette',
}
```

---

### 6. UI Layer

| Componente               | Ruolo                                            |
| ------------------------ | ------------------------------------------------ |
| `CopilotActionsBar`      | Chip rapide con `actionKey` → navigazione/azione |
| `CopilotDocentePanel`    | 14 tab specializzati (incluso "Artistico")       |
| `ArtisticConsiliumPanel` | Generazione guidata attività creative            |
| `JourneyProgressPanel`   | Progressione livello + `nextActions`             |

---

### 7. Azione Utente → Chiude il Loop

Quando l'utente esegue un'azione (es. crea una UDA):

```ts
cognitionBus.emit("uda.created", { udaId: "u-42" });
```

→ WorkflowPatternDetector registra il pattern  
→ UsageTracker aggiorna il profilo  
→ CapabilityEngine rivaluta il livello  
→ SuggestionEngine genera nuovi suggerimenti  
→ UI si aggiorna (tramite `useJourneyProgress`)

---

## Integrazione ArtisticConsilium

```
Evento rilevato (uda.created / planning.wizard.completed / …)
     ↓
initArtisticConsilium → onHint callback
     ↓
CopilotActionsBar mostra hint
     ↓
Utente apre tab "Artistico"
     ↓
useJourneyProgress: generateArtisticNextActions(ctx)
     ↓
ArtisticConsilium.generateArtisticSuggestions(context)   [AI pipeline]
     ↓
Results → ArtisticConsiliumPanel (cards con materiali, durata, tipo)
     ↓
cognitionBus.emit('artistic.suggestions.generated', { count, subject, gradeLevel })
     ↓
UsageTracker: featuresDiscovered + 1
```

---

## Adattività UX

| Livello                  | JourneyLevel | Comportamento UI                          |
| ------------------------ | ------------ | ----------------------------------------- |
| 1 — Base                 | esploratore  | Suggerimenti guidati + discovery card     |
| 2 — Operativo            | praticante   | Workflow suggeriti + nextActions visibili |
| 3-4 — Avanzato/Sistemico | maestro      | Automazioni + orchestrazione              |

Il `Home.tsx` mostra contenuti differenti per livello:

- `esploratore` → banner discovery "AI Artistica Educativa"
- `praticante` → sezione "Suggerimenti contestuali" (nextActions)
- `maestro` → sezione "Automazioni suggerite" (nextActions)

---

## Regole Fondamentali

1. **Mai più di 3 suggerimenti** (`[...static, ...artistic].slice(0, 3)`)
2. **Ogni suggerimento deve avere `actionKey`** (per tracciabilità e navigazione)
3. **Nessuna azione automatica invisibile** (ogni azione richiede conferma utente)
4. **Sempre tracciamento eventi** (ogni interazione passa per CognitionBus)
5. **Progressione esplicita e percepibile** (JourneyProgressPanel sempre visibile)

---

## Hook di Connessione

```
useJourneyProgress()                    src/hooks/useJourneyProgress.ts
   ├─ useTeacherModelStore (capabilityLevel, model)
   ├─ useAIMaturitaStore (interactionMode, globalScore)
   ├─ generateNextActions(ctx)          sync → catalogo statico
   └─ generateArtisticNextActions(ctx)  async → AI pipeline
         └─ merged → nextActions (max 3)
```

---

## Estensioni Future

- **Segreteria intelligente** — auto-task orchestration per adempimenti burocratici
- **Sistema psico-cognitivo** — modellazione di affaticamento e motivazione del docente
- **Sistema scientifico** — analisi longitudinale dei dati di apprendimento
- **Meta-layer etico e culturale** — bias detection, inclusività, pluralismo pedagogico

---

## Motto del Sistema

```
Non imponere.
Suggerire.
Accompagnare.
Elevare.
```
