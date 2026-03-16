# 🚀 Roadmap Tecnica — DocenteDoc AI v2

**Data:** 16 Marzo 2026 | **Principio:** nessun big rewrite — ogni step è compatibile, rilasciabile e testabile.

---

## STEP 1 — Stabilizzazione Architettura

### Release 0.9 — "Foundation Stabilization"

**Obiettivo:** rendere il codice manutenibile e modulare.

### Interventi principali

#### Split del god hook `useAppEngine.ts`

```
src/hooks/
├── useNavigationEngine.ts    ← view transitions, history, deep links, smart prediction
├── useBackupEngine.ts        ← debounced IndexedDB save/restore
├── useDriveSyncEngine.ts     ← Google Drive upload/download
├── useTelemetryEngine.ts     ← OTel spans, AI interaction tracking
└── useNotificationEngine.ts  ← toast, notifiche, alert sistema
```

`useAppEngine.ts` rimane come thin composition root che importa i 5 hook.

#### Introduzione cartella `src/core`

```
src/core/
├── types/        ← tipi condivisi cross-feature (View, NavigationParams, AppEvents…)
├── utils/        ← utility pure senza dipendenze di dominio
└── constants/    ← costanti globali (sostituisce src/constants/ sparso)
```

#### Consolidamento dei types globali

- Merge `src/types.ts` (874 righe) in `src/types/index.ts`
- Spostare `View` union in `src/core/types/navigation.types.ts`
- Rimuovere definizioni inline dal barrel

#### Riduzione `any`

- Definire `NKAUserContext` per tutta la cartella `src/nka/`
- Tipare `google`/`gapi` globals in `googleDriveService.ts`
- Rimuovere blanket `eslint-disable` su `nka/` e `design-system/index.ts`

### Risultati attesi

- Codice più leggibile e navigabile
- Ogni hook testabile in isolamento
- Base pronta per l'introduzione degli eventi

**Effort stimato:** 1–2 settimane

---

## STEP 2 — Event Bus Interno

### Release 1.0 — "Event Driven Core"

**Obiettivo:** introdurre il cuore dell'architettura evolutiva — disaccoppiamento tra moduli tramite eventi tipizzati.

### Nuovo modulo: `src/core/events`

```
src/core/events/
├── EventBus.ts         ← singleton bus (basato su mitt o implementazione custom)
├── EventTypes.ts       ← definizione tipizzata di tutti gli eventi dell'app
├── EventEmitter.ts     ← helper per emettere eventi con type safety
└── EventListener.ts    ← helper per sottoscriversi con cleanup automatico
```

### Contratto eventi (esempi)

```typescript
// EventTypes.ts
type AppEvents = {
  "lesson.created": { lesson: Lezione };
  "lesson.updated": { lesson: Lezione };
  "student.risk.changed": {
    studentId: string;
    level: "low" | "medium" | "high";
  };
  "ai.pipeline.completed": { className: string; result: UnifiedAIResult };
  "state.dirty": { source: StoreName };
  "backup.sync.requested": { trigger: "auto" | "manual" };
  "nav.transition": { from: View; to: View };
};
```

### Utilizzo

```typescript
// Emettere un evento
emit("lesson.created", { lesson: newLesson });

// Ascoltare un evento (in qualsiasi modulo)
on("lesson.created", (data) => handleLessonCreation(data));
```

### Risultati attesi

- Azioni propagate senza coupling diretto tra moduli
- Tracciabilità degli effetti collaterali
- Base per le automazioni dei Workflow del STEP 4

**Effort stimato:** 1 settimana

---

## STEP 3 — AI Orchestrator

### Release 1.1 — "Unified AI Layer"

**Obiettivo:** eliminare le 3 pipeline AI parallele (deprecated) e creare un unico punto di accesso all'AI.

### Nuovo modulo: `src/ai/orchestrator` _(espansione dell'esistente)_

```
src/ai/orchestrator/
├── AIOrchestrator.ts     ← entry point unico; sostituisce aiEngine + aiPipeline
├── PipelineRegistry.ts   ← catalogo di pipeline registrate per tipo di analisi
├── ModelRouter.ts        ← risolve il modello corretto (pro/flash) per ogni task
├── StreamingManager.ts   ← gestisce generateContentStream() via Gemini SDK
└── CacheManager.ts       ← cache IndexedDB TTL 24h, LRU 100 entries
```

### Flusso nuovo

```
Feature Component
    └── AIOrchestrator.run(pipelineId, context)
            ├── CacheManager.get(hash)   ← cache hit → risposta immediata
            ├── ModelRouter.resolve(tier) ← 'pro' | 'flash'
            ├── PipelineRegistry.get(id).execute(context)
            └── StreamingManager.stream() ← output incrementale verso UI
```

### Migrazione deprecati

- `src/ai/engine/aiEngine.ts` → **eliminato**, consumer migrati a `AIOrchestrator`
- `src/ai/pipeline/aiPipeline.ts` + `useAIPipeline.ts` → **eliminati**, NKA migrato
- `api/ai.ts` Anthropic path → rimosso (SDK rimosso da `package.json`)

### Risultati attesi

- Un unico punto per tutte le chiamate AI
- Caching persistente → riduzione costi Gemini API
- Streaming → perceived performance drasticamente migliorata
- Fallback modello automatico

**Effort stimato:** 1–2 settimane

---

## STEP 4 — Workflow Engine

### Release 1.2 — "Automated Workflows"

**Obiettivo:** le azioni del docente diffondono effetti automatici attraverso l'app — via eventi.

### Nuovo modulo: `src/core/workflows`

```
src/core/workflows/
├── WorkflowEngine.ts     ← legge eventi dal bus, esegue workflow registrati
├── WorkflowRegistry.ts   ← catalogo workflow per evento trigger
└── WorkflowExecutor.ts   ← esecuzione step sequenziale/parallela con retry
```

### Esempio workflow `lesson.created`

```typescript
WorkflowRegistry.register({
  trigger: "lesson.created",
  steps: [
    { id: "generate-summary", fn: generateLessonSummary, timeout: 10_000 },
    { id: "suggest-assessment", fn: suggestAssessment, timeout: 8_000 },
    { id: "update-analytics", fn: updateAnalytics, timeout: 2_000 },
    { id: "notify-copilot", fn: notifyCopilot, timeout: 1_000 },
  ],
});
```

### Altri workflow previsti

| Trigger                 | Steps automatici                                                       |
| ----------------------- | ---------------------------------------------------------------------- |
| `student.risk.changed`  | notifica docente, genera piano recupero suggestion, aggiorna dashboard |
| `uda.completed`         | genera report, aggiorna maturità score, suggerisce prossima UDA        |
| `backup.sync.requested` | salva IndexedDB, upload Drive, aggiorna stato UI                       |
| `nav.transition`        | aggiorna prediction model, trigger prefetch chunk adiacente            |

### Risultati attesi

- Automazioni intelligenti senza codice imperativo sparso in `useEffect`
- Workflow osservabili, loggabili e riproducibili
- Integrazione naturale con OTel tracing (ogni step è uno span)

**Effort stimato:** 1–2 settimane

---

## STEP 5 — Copilot Omnipresente

### Release 1.3 — "AI Companion"

**Obiettivo:** il Copilot diventa un layer reale dell'app — ascolta eventi, suggerisce azioni, spiega decisioni.

### Nuovo modulo: `src/copilot`

```
src/copilot/
├── CopilotProvider.tsx     ← context provider, monta il Copilot nell'albero React
├── CopilotActions.ts       ← azioni eseguibili su comando del Copilot
├── CopilotPredictions.ts   ← prossima azione probabile basata su pattern utente
└── CopilotInsights.ts      ← spiegazione decisioni AI in linguaggio naturale
```

### Flusso Copilot

```
EventBus
  └── event: 'lesson.created'
        └── CopilotProvider (listener)
              └── CopilotPredictions.suggest()
                    → "Vuoi generare una verifica per questa lezione?"
                    → [Genera verifica] [Ignora] [Ricordamelo dopo]
```

### Funzionalità Copilot

- **Ascolto eventi** — reagisce a qualsiasi evento del bus (lesson, student, uda, backup…)
- **Suggerimenti contestuali** — proattivi, non invasivi, basati su contesto corrente
- **Spiegazione decisioni AI** — "Perché questo studente è a rischio?" con evidence bullets
- **Azioni one-click** — esegue workflow senza navigare via

### Risultati attesi

- Docente guidato dall'AI senza dover cercare funzioni
- Copilot come primo punto di contatto per complessità
- Accessibilità cognitiva: l'app "si spiega da sola"

**Effort stimato:** 2 settimane

---

## STEP 6 — Plugin System

### Release 2.0 — "AI Education Platform"

**Obiettivo:** trasformare DocenteDoc in una piattaforma AI educativa estensibile da terze parti.

### Nuovo modulo: `src/plugins`

```
src/plugins/
├── PluginRegistry.ts     ← registerPlugin(), validateManifest(), sandbox
├── PluginLoader.ts       ← lazy loading, isolamento contesto
└── PluginSDK.ts          ← API pubblica esposta ai plugin (eventi, store read-only, actions)
```

### Esempi plugin

```
plugin-google-classroom/      ← sync classi e compiti con Google Classroom
plugin-ai-quiz-generator/     ← generazione quiz adattivi con Gemini
plugin-student-feedback/      ← raccolta feedback studenti con analisi sentiment
plugin-analytics-advanced/    ← dashboard metriche avanzate per dirigenti
```

### Contratto plugin

```typescript
interface PluginManifest {
  id: string
  version: string
  permissions: PluginPermission[]   // 'read:students' | 'write:lessons' | 'subscribe:events'
}

// Ogni plugin implementa:
registerPlugin(manifest: PluginManifest): void
subscribeEvents(events: AppEventKey[]): void
exposeActions(actions: PluginAction[]): void
```

### Risultati attesi

- DocenteDoc diventa piattaforma AI educativa
- Ecosistema plugin di terze parti (scuole, editori, MIUR)
- Monetizzazione marketplace plugin
- Certificazione PA facilitata per plugin verificati

**Effort stimato:** 2–3 settimane

---

## Timeline Realistica

| Fase                         | Release | Durata      | Cumulativo |
| ---------------------------- | ------- | ----------- | ---------- |
| Stabilizzazione architettura | 0.9     | 2 settimane | 2 sett.    |
| Event Bus                    | 1.0     | 1 settimana | 3 sett.    |
| AI Orchestrator              | 1.1     | 2 settimane | 5 sett.    |
| Workflow Engine              | 1.2     | 2 settimane | 7 sett.    |
| Copilot Layer                | 1.3     | 2 settimane | 9 sett.    |
| Plugin System                | 2.0     | 3 settimane | 12 sett.   |

**Totale: 10–12 settimane** per trasformare l'app in piattaforma AI evolutiva.

---

## Dipendenze tra Step

```
STEP 1 (Foundation)
  └── STEP 2 (Event Bus)
        ├── STEP 4 (Workflow Engine)  ← richiede eventi
        │     └── STEP 5 (Copilot)   ← richiede workflow
        └── STEP 3 (AI Orchestrator) ← indipendente da Workflow
              └── STEP 5 (Copilot)   ← usa orchestrator per AI
                    └── STEP 6 (Plugin System) ← costruisce su tutto
```

---

## Principio Fondamentale

> **Non esiste big rewrite.**

Ogni step è:

- ✅ **Compatibile** con il codice esistente — nessun breaking change
- ✅ **Rilasciabile** in produzione in modo incrementale
- ✅ **Testabile** in isolamento prima del merge

La strategia è additive-first: si aggiunge il nuovo layer, si migrano i consumer gradualmente, si rimuove il vecchio codice solo dopo che il nuovo è validato in produzione.

---

_End of Technical Roadmap — DocenteDoc AI v2, 16 Marzo 2026_
