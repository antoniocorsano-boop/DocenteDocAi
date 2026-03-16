/**
 * src/cognition/index.ts — barrel export for the TCM cognition module.
 */

export { cognitionBus } from './CognitionBus';
export type { CognitionEvents } from './CognitionBus';

export { eventMap } from './eventMap';
export type { AppEvent } from './eventMap';

export { initUsageTracker, _resetUsageTracker } from './UsageTracker';
export type { UsageTrackingStore } from './UsageTracker';

export { initWorkflowPatternDetector, _resetWorkflowDetector } from './WorkflowPatternDetector';
export type { WorkflowStore } from './WorkflowPatternDetector';

export { computeCapability, toJourneyLevel, computeJourneyProgress } from './CapabilityEngine';

export { generateNextActions } from './SuggestionEngine';

export { createEmptyTeacherModel, mergeUsageFromAnalytics } from './TeacherModel';
