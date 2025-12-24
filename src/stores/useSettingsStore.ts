
import { create } from 'zustand';
import { TimetableSettings, AiSettings, AppThemeState } from '../types.ts';
import { DEFAULT_TIMETABLE_SETTINGS } from '../constants.ts';

interface SettingsState {
    settings: TimetableSettings;
    aiSettings: AiSettings;
    themeState: AppThemeState;

    actions: {
        setSettings: (value: TimetableSettings | ((prev: TimetableSettings) => TimetableSettings)) => void;
        updateSettings: (updates: Partial<TimetableSettings>) => void;
        setAiSettings: (value: AiSettings | ((prev: AiSettings) => AiSettings)) => void;
        setThemeState: (value: AppThemeState | ((prev: AppThemeState) => AppThemeState)) => void;
        loadFromBackup: (data: Partial<SettingsState>) => void;
        reset: () => void;
    }
}

// Lazy initialization wrapper to prevent zustand from accessing React.useState before React is ready
let _useSettingsStoreInstance: any = null;

function initializeSettingsStore() {
    if (_useSettingsStoreInstance) return _useSettingsStoreInstance;
    
    _useSettingsStoreInstance = create<SettingsState>((set) => ({
    settings: DEFAULT_TIMETABLE_SETTINGS,
    aiSettings: { model: 'gemini-3-flash-preview' },
    themeState: { mode: 'light', customizationName: 'M3 Default' },

    actions: {
        setSettings: (value) => set((state) => ({
            settings: typeof value === 'function' ? value(state.settings) : value
        })),
        updateSettings: (updates) => set((state) => ({
            settings: { ...state.settings, ...updates }
        })),
        setAiSettings: (value) => set((state) => ({
            aiSettings: typeof value === 'function' ? value(state.aiSettings) : value
        })),
        setThemeState: (value) => set((state) => ({
            themeState: typeof value === 'function' ? value(state.themeState) : value
        })),
        loadFromBackup: (data) => set((state) => ({
            ...state,
            settings: {
                ...DEFAULT_TIMETABLE_SETTINGS,
                ...data.settings,
            },
            aiSettings: data.aiSettings || { model: 'gemini-3-flash-preview' },
            themeState: data.themeState || { mode: 'light', customizationName: 'M3 Default' }
        })),
        reset: () => set({
            settings: DEFAULT_TIMETABLE_SETTINGS,
            aiSettings: { model: 'gemini-3-flash-preview' },
            themeState: { mode: 'light', customizationName: 'M3 Default' }
        })
    }
}));
    
    return _useSettingsStoreInstance;
}

// Export proxy that lazily initializes the store
export const useSettingsStore = new Proxy({} as any, {
    get(target, prop) {
        const store = initializeSettingsStore();
        return store[prop];
    },
    apply(target, thisArg, args) {
        return initializeSettingsStore()(...args);
    }
});
