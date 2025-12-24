
import { useEffect, useRef } from 'react';
import { saveKbContentToIndexedDB } from '../services/indexedDbService.ts';
import { saveBackup } from '../services/backupService.ts';
import { KnowledgeBaseEntry } from '../types.ts';

/**
 * Middleware di Persistenza Unificato.
 * Gestisce il salvataggio automatico su IndexedDB e previene conflitti durante il ripristino.
 */
export const usePersistence = (isDataLoaded: boolean) => {
    const storesRef = useRef<{ useDataStore: any; useSettingsStore: any; useUIStore: any } | null>(null);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSavingRef = useRef(false);

    // Lazy load stores inside the hook to ensure React context is ready
    useEffect(() => {
        Promise.all([
            import('../stores/useDataStore.ts'),
            import('../stores/useSettingsStore.ts'),
            import('../stores/useUIStore.ts')
        ]).then(([data, settings, ui]) => {
            storesRef.current = {
                useDataStore: data.useDataStore,
                useSettingsStore: settings.useSettingsStore,
                useUIStore: ui.useUIStore
            };
        }).catch(err => {
            console.error('Failed to load stores for persistence:', err);
        });
    }, []);

    useEffect(() => {
        // Wait until stores are loaded
        if (!storesRef.current) return;
        
        const { useDataStore, useSettingsStore, useUIStore } = storesRef.current;
        
        // Safety check: ensure store functions exist
        if (typeof useDataStore !== 'function' || typeof useSettingsStore !== 'function' || typeof useUIStore !== 'function') {
            return;
        }
        
        let setBackupState: any;
        let isRestoring: boolean;
        
        try {
            setBackupState = useUIStore(state => state.actions?.setBackupState);
            isRestoring = useUIStore(state => state.modals?.isRestoring) ?? false;
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
                // IndexedDB fallisce con errore "could not be cloned" se rileva funzioni nell'oggetto.
                const { actions: _dataActions, ...dataStateRaw } = useDataStore.getState();
                const { actions: _settingsActions, ...settingsStateRaw } = useSettingsStore.getState();
                const { actions: _uiActions, ...uiStateRaw } = useUIStore.getState();

                // Create clean, serializable versions of states
                const dataState = {
                    ...dataStateRaw,
                    // Convert Set to Array for serialization
                    dismissedSuggestions: Array.from(dataStateRaw.dismissedSuggestions),
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
                    // Note: modals state should not be persisted directly as it's runtime UI state.
                };

                // 1. Persistenza contenuti pesanti (Binary/Text) in store dedicato
                if (dataState.knowledgeBase.length > 0) {
                    await saveKbContentToIndexedDB(dataState.knowledgeBase);
                }

                // 2. Preparazione snapshot leggero per il backup principale
                const lightKb = dataState.knowledgeBase.map((kb: KnowledgeBaseEntry) => ({
                    ...kb,
                    content: '',
                    htmlContent: '',
                    fileContent: undefined
                }));

                const backupPayload = {
                    ...dataState,
                    knowledgeBase: lightKb,
                    settings: settingsState.settings,
                    aiSettings: settingsState.aiSettings,
                    themeState: settingsState.themeState,
                    // Include UIStore persistent states directly into the top-level payload for comprehensive backup
                    installPrompt: uiState.installPrompt,
                    canShowInstallPrompt: uiState.canShowInstallPrompt,
                    isGlobalAiLoading: uiState.isGlobalAiLoading,
                    navigationHistory: uiState.navigationHistory,
                    backupState: uiState.backupState,
                    driveSyncState: uiState.driveSyncState,
                };

                await saveBackup(backupPayload);
                setBackupState({ status: 'synced', lastBackup: new Date() });
            } catch (error) {
                console.error("Auto-save Bridge failed:", error);
                if (storesRef.current) {
                    const setBackupState = storesRef.current.useUIStore(state => state.actions.setBackupState);
                    setBackupState({ status: 'error' });
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
        const unsubData = useDataStore.subscribe(triggerDebouncedSave);
        const unsubSettings = useSettingsStore.subscribe(triggerDebouncedSave);
        // Explicitly subscribe to UI states that need to be persisted
        const unsubUi = useUIStore.subscribe(triggerDebouncedSave);

        return () => {
            unsubData();
            unsubSettings();
            unsubUi();
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [isDataLoaded]);
};
