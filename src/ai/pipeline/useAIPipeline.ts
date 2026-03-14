import { useMemo } from 'react'
import type { Studente, Valutazione, Lezione } from '@/types'
import { runAIPipeline, type AIPipelineResult } from './aiPipeline'

/**
 * Single memoized hook that runs the entire AI pipeline for a filtered cohort.
 *
 * Usage:
 *   const { classHealth, suggestions, riskPredictions, lessonAssistant } =
 *     useAIPipeline(filteredStudents, filteredEvals)
 *
 * Re-computes only when students or evaluations change reference.
 * Lessons are optional for callers that don't load them.
 */
export function useAIPipeline(
  students: Studente[],
  evaluations: Valutazione[],
  lessons: Lezione[] = [],
): AIPipelineResult {
  return useMemo(
    () => runAIPipeline(students, evaluations, lessons),
    [students, evaluations, lessons],
  )
}
