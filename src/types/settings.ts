// Settings-related types

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

export interface TeachingAssignment {
    classId: string;
    subjectId: string;
    hoursPerWeek: number;
}

export interface Competenza {
    id: string;
    nome: string;
    descrizione?: string;
    area: string;
}

export interface AiSettings {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt?: string;
}

export interface AppThemeState {
    mode: 'light' | 'dark' | 'system';
    visualStyle: string;
    customizationName: string;
    customColors?: {
        primary?: string;
        secondary?: string;
        tertiary?: string;
    };
    glassBlur?: number;
    fontScale?: number;
    contrastLevel?: number;
    radiusMultiplier?: number;
}

export interface SettingsState {
    settings: TimetableSettings;
    aiSettings: AiSettings;
    themeState: AppThemeState;
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

export interface DriveSyncState {
    isAuthenticated: boolean;
    isSyncing: boolean;
    lastSyncTime: Date | null | string;
    error?: string;
}
