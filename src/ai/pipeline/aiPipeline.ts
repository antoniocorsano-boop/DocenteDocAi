import type { Studente, Valutazione, Lezione } from '@/types'
import { buildAIContext } from '../contextEngine/contextBuilder'
import { analyzeRisk } from '../contextEngine/riskAnalyzer'
import { analyzeExcellence } from '../contextEngine/excellenceAnalyzer'
import { generateAISuggestions } from '../contextEngine/suggestionEngine'
import { computeClassHealthIndex } from '../classHealth/classHealthIndex'
import { predictClassRisk } from '../prediction/predictClassRisk'
import { askLessonAssistant } from '../lessonAssistant/lessonAssistant'
import type { AISuggestion } from '../contextEngine/types'
import type { ClassHealthIndex } from '../classHealth/types'
import type { StudentRiskPrediction } from '../prediction/types'
import type { LessonAssistantResponse } from '../lessonAssistant/types'

export interface AIPipelineResult {
  /** 0-100 score + grade for the current filtered cohort */
  classHealth: ClassHealthIndex
  /** Suggestions flagging individual at-risk students */
  riskSuggestions: AISuggestion[]
  /** Suggestions celebrating excellence students */
  excellenceSuggestions: AISuggestion[]
  /** All suggestions merged (riskSuggestions + excellenceSuggestions) */
  suggestions: AISuggestion[]
  /** Per-student explainable risk probabilities */
  riskPredictions: StudentRiskPrediction[]
  /** Subject gap analysis + recommended lesson activities */
  lessonAssistant: LessonAssistantResponse
}

/**
 * Pure orchestrator — runs every AI module in the correct dependency order
 * and returns a consolidated result object.
 *
 * All modules are pure functions: no side-effects, deterministic output,
 * safe to memoize.
 */
export function runAIPipeline(
  students: Studente[],
  evaluations: Valutazione[],
  lessons: Lezione[] = [],
): AIPipelineResult {
  // Step 1 — build shared context (single allocation)
  const context = buildAIContext(students, lessons, evaluations)

  // Step 2 — parallel analysis (pure, no inter-dependencies)
  const riskSuggestions = analyzeRisk(context)
  const excellenceSuggestions = analyzeExcellence(context)
  const suggestions = generateAISuggestions(context)
  const classHealth = computeClassHealthIndex(context)
  const riskPredictions = predictClassRisk(students, evaluations)
  const lessonAssistant = askLessonAssistant(context)

  return {
    classHealth,
    riskSuggestions,
    excellenceSuggestions,
    suggestions,
    riskPredictions,
    lessonAssistant,
  }
}
