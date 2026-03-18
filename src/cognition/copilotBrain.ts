/**
 * copilotBrain.ts — The Copilot brain: orchestrates state reading + decision making.
 *
 * This module is the SINGLE entry point for UI components and integrations
 * that need "what should the teacher do now?" as a high-level SuggestedAction.
 *
 * Architecture:
 *   - getCopilotPrimaryAction()  → reads ALL state, delegates to getNextAction()
 *   - getTopSecondaryActions()   → same context, returns actions [1..2] via getNextActions()
 *   - mapToSuggested()           → pure mapping NextAction → SuggestedAction
 *
 * Design rules:
 *   - NO new stores (reads from existing Zustand stores via .getState())
 *   - NO duplication of rules (delegates entirely to getNextAction.ts)
 *   - SuggestedAction is the public-surface type; NextAction is the internal type
 *   - Safe to call in non-React contexts (no React hooks used)
 */

import { getNextActions }         from './decisionEngine/getNextAction';
import type { NextAction, NextActionContext } from './decisionEngine/types';
import { decisionMemory }         from './decisionMemory';
import { approvalGate }           from '../services/enterprise';
import { useTeacherModelStore }   from '../stores/useTeacherModelStore';
import { useStudentStore }        from '../stores/useStudentStore';

// ─── Public surface type ──────────────────────────────────────────────────────

/**
 * High-level suggested action returned to UI, chat, and demo consumers.
 * Intentionally simpler than the internal NextAction: no targetTab, no icon, no reason.
 */
export interface SuggestedAction {
  /** Stable identifier (same as underlying NextAction id) */
  id:                string;
  /** Short imperative title shown to the user */
  title:             string;
  /** One-sentence explanation of why this action is recommended */
  description:       string;
  /** Urgency level */
  priority:          'high' | 'medium' | 'low';
  /** Semantic category — matches NextAction.targetView or 'enterprise' */
  type:              string;
  /** True if an explicit HITL approval is required before proceeding */
  requiresApproval?: boolean;
}

// ─── Internal context builder ─────────────────────────────────────────────────

/**
 * Reads all available state sources and assembles a complete NextActionContext.
 * This is the "intelligence gathering" step — done once per call, shared
 * between primary and secondary action computation.
 */
function buildContext(): NextActionContext {
  const { capabilityLevel, usageProfile } = useTeacherModelStore.getState();
  const { students }                      = useStudentStore.getState();
  const dmState                           = decisionMemory.getState();
  const pendingCount                      = approvalGate.getPendingCount();

  return {
    eventNames:       new Set<string>(),   // no EventLogger session in this sync context
    capabilityLevel,
    usage: {
      lessonsCreated:      usageProfile.lessonsCreated,
      udaCreated:          usageProfile.udaCreated,
      copilotRequests:     usageProfile.copilotRequests,
      driveConnected:      usageProfile.driveConnected,
      bookServicesLinked:  usageProfile.bookServicesLinked,
      analyticsViews:      usageProfile.analyticsViews,
      workspaceConfigured: usageProfile.workspaceConfigured,
    },
    hasStudents:      students.filter((s) => !s.isArchived).length > 0,
    pendingApprovals: pendingCount,
    signals:          dmState.signals.map((s) => ({ type: s.type, severity: s.severity })),
    complianceStatus: dmState.complianceStatus,
  };
}

// ─── Mapping: NextAction → SuggestedAction ────────────────────────────────────

function mapToSuggested(action: NextAction): SuggestedAction {
  return {
    id:                action.id,
    title:             action.label,
    description:       action.description,
    priority:          action.priority ?? derivePriority(action),
    type:              action.targetView ?? 'general',
    requiresApproval:  action.requiresApproval,
  };
}

/** Derive a priority for legacy NextActions that predate the priority field */
function derivePriority(action: NextAction): 'high' | 'medium' | 'low' {
  if (action.id.startsWith('da-enterprise-')) return 'high';
  if (action.id === 'da-add-first-student')   return 'high';
  if (action.id === 'da-create-lesson')        return 'medium';
  return 'low';
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns THE ONE recommended action for the current teacher state.
 *
 * Combines:
 *   - DecisionMemory signals + compliance
 *   - Enterprise approval gate (pendingCount)
 *   - Teacher model (capabilityLevel, usageProfile)
 *   - Student store (hasStudents)
 *
 * Maps the internal NextAction to the public SuggestedAction surface.
 *
 * @example
 * const action = getCopilotPrimaryAction();
 * // { id: 'da-enterprise-pending-approval', title: '2 approvazioni in attesa', priority: 'high', ... }
 */
export function getCopilotPrimaryAction(): SuggestedAction {
  const ctx = buildContext();
  const [primary] = getNextActions(ctx, 1);
  return mapToSuggested(primary);
}

/**
 * Returns up to 2 secondary (non-primary) recommended actions.
 *
 * Evaluates the SAME rule set as getCopilotPrimaryAction() but skips the
 * first result — no duplication, no extra rules.
 *
 * @example
 * const [alt1, alt2] = getTopSecondaryActions();
 */
export function getTopSecondaryActions(): SuggestedAction[] {
  const ctx = buildContext();
  const actions = getNextActions(ctx, 3);
  return actions.slice(1).map(mapToSuggested);
}

/**
 * Returns primary + secondaries as a consolidated snapshot.
 * Convenience for components that need all suggestions at once.
 */
export function getCopilotSnapshot(): {
  primary:     SuggestedAction;
  secondaries: SuggestedAction[];
} {
  const ctx = buildContext();
  const actions = getNextActions(ctx, 3);
  return {
    primary:     mapToSuggested(actions[0]),
    secondaries: actions.slice(1).map(mapToSuggested),
  };
}
