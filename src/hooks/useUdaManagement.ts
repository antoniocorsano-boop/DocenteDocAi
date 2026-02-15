// MD3 Gold Compliant
// Hook per gestione Unità di Apprendimento (UDA)
// Audit: febbraio 2026

import { useCallback } from 'react';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useUIStore } from '../stores/useUIStore';
import type { Uda, LessonScheduleInput } from '../types';

interface UseUdaManagementReturn {
  handleCreateUda: (data: LessonScheduleInput) => void;
  onSaveUda: (uda: Uda) => void;
}

/**
 * Hook per gestire Unità di Apprendimento (UDA)
 * Permette di creare e salvare UDA
 *
 * @param handleNavigate - Funzione di navigazione
 * @returns Oggetto con funzioni per gestione UDA
 */
export const useUdaManagement = (
  handleNavigate?: (view: string, context?: Record<string, unknown>) => void
): UseUdaManagementReturn => {
  // Accesso agli stores
  const { uda, setUda } = useAcademicStore();
  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

  /**
   * Crea una nuova UDA
   * Naviga alla view studio per generazione AI
   */
  const handleCreateUda = useCallback(
    (data: LessonScheduleInput) => {
      console.info('[useUdaManagement] Creating UDA:', data);

      if (handleNavigate) {
        handleNavigate('studio', {
          prompt: `Crea una Unità di Apprendimento (UDA) per la classe ${data.classe} sulla materia ${data.materia}.`,
          targetUda: data
        });
        showToast('udaCreationStarted', 'info');
      }
    },
    [handleNavigate, showToast]
  );

  /**
   * Salva una UDA
   * Aggiorna o crea UDA nella lista
   */
  const onSaveUda = useCallback(
    (udaData: Uda) => {
      console.info('[useUdaManagement] Saving UDA:', udaData);

      setUda((prev: Uda[]) => {
        const index = prev.findIndex(u => u.id === udaData.id);
        if (index !== -1) {
          // Aggiorna UDA esistente
          const newUdaArr = [...prev];
          newUdaArr[index] = udaData;
          return newUdaArr;
        }
        // Crea nuova UDA
        return [...prev, udaData];
      });

      showToast('udaSaved', 'success');
      console.info('[useUdaManagement] UDA saved successfully');
    },
    [setUda, showToast]
  );

  /**
   * Aggiorna una UDA esistente
   */
  const handleUpdateUda = useCallback((udaId: string, data: Partial<Uda>) => {
    console.info('[useUdaManagement] Updating UDA:', udaId);

    setUda((prev: Uda[]) => prev.map(u => (u.id === udaId ? { ...u, ...data } : u)));

    showToast('udaUpdated', 'success');
    console.info('[useUdaManagement] UDA updated successfully');
  }, [setUda, showToast]);

  /**
   * Elimina una UDA
   */
  const handleDeleteUda = useCallback((udaId: string) => {
    console.info('[useUdaManagement] Deleting UDA:', udaId);

    setUda((prev: Uda[]) => prev.filter(u => u.id !== udaId));

    showToast('udaDeleted', 'success');
    console.info('[useUdaManagement] UDA deleted successfully');
  }, [setUda, showToast]);

  return {
    handleCreateUda,
    onSaveUda,
    handleUpdateUda,
    handleDeleteUda
  };
};

export default useUdaManagement;
