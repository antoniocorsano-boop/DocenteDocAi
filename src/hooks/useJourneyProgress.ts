/**
 * useJourneyProgress — reads TeacherModel store and returns derived journey data.
 *
 * Returns:
 *   level          — UX-facing JourneyLevel ('esploratore'|'praticante'|'maestro')
 *   capabilityLevel — internal 1–4
 *   progress       — 0.0–1.0 progress within current level band
 *   nextActions    — up to 3 CopilotSuggestion proactive hints
 *   levelUpPending — true when celebration should be shown
 *   confidenceScore — 0.0–1.0 classification confidence
 */

import { useMemo } from 'react';
import { useTeacherModelStore } from '../stores/useTeacherModelStore';
import { useAIMaturitaStore } from '../stores/useAIMaturitaStore';
import {
  toJourneyLevel,
  computeJourneyProgress,
  generateNextActions,
} from '../cognition';
import type { JourneyLevel, CopilotSuggestion, CapabilityLevel } from '../types/teacherModel.types';

export interface JourneyProgress {
  level: JourneyLevel;
  capabilityLevel: CapabilityLevel;
  progress: number;
  nextActions: CopilotSuggestion[];
  levelUpPending: boolean;
  confidenceScore: number;
}

export function useJourneyProgress(): JourneyProgress {
  const model = useTeacherModelStore((s) => ({
    capabilityLevel: s.capabilityLevel,
    confidenceScore: s.confidenceScore,
    levelUpPending: s.levelUpPending,
    dismissedHints: s.dismissedHints,
    lastUpdated: s.lastUpdated,
    usageProfile: s.usageProfile,
    pedagogicalProfile: s.pedagogicalProfile,
    workflowPatterns: s.workflowPatterns,
    copilotInteractionProfile: s.copilotInteractionProfile,
  }));

  const interactionMode = useAIMaturitaStore((s) => s.interactionMode);
  const aiMaturitaScore = useAIMaturitaStore((s) => s.globalScore);

  return useMemo(() => {
    const level = toJourneyLevel(model.capabilityLevel);
    const progress = computeJourneyProgress(model);
    const nextActions = generateNextActions({ model, interactionMode, aiMaturitaScore });

    return {
      level,
      capabilityLevel: model.capabilityLevel,
      progress,
      nextActions,
      levelUpPending: model.levelUpPending,
      confidenceScore: model.confidenceScore,
    };
  }, [model, interactionMode, aiMaturitaScore]);
}
