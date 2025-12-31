/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, useCallback } from 'react';
import { messages } from '../messages';
import { TimetableSettings, AiSettings, AppThemeState } from '../types';
import { AI_PROFILES } from '../constants';
import { generateThemeFromPrompt } from '../services/aiService';
import { useDebounce } from './useDebounce';

interface UseSettingsLogicProps {
    settings: TimetableSettings;
    onSaveSettings: (s: TimetableSettings) => void;
    aiSettings: AiSettings;
    onSaveAiSettings: (s: AiSettings) => void;
    themeState: AppThemeState;
    onSaveTheme: (t: AppThemeState) => void;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    onCleanDemoData: () => void;
}

export const useSettingsLogic = ({
    settings,
    onSaveSettings,
    aiSettings,
    onSaveAiSettings,
    themeState,
    onSaveTheme,
    showToast,
    onCleanDemoData
}: UseSettingsLogicProps) => {
    // Local State
    const [localSettings, setLocalSettings] = useState<TimetableSettings>(settings);
    const [localAiSettings, setLocalAiSettings] = useState<AiSettings>(aiSettings);
    const [themePrompt, setThemePrompt] = useState('');
    const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    // Debounce Settings
    const debouncedSettings = useDebounce(localSettings, 800);

    // Sync Props to State (when props change externally)
    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    useEffect(() => {
        setLocalAiSettings(aiSettings);
    }, [aiSettings]);

    // Save Settings when debounced value changes
    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        // Basic comparison to avoid saving if nothing changed
        if(JSON.stringify(debouncedSettings) !== JSON.stringify(settings)) {
             onSaveSettings(debouncedSettings);
             showToast(messages.toast.save, 'success'); 
        }
    }, [debouncedSettings, settings, onSaveSettings, showToast]);

    const handleChange = useCallback((field: keyof TimetableSettings, value: any) => {
        setLocalSettings(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleAiProfileChange = useCallback((profileKey: keyof typeof AI_PROFILES) => {
        const profile = AI_PROFILES[profileKey];
        const newSettings = { ...localAiSettings, model: profile.model };
        setLocalAiSettings(newSettings);
        onSaveAiSettings(newSettings);
        showToast(`${profile.label} attivato. ${profile.description}`, "info");
    }, [localAiSettings, onSaveAiSettings, showToast]);

    const handleResetAiCache = useCallback(() => {
        handleAiProfileChange('rapido');
        showToast(messages.toast.retry, 'info');
    }, [handleAiProfileChange, showToast]);

    const handleGenerateThemeFromPrompt = useCallback(async () => {
        if (!themePrompt.trim()) {
            showToast(messages.generic.error, 'error');
            return;
        }
        setIsGeneratingTheme(true);
        try {
            const generatedTheme = await generateThemeFromPrompt(aiSettings, themePrompt);
            onSaveTheme({
                mode: themeState.mode,
                customizationName: 'Custom',
                customColors: { primary: generatedTheme.primary, secondary: generatedTheme.secondary, tertiary: generatedTheme.tertiary },
                generatedName: generatedTheme.name,
                generatedColors: { primary: generatedTheme.primary, secondary: generatedTheme.secondary, tertiary: generatedTheme.tertiary },
            });
            showToast(messages.toast.save, 'success');
        } catch {
            showToast(messages.toast.error, 'error');
        } finally {
            setIsGeneratingTheme(false);
        }
    }, [aiSettings, themePrompt, themeState, onSaveTheme, showToast]);

    const performReset = useCallback(() => {
        onCleanDemoData();
        setIsResetModalOpen(false);
    }, [onCleanDemoData]);

    return {
        localSettings,
        localAiSettings,
        handleChange,
        handleAiProfileChange,
        handleResetAiCache,
        themePrompt,
        setThemePrompt,
        isGeneratingTheme,
        handleGenerateThemeFromPrompt,
        isResetModalOpen,
        setIsResetModalOpen,
        performReset
    };
};
