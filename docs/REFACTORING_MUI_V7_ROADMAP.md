# Roadmap Refactoring MUI v7 — DocenteDoc AI

**Creato:** 2026-03-06  
**Obiettivo:** Eliminare tutti i componenti custom MD3 (`M3*`, `AppLayout`, `SelectField`, `TextArea`, ecc.) e sostituirli con i componenti nativi di **MUI v7** (`@mui/material`), ottenendo un'app moderna, accessibile e manutenibile.

---

## Stato Attuale (snapshot 2026-03-06)

| Metrica                                                 | Valore                                                               |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| File `.tsx` con componenti custom ancora attivi         | **205**                                                              |
| File già su MUI v7                                      | 3 (`Home.tsx`, `muiTheme.ts`, parzialmente `main.tsx`)               |
| Componenti custom da dismettere in `src/components/ui/` | ~60 file `M3*.tsx`                                                   |
| Componenti custom con alto numero di consumatori        | `M3Typography` (30+), `M3Surface` (15+), `M3Button`/`M3Dialog` (40+) |

### Infrastruttura già pronta ✅

- `@mui/material ^7.3.9` e `@mui/icons-material ^7.3.9` installati
- `src/theme/muiTheme.ts` — tema centralizzato con bridge ai token `var(--md-sys-*)`
- `.github/instructions/copilot-instructions.md` — contratto di migrazione con mappa componenti
- `ThemeProvider` MUI già montato nell'albero React

---

## Mappa Componenti Custom → MUI v7

| Componente Custom (DA RIMUOVERE) | Equivalente MUI v7 (DA USARE)           |
| -------------------------------- | --------------------------------------- |
| `M3Typography`                   | `Typography`                            |
| `M3Surface`                      | `Paper`                                 |
| `M3Card`                         | `Card` + `CardContent`                  |
| `M3Chip`                         | `Chip`                                  |
| `M3ChipGroup`                    | `Stack` di `Chip`                       |
| `M3ButtonGroup`                  | `ButtonGroup`                           |
| `M3ProgressBar`                  | `LinearProgress`                        |
| `M3Button`                       | `Button`                                |
| `M3IconButton`                   | `IconButton`                            |
| `M3Dialog`                       | `Dialog`                                |
| `M3DialogContent`                | `DialogContent`                         |
| `M3DialogActions`                | `DialogActions`                         |
| `M3ChoiceCard`                   | `Card` con `Radio`/`Checkbox`           |
| `M3ListItem`                     | `ListItem` + `ListItemText`             |
| `M3Menu`                         | `Menu` + `MenuItem`                     |
| `M3Popover`                      | `Popover`                               |
| `SelectField`                    | `Select` + `FormControl` + `InputLabel` |
| `TextField` (custom)             | `TextField` MUI                         |
| `TextArea`                       | `TextField` MUI con `multiline`         |
| `TabGroup`                       | `Tabs` + `Tab`                          |
| `AppLayout`                      | `Box` + `Container`                     |
| `<div>` visivi                   | `Box`                                   |
| Icone custom/emoji               | `@mui/icons-material`                   |

---

## Regole Obbligatorie per Ogni Migrazione

1. **Una sessione = un file** — commit atomico per ogni file migrato
2. **Mai valori hardcoded in `sx`**:
   - ✅ `sx={{ p: 2, color: 'text.secondary', bgcolor: 'background.paper' }}`
   - ❌ `sx={{ padding: '16px', color: '#666', backgroundColor: '#fff' }}`
3. **Mai `style={{}}` inline** — usare sempre `sx`
4. **Ogni `IconButton` deve avere `aria-label`** — obbligatorio
5. **Icone decorative dentro Button**: `aria-hidden`
6. **Logica applicativa invariata** — solo il layer JSX/UI cambia
7. **Verificare zero import rimasti** prima di eliminare un custom con `grep -r "M3Button" src/`
8. **Touch target ≥ 48px** — già configurato nel tema, non sovrascrivere

---

## FASE 1 — Fondamenta Critiche

> **Priorità BLOCCANTE.** Questi file sono usati da quasi tutta l'app. Vanno migrati per primi per non sbloccare regressioni a cascata.

| #   | File                               | Azione                                                          | Effort |
| --- | ---------------------------------- | --------------------------------------------------------------- | ------ |
| 1.1 | `src/main.tsx`                     | `M3Surface` → `Paper`, `M3Typography` → `Typography`            | 30min  |
| 1.2 | `src/theme/theme.tsx`              | `M3Surface` → `Paper`, `M3Typography` → `Typography`            | 30min  |
| 1.3 | `src/contexts/ThemeContext.tsx`    | `M3Surface` → `Paper`, `M3Typography` → `Typography`            | 30min  |
| 1.4 | `src/contexts/ModalContext.tsx`    | `M3Surface` → `Paper`                                           | 20min  |
| 1.5 | `src/context/ModalContext.tsx`     | `M3Surface` → `Paper` (file duplicato - verificare e unificare) | 20min  |
| 1.6 | `src/components/App.tsx`           | `AppLayout` → `Box` + layout MUI                                | 1h     |
| 1.7 | `src/components/AppLayout.md3.tsx` | Riscrivere con `Box`/`Container` MUI, poi **eliminare**         | 1h     |

**Prompt Copilot per Fase 1:**

```
#file:src/main.tsx
Migra questo file da componenti MD3 custom a MUI v7 seguendo le istruzioni in
.github/instructions/copilot-instructions.md.
```

**Completamento Fase 1:** ✅ 2026-03-06

---

## FASE 2 — Componenti Atomici UI (src/components/ui/)

> Migrazione **interna** dei custom wrapper: l'implementazione diventa MUI, l'API pubblica può restare invariata temporaneamente per non spezzare tutti i consumatori in un colpo solo. In alternativa (preferita): eliminare direttamente e aggiornare i consumatori in batch.

### Batch 2A — Testo, Layout e Display

| #    | File custom                           | Strategia                                               | Stato         |
| ---- | ------------------------------------- | ------------------------------------------------------- | ------------- |
| 2A.1 | `src/components/ui/M3Typography.tsx`  | Thin wrapper su `Typography` MUI                        | ✅ 2026-03-06 |
| 2A.2 | `src/components/ui/M3Surface.tsx`     | Thin wrapper su `Paper` MUI                             | ✅ 2026-03-06 |
| 2A.3 | `src/components/ui/M3Card.tsx`        | Thin wrapper su `Card` MUI                              | ✅ 2026-03-06 |
| 2A.4 | `src/components/ui/M3Chip.tsx`        | Thin wrapper su `Chip` MUI                              | ✅ 2026-03-06 |
| 2A.5 | `src/components/ui/M3ChipGroup.tsx`   | Thin wrapper su `Stack` MUI                             | ✅ 2026-03-06 |
| 2A.6 | `src/components/ui/M3ProgressBar.tsx` | Thin wrapper su `LinearProgress`/`CircularProgress` MUI | ✅ 2026-03-06 |
| 2A.7 | `src/components/ui/M3ButtonGroup.tsx` | Thin wrapper su `Stack` MUI                             | ✅ 2026-03-06 |

### Batch 2B — Componenti Interattivi

| #     | File custom                               | Strategia                                                | Stato         |
| ----- | ----------------------------------------- | -------------------------------------------------------- | ------------- |
| 2B.1  | `src/components/ui/M3Button.tsx`          | Thin wrapper su `Button` MUI                             | ✅ 2026-03-06 |
| 2B.2  | `src/components/ui/M3IconButton.tsx`      | Thin wrapper su `IconButton` MUI                         | ✅ 2026-03-06 |
| 2B.3  | `src/components/ui/M3Dialog.tsx`          | Thin wrapper su `Dialog`+`DialogContent`+`DialogActions` | ✅ 2026-03-06 |
| 2B.4  | `src/components/ui/SelectField.tsx`       | Thin wrapper su `FormControl`+`NativeSelect` MUI         | ✅ 2026-03-06 |
| 2B.5  | `src/components/ui/TextField.tsx`         | Thin wrapper su `TextField` MUI                          | ✅ 2026-03-06 |
| 2B.6  | `src/components/ui/TextArea.tsx`          | Thin wrapper su `TextField multiline` MUI                | ✅ 2026-03-06 |
| 2B.7  | `src/components/ui/TabGroup.tsx`          | Thin wrapper su `Tabs`+`Tab` MUI                         | ✅ 2026-03-06 |
| 2B.8  | `src/components/ui/M3ChoiceCard.tsx`      | Thin wrapper su `Card` MUI come button                   | ✅ 2026-03-06 |
| 2B.9  | `src/components/ui/M3ListItem.tsx`        | Thin wrapper su `ListItem`+`ListItemText` MUI            | ✅ 2026-03-06 |
| 2B.10 | `src/components/ui/M3Menu.tsx`            | Mantiene M3Popover internamente (no migrazione)          | ⏸ kept as-is  |
| 2B.11 | `src/components/ui/M3Popover.tsx`         | Mantenuto (viewport-aware custom positioning)            | ⏸ kept as-is  |
| 2B.12 | `src/components/ui/M3SegmentedButton.tsx` | Thin wrapper su `ToggleButtonGroup`+`ToggleButton` MUI   | ✅ 2026-03-06 |

**Completamento Fase 2 Batch 2A+2B:** ✅ 2026-03-06 — Zero errori TypeScript post-migrazione

### Batch 2C — Componenti di Navigazione (alto impatto visivo)

| #    | File                                    | Azione                                                                                                          | Effort        |
| ---- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------- |
| 2C.1 | `src/components/Header.tsx`             | `AppBar` + `Toolbar` + `IconButton` MUI; `M3Typography`→`Typography`; `M3IconButton`→`IconButton`; `style`→`sx` | ✅ 2026-06-14 |
| 2C.2 | `src/components/BottomNav.tsx`          | `Typography` MUI; spring animation preserved (MD3 §9 exception)                                                 | ✅ 2026-06-14 |
| 2C.3 | `src/components/NavigationRail.tsx`     | `Typography` MUI; spring keyframe preserved (MD3 §9 exception)                                                  | ✅ 2026-06-14 |
| 2C.4 | `src/components/SecondaryNavDrawer.tsx` | `Typography` MUI; custom focus-trap preserved                                                                   | ✅ 2026-06-14 |
| 2C.5 | `src/components/Menu.tsx`               | `Typography` MUI                                                                                                | ✅ 2026-06-14 |
| 2C.6 | `src/components/Snackbar.tsx`           | `Typography` MUI; progress bar + custom colors preserved                                                        | ✅ 2026-06-14 |
| 2C.7 | `src/components/Tooltip.tsx`            | Full replacement → thin `Tooltip` MUI wrapper (156→38 lines)                                                    | ✅ 2026-06-14 |
| 2C.8 | `src/components/Breadcrumb.tsx`         | `Typography` MUI                                                                                                | ✅ 2026-06-14 |

**Completamento Fase 2C:** ✅ 2026-06-14 — Zero errori TypeScript post-migrazione

**Completamento Fase 1:** ✅ 2026-03-06

---

## FASE 3 — Modali (40+ file, alta visibilità docente)

> Migrazione file per file. Prompt da usare per ogni modale:
>
> ```
> #file:src/components/NOME_FILE.tsx
> Migra questo file da componenti MD3 custom a MUI v7 seguendo le istruzioni
> in .github/instructions/copilot-instructions.md.
> ```

### Batch 3A — Modali valutazione e studenti (core docente)

| #     | File                                           | Stato         |
| ----- | ---------------------------------------------- | ------------- |
| 3A.1  | `src/components/AddEvaluationModal.tsx`        | ✅ 2026-03-07 |
| 3A.2  | `src/components/QuickEvaluationModal.tsx`      | ✅ 2026-03-07 |
| 3A.3  | `src/components/CompetencyEvaluationModal.tsx` | ✅ 2026-03-07 |
| 3A.4  | `src/components/UnifiedEvaluationModal.tsx`    | ✅ 2026-03-07 |
| 3A.5  | `src/components/AddStudentModal.tsx`           | ✅ 2026-03-07 |
| 3A.6  | `src/components/ImportStudentsModal.tsx`       | ✅ 2026-03-07 |
| 3A.7  | `src/components/StudentEPortfolioModal.tsx`    | ✅ 2026-03-07 |
| 3A.8  | `src/components/StudentInterviewModal.tsx`     | ✅ 2026-03-07 |
| 3A.9  | `src/components/StudentTransferModal.tsx`      | ✅ 2026-03-07 |
| 3A.10 | `src/components/ObservationModal.tsx`          | ✅ 2026-03-07 |

### Batch 3B — Modali lezione e pianificazione

| #    | File                                         | Stato         |
| ---- | -------------------------------------------- | ------------- |
| 3B.1 | `src/components/EventModal.tsx`              | ✅ 2026-03-07 |
| 3B.2 | `src/components/EditSlotModal.tsx`           | ✅ 2026-03-07 |
| 3B.3 | `src/components/SlotActionModal.tsx`         | ✅ 2026-03-07 |
| 3B.4 | `src/components/CreateLessonFromAiModal.tsx` | ✅ 2026-03-07 |
| 3B.5 | `src/components/ImpromptuLessonModal.tsx`    | ✅ 2026-03-07 |
| 3B.6 | `src/components/LessonAnalysisModal.tsx`     | ✅ 2026-03-07 |
| 3B.7 | `src/components/CloseLessonModal.tsx`        | ✅ 2026-03-07 |
| 3B.8 | `src/components/AddProvaModal.tsx`           | ✅ 2026-03-07 |
| 3B.9 | `src/components/OrarioSettingsModal.tsx`     | ✅ 2026-03-07 |

### Batch 3C — Modali AI e documenti

| #     | File                                        | Stato         |
| ----- | ------------------------------------------- | ------------- |
| 3C.1  | `src/components/AssistantModal.tsx`         | ✅ 2026-03-07 |
| 3C.2  | `src/components/LiveAssistantModal.tsx`     | ✅ 2026-03-07 |
| 3C.3  | `src/components/AiEventParserModal.tsx`     | ✅ 2026-03-07 |
| 3C.4  | `src/components/DocumentGeneratorModal.tsx` | ✅ 2026-03-07 |
| 3C.5  | `src/components/DocumentViewerModal.tsx`    | ✅ 2026-03-07 |
| 3C.6  | `src/components/ImageAnalysisModal.tsx`     | ✅ 2026-03-07 |
| 3C.7  | `src/components/ImageGeneratorModal.tsx`    | ✅ 2026-03-07 |
| 3C.8  | `src/components/VideoAnalysisModal.tsx`     | ✅ 2026-03-07 |
| 3C.9  | `src/components/ImageViewerModal.tsx`       | ✅ 2026-03-07 |
| 3C.10 | `src/components/CircolareAnalysisModal.tsx` | ✅ 2026-03-07 |
| 3C.11 | `src/components/TestGeneratorModal.tsx`     | ✅ 2026-03-07 |
| 3C.12 | `src/components/TestPreviewModal.tsx`       | ✅ 2026-03-07 |
| 3C.13 | `src/components/IdeaGeneratorModal.tsx`     | ✅ 2026-03-07 |
| 3C.14 | `src/components/NotebookLMImportModal.tsx`  | ✅ 2026-03-07 |
| 3C.15 | `src/components/SmartImportModal.tsx`       | ✅ 2026-03-07 |

### Batch 3D — Modali sistema e gestione

| #     | File                                              | Stato         |
| ----- | ------------------------------------------------- | ------------- |
| 3D.1  | `src/components/BackupInfoModal.tsx`              | ✅ 2026-03-07 |
| 3D.2  | `src/components/SyncConflictModal.tsx`            | ✅ 2026-03-07 |
| 3D.3  | `src/components/ResetConfirmModal.tsx`            | ✅ 2026-03-07 |
| 3D.4  | `src/components/RestoreAssistModal.tsx`           | ✅ 2026-03-07 |
| 3D.5  | `src/components/PinPadModal.tsx`                  | ✅ 2026-03-07 |
| 3D.6  | `src/components/LoadingModal.tsx`                 | ✅ 2026-03-07 |
| 3D.7  | `src/components/HelpModal.tsx`                    | ✅ 2026-03-07 |
| 3D.8  | `src/components/ShareModal.tsx`                   | ✅ 2026-03-07 |
| 3D.9  | `src/components/ExportModal.tsx`                  | ✅ 2026-03-07 |
| 3D.10 | `src/components/BatchExportWizard.tsx`            | ✅ 2026-03-07 |
| 3D.11 | `src/components/UdaExportModal.tsx`               | ✅ 2026-03-07 |
| 3D.12 | `src/components/AddSourceModal.tsx`               | ✅ 2026-03-07 |
| 3D.13 | `src/components/CopyForRegisterModal.tsx`         | ✅ 2026-03-07 |
| 3D.14 | `src/components/MaterialPickerModal.tsx`          | ✅ 2026-03-07 |
| 3D.15 | `src/components/RegisterImportDialog.tsx`         | ✅ 2026-03-07 |
| 3D.16 | `src/components/AddOrientamentoActivityModal.tsx` | ✅ 2026-03-07 |
| 3D.17 | `src/components/HomeworkSubmission.tsx`           | ✅ 2026-03-07 |

### Batch 3E — Popover

| #    | File                                      | Azione        | Stato         |
| ---- | ----------------------------------------- | ------------- | ------------- |
| 3E.1 | `src/components/NotificationsPopover.tsx` | `Popover` MUI | ✅ 2026-03-07 |
| 3E.2 | `src/components/EventActionPopover.tsx`   | `Popover` MUI | ✅ 2026-03-07 |
| 3E.3 | `src/components/QuickNotePopover.tsx`     | `Popover` MUI | ✅ 2026-03-07 |

**Completamento Fase 3:** ✅ 2026-03-07 — Zero errori TypeScript post-migrazione (51 modali + popover)

---

## FASE 4 — View Principali (UX Docente)

> Ordine: priorità d'uso del docente e impatto visivo.

| #    | File                                          | Priorità                       | Stato         |
| ---- | --------------------------------------------- | ------------------------------ | ------------- |
| 4.1  | `src/components/Home.tsx`                     | 🔴 Alta (già parzialmente MUI) | ✅ 2026-03-06 |
| 4.2  | `src/components/ClassDashboard.tsx`           | 🔴 Alta                        | ✅ 2026-03-06 |
| 4.3  | `src/components/EvaluationModule.tsx`         | 🔴 Alta                        | ✅ 2026-03-06 |
| 4.4  | `src/components/LessonsPage.tsx`              | 🔴 Alta                        | ✅ 2026-03-06 |
| 4.5  | `src/components/LessonView.tsx`               | 🔴 Alta                        | ✅ 2026-03-06 |
| 4.6  | `src/components/RegisterView.tsx`             | 🔴 Alta                        | ✅ 2026-03-06 |
| 4.7  | `src/components/Calendar.tsx`                 | 🟠 Media                       | ✅ 2026-03-06 |
| 4.8  | `src/components/Timetable.tsx`                | 🟠 Media                       | ✅ 2026-03-06 |
| 4.9  | `src/components/KnowledgeBase.tsx`            | 🟠 Media                       | ✅ 2026-03-06 |
| 4.10 | `src/components/AnalyticsDashboard.tsx`       | 🟠 Media                       | ✅ 2026-03-06 |
| 4.11 | `src/components/AnalyticsHub.tsx`             | 🟠 Media                       | ✅ 2026-03-06 |
| 4.12 | `src/components/Settings.tsx`                 | 🟠 Media                       | ✅ 2026-03-06 |
| 4.13 | `src/components/AnnualPlanningWizard.tsx`     | 🟠 Media                       | ✅ 2026-03-07 |
| 4.14 | `src/components/ClassPlanningWizard.tsx`      | 🟠 Media                       | ✅ 2026-03-06 |
| 4.15 | `src/components/UdaPlanner.tsx`               | 🟠 Media                       | ✅ 2026-03-06 |
| 4.16 | `src/components/UdaDetailModal.tsx`           | 🟠 Media                       | ✅ 2026-03-06 |
| 4.17 | `src/components/StudentManager.tsx`           | 🟠 Media                       | ✅ 2026-03-06 |
| 4.18 | `src/components/StudentProfile.tsx`           | 🟠 Media                       | ✅ 2026-03-06 |
| 4.19 | `src/components/ProgettazioneHub.tsx`         | 🟠 Media                       | ✅ 2026-03-06 |
| 4.20 | `src/components/ReportisticaHub.tsx`          | 🟠 Media                       | ✅ 2026-03-06 |
| 4.21 | `src/components/OperationsCenter.tsx`         | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.22 | `src/components/ClassroomView.tsx`            | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.23 | `src/components/ClassSelection.tsx`           | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.24 | `src/components/ConsiglioClasse.tsx`          | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.25 | `src/components/ConsiglioClasseWizard.tsx`    | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.26 | `src/components/CurriculumManager.tsx`        | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.27 | `src/components/RubricEditor.tsx`             | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.28 | `src/components/RubricheManager.tsx`          | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.29 | `src/components/TemplateManager.tsx`          | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.30 | `src/components/Studio.tsx`                   | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.31 | `src/components/FeedManager.tsx`              | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.32 | `src/components/DidatticaInclusiva.tsx`       | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.33 | `src/components/OrientamentoDashboard.tsx`    | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.34 | `src/components/ClassAnalytics.tsx`           | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.35 | `src/components/ClassCompetencyDashboard.tsx` | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.36 | `src/components/AssistantDevTools.tsx`        | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.37 | `src/components/CorpusChat.tsx`               | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.38 | `src/components/WorkflowGuide.tsx`            | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.39 | `src/components/ImprovementGuide.tsx`         | 🟡 Bassa                       | ✅ 2026-03-06 |
| 4.40 | `src/components/WelcomeScreen.tsx`            | 🟡 Bassa                       | ✅ 2026-03-06 |

### Screens autenticazione

| #    | File                                        | Stato         |
| ---- | ------------------------------------------- | ------------- |
| 4.S1 | `src/components/SignInScreen.tsx`           | ✅ 2026-03-06 |
| 4.S2 | `src/components/LoginScreen.tsx`            | ✅ 2026-03-06 |
| 4.S3 | `src/components/ProfileSelectionScreen.tsx` | ✅ 2026-03-06 |
| 4.S4 | `src/components/StudentLoginScreen.tsx`     | ✅ 2026-03-06 |

### Settings

| #    | File                                                  | Stato         |
| ---- | ----------------------------------------------------- | ------------- |
| 4.T1 | `src/components/settings/AiDidatticaSettings.tsx`     | ✅ 2026-03-07 |
| 4.T2 | `src/components/settings/EmotionalPresetsManager.tsx` | ✅ 2026-03-06 |
| 4.T3 | `src/components/settings/InterfaceSettings.tsx`       | ✅ 2026-03-07 |
| 4.T4 | `src/components/settings/SettingsGroup.tsx`           | ✅ 2026-03-06 |
| 4.T5 | `src/components/settings/ThemeSettingsPanel.tsx`      | ✅ 2026-03-06 |

**Completamento Fase 4:** ✅ 2026-03-06 — 0 TypeScript errors. All views, modals, settings, and authentication screens migrated to MUI v7. Key fixes: M3Dialog prop compatibility via ./ui M3Dialog wrapper, M3ExpressiveCard/M3ChoiceCard for card components, Button/IconButton prop normalization, Paper/Typography variant fixes.

---

## FASE 5 — Moduli NKA e Wizard

| #    | File                                          | Stato                       |
| ---- | --------------------------------------------- | --------------------------- |
| 5.1  | `src/nka/GameMode.tsx`                        | ✅ 2026-03-08               |
| 5.2  | `src/nka/NKABottomSheet.tsx`                  | ✅ 2026-03-08               |
| 5.3  | `src/nka/NKAForceMap.tsx`                     | ✅ 2026-03-08               |
| 5.4  | `src/nka/NKAHeaderAuraButton.tsx`             | ✅ 2026-03-08               |
| 5.5  | `src/nka/NKAHeaderIntegration.tsx`            | ✅ 2026-03-08               |
| 5.6  | `src/components/AnnualPlanningWizard.tsx`     | ✅ 2026-03-07               |
| 5.7  | `src/components/PassaggioAnnoWizard.tsx`      | ✅ 2026-03-07               |
| 5.8  | `src/components/OnboardingWizard.tsx`         | ✅ (nessun M3\* da migrare) |
| 5.9  | `src/components/TeachingAssignmentMatrix.tsx` | ✅ (nessun M3\* da migrare) |
| 5.10 | `src/components/PianoInclusioneEditor.tsx`    | ✅ 2026-03-07               |

**Completamento Fase 5:** ✅ 2026-03-08 — tutti i file NKA (5.1–5.5) e wizard (5.6–5.10) completati

> **Nota:** I file `src/nka/**` sono esclusi da ESLint (`eslint.config.mjs` pattern `**/nka/**`).
> Vanno migrati ma non producono errori lint. Affrontare in sessione dedicata.

---

## FASE 6 — Pulizia e Rimozione Legacy

> Da eseguire **solo dopo** aver verificato zero consumatori rimasti per ogni custom component.

### Procedura per ogni file da eliminare

```powershell
# 1. Verificare zero import rimasti
Get-ChildItem -Recurse -Path src -Include "*.tsx","*.ts" |
  Select-String -Pattern "M3Button" |
  Select-Object Path, LineNumber, Line

# 2. Se output vuoto → eliminare il file
Remove-Item src/components/ui/M3Button.tsx

# 3. Aggiornare src/components/ui/index.ts rimuovendo il re-export
```

### Checklist file da eliminare (in ordine)

| #    | File                                                                     | Prerequisito                          | Stato |
| ---- | ------------------------------------------------------------------------ | ------------------------------------- | ----- |
| 6.1  | `src/components/ui/M3Typography.tsx`                                     | Fase 2A.1 + tutti consumatori migrati | ☐     |
| 6.2  | `src/components/ui/M3Surface.tsx`                                        | Fase 2A.2 + tutti consumatori migrati | ☐     |
| 6.3  | `src/components/ui/M3Card.tsx`                                           | Fase 2A.3 + tutti consumatori migrati | ☐     |
| 6.4  | `src/components/ui/M3Chip.tsx` + `M3ChipGroup.tsx`                       | Fase 2A.4-5 + tutti consumatori       | ☐     |
| 6.5  | `src/components/ui/M3ProgressBar.tsx`                                    | Fase 2A.6 + tutti consumatori         | ☐     |
| 6.6  | `src/components/ui/M3ButtonGroup.tsx`                                    | Fase 2A.7 + tutti consumatori         | ☐     |
| 6.7  | `src/components/ui/M3Button.tsx`                                         | Fase 2B.1 + tutti consumatori         | ☐     |
| 6.8  | `src/components/ui/M3IconButton.tsx`                                     | Fase 2B.2 + tutti consumatori         | ☐     |
| 6.9  | `src/components/ui/M3Dialog.tsx` + `M3DialogContent` + `M3DialogActions` | Fase 2B.3 + tutti                     | ☐     |
| 6.10 | `src/components/ui/SelectField.tsx`                                      | Fase 2B.4 + tutti consumatori         | ☐     |
| 6.11 | `src/components/ui/TextField.tsx` (custom)                               | Fase 2B.5 + tutti consumatori         | ☐     |
| 6.12 | `src/components/ui/TextArea.tsx`                                         | Fase 2B.6 + tutti consumatori         | ☐     |
| 6.13 | `src/components/ui/TabGroup.tsx`                                         | Fase 2B.7 + tutti consumatori         | ☐     |
| 6.14 | `src/components/ui/M3ChoiceCard.tsx`                                     | Fase 2B.8 + tutti consumatori         | ☐     |
| 6.15 | `src/components/ui/M3ListItem.tsx`                                       | Fase 2B.9 + tutti consumatori         | ☐     |
| 6.16 | `src/components/ui/M3Menu.tsx`                                           | Fase 2B.10 + tutti consumatori        | ☐     |
| 6.17 | `src/components/ui/M3Popover.tsx`                                        | Fase 2B.11 + tutti consumatori        | ☐     |
| 6.18 | `src/components/AppLayout.md3.tsx`                                       | Fase 1.7 completata                   | ☐     |
| 6.19 | Aggiornare `src/components/ui/index.ts`                                  | Tutti i 6.1-6.18 completati           | ☐     |
| 6.20 | Rimuovere parti legacy da `src/components/ui/ui-components.css`          | Tutti i custom eliminati              | ☐     |

**Completamento Fase 6:** ☐

---

## Metriche di Completamento Totale

| Metrica                                           | Attuale      | Target   |
| ------------------------------------------------- | ------------ | -------- |
| File consumatori con import `M3*` o custom legacy | **~108**     | **0**    |
| File totali con pattern legacy (incl. wrapper)    | **154**      | **0**    |
| Componenti custom attivi in `ui/`                 | ~35          | **0**    |
| File con `style={{}}` su testo semantico          | molti        | **0**    |
| Warning ESLint                                    | **0**        | **0** ✅ |
| File NKA migrati (Fase 5)                         | **5 / 5** ✅ | **5**    |
| Score Lighthouse Accessibility                    | da misurare  | ≥ 95     |

---

## Comando di Verifica Progresso

Eseguire per misurare lo stato di avanzamento in qualsiasi momento:

```powershell
# Conta file ancora da migrare
Get-ChildItem -Recurse -Path src -Include "*.tsx" |
  Select-String -Pattern "M3Typography|M3Card|M3Surface|M3Chip|M3ChipGroup|M3ButtonGroup|M3ProgressBar|AppLayout|M3Button|M3Dialog|M3ChoiceCard|SelectField|TabGroup|TextArea" |
  Select-Object -ExpandProperty Path |
  Sort-Object -Unique |
  Measure-Object

# Lista file già su MUI v7
Get-ChildItem -Recurse -Path src -Include "*.tsx","*.ts" |
  Select-String -Pattern "@mui/material" |
  Select-Object -ExpandProperty Path |
  Sort-Object -Unique
```

---

## Note di Architettura

### Perché questa strategia è sicura

- Il tema MUI (`muiTheme.ts`) è già configurato con i token `var(--md-sys-*)` — ogni componente MUI eredita automaticamente colori, tipografia e forma dal sistema MD3 esistente
- La migrazione è **layer per layer**: la logica applicativa (store Zustand, Context API, servizi) non viene toccata
- I token CSS `var(--md-sys-*)` restano il "source of truth" del design system — MUI li legge via `palette`, quindi il tema visivo non cambia

### Invarianti da non rompere

- Il file `src/theme/muiTheme.ts` è l'unico posto dove configurare il tema — non creare temi locali
- `var(--md-sys-*)` CSS variables sono mantenuti come bridge — non rimuoverli dal CSS
- L'ordine di priorità rispetta il percorso del docente: fondamenta → shell → modali core → view secondarie → pulizia
