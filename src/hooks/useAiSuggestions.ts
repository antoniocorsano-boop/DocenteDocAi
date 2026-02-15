// MD3 Gold Compliant
// Hook per generazione suggerimenti AI con caching e scoring
// Audit: febbraio 2026

import { useEffect, useCallback, useMemo } from 'react';
import { useStudentStore } from '../stores/useStudentStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';
import type { AiSuggestion } from '../types';

interface UseAiSuggestionsReturn {
  suggestions: AiSuggestion[];
  activeSuggestion: AiSuggestion | null;
  dismissedSuggestions: Set<string>;
  dismissSuggestion: (id: string) => void;
  reactivateSuggestion: (id: string) => void;
  isGenerating: boolean;
}

interface AiSuggestionsContext {
  user: { id: string; displayName?: string } | null;
  students: any[];
  lessons: any[];
  slots: any[];
  evaluations: any[];
  competencyEvals: any[];
  uda: any[];
  eventi: any[];
  knowledgeBase: any[];
  corpora: any[];
  rubriche: any[];
  pianiInclusione: any[];
  giudizi: any[];
  reportistica: any[];
  feedSources: any[];
  draftRegister: any;
  finalizedRegister: any;
  curricula: any[];
  submissions: any[];
  notifiche: any[];
  suggestions: AiSuggestion[];
  activeSuggestion: AiSuggestion | null;
  dismissedSuggestions: Set<string>;
  studentProfileContext: any;
  selectedClassForDashboard: string | null;
  actions: any;
}

/**
 * Hook per gestire generazione suggerimenti AI
 * Genera suggerimenti con caching e scoring
 *
 * @param isDataLoaded - Se i dati sono caricati
 * @param isTestMode - Se in modalità test (evita chiamate AI)
 * @returns Oggetto con suggerimenti e funzioni per gestione
 */
export const useAiSuggestions = (
  isDataLoaded: boolean,
  isTestMode: boolean = false
): UseAiSuggestionsReturn => {
  // Accesso agli stores
  const user = useSystemStore(state => state.user);
  const students = useStudentStore(state => state.students);
  const evaluations = useStudentStore(state => state.evaluations);
  const competencyEvals = useStudentStore(state => state.competencyEvals);
  const pianiInclusione = useStudentStore(state => state.pianiInclusione);
  const studentProfileContext = useStudentStore(state => state.studentProfileContext);
  const selectedClassForDashboard = useStudentStore(state => state.selectedClassForDashboard);

  const lessons = useAcademicStore(state => state.lessons);
  const slots = useAcademicStore(state => state.slots);
  const uda = useAcademicStore(state => state.uda);
  const eventi = useAcademicStore(state => state.eventi);
  const rubriche = useAcademicStore(state => state.rubriche);
  const giudizi = useAcademicStore(state => state.giudizi);
  const reportistica = useAcademicStore(state => state.reportistica);
  const curricula = useAcademicStore(state => state.curricula);
  const submissions = useAcademicStore(state => state.submissions);
  const draftRegister = useAcademicStore(state => state.draftRegister);
  const finalizedRegister = useAcademicStore(state => state.finalizedRegister);

  const knowledgeBase = useSystemStore(state => state.knowledgeBase);
  const corpora = useSystemStore(state => state.corpora);
  const notifiche = useSystemStore(state => state.notifiche);
  const feedSources = useSystemStore(state => state.feedSources);
  const suggestions = useSystemStore(state => state.suggestions);
  const activeSuggestion = useSystemStore(state => state.activeSuggestion);
  const dismissedSuggestions = useSystemStore(state => state.dismissedSuggestions);

  const { actions: studentActions } = useStudentStore();
  const { actions: academicActions } = useAcademicStore();
  const { actions: systemActions } = useSystemStore();

  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Genera suggerimenti AI
   * Viene chiamato solo se i dati sono caricati e non in test mode
   */
  useEffect(() => {
    if (!isDataLoaded || isTestMode) return;

    const generateSuggestions = async () => {
      try {
        setIsGenerating(true);
        const { generateAiSuggestions } = await import('../utils/aiSuggestionGenerator');
        const context: AiSuggestionsContext = {
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
          rubriche,
          pianiInclusione,
          giudizi,
          reportistica,
          feedSources,
          draftRegister,
          finalizedRegister,
          curricula,
          submissions,
          notifiche,
          suggestions,
          activeSuggestion,
          dismissedSuggestions,
          studentProfileContext,
          selectedClassForDashboard,
          actions: { ...studentActions, ...academicActions, ...systemActions }
        };
        const aiSuggestions = await generateAiSuggestions(context as any);
        systemActions.setSuggestions(aiSuggestions);
      } catch (error) {
        console.error('[useAiSuggestions] Failed to generate AI suggestions:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    // Ritarda generazione per evitare conflitti con caricamento iniziale
    const timer = setTimeout(generateSuggestions, 2000);
    return () => clearTimeout(timer);
  }, [
    isDataLoaded,
    isTestMode,
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
    rubriche,
    pianiInclusione,
    giudizi,
    reportistica,
    feedSources,
    draftRegister,
    finalizedRegister,
    curricula,
    submissions,
    notifiche,
    suggestions,
    activeSuggestion,
    dismissedSuggestions,
    studentProfileContext,
    selectedClassForDashboard,
    studentActions,
    academicActions,
    systemActions
  ]);

  /**
   * Dismiss un suggerimento
   */
  const dismissSuggestion = useCallback(
    (id: string) => {
      const updatedSuggestions = suggestions.filter((suggestion: AiSuggestion) => suggestion.id !== id);
      systemActions.setSuggestions(updatedSuggestions);
      systemActions.dismissSuggestion(id);
    },
    [suggestions, systemActions]
  );

  /**
   * Riattiva un suggerimento precedentemente dismissed
   */
  const reactivateSuggestion = useCallback(
    (id: string) => {
      systemActions.reactivateSuggestion(id);
    },
    [systemActions]
  );

  return {
    suggestions,
    activeSuggestion,
    dismissedSuggestions,
    dismissSuggestion,
    reactivateSuggestion,
    isGenerating
  };
};

import { useState } from 'react';

export default useAiSuggestions;
