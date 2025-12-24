import { create } from 'zustand';
import { TimetableSettings, AiSettings, AppThemeState } from '../types';
import { DEFAULT_TIMETABLE_SETTINGS } from '../constants';

interface SettingsState {
    settings: TimetableSettings;
    aiSettings: AiSettings;
    themeState: AppThemeState;
    actions: {
        setSettings: (value: TimetableSettings | ((prev: TimetableSettings) => TimetableSettings)) => void;
        updateSettings: (partial: Partial<TimetableSettings>) => void;
        setAiSettings: (value: AiSettings | ((prev: AiSettings) => AiSettings)) => void;
        setThemeState: (value: AppThemeState | ((prev: AppThemeState) => AppThemeState)) => void;
        loadFromBackup: (data: Partial<SettingsState>) => void;
        reset: () => void;
    }
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: DEFAULT_TIMETABLE_SETTINGS,
    aiSettings: { model: 'gemini-3-flash-preview' },
    themeState: { mode: 'light', customizationName: 'M3 Default' },

    actions: {
        setSettings: (value) => set((state) => ({
            settings: typeof value === 'function' ? value(state.settings) : value
        })),
        updateSettings: (partial) => set((state) => ({
            settings: { ...state.settings, ...partial }
        })),
        setAiSettings: (value) => set((state) => ({
            aiSettings: typeof value === 'function' ? value(state.aiSettings) : value
        })),
        setThemeState: (value) => set((state) => ({
            themeState: typeof value === 'function' ? value(state.themeState) : value
        })),
        loadFromBackup: (data) => set((state) => ({
            ...state,
            settings: data.settings || state.settings,
            aiSettings: data.aiSettings || state.aiSettings,
            themeState: data.themeState || state.themeState
        })),
        reset: () => set({
            settings: DEFAULT_TIMETABLE_SETTINGS,
            aiSettings: { model: 'gemini-3-flash-preview' },
            themeState: { mode: 'light', customizationName: 'M3 Default' }
        })
    }
}));
