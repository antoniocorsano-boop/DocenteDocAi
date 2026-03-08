# DocenteDoc AI — Handoff Document

**Data:** 2026-03-08  
**Sessione:** MUI v7 Migration — Fase 6 COMPLETATA (TextArea, SelectField, TabGroup smantellati)  
**Branch:** `main`  
**HEAD:** (post-migrazione Fase 6 thin wrappers)

---

## 1. Stato del Progetto

### Metriche di Qualità al Handoff

| Metrica         | Valore                                |
| --------------- | ------------------------------------- |
| Test Files      | **99 / 99 passing**                   |
| Tests           | **1214 passed**, 10 skipped, 0 failed |
| ESLint Errors   | **0**                                 |
| ESLint Warnings | **0**                                 |
| Build           | ✅ Successo                           |
| Snapshots       | Invariati                             |

---

## 2. Cosa è Stato Fatto in Questa Sessione

### 2.0 Fase 6 — Migrazione Thin Wrappers TextArea, SelectField, TabGroup

| Wrapper eliminato | Consumer migrati | Target MUI                                |
| ----------------- | ---------------- | ----------------------------------------- |
| `TextArea.tsx`    | 18 file          | `TextField multiline`                     |
| `SelectField.tsx` | 22 file          | `FormControl + InputLabel + NativeSelect` |
| `TabGroup.tsx`    | 23 file          | `Tabs + Tab + Badge + Box` (inline)       |

Eliminati anche: `TextArea.stories.tsx`, `SelectField.stories.tsx`, `SelectField.stories.test.tsx`, `TextArea.stories.test.tsx`.  
`src/components/ui/index.ts` barrel aggiornato (rimossi 3 export).  
Test di regressione `EvaluationModule` fixato (aggiunto `htmlFor`/`inputProps.id` alla select `Voto Numerico`).

### Sessione precedente (2026-03-07)

| File                                          | Migrazione                                                     |
| --------------------------------------------- | -------------------------------------------------------------- |
| `src/components/ui/ActionTile.tsx`            | `M3Typography title-medium/label-medium` → `subtitle2/caption` |
| `src/components/ui/AnimatedCheckbox.tsx`      | `M3Typography body-medium/body-small` → `body2`                |
| `src/components/ui/M3ExpressiveCard.tsx`      | `M3Typography title-medium/body-medium` → `subtitle2/body2`    |
| `src/components/ui/AccessibilitySettings.tsx` | 5× `M3Surface` + `M3Typography` → `Paper` + `Typography`       |

### 2.2 Fase 6 — Migrazione NKA, Tema e test-utils

| File                            | Migrazione                                                           |
| ------------------------------- | -------------------------------------------------------------------- |
| `src/nka/NKASettingsToggle.tsx` | `M3Surface level=1` + 4× `M3Typography` → `Paper` + `Typography`     |
| `src/nka/NKAProvider.tsx`       | Rimossi import dead (`M3Surface`, `M3Typography`)                    |
| `src/theme/M3ThemeProvider.tsx` | 3× `M3Surface` + 3× `M3Typography` → `Paper` + `Typography`          |
| `src/test-utils.tsx`            | `TestSurfaceWrapper`, `TestLoadingSkeleton` riscritti con MUI nativo |

### 2.3 Fase 6 — Eliminazione 19 Componenti Zero-Consumer (34 file)

Eliminati tutti i componenti senza consumatori in produzione:

`M3ActivityItem`, `M3AnimatedIcon`, `M3Aside`, `M3BadgedIcon`, `M3BannerHero`, `M3BottomAppBar`,
`M3DatePicker`, `M3EmptyStateCard`, `M3FlexContainer`, `M3HeroCard`, `M3MotionCard`, `M3RatingBar`,
`M3SpeedDial`, `M3StaggeredList`, `M3StateLayer`, `M3SuggestionCard`, `M3SuggestionItem`,
`M3SurfaceCard`, `M3Switch`

### 2.4 Fase 6 — Migrazione Consumatori M3ChoiceCard e M3ExpressiveCard

| File                                      | Migrazione                                       |
| ----------------------------------------- | ------------------------------------------------ |
| `src/components/AddEvaluationModal.tsx`   | `M3ChoiceCard` → `Card` MUI + local `ChoiceCard` |
| `src/components/AddProvaModal.tsx`        | `M3ChoiceCard` → `Card` MUI + local `ChoiceCard` |
| `src/components/EditSlotModal.tsx`        | `M3ChoiceCard` → `Card` MUI + local `ChoiceCard` |
| `src/components/EventModal.tsx`           | `M3ChoiceCard` → `Card` MUI + local `ChoiceCard` |
| `src/components/QuickEvaluationModal.tsx` | `M3ChoiceCard` → `Card` MUI + local `ChoiceCard` |
| `src/components/ClassSelection.tsx`       | `M3ExpressiveCard` → `Card` MUI + local `Card`   |
| `src/components/ProgettazioneHub.tsx`     | `M3ExpressiveCard` → `Card` MUI + local `Card`   |
| `src/components/StudentClassroomView.tsx` | `M3ExpressiveCard` → `Card` MUI + local `Card`   |

### 2.5 Fase 6 — Eliminazione Ultimi Wrapper e Pulizia

- `M3Typography.tsx`, `M3Surface.tsx`, `M3ChoiceCard.tsx`, `M3ExpressiveCard.tsx` + stories + stale tests eliminati
- Mock stale rimossi da `Home.test.tsx` e `Home.integration.test.tsx` (−182 righe)
- 15 snapshot aggiornati (hash CSS class MUI cambiati post-migrazione)
- `src/components/ui/index.ts` barrel aggiornato progressivamente

---

## 3. Stato della Migrazione MUI v7

La migrazione al design system MUI v7 è **in corso**. Vedi [REFACTORING_MUI_V7_ROADMAP.md](REFACTORING_MUI_V7_ROADMAP.md) per la roadmap completa.

### Completato ✅

- Stack MUI v7 installato + tema centralizzato + `ThemeProvider` montato
- Fase 1 (fondamenta), Fase 2 (wrapper `M3*`), Fase 2C (navigazione), Fase 3 (51 modali), Fase 4 (view + settings + auth)
- `Home.tsx` migrato a MUI nativo
- Tutti i test aggiornati per MUI v7; 0 warning ESLint
- **Fase 5 completa:** tutti i wizard + **tutti e 5 i file `src/nka/`** (GameMode, NKABottomSheet, NKAForceMap, NKAHeaderAuraButton, NKAHeaderIntegration) ✅
- **Consumatori M3Typography:** `SkipLink`, `ManualSection`, `UseCaseCard` ✅
- **Fase 6 completa (2026-03-07):** eliminati 30+ wrapper M3\* (Typography, Surface, Card, Chip, Button, IconButton, ChoiceCard, ListItem, Menu + 19 zero-consumer); barrel aggiornato; snapshot sincronizzati ✅
- **Fase 6 thin wrappers (2026-03-08):** eliminati TextArea (18 consumer), SelectField (22 consumer), TabGroup (23 consumer); 63 file migrati; barrel aggiornato; 99/99 test green ✅

### In Corso / Da Fare 🔄

**Fase 6 è COMPLETA.** Non residuano thin wrapper da smantellare.

**Componenti mantenuti permanentemente (smart components con logica reale):**

- `M3Dialog.tsx` — 64 consumer, gestione close/keyboard/backdrop → **KEEP**
- `M3Popover.tsx` — viewport-aware positioning → **KEEP**
- `AppLayout.md3.tsx` — orchestrazione Header/Nav/BottomNav → **KEEP**
- `TextField.tsx` (custom) — smart wrapper con leadingIcon/InputAdornment → **KEEP**

**Regola operativa:** una sessione = un tipo di wrapper, commit atomico per file.

---

## 4. Warning ESLint Residui

Nessun warning ESLint aperto. ✅

> Nota: `src/nka/` è escluso da ESLint via `eslint.config.mjs` (pattern `**/nka/**`).
> I file NKA vanno migrati ma non producono segnalazioni lint.

---

## 5. Warning di Build (Non Bloccanti)

| Tipo                    | Descrizione                                                                           | Azione Consigliata                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Circular chunk          | `vendor → react-vendor → vendor`                                                      | Rivedere `manualChunks` in `vite.config.ts`                                                  |
| CSS minify warnings     | `color-mix()` e `oklch()` nei token MD3 — esbuild non supporta pienamente CSS Level 4 | Non critico per la produzione; considerare `postcss-nesting` o `lightningcss`                |
| Overwrite emitted files | Alcuni asset `.gz`/`.br` vengono emessi due volte                                     | Già presente prima di questa sessione; legato alla configurazione del plugin di compressione |

---

## 6. Ambiente di Sviluppo

```
Node.js:   v24.13.1
React:     ^18.2.0
TypeScript: (vedi tsconfig.json)
MUI:       ^7.3.9
Vite:      (vedi package.json)
Vitest:    (run con npx vitest)
```

### Comandi principali

```bash
npm run dev          # Dev server
npm run build        # Build produzione
npm run test:unit    # Tutti i test unit (vitest run)
npm run lint         # ESLint
npm run lint:fix     # ESLint con autofix
```

---

## 7. Cronologia Commit Recenti

```
ba22ab83  test(fase6): update snapshots post-migration  ← HEAD
081e81c3  test(fase6): remove stale M3* mocks from Home tests
2dbfa0d1  feat(fase6): delete M3ChoiceCard, M3ExpressiveCard, M3Typography, M3Surface
a9e4ea28  feat(fase6): migrate M3ChoiceCard and M3ExpressiveCard consumers to native MUI
f9f87215  feat(fase6): delete 19 zero-consumer M3* components (34 file)
06545238  feat(fase6): migrate M3ThemeProvider + test-utils to MUI Paper+Typography
df1696c6  feat(fase6): migrate NKASettingsToggle M3Surface+M3Typography
84315aa5  feat(fase6): migrate ui/ M3Typography in ActionTile, AnimatedCheckbox, M3ExpressiveCard
```

---

## 8. File Chiave da Conoscere

| File                                 | Ruolo                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------- |
| `src/theme/muiTheme.ts`              | Tema MUI v7 centralizzato, bridge ai token MD3                             |
| `src/theme/M3ThemeProvider.tsx`      | Provider che monta entrambi i sistemi tema                                 |
| `src/components/ui/index.ts`         | Barrel exports — residua: `M3Dialog`, `M3Popover`, `TextField` (custom)    |
| `src/test-utils.tsx`                 | `renderWithM3Theme` helper per i test                                      |
| `.github/copilot-instructions.md`    | Contratto MD3 Governance & Compliance — da rispettare per ogni modifica UI |
| `docs/REFACTORING_MUI_V7_ROADMAP.md` | Roadmap completa migrazione MUI v7                                         |

---

## 9. Prossimi Passi Raccomandati

1. **Fase 6 completata** — nessun thin wrapper residuo
2. **`TextField.tsx` (custom)** — valutare migrazione a MUI `TextField` nativo con `InputAdornment` diretta nei consumer (~20+ consumer usano `leadingIcon`) — bassa priorità, funziona correttamente
3. **Risolvere circular chunk** — ottimizzare `manualChunks` in `vite.config.ts`
4. **Aggiornare `docs/ARCHITECTURE.md`** — marcato OBSOLETE, va riscritto per MUI v7
5. **CSS cleanup** — `ui-components.css` contiene classi utilità residue, valutare se tutte usate
