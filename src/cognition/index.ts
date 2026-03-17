/**
 * src/cognition/index.ts — barrel export for the TCM cognition module.
 */

export { cognitionBus } from './CognitionBus';
export type { CognitionEvents } from './CognitionBus';

export { eventMap, getEventMeta, getEventsByPattern, getEventsByType, getCopilotEvents, getPersonalModeEvents } from './eventMap';
export type { AppEvent } from './eventMap';

export { initUsageTracker, _resetUsageTracker } from './UsageTracker';
export type { UsageTrackingStore } from './UsageTracker';

export { initWorkflowPatternDetector, _resetWorkflowDetector } from './WorkflowPatternDetector';
export type { WorkflowStore } from './WorkflowPatternDetector';

export { computeCapability, toJourneyLevel, computeJourneyProgress } from './CapabilityEngine';

export { generateNextActions, generateArtisticNextActions } from './SuggestionEngine';
export type { SuggestionContext } from './SuggestionEngine';

export { createEmptyTeacherModel, mergeUsageFromAnalytics, onSuggestionAccepted, onSuggestionIgnored } from './TeacherModel';

// ── v3: Governance + Logging ──────────────────────────────────────────────────

export {
  DecisionContract,
  validateSuggestion,
  applyContract,
} from './decisionContract';
export type { SuggestionSource, ContractViolation, ValidatableSuggestion } from './decisionContract';

export {
  logEvent,
  getSessionLog,
  replayEvents,
  replayCurrentSession,
  getEventsByType as getLoggedEventsByType,
  getEventsBySource,
  countEvents,
  hasEventOccurred,
  getLastEvent,
  getCurrentSessionId,
  _resetEventLogger,
} from './EventLogger';
export type { LoggedEvent, EventReplay } from './EventLogger';
