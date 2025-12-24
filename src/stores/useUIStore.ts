import { create } from 'zustand';
import { SyncConflictData, Lezione, BeforeInstallPromptEvent, View, Notifica, BackupState, DriveSyncState } from '../types';

// Define the shape of the UI State
interface UIState {
    // Modals Visibility Flags
    modals: {
        isOperationsCenterOpen: boolean;
        isImageAnalysisOpen: boolean;
        isLiveAssistantModalOpen: boolean;
        isHelpOpen: boolean;
        isBackupInfoModalOpen: boolean;
        isYearTransitionOpen: boolean;
        isLoadingModalOpen: boolean;
        isVideoAnalysisOpen: boolean;
        isRestoring: boolean; // NEW: Flag for restore operations
    };
    
    // Complex Modal Data
    circularAnalysisModal: { isOpen: boolean; url: string; title: string; } | null;
    syncConflictModal: SyncConflictData | null;
    createLessonContext: { title: string; htmlContent: string } | null;
    
    // Editor/Context States
    editingSlotKey: string | null;
    activeSlotKey: string | null;
    lessonViewContext: Lezione | null;
    
    // Feedback & System Status
    loadingModalMessage: string;
    toast: { message: string; type: 'success' | 'error' | 'info' } | null;

    // PWA & Global App State (Moved from useAppEngine, managed by UI Store)
    installPrompt: BeforeInstallPromptEvent | null;
    canShowInstallPrompt: boolean;
    isGlobalAiLoading: boolean;
    navigationHistory: { view: View; context: any | null }[];
    // Notifications and Backup/Drive State are now in DataStore and aggregated in AppState, not directly in UIStore
    backupState: BackupState;
    driveSyncState: DriveSyncState;

    // Actions
    actions: {
        toggleModal: (modalName: keyof UIState['modals'], value?: boolean) => void;
        setCircularAnalysisModal: (data: UIState['circularAnalysisModal']) => void;
        setSyncConflictModal: (data: UIState['syncConflictModal']) => void;
        setCreateLessonContext: (data: UIState['createLessonContext']) => void;
        setEditingSlotKey: (key: string | null) => void;
        setActiveSlotKey: (key: string | null) => void;
        setLessonViewContext: (lesson: Lezione | null) => void;
        setLoading: (isOpen: boolean, message?: string) => void;
        showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
        clearToast: () => void;
        setBackupState: (state: Partial<BackupState> | ((prev: BackupState) => Partial<BackupState>)) => void;
        setDriveSyncState: (state: Partial<DriveSyncState> | ((prev: DriveSyncState) => Partial<DriveSyncState>)) => void;
        setIsVideoAnalysisOpen: (value: boolean) => void;
        setIsRestoring: (value: boolean) => void; // NEW: Action to control isRestoring flag
        
        // PWA & Global App Actions (Moved from useAppEngine)
        setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
        setCanShowInstallPrompt: (canShow: boolean) => void;
        setIsGlobalAiLoading: (isLoading: boolean) => void;
        setNavigationHistory: (history: { view: View; context: any | null }[]) => void;
        addNavigationEntry: (entry: { view: View; context: any | null }) => void;
        popNavigationEntry: () => void;
        clearNavigationHistory: () => void;
        // setNotifiche action removed as notifiche moved to DataStore
    }
}

// Lazy initialization wrapper to prevent zustand from accessing React.useState before React is ready
let _useUIStoreInstance: any = null;

function initializeUIStore() {
    if (_useUIStoreInstance) return _useUIStoreInstance;
    
    // This code only runs when the store is actually accessed
    _useUIStoreInstance = create<UIState>((set) => ({
    // Initial State
    modals: {
        isOperationsCenterOpen: false,
        isImageAnalysisOpen: false,
        isLiveAssistantModalOpen: false,
        isHelpOpen: false,
        isBackupInfoModalOpen: false,
        isYearTransitionOpen: false,
        isLoadingModalOpen: false,
        isVideoAnalysisOpen: false,
        isRestoring: false, // NEW: Initial state for isRestoring
    },
    circularAnalysisModal: null,
    syncConflictModal: null,
    createLessonContext: null,
    editingSlotKey: null,
    activeSlotKey: null,
    lessonViewContext: null,
    loadingModalMessage: '',
    toast: null,
    
    // PWA & Global App State (Managed by UI Store)
    installPrompt: null,
    canShowInstallPrompt: false,
    isGlobalAiLoading: false,
    navigationHistory: [],
    backupState: { status: 'synced', lastBackup: null },
    driveSyncState: { isAuthenticated: false, isSyncing: false, lastSyncTime: null },


    actions: {
        toggleModal: (modalName, value) => set((state) => ({
            modals: {
                ...state.modals,
                [modalName]: value !== undefined ? value : !state.modals[modalName]
            }
        })),
        setCircularAnalysisModal: (data) => set({ circularAnalysisModal: data }),
        setSyncConflictModal: (data) => set({ syncConflictModal: data }),
        setCreateLessonContext: (data) => set({ createLessonContext: data }),
        setEditingSlotKey: (key) => set({ editingSlotKey: key }),
        setActiveSlotKey: (key) => set({ activeSlotKey: key }),
        setLessonViewContext: (lesson) => set({ lessonViewContext: lesson }),
        setLoading: (isOpen, message = '') => set((state) => ({
            modals: { ...state.modals, isLoadingModalOpen: isOpen },
            loadingModalMessage: message
        })),
        showToast: (message, type = 'info') => {
            set({ toast: { message, type } });
            setTimeout(() => {
                set({ toast: null });
            }, 3000);
        },
        clearToast: () => set({ toast: null }),
        setBackupState: (input) => set((state) => ({ 
            backupState: { ...state.backupState, ...(typeof input === 'function' ? input(state.backupState) : input) } 
        })),
        setDriveSyncState: (input) => set((state) => ({ 
            driveSyncState: { ...state.driveSyncState, ...(typeof input === 'function' ? input(state.driveSyncState) : input) } 
        })),
        setIsVideoAnalysisOpen: (value) => set((state) => ({
            modals: { ...state.modals, isVideoAnalysisOpen: value }
        })),
        setIsRestoring: (value) => set((state) => ({ // NEW: Action for isRestoring
            modals: { ...state.modals, isRestoring: value }
        })),

        // PWA & Global App Actions (Managed by UI Store)
        setInstallPrompt: (prompt) => set({ installPrompt: prompt }),
        setCanShowInstallPrompt: (canShow) => set({ canShowInstallPrompt: canShow }),
        setIsGlobalAiLoading: (isLoading) => set({ isGlobalAiLoading: isLoading }),
        setNavigationHistory: (history) => set({ navigationHistory: history }),
        addNavigationEntry: (entry) => set((state) => ({
            navigationHistory: [...state.navigationHistory, entry],
        })),
        popNavigationEntry: () => set((state) => ({
            navigationHistory: state.navigationHistory.slice(0, -1),
        })),
        clearNavigationHistory: () => set({ navigationHistory: [] }),
    }
}));
    
    return _useUIStoreInstance;
}

// Export proxy that lazily initializes the store
export const useUIStore = new Proxy({} as any, {
    get(target, prop) {
        const store = initializeUIStore();
        return store[prop];
    },
    apply(target, thisArg, args) {
        return initializeUIStore()(...args);
    }
});
