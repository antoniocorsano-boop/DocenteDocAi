# 📘 Orbit — Analisi, Visione e Roadmap

> Aggiornato: 2026-03-23 | Baseline: P44.6 + Design System (`orbitTheme.ts`) + OrbitTeaser

---

## 1. Stato attuale di Orbit

Orbit è il layer operativo e cognitivo di DocenteDoc AI. L'architettura P44.6 è **stabile e completa** nelle sue fondamenta.

| Area                                                                                             | Stato           |
| ------------------------------------------------------------------------------------------------ | --------------- |
| **Pipeline cognitiva** — `ingestInput → buildPlan → UIBlock assembly`                            | ✅ Implementato |
| **Context management** — EmotionalEngine, CognitiveStyleEngine, mergeStrategy                    | ✅ Implementato |
| **UIBlock layer gerarchico** — `Chat > PlanCard > DecisionCard > Orbit`                          | ✅ Implementato |
| **Connectors** — emailConnector, fileConnector, useExternalSync                                  | ✅ Implementato |
| **Memoria e adattamento** — userBehaviorStore, adaptive.ts, feedbackLoop                         | ✅ Implementato |
| **Design System** — `orbitTheme.ts` (CSS vars injector), `orbitTokens.ts` (estensioni token MD3) | ✅ Implementato |
| **Interattività step** — PlanCardBlock step cliccabili → esecuzione action, avanzamento          | ✅ Implementato |
| **OrbitTeaser** — walkthrough iniziale 4 slide, localStorage gate `orbit_teaser_v1`              | ✅ Implementato |
| **OrbitDock 30vh guard** — silenzioso se DecisionCard/WorkSession presenti negli ultimi 3 turni  | ✅ Implementato |
| **ExplainEngine** (cap 2) + **ConfidenceEngine** (cap 3)                                         | ✅ Implementato |
| **WorkSessionEngine** + sticky CTA                                                               | ✅ Implementato |
| **FAB mobile** sempre visibile                                                                   | ✅ Implementato |
| **Landing system** — ScheduleLanding, ClassLanding, LessonLanding                                | ✅ Implementato |
| **InlineActionStrip** + behavior tracking                                                        | ✅ Implementato |

---

## 2. Opportunità di sviluppo

Le aree di espansione prioritarie, in ordine di impatto:

1. **Estrazione e formalizzazione della logica legacy** — la logica DocenteDocAI (UDA, programmazione, registro, alunni) va tradotta in `intent` e `step` dinamici per PlanEngine, così da non essere hardcoded ma generata contestualmente dall'AI.

2. **UI dinamica e parametrica** — Card, timeline, doc preview, chip contestuali: devono essere generati dall'AI (Claude/Gemini) a partire dai dati del piano, non definiti staticamente. La struttura UIBlock permette già questo, ma va formalizzata con props modulari (`action?`, `autoExecutable?`, `predictedIntent?`).

3. **Pipeline I/O universale** — `ingestInput` va validato e consolidato per tutti i tipi di media (testo, file, URL, immagine). Oggi è funzionante per testo e file docx; gli altri formati vanno testati e induriti.

4. **Automazione guidata: suggested → assisted → auto (stub)** — l'InlineActionStrip ha già il livello "suggested". Il passo successivo è "assisted" (un click, poi conferma) e poi "auto" (eseguito in background, con undo e log). Non bypassare mai il consenso utente.

5. **Memoria adattiva e predittiva** — `useUserBehaviorStore` già traccia `freq`, `preferred`, `ignored`; manca il layer di `boost/suppress` che influenza la generazione UIBlock e pre-carica i pattern più usati. Include stub per auto-actions su pattern ripetitivi.

---

## 3. Vincoli da considerare

Vincoli **non derogabili** per ogni sprint futuro:

- **MD3 + MUI v7** — contratto MD3 Gold Compliant su ogni componente. Zero `<div>` per layout, zero spacing hardcoded, zero `fontSize` inline. `npm run lint` deve ritornare EXIT:0 prima di ogni merge.
- **Preservazione dati legacy DocenteDocAI** — UDA, alunni, valutazioni, piani di lavoro non vengono mai toccati dall'automazione senza consenso esplicito. `adaptBlocks` usa solo `hidden: true`, mai elimina contenuto.
- **Multi-device, touch-first** — ogni funzionalità deve essere usabile su mobile (drawer, FAB, touch tap). Il desktop è un layer addizionale, non sostitutivo.
- **Setup minimo iniziale** — OrbitTeaser e onboarding introducono il sistema senza richiedere configurazione. Le automazioni non si attivano senza che l'utente abbia interagito almeno una volta con il flusso corrispondente.

---

## 4. Roadmap — 10 Fasi

> Roadmap operativa dettagliata: [ORBIT_ROADMAP_OPERATIVA.md](ORBIT_ROADMAP_OPERATIVA.md)

| Fase        | Obiettivo                                                                                            | Stato       |
| ----------- | ---------------------------------------------------------------------------------------------------- | ----------- |
| **Fase 0**  | Analisi stato attuale — mappatura componenti e gap                                                   | ✅ Completo |
| **Fase 1**  | Landing System — ScheduleLanding, ClassLanding, LessonLanding, `activeLanding` state                 | ✅ Completo |
| **Fase 2**  | IA & behavior-driven — logiche di business trasferite a IA (PlanEngine, OrbitDock, `buildContext()`) | ✅ Completo |
| **Fase 3**  | External connectors — email, file, sync (mock-first)                                                 | ✅ Completo |
| **Fase 4**  | Automation levels — InlineActionStrip (suggested → assisted → auto stub)                             | ✅ Completo |
| **Fase 5**  | Design System unificato — `orbitTheme.ts`, `OrbitTeaser`, palette MD3+Orbit                          | ✅ Completo |
| **Fase 6**  | Mondi orbitanti — feed, contenuti e suggerimenti dinamici                                            | ⏳ Prossimo |
| **Fase 7**  | Social layer — gruppi, scuole, collaborazioni, documenti condivisi                                   | ⏳          |
| **Fase 8**  | Inibizione vecchia UI — tutto orchestrato in Orbit, logiche legacy ancora disponibili per IA         | ⏳          |
| **Fase 9**  | Testing & tuning — Playwright E2E, Vitest, lighthouse ≥ 90, QA mobile+desktop                        | ⏳          |
| **Fase 10** | Lancio completo — Orbit operativo su mobile e desktop, social layer attivo                           | ⏳          |

---

## 5. Passi operativi

Sequenza concreta di azioni per avanzare lungo la roadmap:

1. **Mappare gli intent legacy**: creare un file `src/modules/orchestration/legacyIntentMap.ts` che traduce i flussi DocenteDocAI (crea UDA, aggiungi alunno, pianifica lezione…) in strutture `OrbitIntent` compatibili con `buildPlan()`.
2. **Estendere PlanEngine**: fare in modo che `buildPlan()` consumi `legacyIntentMap` e generi `orbit_plan` UIBlock anche per i flussi legacy, non solo per le intenzioni nuove.
3. **Consolidare `ingestInput`**: testare e indurire la funzione per tutti i tipi di media (testo, file docx/pdf, URL, immagine). Aggiungere fallback e test unitari.
4. **Implementare boost/suppress** nel `useUserBehaviorStore`: i pattern ad alta `freq` e `preferred` alzano la priorità dei blocchi `orbit_plan` correlati; `ignored` li abbassa.
5. **Creare layout desktop multi-pane**: `OrbitDock` laterale (non bottom sheet) su viewport ≥ `md`. `PlanCard` floating affiancata alla chat su ≥ `lg`. Breakpoint MUI v7, nessun `@media` custom.
6. **Alzare InlineActionStrip a livello "assisted"**: implementare step di conferma prima dell'esecuzione. Aggiungere log persistente delle azioni eseguite in `useFlowStore`.
7. **Test & validazione finale**: suite Playwright che verifica tutti i flussi legacy (UDA, registro, pianificazione), coerenza UIBlock array, lighthouse score ≥ 90.

---

## 6. Visione Design System esteso

Il Design System di Orbit punta a un'estetica **Notion/Google Apps**: pulita, densa di informazioni, immediatamente leggibile, adattiva al contesto.

- **Branding coerente**: logo Orbit nel teaser, nella nav overlay e come identità visiva separata da DocenteDocAI. Palette basata su MD3 color scheme + estensioni `--orbit-*`.
- **MD3 + MUI v7 come unica fonte normativa**: nessun colore, spacing o tipografia al di fuori dei token. `orbitTheme.ts` inietta le `--orbit-*` CSS custom properties una volta sola a bootstrap via `injectOrbitCssVars()`.
- **Comportamenti dinamici**: componenti come `PlanCardBlock` e `DecisionCard` reagiscono allo stato (step corrente, confidence, guidance) cambiando colore e density, non solo contenuto.
- **Mobile + Desktop nativi**: su mobile tutto si riduce a drawer, FAB e chip; su desktop si espande in layout multi-pane con sidebar e floating card. Nessun compromesso tra i due.
- **Estetica "Notion-like"**: superfici piatte, gerarchia tipografica chiara, spacing generoso, icone funzionali. L'interfaccia comunica chiarezza operativa, non decorazione.
- **Personalizzazione immediata**: il `cognitiveStyle` (derivato da `CognitiveStyleEngine`) influenza la `uiDensity` e il `depth` del contenuto già dal primo messaggio, senza configurazione manuale.

---

## 7. File di riferimento

| Documento                                                          | Contenuto                                                |
| ------------------------------------------------------------------ | -------------------------------------------------------- |
| [ORBIT_ROADMAP_OPERATIVA.md](ORBIT_ROADMAP_OPERATIVA.md)           | Roadmap operativa 10 fasi + sprint immediati consigliati |
| [ORBIT_PHASE24_PLAN.md](ORBIT_PHASE24_PLAN.md)                     | Piano dettagliato Phase A/B/C — tutto implementato       |
| [COGNITIVE_ARCHITECTURE_P44.6.md](COGNITIVE_ARCHITECTURE_P44.6.md) | Architettura cognitiva completa, appendice P44.6         |
| [ORBIT_JARVIS_BLUEPRINT.md](ORBIT_JARVIS_BLUEPRINT.md)             | Vision e blueprint prodotto Orbit Jarvis                 |
| [ORBIT_BRAND_DESIGN.md](ORBIT_BRAND_DESIGN.md)                     | Brand identity, colori, tipografia, logo                 |
| [DESIGN_SYSTEM_HANDOFF.md](DESIGN_SYSTEM_HANDOFF.md)               | Handoff Design System — token reference                  |

**File tema implementati (P44.6 + DS):**

- `src/theme/orbitTheme.ts` — `ORBIT_CSS_VARS`, `ORBIT_CSS_VARS_DARK`, `injectOrbitCssVars()` — iniettati in `main.tsx`
- `src/theme/orbitTokens.ts` — `ORBIT_BACKGROUND`, `ORBIT_TEASER`, `ORBIT_STEP_COLORS` — tutti `var(--md-sys-color-*)`, mai hardcoded
- `src/components/ui/OrbitTeaser.tsx` — 4 slide walkthrough, gate `orbit_teaser_v1`, MD3 Gold Compliant

---

### Vincoli non derogabili

- Tutto MD3 Gold Compliant — zero `<div>` per layout, zero spacing hardcoded
- Token MUI v7 / CSS custom properties per ogni valore di stile
- `npx tsc -b --noEmit` → 0 errori prima di ogni merge
- `npm run lint` → 0 errori MD3 prima di ogni merge
- Gerarchia UIBlock `Chat > PlanCard > DecisionCard > Orbit` — non negoziabile
- `adaptBlocks` non elimina mai contenuto — solo `hidden: true`
- Automazioni con undo e log — mai eseguire azioni irrecuperabili senza consenso
