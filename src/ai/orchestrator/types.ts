/**
 * orchestrator/types.ts — Canonical result and options types for the
 * UnifiedAIOrchestrator (Sprint 1 — Production Maturity)
 *
 * All AI consumers should import from here instead of importing directly
 * from aiEngine or aiPipeline. The legacy types remain exported from
 * their original modules for backward compatibility.
 */
import type { ClassHealthIndex } from '../classHealth/types';
import type { AISuggestion } from '../contextEngine/types';
import type { StudentForecast } from '../copilot/trendEngine';
import type { StudentRiskPrediction } from '../prediction/types';
import type { LessonAssistantResponse } from '../lessonAssistant/types';
import type { AIRunStats } from '../engine/aiEngine';

// ── Schema version (bump on every breaking change) ────────────────────────────

export const AI_SCHEMA_VERSION = 2 as const;
export type AISchemaVersion = typeof AI_SCHEMA_VERSION;

// ── Primary result type ───────────────────────────────────────────────────────

/**
 * UnifiedAIResult — superset of the legacy AIAnalysisResult.
 *
 * Backward-compat contract:
 *   classHealth, risks, excellence, suggestions, predictions,
 *   classAverage, atRiskCount, excellenceCount
 *   are structurally identical to AIAnalysisResult and are safe to
 *   pass to any component that expects AIAnalysisResult.
 */
export interface UnifiedAIResult {
  readonly schemaVersion: AISchemaVersion;

  // ── Fields from AIAnalysisResult (unchanged) ─────────────────────────────
  classHealth: ClassHealthIndex;
  risks: AISuggestion[];
  excellence: AISuggestion[];
  /** Combined (risks ∪ excellence) */
  suggestions: AISuggestion[];
  /** Per-student +30-day grade trend forecasts */
  predictions: StudentForecast[];
  classAverage: number;
  atRiskCount: number;
  excellenceCount: number;

  // ── Richer fields (not in legacy AIAnalysisResult) ───────────────────────
  /** Per-student explainable risk probabilities */
  riskPredictions: StudentRiskPrediction[];
  /**
   * Lesson gap analysis + activity recommendations.
   * null when `includeLessonAssistant` option is false (default perf budget).
   */
  lessonAssistant: LessonAssistantResponse | null;

  /** Timing breakdown from the most recent non-cached run */
  stats: AIRunStats;

  /**
   * Links this result to its persisted AuditTrail record (IndexedDB id).
   * May be null on cache-hits when IDB write was skipped.
   */
  auditId: string | null;
}

// ── Run options ───────────────────────────────────────────────────────────────

export interface UnifiedAIOptions {
  /**
   * Include LessonAssistantResponse in the result.
   * Disabled by default to stay within the compute budget.
   * Enable in Beta Mode via `useSystemStore.betaMode`.
   */
  includeLessonAssistant?: boolean;
  /**
   * Bypass the in-memory cache and force a full re-run.
   * Useful for benchmarking and after dataset mutations.
   */
  forceFresh?: boolean;
}
