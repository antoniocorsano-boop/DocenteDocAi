# DocenteDoc AI — Handoff Document

**Data:** 2026-03-08  
**Sessione:** MUI v7 Migration — Fase 5 NKA completa (GameMode, NKABottomSheet, NKAForceMap, NKAHeaderAuraButton, NKAHeaderIntegration)  
**Branch:** `main`  
**HEAD:** `c96aab69` (working tree con modifiche non-committate)

---

## 1. Stato del Progetto

### Metriche di Qualità al Handoff

| Metrica         | Valore                                |
| --------------- | ------------------------------------- |
| Test Files      | **115 / 115 passing**                 |
| Tests           | **1255 passed**, 10 skipped, 0 failed |
| ESLint Errors   | **0**                                 |
| ESLint Warnings | **0**                                 |
| Build           | ✅ Successo (2064 moduli trasformati) |
| Snapshots       | 26 aggiornati al rendering MUI v7     |

---

## 2. Cosa è Stato Fatto in Questa Sessione

### 2.1 Fix Warning ESLint #1 — `Home.tsx` `react-hooks/exhaustive-deps`

`evaluations` era inizializzato con `|| []` direttamente sul selettore Zustand, creando un array
nuovo ad ogni render e rendendo instabile la dipendenza del `useMemo` a L65. Risolto con:

```tsx
const evaluationsRaw = useStudentStore((state) => state.evaluations);
const evaluations = useMemo(() => evaluationsRaw ?? [], [evaluationsRaw]);
```

Warning ESLint ora **0**.

### 2.2 Migrazione Consumatori M3Typography — Accessibility e Help

| File                                        | Migrazione                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| `src/components/accessibility/SkipLink.tsx` | `M3Typography` → `Typography` MUI                                        |
| `src/components/help/ManualSection.tsx`     | `M3Typography variant="title-medium"` → `Typography variant="subtitle2"` |
| `src/components/help/UseCaseCard.tsx`       | `M3Typography body-large/body-small` → `Typography body1/body2` + `sx`   |

### 2.3 Migrazione Fase 5 — Wizard (3 file)

| File                                       | Migrazione                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| `src/components/AnnualPlanningWizard.tsx`  | `M3Dialog` (fullscreen) → `Dialog fullScreen` + `DialogTitle` MUI                |
| `src/components/PassaggioAnnoWizard.tsx`   | `M3Dialog hideBackdrop` → `Dialog hideBackdrop` + `DialogTitle` MUI              |
| `src/components/PianoInclusioneEditor.tsx` | `M3Dialog` → `Dialog` + `DialogTitle`; `TextArea` ×2 → `TextField multiline` MUI |

### 2.4 Migrazione Fase 5 — Moduli NKA (5 file)

| File                               | Migrazione                                                                                                                                                                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/nka/NKAHeaderIntegration.tsx` | `M3Surface` → `Paper`; rimosso import `M3Typography` inutilizzato                                                                                                                                                             |
| `src/nka/NKAHeaderAuraButton.tsx`  | 3×`M3Surface(level=0,1,3)` → `Paper(elevation=0,1,3)`; `M3Typography body-small` → `Typography body2`                                                                                                                         |
| `src/nka/NKAForceMap.tsx`          | `M3Surface` → `Paper`; 5×`M3Typography` (body-large/medium) → `Typography (body1/body2)`                                                                                                                                      |
| `src/nka/NKABottomSheet.tsx`       | `M3Surface` → `Paper`/`Box`; `M3Typography` → `Typography`; `M3IconButton` → `IconButton`+`Icon`; `M3Button` → `Button`; `M3Skeleton` → `Skeleton`                                                                            |
| `src/nka/GameMode.tsx`             | `M3Surface` → `Paper`/`Box`; `M3Typography` → `Typography`; `M3ProgressBar` → `LinearProgress`; `M3Chip`/`M3ChipGroup` → `Chip`/`Box`; `M3Button`/`M3ButtonGroup` → `Button`/`Box`; `M3CircularProgress` → `CircularProgress` |

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

### In Corso / Da Fare 🔄

Residuano ~128 file con import `M3*` (include UI atomici e stories).
La migrazione file-per-file prosegue. Prossimi target:

1. **Consumatori `M3*` in `src/components/ui/`** — ActionCard, EmptyState, LoadingState, MetricCard, ValidatedInput, AnimatedCheckbox, BottomSheet, CalendarEventCard
2. **Settings con TabGroup/SelectField:** `AiDidatticaSettings.tsx`, `InterfaceSettings.tsx`
3. **Fase 6 — Pulizia:** rimuovere file `M3*.tsx` legacy dopo aver azzerato tutti i consumatori

**Regola operativa:** una sessione = un file, commit atomico.

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
(working)   fix(migration): Home.tsx useMemo + SkipLink/ManualSection/UseCaseCard M3Typography→Typography + AnnualPlanningWizard/PassaggioAnnoWizard/PianoInclusioneEditor M3Dialog→Dialog
c96aab69  fix(tests+lint): update tests for MUI v7 + remove unused imports  ← ultimo commit
df81d6c5  chore: migrate to MUI v7 + repo cleanup + rename useTheme hooks
ebc78085  fix(lint): eliminate all 253 ESLint warnings — 0 warnings remaining
ebe44554  fix(tests): fix test infrastructure and UI components
ad721f53  perf: lighthouse 79/100 + lint 0 errors + test 1357/1357
f402862d  fix(ux): risolti 6 problemi critici UX/UI
```

---

## 8. File Chiave da Conoscere

| File                                 | Ruolo                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------- |
| `src/theme/muiTheme.ts`              | Tema MUI v7 centralizzato, bridge ai token MD3                             |
| `src/theme/M3ThemeProvider.tsx`      | Provider che monta entrambi i sistemi tema                                 |
| `src/components/ui/index.ts`         | Export barrel dei componenti `M3*` (ancora in uso)                         |
| `src/test-utils.tsx`                 | `renderWithM3Theme` helper per i test                                      |
| `.github/copilot-instructions.md`    | Contratto MD3 Governance & Compliance — da rispettare per ogni modifica UI |
| `docs/REFACTORING_MUI_V7_ROADMAP.md` | Roadmap completa migrazione MUI v7                                         |

---

## 9. Prossimi Passi Raccomandati

1. **Commit** — i ~12 file modificati in questa sessione non sono ancora committati
2. **Consumatori `M3*` in `src/components/ui/`** — ActionCard, EmptyState, LoadingState, MetricCard, ValidatedInput, AnimatedCheckbox, BottomSheet, CalendarEventCard
3. **Settings** — `AiDidatticaSettings.tsx` (TabGroup + SelectField) e `InterfaceSettings.tsx` (TabGroup)
4. **Fase 6 — Pulizia** — rimuovere file `M3*.tsx` legacy dopo aver azzerato tutti i consumatori
5. **Risolvere circular chunk** — ottimizzare `manualChunks` in `vite.config.ts`
6. **Aggiornare `docs/ARCHITECTURE.md`** — marcato OBSOLETE, va riscritto per MUI v7
