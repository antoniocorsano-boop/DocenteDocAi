// MD3 Gold Compliant
// Hook per gestione dati demo per prima esecuzione
// Audit: febbraio 2026

import { useCallback } from 'react';
import { useStudentStore } from '../stores/useStudentStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';

interface UseDemoDataReturn {
  handleLoadDemoData: () => Promise<void>;
  handleCleanDemoData: () => void;
}

/**
 * Hook per gestire dati demo
 * Carica dati demo per prima esecuzione o test
 *
 * @returns Oggetto con funzioni per gestione dati demo
 */
export const useDemoData = (): UseDemoDataReturn => {
  // Accesso agli stores
  const { actions: studentActions } = useStudentStore();
  const { actions: academicActions } = useAcademicStore();
  const { actions: systemActions } = useSystemStore();

  /**
   * Carica dati demo
   * Utile per prima esecuzione o test
   */
  const handleLoadDemoData = useCallback(async () => {
    try {
      console.info('[useDemoData] Loading demo data');

      // Importa e carica dati demo
      const { DEMO_DATA } = await import('../services/demoData.ts');

      // Dispatch agli stores di dominio
      studentActions.loadFromBackup(DEMO_DATA);
      academicActions.loadFromBackup(DEMO_DATA);
      systemActions.loadFromBackup(DEMO_DATA);

      console.info('[useDemoData] Demo data loaded successfully');
    } catch (e) {
      console.error('[useDemoData] Failed to load demo data:', e);
      throw e;
    }
  }, [studentActions, academicActions, systemActions]);

  /**
   * Pulisce dati demo
   * Resetta tutti gli stores allo stato vuoto
   */
  const handleCleanDemoData = useCallback(() => {
    console.info('[useDemoData] Cleaning demo data');

    // Reset tutti gli stores se disponibili
    if (studentActions.reset) studentActions.reset();
    if (academicActions.reset) academicActions.reset();
    if (systemActions.reset) systemActions.reset();

    console.info('[useDemoData] Demo data cleaned successfully');
  }, [studentActions, academicActions, systemActions]);

  return {
    handleLoadDemoData,
    handleCleanDemoData
  };
};

export default useDemoData;
