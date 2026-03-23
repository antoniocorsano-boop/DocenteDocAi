# Orbit — Roadmap Operativa

> Generato: 2026-03-23 | Target: Claude Sonnet 4.6
> Obiettivo: evolvere il sistema esistente (DocenteDoc AI) in Orbit, modulare, dinamico e centrato sull'utente
> Baseline: P44.6 + Design System (`orbitTheme.ts`) + OrbitTeaser

---

## 1️⃣ Stato attuale

### Componenti già implementate (da mantenere)

| Componente                                                                | File                                           | Note |
| ------------------------------------------------------------------------- | ---------------------------------------------- | ---- |
| `ScheduleContext` + `resolveScheduleContext()`                            | `src/modules/orchestration/`                   | ✅   |
| `useProactiveSchedule` + `ingestInput`                                    | `src/hooks/`                                   | ✅   |
| Pattern detector (`ActionLog`, `detectPattern`)                           | `src/modules/orchestration/patternDetector.ts` | ✅   |
| Emergent skill store (`DynamicSkill`, match/decay)                        | `src/stores/useEmergentSkillsStore.ts`         | ✅   |
| `useSkillSuggestion` con polling e conferma/dismiss                       | `src/hooks/`                                   | ✅   |
| `userBehaviorModel.ts` + `useUserBehaviorStore`                           | `src/stores/`, `src/cognition/`                | ✅   |
| `skillRegistry` + `defaultSkills` (LOAD, OPEN, MANAGE)                    | `src/modules/orchestration/skillRegistry.ts`   | ✅   |
| Landing system (ScheduleLanding, ClassLanding, LessonLanding)             | `src/components/`                              | ✅   |
| `activeLanding` state + trigger in UserWorkspace                          | `src/simulation/UIController.tsx`              | ✅   |
| External connectors: email, file, sync                                    | `src/modules/connectors/`                      | ✅   |
| Automation levels + `InlineActionStrip`                                   | `src/components/`                              | ✅   |
| `buildContext()` integrato con `userBehaviorStore` + `ucAdaptiveBoosts`   | `src/cognition/copilotBrain.ts`                | ✅   |
| Design System unificato: `orbitTheme.ts`, `orbitTokens.ts`, `OrbitTeaser` | `src/theme/`, `src/components/ui/`             | ✅   |

### Componenti mancanti / da implementare

| Componente                                                    | Fase target | Priorità      |
| ------------------------------------------------------------- | ----------- | ------------- |
| Esperienza desktop ottimizzata (multi-pane, layout `≥ md`)    | Fase 5      | 🔴 Alta       |
| Mondi orbitanti (feed, contenuti, suggerimenti dinamici)      | Fase 6      | 🟡 Media      |
| Social layer (gruppi, scuole, collaborazioni, note condivise) | Fase 7      | 🟡 Media      |
| Inibizione / orchestrazione completa vecchia UI               | Fase 8      | 🟠 Media-Alta |
| Testing & tuning QA completo                                  | Fase 9      | 🔴 Alta       |
| Lancio su mobile e desktop                                    | Fase 10     | 🔴 Alta       |

---

## 2️⃣ Obiettivi principali

1. **Centralità utente e IA**
   - Tutte le logiche di business della vecchia app devono essere _apprese_ dall'IA, non solo replicate in codice
   - Visualizzazione e viste dinamiche generate dall'IA in funzione dell'uso

2. **Landing e mondi**
   - Landing sempre contestuali al mondo in uso
   - Altri mondi (culturali, interessi, social) orbitano intorno senza interferenze

3. **Social layer dei mondi**
   - Gruppi e feed interconnessi
   - Documenti e note condivise
   - Privacy e sicurezza già implementata (GDPR art.13 baseline)

4. **Design System moderno**
   - Base MD3 + MUIv7 — contratto Gold Compliant non derogabile
   - Palette modulare e componenti responsive
   - Stile modulare e leggero: ispirato a Notion / Google Apps
   - Logo Orbit integrato e riutilizzabile

5. **Performance e adattabilità**
   - Versione mobile con FAB e InlineActionStrip
   - Versione desktop ottimizzata per tastiera e mouse
   - Crescita dinamica dei mondi e dei suggerimenti

---

## 3️⃣ Roadmap step-by-step

| Fase        | Obiettivo               | Azione                                                                 | Stato       | Output atteso                                                                                                                                                                                                        |
| ----------- | ----------------------- | ---------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fase 0**  | Analisi stato attuale   | Mappatura componenti esistenti e gap                                   | ✅ Completo | Lista completa moduli attivi — questo documento                                                                                                                                                                      |
| **Fase 1**  | Landing System          | ScheduleLanding, ClassLanding, LessonLanding + `activeLanding` state   | ✅ Completo | Overlay fullscreen, back button, trigger landingType                                                                                                                                                                 |
| **Fase 2**  | IA & behavior-driven    | Logiche di business trasferite a IA                                    | ✅ Completo | PlanEngine, OrbitDock, DecisionCard, buildContext() + boosts                                                                                                                                                         |
| **Fase 3**  | External connectors     | Email, File, Sync — mock-first                                         | ✅ Completo | emailConnector, fileConnector, useExternalSync                                                                                                                                                                       |
| **Fase 4**  | Automation levels       | Suggested → Assisted → Auto (stub)                                     | ✅ Completo | InlineActionStrip + gestione frequenza azioni                                                                                                                                                                        |
| **Fase 5**  | Design System unificato | Palette modulare, componenti MUIv7/MD3, `orbitTheme.ts`                | ✅ Completo | `injectOrbitCssVars()`, OrbitTeaser, `ORBIT_BACKGROUND/TEASER/STEP_COLORS`                                                                                                                                           |
| **Fase 6**  | Mondi orbitanti         | Feed, contenuti e suggerimenti dinamici                                | 🔄 In corso | Crescita dinamica con l'uso, privacy garantita                                                                                                                                                                       |
| **Fase 7**  | Social layer            | Gruppi, scuole, collaborazioni — documenti condivisi, note, permessi   | ✅ Completo | Store condiviso, GDPR-safe, permission model (`orbit_social_v1`)                                                                                                                                                     |
| **Fase 8**  | Inibizione vecchia UI   | Visualizzazione della vecchia app nascosta, tutto orchestrato in Orbit | ✅ Completo | `features.types.ts`, `featureFlagEngine.ts`, `useOrbitFeaturesStore` persist `'orbit_features_v1'`, 64/64 test ✅                                                                                                    |
| **Fase 9**  | Testing & tuning        | Validazione UX, IA, performance                                        | 🔄 In corso | `useOrbitInhibition` hook + ViewManager wiring + 36 unit tests ✅ + E2E 8 scenari + `useWorldStore.test.ts` 24/24 ✅ + `OrbitControlPanel` settings UI + `OrbitControlPanel.test.tsx` 34/34 ✅ + Settings.tsx wiring |
| **Fase 10** | Lancio completo         | Orbit operativo su mobile e desktop                                    | ⏳          | Esperienza completa, social layer, distribuzione                                                                                                                                                                     |

---

## 4️⃣ Note operative

- Tutti gli step devono partire dalla base esistente per non perdere dati o logiche
- Il sistema deve iniziare **minimal**: poche azioni iniziali, IA apprende il resto dinamicamente
- Inibire la UI vecchia (`adaptBlocks hidden: true`) solo quando Orbit è pronto a gestire la visualizzazione e la logica relativa
- Priorità: centralità utente → IA → mondi → social layer
- Design System modulare permette di generare UI coerente su mobile e desktop, mantenendo leggerezza e modernità
- `adaptBlocks` non elimina mai contenuto — usa solo `hidden: true` — invariante non derogabile
- Automazioni con undo e log — mai eseguire azioni irrecuperabili senza consenso utente

---

## 5️⃣ Consigli operativi

1. **Mantenere sempre sincronizzata la base**
   - La vecchia app resta invisibile ma le sue logiche restano accessibili all'IA
   - Non rimuovere moduli legacy senza prima verificare che l'IA li abbia interiorizzati come intent

2. **Micro-lanci**
   - Testare ogni landing e funzione prima di procedere alla fase successiva
   - Ogni Fase va considerata "done" solo quando `npx tsc -b --noEmit` + `npm run lint` → EXIT:0

3. **Monitoraggio e feedback**
   - `useUserBehaviorStore` + analytics locali per adattare IA
   - `recordModeUsage` + `recordRevealClick` → segnali di engagement già attivi

4. **Iterazioni rapide**
   - Ogni mondo e landing deve essere testato singolarmente
   - Aggiungere mondi e feed in modo incrementale — non tutto subito

5. **Personalizzazione**
   - L'IA deve imparare e proporre contenuti rilevanti tramite `OrbitSuggestionEngine` (intent questions soft)
   - `smoothStyle` EWA 70/30 già attivo — non aumentare il peso "30% new" senza test A/B

---

## 6️⃣ Sprint immediati consigliati

Basandosi sulle Fasi 0-5 completate, i prossimi sprint in ordine di priorità:

### Sprint A — Desktop UX (Fase 5 estesa / Fase 6 prerequisito)

- `OrbitDock` laterale su viewport `≥ md` (non bottom sheet)
- `PlanCard` floating affiancata alla chat su `≥ lg`
- Breakpoint MUI v7 — nessun `@media` custom
- Stima: 1-2 sprint

### Sprint B — Estrazione Intent Legacy (Fase 2 estesa)

- Creare `src/modules/orchestration/legacyIntentMap.ts`
- Tradurre flussi DocenteDocAI (crea UDA, aggiungi alunno, pianifica lezione…) in `OrbitIntent`
- Fare in modo che `buildPlan()` consumi `legacyIntentMap` per flussi legacy
- Stima: 1-2 sprint

### Sprint C — Mondi Orbitanti (Fase 6) ✅

- `src/modules/orbit/worldTypes.ts` — `WorldConfig`, `WorldFeed`, `WorldFeedEntry`, `WorldContext`
- `src/modules/orbit/worldRegistry.ts` — registry singleton + 3 mondi default (Didattica ✅, Cultura stub, Benessere stub)
- `src/stores/useWorldStore.ts` — persist `'orbit_worlds_v1'` con `activeWorldId` + `visitedWorldIds`
- `OrbitSuggestionEngine` esteso: `OrbitContext` ora accetta `activeWorldId` + `availableWorlds`; genera soft question "Vuoi esplorare il mondo X?" per cross-world transitions

### Sprint D — Testing unità (Fase 9 parziale) ✅

- `__tests__/modules/orchestration/legacyIntentMap.test.ts` — 30 test: matchLegacyIntent, struttura LEGACY_INTENTS, integrazione PlanEngine
- `__tests__/modules/orbit/worldRegistry.test.ts` — 17 test: register/resolve/has/listExcept, overwrite, defensive copy, integrità strutturale
- `__tests__/modules/orbit/OrbitSuggestionEngine.test.ts` — 21 test: MAX_SUGGESTIONS, soft-question labels, filtri, regole emotive, cross-world Fase 6
- Totale: **68 test, 3 suite, tutti ✅ — TSC:0, lint:0**

### Sprint E — Social Layer (Fase 7) ✅

- `src/types/social.types.ts` — `PermissionLevel`, `GroupMember`, `SocialGroup`, `SharedDocument` (GDPR-safe, audit trail)
- `src/modules/orbit/socialEngine.ts` — `canSatisfy`, `resolveEffectivePermission`, `canAccess`, `createGroupId/DocumentId`, `getConsentingMembers`, `isMember`, `getGroupsForUser` (pure, zero side-effects)
- `src/stores/useGroupStore.ts` — Zustand persist `'orbit_social_v1'`: createGroup, dissolveGroup, addMember, removeMember (GDPR audit trail), shareDocument, revokeDocument, updatePermission + selectors
- `OrbitSuggestionEngine` esteso: `OrbitContext` ora accetta `activeGroups?`; genera soft question "Vuoi condividere con il gruppo X?" (confidence 0.65)
- **Test**: `__tests__/modules/orbit/socialEngine.test.ts` (45 test) + `__tests__/stores/useGroupStore.test.ts` (34 test) → **79/79 ✅ — TSC:0, lint:0**

### Sprint F — UI Inhibition (Fase 8) ✅

- `src/types/features.types.ts` — `PanelId` (7 legacy panels), `OrbitFeatureFlags`, `PanelInhibitionResult` (pure types, no imports)
- `src/modules/orbit/featureFlagEngine.ts` — `ALL_PANELS`, `resolveInhibition()`, `shouldInhibitPanel()`, `resolveAllPanels()`, `getInhibitedPanels()`, `getVisiblePanels()`, `createDefaultFlags()` — pure functions, zero side-effects
  - Resolution order: `override(true)` → `override(false)` → `orbitFullControl` → `default_shown`
  - **INVARIANT**: inhibition is always soft (`hidden: true`) — panels never unmounted, legacy logic always accessible to IA
- `src/stores/useOrbitFeaturesStore.ts` — Zustand persist `'orbit_features_v1'`; state: `orbitFullControl` (default false), `panelOverrides` (default {})
  - Actions: `enableOrbitFullControl`, `disableOrbitFullControl`, `overridePanel`, `resetOverride`, `resetAllOverrides`, `resetToDefault`
  - Selectors: `selectFlags`, `selectIsPanelOverridden(panelId)`
  - `partialize` excludes action functions from persistence
- **Test**: `__tests__/modules/orbit/featureFlagEngine.test.ts` (37 test) + `__tests__/stores/useOrbitFeaturesStore.test.ts` (27 test) → **64/64 ✅ — TSC:0, lint:0**

### Sprint G — UILayer Wiring + E2E (Fase 9 parziale) ✅

- `src/hooks/useOrbitInhibition.ts` — `VIEW_TO_PANEL_ID` (View→PanelId mapping, 7 panel buckets, 14 view keys), `useOrbitInhibition(panelId)`, `useViewInhibition(view)`, `useAllPanelInhibition()`
  - Orbit-native views (e.g. `'welcome'`) never inhibited — returns `default_shown` always
- `src/components/ViewManager.tsx` — wired `useViewInhibition(view)` + `useEffect` that annotates `#main-content` with:
  - `data-orbit-panel-id` — current `PanelId` (for known views)
  - `data-orbit-inhibited="true"` — when panel is soft-hidden by Orbit
  - `data-orbit-inhibition-reason` — `'orbit_full_control' | 'manual_override_hidden' | 'manual_override_shown' | 'default_shown'`
  - **INVARIANT preserved**: no DOM elements removed; only data attributes set
- `e2e/orbit-feature-flags.spec.ts` — 8 Playwright E2E scenarios: default state, panel ID annotation, orbitFullControl, reason attribute, reset, manual override hidden, manual override shown (force visible)
- **Unit test**: `__tests__/hooks/useOrbitInhibition.test.ts` (36 test) → **36/36 ✅ — TSC:0, lint:0**

### Sprint H — World Store Tests + OrbitControlPanel UI (Fase 9 parziale) ✅

- `__tests__/stores/useWorldStore.test.ts` — 24 tests: initial state, setActiveWorld, visit deduplication, resetToDefault (preserves history), selectors `selectActiveWorldId` + `selectHasVisited`, structural contracts → **24/24 ✅**
- `src/components/orbit/OrbitControlPanel.tsx` — MD3 Gold Compliant settings UI surface:
  - Global toggle: `orbitFullControl` on/off with plain-language status
  - Per-panel rows: `PanelRow` shows current inhibition status, reason chip, per-panel Switch + reset button
  - `PANEL_LABELS` + `PANEL_ICONS` maps for all 7 `PanelId` values
  - All spacing, colors, typography via MD3 tokens — **lint:0, TSC:0**
  - Plugs into `useOrbitFeaturesStore` + `selectFlags` + `selectIsPanelOverridden`

### Sprint I — OrbitControlPanel Tests + Settings Wiring (Fase 9 completamento) ✅

- `__tests__/components/orbit/OrbitControlPanel.test.tsx` — 34 tests:
  - Rendering: title, subtitle with inhibited count, all 7 Italian panel labels, switch count
  - Global toggle: checked/unchecked state, `enableOrbitFullControl` / `disableOrbitFullControl` spies
  - Per-panel switch state: default/orbitFullControl/override=true/override=false
  - Reason chips: predefinito / nascosto da Orbit / nascosto manualmente / visibile manualmente
  - Per-panel override actions: `overridePanel(panelId, bool)` + `resetOverride(panelId)`
  - Reset all overrides button: visibility + `resetAllOverrides` spy
  - `onToggle` callback + accordion expanded/collapsed
  - **Note**: MUI v7 Switch `inputProps` aria-label not resolved in JSDOM → index-based `getGlobalSwitch()` / `getPanelSwitch(id)` helpers used
  - → **34/34 ✅ — TSC:0, lint:0**
- `src/components/Settings.tsx` — `OrbitControlPanel` wired as new `'orbit_control'` accordion group (between SettingsDebug and SettingsAdvanced; always visible, no DEV guard)

---

## 7️⃣ File di riferimento

| Documento                                                          | Contenuto                                             |
| ------------------------------------------------------------------ | ----------------------------------------------------- |
| [ORBIT_VISION_2026.md](ORBIT_VISION_2026.md)                       | Stato attuale, visione, vincoli, design system esteso |
| [ORBIT_PHASE24_PLAN.md](ORBIT_PHASE24_PLAN.md)                     | Dettaglio implementativo Phase A/B/C (tutte ✅)       |
| [COGNITIVE_ARCHITECTURE_P44.6.md](COGNITIVE_ARCHITECTURE_P44.6.md) | Architettura cognitiva completa + pipeline UIBlock    |
| [ORBIT_JARVIS_BLUEPRINT.md](ORBIT_JARVIS_BLUEPRINT.md)             | Vision prodotto Orbit Jarvis                          |
| [ORBIT_BRAND_DESIGN.md](ORBIT_BRAND_DESIGN.md)                     | Brand identity, colori, tipografia, logo              |
