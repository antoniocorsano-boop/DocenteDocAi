/**
 * TeacherModel — factory functions for the TCM.
 *
 * createEmptyTeacherModel(): returns a zeroed-out initial model (L1).
 * mergeUsageFromAnalytics(): migration path — seeds the model from existing
 *   analyticsMetrics.featuresUsage so returning users don't start at L1.
 */

import type { TeacherModel, UsageProfile } from '../types/teacherModel.types';
import type { AnalyticsMetrics } from '../types/analytics.types';

export function createEmptyTeacherModel(): TeacherModel {
  return {
    capabilityLevel: 1,
    confidenceScore: 0,
    levelUpPending: false,
    dismissedHints: [],
    lastUpdated: Date.now(),
    usageProfile: {
      lessonsCreated: 0,
      assessmentsGenerated: 0,
      materialsUploaded: 0,
      analyticsViews: 0,
      copilotRequests: 0,
      udaCreated: 0,
      exportsGenerated: 0,
      driveConnected: false,
      featuresDiscovered: 0,
      bookServicesLinked: 0,
      externalServicesConnected: 0,
      isPersonalMode: false,
      workspaceConfigured: false,
    },
    pedagogicalProfile: {
      assessmentPreference: 'mixed',
      feedbackStyle: 'brief',
      averageDifficultyLevel: 2,
    },
    workflowPatterns: [],
    copilotInteractionProfile: {
      suggestionsAccepted: 0,
      suggestionsRejected: 0,
      manualPrompts: 0,
      automationEnabled: false,
    },
  };
}

/**
 * Defensive key mapping from free-string analyticsMetrics.featuresUsage keys
 * to TCM UsageProfile fields.
 */
const KEY_MAP: Record<string, keyof UsageProfile> = {
  lesson_created: 'lessonsCreated',
  lesson: 'lessonsCreated',
  assessment_generated: 'assessmentsGenerated',
  assessment: 'assessmentsGenerated',
  material_uploaded: 'materialsUploaded',
  kb_upload: 'materialsUploaded',
  analytics_viewed: 'analyticsViews',
  analytics: 'analyticsViews',
  copilot_request: 'copilotRequests',
  copilot: 'copilotRequests',
  ai_interaction: 'copilotRequests',
  uda_created: 'udaCreated',
  uda: 'udaCreated',
  export_generated: 'exportsGenerated',
  export: 'exportsGenerated',
  feature_discovered: 'featuresDiscovered',
  book_linked: 'bookServicesLinked',
  external_service: 'externalServicesConnected',
};

/**
 * Seeds the TeacherModel from existing analyticsMetrics.
 * Returns a new model — does NOT mutate the input.
 * confidenceScore is set to 0 to require real event data before promotion.
 */
export function mergeUsageFromAnalytics(
  model: TeacherModel,
  metrics: Partial<AnalyticsMetrics>,
): TeacherModel {
  if (!metrics?.featuresUsage) return model;

  const merged = { ...model.usageProfile };

  for (const [rawKey, count] of Object.entries(metrics.featuresUsage)) {
    const normalised = rawKey.toLowerCase().replace(/[^a-z_]/g, '_');
    const field = KEY_MAP[normalised];
    if (field && field !== 'driveConnected' && typeof count === 'number') {
      (merged[field] as number) = Math.max((merged[field] as number), count);
    }
  }

  return {
    ...model,
    usageProfile: merged,
    // Keep confidence at 0 — migration data is approximate
    confidenceScore: 0,
    lastUpdated: Date.now(),
  };
}
