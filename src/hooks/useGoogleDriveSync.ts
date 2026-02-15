// MD3 Gold Compliant
// Hook per gestione sincronizzazione Google Drive
// Audit: febbraio 2026

import { useCallback } from 'react';
import { useStudentStore } from '../stores/useStudentStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';
import { useUIStore } from '../stores/useUIStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import {
  initTokenClient,
  requestAccessToken,
  revokeAccessToken,
  uploadBackup,
  downloadBackup,
  getBackupMetadata,
  pickGoogleDriveFolder,
  createAppFolder
} from '../services/googleDriveService';
import { saveKbContentToIndexedDB } from '../services/indexedDbService';

interface UseGoogleDriveSyncReturn {
  handleConnectDrive: () => Promise<void>;
  handleDisconnectDrive: () => void;
  handleSyncToDrive: (folderId?: string) => Promise<void>;
  handleRestoreFromDrive: (folderId?: string) => Promise<void>;
  pickGoogleDriveFolder: () => Promise<string | null>;
  createAppFolder: () => Promise<string | null>;
  driveSyncState: {
    isAuthenticated: boolean;
    isSyncing: boolean;
    lastSyncTime: string | null;
    error: string | undefined;
  };
}

/**
 * Hook per gestire sincronizzazione Google Drive
 * Permette di connettere, sincronizzare e ripristinare backup da Google Drive
 *
 * @returns Oggetto con funzioni per gestione Google Drive
 */
export const useGoogleDriveSync = (): UseGoogleDriveSyncReturn => {
  // Accesso agli stores
  const { students, lessons, slots, evaluations, competencyEvals, uda, eventi, knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reportistica, feedSources, draftRegister, finalizedRegister, curricula, submissions, actions: studentActions } = useStudentStore();
  const { actions: academicActions } = useAcademicStore();
  const { actions: systemActions, setKnowledgeBase } = useSystemStore();
  const { actions: uiActions, driveSyncState } = useUIStore();
  const { actions: settingsActions, settings } = useSettingsStore();
  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

  /**
   * Connette a Google Drive
   */
  const handleConnectDrive = useCallback(async () => {
    const initialized = initTokenClient((tokenResponse) => {
      uiActions.setDriveSyncState(prev => ({ ...prev, isAuthenticated: true }));
      showToast('driveConnected', 'success');
    }, settings.googleClientId);

    if (initialized) {
      await requestAccessToken();
    } else {
      showToast('driveInitError', 'error');
    }
  }, [settings.googleClientId, uiActions, showToast]);

  /**
   * Disconnette da Google Drive
   */
  const handleDisconnectDrive = useCallback(() => {
    revokeAccessToken();
    uiActions.setDriveSyncState({
      isAuthenticated: false,
      isSyncing: false,
      lastSyncTime: null,
      error: undefined
    });
    showToast('driveDisconnected', 'info');
  }, [uiActions, showToast]);

  /**
   * Sincronizza con Google Drive
   */
  const handleSyncToDrive = useCallback(async (folderId?: string) => {
    const currentDriveState = driveSyncState;
    if (!currentDriveState.isAuthenticated) return;

    uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: true, error: undefined }));
    try {
      const remoteMeta = await getBackupMetadata(folderId || settings.backupFolderId || '') as any;

      // Verifica conflitti
      if (remoteMeta && remoteMeta.modifiedTime && currentDriveState.lastSyncTime && new Date(remoteMeta.modifiedTime) > new Date(currentDriveState.lastSyncTime)) {
        uiActions.setSyncConflictModal({
          isOpen: true,
          data: {
            remoteTime: new Date(remoteMeta.modifiedTime).getTime(),
            localTime: new Date(currentDriveState.lastSyncTime).getTime(),
            isOpen: true
          } as any
        });
        uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false }));
        return;
      }

      // Crea payload serializzabile da tutti gli stores Zustand
      const payload = {
        user,
        students,
        lessons,
        slots,
        evaluations,
        competencyEvals,
        uda,
        eventi,
        knowledgeBase: knowledgeBase.map((kb: any) => ({ ...kb, content: null })), // Rimuovi content pesante
        corpora,
        notifiche,
        rubriche,
        pianiInclusione,
        giudizi,
        reportistica,
        feedSources,
        draftRegister,
        finalizedRegister,
        curricula,
        submissions,
        settings,
        aiSettings: settings.aiSettings,
        themeState: settings.themeState,
        backupState: uiActions.backupState,
        driveSyncState: uiActions.driveSyncState,
        dismissedSuggestions: Array.from(systemActions.dismissedSuggestions),
        navigationHistory: uiActions.navigationHistory
      };

      await uploadBackup(payload, folderId || settings.backupFolderId || '');

      uiActions.setDriveSyncState({
        isAuthenticated: true,
        isSyncing: false,
        lastSyncTime: new Date().toISOString(),
        error: undefined
      });
      showToast('backupSaved', 'success');
    } catch (e: any) {
      uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false, error: e.message }));
      showToast('backupError', 'error');
    }
  }, [driveSyncState, settings.backupFolderId, uiActions, showToast, user, students, lessons, slots, evaluations, competencyEvals, uda, eventi, knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reportistica, feedSources, draftRegister, finalizedRegister, curricula, submissions, settings, systemActions]);

  /**
   * Ripristina da Google Drive
   */
  const handleRestoreFromDrive = useCallback(async (folderId?: string) => {
    try {
      uiActions.setIsRestoring(true);
      const restoredData = await downloadBackup(folderId || settings.backupFolderId || '') as any;

      if (restoredData) {
        // Dispatch agli stores di dominio
        studentActions.loadFromBackup(restoredData);
        academicActions.loadFromBackup(restoredData);
        systemActions.loadFromBackup(restoredData);

        // Dispatch allo store delle impostazioni
        settingsActions.loadFromBackup({
          settings: restoredData.settings,
          aiSettings: restoredData.aiSettings,
          themeState: restoredData.themeState
        });

        // Dispatch stati UI relativi
        uiActions.setBackupState(restoredData.backupState ?? { status: 'synced', lastBackup: new Date() });
        uiActions.setDriveSyncState(restoredData.driveSyncState ?? { isAuthenticated: true, isSyncing: false, lastSyncTime: new Date() });
        uiActions.setNavigationHistory(restoredData.navigationHistory ?? []);
        uiActions.setInstallPrompt(restoredData.installPrompt ?? null);
        uiActions.setCanShowInstallPrompt(restoredData.canShowInstallPrompt ?? false);
        uiActions.setIsGlobalAiLoading(restoredData.isGlobalAiLoading ?? false);

        // Salva KB in IndexedDB se presente
        if (restoredData.knowledgeBase) {
          await saveKbContentToIndexedDB(restoredData.knowledgeBase);
          setKnowledgeBase(restoredData.knowledgeBase);
        }

        showToast('restoreSuccess', 'success');
      }
    } catch (e: any) {
      showToast('restoreError', 'error');
      uiActions.setDriveSyncState(prev => ({ ...prev, error: e.message }));
    } finally {
      uiActions.setDriveSyncState(prev => ({ ...prev, isSyncing: false }));
      uiActions.setIsRestoring(false);
    }
  }, [settings.backupFolderId, studentActions, academicActions, systemActions, setKnowledgeBase, settingsActions, uiActions, showToast]);

  /**
   * Seleziona folder Google Drive
   */
  const handlePickFolder = useCallback(async (): Promise<string | null> => {
    try {
      const folderId = await pickGoogleDriveFolder();
      if (folderId) {
        settingsActions.updateSettings({ backupFolderId: folderId });
        showToast('folderSelected', 'success');
      }
      return folderId;
    } catch (e: any) {
      showToast('folderError', 'error');
      return null;
    }
  }, [settingsActions, showToast]);

  /**
   * Crea app folder in Google Drive
   */
  const handleCreateAppFolder = useCallback(async (): Promise<string | null> => {
    try {
      const folderId = await createAppFolder();
      if (folderId) {
        settingsActions.updateSettings({ backupFolderId: folderId });
        showToast('folderCreated', 'success');
      }
      return folderId;
    } catch (e: any) {
      showToast('folderError', 'error');
      return null;
    }
  }, [settingsActions, showToast]);

  const user = useSystemStore(state => state.user);

  return {
    handleConnectDrive,
    handleDisconnectDrive,
    handleSyncToDrive,
    handleRestoreFromDrive,
    pickGoogleDriveFolder: handlePickFolder,
    createAppFolder: handleCreateAppFolder,
    driveSyncState
  };
};

export default useGoogleDriveSync;
