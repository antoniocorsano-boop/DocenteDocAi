/**
 * aiEngine.ts — Unified AI Analysis Engine (FASE 1)
 *
 * Single entry point for all AI computation. Accepts an AIContext and
 * returns a fully-typed AIAnalysisResult. Pure function — no side effects.
 *
 * Benefits:
 * - One import for all AI data consumers (Copilot, Dashboard, etc.)
 * - Easy to cache at call site with useMemo
 * - Tests target a single public API
 */
import type { AIContext } from '../contextEngine/contextBuilder';
import { computeClassHealthIndex } from '../classHealth/classHealthIndex';
import { analyzeRisk } from '../contextEngine/riskAnalyzer';
import { analyzeExcellence } from '../contextEngine/excellenceAnalyzer';
import { generateForecasts } from '../copilot/trendEngine';
import type { ClassHealthIndex } from '../classHealth/types';
import type { AISuggestion } from '../contextEngine/types';
import type { StudentForecast } from '../copilot/trendEngine';

// ── public result type ────────────────────────────────────────────────────────

export interface AIAnalysisResult {
  /** Class health composite index (0–100) with grade and dimensions */
  classHealth: ClassHealthIndex;
  /** Students identified as at-risk (avg < 5.5 or declining trend) */
  risks: AISuggestion[];
  /** Students consistently performing above 8.0 */
  excellence: AISuggestion[];
  /** Combined suggestions (risks + excellence) */
  suggestions: AISuggestion[];
  /** Per-student grade trend forecasts (+30 days) */
  predictions: StudentForecast[];
  /** Computed class grade average (1–10), 0 when no evaluations */
  classAverage: number;
  /** Count of at-risk students */
  atRiskCount: number;
  /** Count of excellent students */
  excellenceCount: number;
}

// ── engine ────────────────────────────────────────────────────────────────────

function parseVoto(v: string): number {
  const n = parseFloat(v.replace(',', '.'));
  return isNaN(n) ? -1 : n;
}

/**
 * Runs a full AI analysis pass over the provided context.
 *
 * @param context - AIContext built via buildAIContext()
 * @returns AIAnalysisResult — all AI-derived data for the current dataset
 *
 * @example
 * const result = useMemo(() => runAIAnalysis(ctx), [ctx]);
 */
export function runAIAnalysis(context: AIContext): AIAnalysisResult {
  const classHealth = computeClassHealthIndex(context);
  const risks = analyzeRisk(context);
  const excellence = analyzeExcellence(context);
  const suggestions = [...risks, ...excellence];
  const predictions = generateForecasts(context.students, context.evaluations);

  const validScores = context.evaluations
    .map((e) => parseVoto(e.voto))
    .filter((n) => n >= 0);

  const classAverage =
    validScores.length > 0
      ? parseFloat(
          (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1),
        )
      : 0;

  return {
    classHealth,
    risks,
    excellence,
    suggestions,
    predictions,
    classAverage,
    atRiskCount: risks.length,
    excellenceCount: excellence.length,
  };
}
