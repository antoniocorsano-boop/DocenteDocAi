// UI-related types

export type View =
    | 'home'
    | 'classroom'
    | 'register'
    | 'student'
    | 'settings'
    | 'calendar'
    | 'timetable'
    | 'analytics'
    | 'report'
    | 'help'
    | 'profile'
    | 'notifications'
    | 'search'
    | 'consiglio'
    | 'orientamento'
    | 'eportfolio'
    | 'live-assistant'
    | 'calendario';

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

export interface Modals {
    student: boolean;
    evaluation: boolean;
    competencyEvaluation: boolean;
    note: boolean;
    import: boolean;
    export: boolean;
    settings: boolean;
    help: boolean;
    aiAdvisor: boolean;
    notifications: boolean;
    createLesson: boolean;
    viewLesson: boolean;
    deleteConfirm: boolean;
    syncConflict: boolean;
    loading: boolean;
}

export interface HeaderProps {
    title: string;
    subtitle?: string;
    icon?: string;
    onBack?: () => void;
    actions?: React.ReactNode;
}

export interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    variant?: 'light' | 'dark';
}

export interface ChipInputListProps {
    label: string;
    items: string[];
    onAdd: (item: string) => void;
    onRemove: (index: number) => void;
    placeholder?: string;
    icon?: string;
}

export interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface BackupState {
    lastBackup: Date | null;
    isBackingUp: boolean;
    error: string | null;
}

export interface SyncConflictData {
    localVersion: unknown;
    remoteVersion: unknown;
    timestamp: string;
}

// Types from other modules (re-export for compatibility)
import type { Lezione } from './academic';
import type { DriveSyncState } from './settings';
export type { Lezione, DriveSyncState };
