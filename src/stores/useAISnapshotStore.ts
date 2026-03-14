/**
 * useAISnapshotStore.ts
 *
 * Persisted Zustand store for AI pipeline snapshots.
 * Saves one snapshot per (className × calendar-day); prunes to max 30 per class.
 * Storage key: 'docentedoc-ai-snapshots'
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIPipelineResult } from '../ai/pipeline/aiPipeline';
import type { HealthGrade } from '../ai/classHealth/types';

// ============================================================================
// TYPES
// ============================================================================

export interface AISnapshot {
  /** Unique key — `${className}::${date}` */
  id: string;
  className: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  score: number;
  grade: HealthGrade;
  riskCount: number;
  excellenceCount: number;
}

interface AISnapshotState {
  snapshots: AISnapshot[];
}

interface AISnapshotActions {
  /**
   * Upsert a snapshot for the given class and today's date.
   * Prunes to a max of MAX_PER_CLASS entries per class (oldest removed first).
   */
  saveSnapshot: (className: string, pipeline: AIPipelineResult) => void;
  /** Return snapshots for a class, sorted by date ascending. */
  getSnapshots: (className: string) => AISnapshot[];
  /** Remove all snapshots for a specific class. */
  clearClass: (className: string) => void;
}

export type AISnapshotStore = AISnapshotState & { actions: AISnapshotActions };

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_PER_CLASS = 30;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// ============================================================================
// STORE
// ============================================================================

export const useAISnapshotStore = create<AISnapshotStore>()(
  persist(
    (set, get) => ({
      snapshots: [],

      actions: {
        saveSnapshot: (className, pipeline) => {
          const date = todayISO();
          const id = `${className}::${date}`;
          const next: AISnapshot = {
            id,
            className,
            date,
            score: Math.round(pipeline.classHealth.score),
            grade: pipeline.classHealth.grade,
            riskCount: pipeline.riskSuggestions.length,
            excellenceCount: pipeline.excellenceSuggestions.length,
          };

          set((state) => {
            // Upsert
            const without = state.snapshots.filter((s) => s.id !== id);
            const withNext = [...without, next];

            // Prune: keep latest MAX_PER_CLASS per class
            const forClass = withNext
              .filter((s) => s.className === className)
              .sort((a, b) => a.date.localeCompare(b.date));

            const pruned =
              forClass.length > MAX_PER_CLASS
                ? forClass.slice(forClass.length - MAX_PER_CLASS)
                : forClass;

            const otherClasses = withNext.filter((s) => s.className !== className);
            return { snapshots: [...otherClasses, ...pruned] };
          });
        },

        getSnapshots: (className) =>
          get()
            .snapshots.filter((s) => s.className === className)
            .sort((a, b) => a.date.localeCompare(b.date)),

        clearClass: (className) =>
          set((state) => ({
            snapshots: state.snapshots.filter((s) => s.className !== className),
          })),
      },
    }),
    { name: 'docentedoc-ai-snapshots' }
  )
);
