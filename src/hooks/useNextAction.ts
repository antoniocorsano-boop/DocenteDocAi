/**
 * useNextAction.ts — React hook bridging stores → Decision Engine.
 *
 * Architecture:
 *   - Reads TeacherModel store (persistent usage state, capability level)
 *   - Reads EventLogger session log (in-session event names)
 *   - Feeds both into `getNextAction(ctx)` — the pure decision function
 *   - Result is memoized: only recomputes when inputs change
 *
 * All UI components that need to know "what to do next" MUST use this hook.
 * No component may contain its own "next step" logic.
 *
 * @example
 * function MyBanner() {
 *   const action = useNextAction();
 *   if (!action) return null;
 *   return <Box>{action.label}</Box>;
 * }
 */

import { useMemo } from 'react';
import { useTeacherModelStore } from '../stores/useTeacherModelStore';
import { getSessionLog } from '../cognition/EventLogger';
import { getNextAction } from '../cognition/decisionEngine/getNextAction';
import type { NextAction, NextActionContext } from '../cognition/decisionEngine/types';
import type { CapabilityLevel } from '../types/teacherModel.types';

export function useNextAction(): NextAction {
  // ── Persistent model state ──────────────────────────────────────────────
  const capabilityLevel = useTeacherModelStore((s) => s.capabilityLevel) as CapabilityLevel;
  const usageProfile = useTeacherModelStore((s) => s.usageProfile);

  // ── Session event names (in-memory, not persisted) ──────────────────────
  // getSessionLog() is synchronous and cheap — returns the current in-memory log.
  // We call it inside useMemo so React re-renders only when model state changes
  // (since EventLogger is not a React store, new events won't trigger re-renders
  //  on their own — the TeacherModel update will co-occur with events that matter).
  const action = useMemo((): NextAction => {
    const sessionLog = getSessionLog();
    const eventNames = new Set(sessionLog.map((e) => e.event as string));

    const ctx: NextActionContext = {
      eventNames,
      capabilityLevel,
      usage: {
        lessonsCreated:     usageProfile.lessonsCreated,
        udaCreated:         usageProfile.udaCreated,
        copilotRequests:    usageProfile.copilotRequests,
        driveConnected:     usageProfile.driveConnected,
        bookServicesLinked: usageProfile.bookServicesLinked,
        analyticsViews:     usageProfile.analyticsViews,
        workspaceConfigured: usageProfile.workspaceConfigured,
      },
      hasStudents: usageProfile.lessonsCreated > 0 || usageProfile.udaCreated > 0,
    };

    return getNextAction(ctx);
  }, [capabilityLevel, usageProfile]);

  return action;
}
