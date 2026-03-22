# Piano Esecutivo v2 — DocenteDoc AI verso il Rilascio

**Data:** 2026-03-22  
**Baseline tecnica:** commit `dfc8f705` (P39.6 — Merge Engine)  
**Orizzonte target:** Pilota scuole italiane — giugno 2026

---

## 0. Stato corrente

Il sistema ha completato il ciclo di intelligenza adattiva P38→P39.6:

| Layer                                 | Stato        | Note                                    |
| ------------------------------------- | ------------ | --------------------------------------- |
| Orchestrator + CognitiveOrchestrator  | ✅ stabile   |                                         |
| EmotionalEngine (L1-L4b)              | ✅ stabile   | smoothState, lastPerceivedState         |
| EmotionalProfile cross-sessione       | ✅ stabile   | Zustand persist v3                      |
| CognitiveStyleEngine                  | ✅ stabile   | deriveStyle, smoothStyle, mergeStrategy |
| Merge Engine con gerarchia esplicita  | ✅ stabile   | emotion > style > speed                 |
| UI adattiva (adaptBlocks style-aware) | ✅ stabile   |                                         |
| Telemetria (4 eventi)                 | ✅ stabile   |                                         |
| GDPR / Privacy consent                | ✅ stabile   | PrivacyConsentModal, dataRetention      |
| Test baseline                         | ✅ 1740/1752 | 12 intentional skip, 0 failing          |
| CI (lint, tsc, test, e2e-smoke)       | ✅ attivo    | 4 GitHub Actions                        |

**Cosa manca per il rilascio:** UX validation, test di scenari cognitivi reali, deploy hardening, onboarding pilota.

---

## 1. Principi del piano

**Emotion = safety signal** (momento-livello)  
**Style = mappa di preferenza** (sessione/cross-sessione)  
**UI = specchio del pensiero** (adattiva, non invasiva)  
**Human-in-the-loop = guardrail e fiducia**

Ogni fase ha:

- criterio di completamento misurabile
- gate di qualità prima di passare alla fase successiva
- commit atomici + tag semantici

---

## 2. Fase 1 — Hardening & Test Cognitivi

**Obiettivo:** il sistema regge scenari estremi senza oscillazioni visibili.

### Task

- [x] `__tests__/modules/orchestration/MergeEngine.test.ts` — test unitari `mergeStrategy` con tutti i path (lead → ritorno immediato, exploration=high → no cap, conflitti emotion vs style)
- [x] `__tests__/modules/orchestration/CognitiveStyleEngine.test.ts` — test `smoothStyle` convergenza, `deriveStyle` stabilità dopo N turni
- [x] `__tests__/modules/orchestration/EmotionalEngine.test.ts` — aggiungere casi `lastPerceivedState` + transizioni illecite bloccate da `smoothState`
- [x] Scenario E2E "utente bloccato per 3 turni poi si sblocca" — verificare che `uiDensity` resti bassa fino a recovery reale
- [x] Scenario E2E "utente autonomo high structure" — verificare `uiDensity=high` + depth floor `medium`
- [x] Verifica nessuna oscillazione stile nei primi 5 turni (speedPreference bloccata fino a T>=5)

### Gate di uscita

- Test unitari: 100% path del merge engine coperti
- 0 regressioni sulla baseline 1740 test
- Lint + tsc: 0 errori/warning

---

## 3. Fase 2 — UX Adattiva Avanzata

**Obiettivo:** l'esperienza visiva riflette lo stato cognitivo — l'utente percepisce che il sistema lo "conosce".

### Task UI

- [x] **Microcopy dinamica per stato** — espandere `REVEAL_LABEL` a tutti i componenti che mostrano contenuto condizionale (non solo `AssistantMessage`)
- [x] **Reveal intelligente per exploration=high** — auto-espandere i blocchi (senza click) quando `exploration === 'high'` e blocchi nascosti <= 2
- [x] **Indice blocchi per structure=high** — se `structure === 'high'` e blocchi > 3, mostrare una mini-navbar di tipo (text / plan / insight) prima del contenuto
- [x] **CTA autonomia** — se `autonomy === 'high'`, aggiungere un chip `"Applicalo tu"` / `"Fammi vedere come"` sotto il blocco text nei casi in cui il sistema avrebbe proposto `guidance='suggest'`
- [x] **ChatSettingsPanel: sezione Stile Cognitivo** — visualizzare `cognitiveStyle` corrente (structure / autonomy / speed / exploration) come 4 chip readonly con tooltip esplicativo

### Gate di uscita

- `npm run lint`: 0 errori
- `npm run test:unit`: 0 regressioni
- Revisione visiva manuale: le 5 UI modificate sono conformi MD3

---

## 4. Fase 3 — Human-in-the-Loop

**Obiettivo:** il docente può correggere il sistema quando sbaglia. Il sistema impara dalla correzione.

### Task

- [x] **Override stile** — aggiungere a `ChatSettingsPanel` un pannello "Il mio stile di lavoro" con 4 slider (structure / autonomy / speed / exploration); cambi manuali → `overrideCognitiveStyle()` + reset `revealClickCount` — commit `1f1f6c59`
- [x] **Feedback inline su strategia** — sotto ogni risposta, oltre a 👍/👎, aggiungere chip `"Troppo lungo"` / `"Troppo breve"` / `"Giusto così"`; questi alimentano `recordSuggestionAccepted/Rejected` — commit `1f1f6c59`
- [x] **Reset stile** — bottone in settings "Reimposta stile" → factory reset cognitivo (`createCognitiveStyle()` + `createCognitiveStyleSignals()` + `revealClickCount=0`) — commit `1f1f6c59`
- [x] **Alert drift** — se `cognitiveStyle.structure` o `.exploration` cambia di livello in 3 turni consecutivi, `observe('cognitive.style.drift', { from, to, field })` + toast "Ho aggiornato il mio modello su di te" — commit `1f1f6c59`

### Gate di uscita

- Override stile funziona e persiste dopo ricarica
- Feedback inline aggiorna segnali nel turno successivo
- 0 errori TS su nuovi componenti

---

## 5. Fase 4 — Explainability & Trasparenza

**Obiettivo:** ogni decisione del merge engine è tracciabile e interrogabile.

### Task

- [x] **Annotare `mergeStrategy`** — aggiunto campo opzionale `_debug?: { ruleApplied: string; priority: 1|2|3 }` su `EmotionalStrategy`; popolato da `mergeStrategy` in dev mode (tree-shaken in prod via `import.meta.env.DEV`) — commit `2d9111f2`
- [x] **Telemetria estesa** — `observe('merge.rule.applied', { rule, priority, emotional, structure, exploration })` in dev mode; 9 regole tracciate con accumulo (`P2:structure-high + P2:exploration-high`) — commit `2d9111f2`
- [x] **Devtools panel** (dev-only) — `CognitiveDebugPanel` nascosto dietro `?debug=cognitive` — mostra EmotionalProfile, CognitiveStyle, Signals, Last Merge Rule in real-time — commit `2d9111f2`
- [x] **Documentazione decisionale** — `COGNITIVE_ARCHITECTURE_P39.6.md` aggiornato con sezione Fase 4, tabella regole merge, eventi telemetria — commit `2d9111f2`

### Gate di uscita

- Il devtools panel si monta senza errori in dev
- `_debug` non presente in bundle di produzione (verificato con `npm run build` + bundle analysis)

---

## 6. Fase 5 — Deploy Hardening & Pilota

**Obiettivo:** il sistema è pronto per docenti reali in ambiente scolastico.

### Task

- [ ] **Vercel env check** — `GEMINI_API_KEY` / `ANTHROPIC_API_KEY` solo server-side, verificare edge function `api/ai.ts`
- [x] **Rate limiting** — `api/ai.ts`: rate limit per IP (max 30 req/min) tramite in-memory map, bypass in test mode (`NODE_ENV=test`)
- [x] **Error boundaries per layer cognitivo** — `deriveStyle` e `mergeStrategy` in `useSmartChat.ts` wrappati in try/catch; fallback graceful a strategia base, `observe('cognitive.engine.error', ...)` su failure
- [x] **Privacy audit** — verificato: `cognitiveStyle` e `emotionalProfile` non inviati a endpoint esterni (solo Zustand localStorage persist)
- [x] **Onboarding pilota** — `PilotaOnboardingModal.tsx` (3° gate in `main.tsx`, dopo PrivacyConsentModal + SovereigntyOnboarding); key `pilot_onboarding_v1`; 3 card: sistema emotivo / stile personalizzato / privacy locale
- [x] **Lighthouse audit** — Accessibility=100, Best Practices=100, SEO=100, Performance=70–75 su localhost preview (Vite, throttled 1.6 Mbps). LCP dominante (5.8s) causato da consent modal che attende tutti i lazy chunk. Target Performance ≥ 85 deve essere misurato su **Vercel preview** (CDN edge TTFB ~30ms, HTTP/2, brotli) prima del deploy in produzione — non raggiungibile in modo affidabile su localhost senza regressioni TBT. _(gate da riverificare su Vercel preview prima del deploy)_
- [ ] **Smoke test E2E su Vercel preview** — `npm run test:e2e:smoke` prima di ogni deploy _(gate manuale pre-deploy)_

### Gate di uscita

- Build Vercel: 0 errori
- Lighthouse: Accessibility ≥ 90 ✅, Best Practices ≥ 90 ✅, SEO ≥ 80 ✅; Performance ≥ 85 da verificare su Vercel preview
- Smoke test: pass
- Privacy review: nessun dato cognitivo in outbound non autorizzato

---

## 7. Criteri di rilascio v2.0

Il rilascio è approvato quando **tutti** i seguenti gate sono verdi:

| Criterio                 | Metrica                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| Test suite               | ≥ 1740 pass, 0 fail                                               |
| TypeScript               | 0 errori `tsc --noEmit`                                           |
| ESLint                   | 0 errori, ≤ 1 warning pre-esistente                               |
| Lighthouse Performance   | ≥ 85 su Vercel preview (localhost baseline: 70–75/100, LCP bound) |
| Lighthouse Accessibility | ≥ 90 (attuale: 100/100) ✅                                        |
| E2E smoke                | tutti pass su Vercel preview                                      |
| Privacy                  | nessun dato cognitivo in outbound non autorizzato                 |
| Human-in-the-loop        | override stile funzionante                                        |
| Explainability           | devtools panel attivo in dev                                      |

---

## 8. Rischi e mitigazioni

| Rischio                                                 | Probabilità | Mitigazione                                                          |
| ------------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| Drift stile invisibile confonde l'utente                | Media       | Alert drift (Fase 3) + override manuale                              |
| Merge engine produce strategia incoerente su edge cases | Bassa       | Test unitari completi (Fase 1) + error boundary (Fase 5)             |
| Utente percepisce sistema "troppo curioso"              | Media       | Onboarding trasparente + reset stile con 1 click                     |
| Performance degradata con telemetria densa              | Bassa       | `observe()` è fire-and-forget, non blocca il rendering               |
| Store v3 non compatibile con dati v2 esistenti          | Bassa       | Zustand persist: cambiato `name`, la migrazione è automatica (reset) |

---

## 9. Sequenza di esecuzione raccomandata

```
Fase 1 (hardening)      →  ~3 giorni
Fase 2 (UX adattiva)    →  ~4 giorni
Fase 3 (HITL)           →  ~3 giorni
Fase 4 (explainability) →  ~2 giorni
Fase 5 (deploy)         →  ~2 giorni
                            ─────────
                            ~14 giorni lavorativi
```

Nessuna fase è bloccante per le successive se i gate di uscita sono soddisfatti.  
Fase 5 è hard dependency: si esegue solo dopo Fase 1 + Fase 2 completate.

---

## 10. Riferimenti

- [COGNITIVE_ARCHITECTURE_P39.6.md](./COGNITIVE_ARCHITECTURE_P39.6.md) — architettura layer e regole
- [ROADMAP_ADAPTIVE_INTELLIGENCE.md](./ROADMAP_ADAPTIVE_INTELLIGENCE.md) — roadmap Sprint 10+
- [CLAUDE.md](../CLAUDE.md) — setup, comandi, gotchas
- Commit baseline: `dfc8f705` — P39.6 merge engine
