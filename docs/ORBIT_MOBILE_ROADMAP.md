# Orbit Mobile — Roadmap Tecnica

> Generato: 2026-03-21 | Basato su analisi codebase reale (commit post-Audit Level 6)

---

## Contesto

Analisi di fattibilità per trasformare il sistema **Orbit UI Identity System** (multi-agente, orchestrazione cognitiva, P16–P21) in un pacchetto installabile su dispositivi mobile, con gestione sostenibile degli agenti tramite chiavi API gratuite e controllo dei token.

---

## 1. Architettura Attuale — Mappa Reale

| Componente           | File                                           | Tipo                                 | Mobile-ready?                |
| -------------------- | ---------------------------------------------- | ------------------------------------ | ---------------------------- |
| `orbitEngine`        | `src/modules/orbit/orbitEngine.ts`             | Barrel/API surface                   | ✅ Sì                        |
| `patternDetector`    | `src/modules/orchestration/patternDetector.ts` | Logic module (sync puro)             | ✅ Sì                        |
| `orbitSession`       | `src/modules/session/orbitSession.ts`          | Logic module (pure functions)        | ✅ Sì                        |
| `coordinationEngine` | `src/modules/orbit/coordinationEngine.ts`      | Logic module (pure, deterministic)   | ✅ Sì                        |
| `executionEngine`    | `src/modules/orbit/executionEngine.ts`         | Registry pattern, context injectable | ✅ Sì                        |
| `narrativeLayer`     | `src/modules/orbit/narrativeLayer.ts`          | Pure, italiano, zero deps            | ✅ Sì                        |
| `attentionRouter`    | `src/modules/orbit/attentionRouter.ts`         | P18, event queue                     | ✅ Sì                        |
| `orbitStates`        | `src/theme/orbitStates.ts`                     | Theme/logic                          | ✅ Ha già mobile cap < 600px |
| `cognitiveLoad`      | `src/theme/cognitiveLoad.ts`                   | Pure functions                       | ✅ Sì                        |
| `agentPersonality`   | `src/theme/agentPersonality.ts`                | Pure functions                       | ✅ Sì                        |
| `presenceEngine`     | `src/theme/presenceEngine.ts`                  | Pure functions                       | ✅ Sì                        |
| `agentMapper`        | `src/modules/orbit/agentMapper.ts`             | Pure functions                       | ✅ Sì                        |
| `orbitTokens`        | `src/theme/orbitTokens.ts`                     | CSS custom properties                | ⚠️ Shim necessario           |
| `useOrbitSession`    | `src/hooks/useOrbitSession.ts`                 | React hook + Zustand                 | ⚠️ Adattare Dimensions       |
| `useFlowStore`       | `src/stores/useFlowStore.ts`                   | Zustand persist localStorage         | ⚠️ → AsyncStorage            |
| `JarvisNexus`        | `src/components/ui/JarvisNexus.tsx`            | React/MUI v7 + Portal                | ❌ Riscrivere                |

**Suddivisione strategica:**

- ✅ **Portabile as-is (zero modifiche)**: 12 moduli di logica pura
- ⚠️ **Adattabile con shim**: `useFlowStore`, `orbitTokens`, `useOrbitSession`
- ❌ **Da riscrivere**: `JarvisNexus.tsx` (MUI Portal → RN Modal/BottomSheet)

---

## 2. Compatibilità Mobile

### Piattaforma raccomandata: React Native + Expo

| Opzione                 | Pro                                      | Contro                        | Raccomandazione           |
| ----------------------- | ---------------------------------------- | ----------------------------- | ------------------------- |
| **React Native + Expo** | TypeScript nativo, Zustand ok, community | MUI non supportato            | ✅ Scelta primaria        |
| **Capacitor**           | Riuso quasi totale codice web            | WebView, performance limitata | ⚠️ Solo prototipo rapido  |
| **React Native Web**    | Codice condiviso web/mobile              | Complessità setup             | ✅ Per monorepo long-term |

### Incompatibilità identificate (codice reale)

```typescript
// useFlowStore.ts — localStorage non esiste in RN
persist({ name: 'orbit_flows_v1' })  // ❌ → AsyncStorage

// orbitTokens.ts — CSS custom properties non esistono in RN StyleSheet
'var(--md-sys-spacing-1, 4px)'       // ❌ → costanti numeriche

// JarvisNexus.tsx — DOM APIs non disponibili
<Portal>                             // ❌ → Modal RN
<Box sx={{...}}>                     // ❌ → View + StyleSheet

// orbitStates.ts — già pronto!
if (viewportWidth < 600) return 'assistant'  // ✅ usare Dimensions.get('window').width
```

### Shim necessari

```typescript
// shim/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
export const storageAdapter = {
  getItem: (name: string) => AsyncStorage.getItem(name),
  setItem: (name: string, value: string) => AsyncStorage.setItem(name, value),
  removeItem: (name: string) => AsyncStorage.removeItem(name),
};

// shim/viewport.ts
import { Dimensions } from "react-native";
export const getViewportWidth = () => Dimensions.get("window").width;

// shim/tokens.ts — CSS vars → costanti numeriche
export const ORBIT_SPACING_RN = {
  compact: { itemGap: 4, sectionGap: 8, cardPadding: 8, orbSize: 32 },
  comfortable: { itemGap: 8, sectionGap: 16, cardPadding: 12, orbSize: 40 },
  expansive: { itemGap: 12, sectionGap: 24, cardPadding: 16, orbSize: 56 },
};
```

---

## 3. Gestione Stato e Store

Zustand è pienamente compatibile con React Native. Unica modifica: middleware `persist` con adapter AsyncStorage.

```typescript
// stores/useFlowStore.mobile.ts
import { createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

persist(
  (set) => ({
    /* stesso codice invariato */
  }),
  {
    name: "orbit_flows_v1",
    storage: createJSONStorage(() => AsyncStorage), // ← unica differenza
  },
);
```

`useOrbitSession` (poll 60s via `setInterval`) funziona identico in RN — cambia solo `window.innerWidth` → `Dimensions.get('window').width`.

---

## 4. UI — JarvisNexus Native

```typescript
// JarvisNexus.native.tsx — struttura proposta
// cinematic → fullscreen Modal + Reanimated 2
// assistant → BottomSheet (react-native-bottom-sheet)
// ambient   → FAB persistente

import { Modal, View, ScrollView, TouchableOpacity } from "react-native";
// Stessa logica props e state hooks di JarvisNexus.tsx
// Nuovo layer di rendering senza MUI
```

**Animazioni**: durate e curve da `orbitTokens.ts` riutilizzate via `react-native-reanimated`. Il downgrade automatico `ambientFiredCount > 5 → cinematic→assistant` già presente in `orbitStates.ts` vale anche su mobile.

---

## 5. Performance su Mobile

| Componente                                     | Carico stimato   | Rischio                        |
| ---------------------------------------------- | ---------------- | ------------------------------ |
| `patternDetector` (ring buffer 20 items, sync) | CPU < 0.1ms      | Nessuno                        |
| `coordinationEngine` (pure, deterministic)     | CPU < 0.5ms      | Nessuno                        |
| `executionEngine` (dispatch + log)             | CPU < 1ms        | Basso                          |
| `resolveAdaptivePresence`                      | CPU < 0.5ms      | Nessuno                        |
| `useOrbitSession` poll 60s                     | CPU trascurabile | Nessuno                        |
| Animazioni cinematiche JarvisNexus             | GPU variabile    | **Alto** su low-end            |
| Chiamate AI (Gemini/Claude)                    | Rete + latenza   | **Alto** senza controllo token |

**Throttling già presente nel codice:**

- `shouldProcessEvent()` in `attentionRouter` — throttle eventi ridondanti
- `ambientFiredCount > 5` in `orbitStates` — auto-downgrade presenza
- `dedupeActions()` in `executionEngine` — deduplicazione agentId×type

**Da aggiungere per mobile:**

```typescript
const MOBILE_THROTTLE_MS = 2000; // vs 500ms web — risparmia CPU/batteria
```

---

## 6. Persistenza Dati

| Store                    | Attuale                | Mobile                           |
| ------------------------ | ---------------------- | -------------------------------- |
| `useFlowStore`           | `localStorage`         | AsyncStorage                     |
| `useCognitiveStore`      | `localStorage`         | AsyncStorage                     |
| `useUserBehaviorStore`   | `localStorage`         | AsyncStorage                     |
| `useEmergentSkillsStore` | `localStorage`         | AsyncStorage                     |
| `orbitSession`           | in-memory (no persist) | OK, effimero by design           |
| `patternDetector`        | in-memory ring buffer  | OK, si azzera a reload by design |

Per sincronizzazione cross-device: `expo-sqlite` (storico locale) oppure Realm per query complesse.

---

## 7. Notifiche e Background

| Feature                    | iOS              | Android               | Strategia                                |
| -------------------------- | ---------------- | --------------------- | ---------------------------------------- |
| `useOrbitSession` poll 60s | ❌ sospeso in bg | ⚠️ limitato           | Expo Background Fetch (min 30min su iOS) |
| Agenti "silenziosi"        | ❌               | ⚠️ Foreground Service | Solo in foreground                       |
| Notifiche proattive        | ✅ APNs          | ✅ FCM                | Push notification da server              |
| AI calls in background     | ❌               | ⚠️                    | Solo foreground, o server-push           |

**Pattern consigliato**: notifiche push invece di background agents. Il server calcola il suggerimento, manda push, l'utente apre l'app e trova il contesto pronto.

---

## 8. Gestione Agenti e API — Controllo Economico Token

### 8.1 API gratuite per agenti

| Provider                      | Free Tier                 | Limite                | Adatto per                      |
| ----------------------------- | ------------------------- | --------------------- | ------------------------------- |
| **Gemini 1.5 Flash**          | ✅ 15 RPM / 1M TPM/giorno | Rate limit aggressivo | Suggerimenti leggeri (primario) |
| **Gemini 1.5 Pro**            | ✅ 2 RPM / 50k TPM/giorno | Molto stretto         | Solo decisioni critiche         |
| **Groq (LLaMA 3.1, Mixtral)** | ✅ 14.4k RPM gratuiti     | Generoso              | Agenti veloci / fallback        |
| **Ollama (locale on-device)** | ✅ Gratis                 | Hardware device       | Fallback offline                |
| OpenAI GPT-4o-mini            | ❌ No free tier           | —                     | Scartato                        |

**Strategia multi-provider:**

```
Gemini Flash  → agente primario (1M token/giorno gratuiti)
Groq LLaMA   → fallback se Flash esaurito (14.4k RPM)
Ollama locale → fallback offline (nessun costo, qualità inferiore)
```

### 8.2 Architettura Token Budget

```typescript
// packages/orbit-agent-budget/tokenBudget.ts

interface TokenBudget {
  dailyLimit: number; // es. 50_000 token/giorno free
  sessionLimit: number; // es. 5_000 token/sessione
  actionLimit: number; // es. 500 token/azione agente
  consumed: { daily: number; session: number };
}

const AGENT_ACTION_COST: Record<AgentActionType, number> = {
  analyze: 400, // prompt + risposta strutturata
  plan: 300,
  execute: 200, // spesso azione locale (senza API)
  explain: 450, // risposta verbosa
  observe: 0, // puramente locale — nessuna API call
  handoff: 0, // puramente locale
  idle: 0,
};

export function canAffordAction(
  type: AgentActionType,
  budget: TokenBudget,
): boolean {
  const cost = AGENT_ACTION_COST[type];
  if (cost === 0) return true;
  return (
    budget.consumed.daily + cost <= budget.dailyLimit &&
    budget.consumed.session + cost <= budget.sessionLimit
  );
}
```

### 8.3 Cache delle risposte

```typescript
// packages/orbit-agent-budget/responseCache.ts
// Fingerprint: sessionMode + userIntent + taskComplexity + activeClassId
// TTL: 10 minuti
// Risparmio stimato: 60% hit rate in sessioni scolastiche routinarie

function buildCacheKey(
  agentType: AgentActionType,
  session: OrbitSession,
  signals: Pick<OrbitBehaviorSignals, "userIntent" | "taskComplexity">,
): string {
  return `${agentType}:${session.mode}:${signals.userIntent}:${signals.taskComplexity}:${session.activeClassId ?? "none"}`;
}
```

### 8.4 Fallback locale completo

Il codebase ha già tutta l'infrastruttura per fallback senza AI:

```
API call fallisce / token esauriti
  → narrativeLayer.generateNarrative(actions)     ✅ locale
  → coordinationEngine.coordinateAgents(signals)  ✅ locale (regole deterministiche)
  → patternDetector.detectPattern()               ✅ locale
  → suggerimento statico da defaultSkills         ✅ locale
```

Il fallback locale copre il **90% del valore** per azioni routinarie (registro, UDA, valutazioni). L'AI serve per: analisi testo libero, generazione pianificazioni, spiegazioni adattive.

### 8.5 Rate Limiting

```typescript
// packages/orbit-agent-budget/agentRateLimiter.ts

const RATE_LIMITS: Record<
  AgentActionType,
  { maxPerMinute: number; maxPerHour: number }
> = {
  analyze: { maxPerMinute: 2, maxPerHour: 10 }, // costoso
  plan: { maxPerMinute: 3, maxPerHour: 15 },
  execute: { maxPerMinute: 10, maxPerHour: 60 }, // locale nel 90% dei casi
  explain: { maxPerMinute: 2, maxPerHour: 8 }, // molto verboso
  observe: { maxPerMinute: 60, maxPerHour: 999 }, // gratis, locale
  handoff: { maxPerMinute: 60, maxPerHour: 999 }, // gratis, locale
  idle: { maxPerMinute: 60, maxPerHour: 999 },
};
```

### 8.6 Prompt Compression

```typescript
// utils/promptCompressor.ts
// Riduzione stimata: 800 → 250 token per prompt (-69%)
// Tecniche:
//   - Rimuovi campi non necessari da OrbitSession
//   - Usa abbreviazioni (T=teaching, P=planning, A=administrative)
//   - Cap storico: max 3 entry recenti (non 10)
//   - Risposta strutturata JSON (50-70% più economico di testo libero)

const COMPRESSED_TEMPLATE = `
Agente:{{type}} | Sessione:{{mode}} | Intento:{{intent}} | Classe:{{classId}}
Entry recenti:{{last3entries}}
Rispondi in JSON: {"action":"...","label":"...","confidence":0.0}
`;
```

---

## 9. Struttura Monorepo

```
orbit-mobile/
├── packages/
│   ├── orbit-core/              ← moduli puri (zero React, zero DOM)
│   │   ├── coordinationEngine.ts
│   │   ├── executionEngine.ts
│   │   ├── narrativeLayer.ts
│   │   ├── patternDetector.ts
│   │   ├── orbitSession.ts
│   │   ├── cognitiveLoad.ts
│   │   ├── agentPersonality.ts
│   │   ├── presenceEngine.ts
│   │   ├── orbitStates.ts
│   │   └── package.json         (esm + cjs, zero deps)
│   │
│   ├── orbit-rn/                ← adattatori React Native
│   │   ├── stores/              (AsyncStorage adapter per tutti i persist)
│   │   ├── hooks/               (useOrbitSession.native.ts)
│   │   ├── shims/               (tokens, viewport, storage)
│   │   └── package.json
│   │
│   ├── orbit-ui-rn/             ← componenti UI RN
│   │   ├── JarvisNexusNative.tsx (Modal + BottomSheet + FAB)
│   │   ├── OrbitFAB.tsx
│   │   └── package.json
│   │
│   └── orbit-agent-budget/      ← token budget + cache + rate limiter
│       ├── tokenBudget.ts
│       ├── responseCache.ts
│       ├── agentRateLimiter.ts
│       ├── promptCompressor.ts
│       └── package.json
│
├── apps/
│   └── expo-app/                ← app dimostrativa Expo
│
└── package.json                 (workspaces)
```

---

## 10. Limitazioni e Rischi

| Rischio                              | Impatto | Probabilità | Mitigazione                                                |
| ------------------------------------ | ------- | ----------- | ---------------------------------------------------------- |
| Bundle size MUI → RN                 | Alto    | Certa       | MUI non usato in RN; Nativewind o StyleSheet puro          |
| Low-end device (2GB RAM)             | Alto    | Media       | Animazioni disabilitabili; mobile cap già in `orbitStates` |
| Token free tier esaurimento intraday | Alto    | Alta        | Cache 60% hit + fallback locale + Groq secondary           |
| iOS background kill                  | Medio   | Certa       | Push notification pattern (§7)                             |
| React lifecycle RN vs DOM            | Medio   | Media       | `useOrbitSession` poll è pattern safe per RN               |
| Dimensioni bundle Expo               | Medio   | Bassa       | `expo-updates` OTA + code splitting per feature            |
| Costi token in produzione            | Critico | Alta        | Token budget + cache + prompt compression + fallback (§8)  |

---

## 11. Costi Token Stimati per Sessione

```
Scenario: docente usa app per 45 minuti

Senza ottimizzazioni:
  ~8.000 token/sessione → ~0.002 USD (Gemini Flash) → sostenibile

Con cache (60% hit rate):
  ~3.200 token/sessione → praticamente gratis su free tier

Con fallback locale per azioni routinarie:
  ~800 token/sessione → zero costo (solo logica deterministica)
```

**Flusso decisionale per ogni AgentAction:**

```
1. canAffordAction()      → budget disponibile?
2. responseCache.get(key) → risposta cached valida?
3. rateLimiter.allow()    → rate ok?

Se sì a tutti → API call con prompt compresso
Se no a uno   → fallback locale (coordinationEngine + narrativeLayer)
```

---

## 12. Roadmap di Implementazione

### Week 1 — Core Extraction

- [ ] Crea `packages/orbit-core` — copia moduli puri, zero modifiche al codice
- [ ] Verifica test Jest su `orbit-core` (riuso quasi 1:1 da Vitest esistente)
- [ ] Crea `packages/orbit-agent-budget`:
  - `tokenBudget.ts` con `AGENT_ACTION_COST` e `canAffordAction()`
  - `responseCache.ts` con `buildCacheKey()`, TTL 10min, AsyncStorage backend
  - `agentRateLimiter.ts` con `RATE_LIMITS` per ogni `AgentActionType`
  - `promptCompressor.ts` con template compresso (-69% token)

### Week 2 — RN Adapters

- [ ] `packages/orbit-rn/shims/storage.ts` — AsyncStorage adapter
- [ ] `packages/orbit-rn/shims/viewport.ts` — `Dimensions.get('window').width`
- [ ] `packages/orbit-rn/shims/tokens.ts` — `ORBIT_SPACING_RN` (CSS vars → numeri)
- [ ] `packages/orbit-rn/hooks/useOrbitSession.native.ts` — Dimensions invece di window
- [ ] `packages/orbit-rn/stores/` — tutti i persist store con `createJSONStorage(AsyncStorage)`
- [ ] Test unitari shim con Jest

### Week 3 — UI Native

- [ ] `JarvisNexusNative.tsx`:
  - `cinematic` → fullscreen `Modal` + `react-native-reanimated`
  - `assistant` → `BottomSheet` (react-native-bottom-sheet)
  - `ambient` → FAB persistente + haptic feedback
- [ ] `OrbitFAB.tsx` — touch target 48dp, aria-label, accessibilità
- [ ] Animazioni sincronizzate con durate da `orbitTokens.ts`
- [ ] Throttle animazioni su low-end (`InteractionManager.runAfterInteractions`)

### Week 4 — Integration + Demo

- [ ] Expo app in `apps/expo-app/`:
  - Wiring completo: stores + hooks + UI + budget
  - Demo: docente apre app → `deriveSession()` → `coordinateAgents()` → `generateRichNarrative()`
  - Offline demo: disabilita rete → 100% locale con fallback locale
- [ ] Test Detox smoke su device fisico Android
- [ ] Misura token consumati per sessione tipo (logging `tokenBudget.consumed`)
- [ ] README `orbit-mobile` con istruzioni installazione Expo Go

---

## Effort Riepilogativo

| Fase                                          | Effort | Durata stimata   |
| --------------------------------------------- | ------ | ---------------- |
| Week 1 — `orbit-core` + `orbit-agent-budget`  | Basso  | 2–3 giorni       |
| Week 2 — Shim + RN adapters                   | Basso  | 1–2 giorni       |
| Week 3 — `JarvisNexusNative` (riscrittura UI) | Alto   | 1–2 settimane    |
| Week 4 — Expo app dimostrativa + test         | Medio  | 1 settimana      |
| **Totale prototipo installabile**             | —      | **~4 settimane** |

**Fattibilità complessiva: ✅ Alta**

L'85% della logica Orbit è già portabile senza modifiche. La vera complessità è concentrata in un solo componente (`JarvisNexus`) e nella gestione economica dei token (nuova implementazione, ma ben delimitata).
