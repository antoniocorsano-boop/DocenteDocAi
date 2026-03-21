# Orbit System Audit — Analisi Critica Completa

_Data: 2026-03-21 | Scope: UI Identity System Multi-Agente P16–P21_

---

## 1. ARCHITETTURA GENERALE

### Struttura effettiva

```
theme/                          ← Layer 1: pure data/logic (no React)
  orbitTokens.ts                  design tokens, density, motion
  orbitStates.ts                  macro-states, adaptive presence (P16)
  cognitiveLoad.ts                cognitive load balancer (P17a)
  agentPersonality.ts             personality profiles (P17b)
  presenceEngine.ts               fusion engine: P16+P17+P18

modules/orbit/
  orbitEngine.ts                  barrel API (re-exports only)
  attentionRouter.ts              P18 — election + throttle
  coordinationEngine.ts           P19 — action sequence
  executionEngine.ts              P20 — handler registry
  narrativeLayer.ts               P21 — Italian status text
  agentMapper.ts                  flows → ActiveAgent[]

modules/orchestration/
  patternDetector.ts              P16 behavior signals from log
  skillRegistry.ts                skill routing

components/ui/
  JarvisNexus.tsx                 command center UI
  JarvisIndicator.tsx             inline ambient indicator

components/workspace/
  UserWorkspace.tsx               root: wires all layers + hooks

hooks/
  useOrbitSession.ts              60s polling → OrbitSession
  useThumbMenu.ts                 ThumbMenu + action execution
  useSkillSuggestion.ts           emergent skill loop
  useAutoSettingsEngine.ts        adaptive config
```

### Punti forti

- Separazione netta tra logica pura (`theme/` + `modules/orbit/`) e UI (`components/`).
- Tutti i moduli P16–P21 sono funzioni pure, senza React, testabili in isolamento.
- `orbitEngine.ts` come barrel stabile evita import drift.
- MD3 Gold Compliant in `JarvisNexus` (M3Surface, token).

### Problemi identificati

**[A1] `UserWorkspace.tsx` è una God Component.**
Il file gestisce: ingest input, file upload, landing routing, idle timer, demo seeding, context takeover, ThumbMenu, Jarvis presence, pipeline P16–P21 completa, trust store, skills store, flow store, settings engine. Stimato ~800–1000 righe. Qualsiasi modifica tocca l'intero sistema.

**[A2] Nessun single source of truth per la pipeline cognitiva.**
Lo stato della pipeline (cognitiveLoad, attentionMap, coordinationActions) è derivato ad ogni render nel component, non persiste in un store dedicato. Se due componenti diversi vogliono leggere l'`attentionMap` corrente non esiste un punto unico.

**[A3] `resolveScheduleContext()` chiama `useAcademicStore.getState()` direttamente come utility.**
Usata dentro `UserWorkspace` non come hook ma come funzione pura. Se chiamata fuori dal ciclo React (es. in un callback) è safe, ma invita confusione tra hook e funzioni pure.

**[A4] Layer 4 in `presenceEngine.ts` è dormiente.**
Documentato come "hook per il futuro" ma `isPrimaryContext` è sempre `true`. Codice morto con intenzione documentata = debito tecnico.

---

## 2. PIPELINE COGNITIVA P16–P21

### Analisi per livello

| Livello                        | Funzione                                    | Qualità | Problema                                                                                                                              |
| ------------------------------ | ------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **P16** patternDetector        | In-memory log, intent/complexity heuristic  | Buona   | log non persistito → freddo a ogni reload                                                                                             |
| **P17a** cognitiveLoad         | Score-based 4-tier, puro                    | Ottima  | nessuno grave                                                                                                                         |
| **P17b** presenceEngine fusion | P16+personality+load chain                  | Buona   | Layer 4 dormiente (P18 non integrato nella fusion)                                                                                    |
| **P18** attentionRouter        | Score-based election, throttle 400ms        | Ottima  | throttle su `_lastEventTs` module-level → non isola sessioni parallele                                                                |
| **P19** coordinationEngine     | Deterministic, capability-gated             | Ottima  | `AGENT_CAPABILITIES` hardcoded, impossibile estendere a runtime                                                                       |
| **P20** executionEngine        | Registry pattern, lifecycle TaskState       | Buona   | `analyze`, `plan`, `observe`, `handoff`, `idle` handler sono no-op → pipeline eseguita senza side-effect reale per 5/7 tipi di azione |
| **P21** narrativeLayer         | Pure, Italian copy, `generateRichNarrative` | Ottima  | nessuno grave                                                                                                                         |

### Problemi di coerenza tra livelli

**[P1] P20 inutile per 5/7 action types.**
I handler `analyze`, `plan`, `observe`, `handoff`, `idle` emettono solo log (opzionale). Solo `execute` (→ `ORBIT_RUN_TASK`) e `explain` (→ `ORBIT_SHOW_EXPLANATION`) producono side-effect. La pipeline P19→P20 raramente produce conseguenze tangibili quando l'intent è `learn` o `explore`.

**[P2] P18 attention routing non alimenta la fusion presenceEngine.**
In `UserWorkspace`, `coordinateAgents` riceve agenti con `attention` derivato dall'`attentionMap`, ma la `FinalPresenceInput` non passa l'`attentionMap` al fusion engine (Layer 4 dormiente). Il routing P18 è eseguito due volte in posti diversi senza coerenza.

**[P3] `patternDetector._log` è singleton module-level, non per-tenant.**
Se in futuro ci fossero due tenant nello stesso tab (demo mode), condividono il log comportamentale.

**[P4] Ridondanza presenceEngine/UserWorkspace.**
`UserWorkspace` chiama separatamente `computeCognitiveLoad`, `resolveDominantPersonality`, `resolveAttention`, `coordinateAgents`, `runExecutionPipeline`, `generateRichNarrative`. La `presenceEngine.resolveFinalPresence` fa un subset delle stesse cose → stessa logica eseguita due volte per render.

---

## 3. PERFORMANCE

### Problemi identificati

**[PERF1] — CRITICO: Pipeline P16–P21 ricalcolata ad ogni render di `UserWorkspace`.**

```tsx
// Ogni render → ricalcola (non memoizzato):
const behaviorSignals = getBehaviorSignals()         // scansiona _log in memoria
const cogLoad         = computeCognitiveLoad(...)    // score calc
const personality     = resolveDominantPersonality() // find+compare
const attentionMap    = resolveAttention(...)        // sort+rank N agenti
const coordActions    = coordinateAgents(...)        // regole priority
const narrative       = generateRichNarrative(...)   // string gen
```

Con Zustand subscriptions multiple in `UserWorkspace`, i re-render sono frequenti.

**[PERF2] Idle timer: `mousemove` su document fiora 60×/s, ogni evento chiama `setProactiveIdle(false)` + setState.**

```tsx
// Pattern problematico: resetIdleTimer cambia quando entries.length cambia
useEffect(() => {
  const EVENTS = ["mousemove", "keydown", "click", "touchstart"];
  EVENTS.forEach((ev) =>
    document.addEventListener(ev, resetIdleTimer, { passive: true }),
  );
  return () =>
    EVENTS.forEach((ev) => document.removeEventListener(ev, resetIdleTimer));
}, [resetIdleTimer]); // → re-attachment continuo su mobile
```

**[PERF3] JarvisNexus: 3 CSS `@keyframes` definiti inline nell'`sx` prop per ogni ring orbital.**
MUI inietta stili JS → CSS ad ogni re-render quando `agentMotionMultiplier` cambia.

**[PERF4] `SimulationEngine` usa `setTimeout` sequenziali con durate potenzialmente molto elevate.**
Con `speedMultiplier=1` e `event.duration=45min` → `holdMs=2.7M ms`. Loop bloccato per ore se `speedMultiplier` basso.

### Fix raccomandati

```typescript
// [Fix PERF1] Memoizza la pipeline cognitiva
const cognitiveState = useMemo(() => {
  const behavior = getBehaviorSignals();
  const load = computeCognitiveLoad({ ...behavior, activeAgentsCount: agents.length, ... });
  const attention = resolveAttention({ agents: mappedAgents, cognitiveLoad: load, now: Date.now() });
  const actions = coordinateAgents({ agents: attentionAgents, userIntent: behavior.userIntent });
  return { load, attention, actions, narrative: generateRichNarrative(actions, agents) };
}, [agents, entries.length, viewportWidth, ambientFiredCount]);

// [Fix PERF2] Throttle il mousemove
const lastMoveRef = useRef(0);
const resetIdleTimer = useCallback(() => {
  const now = Date.now();
  if (now - lastMoveRef.current < 200) return; // 5fps max
  lastMoveRef.current = now;
  // ... resto della logica
}, []); // zero dipendenze React, refs usate direttamente
```

### Impatto mobile/PWA

Su tablet Android low-end (Chromebook scuola), la combinazione pipeline non memoizzata + idle timer aggressivo può causare frame drop visibili. Target PA = dispositivi entry-level.

---

## 4. COSTI TOKEN/API

### Analisi del flusso

Il sistema Orbit non chiama direttamente API AI. Tutte le chiamate passano per `api/ai.ts` (Vercel Edge proxy). Il cognitive layer `ingestInput()` può triggerare l'Edge Function a seconda del `inputType`.

**[COST1] — CRITICO: La simulazione chiama AI reale senza throttle.**
`SimulationEngine` → `JarvisSimulator.processEvent()` → `ingestInput()` per ogni evento del DayPlanner. Con 20 eventi in un day planner, una sessione demo consuma 20 chiamate AI. Con `speedMultiplier=60` la giornata si simula in minuti ma tutte le chiamate partono ugualmente.

**[COST2] Nessun token budget tracking.**
Non esiste un `tokenUsageStore` o rate-limiter lato client.

**[COST3] Nessun cache per cognitive entries duplicati.**
`ingestInput` processa ogni submission come nuova, inclusi duplicati.

### Architettura low-cost raccomandata

```
Input → Hash check (SHA-256) → se già processato → usa cached result
Input → Local heuristic classifier → se confidence > 0.8 → skip AI call
Input → Rate limiter (max N AI calls/ora per tier) → queue remainder
Simulation → modalità "mock" con bypassAI:true su ingestInput
```

---

## 5. PRIVACY E SICUREZZA

### Inventario dati in localStorage

| Chiave                       | Contenuto                                 | Rischio                                            |
| ---------------------------- | ----------------------------------------- | -------------------------------------------------- |
| `kg_enterprise_staged_v1`    | KG write record, nodi normativi, tenantId | **ALTO** — dati GDPR/DPIA potenzialmente sensibili |
| `kg_enterprise_committed_v1` | Dati committati                           | **ALTO**                                           |
| `cognitive_store_*`          | Testo libero del docente                  | MEDIO                                              |
| `trust_store_v*`             | Metriche fiducia agente                   | BASSO                                              |
| `emergent_skills_*`          | Pattern comportamentali                   | BASSO                                              |

**[SEC1] — CRITICO: `kgEnterpriseBridge` salva dati normativi sensibili in localStorage non cifrato.**
In contesti PA questi possono includere DPIA, violazioni GDPR, documenti normativi. Prerequisito per qualificazione AGID: misure di sicurezza adeguate anche per dati locali.

**[SEC2] Input non sanitizzato esplicitamente in `UserWorkspace`.**

```tsx
// Nessuna sanitization oltre trim():
const handleIngest = (content: string) => {
  await ingestInput({ content: content.trim(), ... });
}
// Rischio XSS injection nel cognitive store e nel patternDetector log
```

**[SEC3] `JarvisSimulator` riceve `tenantId` come parametro costruttore.**
Se istanziato con un tenantId forged, scrive nel cognitive store di quel tenant.

**[SEC4] CSP vs MUI style injection.**
MUI v7 inietta `<style>` tag dinamici → potrebbe richiedere `style-src 'unsafe-inline'` o nonces. Verificare che il CSP di `vercel.json` non blocchi MUI in produzione.

### Fix raccomandati

```typescript
// Input sanitization
function sanitizeUserInput(raw: string): string {
  return raw
    .replace(/[<>]/g, "") // strip HTML brackets (XSS prevention)
    .trim()
    .slice(0, 10_000); // max length
}

// Cifatura localStorage per dati sensibili (WebCrypto AES-GCM)
// Key derivata da session token — non da chiave hardcoded
const encryptedValue = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  sessionKey,
  encoder.encode(JSON.stringify(sensitiveData)),
);
```

---

## 6. PWA / MOBILE READINESS

### Status attuale

| Elemento                                                     | Stato |
| ------------------------------------------------------------ | ----- |
| `manifest.webmanifest` (Orbit brand, shortcuts)              | ✅    |
| Service worker via `vite-plugin-pwa`                         | ✅    |
| `orbit-icon.svg` come PWA icon                               | ✅    |
| `display_override: ["window-controls-overlay","standalone"]` | ✅    |

### Gap identificati

**[PWA1] Strategia caching del service worker non verificata.**
`src/sw.ts` non è stato letto in questa analisi. Critico: una risposta AI cacheata per errore può mostrare dati di un utente precedente. Le route `/api/ai` devono essere `NetworkOnly`.

**[PWA2] Google Fonts Orbit (Barlow Condensed/Barlow) caricate da CDN.**
In modalità offline il font non carica → degradation visiva. Devono essere auto-hosted in `public/fonts/`.

**[PWA3] `useOrbitSession` poll ogni 60s con `setInterval`.**
Su PWA in background, i browser throttlano i timer → OrbitSession non si aggiorna quando il docente torna sull'app dopo una lezione.

**[PWA4] `SimulationEngine` usa `setTimeout` con durate >30s.**
iOS/Safari ha hard limit a 5min per timer in background → simulazione si interrompe.

**[PWA5] Nessuna strategia offline per `ingestInput`.**
Il cognitive store è in localStorage (funziona offline) ma `ingestInput` chiama l'Edge Function → fallisce silenziosamente offline senza queue/retry.

### Fix raccomandati

```typescript
// src/sw.ts — aggiungere:
// 1. NetworkOnly per /api/ai (mai cachare risposte AI)
// 2. CacheFirst per font + assets statici
// 3. Background Sync per ingestInput offline → IndexedDB queue → sync quando online
```

---

## 7. MODELLO MULTI-AGENTE

### Valutazione critica

**Gli "agenti" sono profili comportamentali della UI, non AI agents autonomi reali.**

```typescript
// Capability map reale:
AGENT_CAPABILITIES = {
  analyst: ["analyze", "plan"], // handler: solo logger
  executor: ["execute"], // handler: dispatch ORBIT_RUN_TASK ← unico side-effect reale
  mentor: ["explain", "plan"], // handler: dispatch ORBIT_SHOW_EXPLANATION
  observer: ["observe"], // handler: no-op
};
```

**[MA1] Analyst, mentor, observer sono simulati, non operativi.**
Solo `executor` produce un side-effect reale (`ORBIT_RUN_TASK`). Il sistema multi-agente è un router visivo/narrativo attorno a una singola azione eseguibile.

**[MA2] Agenti attivi = flow Orbit (skill automatizzate), non AI agents con stato proprio.**
`agentMapper.flows→Active Agent[]`. Non esiste memoria per-agente, non esiste ragionamento autonomo.

**[MA3] Handoff P19 è narrativo, non funzionale.**
Il "trasferimento" non porta contesto o stato da un agente all'altro.

**[MA4] Nessun conflict resolution per esecutori multipli.**
`dedupeActions()` filtra per `(agentId, type)` ma non per `type` solo → due executor diversi eseguirebbero `execute` entrambi.

### Cosa serve per agenti realmente indipendenti

```
Attuale:  flows[] → personality profiles → attention/coordination/execution
          (tutto in 1 render cycle, sincrono, no agent state)

Necessario:
  Agent instances con stato proprio (goal, memory, tool access)
  Message passing asincrono inter-agent
  Rollback/compensazione se un agente fallisce
  Supervisore che valuta output prima di renderizzare
```

---

## 8. ROBUSTEZZA E AFFIDABILITÀ

### Punti positivi

- `runExecutionPipeline`: cattura errori per-action, pipeline continua.
- `kgEnterpriseBridge.safeJSON/safeStore`: silent fallback su localStorage quota o parse error.
- `JarvisSimulator.processEvent`: `try/catch` su `ingestInput` → simulazione continua.

### Problemi identificati

**[ROB1] `UserWorkspace` senza error boundary proprio.**
Se uno store Zustand corrompe il suo stato, la componente crasha l'intera app. `AITabErrorBoundary` esiste per `CopilotDocentePanel`, nessuna protezione equivalente per `UserWorkspace`.

**[ROB2] `cognitiveStore.subscribe` triggerà re-render ad ogni update del store.**

```tsx
useEffect(() => {
  const refresh = () =>
    setEntries(useCognitiveStore.getState().listRecent(20, tenantId));
  refresh();
  return useCognitiveStore.subscribe(refresh); // ogni update → re-render UserWorkspace
}, [tenantId]);
```

Con simulazione a `speedMultiplier=60` → 20 eventi in pochi secondi → 20 re-render in rapida successione.

**[ROB3] `shouldProcessEvent._lastEventTs` è module-level.**
Condiviso tra tutti i chiamanti → throttle indesiderato se usato da più context.

**[ROB4] `SimulationEngine.run()` senza timeout fallback.**
Se `ingestInput` non si risolve (rete irraggiungibile), il loop si blocca indefinitamente. Manca `Promise.race` con timeout.

---

## 9. UX E COMPRENSIBILITÀ

### Punti positivi

- Narrativa italiana contestuale accessibile al docente medio.
- 4 macro-state con `ariaLabel` per screen reader.
- `cognitiveLoad === 'critical'` → Jarvis silenzioso = auto-protezione da overload.

### Problemi identificati

**[UX1] Nessun feedback di transizione tra stati Jarvis.**
Il docente vede solo il cambio colore/animazione dell'orb senza capire la causa.

**[UX2] Auto-toast `setAutoToastLabel` sparisce dopo 3000ms senza possibilità di interazione.**
Se il docente non guarda lo schermo, non sa che Jarvis ha agito.

**[UX3] ThumbMenu radiale è pattern insolito per utenti italiani PA.**
Potenziale barriera di adozione per docenti abituati a menu lineari.

**[UX4] `proactiveIdle` dopo 4s è aggressivo per contesti di classe.**
Il docente guarda la lavagna, non lo schermo. Il timer dovrebbe essere configurabile (default PA: 15–30s).

**[UX5] Shortcut `Ctrl+Shift+J` senza tooltip visivo.**
L'utente deve conoscere la shortcut — nessuna affordance visibile.

---

## 10. MANUTENIBILITÀ E SCALABILITÀ

### Codice duplicato identificato

| Pattern duplicato                                 | File 1              | File 2               | Azione                                       |
| ------------------------------------------------- | ------------------- | -------------------- | -------------------------------------------- |
| `relativeTime()`                                  | `JarvisNexus.tsx`   | `UserWorkspace.tsx`  | Estrarre in `utils/displayHelpers.ts`        |
| `DOMAIN_COLOR` / `DOMAIN_CHIP_COLOR`              | `JarvisNexus.tsx`   | `UserWorkspace.tsx`  | Unificare e importare                        |
| `resolveScheduleContext` / `buildScheduleContext` | `UserWorkspace.tsx` | `useOrbitSession.ts` | Unica funzione in `utils/scheduleContext.ts` |

### Complessità ciclomatica stimata

| File                    | Branches stimate | Soglia raccomandata | Status        |
| ----------------------- | ---------------- | ------------------- | ------------- |
| `UserWorkspace.tsx`     | ~40+             | ≤10 per funzione    | 🔴 CRITICO    |
| `coordinationEngine.ts` | ~12              | ≤15                 | 🟡 ATTENZIONE |
| `patternDetector.ts`    | ~8               | ≤15                 | ✅ OK         |

### Refactor raccomandato

```typescript
// Estrarre da UserWorkspace in hooks dedicati:

useOrbitPipeline();
// → input: agents, entries, viewportWidth, ambientFiredCount
// → output: { cogLoad, attentionMap, actions, narrative }
// → memoizzato, testabile in isolamento

useIdleDetection({ onIdle, onActive, idleMs });
// → gestisce tutti i listener document
// → timeout configurabile

useLandingRouter();
// → decodeLandingType, resolveScheduleContext, activeLanding state
// → orchestrata indipendentemente dalla pipeline cognitiva

useJarvisActionLoop();
// → auto-execute + toast lifecycle
// → gestisce il trust store update
```

---

## 11. RISCHI PRINCIPALI (CRITICI)

### R1 — UserWorkspace God Component

**Criticità:** ALTA  
**Perché:** Qualsiasi bug nella pipeline cognitiva, nel routing, nel trust engine o in un singolo store può crashare l'intera workspace. Impossibile unit-testare senza mock massivi.  
**Impatto reale:** Un bug in `resetIdleTimer` blocca l'idle detection. Un errore in `resolveFinalPresence` rompe l'intera presenza Jarvis. Nessuna granularità di error boundary.

### R2 — Pipeline cognitiva ricalcolata ad ogni render

**Criticità:** ALTA  
**Perché:** ~6 operazioni pure per render, su mobile con budget 16.6ms/frame. Con idle timer che trigga re-render frequentemente, rischio stuttering su Chromebook/tablet low-end (target PA).  
**Impatto reale:** Degradazione UX su device scuola entry-level.

### R3 — Simulazione chiama AI API reali senza throttle

**Criticità:** ALTA  
**Perché:** Una demo in scuola PA consuma N×AI calls per mostrare il day planner. Con Anthropic ~$3/MTok, costi non controllati in modalità presentazione.  
**Impatto reale:** Costi API inattesi in demo/presentation mode.

### R4 — Dati normativi PA in localStorage non cifrati

**Criticità:** MEDIA-ALTA  
**Perché:** `kgEnterpriseBridge` salva staging/committed KG nodes con dati che possono includere DPIA, violazioni GDPR, documenti normativi. AGID richiede misure di sicurezza anche per dati locali.  
**Impatto reale:** Blocco qualificazione AGID a un audit di sicurezza.

### R5 — `patternDetector._log` condiviso tra tenant

**Criticità:** MEDIA  
**Perché:** In demo multi-tenant o future scuole multiple nello stesso browser, il comportamento di un utente inquina i segnali P16 di un altro.  
**Impatto reale:** Suggerimenti AI incongrui, skill emergenti sbagliate, automazioni inappropriate.

---

## 12. PRIORITÀ DI INTERVENTO

### Breve termine (entro 2 settimane)

| #   | Azione                                                                      | File target               | Effort |
| --- | --------------------------------------------------------------------------- | ------------------------- | ------ |
| B1  | Throttle idle timer (200ms debounce su mousemove, zero deps su useCallback) | `UserWorkspace.tsx`       | 30min  |
| B2  | Memoizza pipeline P16–P21 in `useMemo`                                      | `UserWorkspace.tsx`       | 2h     |
| B3  | Deduplica `relativeTime` e `DOMAIN_*` maps in utility                       | `utils/displayHelpers.ts` | 1h     |
| B4  | Aggiungi error boundary a `UserWorkspace`                                   | `components/workspace/`   | 2h     |
| B5  | Simulazione: flag `simulation:true` per bypassare AI in `ingestInput`       | `modules/cognitiveLayer`  | 3h     |

### Medio termine (1–2 mesi)

| #   | Azione                                                                                                 | Impatto                 |
| --- | ------------------------------------------------------------------------------------------------------ | ----------------------- |
| M1  | Split UserWorkspace: `useOrbitPipeline`, `useIdleDetection`, `useLandingRouter`, `useJarvisActionLoop` | Manutenibilità drastica |
| M2  | Cifra localStorage KG enterprise (AES-GCM WebCrypto)                                                   | Sicurezza PA            |
| M3  | Unifica `resolveScheduleContext` / `buildScheduleContext`                                              | Elimina duplicazione    |
| M4  | Auto-host font Orbit in `public/fonts/`                                                                | Offline PWA completo    |
| M5  | Token budget client-side (Zustand: maxCallsPerHour, usageThisSession)                                  | Cost control            |
| M6  | `patternDetector` per-tenant (istanza separata per tenantId)                                           | Multi-tenant readiness  |

### Lungo termine (3–6 mesi)

| #   | Azione                                                                                | Impatto                            |
| --- | ------------------------------------------------------------------------------------- | ---------------------------------- |
| L1  | Implementa Layer 4 presenceEngine (P18 fusion attiva nella pipeline finale)           | Completamento architettura P16–P21 |
| L2  | Execution engine: handler reali per `analyze` e `plan` (es. apertura panel specifici) | Agenti analyst/mentor operativi    |
| L3  | Background Sync API per cognitive entries offline                                     | PWA completezza                    |
| L4  | Agent state store (memoria per-agente, non solo action log)                           | Fondamenta multi-agent reale       |
| L5  | Agent workers in Web Worker thread                                                    | Performance su main thread         |

---

## 13. VALUTAZIONE FINALE

### Scorecard

| Dimensione            | Punteggio  | Note                                                                                        |
| --------------------- | ---------- | ------------------------------------------------------------------------------------------- |
| **Architettura**      | **7/10**   | Separazione logica/UI eccellente nei moduli puri; God Component UserWorkspace pesa -3       |
| **Performance**       | **5/10**   | Pipeline non memoizzata + idle timer aggressivo = rischio su tablet/mobile PA               |
| **Costi**             | **4/10**   | Nessun token budget, simulazione usa AI reale, nessun caching input                         |
| **Privacy/Sicurezza** | **5/10**   | localStorage sensibile non cifrato, input non sanitizzato esplicitamente                    |
| **UX**                | **7/10**   | Narrativa italiana chiara, load protection automatica; idle timer e auto-toast migliorabili |
| **Media**             | **5.6/10** | —                                                                                           |

### Maturità del sistema

**Il layer cognitivo P16–P21 è architetturalmente solido e ben progettato.**
I moduli puri (`attentionRouter`, `coordinationEngine`, `narrativeLayer`, `executionEngine`) sono testabili, puliti, SOLID-compliant. Questo è il punto di forza del sistema.

**Il layer di integrazione (`UserWorkspace`) è il collo di bottiglia.**
Concentra troppa responsabilità, non ha testing granulare, e la pipeline cognitiva non è memoizzata.

**Gli "agenti" sono profili visivo-comportamentali, non AI agents autonomi.**
Funziona bene come sistema adattivo UI, ma non è un multi-agent system nel senso AI: è un router intelligente attorno a un singolo execution channel (`executor` → `ORBIT_RUN_TASK`).

### Readiness per uso reale

| Contesto                               | Readiness     | Blockers                                                                                                                   |
| -------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Pilota 1–2 classi**                  | ✅ Pronto     | Nessun blocco tecnico critico per demo/pilot                                                                               |
| **Scuola singola (PA)**                | ⚠️ Parziale   | Fix R2 (performance), R4 (sicurezza localStorage), idle timer aggressivo                                                   |
| **Multi-scuola (qualificazione AGID)** | ❌ Non pronto | R1 (architettura), R5 (multi-tenant), più gap infrastrutturali (auth, DB, pentest) — vedi `MARKET_READINESS_2026-03-21.md` |

> **Sintesi:** Il sistema Orbit è una PWA AI-augmented di qualità superiore alla media del settore EdTech italiano.
> I limiti attuali sono di robustezza, scalabilità e cost control — non di concezione architetturale.
> Gli interventi B1–B5 (stima: ~2 giorni) portano il sistema a qualità PA-pilota.

---

_Audit generato: 2026-03-21 | Scope: codebase analisi statica + review architetturale_  
_File analizzati: orbitEngine.ts, attentionRouter.ts, coordinationEngine.ts, executionEngine.ts, narrativeLayer.ts, patternDetector.ts, presenceEngine.ts, cognitiveLoad.ts, agentPersonality.ts, orbitStates.ts, orbitTokens.ts, JarvisNexus.tsx, UserWorkspace.tsx, useOrbitSession.ts, SimulationEngine.ts, JarvisSimulator.ts, kgEnterpriseBridge.ts_
