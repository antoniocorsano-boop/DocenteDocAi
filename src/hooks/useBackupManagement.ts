// MD3 Gold Compliant
// Hook per gestione backup e esportazione dati
// Audit: febbraio 2026

import { useCallback, useMemo } from 'react';
import { useStudentStore } from '../stores/useStudentStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';
import { useUIStore } from '../stores/useUIStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { ImportService } from '../services/importService';

interface UseBackupManagementReturn {
  handleOpenBackupInfo: () => void;
  handleExportData: () => void;
  handleImportData: (file: File) => Promise<void>;
}

/**
 * Hook per gestire backup e esportazione dati
 * Permette di esportare e importare dati in formato JSON
 *
 * @returns Oggetto con funzioni per gestione backup
 */
export const useBackupManagement = (): UseBackupManagementReturn => {
  // Accesso agli stores
  const user = useSystemStore(state => state.user);
  const students = useStudentStore(state => state.students);
  const lessons = useAcademicStore(state => state.lessons);
  const slots = useAcademicStore(state => state.slots);
  const evaluations = useStudentStore(state => state.evaluations);
  const competencyEvals = useStudentStore(state => state.competencyEvals);
  const uda = useAcademicStore(state => state.uda);
  const eventi = useAcademicStore(state => state.eventi);
  const knowledgeBase = useSystemStore(state => state.knowledgeBase);
  const corpora = useSystemStore(state => state.corpora);
  const notifiche = useSystemStore(state => state.notifiche);
  const rubriche = useAcademicStore(state => state.rubriche);
  const pianiInclusione = useStudentStore(state => state.pianiInclusione);
  const giudizi = useAcademicStore(state => state.giudizi);
  const reportistica = useAcademicStore(state => state.reportistica);
  const feedSources = useSystemStore(state => state.feedSources);
  const draftRegister = useAcademicStore(state => state.draftRegister);
  const finalizedRegister = useAcademicStore(state => state.finalizedRegister);
  const curricula = useAcademicStore(state => state.curricula);
  const submissions = useAcademicStore(state => state.submissions);

  const settings = useSettingsStore(state => state.settings);
  const aiSettings = useSettingsStore(state => state.aiSettings);
  const themeState = useSettingsStore(state => state.themeState);

  const { navigationHistory, backupState, driveSyncState, installPrompt, canShowInstallPrompt, isGlobalAiLoading, dismissedSuggestions, actions: uiActions } = useUIStore();
  const { actions: studentActions } = useStudentStore();
  const { actions: academicActions } = useAcademicStore();
  const { actions: systemActions } = useSystemStore();
  const { actions: settingsActions } = useSettingsStore();
  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

  /**
   * Apre modale info backup
   */
  const handleOpenBackupInfo = useCallback(() => {
    console.info('[useBackupManagement] Opening backup info modal');
    uiActions.toggleModal('isBackupInfoModalOpen');
  }, [uiActions]);

  /**
   * Esporta dati in formato JSON
   * Crea snapshot completo dell'applicazione
   */
  const handleExportData = useCallback(() => {
    console.info('[useBackupManagement] Exporting data');

    try {
      // Crea snapshot completo dell'applicazione
      const snapshot = {
        user,
        students,
        lessons,
        slots,
        evaluations,
        competencyEvals,
        uda,
        eventi,
        knowledgeBase,
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
        aiSettings,
        themeState,
        dismissedSuggestions: Array.from(dismissedSuggestions),
        navigationHistory,
        installPrompt: installPrompt ? 'PROMPT_PRESENT' : null, // Non serializzabile
        canShowInstallPrompt,
        isGlobalAiLoading,
        backupState,
        driveSyncState
      };

      const dataStr = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `OrarioDoc_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('backupExported', 'success');
      console.info('[useBackupManagement] Data exported successfully');
    } catch (e) {
      console.error('[useBackupManagement] Failed to export data:', e);
      showToast('backupError', 'error');
    }
  }, [
    user,
    students,
    lessons,
    slots,
    evaluations,
    competencyEvals,
    uda,
    eventi,
    knowledgeBase,
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
    aiSettings,
    themeState,
    dismissedSuggestions,
    navigationHistory,
    backupState,
    driveSyncState,
    installPrompt,
    canShowInstallPrompt,
    isGlobalAiLoading,
    showToast
  ]);

  /**
   * Importa dati da file JSON
   * Supporta backup completi e importazioni parziali
   */
  const handleImportData = useCallback(
    async (file: File) => {
      console.info('[useBackupManagement] Importing data from file:', file.name);

      try {
        const extension = file.name.split('.').pop()?.toLowerCase();

        // Caso 1: Backup JSON standard
        if (extension === 'json') {
          const reader = new FileReader();
          reader.onload = async e => {
            try {
              const data = JSON.parse(e.target?.result as string);

              // Verifica se è un backup completo (ha settings o stores multipli)
              if (data.settings || data.students || data.lessons) {
                // Dispatch agli stores di dominio
                studentActions.loadFromBackup(data);
                academicActions.loadFromBackup(data);
                systemActions.loadFromBackup(data);

                // Dispatch allo store delle impostazioni
                settingsActions.loadFromBackup({
                  settings: data.settings,
                  aiSettings: data.aiSettings,
                  themeState: data.themeState
                });

                // Dispatch stati UI relativi
                uiActions.setBackupState(data.backupState ?? { status: 'synced', lastBackup: null });
                uiActions.setDriveSyncState(
                  data.driveSyncState ?? { isAuthenticated: false, isSyncing: false, lastSyncTime: null, error: undefined }
                );

                showToast('imported', 'success');
                console.info('[useBackupManagement] Data imported successfully');
                return;
              }

              // Caso 2: Importazione parziale (es. studenti, rubriche, etc.)
              await ImportService.importFromFile(file, data);
              showToast('imported', 'success');
            } catch (e) {
              console.error('[useBackupManagement] Failed to parse JSON:', e);
              showToast('importError', 'error');
            }
          };
          reader.onerror = () => {
            console.error('[useBackupManagement] Failed to read file');
            showToast('importError', 'error');
          };
          reader.readAsText(file);
        } else {
          // Caso 3: Altri formati (CSV, Excel, etc.)
          await ImportService.importFromFile(file);
          showToast('imported', 'success');
        }
      } catch (e) {
        console.error('[useBackupManagement] Failed to import data:', e);
        showToast('importError', 'error');
      }
    },
    [studentActions, academicActions, systemActions, settingsActions, uiActions, showToast]
  );

  return {
    handleOpenBackupInfo,
    handleExportData,
    handleImportData
  };
};

export default useBackupManagement;
