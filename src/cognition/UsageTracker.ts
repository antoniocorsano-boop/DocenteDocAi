/**
 * UsageTracker — listens to CognitionBus and updates UsageProfile.
 *
 * Call init(store) once at app startup (from useCognitionBusEmitter).
 * It registers handlers on the singleton cognitionBus and increments
 * usage counters in the Zustand TeacherModel store.
 */

import { cognitionBus } from './CognitionBus';
import type { UsageProfile, CopilotInteractionProfile } from '../types/teacherModel.types';

export interface UsageTrackingStore {
  updateUsageProfile: (partial: Partial<UsageProfile>) => void;
  updateCopilotProfile: (partial: Partial<CopilotInteractionProfile>) => void;
  getUsageProfile: () => UsageProfile;
  getCopilotProfile: () => CopilotInteractionProfile;
}

let initialized = false;

/** Call once at app startup. Idempotent. */
export function initUsageTracker(store: UsageTrackingStore): void {
  if (initialized) return;
  initialized = true;

  // ── Lezioni ──
  cognitionBus.on('lesson.created', () => {
    const u = store.getUsageProfile();
    store.updateUsageProfile({ lessonsCreated: u.lessonsCreated + 1 });
  });

  // ── Valutazioni ──
  cognitionBus.on('assessment.generated', () => {
    const u = store.getUsageProfile();
    store.updateUsageProfile({ assessmentsGenerated: u.assessmentsGenerated + 1 });
  });
  cognitionBus.on('evaluation.bulk_added', (payload) => {
    const u = store.getUsageProfile();
    store.updateUsageProfile({ assessmentsGenerated: u.assessmentsGenerated + (payload.count ?? 1) });
  });

  // ── Materiali / KB ──
  cognitionBus.on('kb.document.uploaded', () => {
    const u = store.getUsageProfile();
    store.updateUsageProfile({ materialsUploaded: u.materialsUploaded + 1 });
  });

  // ── Analytics ──
  cognitionBus.on('analytics.viewed', () => {
    const u = store.getUsageProfile();
    store.updateUsageProfile({ analyticsViews: u.analyticsViews + 1 });
  });

  // ── Copilot prompts (usage side) ──
  cognitionBus.on('copilot.manual_prompt', () => {
    const u = store.getUsageProfile();
    store.updateUsageProfile({ copilotRequests: u.copilotRequests + 1 });
  });
  cognitionBus.on('ai.interaction', () => {
    const u = store.getUsageProfile();
    store.updateUsageProfile({ copilotRequests: u.copilotRequests + 1 });
  });

  // ── UDA ──
  cognitionBus.on('uda.created', () => {
    const u = store.getUsageProfile();
    store.updateUsageProfile({ udaCreated: u.udaCreated + 1 });
  });

  // ── Export ──
  cognitionBus.on('export.generated', () => {
    const u = store.getUsageProfile();
    store.updateUsageProfile({ exportsGenerated: u.exportsGenerated + 1 });
  });

  // ── Drive ──
  cognitionBus.on('drive.connected', () => {
    store.updateUsageProfile({ driveConnected: true });
  });

  // ── Copilot interaction profile ──
  cognitionBus.on('copilot.suggestion.accepted', () => {
    const p = store.getCopilotProfile();
    store.updateCopilotProfile({ suggestionsAccepted: p.suggestionsAccepted + 1 });
  });
  cognitionBus.on('copilot.suggestion.rejected', () => {
    const p = store.getCopilotProfile();
    store.updateCopilotProfile({ suggestionsRejected: p.suggestionsRejected + 1 });
  });
  cognitionBus.on('copilot.automation.enabled', () => {
    store.updateCopilotProfile({ automationEnabled: true });
  });
}

/** Reset for testing only */
export function _resetUsageTracker(): void {
  initialized = false;
}
