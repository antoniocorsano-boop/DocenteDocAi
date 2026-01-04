/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { saveKbContentToIndexedDB } from '../services/indexedDbService.ts';
import { saveBackup } from '../services/backupService.ts';
import { KnowledgeBaseEntry, BackupPayload } from '../types.ts';

// Import stores directly to avoid dynamic import issues in tests and ensure reliability
import { useStudentStore } from '../stores/useStudentStore.ts';
import { useAcademicStore } from '../stores/useAcademicStore.ts';
import { useSystemStore } from '../stores/useSystemStore.ts';
import { useSettingsStore } from '../stores/useSettingsStore.ts';
import { useUIStore } from '../stores/useUIStore.ts';

/**
 * Middleware di Persistenza Unificato.
 * Gestisce il salvataggio automatico su IndexedDB e previene conflitti durante il ripristino.
 */
export const usePersistence = (isDataLoaded: boolean) => {
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSavingRef = useRef(false);

    useEffect(() => {
        // Safety check: ensure store functions exist and have getState
        if (!useStudentStore?.getState || !useAcademicStore?.getState || !useSystemStore?.getState || !useSettingsStore?.getState || !useUIStore?.getState) {
            return;
        }
        
        let setBackupState: any;
        let isRestoring: boolean;
        
        try {
            // Use getState() instead of hook syntax inside useEffect
            const uiState = useUIStore.getState();
            setBackupState = uiState.actions?.setBackupState;
            isRestoring = uiState.modals?.isRestoring ?? false;
        } catch (e) {
            console.error('Failed to access store state:', e);
            return;
        }

        // Non avviare salvataggi se i dati non sono pronti o è in corso un restore
        if (!isDataLoaded || !setBackupState || isRestoring) return;

        const handleSave = async () => {
            if (isSavingRef.current) return;
            isSavingRef.current = true;

            try {
                // CRITICAL FIX: Estraiamo solo i dati dagli store, ESCLUDENDO le funzioni (actions)
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                const { actions: _studentActions, ...studentStateRaw } = useStudentStore.getState();
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                const { actions: _academicActions, ...academicStateRaw } = useAcademicStore.getState();
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                const { actions: _systemActions, ...systemStateRaw } = useSystemStore.getState();
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                const { actions: _settingsActions, ...settingsStateRaw } = useSettingsStore.getState();
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                const { actions: uiActions, ...uiStateRaw } = useUIStore.getState();

                // Create clean, serializable versions of states
                const studentState = { ...studentStateRaw };
                const academicState = { ...academicStateRaw };
                const systemState = {
                    ...systemStateRaw,
                    // Convert Set to Array for serialization
                    dismissedSuggestions: Array.from(systemStateRaw.dismissedSuggestions || []),
                };
                const settingsState = { ...settingsStateRaw };
                const uiState = {
                    // Include PWA/global app states from UIStore
                    installPrompt: null, // Non-serializable (DOM Event), do not persist
                    canShowInstallPrompt: uiStateRaw.canShowInstallPrompt,
                    isGlobalAiLoading: uiStateRaw.isGlobalAiLoading,
                    navigationHistory: uiStateRaw.navigationHistory,
                    backupState: uiStateRaw.backupState,
                    driveSyncState: uiStateRaw.driveSyncState,
                };

                // 1. Persistenza contenuti pesanti (Binary/Text) in store dedicato
                if (systemState.knowledgeBase && systemState.knowledgeBase.length > 0) {
                    await saveKbContentToIndexedDB(systemState.knowledgeBase);
                }

                // 2. Preparazione snapshot leggero per il backup principale
                const lightKb = (systemState.knowledgeBase || []).map((kb: KnowledgeBaseEntry) => ({
                    ...kb,
                    content: '',
                    htmlContent: '',
                    fileContent: undefined
                }));

                const backupPayload: BackupPayload = {
                    ...studentState,
                    ...academicState,
                    ...systemState,
                    knowledgeBase: lightKb,
                    settings: settingsState.settings,
                    aiSettings: settingsState.aiSettings,
                    themeState: settingsState.themeState,
                    // Include UIStore persistent states directly into the top-level payload for comprehensive backup
                    installPrompt: uiState.installPrompt as any,
                    canShowInstallPrompt: uiState.canShowInstallPrompt,
                    isGlobalAiLoading: uiState.isGlobalAiLoading,
                    navigationHistory: uiState.navigationHistory,
                    backupState: uiState.backupState,
                    driveSyncState: uiState.driveSyncState,
                } as any;

                await saveBackup(backupPayload);
                if (uiActions?.setBackupState) {
                    uiActions.setBackupState({ status: 'synced', lastBackup: new Date().toISOString() });
                }
            } catch (error) {
                console.error("Auto-save Bridge failed:", error);
                const currentUiActions = useUIStore.getState().actions;
                if (currentUiActions?.setBackupState) {
                    currentUiActions.setBackupState({ status: 'error' });
                }
            } finally {
                isSavingRef.current = false;
            }
        };

        const triggerDebouncedSave = () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(handleSave, 2000);
        };

        // Sottoscrizione ai cambiamenti degli store core
        const unsubStudent = useStudentStore.subscribe(triggerDebouncedSave);
        const unsubAcademic = useAcademicStore.subscribe(triggerDebouncedSave);
        const unsubSystem = useSystemStore.subscribe(triggerDebouncedSave);
        const unsubSettings = useSettingsStore.subscribe(triggerDebouncedSave);
        // Explicitly subscribe to UI states that need to be persisted
        const unsubUi = useUIStore.subscribe(triggerDebouncedSave);

        return () => {
            unsubStudent();
            unsubAcademic();
            unsubSystem();
            unsubSettings();
            unsubUi();
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [isDataLoaded]);
};
