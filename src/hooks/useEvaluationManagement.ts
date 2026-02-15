// MD3 Gold Compliant
// Hook per gestione valutazioni studenti
// Audit: febbraio 2026

import { useCallback } from 'react';
import { useAcademicStore } from '../stores/useAcademicStore';
import type { EvaluationInput, Valutazione, HomeworkSubmission, Lezione } from '../types';

interface UseEvaluationManagementReturn {
  handleGradeSubmission: (submissionId: string, grade: string, feedback: string) => void;
  handleAddEvaluation: (data: EvaluationInput) => void;
}

/**
 * Hook per gestire valutazioni studenti
 * Permette di valutare compiti e aggiungere valutazioni
 *
 * @returns Oggetto con funzioni per gestione valutazioni
 */
export const useEvaluationManagement = (): UseEvaluationManagementReturn => {
  // Accesso agli stores
  const { submissions, lessons, setSubmissions, setEvaluations } = useAcademicStore();

  /**
   * Valuta un compito
   * Crea valutazione e aggiorna submission
   */
  const handleGradeSubmission = useCallback(
    (submissionId: string, grade: string, feedback: string) => {
      console.info('[useEvaluationManagement] Grading submission:', submissionId);

      // Aggiorna submission
      setSubmissions((prev: HomeworkSubmission[]) =>
        prev.map(s => (s.id === submissionId ? { ...s, status: 'graded' as const, teacherFeedback: grade } : s))
      );

      // Trova submission per creare valutazione
      const sub = submissions?.find(s => s.id === submissionId);
      if (sub) {
        const lesson = lessons[sub.lessonId];
        const newEval: Valutazione = {
          id: `eval-sub-${Date.now()}`,
          studenteId: sub.studentId,
          materia: lesson?.materia || 'Generale',
          data: new Date().toISOString().split('T')[0],
          tipo: 'Pratico',
          voto: grade,
          argomento: lesson?.contenuto || 'Compito',
          note: feedback
        };
        setEvaluations((prev: Valutazione[]) => [...prev, newEval]);
        console.info('[useEvaluationManagement] Created evaluation:', newEval);
      }
    },
    [submissions, lessons, setSubmissions, setEvaluations]
  );

  /**
   * Aggiunge una valutazione
   */
  const handleAddEvaluation = useCallback(
    (data: EvaluationInput) => {
      console.info('[useEvaluationManagement] Adding evaluation:', data);

      const newEval: Valutazione = {
        id: `eval-${Date.now()}`,
        ...data
      };

      setEvaluations((prev: Valutazione[]) => [...prev, newEval]);
      console.info('[useEvaluationManagement] Added evaluation:', newEval);
    },
    [setEvaluations]
  );

  /**
   * Aggiorna una valutazione esistente
   */
  const handleUpdateEvaluation = useCallback((evaluationId: string, data: Partial<EvaluationInput>) => {
    console.info('[useEvaluationManagement] Updating evaluation:', evaluationId);

    setEvaluations((prev: Valutazione[]) =>
      prev.map(e => (e.id === evaluationId ? { ...e, ...data } : e))
    );

    console.info('[useEvaluationManagement] Updated evaluation:', evaluationId);
  }, [setEvaluations]);

  /**
   * Elimina una valutazione
   */
  const handleDeleteEvaluation = useCallback((evaluationId: string) => {
    console.info('[useEvaluationManagement] Deleting evaluation:', evaluationId);

    setEvaluations((prev: Valutazione[]) => prev.filter(e => e.id !== evaluationId));

    console.info('[useEvaluationManagement] Deleted evaluation:', evaluationId);
  }, [setEvaluations]);

  return {
    handleGradeSubmission,
    handleAddEvaluation,
    handleUpdateEvaluation,
    handleDeleteEvaluation
  };
};

export default useEvaluationManagement;
