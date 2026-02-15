// MD3 Gold Compliant
// Hook per gestione navigazione applicazione
// Audit: febbraio 2026

import { useState, useCallback, useMemo } from 'react';
import { useUIStore } from '../stores/useUIStore';
import type { View } from '../types';

interface UseAppNavigationReturn {
  view: View;
  viewContext: Record<string, unknown> | null;
  handleNavigate: (newView: View, context?: Record<string, unknown>) => void;
  handleBack: () => void;
  navigationHistory: { view: View; context: Record<string, unknown> | null }[];
}

/**
 * Hook per gestire navigazione applicazione
 * Permette di navigare tra views e gestire history
 *
 * @returns Oggetto con stato e funzioni per navigazione
 */
export const useAppNavigation = (): UseAppNavigationReturn => {
  // Stato locale per navigazione
  const [view, setView] = useState<View>('home');
  const [viewContext, setViewContext] = useState<Record<string, unknown> | null>(null);

  // Accesso allo store UI per history
  const { navigationHistory, actions: uiActions } = useUIStore();
  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

  /**
   * Naviga a una nuova view
   * Aggiorna history e contesto
   */
  const handleNavigate = useCallback(
    (newView: View, context?: Record<string, unknown>) => {
      console.info('[useAppNavigation] Navigating to:', newView, 'with context:', context);

      // Aggiorna history
      const currentEntry = { view, context: viewContext };
      const newHistory = [...navigationHistory, currentEntry];

      // Limita history a 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      uiActions.setNavigationHistory(newHistory);

      // Aggiorna view e contesto
      setView(newView);
      setViewContext(context || null);

      // Log specifico per home navigation
      if (newView === 'home') {
        console.info('[useAppNavigation] Navigated to home');
      }
    },
    [view, viewContext, navigationHistory, uiActions]
  );

  /**
   * Naviga indietro nella history
   */
  const handleBack = useCallback(() => {
    console.info('[useAppNavigation] Navigating back');

    if (navigationHistory.length === 0) {
      console.warn('[useAppNavigation] No history to navigate back to');
      showToast('noHistory', 'info');
      return;
    }

    // Ottieni entry precedente
    const previousEntry = navigationHistory[navigationHistory.length - 1];
    const newHistory = navigationHistory.slice(0, -1);

    // Aggiorna history
    uiActions.setNavigationHistory(newHistory);

    // Aggiorna view e contesto
    setView(previousEntry.view);
    setViewContext(previousEntry.context);

    console.info('[useAppNavigation] Navigated back to:', previousEntry.view);
  }, [navigationHistory, uiActions, showToast]);

  /**
   * Naviga alla dashboard studente
   */
  const handleEnterStudentMode = useCallback(() => {
    handleNavigate('student-dashboard');
  }, [handleNavigate]);

  /**
   * Naviga alla dashboard classe
   */
  const handleEnterClassMode = useCallback(() => {
    handleNavigate('class-dashboard');
  }, [handleNavigate]);

  return {
    view,
    viewContext,
    handleNavigate,
    handleBack,
    navigationHistory: useMemo(
      () =>
        navigationHistory.map(entry => ({
          ...entry,
          context: entry.context as Record<string, unknown> | null
        })),
      [navigationHistory]
    )
  };
};

export default useAppNavigation;
