// MD3 Gold Compliant
// Hook per gestione lezioni e classi
// Audit: febbraio 2026

import { useCallback } from 'react';
import { useUIStore } from '../stores/useUIStore';
import type { Lezione, Slot, RegisterEntry } from '../types';

interface UseLessonManagementReturn {
  handleStartClassroom: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
  handleEditSlot: (giorno: string, ora: string) => void;
  handleShowSlotActions: (slot: Slot, lesson: Lezione) => void;
  handleAiSuggest: (slot: Slot) => void;
}

/**
 * Hook per gestire lezioni e classi
 * Permette di avviare sessioni classe, modificare slot, e generare suggerimenti AI
 *
 * @param handleNavigate - Funzione di navigazione
 * @returns Oggetto con funzioni per gestione lezioni
 */
export const useLessonManagement = (
  handleNavigate: (view: string, context?: Record<string, unknown>) => void
): UseLessonManagementReturn => {
  // Accesso allo store UI
  const { draftRegister, actions: uiActions } = useUIStore();
  const { setDraftRegister, setEditingSlotKey, setActiveSlotKey, setLessonViewContext } = uiActions;
  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

  /**
   * Avvia sessione classe
   * Crea entry register se non esiste
   */
  const handleStartClassroom = useCallback(
    (classe: string, materia: string, slotKey: string, lesson: Lezione) => {
      console.info('[useLessonManagement] Starting classroom session:', { classe, materia, slotKey });

      // Crea entry register se non esiste
      if (!draftRegister[slotKey]) {
        const newEntry: RegisterEntry = {
          id: `reg-${Date.now()}`,
          date: new Date().toISOString(),
          slotKey,
          lessonId: lesson.id,
          classe,
          materia,
          studentAttendance: {},
          status: 'draft'
        };
        setDraftRegister(prev => ({ ...prev, [slotKey]: newEntry }));
      }

      // Naviga alla view sessione classe
      handleNavigate('aula-session', { draftKey: slotKey });
    },
    [draftRegister, setDraftRegister, handleNavigate]
  );

  /**
   * Modifica slot
   * Imposta editing slot key
   */
  const handleEditSlot = useCallback(
    (giorno: string, ora: string) => {
      console.info('[useLessonManagement] Editing slot:', { giorno, ora });
      setEditingSlotKey(`${giorno}-${ora}`);
    },
    [setEditingSlotKey]
  );

  /**
   * Mostra azioni per slot
   * Imposta active slot key e lesson view context
   */
  const handleShowSlotActions = useCallback(
    (slot: Slot, lesson: Lezione) => {
      console.info('[useLessonManagement] Showing slot actions for:', slot);
      setActiveSlotKey(`${slot.giorno}-${slot.ora}`);
      setLessonViewContext(lesson);
    },
    [setActiveSlotKey, setLessonViewContext]
  );

  /**
   * Genera suggerimento AI per lezione
   */
  const handleAiSuggest = useCallback(
    (slot: Slot) => {
      console.info('[useLessonManagement] Generating AI suggestion for slot:', slot);
      handleNavigate('studio', {
        prompt: `Suggerisci un'attività didattica creativa per la prossima lezione di ${slot.materia} nella classe ${slot.classe}.`,
        targetSlot: slot
      });
      showToast('aiSuggestionPrep', 'info');
    },
    [handleNavigate, showToast]
  );

  return {
    handleStartClassroom,
    handleEditSlot,
    handleShowSlotActions,
    handleAiSuggest
  };
};

export default useLessonManagement;
