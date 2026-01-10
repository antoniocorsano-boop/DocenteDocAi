# UI M3 Expressive Roadmap

Documento guida per la migrazione e refactoring dei componenti React a Material Design 3 Expressive.  
Contiene tutti i file .tsx analizzati, raggruppati per **fasi**, **batch**, **priorità** e note operative.

---

## Fase 1 – Viste principali (alta priorità)

### Batch 1: Dashboard e hub principali
- **UdaPlanner.tsx** – alta
- **Studio.tsx** – alta
- **KnowledgeBase.tsx** – alta
- **LessonsPage.tsx** – alta
- **LessonView.tsx** – alta
- **RegisterView.tsx** – alta
- **StudentProfile.tsx** – alta
- **Settings.tsx** – alta

**Note operative:** refactoring completo M3 (griglia, card, timeline, form).  

### Batch 2: Classroom & Orientamento
- **ClassroomView.tsx** – alta
- **StudentClassroomView.tsx** – alta
- **TeacherPresentationView.tsx** – alta
- **OrientamentoDashboard.tsx** – alta

**Note operative:** layout complesso, dashboard-like, token M3 e componenti legacy da sostituire.  

### Batch 3: Analisi e valutazioni
- **EvaluationModule.tsx** – alta
- **ImprovementGuide.tsx** – alta
- **DidatticaInclusiva.tsx** – alta

**Note operative:** viste analitiche e report, elevata adozione M3.  

---

## Fase 2 – Componenti strutturali (media priorità)

### Batch 1: Core & layout
- **App.tsx** ✅ COMPLETED
- **Header.tsx** ✅ COMPLETED
- **NavigationRail.tsx** ✅ COMPLETED
- **Menu.tsx** ✅ COMPLETED
- **ViewManager.tsx** ✅ COMPLETED
- **ModalManager.tsx** ✅ COMPLETED
- **TimelineView.tsx** ✅ COMPLETED
- **Calendar.tsx** ✅ COMPLETED
- **Timetable.tsx**

**Note operative:** refactoring M3 per layout e gestione globale.  

### Batch 2: Fab, guide e strumenti
- **Guidance.tsx** ✅ COMPLETED
- **GlobalFab.tsx** ✅ COMPLETED
- **DraggableFab.tsx** ✅ COMPLETED
- **AssistantFab.tsx** ✅ COMPLETED

### Batch 3: Error handling & context
- **ErrorBoundary.tsx**
- **ModalContext.tsx**
- **Context.tsx**
- **AuraView.tsx**
- **VoiceNoteRecorder.tsx**

### Batch 4: Gestione classi, studenti e tool
- **OperationsCenter.tsx** – alta
- **TeacherInbox.tsx** – alta
- **StudentManager.tsx** – alta
- **CurriculumManager.tsx** – alta
- **CompetencyManager.tsx** – alta
- **TemplateManager.tsx** – alta
- **RubricheManager.tsx** – alta
- **FeedManager.tsx**
- **ClassroomTools.tsx**
- **StudentActionMenu.tsx**
- **ParticipationBadgePicker.tsx**
- **EventActionPopover.tsx**
- **QuickNotePopover.tsx**
- **TeachingAssignmentMatrix.tsx**
- **TimetableCell.tsx**
- **GanttBar.tsx**
- **DemoGantt.tsx**
- **HomeworkSubmission.tsx**
- **FunctionalAnalysis.tsx**
- **ArchivioReport.tsx**
- **PianoInclusioneEditor.tsx**
- **LiveAssistant.tsx**
- **AiAdvisor.tsx**
- **AssistantDevTools.tsx**
- **CorpusChat.tsx**
- **SmartDocumentEditor.tsx**
- **RestoreAssistController.tsx**

---

## Fase 3 – Modali e wizard (media-alta priorità)

**Tutti i modali e wizard da AddEvaluationModal.tsx → WorkflowGuide.tsx**

**Note operative:** livello M3 già alto.  
Verificare conformità token M3 e sostituzione componenti legacy se presente.  

---

## Fase 4 – Componenti UI riutilizzabili (bassa priorità)

- **M3Button.tsx**, **M3Card.tsx**, **M3Dialog.tsx**, **M3Chip.tsx**, **M3ListItem.tsx**, **M3Menu.tsx**, **M3Popover.tsx**, **M3Typography.tsx**, **M3ExpressiveCard.tsx**
- **TextField.tsx**, **TextArea.tsx**, **SelectField.tsx**
- **Avatar.tsx**, **EmptyState.tsx**, **ActionTile.tsx**, **CategoryCard.tsx**, **InfoCard.tsx**, **UseCaseCard.tsx**
- **M3ChoiceCard.tsx**, **M3SurfaceCard.tsx**, **M3HeroCard.tsx**, **M3EmptyStateCard.tsx**, **M3SuggestionCard.tsx**
- **BarChart.tsx**, **DonutChart.tsx**, **M3RatingBar.tsx**, **ThinkingIndicator.tsx**
- **AiMemoryChip.tsx**, **AiThinkingGem.tsx**
- **M3AnimatedIcon.tsx**, **M3BadgedIcon.tsx**, **M3IconButton.tsx**, **M3BottomAppBar.tsx**, **M3DatePicker.tsx**
- **PinPad.tsx**, **ManualSection.tsx**, **QuizSkeleton.tsx**, **TableSkeleton.tsx**, **DocumentSkeleton.tsx**, **ImageSkeleton.tsx**

**Note operative:** revisione minima, confermare conformità M3 Expressive.  

---

## Suggerimenti operativi generali

1. Lavorare **un batch alla volta**.
2. Consultare il **driver document** per props, stato, dipendenze e note.
3. Applicare refactoring M3:  
   - Stili inline → classi CSS con token M3  
   - Componenti legacy → M3 componenti  
   - Colori, spacing, typography → token M3
4. Test & build per ogni batch.
5. Passare al batch successivo.
6. Aggiornare note M3 in caso di modifiche rilevanti.

---
