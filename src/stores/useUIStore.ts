import { create } from 'zustand';
import { SyncConflictData, Lezione, BeforeInstallPromptEvent, View, BackupState, DriveSyncState } from '../types';

interface UIState {
    modals: {
        isOperationsCenterOpen: boolean;
        isImageAnalysisOpen: boolean;
        isLiveAssistantModalOpen: boolean;
        isHelpOpen: boolean;
        isBackupInfoModalOpen: boolean;
        isYearTransitionOpen: boolean;
        isLoadingModalOpen: boolean;
        isVideoAnalysisOpen: boolean;
        isRestoring: boolean;
    };
    circularAnalysisModal: { isOpen: boolean; url: string; title: string; } | null;
    syncConflictModal: { isOpen: boolean; data: SyncConflictData | null } | null;
    createLessonContext: { isOpen: boolean; slotKey: string | null; lezione: Lezione | null };
    editingSlotKey: string | null;
    activeSlotKey: string | null;
    lessonViewContext: Lezione | null;
    loadingModalMessage: string;
    toast: { message: string; type: 'success' | 'error' | 'info'; visible: boolean };
    installPrompt: BeforeInstallPromptEvent | null;
    canShowInstallPrompt: boolean;
    isGlobalAiLoading: boolean;
    navigationHistory: { view: View; context: import('../types').NavigationParams | null }[];
    backupState: BackupState;
    driveSyncState: DriveSyncState;
    actions: {
        toggleModal: (modalKey: keyof UIState['modals'], value?: boolean) => void;
        setCircularAnalysisModal: (modal: UIState['circularAnalysisModal']) => void;
        setSyncConflictModal: (modal: UIState['syncConflictModal'] | null) => void;
        setCreateLessonContext: (context: UIState['createLessonContext']) => void;
        setEditingSlotKey: (key: string | null) => void;
        setActiveSlotKey: (key: string | null) => void;
        setLessonViewContext: (lesson: Lezione | null) => void;
        setIsLoadingModalOpen: (isOpen: boolean) => void;
        setLoadingModalMessage: (message: string) => void;
        setLoading: (isOpen: boolean, message?: string) => void;
        showToast: (message: string, type: 'success' | 'error' | 'info') => void;
        clearToast: () => void;
        setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
        setCanShowInstallPrompt: (can: boolean) => void;
        setIsGlobalAiLoading: (loading: boolean) => void;
        setNavigationHistory: (history: UIState['navigationHistory']) => void;
        addNavigationEntry: (entry: { view: View; context: import('../types').NavigationParams | null }) => void;
        popNavigationEntry: () => void;
        clearNavigationHistory: () => void;
        setBackupState: (state: BackupState | ((prev: BackupState) => BackupState)) => void;
        setDriveSyncState: (state: DriveSyncState | ((prev: DriveSyncState) => DriveSyncState)) => void;
        setIsVideoAnalysisOpen: (isOpen: boolean) => void;
        setIsRestoring: (value: boolean) => void;
    }
}

export const useUIStore = create<UIState>((set) => ({
    modals: {
        isOperationsCenterOpen: false,
        isImageAnalysisOpen: false,
        isLiveAssistantModalOpen: false,
        isHelpOpen: false,
        isBackupInfoModalOpen: false,
        isYearTransitionOpen: false,
        isLoadingModalOpen: false,
        isVideoAnalysisOpen: false,
        isRestoring: false,
    },
    circularAnalysisModal: null,
    syncConflictModal: null,
    createLessonContext: { isOpen: false, slotKey: null, lezione: null },
    editingSlotKey: null,
    activeSlotKey: null,
    lessonViewContext: null,
    loadingModalMessage: '',
    toast: { message: '', type: 'info', visible: false },
    installPrompt: null,
    canShowInstallPrompt: false,
    isGlobalAiLoading: false,
    navigationHistory: [],
    backupState: { status: 'synced', lastBackup: null },
    driveSyncState: { isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined },

    actions: {
        toggleModal: (modalKey, value) => {
            // Log persistente per debug apertura Assistant
            if (modalKey === 'isLiveAssistantModalOpen' && value === true) {
                if (typeof window !== 'undefined') {
                    const logs = JSON.parse(localStorage.getItem('assistant_open_debug') || '[]');
                    logs.push({
                        ts: new Date().toISOString(),
                        stack: new Error().stack,
                        location: window.location.href
                    });
                    localStorage.setItem('assistant_open_debug', JSON.stringify(logs.slice(-30)));
                    console.warn('[DEBUG][Assistant] Apertura modale Assistant tracciata', logs.at(-1));
                }
            }
            return set((state) => ({
                modals: { ...state.modals, [modalKey]: value !== undefined ? value : !state.modals[modalKey] }
            }));
        },
        setCircularAnalysisModal: (modal) => set({ circularAnalysisModal: modal }),
        setSyncConflictModal: (modal) => set({ syncConflictModal: modal }),
        setCreateLessonContext: (context) => set({ createLessonContext: context }),
        setEditingSlotKey: (key) => set({ editingSlotKey: key }),
        setActiveSlotKey: (key) => set({ activeSlotKey: key }),
        setLessonViewContext: (lesson) => set({ lessonViewContext: lesson }),
        setIsLoadingModalOpen: (isOpen) => set((state) => ({
            modals: { ...state.modals, isLoadingModalOpen: isOpen }
        })),
        setLoadingModalMessage: (message) => set({ loadingModalMessage: message }),
        setLoading: (isOpen, message) => set((state) => ({
            modals: { ...state.modals, isLoadingModalOpen: isOpen },
            loadingModalMessage: message || state.loadingModalMessage
        })),
        showToast: (message, type) => set({ toast: { message, type, visible: true } }),
        clearToast: () => set({ toast: { message: '', type: 'info', visible: false } }),
        setInstallPrompt: (prompt) => set({ installPrompt: prompt }),
        setCanShowInstallPrompt: (can) => set({ canShowInstallPrompt: can }),
        setIsGlobalAiLoading: (loading) => set({ isGlobalAiLoading: loading }),
        setNavigationHistory: (history) => set({ navigationHistory: history }),
        addNavigationEntry: (entry) => set((state) => ({
            navigationHistory: [...state.navigationHistory, entry]
        })),
        popNavigationEntry: () => set((state) => ({
            navigationHistory: state.navigationHistory.slice(0, -1),
        })),
        clearNavigationHistory: () => set({ navigationHistory: [] }),
        setBackupState: (stateOrFn) => set((state) => ({
            backupState: typeof stateOrFn === 'function' ? stateOrFn(state.backupState) : stateOrFn
        })),
        setDriveSyncState: (stateOrFn) => set((state) => ({
            driveSyncState: typeof stateOrFn === 'function' ? stateOrFn(state.driveSyncState) : stateOrFn
        })),
        setIsVideoAnalysisOpen: (isOpen) => set((state) => ({
            modals: { ...state.modals, isVideoAnalysisOpen: isOpen }
        })),
        setIsRestoring: (value) => set((state) => ({
            modals: { ...state.modals, isRestoring: value }
        })),
    }
}));
