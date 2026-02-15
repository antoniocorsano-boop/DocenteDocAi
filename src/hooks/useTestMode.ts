// MD3 Gold Compliant
// Hook per gestione modalità test
// Audit: febbraio 2026

import { useCallback, useMemo } from 'react';
import { useStudentStore } from '../stores/useStudentStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';
import { useUIStore } from '../stores/useUIStore';
import { useSettingsStore } from '../stores/useSettingsStore';

interface UseTestModeReturn {
  isTestMode: boolean;
  loadTestData: () => void;
  cleanTestData: () => void;
}

/**
 * Hook per gestire la modalità test
 * Permette di caricare e pulire dati demo per test E2E
 *
 * @returns Oggetto con stato e funzioni per gestione test mode
 */
export const useTestMode = (): UseTestModeReturn => {
  // Rileva modalità test
  const isTestMode = useMemo(() => {
    const isWindowTestMode = typeof window !== 'undefined' && (window as { __TEST_MODE?: boolean }).__TEST_MODE === true;
    const isEnvTestMode = (import.meta as ImportMeta).env?.VITE_TEST_MODE === 'true';
    return isWindowTestMode || isEnvTestMode;
  }, []);

  // Accesso agli stores
  const { actions: studentActions } = useStudentStore();
  const { actions: academicActions } = useAcademicStore();
  const { actions: systemActions } = useSystemStore();
  const { actions: uiActions } = useUIStore();
  const { actions: settingsActions } = useSettingsStore();

  /**
   * Carica dati demo per modalità test
   */
  const loadTestData = useCallback(() => {
    console.info('[useTestMode] Loading test data');

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
    import('../services/demoData.ts')
      .then(module => {
        studentActions.loadFromBackup(module.DEMO_DATA as any);
        academicActions.loadFromBackup(module.DEMO_DATA as any);
        systemActions.loadFromBackup(module.DEMO_DATA as any);
      })
      .catch(e => {
        console.warn('[useTestMode] Failed to load demo data:', e);
      });
  }, [studentActions, academicActions, systemActions, settingsActions, uiActions]);

  /**
   * Pulisce dati demo per modalità test
   */
  const cleanTestData = useCallback(() => {
    console.info('[useTestMode] Cleaning test data');

    // Reset tutti gli stores
    studentActions.reset?.();
    academicActions.reset?.();
    systemActions.reset?.();
    settingsActions.reset?.();
    uiActions.reset?.();
  }, [studentActions, academicActions, systemActions, settingsActions, uiActions]);

  return {
    isTestMode,
    loadTestData,
    cleanTestData
  };
};

export default useTestMode;
