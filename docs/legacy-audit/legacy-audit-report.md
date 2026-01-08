# Report Audit Componenti Legacy

**Data Generazione:** 8 gennaio 2026

**Timestamp Ultima Esecuzione Script:** 2026-01-08T07:30:41.028Z

**Descrizione:** Questo report analizza lo stato di migrazione dei componenti React verso il Design System MD3, identificando componenti legacy con stili inline o hardcoded.

## Riepilogo

- **Totale Componenti Analizzati:** 237
- **Componenti Migrati:** 9 (3.8%)
- **Componenti Legacy:** 174 (73.4%)
- **Componenti Puliti:** 54 (22.8%)

## Dettagli Componenti

| Nome Componente | Stato Migrazione | Problemi Stilistici | Note/Raccomandazioni |
|-----------------|------------------|---------------------|----------------------|
| ActionTile | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ActionTile.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| AddEvaluationModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AddOrientamentoActivityModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AddProvaModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AddSourceModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| AddStudentModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AdvancedCharts | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AiAdvisor | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AiEventParserModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AiMemoryChip | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AiMemoryChip.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| AiTemplateGeneratorModal | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| AiThinkingGem | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AnalyticsDashboard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| AnalyticsHub | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AnalyticsViews | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| AnnualPlanningWizard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| App | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| ArchivioReport | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| AssistantDevTools | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| AssistantFab | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| AssistantModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| audit | Migrato | Nessuno | Already migrated using base components. |
| AuraView | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| Avatar | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| Avatar.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| BackupInfoModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| BarChart | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| BarChart.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| BatchExportWizard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| Calendar | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| CategoryCard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| CategoryCard.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| ChipInputList | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ChipInputList.test | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| CircolareAnalysisModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ClassAnalytics | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ClassCompetencyDashboard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ClassDashboard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| ClassHub | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| ClassPlanningWizard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ClassroomTools | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ClassroomView | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| ClassSelection | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| CloseLessonModal | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| CompetencyEvaluationModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| CompetencyLevelsView | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| CompetencyManager | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ConsiglioClasse | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ConsiglioClasseWizard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ContextualStrip | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| CopyForRegisterModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| CorpusChat | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| CreateLessonFromAiModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| CurriculumManager | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| DemoGantt | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| DemoGantt.test | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| DidatticaInclusiva | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| DocumentGeneratorModal | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| DocumentSkeleton | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| DocumentViewerModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| DonutChart | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| DonutChart.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| DraggableFab | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| EditableContentCard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| EditableContentCard.test | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| EditSlotModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| EmptyState | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ErrorBoundary | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ErrorBoundary.functional | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ErrorLogsDashboard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| EvaluationModule | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| EvaluationViews | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| EventActionPopover | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| EventModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ExportModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| FeedManager | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| FlowMode | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| FunctionalAnalysis | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| GanttBar | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| GlobalFab | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| Guidance | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| Header | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| Header.test | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| HelpModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| Home | Migrato | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Already migrated using base components. |
| Home.integration.test | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| Home.test | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| HomeworkSubmission | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| IdeaGeneratorModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ImageAnalysisModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ImageGeneratorModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ImageSkeleton | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ImageViewerModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ImportStudentsModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ImpromptuLessonModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ImprovementGuide | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| InfoCard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| InfoCard.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| KnowledgeBase | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| LessonAnalysisModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| LessonsPage | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| LessonView | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| LiveAssistant | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| LiveAssistantModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| LoadingModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| LoginScreen | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| Logo | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3ActivityItem | Migrato | Nessuno | Already migrated using base components. |
| M3AnimatedIcon | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3BadgedIcon | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3BottomAppBar | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| M3BottomAppBar.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| M3Button | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3Button.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3Card | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| M3Card.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3Chip | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| M3Chip.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| M3ChoiceCard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| M3ChoiceCard.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3DatePicker | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3DatePicker.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3Dialog | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| M3Dialog.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| M3EmptyStateCard | Migrato | Nessuno | Already migrated using base components. |
| M3ExpressiveCard | Migrato | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Already migrated using base components. |
| M3ExpressiveCard.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3HeroCard | Migrato | Nessuno | Already migrated using base components. |
| M3IconButton | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3IconButton.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3ListItem | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| M3ListItem.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| M3Menu | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| M3Menu.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| M3Menu.test | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3Popover | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| M3Popover.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| M3Popover.test | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| M3RatingBar | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| M3RatingBar | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| M3RatingBar.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| M3SuggestionCard | Migrato | Nessuno | Already migrated using base components. |
| M3SuggestionItem | Migrato | Nessuno | Already migrated using base components. |
| M3SurfaceCard | Migrato | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Already migrated using base components. |
| ManualSection | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| MaterialPickerModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| Menu | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| ModalContext | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ModalManager | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| NavigationRail | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| NotebookLMImportModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| NotificationsPopover | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ObservationModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| OperationsCenter | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| OrarioSettingsModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| OrientamentoDashboard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| ParticipationBadgePicker | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| PassaggioAnnoWizard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| PianoInclusioneEditor | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| PinPad | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| PinPadModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| PlanningViews | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| ProfileSelectionScreen | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ProgettazioneHub | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| QuickEvaluationModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| QuickNotePopover | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| QuizSkeleton | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| RegisterImportDialog | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| RegisterView | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ReportisticaHub | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ResetConfirmModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| RestoreAssistController | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| RestoreAssistModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| RubricEditor | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| RubricheManager | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| SchedulingViews | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| SectionHeader | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| SelectField | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| SelectField.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| Settings | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| SettingsSection | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| SettingsViews | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| ShareModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| SignInScreen | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| SkipLink | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| SkipLink | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| SlotActionModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| SmartDocumentEditor | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| SmartImportModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| Snackbar | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| Snackbar.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| StudentActionMenu | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| StudentClassroomView | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| StudentEPortfolioModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| StudentInterviewModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| StudentLoginScreen | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| StudentManager | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| StudentProfile | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| StudentTransferModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| Studio | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| SyncConflictModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| TabGroup | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| TableSkeleton | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| TeacherInbox | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| TeacherPresentationView | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| TeachingAssignmentMatrix | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| TemplateManager | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| TestGeneratorModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| TestPreviewModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| TextArea | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| TextArea.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| TextField | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| TextField.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| ThemeBubble | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| ThinkingIndicator | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ThinkingIndicator.stories | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| TimelineView.test | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| Timetable | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| TimetableCell | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| Tooltip | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| UdaExportModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| UdaPlanner | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| UnifiedEvaluationModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| UniversalModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| UniversalModalDemo | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |
| UseCaseCard | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| UseCaseCard.stories | Legacy | Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has hardcoded styles. Consider migrating to base M3 components. |
| VideoAnalysisModal | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ViewLoadingPlaceholder | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ViewManager | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| ViewRouters | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| VirtualClassroomHub | Nessun problema rilevato | Nessuno | No legacy patterns detected. |
| VoiceNoteRecorder | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| WelcomeScreen | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.) | Has inline CSS classes. Consider migrating to base M3 components. |
| WorkflowGuide | Legacy | Stili inline (classi CSS come bg-, text-, border-, ecc.); Stili hardcoded (oggetti style con color, backgroundColor, borderRadius, boxShadow, padding) | Has inline CSS classes. Has hardcoded styles. Consider migrating to base M3 components. |

## Note Finali

- **Legacy:** Componenti che richiedono attenzione per migrazione.
- **Migrato:** Componenti che utilizzano correttamente i base components M3.
- **Puliti:** Componenti senza problemi stilistici rilevati.
- Per ulteriori dettagli, consulta il file JSON `legacy-component-audit.json`.
