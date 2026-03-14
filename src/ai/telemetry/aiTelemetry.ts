/**
 * aiTelemetry.ts — Lightweight AI feature telemetry (Stabilization Pass)
 *
 * Logs key AI interaction events to the console and to a circular in-memory
 * event buffer when AI Experimental Mode is active. All functions are
 * no-ops when beta mode is off, so they are safe to call unconditionally.
 *
 * Beta mode is read directly from localStorage ('ai_beta_mode') so these
 * functions can be called from plain event handlers without requiring a
 * React hook context.
 *
 * Usage:
 *   import { logAIActionTriggered } from '@/ai/telemetry/aiTelemetry'
 *   onClick={() => logAIActionTriggered(action.actionType, student.id)}
 */
import type { CopilotActionType } from '../copilot/actions/types';
import type { AISuggestion } from '../contextEngine/types';

// ── beta gate ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ai_beta_mode';

function isBetaActive(): boolean {
  if (import.meta.env.VITE_AI_BETA === 'true') return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

// ── event buffer (circular, max 200 entries) ──────────────────────────────────

export interface AITelemetryEvent {
  event: string;
  ts: string;
  [key: string]: unknown;
}

const MAX_BUFFER = 200;
const _buffer: AITelemetryEvent[] = [];

function emit(event: AITelemetryEvent): void {
  if (!isBetaActive()) return;
  if (_buffer.length >= MAX_BUFFER) _buffer.shift();
  _buffer.push(event);
   
  console.debug('[AI Telemetry]', event);
}

/** Returns a read-only snapshot of all buffered events. Useful for debugging. */
export function getTelemetryBuffer(): readonly AITelemetryEvent[] {
  return _buffer;
}

/** Clears the in-memory event buffer. */
export function clearTelemetryBuffer(): void {
  _buffer.length = 0;
}

// ── public log functions ──────────────────────────────────────────────────────

/**
 * Fired when an AI suggestion (risk or excellence chip) becomes visible to
 * the teacher for the first time in the current session.
 */
export function logAISuggestionViewed(
  suggestionId: string,
  type: AISuggestion['type'],
): void {
  emit({ event: 'ai_suggestion_viewed', ts: new Date().toISOString(), suggestionId, type });
}

/**
 * Fired when the teacher clicks an action button in CopilotActionsBar
 * (before confirming). Records intent, not completion.
 */
export function logAIActionTriggered(
  actionType: CopilotActionType,
  studentId: string,
): void {
  emit({ event: 'ai_action_triggered', ts: new Date().toISOString(), actionType, studentId });
}

/**
 * Fired when the teacher opens the "Perché?" explainability popover on any
 * ExplainableInsightChip.
 */
export function logAIExplanationOpened(suggestionId: string): void {
  emit({ event: 'ai_explanation_opened', ts: new Date().toISOString(), suggestionId });
}

/**
 * Fired when the PlanningAssistantPanel generates a lesson plan via AI.
 *
 * @param context  A short descriptor of the generation context (e.g. class name + subject).
 */
export function logAILessonGenerated(context: string): void {
  emit({ event: 'ai_lesson_generated', ts: new Date().toISOString(), context });
}
