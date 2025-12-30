
import { create } from 'zustand';
import type { Modals, Lezione, SyncConflictData } from '../types';

// Definizione locale di UIActions e UIState (non esistono in types.ts)
export interface UIActions {
    toggleModal: (modalKey: keyof Modals, value?: boolean) => void;
    setLoading: (isOpen: boolean, message?: string) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    clearToast: () => void;
    setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
    setCanShowInstallPrompt: (can: boolean) => void;
    setIsGlobalAiLoading: (loading: boolean) => void;
    setNavigationHistory: (history: { view: View; context: unknown }[]) => void;
    addNavigationEntry: (entry: { view: View; context: unknown }) => void;
    popNavigationEntry: () => void;
    clearNavigationHistory: () => void;
    setBackupState: (stateOrFn: { status: 'synced' | 'drive_pending' | 'error'; lastBackup: Date | null } | ((prev: { status: 'synced' | 'drive_pending' | 'error'; lastBackup: Date | null }) => { status: 'synced' | 'drive_pending' | 'error'; lastBackup: Date | null })) => void;
    setDriveSyncState: (stateOrFn: { isAuthenticated: boolean; isSyncing: boolean; lastSyncTime: string | Date | null; error?: string } | ((prev: { isAuthenticated: boolean; isSyncing: boolean; lastSyncTime: string | Date | null; error?: string }) => { isAuthenticated: boolean; isSyncing: boolean; lastSyncTime: string | Date | null; error?: string })) => void;
    setIsRestoring: (value: boolean) => void;
    setCircularAnalysisModal: (modal: { isOpen: boolean; url: string; title: string } | null) => void;
    setSyncConflictModal: (modal: { isOpen: boolean; data: SyncConflictData | null } | null) => void;
    setCreateLessonContext: (context: { isOpen: boolean; slotKey: string | null; lezione: Lezione | null } | null) => void;
    setEditingSlotKey: (key: string | null) => void;
    setActiveSlotKey: (key: string | null) => void;
    setLessonViewContext: (lesson: Lezione | null) => void;
    setIsVideoAnalysisOpen: (value: boolean) => void;
}

export interface UIState {
    modals: Modals & {
        toast: { message: string; type: 'success' | 'error' | 'info'; visible: boolean };
    };
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
    backupState: { status: 'synced' | 'drive_pending' | 'error'; lastBackup: Date | null };
    driveSyncState: { isAuthenticated: boolean; isSyncing: boolean; lastSyncTime: string | Date | null; error?: string };
    actions: UIActions;
}
// BeforeInstallPromptEvent può essere dichiarato globalmente se non esiste, oppure tipizzato come 'unknown' per compatibilità PWA
type BeforeInstallPromptEvent = unknown;







const initialModals = {
    isOperationsCenterOpen: false,
    isImageAnalysisOpen: false,
    isLiveAssistantModalOpen: false,
    isHelpOpen: false,
    isBackupInfoModalOpen: false,
    isYearTransitionOpen: false,
    isLoadingModalOpen: false,
    isVideoAnalysisOpen: false,
    isRestoring: false,
    circularAnalysisModal: null,
    syncConflictModal: null,
    createLessonContext: null,
    editingSlotKey: null,
    activeSlotKey: null,
    lessonViewContext: null,
    loadingModalMessage: '',
    toast: { message: '', type: 'info', visible: false },
    // Dummy setters for Modals interface
    setCreateLessonContext: () => {},
    setLessonViewContext: () => {},
    setIsLiveAssistantModalOpen: () => {},
    setIsOperationsCenterOpen: () => {},
    setIsImageAnalysisOpen: () => {},
    setIsHelpOpen: () => {},
    setCircularAnalysisModal: () => {},
    setIsLoadingModalOpen: () => {},
    setLoadingModalMessage: () => {},
    setEditingSlotKey: () => {},
    setActiveSlotKey: () => {},
    setIsBackupInfoModalOpen: () => {},
    setSyncConflictModal: () => {},
    setIsYearTransitionOpen: () => {},
    setIsVideoAnalysisOpen: () => {},
    setIsRestoring: () => {},
    setNotifiche: () => {},
} as Modals & { toast: { message: string; type: 'success' | 'error' | 'info'; visible: boolean } };

export const useUIStore = create<UIState>((set: (fn: (state: UIState) => Partial<UIState> | UIState) => void) => ({
    modals: { ...initialModals },
    circularAnalysisModal: null,
    syncConflictModal: null,
    createLessonContext: null,
    editingSlotKey: null,
    activeSlotKey: null,
    lessonViewContext: null,
    loadingModalMessage: '',
    toast: null,
    installPrompt: null,
    canShowInstallPrompt: false,
    isGlobalAiLoading: false,
    navigationHistory: [],
    backupState: { status: 'synced', lastBackup: null },
    driveSyncState: { isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined },
    actions: {
        toggleModal: (modalKey: keyof Modals, value?: boolean) => set((state: UIState) => ({
            modals: { ...state.modals, [modalKey]: typeof value === 'boolean' ? value : !state.modals[modalKey] }
        })),
        setLoading: (isOpen: boolean, message?: string) => set((state: UIState) => ({
            modals: { ...state.modals, isLoadingModalOpen: isOpen, loadingModalMessage: message ?? state.modals.loadingModalMessage },
            loadingModalMessage: message ?? state.loadingModalMessage
        })),
        showToast: (message: string, type: 'success' | 'error' | 'info' = 'info') => set((state: UIState) => ({
            modals: { ...state.modals, toast: { message, type, visible: true } },
            toast: { message, type, visible: true }
        })),
        clearToast: () => set((state: UIState) => ({
            modals: { ...state.modals, toast: { message: '', type: 'info', visible: false } },
            toast: { message: '', type: 'info', visible: false }
        })),
        setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => set(() => ({ installPrompt: prompt })),
        setCanShowInstallPrompt: (can: boolean) => set(() => ({ canShowInstallPrompt: can })),
        setIsGlobalAiLoading: (loading: boolean) => set(() => ({ isGlobalAiLoading: loading })),
        setNavigationHistory: (history: { view: string; context: unknown }[]) => set(() => ({ navigationHistory: history })),
        addNavigationEntry: (entry: { view: string; context: unknown }) => set((state: UIState) => ({ navigationHistory: [...state.navigationHistory, entry] })),
        popNavigationEntry: () => set((state: UIState) => ({ navigationHistory: state.navigationHistory.slice(0, -1) })),
        clearNavigationHistory: () => set(() => ({ navigationHistory: [] })),
        setBackupState: (stateOrFn: { status: string; lastBackup: Date | null } | ((prev: { status: string; lastBackup: Date | null }) => { status: string; lastBackup: Date | null })) => set((state: UIState) => ({ backupState: typeof stateOrFn === 'function' ? stateOrFn(state.backupState) : stateOrFn })),
        setDriveSyncState: (stateOrFn: { isAuthenticated: boolean; isSyncing: boolean; lastSyncTime: string | null; error?: string } | ((prev: { isAuthenticated: boolean; isSyncing: boolean; lastSyncTime: string | null; error?: string }) => { isAuthenticated: boolean; isSyncing: boolean; lastSyncTime: string | null; error?: string })) => set((state: UIState) => ({ driveSyncState: typeof stateOrFn === 'function' ? stateOrFn(state.driveSyncState) : stateOrFn })),
        setIsRestoring: (value: boolean) => set((state: UIState) => ({ modals: { ...state.modals, isRestoring: value }, isRestoring: value })),
        setCircularAnalysisModal: (modal: { isOpen: boolean; url: string; title: string } | null) => set((state: UIState) => ({ modals: { ...state.modals, circularAnalysisModal: modal }, circularAnalysisModal: modal })),
        setSyncConflictModal: (modal: { isOpen: boolean; data: SyncConflictData | null } | null) => set((state: UIState) => ({ modals: { ...state.modals, syncConflictModal: modal }, syncConflictModal: modal })),
        setCreateLessonContext: (context: { isOpen: boolean; slotKey: string | null; lezione: Lezione | null } | null) => set((state: UIState) => ({ modals: { ...state.modals, createLessonContext: context }, createLessonContext: context })),
        setEditingSlotKey: (key: string | null) => set((state: UIState) => ({ modals: { ...state.modals, editingSlotKey: key }, editingSlotKey: key })),
        setActiveSlotKey: (key: string | null) => set((state: UIState) => ({ modals: { ...state.modals, activeSlotKey: key }, activeSlotKey: key })),
        setLessonViewContext: (lesson: Lezione | null) => set((state: UIState) => ({ modals: { ...state.modals, lessonViewContext: lesson }, lessonViewContext: lesson })),
        setIsVideoAnalysisOpen: (value: boolean) => set((state: UIState) => ({ modals: { ...state.modals, isVideoAnalysisOpen: value }, isVideoAnalysisOpen: value })),
    }
}));

// Getter legacy per compatibilità test (proxy su stato centralizzato modals)
// Getter legacy compatibili con i test: undefined se mai impostato, null se esplicitamente null, toast undefined se non visibile
const legacyKeys = [
    'circularAnalysisModal',
    'syncConflictModal',
    'createLessonContext',
    'editingSlotKey',
    'activeSlotKey',
    'lessonViewContext',
    'loadingModalMessage'
];
legacyKeys.forEach((key) => {
    Object.defineProperty(useUIStore.getState(), key, {
        get() {
            // Compatibilità: legge solo da modals
            return this.modals[key];
        },
        configurable: true,
        enumerable: true
    });
});

// Funzione di normalizzazione per compat test: copia i campi legacy root in modals
export function normalizeLegacyState(state: Partial<UIState>) {
    if (!state.modals) state.modals = {} as UIState['modals'];
    legacyKeys.forEach((key) => {
        if (key in state) {
            // @ts-expect-error: dynamic assignment for test normalization
            (state.modals as unknown)[key] = (state as unknown)[key];
        }
    });
    if ('toast' in state) {
        // @ts-expect-error: dynamic assignment for test normalization
        (state.modals as unknown).toast = (state as unknown).toast;
    }
    return state;
}
// Toast: null se non visibile o mai impostato, oggetto toast se visibile o con messaggio
Object.defineProperty(useUIStore.getState(), 'toast', {
    get() {
        const t = this.modals.toast;
        if (!t || (!t.visible && !t.message)) return null;
        return t;
    },
    configurable: true,
    enumerable: true
});
