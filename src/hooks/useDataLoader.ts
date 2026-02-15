// MD3 Gold Compliant
// Hook per caricamento dati iniziali e ripristino da backup
// Audit: febbraio 2026

import { useState, useEffect, useCallback } from 'react';
import { useStudentStore } from '../stores/useStudentStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';
import { useUIStore } from '../stores/useUIStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { loadBackup } from '../services/backupService';
import { loadKbContentFromIndexedDB } from '../services/indexedDbService';
import { validateBackupData } from '../utils/dataValidator';

interface UseDataLoaderReturn {
  isDataLoaded: boolean;
  loadData: () => Promise<void>;
  error: Error | null;
}

/**
 * Hook per gestire il caricamento dei dati iniziali
 * Carica backup locale, dati demo, e KB da IndexedDB
 *
 * @param isTestMode - Se true, carica dati demo per test
 * @returns Oggetto con stato e funzioni per caricamento dati
 */
export const useDataLoader = (isTestMode: boolean = false): UseDataLoaderReturn => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Accesso agli stores
  const { actions: studentActions } = useStudentStore();
  const { actions: academicActions } = useAcademicStore();
  const { actions: systemActions, setKnowledgeBase } = useSystemStore();
  const { actions: uiActions } = useUIStore();
  const { actions: settingsActions } = useSettingsStore();

  /**
   * Carica i dati iniziali da backup locale o IndexedDB
   */
  const loadData = useCallback(async () => {
    try {
      setIsDataLoaded(false);
      uiActions.setIsRestoring(true);
      setError(null);

      // In modalità test: carica dati demo o backup test
      if (isTestMode) {
        console.info('[useDataLoader] Test mode detected — loading demo data');
        await loadDemoData();
        setIsDataLoaded(true);
        uiActions.setIsRestoring(false);
        return;
      }

      // Caricamento normale: backup locale
      const rawData = await loadBackup();
      const localData = rawData ? validateBackupData(rawData) : null;

      if (localData) {
        console.log('[useDataLoader] Valid backup data found, restoring...');

        // Dispatch agli stores di dominio
        studentActions.loadFromBackup(localData);
        academicActions.loadFromBackup(localData);
        systemActions.loadFromBackup(localData);

        // Dispatch allo store delle impostazioni
        settingsActions.loadFromBackup({
          settings: localData.settings,
          aiSettings: localData.aiSettings,
          themeState: localData.themeState
        });

        // Dispatch stati UI relativi
        uiActions.setBackupState(localData.backupState || { status: 'synced', lastBackup: null });
        uiActions.setDriveSyncState(
          localData.driveSyncState || {
            isAuthenticated: false,
            isSyncing: false,
            lastSyncTime: null,
            error: undefined
          }
        );
        uiActions.setNavigationHistory(localData.navigationHistory || []);

        // Non-serializzabile, sempre inizia da zero
        uiActions.setInstallPrompt(null);
        uiActions.setCanShowInstallPrompt(false);
        uiActions.setIsGlobalAiLoading(false);

        // Gestione KB pesanti da IndexedDB separatamente
        try {
          const kbContentMap = await loadKbContentFromIndexedDB();
          const fullKb = (localData.knowledgeBase || []).map((entry: any) => ({
            ...entry,
            ...(kbContentMap[entry.id] || {})
          }));
          setKnowledgeBase(fullKb);
        } catch (kbError) {
          console.warn('[useDataLoader] KB content load failed, using light data:', kbError);
        }
      } else {
        console.info('[useDataLoader] No backup data found, using empty state');
      }

      setIsDataLoaded(true);
      uiActions.setIsRestoring(false);
    } catch (err) {
      console.error('[useDataLoader] Failed to load data:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsDataLoaded(false);
      uiActions.setIsRestoring(false);
    }
  }, [
    isTestMode,
    studentActions,
    academicActions,
    systemActions,
    settingsActions,
    uiActions,
    setKnowledgeBase
  ]);

  /**
   * Carica dati demo per modalità test
   */
  const loadDemoData = async () => {
    try {
      // Utente base per test
      systemActions.setUser({ id: 'test-local', displayName: 'Test Teacher' } as any);
      settingsActions.loadFromBackup({});
      uiActions.setBackupState({ status: 'synced', lastBackup: null } as any);
      uiActions.setDriveSyncState({
        isAuthenticated: false,
        isSyncing: false,
        lastSyncTime: null,
        error: undefined
      } as any);
      uiActions.setNavigationHistory([]);
      uiActions.toggleModal('isLiveAssistantModalOpen', false);

      // Carica dati demo
      import('../services/demoData.ts').then(module => {
        studentActions.loadFromBackup(module.DEMO_DATA as any);
        academicActions.loadFromBackup(module.DEMO_DATA as any);
        systemActions.loadFromBackup(module.DEMO_DATA as any);
      });
    } catch (e) {
      console.warn('[useDataLoader] Failed to load demo data:', e);
    }
  };

  // Effetto per caricare i dati al mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    isDataLoaded,
    loadData,
    error
  };
};

export default useDataLoader;
