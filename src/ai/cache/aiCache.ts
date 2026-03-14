/**
 * aiCache.ts — In-memory result cache for AIAnalysisResult
 *
 * Provides a lightweight, deterministic cache keyed by a hash of the
 * analysis context (sorted student/evaluation IDs). Avoids redundant
 * recomputation when the same dataset is analysed multiple times within
 * the same browser session.
 *
 * Usage:
 *   import { buildContextHash, getCachedAnalysis, setCachedAnalysis } from './aiCache'
 *   const hash = buildContextHash(context)
 *   const cached = getCachedAnalysis(hash)
 *   if (cached) return cached
 *   const result = runAIAnalysis(context)
 *   setCachedAnalysis(hash, result)
 *   return result
 */
import type { AIContext } from '../contextEngine/contextBuilder';
import type { AIAnalysisResult } from '../engine/aiEngine';

// ── internal store ────────────────────────────────────────────────────────────

const _cache = new Map<string, AIAnalysisResult>();

// ── hash ──────────────────────────────────────────────────────────────────────

/**
 * Produces a stable, deterministic string key from an AIContext.
 *
 * The key encodes:
 *   - Sorted student IDs (class composition)
 *   - Sorted evaluation IDs (dataset identity)
 *
 * Two calls with the same students + evaluations (regardless of array order)
 * will always produce the same hash.
 */
export function buildContextHash(context: AIContext): string {
  const studentIds = context.students.map((s) => s.id).sort().join(',');
  const evalIds = context.evaluations.map((e) => e.id).sort().join(',');
  return `${studentIds}|${evalIds}`;
}

// ── public API ────────────────────────────────────────────────────────────────

/**
 * Returns the cached AIAnalysisResult for the given hash, or null if not
 * present.
 */
export function getCachedAnalysis(hash: string): AIAnalysisResult | null {
  return _cache.get(hash) ?? null;
}

/**
 * Stores an AIAnalysisResult in the cache under the given hash.
 */
export function setCachedAnalysis(hash: string, result: AIAnalysisResult): void {
  _cache.set(hash, result);
}

/**
 * Removes all entries from the analysis cache.
 * Useful in tests or when the user navigates away to a fresh class context.
 */
export function clearCache(): void {
  _cache.clear();
}

/** Number of entries currently held in the cache. Exposed for debugging. */
export function cacheSize(): number {
  return _cache.size;
}
