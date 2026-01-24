// --- EMOTIONAL PRESETS ---
export type EmotionalPreset = 'calm' | 'energetic' | 'creative' | 'focused' | 'relaxed' | 'professional' | 'playful' | 'minimal';

// --- HEADER ACTIONS POPOVER ---
export interface ActionsPopoverProps extends HeaderProps {
    onClose: () => void;
    onShareClick: () => void;
    unreadCount: number;
    onOpenNotifications: () => void;
}

// --- KNOWLEDGE BASE ENTRY ---
export interface KnowledgeBaseEntry {
    id: string;
    fileName: string;
    content: string;
    category?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

// --- ORIENTAMENTO 2026 ---
export interface OrientamentoActivity {
    id: string;
    title: string;
    date: string;
    durationHours: number;
    description: string;
    type: 'didattica' | 'extra-curriculare' | 'PCTO' | 'esperienziale' | 'altro';
    studentIds: string[];
    classes: string[];
    competenciesAddressed: string[];
}

export interface EPortfolioEntry {
    id: string;
    studentId: string;
    title: string;
    date: string;
    description: string;
    category: 'capolavoro' | 'riflessione' | 'certificazione' | 'altro';
    fileUrl?: string;
    tags: string[];
}

export interface StudentOrientamentoState {
    studentId: string;
    hasCapolavoro: boolean;
    hasAutovalutazione: boolean;
    totalHours: number;
    activities: string[];
    ePortfolio: string[];
    selfReflection: string;
    tutorNotes: string;
}

// --- DATA STORE STATE & ACTIONS ---
// Legacy DataState and DataActions removed in favor of modular stores (Student, Academic, System, Settings, UI)
// and the aggregated AppState/AppActions.

export interface StudentState {
    students: Studente[];
    pianiInclusione: Record<string, PianoInclusione>;
    evaluations: Valutazione[];
    competencyEvals: ValutazioneCompetenza[];
    studentProfileContext: Studente | null;
    selectedClassForDashboard: string | null;
    orientamentoActivities: OrientamentoActivity[];
    ePortfolioEntries: EPortfolioEntry[];
    studentOrientamentoStates: Record<string, StudentOrientamentoState>;
}

export interface AcademicState {
    lessons: Record<string, Lezione>;
    slots: Record<string, Slot>;
    uda: Uda[];
    eventi: EventoCalendario[];
    rubriche: Rubrica[];
    curricula: CurriculumSubject[];
    submissions: HomeworkSubmission[];
    draftRegister: Record<string, RegisterEntry>;
    finalizedRegister: RegisterEntry[];
    giudizi: Record<string, GiudizioPeriodico>;
    reportistica: Report[];
}

export interface SystemState {
    user: UserProfile | null;
    analyticsEvents: AnalyticsEvent[];
    analyticsMetrics: AnalyticsMetrics;
    analyticsSettings: AnalyticsSettings;
    notifiche: Notifica[];
    suggestions: AiSuggestion[];
    activeSuggestion: SystemSuggestion | null;
    dismissedSuggestions: Set<string>;
    knowledgeBase: KnowledgeBaseEntry[];
    corpora: Corpus[];
    templates: DocumentTemplate[];
    feedSources: FeedSource[];
}

export interface SettingsState {
    settings: TimetableSettings;
    aiSettings: AiSettings;
    themeState: AppThemeState;
}

export interface UIState {
    modals: Modals & {
        toast: { message: string; type: 'success' | 'error' | 'info'; visible: boolean };
    };
    chaosStage: 'none' | 'chaos' | 'implosion' | 'peace' | 'settled';
    circularAnalysisModal: { isOpen: boolean; url: string; title: string } | null;
    syncConflictModal: { isOpen: boolean; data: SyncConflictData | null } | null;
    createLessonContext: { isOpen: boolean; slotKey: string | null; lezione: Lezione | null } | null;
    editingSlotKey: string | null;
    activeSlotKey: string | null;
    lessonViewContext: Lezione | null;
    loadingModalMessage: string;
    toast: { message: string; type: 'success' | 'error' | 'info'; visible: boolean } | null;
    installPrompt: BeforeInstallPromptEvent | null;
    canShowInstallPrompt: boolean;
    isGlobalAiLoading: boolean;
    navigationHistory: { view: View; context: unknown }[];
    backupState: BackupState;
    driveSyncState: DriveSyncState;
}

export interface BackupPayload extends StudentState, AcademicState, SystemState {
    settings: TimetableSettings;
    aiSettings: AiSettings;
    themeState: AppThemeState;
    installPrompt: BeforeInstallPromptEvent | null;
    canShowInstallPrompt: boolean;
    isGlobalAiLoading: boolean;
    navigationHistory: { view: View; context: NavigationParams | null }[];
    backupState: BackupState;
    driveSyncState: DriveSyncState;
}
// --- UNIVERSAL MODAL ---
export interface UniversalModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}
// --- MODALS INTERFACE (for ViewManager) ---
export interface Modals {
        showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
        clearToast?: () => void;
    setCreateLessonContext: (context: { isOpen: boolean; slotKey: string | null; lezione: Lezione | null; }) => void;
    setLessonViewContext: (lesson: Lezione | null) => void;
    setIsLiveAssistantModalOpen: (open: boolean) => void;
    activeSlotKey?: string | null;
    // Proxy modals additions (opzionali per compatibilità proxy)
    isOperationsCenterOpen?: boolean | null;
    setIsOperationsCenterOpen?: ((value?: boolean) => void) | null;
    isImageAnalysisOpen?: boolean | null;
    setIsImageAnalysisOpen?: ((value?: boolean) => void) | null;
    isLiveAssistantModalOpen?: boolean | null;
    isHelpOpen?: boolean | null;
    setIsHelpOpen?: ((value?: boolean) => void) | null;
    circularAnalysisModal?: { isOpen: boolean; url: string; title: string } | null;
    setCircularAnalysisModal?: ((modal: { isOpen: boolean; url: string; title: string } | null) => void) | null;
    isLoadingModalOpen?: boolean | null;
    setIsLoadingModalOpen?: ((value?: boolean) => void) | null;
    loadingModalMessage?: string | null;
    setLoadingModalMessage?: ((msg: string) => void) | null;
    editingSlotKey?: string | null;
    setEditingSlotKey?: ((key: string | null) => void) | null;
    setActiveSlotKey?: ((key: string | null) => void) | null;
    lessonViewContext?: Lezione | null;
    toast?: { message: string; type?: 'success' | 'error' | 'info' } | null;
    isBackupInfoModalOpen?: boolean | null;
    setIsBackupInfoModalOpen?: ((value?: boolean) => void) | null;
    isRegisterImportOpen?: boolean | null;
    setIsRegisterImportOpen?: ((value?: boolean) => void) | null;
    syncConflictModal?: { isOpen: boolean; data: SyncConflictData | null } | null;
    setSyncConflictModal?: ((modal: { isOpen: boolean; data: SyncConflictData | null } | null) => void) | null;
    createLessonContext?: { isOpen: boolean; slotKey: string | null; lezione: Lezione | null } | null;
    isYearTransitionOpen?: boolean | null;
    setIsYearTransitionOpen?: ((value?: boolean) => void) | null;
    isVideoAnalysisOpen?: boolean | null;
    setIsVideoAnalysisOpen?: ((value?: boolean) => void) | null;
    isRestoring?: boolean | null;
    setIsRestoring?: ((value: boolean) => void) | null;
    setNotifiche?: ((notifiche: Notifica[]) => void) | null;
}
// --- NAVIGATION PARAMS ---
export interface NavigationParams {
    classe?: string;
    materia?: string;
    slotKey?: string;
    [key: string]: unknown;
}
export interface ChipInputListProps {
    items: string[];
    onAdd: (item: string) => void;
    onRemove: (index: number) => void;
    placeholder: string;
    icon: string;
    label: string;
    variant?: 'class' | 'subject' | 'default';
}
export interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    ariaLabel?: string;
    width?: string | number;
    maxWidth?: string | number;
}
// --- BUTTON COMPONENTS ---
export interface NKAHeaderAuraButtonProps {
    hasNewNode: boolean;
    onClick: () => void;
    onLongPress: () => void;
}
// --- CARD COMPONENT ---
export interface EditableContentCardProps {
    title: string;
    content: string;
    onSave: (newContent: string) => void;
    icon?: string;
}
// --- NKA NODE ---
export interface NKANode {
    id: string;
    label: string;
    color: string;
    elevation: number;
    depth: number;
    shape: 'circle' | 'square' | 'hex' | string;
    actions: string[];
    isNew?: boolean;
}

// --- GLOBAL INTERFACES FOR PWA ---
export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// --- USER INTERFACE (for App.tsx, SignInScreen, etc.) ---
export interface User {
    id: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
}

// --- INPUT INTERFACES (DTOs) ---
export interface LessonScheduleInput {
    contenuto: string;
    materia: string;
    classe: string;
    tipoLezione?: Lezione['tipoLezione'];
    obiettivi?: string;
    adattamenti?: string;
    compiti?: string;
    slotKey?: string;
    externalLink?: string;
}

export interface EvaluationInput {
    studenteId: string;
    materia: string;
    data: string;
    tipo: Valutazione['tipo'];
    voto: string;
    argomento?: string;
    note?: string;
}

export interface UdaCreateInput {
    title: string;
    classe: string;
    materia: string;
    introduction: string;
    finalProduct: string;
    competencyIds: string[];
    phases: { id: string; title: string; description: string; activities: string; duration: string }[];
    evaluation: string;
    tools: string;
    startDate?: string;
    endDate?: string;
    externalLink?: string;
}

// --- CORE TYPES ---

export interface TranscriptEntry {
    speaker: 'user' | 'ai';
    text: string;
    sources?: { title: string; uri: string }[];
    contextLabel?: string;
}

export interface GenAIBlob {
    mimeType: string;
    data: string;
}

export type View =
    | 'home'
    | 'timetable'
    | 'calendario'
    | 'settings'
    | 'aula'
    | 'studenti'
    | 'progettazione-hub'
    | 'reportistica'
    | 'knowledge-base'
    | 'studio'
    | 'lessons'
    | 'uda'
    | 'rubriche'
    | 'didattica-inclusiva'
    | 'feed-manager'
    | 'evaluations'
    | 'register'
    | 'improvement-guide'
    | 'consiglio-di-classe'
    | 'class-competency-dashboard'
    | 'analytics'
    | 'student-dashboard'
    | 'student-workspace'
    | 'aula-session'
    | 'competency-levels'
    | 'live-assistant'
    | 'welcome'
    | 'orientamento'
    | 'curriculum-manager'
    | 'teacher-inbox'
    | 'video-analysis'
    | 'teacher-presentation-view';

export interface UserProfile {
    id: string;
    displayName: string;
    email?: string;
    photoURL?: string;
}

export interface Notifica {
    id: string;
    titolo: string;
    messaggio: string;
    data: string;
    letta: boolean;
    type: 'circular' | 'reminder' | 'suggestion';
    payload?: Record<string, unknown>;
}

// FIX: Added 'title' to LogoProps
export interface LogoProps {
    title?: string;
    isAiThinking?: boolean;
}

export interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    onBack?: () => void;
    onOpenImageAnalysis: () => void;
    onOpenVideoAnalysis: () => void;
    onOpenHelp: () => void;
    user: UserProfile | null;
    settings: TimetableSettings;
    notifiche: Notifica[];
    setNotifiche: (input: Notifica[] | ((prev: Notifica[]) => Notifica[])) => void;
    onOpenCircularAnalysis: (url: string, title: string) => void;
    onNavigate: (view: View, context?: NavigationParams) => void;
    isAiProcessing: boolean;
    installPrompt: BeforeInstallPromptEvent | null;
    onInstallApp: () => void;
    onOpenOperations: () => void;
    hasSuggestion: boolean;
}

export interface SettingsProps {
    settings: TimetableSettings;
    themeState: AppThemeState;
    aiSettings: AiSettings;
    onSaveSettings: (settings: TimetableSettings) => void;
    onSaveTheme: (theme: AppThemeState) => void;
    onSaveAiSettings: (settings: AiSettings) => void;
    onExportData: () => void;
    onImportData: (data: string) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    onCleanDemoData: () => void;
    onLogout: () => void;
    driveState: DriveSyncState;
    onConnectDrive: () => void;
    onSyncToDrive: () => void;
    onClose: () => void;
    dismissedSuggestions: Set<string>;
    onReactivateSuggestion: (id: string) => void;
}

export interface MaterialeDidattico {
    id: string;
    type: 'kb' | 'file' | 'link' | 'ai_deliverable';
    kbId?: string;
    fileName?: string;
    file?: { name: string; content: string; mimeType: string };
    url?: string;
    label?: string;
}

export interface Lezione {
    id: string;
    classe: string;
    materia: string;
    contenuto: string;
    svolta: boolean;
    tipoLezione?: 'Teoria' | 'Disegno' | 'Laboratorio' | 'Test' | 'Verifica' | 'Disposizione' | 'Ricevimento';
    unitaDiApprendimento?: string;
    nota?: string;
    obiettivi?: string;
    contesto?: string;
    compiti?: string;
    adattamenti?: string;
    materialiDidattici?: MaterialeDidattico[];
    externalLink?: string;
}

export interface Slot {
    giorno: string;
    ora: string;
    classe?: string;
    materia?: string;
    lezioneId?: string;
}

export interface AiSettings {
    model: string;
}

export interface StudentHistoryRecord {
    year: string;
    classe: string;
    averageGrade: string;
    absencesPercentage: number;
    finalOutcome?: 'Promosso' | 'Bocciato' | 'Sospeso' | 'Ritirato' | 'Trasferito' | 'Diplomato';
    competencySummary?: { name: string; level: string }[];
}

export interface Studente {
    id: string;
    nome: string;
    cognome: string;
    classe: string;
    dataNascita?: string;
    isArchived?: boolean;
    archiveYear?: string;
    history?: StudentHistoryRecord[];
}

export interface Uda {
    id: string;
    title: string;
    classe: string;
    materia: string;
    introduction: string;
    finalProduct: string;
    competencyIds: string[];
    phases: { id: string; title: string; description: string; activities: string; duration: string }[];
    evaluation: string;
    tools: string;
    startDate?: string;
    endDate?: string;
    linkedEventId?: string;
    externalLink?: string;

    // Properties for GanttBar visualization (now required)
    startPos: number;
    width: number;
    color: string;
    borderColor: string;
    textColor: string;
}

export interface DocumentTemplate {
    id: string;
    name: string;
    type: 'student_profile' | 'lesson_plan' | 'uda';
    description?: string;
    createdAt: string;
    updatedAt: string;
    // Configurazioni specifiche per tipo
    config: {
        // Per profili studente
        includeEvaluations?: boolean;
        includeCompetencyEvaluations?: boolean;
        customSections?: string[];
        // Per piani lezione
        includeObjectives?: boolean;
        includeMaterials?: boolean;
        customFields?: Record<string, string>;
        // Per UDA
        includePhases?: boolean;
        includeEvaluation?: boolean;
        customIntroduction?: string;
        customConclusion?: string;
    };
    // Contenuto predefinito/template
    content?: {
        header?: string;
        footer?: string;
        customCss?: string;
    };
}

export interface AnalyticsEvent {
    id: string;
    timestamp: string;
    eventType: 'feature_usage' | 'document_generated' | 'template_created' | 'export_batch' | 'ai_interaction' | 'navigation';
    featureName: string;
    metadata?: Record<string, string | number | boolean>;
    sessionId: string;
}

export interface AnalyticsMetrics {
    totalDocumentsGenerated: number;
    documentsByType: Record<string, number>;
    featuresUsage: Record<string, number>;
    templatesCreated: number;
    exportBatchesCount: number;
    aiInteractionsCount: number;
    averageSessionDuration: number;
    lastUpdated: string;
}

export interface AnalyticsSettings {
    enabled: boolean;
    collectFeatureUsage: boolean;
    collectDocumentMetrics: boolean;
    collectPerformanceMetrics: boolean;
    retentionDays: number; // Giorni di conservazione dati
    lastReset: string | null;
}

export interface Valutazione {
    id: string;
    studenteId: string;
    materia: string;
    data: string;
    tipo: 'Scritto' | 'Orale' | 'Pratico' | 'Test' | 'Verifica' | 'Ricevimento';
    voto: string;
    argomento?: string;
    note?: string;
}

export interface ValutazioneCompetenza {
    id: string;
    studenteId: string;
    competenzaId: string;
    livelloId: string;
    materia: string;
    data: string;
    provaId?: string;
    nota?: string;
    lezioneId?: string;
}

export interface Livello {
    id: string;
    nome: string;
    voto: string;
    punteggio: string;
    descrizione: string;
}

export interface Competenza {
    id: string;
    codice: string;
    nome: string;
    framework?: string;
    livelli: Livello[];
    disciplines?: string[];
}

export interface TeachingAssignment {
    id: string;
    classId: string;
    subjectId: string;
    color: string;
    hoursPerWeek: number;
}

export interface CurriculumObjective {
    id: string;
    text: string;
    type: 'knowledge' | 'skill';
}

export interface CurriculumNucleo {
    id: string;
    title: string;
    objectives: CurriculumObjective[];
}

export interface CurriculumSubject {
    id: string;
    subject: string;
    gradeLevel: string;
    nuclei: CurriculumNucleo[];
    lastUpdated: string;
}

export interface HomeworkSubmission {
    id: string;
    studentId: string;
    lessonId: string;
    date: string;
    content?: string;
    file?: { name: string; data: string; mimeType: string };
    status: 'pending' | 'graded';
    teacherFeedback?: string;
}

export interface TimetableSettings {
    timeSlots: string[];
    defaultView: string;
    schoolType: string;
    livelli: string[];
    sezioni: string[];
    classi: string[];
    disciplines: string[];
    teachingAssignments: TeachingAssignment[];
    competenze: Competenza[];
    nomeInsegnante: string;
    cognomeInsegnante?: string;
    email?: string;
    nomeIstituto: string;
    cittaIstituto: string;
    anniScolastici: string[];
    annoScolasticoCorrente: string;
    activityStartDate: string;
    activityEndDate: string;
    notificationSettings: {
        enabled: boolean;
        reminders: string[];
        desktopNotifications: boolean;
    };
    showGuidanceTips: boolean;
    visualTheme: string;
    uiMode: 'classic' | 'flow';
    visualPreferences: {
        font: string;
        shape: string;
    };
    backupFolderId?: string;
    backupFolderName?: string;
    googleClientId?: string;
    googleApiKey?: string;
    autoSyncEnabled: boolean;
    autoSyncInterval: number;
    securityPin: string;
}

export type HomeworkStatus = 'completed' | 'partial' | 'missing' | 'default';

export interface ParticipationEntry {
    type: 'positive' | 'question' | 'collaboration' | 'distraction';
    timestamp: number;
}

export interface ObservationEntry {
    autonomy: number;
    collaboration: number;
    responsibility: number;
    note: string;
}

export interface ColorTokens {
    primary: string; onPrimary: string; primaryContainer: string; onPrimaryContainer: string;
    secondary: string; onSecondary: string; secondaryContainer: string; onSecondaryContainer: string;
    tertiary: string; onTertiary: string; tertiaryContainer: string; onTertiaryContainer: string;
    error: string; onError: string; errorContainer: string; onErrorContainer: string;
    background: string; onBackground: string;
    surface: string; onSurface: string; surfaceVariant: string; onSurfaceVariant: string;
    outline: string; outlineVariant: string;
    surfaceContainerLowest: string; surfaceContainerLow: string; surfaceContainer: string; surfaceContainerHigh: string; surfaceContainerHighest: string;
    surfaceDisabled: string;
}

export interface EventoCalendario {
    id: string;
    titolo: string;
    data: string;
    dataFine?: string;
    tipo: 'impegno' | 'scadenza' | 'consiglio' | 'formazione';
    oraInizio?: string;
    oraFine?: string;
    descrizione?: string;
    location?: string;
}

export interface KnowledgeBaseEntry {
    id: string;
    fileName: string;
    content: string;
    isGenerated?: boolean;
    category?: string;
    corpusId?: string;
    htmlContent?: string;
    fileContent?: { data: string; mimeType: string };
    driveFileId?: string;
    driveViewLink?: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface Corpus {
    id: string;
    displayName: string;
    chatHistory: ChatMessage[];
}

export interface Rubrica {
    id: string;
    titolo: string;
    criteri: Criterio[];
}

export interface Criterio {
    competenzaId: string;
    indicatori: Indicatore[];
}

export interface Indicatore {
    livelloId: string;
    descrizione: string;
    nota?: string;
}

export interface PianoInclusione {
    id: string;
    puntiDiForza: string;
    areeDiIntervento: string;
    misureCompensative: string;
    misureDispensative: string;
    criteriValutazionePersonalizzati: string;
    obiettiviPerMateria?: Record<string, string>;
}

export interface GiudizioPeriodico {
    studenteId: string;
    periodo: PeriodoValutazione;
    annoScolastico: string;
    giudizio: string;
    comportamento: string;
    educazioneCivica: string;
    note: string;
    votoDisciplina: string;
    votoAmmissione: string;
    votoUscita: string;
}

export type PeriodoValutazione = 'primo-quadrimestre' | 'secondo-quadrimestre';

export interface Report {
    id: string;
    nome: string;
    dataCreazione: string;
    contesto: { tipo: string; id: string; titolo: string };
    modelloUsato: { nome: string; tipo: string };
    file: { name: string; content: string; mimeType: string };
}

export interface FeedSource {
    id: string;
    pageUrl: string;
    feedUrl: string;
    title: string;
    lastItemGuid?: string;
}

export interface NotebookNote {
    id: string;
    createdAt: string;
    content: string;
}

export interface AiSuggestion {
    id: string;
    icon: string;
    title: string;
    description: string;
    action: { type: string; payload?: string | Record<string, unknown> };
}

// FIX: Corrected 'action' type to be always present and structured
export interface SystemSuggestion {
    id: string;
    message: string;
    targetView?: string; // made optional to allow generic suggestions
    actionLabel: string;
    action: { type: string; payload?: Record<string, unknown> | string }; // Changed to required and structured
}

export interface RegisterEntry {
    id: string;
    date: string;
    slotKey: string;
    lessonId: string;
    classe: string;
    materia: string;
    studentAttendance: Record<string, 'presente' | 'assente' | 'ritardo'>;
    status: 'draft' | 'finalized';
    homeworkCheck?: Record<string, HomeworkStatus>;
    participation?: Record<string, ParticipationEntry[]>;
    quickNotes?: Record<string, string>;
    observations?: Record<string, ObservationEntry>;
    checkedObjectives?: Record<number, boolean>;
    notes?: string;
}

export interface DriveSyncState {
    isAuthenticated: boolean;
    isSyncing: boolean;
    lastSyncTime: Date | null | string;
    error?: string;
}

export type EmotionalPreset =
    | 'calm'        // Calmo - toni blu/verde soft, spaziatura rilassata
    | 'energetic'   // Energico - colori vivaci, contrasto alto, animazioni veloci
    | 'creative'    // Creativo - colori caldi, forme morbide, spaziatura generosa
    | 'focused'     // Concentrato - contrasto alto, colori neutri, spaziatura minima
    | 'relaxed'     // Rilassato - colori pastello, spaziatura ampia, forme arrotondate
    | 'professional' // Professionale - colori formali, contrasto medio, spaziatura standard
    | 'playful'     // Giocoso - colori brillanti, forme irregolari, animazioni giocose
    | 'minimal';    // Minimale - colori monocromatici, spaziatura ridotta, forme geometriche

export interface EmotionalPresetTokens {
    // Color overrides
    primary?: string;
    secondary?: string;
    tertiary?: string;
    // Motion & timing overrides
    motionDuration?: string;
    motionEasing?: string;
    // Shape & spacing overrides
    cornerRadius?: string;
    spacingScale?: number;
    // Typography overrides
    fontWeight?: string;
    letterSpacing?: string;
    // Elevation & shadow overrides
    elevationLevel?: number;
    // Additional visual properties
    backdropBlur?: string;
    opacity?: number;
}

export interface AppThemeState {
    mode: 'light' | 'dark' | 'system';
    visualStyle: 'aura' | 'flat' | 'minimal' | 'cupertino' | 'windows' | 'expressive';
    customizationName: string;
    customColors?: Partial<ColorTokens>;
    generatedName?: string;
    generatedColors?: Partial<ColorTokens>;
    glassBlur?: number;
    radiusMultiplier?: number;
    fontScale?: number;
    contrastLevel?: number;
    uiMode: 'classic' | 'flow';  // Now required after safe migration
    // Emotional Style Presets - Phase 1 Foundation
    emotionalPreset?: EmotionalPreset;
}

export interface BackupState {
    status: 'synced' | 'drive_pending' | 'error';
    lastBackup: Date | null;
}

export interface ToDoItem {
    id: string;
    text: string;
    done: boolean;
}

export interface AppState {
    user: UserProfile | null;
    students: Studente[];
    lessons: Record<string, Lezione>;
    slots: Record<string, Slot>;
    evaluations: Valutazione[];
    competencyEvals: ValutazioneCompetenza[];
    uda: Uda[];
    eventi: EventoCalendario[];
    knowledgeBase: KnowledgeBaseEntry[];
    corpora: Corpus[];
    notifiche: Notifica[]; // Moved from UIStore to DataStore for persistence
    rubriche: Rubrica[];
    pianiInclusione: Record<string, PianoInclusione>;
    giudizi: Record<string, GiudizioPeriodico>;
    reportistica: Report[];
    feedSources: FeedSource[];
    draftRegister: Record<string, RegisterEntry>;
    finalizedRegister: RegisterEntry[];
    curricula: CurriculumSubject[];
    submissions: HomeworkSubmission[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
    themeState: AppThemeState;
    backupState: BackupState;
    driveSyncState: DriveSyncState;
    // PWA & Global App State (Moved to UI Store, but aggregated here for AppState)
    installPrompt: BeforeInstallPromptEvent | null;
    canShowInstallPrompt: boolean;
    isGlobalAiLoading: boolean;
    navigationHistory: { view: View; context: NavigationParams | null }[];
    // AI Suggestions & Context (Moved to Data Store, but aggregated here for AppState)
    suggestions: AiSuggestion[];
    studentProfileContext: Studente | null;
    selectedClassForDashboard: string | null;
    activeSuggestion: SystemSuggestion | null;
    dismissedSuggestions: Set<string>;
    selectedDocuments: Document[];
    // Orientamento 2026
    orientamentoActivities: OrientamentoActivity[];
    ePortfolioEntries: EPortfolioEntry[];
    studentOrientamentoStates: Record<string, StudentOrientamentoState>;
}

export interface AppActions {
    setUser: (user: UserProfile | null) => void;
    setSettings: (value: TimetableSettings | ((prev: TimetableSettings) => TimetableSettings)) => void;
    setThemeState: (value: AppThemeState | ((prev: AppThemeState) => AppThemeState)) => void;
    setAiSettings: (value: AiSettings | ((prev: AiSettings) => AiSettings)) => void;
    setStudents: (input: Studente[] | ((prev: Studente[]) => Studente[])) => void;
    setLessons: (input: Record<string, Lezione> | ((prev: Record<string, Lezione>) => Record<string, Lezione>)) => void;
    setSlots: (input: Record<string, Slot> | ((prev: Record<string, Slot>) => Record<string, Slot>)) => void;
    setEvaluations: (input: Valutazione[] | ((prev: Valutazione[]) => Valutazione[])) => void;
    setCompetencyEvals: (input: ValutazioneCompetenza[] | ((prev: ValutazioneCompetenza[]) => ValutazioneCompetenza[])) => void;
    setUda: (input: Uda[] | ((prev: Uda[]) => Uda[])) => void;
    setEventi: (input: EventoCalendario[] | ((prev: EventoCalendario[]) => EventoCalendario[])) => void;
    setKnowledgeBase: (input: KnowledgeBaseEntry[] | ((prev: KnowledgeBaseEntry[]) => KnowledgeBaseEntry[])) => void;
    setCorpora: (input: Corpus[] | ((prev: Corpus[]) => Corpus[])) => void;
    setNotifiche: (input: Notifica[] | ((prev: Notifica[]) => Notifica[])) => void; // New action for notifications
    setRubriche: (input: Rubrica[] | ((prev: Rubrica[]) => Rubrica[])) => void;
    setPianiInclusione: (input: Record<string, PianoInclusione> | ((prev: Record<string, PianoInclusione>) => Record<string, PianoInclusione>)) => void;
    setGiudizi: (input: Record<string, GiudizioPeriodico> | ((prev: Record<string, GiudizioPeriodico>) => Record<string, GiudizioPeriodico>)) => void;
    setReportistica: (input: Report[] | ((prev: Report[]) => Report[])) => void;
    setFeedSources: (input: FeedSource[] | ((prev: FeedSource[]) => FeedSource[])) => void;
    setDraftRegister: (input: Record<string, RegisterEntry> | ((prev: Record<string, RegisterEntry>) => Record<string, RegisterEntry>)) => void;
    setFinalizedRegister: (input: RegisterEntry[] | ((prev: RegisterEntry[]) => RegisterEntry[])) => void;
    setCurricula: (input: CurriculumSubject[] | ((prev: CurriculumSubject[]) => CurriculumSubject[])) => void;
    setSubmissions: (input: HomeworkSubmission[] | ((prev: HomeworkSubmission[]) => HomeworkSubmission[])) => void;
    // Orientamento 2026
    setOrientamentoActivities: (input: OrientamentoActivity[] | ((prev: OrientamentoActivity[]) => OrientamentoActivity[])) => void;
    setEPortfolioEntries: (input: EPortfolioEntry[] | ((prev: EPortfolioEntry[]) => EPortfolioEntry[])) => void;
    setStudentOrientamentoStates: (input: Record<string, StudentOrientamentoState> | ((prev: Record<string, StudentOrientamentoState>) => Record<string, StudentOrientamentoState>)) => void;

    // Helper Actions (Domain-specific)
    addEvaluation: (evaluation: Omit<Valutazione, 'id'>) => void;
    updateEvaluation: (id: string, updates: Partial<Valutazione>) => void;
    deleteEvaluation: (id: string) => void;
    saveStudent: (student: Studente) => void;
    deleteStudent: (id: string) => void;
    importStudents: (newStudents: Studente[]) => void;
    savePianoInclusione: (piano: PianoInclusione) => void;
    deletePianoInclusione: (id: string) => void;
    saveRubrica: (rubrica: Rubrica) => void;
    saveGiudizio: (giudizio: GiudizioPeriodico) => void;

    // AI Suggestions & Context Actions (to Data Store)
    setSuggestions: (suggestions: AiSuggestion[]) => void;
    setActiveSuggestion: (suggestion: SystemSuggestion | null) => void;
    dismissSuggestion: (id: string) => void;
    setStudentProfileContext: (student: Studente | null) => void;
    setSelectedClassForDashboard: (className: string | null) => void;
    loadFromBackup: (data: unknown) => void;

    // PWA & Global App Actions (to UI Store)
    setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
    setCanShowInstallPrompt: (canShow: boolean) => void;
    setIsGlobalAiLoading: (isLoading: boolean) => void;
    setNavigationHistory: (history: { view: View; context: NavigationParams | null }[]) => void;
    addNavigationEntry: (entry: { view: View; context: NavigationParams | null }) => void;
    popNavigationEntry: () => void;
    clearNavigationHistory: () => void;
    setBackupState: (input: Partial<BackupState> | ((prev: BackupState) => Partial<BackupState>)) => void;
    setDriveSyncState: (input: Partial<DriveSyncState> | ((prev: DriveSyncState) => Partial<DriveSyncState>)) => void;
    setCircularAnalysisModal: (data: { isOpen: boolean; url: string; title: string; } | null) => void;
    setIsLoadingModalOpen: (val: boolean) => void;
    setLoadingModalMessage: (msg: string) => void;
    setActiveSlotKey: (key: string | null) => void;
    setEditingSlotKey: (key: string | null) => void;
    setIsVideoAnalysisOpen: (value: boolean) => void;
    setIsRestoring: (value: boolean) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    clearToast: () => void;


    handleNavigate: (view: View, context?: unknown) => void;
    handleBack: (force?: boolean) => void;
    handleLoadDemoData: () => void;
    handleCleanDemoData: () => void;
    handleConfigureDrive: (clientId: string, apiKey?: string) => void;
    handleConnectDrive: () => void;
    handleDisconnectDrive: () => void;
    handleSyncToDrive: (folderId?: string) => void;
    handleRestoreFromDrive: (folderId?: string) => void;
    resetAll: () => void;
    pickGoogleDriveFolder: (apiKey?: string) => Promise<{ id: string; name: string } | null>;
    createAppFolder: () => Promise<{ id: string; name: string }>;
    handleInstallApp: () => void;
    handleEnterStudentMode: () => void;
    handleStartClassroom: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
    handleEditSlot: (giorno: string, ora: string) => void;
    handleShowSlotActions: (slot: Slot, lesson: Lezione) => void;
    handleAiSuggest: (slot: Slot) => void;
    onScheduleLesson: (data: LessonScheduleInput) => void; // FIX: Added missing onScheduleLesson from actions
    handleAddEvaluation: (data: EvaluationInput) => void;
    handleCreateUda: (data: UdaCreateInput) => void;
    handleAddNote: (data: { note: string, studentName?: string }) => void;
    onMarkAttendance: (data: { studentName: string; status: "presente" | "assente" | "ritardo"; }) => void;
    handleOpenBackupInfo: () => void;
    handleExportData: () => Promise<void>;
    handleImportData: (file: File) => void;
    handleAiSuggestionFromHome: (action: AiSuggestion['action']) => void;
    handleOpenOperations: () => void;
    setViewContext: (context: NavigationParams | null) => void;
    onAddLessons: (lessons: Lezione[]) => void;
    onSaveUda: (uda: Uda) => void;
    onSaveReport: (report: Report) => void;
    onSaveEvent: (event: EventoCalendario) => void;
    handleGradeSubmission: (submissionId: string, grade: string, feedback: string) => void;
    handlePromoteStudents: (promotions: Studente[], archiveYear: string) => void;
    handleResetYearData: () => void;
}

export interface SyncConflictData {
    fileId: string;
    fileName: string;
    localContent: string;
    remoteContent: string;
    lastModifiedLocal: string;
    lastModifiedRemote: string;
}

export interface CircularAnalysisResult {
    summary: string;
    events: { titolo: string; data: string; oraInizio?: string }[];
    deadlines: { title: string; date: string }[];
    notes?: { title: string; content: string };
}

export interface GeneratedQuiz {
    title: string;
    topic: string;
    difficulty: string;
    questions: { id: string; type: string; text: string; options?: string[]; correctAnswer: string }[];
}

export interface LessonAnalysisResult {
    engagementSuggestions: { title: string; description: string; activityType: string }[];
    inclusivityAdaptations: { targetGroup: string; suggestion: string }[];
}

export interface DesignSystemDefinition {
    version: string;
    colors: Record<string, { value: string; description: string; cssVar: string }>;
    typography: Record<string, { value: string | number | boolean | object; description: string; cssVar: string }>;
    spacing: Record<string, { value: string; description: string; cssVar: string }>;
}

export interface Theme {
    name: string;
    mode: 'light' | 'dark';
    visualStyle: 'aura' | 'flat' | 'minimal' | 'cupertino' | 'windows' | 'expressive';
    colors: ColorTokens;
    glassBlur?: number;
    radiusMultiplier?: number;
    fontScale?: number;
    contrastLevel?: number;
}

export interface ParticipationBadge {
    id: string;
    label: string;
    icon: string;
    color: string;
}

export interface ThemeCustomization {
    name: string;
    colors: Partial<ColorTokens>;
}

export interface Prova {
    id: string;
    titolo: string;
    data: string;
    materia: string;
    tipo: Valutazione['tipo'];
    voti: Record<string, Valutazione>;
}

export interface EvaluationModuleProps {
    students: Studente[];
    evaluations: Valutazione[];
    setEvaluations: (input: Valutazione[] | ((prev: Valutazione[]) => Valutazione[])) => void;
    competencyEvaluations: ValutazioneCompetenza[];
    setCompetencyEvaluations: (input: ValutazioneCompetenza[] | ((prev: ValutazioneCompetenza[]) => ValutazioneCompetenza[])) => void;
    userClasses: string[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
    isModalMode?: boolean;
    initialClass?: string;
    initialStudentId?: string;
    onClearInitialStudent?: () => void;
    onOpenInclusionPlanEditor: (student: Studente) => void;
    showGuidanceTips: boolean;
    lessons: Record<string, Lezione>;
    register?: RegisterEntry[];
}

export interface LiveAssistantProps {
    students: Studente[];
    evaluations: Valutazione[];
    slots: Record<string, Slot>;
    lessons: Record<string, Lezione>;
    pianiInclusione: Record<string, PianoInclusione>;
    knowledgeBase: KnowledgeBaseEntry[];
    onNavigate: (view: View, context?: NavigationParams) => void;
    onCreateEvent: (event: Omit<EventoCalendario, 'id'>) => void;
    onScheduleLesson: (data: LessonScheduleInput) => void;
    onAddEvaluation: (data: EvaluationInput) => void;
    onCreateUda: (data: UdaCreateInput) => void;
    onAddNote: (data: { note: string; studentName?: string; }) => void;
    onMarkAttendance: (data: { studentName: string; status: string; }) => void;
    onLoadDemoData: () => void;
    isModalMode?: boolean;
    lessonContext?: NavigationParams;
    userContext?: UserProfile | null;
}

export interface DidatticaInclusivaProps {
    students: Studente[];
    pianiInclusione: Record<string, PianoInclusione>;
    onSavePiano: (piano: PianoInclusione) => void;
    onDeletePiano: (id: string) => void;
    aiSettings: AiSettings;
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    studentToEdit?: Studente;
    onClearStudentToEdit?: () => void;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    showGuidanceTips: boolean;
    onAiProcessing: (processing: boolean) => void;
}

export interface SettingsProps {
    settings: TimetableSettings;
    themeState: AppThemeState;
    aiSettings: AiSettings;
    onSaveSettings: (s: TimetableSettings) => void;
    onSaveTheme: (t: AppThemeState) => void;
    onSaveAiSettings: (s: AiSettings) => void;
    onExportData: () => void;
    onImportData: (file: File) => void;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    onDownloadDemoData: () => void;
    onCleanDemoData: () => void;
    backupState: BackupState;
    onRestoreFromBackup: () => void;
    onLogout: () => void;
    installPrompt: BeforeInstallPromptEvent | null;
    onInstallApp: () => void;
    onEnterStudentMode: () => void;
    driveState: DriveSyncState;
    onConnectDrive: () => void;
    onDisconnectDrive: () => void;
    onSyncToDrive: () => void;
    onRestoreFromDrive: () => void;
    onConfigureDrive: (clientId: string, apiKey?: string) => void;
    onSelectBackupFolder: (apiKey: string) => Promise<{ id: string; name: string } | null>;
    onCreateAppFolder: () => Promise<{ id: string; name: string }>; // FIX: Changed onCreateBackupFolder to onCreateAppFolder
    onClose: () => void;
    onOpenBackupInfo: () => void;
}

export interface ClassroomViewProps {
    draftKey: string;
    draftEntry: RegisterEntry;
    students: Studente[];
    lessons: Record<string, Lezione>;
    knowledgeBase: KnowledgeBaseEntry[];
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    onUpdateDraftEntry: (key: string, updates: Partial<RegisterEntry>) => void;
    onFinalizeRegister: (key: string) => void;
    onReopenRegister?: (key: string) => void;
    onCloseView: () => void;
    settings: TimetableSettings;
    onSaveOralEvaluation: (data: EvaluationInput) => void;
    onOpenStudentActionMenu?: (student: Studente, anchorEl: HTMLElement) => void;
    onOpenAulaTool?: (tool: string) => void;
    onPromoteImpromptuLesson?: (lesson: Lezione) => void;
    onOpenLiveAssistant: () => void;
    setStudentProfileContext?: (student: Studente | null) => void;
    onNavigate: (view: View, context?: NavigationParams) => void;
}

export interface LessonsPageProps {
    lessons: Lezione[];
    uda: Uda[];
    knowledgeBase: KnowledgeBaseEntry[];
    userClasses: string[];
    onViewLesson: (lesson: Lezione | null) => void;
    onAddLessons: (lessons: Lezione[]) => void;
    onUpdateLesson: (lesson: Lezione) => void;
    onStartClassroom: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
    aiSettings: AiSettings;
    setIsLoadingModalOpen: (open: boolean) => void;
    setLoadingModalMessage: (msg: string) => void;
    slots: Record<string, Slot>;
    onScheduleLesson: (data: LessonScheduleInput) => void;
    curricula?: CurriculumSubject[];
    settings?: TimetableSettings;
}

export interface RegisterViewProps {
    entries: RegisterEntry[];
    lessons: Record<string, Lezione>;
    students: Studente[];
    isModalMode?: boolean;
    initialClass?: string;
}

export interface UdaPlannerProps {
    uda: Uda[];
    onSaveUda: (uda: Uda) => void;
    onDeleteUda: (id: string) => void;
    lessons: Record<string, Lezione>;
    onUpdateUdaLessons?: (udaId: string, lessons: Lezione[]) => void;
    aiSettings: AiSettings;
    knowledgeBase: KnowledgeBaseEntry[];
    competenze: Competenza[];
    settings: TimetableSettings;
    onSaveReport: (report: Report) => void;
    onNavigate: (view: View) => void;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    showGuidanceTips: boolean;
    setIsLoadingModalOpen: (open: boolean) => void;
    setLoadingModalMessage: (msg: string) => void;
    eventi: EventoCalendario[];
    onAddLessons: (lessons: Lezione[]) => void;
    onSaveEvent: (event: EventoCalendario) => void;
    curricula: CurriculumSubject[];
}

export interface KnowledgeBaseProps {
    knowledgeBase: KnowledgeBaseEntry[];
    setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBaseEntry[]>>;
    corpora: Corpus[];
    setCorpora: React.Dispatch<React.SetStateAction<Corpus[]>>;
    aiSettings: AiSettings;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    settings: TimetableSettings;
    showGuidanceTips: boolean;
}

export interface ProgettazioneHubProps {
    onNavigate: (view: View, context?: NavigationParams) => void;
    uda: Uda[];
    events: EventoCalendario[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
    onSaveUda: (uda: Uda) => void;
    onAddLessons: (lessons: Lezione[]) => void;
    onSaveReport: (report: Report) => void;
    onSaveEvent: (event: EventoCalendario) => void;
    knowledgeBase: KnowledgeBaseEntry[];
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    showGuidanceTips: boolean;
    setIsLoadingModalOpen: (open: boolean) => void;
    setLoadingModalMessage: (msg: string) => void;
    students: Studente[];
    pianiInclusione: Record<string, PianoInclusione>;
    onUpdateCompetencies?: (competenze: Competenza[]) => void;
    curricula: CurriculumSubject[];
}

export interface HelpModalProps {
    onClose: () => void;
    onNavigate: (view: View) => void;
    aiSettings: AiSettings;
    setIsLoadingModalOpen: (open: boolean) => void;
    setLoadingModalMessage: (msg: string) => void;
}

export interface PianoInclusioneEditorProps {
    student: Studente;
    existingPiano?: PianoInclusione;
    onClose: () => void;
    onSave: (piano: PianoInclusione) => void;
    onDeletePiano: (id: string) => void;
    aiSettings: AiSettings;
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export interface StudioProps {
    corpora: Corpus[];
    knowledgeBase: KnowledgeBaseEntry[];
    setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBaseEntry[]>>;
    aiSettings: AiSettings;
    onOpenCreateLesson: (content: { title: string; htmlContent: string }) => void;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    showGuidanceTips: boolean;
    onAiProcessing: (processing: boolean) => void;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'open_ended';

export interface LiveAssistantModalProps extends LiveAssistantProps {
    onClose: () => void;
}

export interface BackupInfoModalProps {
    onClose: () => void;
}

export type TipoEvento = 'impegno' | 'scadenza' | 'consiglio' | 'formazione';

export interface VocalAssistantGuide {
    title: string;
    sections: { title: string; commands: string[] }[];
}

export interface BrochureContent {
    brochureTitle: string;
    introduction: string;
    useCases: { title: string; benefits: string[] }[];
    technicalGuarantees: { title: string; content: string };
    roadmap: { title: string; items: { title: string; description: string }[] };
    callToAction: string;
}

export interface FaqItem {
    q: string;
    a: string;
}

export interface EssayContent {
    title: string;
    content: string;
}

export interface TechnicalDocumentContent {
    title: string;
    specs: string[];
}

// --- EXTENDED DATA STATE FOR TESTING ---
// Legacy ExtendedDataState removed. Use AppState for comprehensive state representation.


