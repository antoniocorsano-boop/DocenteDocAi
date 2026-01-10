# UI M3 Expressive Driver

Documentazione tecnica incrementale dei componenti React/TSX per il refactoring M3 Expressive.

## ActionTile.tsx

- Percorso: src/components/ui
- Tipo: componente
- Scopo: Interactive tile component for action buttons with Material Design 3 styling. Supports multiple variants (primary, secondary, tertiary, surface) with proper accessibility, hover states, and responsive design.
- Props / API: title: string, subtitle?: string, icon: string, onClick: () => void, variant?: 'primary' | 'secondary' | 'tertiary' | 'surface', className?: string, tooltip?: string, ariaLabel?: string
- Stato / Hook: non presente
- Dipendenze interne: M3Typography
- Livello di intervento M3: già MD3 compliant
- Note operative: componente UI pura

## AddEvaluationModal.tsx

- Percorso: src/components
- Tipo: modale
- Scopo: Modal for adding evaluations to students.
- Props / API: students: Studente[], discipline: string[], onClose: () => void, onSave: (evaluation: Omit<Valutazione, 'id'>) => void
- Stato / Hook: useState
- Dipendenze interne: M3ChoiceCard, SelectField, TextField, TextArea, M3Button, M3Dialog, M3DialogContent, M3DialogActions, M3Typography
- Livello di intervento M3: già migrato
- Note operative: componente modale

## AddOrientamentoActivityModal.tsx

- Percorso: src/components
- Tipo: modale
- Scopo: Modal for adding orientation activities.
- Props / API: isOpen: boolean, onClose: () => void, onSave: (activity: OrientamentoActivity) => void, userClasses: string[]
- Stato / Hook: useState
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField, TextArea
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AddProvaModal.tsx

- Percorso: src/components
- Tipo: modale
- Scopo: Modal for adding evaluation tests.
- Props / API: disciplines: string[], onClose: () => void, onSave: (prova: Omit<Valutazione, 'id' | 'studenteId' | 'voto'>) => void
- Stato / Hook: useState
- Dipendenze interne: M3ChoiceCard, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AddSourceModal.tsx

- Percorso: src/components
- Tipo: modale
- Scopo: Modal for adding sources to knowledge base.
- Props / API: corpora: Corpus[], setCorpora: React.Dispatch<React.SetStateAction<Corpus[]>>, onClose: () => void, onAddEntries: (entries: KnowledgeBaseEntry[]) => void
- Stato / Hook: useState, useCallback
- Dipendenze interne: CategoryCard, SelectField, TextField, M3Dialog, M3DialogContent, M3Button
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AddStudentModal.tsx

- Percorso: src/components
- Tipo: modale
- Scopo: Modal for adding or editing students.
- Props / API: studentToEdit?: Studente, userClasses: string[], onClose: () => void, onSave: (student: Studente) => void
- Stato / Hook: useState, useEffect
- Dipendenze interne: TextField, SelectField, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AiAdvisor.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Component for AI advisor to generate pedagogical advice.
- Props / API: students: Studente[], evaluations: Valutazione[], competencyEvals: ValutazioneCompetenza[], settings: TimetableSettings, aiSettings: AiSettings
- Stato / Hook: useState
- Dipendenze interne: AiThinkingGem
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AiEventParserModal.tsx

- Percorso: src/components
- Tipo: modale
- Scopo: Modal for parsing event text with AI.
- Props / API: onClose: () => void, onEventParsed: (eventData: Partial<EventoCalendario>) => void, aiSettings: AiSettings
- Stato / Hook: useState
- Dipendenze interne: M3Button, M3Dialog, M3DialogContent, M3DialogActions
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AiMemoryChip.stories.tsx

- Percorso: src/components/ui
- Tipo: componente
- Scopo: Storybook stories for AiMemoryChip component.
- Props / API: non specificato
- Stato / Hook: non presente
- Dipendenze interne: AiMemoryChip
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AiMemoryChip.tsx

- Percorso: src/components/ui
- Tipo: componente
- Scopo: Small chip component indicating AI context usage with animated icon.
- Props / API: label: string
- Stato / Hook: non presente
- Dipendenze interne: nessuna
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AiTemplateGeneratorModal.tsx

- Percorso: src/components
- Tipo: NON DEDUCIBILE
- Scopo: NON DEDUCIBILE
- Props / API: NON DEDUCIBILE
- Stato / Hook: NON DEDUCIBILE
- Dipendenze interne: NON DEDUCIBILE
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: file eliminato

## AiThinkingGem.tsx

- Percorso: src/components/ui
- Tipo: componente
- Scopo: Component for AI thinking indicator with animated gem.
- Props / API: size?: 'small' | 'medium' | 'large', text?: string, inline?: boolean
- Stato / Hook: non presente
- Dipendenze interne: nessuna
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AnalyticsDashboard.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Dashboard for analytics with tabs for overview, details, settings.
- Props / API: onClose: () => void
- Stato / Hook: useState, useMemo
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, SelectField, M3Typography
- Livello di intervento M3: già migrato
- Note operative: NON DEDUCIBILE

## AnalyticsHub.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Hub for analytics with charts and AI insights.
- Props / API: userClasses: string[], students: Studente[], evaluations: Valutazione[], competencyEvaluations: ValutazioneCompetenza[], settings: TimetableSettings, aiSettings: AiSettings
- Stato / Hook: useState, useMemo, useEffect
- Dipendenze interne: LineChart, RadarChart, BarChart, calculateClassTrend, calculateCompetencyRadar, calculateGradeDistribution, getGoogleAIClient, EmptyState, AiMemoryChip, SelectField, M3Button, InfoCard, SectionHeader, AiThinkingGem
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## App.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Main app component with navigation, modals, and suggestion banner.
- Props / API: nessuna
- Stato / Hook: useAppEngine, useRestoreAssist
- Dipendenze interne: AssistantModal, AssistantFab, Header, SkipLink, NavigationRail, ViewManager, SignInScreen, ModalManager, PassaggioAnnoWizard, ThemeService, Snackbar, ErrorBoundary
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AssistantDevTools.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Dev tools for assistant with suggestion simulation and listening toggle.
- Props / API: actions: AssistantDevToolsActions
- Stato / Hook: useState
- Dipendenze interne: M3Button
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AssistantFab.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Floating action button for assistant with modes.
- Props / API: nessuna
- Stato / Hook: useUIStore, useState, useEffect
- Dipendenze interne: useUIStore, Z_INDEX
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AssistantModal.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Modal for assistant with chat, docs, tools, backup modes.
- Props / API: open: boolean, onClose: () => void, mode?: 'chat' | 'docs' | 'tools' | 'backup', aiSettings: AiSettings, context?: unknown
- Stato / Hook: useState, useRef, useEffect
- Dipendenze interne: fetchNotebookFiles, uploadNotebookFile, deleteNotebookFile, chatWithAi, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## ArchivioReport.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Archive for reports with search, download, delete, save to KB.
- Props / API: reportistica: Report[], onDeleteReport: (reportId: string) => void, onSaveReportToKb: (report: Report) => void
- Stato / Hook: useState
- Dipendenze interne: saveAs, M3IconButton
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## AuraView.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Wrapper for app views with Material 3 layout.
- Props / API: children: React.ReactNode, fullWidth?: boolean
- Stato / Hook: nessuna
- Dipendenze interne: nessuna
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## BackupInfoModal.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Modal with information about backup and privacy.
- Props / API: onClose: () => void
- Stato / Hook: nessuna
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## BatchExportWizard.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Wizard for batch export of documents.
- Props / API: molte (vedi interface BatchDocument)
- Stato / Hook: useState, useMemo
- Dipendenze interne: generateStudentProfilePdf, generateLessonPdf, generateHtmlDocxBlob, saveAs, useSystemStore, useUIStore, TemplateManager, JSZip, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: NON DEDUCIBILE

## Home.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Dashboard principale con metriche, attività recenti, suggerimenti AI.
- Props / API: onNavigate: (view: View, params?: NavigationParams) => void, dismissSuggestion: (id: string) => void
- Stato / Hook: useMemo
- Dipendenze interne: M3ExpressiveCard, M3Button, M3HeroCard, M3SuggestionCard, M3SuggestionItem, M3ActivityItem, M3EmptyStateCard, M3Typography, M3Card, useAcademicStore, useSystemStore, useStudentStore
- Livello di intervento M3: alta
- Note operative: Status: ✅ FULLY MIGRATED & ACCESSIBLE

## ClassDashboard.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Dashboard per la gestione didattica di una classe, con studenti, lezioni, strumenti.
- Props / API: selectedClass: string, onNavigate: (view: View, context?: string) => void, onStartImpromptuSession: (classe: string) => void, onStartPlannedLesson: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void, onViewStudentProfile: (student: Studente) => void
- Stato / Hook: useMemo
- Dipendenze interne: SectionHeader, InfoCard, M3Button, M3Card, Avatar, useStudentStore, useAcademicStore, calculatePerformance
- Livello di intervento M3: media
- Note operative: usa classi CSS custom, potrebbe beneficiare di migrazione a tokens M3

## ProgettazioneHub.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Hub per la progettazione didattica, con UDA, timeline, competenze, import.
- Props / API: molte (estese da ProgettazioneHubProps, udas: Uda[], settings: TimetableSettings, aiSettings: AiSettings, onSaveUda, onAddLessons, onSaveReport, onSaveEvent, initialAction?, knowledgeBase, onUpdateCompetencies?, onUpdateKnowledgeBase?, driveSyncState?, onConnectDrive?)
- Stato / Hook: useState, useEffect
- Dipendenze interne: NotebookLMImportModal, TemplateManager, AnnualPlanningWizard, SmartImportModal, CompetencyManager, TabGroup, M3ExpressiveCard, TimelineView, UdaDetailModal
- Livello di intervento M3: media
- Note operative: usa M3ExpressiveCard, livello medio

## UdaPlanner.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Planner per Unità Didattiche di Apprendimento (UDA), con editor e gestione.
- Props / API: UdaPlannerProps (vedi types)
- Stato / Hook: useState
- Dipendenze interne: UdaExportModal, Guidance, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, TextArea, EmptyState
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## Studio.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Studio AI per generazione e analisi di contenuti didattici.
- Props / API: corpora, knowledgeBase, setKnowledgeBase, aiSettings, onOpenCreateLesson, showToast, showGuidanceTips, onAiProcessing
- Stato / Hook: useState, useEffect
- Dipendenze interne: generateStudioOutput, generateFormattedDocument, generateImageFromPrompt, generateQuiz, DocumentGeneratorModal, ImageGeneratorModal, TestGeneratorModal, TestPreviewModal, Guidance, M3Dialog, M3DialogContent, M3DialogActions, M3Button, SelectField, AiThinkingGem
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## KnowledgeBase.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Gestione della knowledge base con categorie, corpora, preview documenti.
- Props / API: knowledgeBase, setKnowledgeBase, corpora, setCorpora, aiSettings?, showToast, settings?, showGuidanceTips?
- Stato / Hook: useState, useMemo
- Dipendenze interne: AddSourceModal, DocumentViewerModal, ImageViewerModal, InfoCard, CategoryCard, SectionHeader, M3Button
- Livello di intervento M3: bassa
- Note operative: usa M3Button, ma altre componenti potrebbero non essere M3

## LessonsPage.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Pagina per la gestione delle lezioni, con filtri, generazione AI, scheduling.
- Props / API: lessons, udas, knowledgeBase, userClasses, onViewLesson, onAddLessons, onStartClassroom, aiSettings, setIsLoadingModalOpen, setLoadingModalMessage, slots, onScheduleLesson, curricula?, settings?
- Stato / Hook: useState, useMemo, useEffect
- Dipendenze interne: generateLessonSequenceForClass, IdeaGeneratorModal, CreateLessonFromAiModal
- Livello di intervento M3: bassa
- Note operative: probabilmente usa classi custom, livello basso

## LessonView.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Vista dettagliata di una lezione, con analisi AI, esportazione, materiali.
- Props / API: lesson: Lezione, onClose: () => void, onStartClassroom, onUpdateLesson, knowledgeBase, aiSettings?, settings?
- Stato / Hook: useState
- Dipendenze interne: generateLessonPdf, generateHtmlDocxBlob, viewPdfInNewTab, generateHomeworkPdf, saveAs, analyzeLessonPedagogy, addContextToLesson, MaterialPickerModal, LessonAnalysisModal, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, SectionHeader, AiThinkingGem
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## RegisterView.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Vista del registro di classe con presenze e dettagli lezioni.
- Props / API: entries: RegisterEntry[], lessons, students, isModalMode?, initialClass?
- Stato / Hook: useState, useMemo
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard
- Livello di intervento M3: media
- Note operative: usa M3 tokens e componenti, livello medio

## StudentProfile.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Profilo dettagliato dello studente con valutazioni, competenze, note.
- Props / API: student: Studente, evaluations, competencyEvaluations, settings, aiSettings, onBack, onDeleteEvaluation, onOpenInclusionPlanEditor?, register?, lessons?
- Stato / Hook: useState, useMemo
- Dipendenze interne: calculatePerformance, generateStudentProfilePdf, viewPdfInNewTab, generateCertificazioneCompetenzePdf, DEFAULT_COMPETENZE, StudentInterviewModal, M3Button, TabGroup, EmptyState, InfoCard, Avatar, M3ListItem, getPeriodicJudgmentSuggestion
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## Settings.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Pagina impostazioni con temi, AI, scuola, etc.
- Props / API: SettingsProps (vedi types)
- Stato / Hook: useRef, useState, useEffect
- Dipendenze interne: THEME_CUSTOMIZATIONS, AI_PROFILES, SCHOOL_LEVELS, generateNextSchoolYear, TextField, SelectField, TabGroup, SectionHeader, M3Button, InfoCard, ThemeBubble, ChipInputList, ResetConfirmModal, useSettingsLogic, errorLogger, EmotionalPresetsManager
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## ClassroomView.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Vista aula digitale per gestione lezione in tempo reale.
- Props / API: draftKey, draftEntry, students, lessons, knowledgeBase, evaluations, competencyEvaluations, onUpdateDraftEntry, onFinalizeRegister, onCloseView, onSaveOralEvaluation, onOpenLiveAssistant, settings
- Stato / Hook: useState, useMemo, useRef, useEffect
- Dipendenze interne: PARTICIPATION_BADGES, ClassroomTools, ShareModal, DocumentViewerModal, VoiceNoteRecorder, ObservationModal, CopyForRegisterModal, QuickEvaluationModal, calculatePerformance, generateHomeworkPdf, viewPdfInNewTab, StudentProfile, TabGroup, M3Dialog, M3DialogContent, M3DialogActions, M3Button, Avatar
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## StudentClassroomView.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Vista aula per studenti, con feed lezioni, compiti, materiali.
- Props / API: student: Studente, lessons: Lezione[], register: RegisterEntry[], kb: KnowledgeBaseEntry[], submissions: HomeworkSubmission[], onUploadSubmission, onLogout, onExitMode?, securityPin?, settings?
- Stato / Hook: useState, useMemo
- Dipendenze interne: blobToBase64Parts, generateHomeworkPdf, viewPdfInNewTab, useFileDrop, TabGroup, M3Button, SectionHeader, M3ExpressiveCard, Avatar, PinPadModal
- Livello di intervento M3: media
- Note operative: usa M3ExpressiveCard, livello medio

## TeacherPresentationView.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Vista presentazione per docenti, con slide su privacy, AI, etc.
- Props / API: onNavigate: (view: View) => void
- Stato / Hook: nessuna
- Dipendenze interne: Logo, InfoCard, SectionHeader, ActionTile, M3Button
- Livello di intervento M3: media
- Note operative: usa M3 tokens e componenti, livello medio

## OrientamentoDashboard.tsx

- Percorso: src/components
- Tipo: vista
- Scopo: Dashboard per orientamento studenti, con attività e e-portfolio.
- Props / API: students: Studente[], activities: OrientamentoActivity[], ePortfolioEntries: EPortfolioEntry[], studentStates: Record<string, StudentOrientamentoState>, userClasses: string[], onSaveActivity, onSaveEPortfolio, onUpdateStudentState, showToast
- Stato / Hook: useState, useMemo
- Dipendenze interne: M3Button, SectionHeader, Avatar, EmptyState, InfoCard, SelectField, AddOrientamentoActivityModal, StudentEPortfolioModal
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## Header.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Header dell'app con logo, notifiche, azioni, popover.
- Props / API: HeaderProps, ActionsPopoverProps
- Stato / Hook: useState, useRef, useEffect
- Dipendenze interne: NKAHeaderAuraButton, Logo, useOnlineStatus, NotificationsPopover, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, Avatar, AiThinkingGem, Z_INDEX
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## NavigationRail.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Navigation rail verticale per navigazione M3 Expressive.
- Props / API: items: NavigationRailItem[], activeView: View, onNavigate: (view: View, context?: unknown) => void, className?
- Stato / Hook: nessuna
- Dipendenze interne: View, navigation-rail.css
- Livello di intervento M3: alta
- Note operative: già conforme a M3 Expressive

## Menu.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Menu di navigazione bottom per mobile.
- Props / API: currentView: View, onNavigate: (view: View, context?: unknown) => void
- Stato / Hook: nessuna
- Dipendenze interne: View, Menu.css
- Livello di intervento M3: bassa
- Note operative: usa classi custom, livello basso

## ViewManager.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Gestore delle viste, cuore del presentation layer con AuraView.
- Props / API: view: View, viewContext: unknown, appState: AppState, actions: AppActions, modals: Partial<Modals>
- Stato / Hook: useMemo, Suspense
- Dipendenze interne: VIEW_CONFIGS, Home, ClassDashboard, ClassSelection, ClassroomView, StudentClassroomView, RegisterImportDialog, AuraView, ErrorBoundary, ViewLoadingPlaceholder
- Livello di intervento M3: media
- Note operative: usa AuraView per layout M3, livello medio

## ModalManager.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Gestore dei modali dell'app.
- Props / API: appState: AppState, actions: AppActions, modals: Partial<Modals>
- Stato / Hook: nessuna
- Dipendenze interne: SlotActionModal, SyncConflictModal, CreateLessonFromAiModal, EditSlotModal
- Livello di intervento M3: bassa
- Note operative: probabilmente usa componenti custom, livello basso

## TimelineView.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Vista timeline per UDA ed eventi con Gantt chart.
- Props / API: udas: Uda[], events: EventoCalendario[], onUdaClick: (uda: Uda) => void, startDate: string, endDate: string, previewMessage: string | null, onSaveUda: (uda: Uda) => void
- Stato / Hook: useState, useEffect, useMemo, useRef
- Dipendenze interne: generateHueFromString, GanttBar, Tooltip, Z_INDEX
- Livello di intervento M3: bassa
- Note operative: usa componenti custom, livello basso

## Calendar.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Calendario con viste mese, settimana, giorno, agenda per eventi.
- Props / API: eventi: EventoCalendario[], setEventi, aiSettings: AiSettings
- Stato / Hook: useState, useMemo, useEffect, useRef
- Dipendenze interne: EventModal, AiEventParserModal, EventActionPopover, M3Button, TabGroup
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## Timetable.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Orario scolastico con celle modificabili e suggerimenti AI.
- Props / API: slots: Record<string, Slot>, lessons: Record<string, Lezione>, settings: TimetableSettings, onEditSlot, onShowSlotActions, onAiSuggest?, activeSlotKey?, showGuidanceTips: boolean
- Stato / Hook: useState, useMemo
- Dipendenze interne: TimetableCell, DAYS_OF_WEEK, Guidance, TabGroup, M3IconButton, M3Button
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## OperationsCenter.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Centro operazioni con azioni rapide per processi didattici.
- Props / API: onClose, onNavigate, onAction, activeSuggestion?, students?, settings?, evaluations?, competencyEvaluations?, register?, onPromoteStudents?, onBackupData?, onResetData?
- Stato / Hook: useState, useMemo
- Dipendenze interne: ActionTile, SectionHeader, M3Dialog, M3DialogContent, M3Button
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## TeacherInbox.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Inbox docente per gestire compiti e valutazioni.
- Props / API: submissions: HomeworkSubmission[], students: Studente[], lessons: Record<string, Lezione>, onGradeSubmission, onClose
- Stato / Hook: useState
- Dipendenze interne: Avatar, HomeworkSubmissionCard
- Livello di intervento M3: bassa
- Note operative: usa componenti custom, livello basso

## StudentManager.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Gestione studenti con aggiunta, modifica, trasferimento, import.
- Props / API: students: Studente[], onSaveStudent, onDeleteStudent, onImportStudents, userClasses: string[], initialClass?, knowledgeBase: KnowledgeBaseEntry[]
- Stato / Hook: useState, useMemo, useRef, useEffect
- Dipendenze interne: AddStudentModal, ImportStudentsModal, StudentTransferModal, EmptyState, M3Button, SectionHeader, Avatar, TextField, SelectField
- Livello di intervento M3: media
- Note operative: usa M3 componenti e tokens, livello medio

## CurriculumManager.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Gestione curricula scolastici con import AI e editor.
- Props / API: curricula: CurriculumSubject[], onUpdateCurricula, settings: TimetableSettings, aiSettings: AiSettings, onNavigate: (view: View) => void
- Stato / Hook: useState
- Dipendenze interne: parseCurriculumFromText, extractTextFromFile, useFileDrop, M3Button, M3Dialog, M3DialogContent, M3DialogActions, InfoCard, EmptyState, TextField, TextArea, SelectField, TabGroup, AiThinkingGem
- Livello di intervento M3: media
- Note operative: usa molti M3 componenti, livello medio

## CompetencyManager.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Gestione competenze didattiche con attivazione/disattivazione.
- Props / API: competenze: Competenza[], onUpdateCompetencies: (newCompetencies: Competenza[]) => void
- Stato / Hook: useState
- Dipendenze interne: DEFAULT_COMPETENZE
- Livello di intervento M3: bassa
- Note operative: usa classi custom, livello basso

## TemplateManager.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Gestione template documenti con creazione, modifica, ricerca e applicazione.
- Props / API: onClose: () => void, onApplyTemplate?: (template: DocumentTemplate) => void
- Stato / Hook: useState, useMemo, useEffect
- Dipendenze interne: useSystemStore, useUIStore, useSettingsStore, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, SectionHeader, TextField, SelectField, TextArea, generateTemplateWithAi
- Livello di intervento M3: media
- Note operative: usa molti M3 componenti, livello medio

## RubricheManager.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Gestione rubriche di valutazione con creazione, modifica e cancellazione.
- Props / API: competenze: Competenza[], rubriche: Rubrica[], onSaveRubrica: (rubrica: Rubrica) => void, onDeleteRubrica: (id: string) => void, onNavigate: (view: View) => void
- Stato / Hook: useState
- Dipendenze interne: RubricEditor, M3Button, InfoCard, EmptyState, SectionHeader, ActionTile
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## EvaluationModule.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Modulo valutazione studenti con prove, valutazioni e esportazione.
- Props / API: students, evaluations, setEvaluations, competencyEvaluations, setCompetencyEvaluations, userClasses, settings, aiSettings, initialClass, initialStudentId, onClearInitialStudent, onOpenInclusionPlanEditor
- Stato / Hook: useState, useMemo
- Dipendenze interne: AddProvaModal, StudentProfile, ExportModal, calculatePerformance, UnifiedEvaluationModal, EmptyState, Avatar
- Livello di intervento M3: bassa
- Note operative: usa componenti custom, livello basso

## ImprovementGuide.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Guida miglioramento classe con analisi AI, grafici e consigli.
- Props / API: selectedClass, students, evaluations, competencyEvaluations, lessons, register, settings, aiSettings
- Stato / Hook: useState, useEffect, useMemo
- Dipendenze interne: getGoogleAIClient, RATING_TO_VALUE, RATING_OPTIONS, EditableContentCard, BarChart, DonutChart, AiAdvisor, generateHtmlDocxBlob, saveAs, AiMemoryChip, M3Button, InfoCard, SectionHeader, AiThinkingGem
- Livello di intervento M3: media
- Note operative: usa alcuni M3 componenti, livello medio

## DidatticaInclusiva.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Gestione didattica inclusiva con piani individualizzati per studenti.
- Props / API: students, pianiInclusione, onSavePiano, studentToEdit, onClearStudentToEdit, evaluations
- Stato / Hook: useState, useMemo, useEffect
- Dipendenze interne: PianoInclusioneEditor, calculatePerformance, InfoCard, EmptyState, TabGroup, SectionHeader, M3Button, Avatar
- Livello di intervento M3: media
- Note operative: usa M3 componenti, livello medio

## SmartDocumentEditor.tsx

- Percorso: src/components
- Tipo: componente
- Scopo: Editor documenti intelligente con AI per raffinamento testo e generazione tabelle.
- Props / API: initialContent, documentTitle, onClose, aiSettings, onSaveToKb
- Stato / Hook: useState, useRef, useEffect, useCallback
- Dipendenze interne: refineTextWithAi, generateDocumentTable, generateHtmlDocxBlob, sanitizeHTML, saveAs, AiThinkingGem
- Livello di intervento M3: bassa
- Note operative: usa componenti custom, livello basso

## AddEvaluationModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Aggiungere valutazioni studenti con selezione tipo, disciplina, voto.
- Props / API: students: Studente[], discipline: string[], onClose: () => void, onSave: (evaluation: Omit<Valutazione, 'id'>) => void
- Stato / Hook: useState
- Dipendenze interne: RATING_OPTIONS, EVALUATION_TYPES, M3ChoiceCard, SelectField, TextField, TextArea, M3Button, M3Dialog, M3DialogContent, M3DialogActions, M3Typography
- Livello di intervento M3: alta
- Note operative: già migrato completamente a M3

## AddOrientamentoActivityModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Aggiungere attività di orientamento con titolo, tipo, durata, data, descrizione.
- Props / API: isOpen: boolean, onClose: () => void, onSave: (activity: OrientamentoActivity) => void, userClasses: string[]
- Stato / Hook: useState
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField, TextArea
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## AddProvaModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Aggiungere prova di valutazione con selezione materia, tipo, data, argomento.
- Props / API: disciplines: string[], onClose: () => void, onSave: (prova: Omit<Valutazione, 'id' | 'studenteId' | 'voto'>) => void
- Stato / Hook: useState
- Dipendenze interne: EVALUATION_TYPES, M3ChoiceCard, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## AddSourceModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Aggiungere fonti alla knowledge base con selezione categoria, corpus, upload file.
- Props / API: corpora: Corpus[], setCorpora, onClose: () => void, onAddEntries: (entries: KnowledgeBaseEntry[]) => void
- Stato / Hook: useState, useCallback
- Dipendenze interne: useFileDrop, extractTextFromFile, blobToBase64Parts, KB_CATEGORIES, CategoryCard, SelectField, TextField, M3Dialog, M3DialogContent, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## AddStudentModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Aggiungere o modificare studente con campi cognome, nome, classe.
- Props / API: studentToEdit?: Studente, userClasses: string[], onClose: () => void, onSave: (student: Studente) => void
- Stato / Hook: useState, useEffect
- Dipendenze interne: TextField, SelectField, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## AiEventParserModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Creare evento calendario da testo con AI, estraendo date e dettagli.
- Props / API: onClose: () => void, onEventParsed: (eventData: Partial<EventoCalendario>) => void, aiSettings: AiSettings
- Stato / Hook: useState
- Dipendenze interne: extractEventFromText, M3Button, M3Dialog, M3DialogContent, M3DialogActions
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## AiTemplateGeneratorModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Generare template con AI (funzionalità eliminata).
- Props / API: N/A
- Stato / Hook: N/A
- Dipendenze interne: N/A
- Livello di intervento M3: N/A
- Note operative: file eliminato, funzionalità integrate in Studio AI

## AnnualPlanningWizard.tsx

- Percorso: src/components
- Tipo: componente (wizard)
- Scopo: Wizard pianificazione annuale con AI per generazione documenti, situazione partenza, metodologia.
- Props / API: onClose, userClasses, settings, aiSettings, udas, onSaveUda, onAddLessons, onSaveReport, onSaveEvent, knowledgeBase, students, pianiInclusione
- Stato / Hook: useState, useMemo
- Dipendenze interne: generateClassPlanningDocument, generateSituazionePartenza, suggestAnnualPlan, generateMethodologyStrategies, generateHtmlDocxBlob, saveAs, useUIStore, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, AiThinkingGem
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## AssistantModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Modal assistente con chat AI, gestione documenti NotebookLM, strumenti.
- Props / API: open: boolean, onClose: () => void, mode?: 'chat' | 'docs' | 'tools' | 'backup', aiSettings: AiSettings, context?: unknown
- Stato / Hook: useState, useRef, useEffect
- Dipendenze interne: fetchNotebookFiles, uploadNotebookFile, deleteNotebookFile, chatWithAi, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## BackupInfoModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Informazioni sul backup, architettura local-first, privacy, sincronizzazione Google Drive.
- Props / API: onClose: () => void
- Stato / Hook: N/A
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## BatchExportWizard.tsx

- Percorso: src/components
- Tipo: componente (wizard)
- Scopo: Wizard esportazione batch di documenti (profili studenti, lezioni, UDA, syllabus, consigli classe).
- Props / API: (studenti, lezioni, udas, settings, aiSettings, etc.)
- Stato / Hook: useState, useMemo
- Dipendenze interne: generateStudentProfilePdf, generateLessonPdf, generateHtmlDocxBlob, saveAs, useSystemStore, useUIStore, TemplateManager, JSZip, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## CircolareAnalysisModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Analisi circolare con AI, estrazione eventi e salvataggio in knowledge base.
- Props / API: url: string, title: string, onClose: () => void, aiSettings: AiSettings, onImportEvents: (events: Partial<EventoCalendario>[]) => void, onSaveToKb: (note: { title: string, content: string }) => void
- Stato / Hook: useState, useMemo
- Dipendenze interne: analyzeCircularDocument, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextArea
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ClassPlanningWizard.tsx

- Percorso: src/components
- Tipo: componente (wizard)
- Scopo: Wizard pianificazione classe con AI per generazione documenti, situazione partenza, metodologia.
- Props / API: onClose, userClasses, settings, aiSettings, onSaveUda, onAddLessons, onSaveReport, onSaveEvent, knowledgeBase, students, pianiInclusione
- Stato / Hook: useState, useMemo
- Dipendenze interne: generateClassPlanningDocument, generateSituazionePartenza, suggestAnnualPlan, generateMethodologyStrategies, generateHtmlDocxBlob, saveAs, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, SectionHeader, AiThinkingGem, useUIStore
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## CloseLessonModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Chiusura lezione (funzionalità eliminata).
- Props / API: N/A
- Stato / Hook: N/A
- Dipendenze interne: N/A
- Livello di intervento M3: N/A
- Note operative: file eliminato, logica integrata in ClassroomView

## CompetencyEvaluationModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Valutazione competenza studente con selezione livello, materia, generazione nota AI.
- Props / API: student: Studente, competenza: Competenza, settings: TimetableSettings, aiSettings: AiSettings, onClose: () => void, onSave: (evaluation: Omit<ValutazioneCompetenza, 'id'>) => void
- Stato / Hook: useState
- Dipendenze interne: generateCompetencyNote, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ConsiglioClasseWizard.tsx

- Percorso: src/components
- Tipo: componente (wizard)
- Scopo: Wizard consiglio classe con generazione PDF dati valutazioni e competenze.
- Props / API: onClose: () => void, userClasses: string[], students: Studente[], evaluations: Valutazione[], competencyEvaluations: ValutazioneCompetenza[], settings: TimetableSettings, aiSettings: AiSettings, onSaveReport: (report: Report) => void
- Stato / Hook: useState, useMemo
- Dipendenze interne: generateCouncilDataPdf, viewPdfInNewTab, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, SelectField, InfoCard
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## CopyForRegisterModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Copia contenuto lezione per registro elettronico con opzioni testo/JSON.
- Props / API: lesson: Lezione, entry: RegisterEntry, students: Studente[], todaysEvaluations: Valutazione[], onClose: () => void
- Stato / Hook: useState, useMemo
- Dipendenze interne: TabGroup, TextArea, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## CreateLessonFromAiModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Creazione lezione da contenuto AI con adattamenti inclusività e pianificazione.
- Props / API: content: { title: string; htmlContent: string }, onClose: () => void, onSave: (lessonData: Omit<Lezione, 'id' | 'svolta'>) => void, userClasses: string[], disciplines: string[], students: Studente[], pianiInclusione: Record<string, PianoInclusione>, aiSettings: AiSettings, slots?: Record<string, Slot>, onSchedule?: (lesson: Lezione, slotKey: string) => void, curricula: CurriculumSubject[]
- Stato / Hook: useState, useEffect, useMemo
- Dipendenze interne: generateInclusivityAdaptations, DAYS_OF_WEEK, parseClassString, TextField, SelectField, TextArea, M3Dialog, M3DialogContent, M3DialogActions, M3Button, AiThinkingGem
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## DocumentGeneratorModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Generazione documento formattato da prompt.
- Props / API: onClose: () => void, onGenerate: (prompt: string) => void
- Stato / Hook: useState
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextArea
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## DocumentViewerModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Visualizzazione documento HTML con opzioni copia, salvataggio KB, creazione lezione.
- Props / API: title: string, htmlContent: string, onClose: () => void, onSaveToKb?: (isFormattedDoc: boolean, data: { title: string, content: string, htmlContent: string }) => void, onOpenCreateLesson?: (content: { title: string; htmlContent: string }) => void
- Stato / Hook: useState
- Dipendenze interne: sanitizeHTML, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## EditSlotModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Modifica slot orario con lezione, tipo attività, salvataggio/cancellazione.
- Props / API: slot: Slot, lesson?: Lezione, allLessons?: Record<string, Lezione>, allSlots?: Record<string, Slot>, udas?: Uda[], onClose: () => void, onSave?: (slotKey: string, slotData: Slot) => void, onDelete?: (slotKey: string) => void, onSaveLesson: (lesson: Lezione, slotKey: string) => void, onStartClassroom?: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void, timetableSettings: TimetableSettings, userClasses: string[], aiSettings?: AiSettings, students?: Studente[], knowledgeBase?: KnowledgeBaseEntry[], pianiInclusione?: Record<string, PianoInclusione>
- Stato / Hook: useState, useMemo
- Dipendenze interne: M3ChoiceCard, InfoCard, SectionHeader, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField, TextArea
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## EventModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Creazione/modifica evento calendario con tipo, date, descrizione.
- Props / API: eventToEdit?: Partial<EventoCalendario>, onClose: () => void, onSave: (event: EventoCalendario) => void, onDelete: (eventId: string) => void
- Stato / Hook: useState
- Dipendenze interne: TextField, TextArea, M3ChoiceCard, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ExportModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Esportazione dati valutazioni in PDF con opzioni formato, anno scolastico, scope.
- Props / API: onClose: () => void, students: Studente[], evaluations: Valutazione[], competencyEvaluations: ValutazioneCompetenza[], settings: TimetableSettings, selectedClass: string, prove: Prova[]
- Stato / Hook: useState, useMemo
- Dipendenze interne: calculatePerformance, RATING_TO_VALUE, viewPdfInNewTab, PDF_COLORS, getTrendColor, getCompetencyLevelColors, TabGroup, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SectionHeader
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## HelpModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Modal aiuto con sezioni manuale, guida, setup, assistente, FAQ, specifiche, normativa.
- Props / API: (view: View, onNavigate: (view: View) => void, etc.)
- Stato / Hook: useState
- Dipendenze interne: generateTechnicalDocumentContent, generateAcademicEssayContent, generateFullAppGuidePdf, saveAs, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, InfoCard
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## IdeaGeneratorModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Generazione lezione da idea con registrazione vocale, selezione classe, uso knowledge base.
- Props / API: onClose: () => void, onGenerate: (content: { title: string; htmlContent: string }) => void, aiSettings: AiSettings, userClasses: string[], knowledgeBase: KnowledgeBaseEntry[]
- Stato / Hook: useState, useEffect
- Dipendenze interne: VoiceNoteRecorder, generateLessonFromIdea, SelectField, TextArea, M3Dialog, M3DialogContent, M3DialogActions, M3Button, AiThinkingGem
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ImageAnalysisModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Analisi immagine con AI, upload file, prompt personalizzato.
- Props / API: onClose: () => void, aiSettings: AiSettings
- Stato / Hook: useState, useCallback
- Dipendenze interne: useFileDrop, analyzeImage, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ImageGeneratorModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Generazione immagine con AI da prompt.
- Props / API: onClose: () => void, onGenerate: (prompt: string) => void
- Stato / Hook: useState
- Dipendenze interne: TextArea, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ImageViewerModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Visualizzazione immagine generata con opzioni download e salvataggio in KB.
- Props / API: prompt: string, imageData: string, mimeType: string, onClose: () => void, onSaveToKb: (prompt: string, imageData: { data: string, mimeType: string }) => void
- Stato / Hook: N/A
- Dipendenze interne: saveAs, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ImportStudentsModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Importazione studenti da file CSV o knowledge base con mapping colonne.
- Props / API: onClose: () => void, onImport: (newStudents: Studente[]) => void, userClasses: string[], knowledgeBase: KnowledgeBaseEntry[]
- Stato / Hook: useState, useCallback, useMemo
- Dipendenze interne: useFileDrop, ImportService, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, SelectField, InfoCard
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ImpromptuLessonModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Creazione lezione rapida con selezione materia e contenuto.
- Props / API: classe: string, disciplines: string[], onClose: () => void, onStart: (classe: string, materia: string, contenuto: string) => void
- Stato / Hook: useState, useEffect
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, SelectField, TextArea, SectionHeader
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## LessonAnalysisModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Visualizzazione analisi pedagogica AI lezione con strategie coinvolgimento e inclusività.
- Props / API: result: LessonAnalysisResult, onClose: () => void, title: string, contextLabel?: string
- Stato / Hook: N/A
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, AiMemoryChip
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## LiveAssistantModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Modal assistente vocale live con comandi vocali per azioni lezione.
- Props / API: onClose, lessonContext, onNavigate, onCreateEvent, onScheduleLesson, onAddEvaluation, onAddNote, onMarkAttendance, onCreateUda, onLoadDemoData, students, evaluations, slots, lessons, pianiInclusione, knowledgeBase, userContext
- Stato / Hook: N/A
- Dipendenze interne: LiveAssistant, M3Dialog, M3DialogContent
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## LoadingModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Modal caricamento con spinner e messaggio.
- Props / API: message: string
- Stato / Hook: N/A
- Dipendenze interne: M3Dialog, M3DialogContent
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## MaterialPickerModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Selezione materiali didattici da knowledge base, upload file o link.
- Props / API: knowledgeBase: KnowledgeBaseEntry[], currentMaterials: MaterialeDidattico[], onClose: () => void, onSave: (materials: MaterialeDidattico[]) => void
- Stato / Hook: useState, useMemo, useCallback
- Dipendenze interne: useFileDrop, blobToBase64Parts, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, TabGroup
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## NotebookLMImportModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Importazione file da NotebookLM con selezione e catalogazione.
- Props / API: open: boolean, onClose: () => void, onImport: (imported: KnowledgeBaseEntry[]) => void, isAuthenticated?: boolean, onConnect?: () => void
- Stato / Hook: useState, useEffect
- Dipendenze interne: fetchNotebookFiles, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## NotificationsPopover.tsx

- Percorso: src/components
- Tipo: componente (popover)
- Scopo: Popover notifiche con lista notifiche, mark as read, navigazione.
- Props / API: anchorEl: HTMLElement | null, notifiche: Notifica[], onClose: () => void, onMarkAsRead: (notificationId: string) => void, onMarkAllAsRead: () => void, onNavigate: (view: View) => void, onOpenCircularAnalysis: (url: string, title: string) => void
- Stato / Hook: N/A
- Dipendenze interne: M3Button, M3Popover
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ObservationModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Osservazione formativa studente con rating autonomia, collaborazione, responsabilità e nota.
- Props / API: student: Studente, initialData?: ObservationEntry, onClose: () => void, onSave: (data: ObservationEntry) => void
- Stato / Hook: useState
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextArea
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## OrarioSettingsModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Configurazione slot orario con tipo attività, classe, materia, argomento, link.
- Props / API: tipo: 'lezione' | 'disp' | 'ricev', classe: string, materia: string, argomento?: string, linkNotebook?: string, userClasses: string[], disciplines: string[], onChange: (field: string, value: string) => void, onClose: () => void, onSave: () => void
- Stato / Hook: N/A
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField, TabGroup
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## PassaggioAnnoWizard.tsx

- Percorso: src/components
- Tipo: componente (wizard)
- Scopo: Wizard passaggio anno scolastico con promozione, bocciatura, archiviazione studenti.
- Props / API: onClose: () => void, students: Studente[], settings: TimetableSettings, evaluations: Valutazione[], competencyEvaluations: ValutazioneCompetenza[], register: RegisterEntry[], onPromoteStudents: (promotedStudents: Studente[], archiveYear: string) => void, onBackupData: () => Promise<void>, onResetData: () => void
- Stato / Hook: useState, useMemo, useEffect
- Dipendenze interne: getNextClass, calculatePerformance, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## PinPadModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Modal PIN pad per autenticazione con input numerico.
- Props / API: title: string, correctPin: string, onSuccess: () => void, onCancel: () => void
- Stato / Hook: useState, useEffect
- Dipendenze interne: M3Dialog, M3DialogContent, PinPad, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## QuickEvaluationModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Valutazione rapida studente con tab voto e competenza.
- Props / API: student: Studente, lesson: Lezione, settings: TimetableSettings, onClose: () => void, onSaveEvaluation: (evaluation: Omit<Valutazione, 'id'>) => void, onSaveCompetencyEvaluation: (evaluation: Omit<ValutazioneCompetenza, 'id'>) => void
- Stato / Hook: useState
- Dipendenze interne: RATING_OPTIONS, EVALUATION_TYPES, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, M3ChoiceCard, TextField, TextArea, SelectField
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## QuickNotePopover.tsx

- Percorso: src/components
- Tipo: componente (popover)
- Scopo: Popover nota rapida con registrazione vocale e salvataggio.
- Props / API: anchorEl: HTMLElement | null, initialValue: string, onSave: (note: string) => void, onClose: () => void
- Stato / Hook: useState
- Dipendenze interne: M3Popover, TextField, M3Button, VoiceNoteRecorder
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## RegisterImportDialog.tsx

- Percorso: src/components
- Tipo: componente (dialog)
- Scopo: Importazione registro elettronico con mapping colonne e preview.
- Props / API: onClose: () => void, onImport: (result: ImportResult) => void
- Stato / Hook: useState, useCallback
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, SectionHeader, ImportService, RegisterService, useFileDrop, useUIStore, SelectField
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ResetConfirmModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Conferma reset totale dati con input di sicurezza.
- Props / API: onClose: () => void, onConfirm: () => void
- Stato / Hook: useState
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## RestoreAssistModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Assistenza ripristino dati con opzioni demo, file, Drive.
- Props / API: onLoadDemo: () => void, onRestoreFile: () => void, onConnectDrive: () => void, onClose: () => void, error?: string
- Stato / Hook: N/A
- Dipendenze interne: messages, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ShareModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Condivisione testo con opzioni native o copia formattata.
- Props / API: title: string, text: string, onClose: () => void
- Stato / Hook: useState
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## SlotActionModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Azioni su slot lezione (vedi, modifica, inizia) con card interattiva.
- Props / API: slot: Slot, lesson: Lezione, isDraftExisting: boolean, onClose: () => void, onEdit: () => void, onStart: () => void, onView: () => void
- Stato / Hook: N/A
- Dipendenze interne: Slot, Lezione, LESSON_TYPE_ICONS, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## SmartImportModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Importazione intelligente file con AI per refactoring programmazione didattica.
- Props / API: onClose: () => void, aiSettings: AiSettings
- Stato / Hook: useState, useCallback, useFileDrop
- Dipendenze interne: useFileDrop, extractTextFromFile, generateHtmlDocxBlob, refactorProgrammazione, AiSettings, saveAs, sanitizeHTML, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## StudentEPortfolioModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Gestione E-Portfolio studente con aggiunta voci e stato orientamento.
- Props / API: isOpen: boolean, onClose: () => void, student: Studente, state: StudentOrientamentoState, entries: EPortfolioEntry[], onUpdateState: (state: StudentOrientamentoState) => void, onAddEntry: (entry: EPortfolioEntry) => void
- Stato / Hook: useState
- Dipendenze interne: Studente, StudentOrientamentoState, EPortfolioEntry, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## StudentInterviewModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Colloquio studente con valutazioni, competenze e grafici prestazioni.
- Props / API: student: Studente, evaluations: Valutazione[], competencyEvaluations: ValutazioneCompetenza[], settings: TimetableSettings, onClose: () => void
- Stato / Hook: useMemo
- Dipendenze interne: Studente, Valutazione, ValutazioneCompetenza, TimetableSettings, calculatePerformance, BarChart, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## StudentTransferModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Trasferimento studente tra classi o ritiro con gestione storia.
- Props / API: student: Studente, userClasses: string[], onClose: () => void, onSave: (student: Studente) => void, currentSchoolYear: string
- Stato / Hook: useState
- Dipendenze interne: Studente, StudentHistoryRecord, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, TextField, SelectField
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## SyncConflictModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Risoluzione conflitti sincronizzazione dati locali vs remoti.
- Props / API: data: SyncConflictData, onRestore: () => void, onIgnore: () => void
- Stato / Hook: N/A
- Dipendenze interne: SyncConflictData, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## TestGeneratorModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Generazione verifiche con AI basata su argomento, difficoltà, numero domande.
- Props / API: onClose: () => void, onGenerate: (config: {topic: string, difficulty: 'easy' | 'medium' | 'hard', questionCount: number, questionTypes: QuestionType[]}) => void
- Stato / Hook: useState
- Dipendenze interne: QuestionType, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, TextField
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## TestPreviewModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Anteprima e esportazione verifica generata in PDF/DOCX con risposte.
- Props / API: quiz: GeneratedQuiz, onClose: () => void
- Stato / Hook: useState
- Dipendenze interne: jsPDF, GeneratedQuiz, generateHtmlDocxBlob, viewPdfInNewTab, saveAs, M3Dialog, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## UdaDetailModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Dettagli UDA con validazione AI curriculum verticale.
- Props / API: uda: Uda, onClose: () => void, onEdit: () => void, aiSettings: AiSettings, knowledgeBase: KnowledgeBaseEntry[]
- Stato / Hook: useState, useEffect
- Dipendenze interne: Uda, AiSettings, KnowledgeBaseEntry, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, validateUdaVerticalCurriculum
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## UdaExportModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Esportazione UDA in PDF/DOCX con report AI per docente/studente.
- Props / API: uda: Uda, competenze: Competenza[], settings: TimetableSettings, onClose: () => void, onSaveReport: (report: Report) => void, aiSettings: AiSettings
- Stato / Hook: useState
- Dipendenze interne: Uda, Competenza, TimetableSettings, Report, AiSettings, generateUdaPdf, blobToBase64Parts, generateHtmlDocxBlob, viewPdfInNewTab, saveAs, generateMarkdownReport, M3Dialog, M3DialogContent, M3DialogActions, M3Button, SelectField
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## UnifiedEvaluationModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Valutazione unificata prova con voto e competenze.
- Props / API: student: Studente, prova: Prova, settings: TimetableSettings, existingGrade: Valutazione | undefined, existingCompetencyEvals: ValutazioneCompetenza[], onClose: () => void, onSave: (data: {grade: string, competencyEvals: Record<string, string>}) => void
- Stato / Hook: useState, useMemo
- Dipendenze interne: Studente, Prova, Valutazione, ValutazioneCompetenza, TimetableSettings, RATING_OPTIONS, M3Dialog, M3DialogContent, M3DialogActions, M3Button, SelectField, InfoCard
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## UniversalModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Modal universale riutilizzabile per contenuti generici.
- Props / API: open: boolean, title: string, onClose: () => void, children: React.ReactNode
- Stato / Hook: N/A
- Dipendenze interne: M3Dialog, M3DialogContent, M3DialogActions, M3Button, UniversalModalProps
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## UniversalModalDemo.tsx

- Percorso: src/components
- Tipo: componente (demo)
- Scopo: Demo del modal universale con esempio di utilizzo.
- Props / API: N/A
- Stato / Hook: useState
- Dipendenze interne: UniversalModal, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## VideoAnalysisModal.tsx

- Percorso: src/components
- Tipo: componente (modal)
- Scopo: Generazione video con AI usando Google GenAI (Veo).
- Props / API: onClose: () => void
- Stato / Hook: useState, useEffect
- Dipendenze interne: M3Dialog, TextArea, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## WorkflowGuide.tsx

- Percorso: src/components
- Tipo: componente (wizard/guide)
- Scopo: Guida workflow con percorsi veloci per azioni comuni.
- Props / API: onNavigate: (view: View, context?: unknown) => void
- Stato / Hook: N/A
- Dipendenze interne: View, Workflow, workflows
- Livello di intervento M3: alta
- Note operative: usa tokens M3, livello alto

## Header.tsx

- Percorso: src/components
- Tipo: componente strutturale (header)
- Scopo: Header principale con logo, notifiche, azioni utente, popover azioni.
- Props / API: HeaderProps, ActionsPopoverProps
- Stato / Hook: useState, useRef, useEffect, useOnlineStatus
- Dipendenze interne: NKAHeaderAuraButton, Logo, NotificationsPopover, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, Avatar, AiThinkingGem, Z_INDEX
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## NavigationRail.tsx

- Percorso: src/components
- Tipo: componente strutturale (navigation rail)
- Scopo: Barra navigazione verticale M3 Expressive con icone e label.
- Props / API: NavigationRailProps, NavigationRailItem
- Stato / Hook: N/A
- Dipendenze interne: View, navigation-rail.css
- Livello di intervento M3: alta
- Note operative: già migrato a M3 Expressive, livello alto

## Menu.tsx

- Percorso: src/components
- Tipo: componente strutturale (menu/navigation)
- Scopo: Menu navigazione principale con icone e label per viste.
- Props / API: MenuProps, MenuItemDef
- Stato / Hook: N/A
- Dipendenze interne: View, Menu.css
- Livello di intervento M3: alta
- Note operative: usa m3-navigation-drawer, livello alto

## ViewManager.tsx

- Percorso: src/components
- Tipo: componente strutturale (view manager)
- Scopo: Gestore viste principale con transizioni AuraView e layout M3.
- Props / API: ViewManagerProps
- Stato / Hook: useMemo, Suspense
- Dipendenze interne: VIEW_CONFIGS, Home, ClassDashboard, RegisterImportDialog, AuraView, ErrorBoundary, ViewLoadingPlaceholder, AppState, AppActions, View, etc.
- Livello di intervento M3: alta
- Note operative: implementa layout Material 3 Hardened, livello alto

## ModalManager.tsx

- Percorso: src/components
- Tipo: componente strutturale (modal manager)
- Scopo: Gestore modali centralizzato per apertura/chiusura modali.
- Props / API: ModalManagerProps
- Stato / Hook: N/A
- Dipendenze interne: SlotActionModal, SyncConflictModal, CreateLessonFromAiModal, EditSlotModal, AppState, AppActions, Modals, Lezione, Slot
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: gestore modali, livello non deducibile

## TimelineView.tsx

- Percorso: src/components
- Tipo: componente strutturale (timeline/view)
- Scopo: Vista timeline con UDA ed eventi, drag & drop, Gantt chart.
- Props / API: TimelineViewProps
- Stato / Hook: useState, useEffect, useMemo, useRef
- Dipendenze interne: Uda, EventoCalendario, generateHueFromString, GanttBar, Tooltip, Z_INDEX
- Livello di intervento M3: alta
- Note operative: usa Tooltip M3, livello alto

## Calendar.tsx

- Percorso: src/components
- Tipo: componente strutturale (calendar)
- Scopo: Calendario interattivo con eventi, viste mese/settimana/giorno/agenda.
- Props / API: CalendarProps
- Stato / Hook: useState, useMemo, useEffect, useRef
- Dipendenze interne: EventoCalendario, AiSettings, EventModal, AiEventParserModal, EventActionPopover, M3Button, TabGroup
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## Timetable.tsx

- Percorso: src/components
- Tipo: componente strutturale (timetable)
- Scopo: Orario scolastico interattivo con celle lezione, viste settimana/giorno.
- Props / API: TimetableProps
- Stato / Hook: useState, useMemo
- Dipendenze interne: Lezione, Slot, TimetableSettings, TimetableCell, DAYS_OF_WEEK, Guidance, TabGroup, M3IconButton, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ClassDashboard.tsx

- Percorso: src/components
- Tipo: vista principale (class dashboard)
- Scopo: Dashboard classe con studenti, valutazioni, lezioni pianificate.
- Props / API: ClassDashboardProps, StudentDashboardItemProps
- Stato / Hook: useMemo
- Dipendenze interne: View, Studente, Lezione, DAYS_OF_WEEK, calculatePerformance, SectionHeader, InfoCard, M3Button, M3Card, Avatar, useStudentStore, useAcademicStore
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ProgettazioneHub.tsx

- Percorso: src/components
- Tipo: vista principale (progettazione hub)
- Scopo: Hub progettazione didattica con UDA, timeline, competenze, import.
- Props / API: ProgettazioneHubExtendedProps
- Stato / Hook: useState, useEffect
- Dipendenze interne: NotebookLMImportModal, TemplateManager, KnowledgeBaseEntry, ProgettazioneHubProps, Uda, EventoCalendario, TimetableSettings, AiSettings, Report, Lezione, Competenza, AnnualPlanningWizard, SmartImportModal, CompetencyManager, TabGroup, M3ExpressiveCard, TimelineView, UdaDetailModal
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## SectionHeader.tsx

- Percorso: src/components/ui
- Tipo: componente strutturale (section header)
- Scopo: Header sezione con titolo, sottotitolo, icona, stile M3.
- Props / API: SectionHeaderProps
- Stato / Hook: N/A
- Dipendenze interne: N/A
- Livello di intervento M3: alta
- Note operative: usa tokens M3, livello alto

## TabGroup.tsx

- Percorso: src/components/ui
- Tipo: componente strutturale (tab group)
- Scopo: Gruppo tab navigabili con icone, badge, accessibilità.
- Props / API: TabGroupProps
- Stato / Hook: N/A
- Dipendenze interne: Tab
- Livello di intervento M3: alta
- Note operative: usa classi M3, livello alto

## AnalyticsDashboard.tsx

- Percorso: src/components
- Tipo: vista principale (analytics dashboard)
- Scopo: Dashboard analytics con metriche, eventi, impostazioni, completamente migrato M3.
- Props / API: AnalyticsDashboardProps
- Stato / Hook: useState, useMemo
- Dipendenze interne: useSystemStore, useUIStore, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, SelectField, M3Typography
- Livello di intervento M3: alta
- Note operative: già migrato, livello alto

## AnalyticsHub.tsx

- Percorso: src/components
- Tipo: vista principale (analytics hub)
- Scopo: Hub analytics con grafici, filtri, insights AI per classi/studenti.
- Props / API: AnalyticsHubProps
- Stato / Hook: useState, useMemo, useEffect
- Dipendenze interne: Studente, Valutazione, ValutazioneCompetenza, TimetableSettings, AiSettings, LineChart, RadarChart, BarChart, calculateClassTrend, calculateCompetencyRadar, calculateGradeDistribution, getGoogleAIClient, EmptyState, AiMemoryChip, SelectField, M3Button, InfoCard, SectionHeader, AiThinkingGem
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ClassAnalytics.tsx

- Percorso: src/components
- Tipo: vista principale (class analytics)
- Scopo: Analytics classi con prestazioni, grafici a barre e donut.
- Props / API: ClassAnalyticsProps
- Stato / Hook: useMemo
- Dipendenze interne: Studente, Valutazione, calculatePerformance, BarChart, DonutChart, M3Dialog, M3DialogContent, M3DialogActions, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ClassCompetencyDashboard.tsx

- Percorso: src/components
- Tipo: vista principale (class competency dashboard)
- Scopo: Dashboard competenze classe con livelli, studenti valutati.
- Props / API: ClassCompetencyDashboardProps
- Stato / Hook: useMemo, useState
- Dipendenze interne: Studente, ValutazioneCompetenza, TimetableSettings, Competenza, Livello, M3Dialog, M3DialogContent, M3DialogActions, M3Button, Avatar
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## ClassroomView.tsx

- Percorso: src/components
- Tipo: vista principale (classroom view)
- Scopo: Vista aula con registro, strumenti, risorse, note per lezione.
- Props / API: ClassroomViewProps
- Stato / Hook: useState, useMemo, useRef, useEffect
- Dipendenze interne: Studente, MaterialeDidattico, KnowledgeBaseEntry, ClassroomViewProps, HomeworkStatus, ParticipationEntry, PARTICIPATION_BADGES, ClassroomTools, ShareModal, DocumentViewerModal, VoiceNoteRecorder, ObservationModal, CopyForRegisterModal, QuickEvaluationModal, calculatePerformance, generateHomeworkPdf, viewPdfInNewTab, StudentProfile, TabGroup, M3Dialog, M3DialogContent, M3DialogActions, M3Button, Avatar
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## CurriculumManager.tsx

- Percorso: src/components
- Tipo: vista principale (curriculum manager)
- Scopo: Gestione curricula scolastici con import AI, editor nuclei.
- Props / API: CurriculumManagerProps
- Stato / Hook: useState
- Dipendenze interne: CurriculumSubject, CurriculumNucleo, AiSettings, TimetableSettings, View, parseCurriculumFromText, extractTextFromFile, useFileDrop, M3Button, M3Dialog, M3DialogContent, M3DialogActions, InfoCard, EmptyState, TextField, TextArea, SelectField, TabGroup, AiThinkingGem
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## DidatticaInclusiva.tsx

- Percorso: src/components
- Tipo: vista principale (didattica inclusiva)
- Scopo: Gestione didattica inclusiva con piani individualizzati, studenti BES.
- Props / API: DidatticaInclusivaProps
- Stato / Hook: useState, useMemo, useEffect
- Dipendenze interne: Studente, DidatticaInclusivaProps, PianoInclusioneEditor, calculatePerformance, InfoCard, EmptyState, TabGroup, SectionHeader, M3Button, Avatar
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## Home.tsx

- Percorso: src/components
- Tipo: vista principale (home/dashboard)
- Scopo: Dashboard principale con metriche, attività recenti, suggerimenti AI.
- Props / API: HomeProps
- Stato / Hook: useMemo
- Dipendenze interne: View, NavigationParams, M3ExpressiveCard, M3Button, M3HeroCard, M3SuggestionCard, M3SuggestionItem, M3ActivityItem, M3EmptyStateCard, M3Typography, M3Card, useAcademicStore, useSystemStore, useStudentStore
- Livello di intervento M3: alta
- Note operative: già migrato, livello alto

## LessonView.tsx

- Percorso: src/components
- Tipo: vista principale (lesson view)
- Scopo: Vista dettagliata lezione con analisi AI, esportazione, materiali.
- Props / API: LessonViewProps
- Stato / Hook: useState
- Dipendenze interne: Lezione, MaterialeDidattico, KnowledgeBaseEntry, AiSettings, LessonAnalysisResult, TimetableSettings, generateLessonPdf, generateHtmlDocxBlob, viewPdfInNewTab, generateHomeworkPdf, saveAs, analyzeLessonPedagogy, addContextToLesson, MaterialPickerModal, LessonAnalysisModal, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, SectionHeader, AiThinkingGem
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## RegisterView.tsx

- Percorso: src/components
- Tipo: vista principale (register view)
- Scopo: Vista registro lezioni con presenze, dettagli lezione.
- Props / API: RegisterViewProps
- Stato / Hook: useState, useMemo
- Dipendenze interne: RegisterEntry, RegisterViewProps, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## Settings.tsx

- Percorso: src/components
- Tipo: vista principale (settings)
- Scopo: Impostazioni applicazione con temi, AI, scuola, gruppi espandibili.
- Props / API: SettingsProps
- Stato / Hook: useRef, useState, useEffect
- Dipendenze interne: SettingsProps, THEME_CUSTOMIZATIONS, AI_PROFILES, SCHOOL_LEVELS, generateNextSchoolYear, TextField, SelectField, TabGroup, SectionHeader, M3Button, InfoCard, ThemeBubble, ChipInputList, ResetConfirmModal, useSettingsLogic, errorLogger, EmotionalPresetsManager
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## StudentManager.tsx

- Percorso: src/components
- Tipo: vista principale (student manager)
- Scopo: Gestione studenti con aggiunta, import, trasferimento, archiviazione.
- Props / API: StudentManagerProps
- Stato / Hook: useState, useMemo, useRef, useEffect
- Dipendenze interne: Studente, KnowledgeBaseEntry, AddStudentModal, ImportStudentsModal, StudentTransferModal, EmptyState, M3Button, SectionHeader, Avatar, TextField, SelectField
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## Studio.tsx

- Percorso: src/components
- Tipo: vista principale (studio)
- Scopo: Studio AI con generazione documenti, immagini, quiz, analisi testi.
- Props / API: StudioProps
- Stato / Hook: useState, useEffect
- Dipendenze interne: KnowledgeBaseEntry, StudioProps, GeneratedQuiz, generateStudioOutput, generateFormattedDocument, generateImageFromPrompt, generateQuiz, DocumentGeneratorModal, ImageGeneratorModal, TestGeneratorModal, TestPreviewModal, Guidance, M3Dialog, M3DialogContent, M3DialogActions, M3Button, SelectField, AiThinkingGem
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## TemplateManager.tsx

- Percorso: src/components
- Tipo: vista principale (template manager)
- Scopo: Gestione template documenti con creazione AI, ricerca, applicazione.
- Props / API: TemplateManagerProps
- Stato / Hook: useState, useMemo
- Dipendenze interne: DocumentTemplate, useSystemStore, useUIStore, useSettingsStore, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, SectionHeader, TextField, SelectField, TextArea, generateTemplateWithAi
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## UdaPlanner.tsx

- Percorso: src/components
- Tipo: vista principale (uda planner)
- Scopo: Pianificazione UDA con editor fasi, competenze, esportazione.
- Props / API: UdaPlannerProps, UdaEditorProps
- Stato / Hook: useState
- Dipendenze interne: Uda, Competenza, UdaPlannerProps, UdaExportModal, Guidance, M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, TextArea, EmptyState
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## WelcomeScreen.tsx

- Percorso: src/components
- Tipo: vista principale (welcome screen)
- Scopo: Schermata benvenuto con setup guidato o rapido.
- Props / API: WelcomeScreenProps
- Stato / Hook: useState
- Dipendenze interne: Logo, SCHOOL_TYPES_DISCIPLINES, ActionTile, InfoCard, TextField, SelectField, M3Button, M3IconButton
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## LessonsPage.tsx

- Percorso: src/components
- Tipo: vista principale (lessons page)
- Scopo: Pagina lezioni con generazione AI, filtri, selezione UDA/KB.
- Props / API: LessonsPageExtendedProps
- Stato / Hook: useState, useMemo, useEffect
- Dipendenze interne: Lezione, LessonsPageProps, CurriculumSubject, TimetableSettings, generateLessonSequenceForClass, IdeaGeneratorModal, CreateLessonFromAiModal
- Livello di intervento M3: NON DEDUCIBILE
- Note operative: livello non deducibile, controllare componenti UI

## ReportisticaHub.tsx

- Percorso: src/components
- Tipo: vista principale (reportistica hub)
- Scopo: Hub reportistica con generazione documenti, wizard, archivio.
- Props / API: ReportisticaHubProps
- Stato / Hook: useState, useMemo, useEffect
- Dipendenze interne: Report, Studente, Lezione, Uda, TimetableSettings, Valutazione, ValutazioneCompetenza, AiSettings, KnowledgeBaseEntry, PianoInclusione, EventoCalendario, saveAs, ArchivioReport, UdaExportModal, generateStudentProfilePdf, generateLessonPdf, generateHtmlDocxBlob, viewPdfInNewTab, generatePdfBrochure, ConsiglioClasseWizard, ClassPlanningWizard, SmartDocumentEditor, DocumentViewerModal, getDocumentTemplate, M3Dialog, M3DialogContent, M3DialogActions, M3Button, ActionTile, SectionHeader, InfoCard, TabGroup, SelectField, useUIStore, BatchExportWizard
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## RubricEditor.tsx

- Percorso: src/components
- Tipo: vista principale (rubric editor)
- Scopo: Editor rubriche con criteri, indicatori, competenze.
- Props / API: RubricEditorProps
- Stato / Hook: useState
- Dipendenze interne: Rubrica, Criterio, Indicatore, Competenza, M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard, TextField, TextArea, EmptyState, SectionHeader
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## TeachingAssignmentMatrix.tsx

- Percorso: src/components
- Tipo: vista principale (teaching assignment matrix)
- Scopo: Matrice assegnazioni insegnamento classi/materie.
- Props / API: TeachingAssignmentMatrixProps
- Stato / Hook: useEffect, useMemo, useState
- Dipendenze interne: TeachingAssignment, generateHueFromString
- Livello di intervento M3: alta
- Note operative: usa tokens M3, livello alto

## EvaluationModule.tsx

- Percorso: src/components
- Tipo: vista principale (evaluation module)
- Scopo: Modulo valutazioni con prove, profili studenti, esportazione.
- Props / API: EvaluationModuleProps
- Stato / Hook: useState, useMemo
- Dipendenze interne: Studente, Valutazione, ValutazioneCompetenza, EvaluationModuleProps, Prova, AddProvaModal, StudentProfile, ExportModal, calculatePerformance, UnifiedEvaluationModal, EmptyState, Avatar
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## KnowledgeBase.tsx

- Percorso: src/components
- Tipo: vista principale (knowledge base)
- Scopo: Gestione base conoscenza con categorie, corpora, ricerca.
- Props / API: KnowledgeBaseProps
- Stato / Hook: useState, useMemo
- Dipendenze interne: KnowledgeBaseEntry, Corpus, AiSettings, TimetableSettings, AddSourceModal, DocumentViewerModal, ImageViewerModal, KB_CATEGORIES, InfoCard, CategoryCard, SectionHeader, M3Button
- Livello di intervento M3: alta
- Note operative: usa M3 componenti, livello alto

## App.tsx

- Percorso: src/components
- Tipo: vista principale (app root)
- Scopo: Componente root dell'app con navigazione, modali, suggerimenti.
- Props / API: nessuna (root component)
- Stato / Hook: useAppEngine, useRestoreAssist
- Dipendenze interne: AssistantModal, AssistantFab, Header, SkipLink, NavigationRail, ViewManager, SignInScreen, ModalManager, PassaggioAnnoWizard, ThemeService, Snackbar, UserProfile, AiSuggestion, SystemSuggestion, KnowledgeBaseEntry, EventoCalendario, ErrorBoundary
- Livello di intervento M3: alta
- Note operative: usa M3 tokens, livello alto

## AuraView.tsx

- Percorso: src/components
- Tipo: vista principale (aura view wrapper)
- Scopo: Wrapper per viste con layout M3.
- Props / API: AuraViewProps
- Stato / Hook: nessuna
- Dipendenze interne: nessuna
- Livello di intervento M3: alta
- Note operative: wrapper semplice, livello alto

## ErrorBoundary.tsx

- Percorso: src/components
- Tipo: vista principale (error boundary)
- Scopo: Cattura errori e mostra fallback.
- Props / API: ErrorBoundaryProps
- Stato / Hook: useUIStore
- Dipendenze interne: useUIStore
- Livello di intervento M3: non deducibile
- Note operative: classe React, usa hook per toast, livello non deducibile
