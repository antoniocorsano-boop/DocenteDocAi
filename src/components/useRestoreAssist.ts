import React from 'react';
import RestoreAssistController from './RestoreAssistController';

export interface UseRestoreAssistState {
  show: boolean;
  error?: string;
  onLoadDemo: () => void;
  onRestoreFile: () => void;
  onConnectDrive: () => void;
  onClose: () => void;
}

export const useRestoreAssist = (appState: any, actions: any, modals: any): UseRestoreAssistState => {
  // Heuristic: show if no studenti, no lezioni, no user, and not restoring
  const isEmpty = (!appState.students || appState.students.length === 0) &&
    (!appState.lessons || Object.keys(appState.lessons).length === 0) &&
    !appState.user &&
    !modals.isRestoring;

  // Optionally, add error detection logic here
  const error = appState.backupState?.status === 'error' ? 'Backup corrotto o non valido.' : undefined;

  return {
    show: isEmpty,
    error,
    onLoadDemo: actions.handleLoadDemoData,
    onRestoreFile: actions.handleImportData,
    onConnectDrive: actions.handleConnectDrive,
    onClose: () => window.location.reload(),
  };
};

export default RestoreAssistController;
