import { create } from 'zustand';
import { TimetableSettings, AiSettings, AppThemeState, SettingsState } from '../types';
import { DEFAULT_TIMETABLE_SETTINGS } from '../constants';

export interface SettingsActions {
    setSettings: (value: TimetableSettings | ((prev: TimetableSettings) => TimetableSettings)) => void;
    updateSettings: (partial: Partial<TimetableSettings>) => void;
    setAiSettings: (value: AiSettings | ((prev: AiSettings) => AiSettings)) => void;
    setThemeState: (value: AppThemeState | ((prev: AppThemeState) => AppThemeState)) => void;
    loadFromBackup: (data: Partial<SettingsState>) => void;
    reset: () => void;
}

export const useSettingsStore = create<SettingsState & { actions: SettingsActions }>((set) => ({
    settings: DEFAULT_TIMETABLE_SETTINGS,
    aiSettings: { model: 'gemini-3-flash-preview' },
    themeState: { 
        mode: 'light', 
        visualStyle: 'aura',
        customizationName: 'M3 Default',
        glassBlur: 30,
        radiusMultiplier: 1,
        uiMode: 'classic'  // Add default uiMode
    },

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
            themeState: data.themeState ? {
                ...data.themeState,
                uiMode: data.themeState.uiMode || 'classic'  // Safe migration: add uiMode if missing
            } : state.themeState
        })),
        reset: () => set({
            settings: DEFAULT_TIMETABLE_SETTINGS,
            aiSettings: { model: 'gemini-3-flash-preview' },
            themeState: { 
                mode: 'light', 
                visualStyle: 'aura',
                customizationName: 'M3 Default',
                glassBlur: 30,
                radiusMultiplier: 1,
                uiMode: 'classic'  // Add default uiMode to reset
            }
        })
    }
}));


