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
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePersistence = (isDataLoaded: boolean) => {
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSavingRef = useRef(false);
    // Emergency stabilization: add dirty-check and rate limit
    const lastSavedDataRef = useRef<any>(null);
    const lastSaveTimeRef = useRef<number>(0);
    const SAVE_DEBOUNCE_MS = 1000;
    const SAVE_RATE_LIMIT_MS = 5000;

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
            if (isSavingRef.current) {
                console.log('[usePersistence] Save already in progress, skipping');
                return;
            }
            // Dirty-check and rate limit
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { actions: _studentActions, ...studentStateRaw } = useStudentStore.getState();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { actions: _academicActions, ...academicStateRaw } = useAcademicStore.getState();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { actions: _systemActions, ...systemStateRaw } = useSystemStore.getState();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { actions: _settingsActions, ...settingsStateRaw } = useSettingsStore.getState();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { actions: uiActions, ...uiStateRaw } = useUIStore.getState();

            // Create clean, serializable versions of states
            const studentState = { ...studentStateRaw };
            const academicState = { ...academicStateRaw };
            const systemState = {
                ...systemStateRaw,
                dismissedSuggestions: Array.from(systemStateRaw.dismissedSuggestions || []),
            };
            const settingsState = { ...settingsStateRaw };
            const uiState = {
                installPrompt: null,
                canShowInstallPrompt: uiStateRaw.canShowInstallPrompt,
                isGlobalAiLoading: uiStateRaw.isGlobalAiLoading,
                navigationHistory: uiStateRaw.navigationHistory,
                backupState: uiStateRaw.backupState,
                driveSyncState: uiStateRaw.driveSyncState,
            };

            // Prepare backup payload for dirty-check
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
                installPrompt: uiState.installPrompt as any,
                canShowInstallPrompt: uiState.canShowInstallPrompt,
                isGlobalAiLoading: uiState.isGlobalAiLoading,
                navigationHistory: uiState.navigationHistory,
                backupState: uiState.backupState,
                driveSyncState: uiState.driveSyncState,
            } as any;

            const now = Date.now();
            const lastSavedData = lastSavedDataRef.current;
            const lastSaveTime = lastSaveTimeRef.current;
            const isDirty = JSON.stringify(backupPayload) !== JSON.stringify(lastSavedData);
            const isRateLimited = now - lastSaveTime < SAVE_RATE_LIMIT_MS;
            if (!isDirty) {
                console.log('[usePersistence] No changes detected, skipping save');
                return;
            }
            if (isRateLimited) {
                console.log('[usePersistence] Save rate-limited, skipping save');
                return;
            }
            isSavingRef.current = true;
            try {
                console.log('[usePersistence] Starting save operation...');
                // 1. Persist heavy KB content
                if (systemState.knowledgeBase && systemState.knowledgeBase.length > 0) {
                    console.log('[usePersistence] Saving KB content to IndexedDB...');
                    await saveKbContentToIndexedDB(systemState.knowledgeBase);
                }
                // 2. Save backup
                console.log('[usePersistence] Saving backup...');
                await saveBackup(backupPayload);
                lastSavedDataRef.current = backupPayload;
                lastSaveTimeRef.current = Date.now();
                console.log('[usePersistence] Save operation completed successfully');
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
            console.log('[usePersistence] Save triggered, scheduling debounced save...');
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(() => {
                console.log('[usePersistence] Executing debounced save...');
                handleSave();
            }, SAVE_DEBOUNCE_MS);
        };

        // Sottoscrizione ai cambiamenti degli store core
        const unsubStudent = useStudentStore.subscribe(() => {
            console.log('[usePersistence] Student store changed, triggering save');
            triggerDebouncedSave();
        });
        const unsubAcademic = useAcademicStore.subscribe(() => {
            console.log('[usePersistence] Academic store changed, triggering save');
            triggerDebouncedSave();
        });
        const unsubSystem = useSystemStore.subscribe(() => {
            console.log('[usePersistence] System store changed, triggering save');
            triggerDebouncedSave();
        });
        const unsubSettings = useSettingsStore.subscribe(() => {
            console.log('[usePersistence] Settings store changed, triggering save');
            triggerDebouncedSave();
        });
        
        // Don't subscribe to UI store changes to avoid loops
        // const unsubUi = useUIStore.subscribe(triggerDebouncedSave);

        return () => {
            unsubStudent();
            unsubAcademic();
            unsubSystem();
            unsubSettings();
            // unsubUi(); // Disabled to prevent loops
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [isDataLoaded]);
};

