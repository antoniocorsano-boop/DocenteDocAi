/**
 * eventMap.ts — Canonical event registry for the Teacher Cognitive Model.
 *
 * Every trackable AppEvent is listed here with:
 *   - name: matches CognitionEvents key
 *   - source: functional module that emits it
 *   - type: 'userAction' | 'systemAction' | 'copilotInteraction'
 *   - frequency: expected emission rate
 *   - patterns: which WorkflowPatterns this event participates in
 *
 * This is the single source of truth for TCM analytics and debug tooling.
 */

export interface AppEvent {
  name: string;
  source: string;
  payload: Record<string, unknown>;
  type: 'userAction' | 'systemAction' | 'copilotInteraction';
  frequency: 'rare' | 'occasional' | 'frequent';
  patterns?: string[];
}

export const eventMap: AppEvent[] = [
  // ── REGISTRO / LEZIONI ──────────────────────────────────────────────────
  {
    name: 'lesson.created',
    source: 'Classroom/Register',
    payload: { lessonId: 'string' },
    type: 'userAction',
    frequency: 'frequent',
    patterns: ['lessonWorkflow'],
  },
  {
    name: 'lesson.updated',
    source: 'Classroom/Register',
    payload: { lessonId: 'string' },
    type: 'userAction',
    frequency: 'frequent',
    patterns: ['lessonWorkflow'],
  },
  {
    name: 'lesson.deleted',
    source: 'Classroom/Register',
    payload: { lessonId: 'string' },
    type: 'userAction',
    frequency: 'occasional',
  },
  {
    name: 'attendance.recorded',
    source: 'Classroom/Register',
    payload: { lessonId: 'string' },
    type: 'userAction',
    frequency: 'frequent',
    patterns: ['lessonWorkflow'],
  },

  // ── VALUTAZIONI ─────────────────────────────────────────────────────────
  {
    name: 'assessment.generated',
    source: 'Copilot/Assessment',
    payload: { assessmentId: 'string' },
    type: 'copilotInteraction',
    frequency: 'occasional',
    patterns: ['assessmentWorkflow'],
  },
  {
    name: 'evaluation.added',
    source: 'Classroom/Grades',
    payload: { studentId: 'string' },
    type: 'userAction',
    frequency: 'frequent',
    patterns: ['assessmentWorkflow'],
  },
  {
    name: 'evaluation.bulk_added',
    source: 'Classroom/Grades',
    payload: { count: 'number' },
    type: 'userAction',
    frequency: 'occasional',
    patterns: ['assessmentWorkflow'],
  },
  {
    name: 'rubric.created',
    source: 'Copilot/Rubric',
    payload: { rubricId: 'string' },
    type: 'copilotInteraction',
    frequency: 'occasional',
    patterns: ['assessmentWorkflow'],
  },

  // ── UDA / PROGETTAZIONE ─────────────────────────────────────────────────
  {
    name: 'uda.created',
    source: 'Planning/UDA',
    payload: { udaId: 'string' },
    type: 'userAction',
    frequency: 'occasional',
    patterns: ['planningWorkflow'],
  },
  {
    name: 'uda.updated',
    source: 'Planning/UDA',
    payload: { udaId: 'string' },
    type: 'userAction',
    frequency: 'frequent',
    patterns: ['planningWorkflow'],
  },
  {
    name: 'planning.wizard.completed',
    source: 'Planning/Wizard',
    payload: {},
    type: 'userAction',
    frequency: 'occasional',
    patterns: ['planningWorkflow'],
  },
  {
    name: 'annual.plan.created',
    source: 'Planning/Annual',
    payload: {},
    type: 'userAction',
    frequency: 'rare',
    patterns: ['planningWorkflow'],
  },

  // ── STUDENTI ────────────────────────────────────────────────────────────
  {
    name: 'student.added',
    source: 'Classroom/Students',
    payload: { studentId: 'string' },
    type: 'userAction',
    frequency: 'occasional',
  },
  {
    name: 'student.profile.updated',
    source: 'Classroom/Students',
    payload: { studentId: 'string' },
    type: 'userAction',
    frequency: 'occasional',
  },
  {
    name: 'student.risk.changed',
    source: 'AI/Prediction',
    payload: { studentId: 'string', risk: 'string' },
    type: 'systemAction',
    frequency: 'occasional',
    patterns: ['analysisWorkflow'],
  },

  // ── KNOWLEDGE BASE ───────────────────────────────────────────────────────
  {
    name: 'kb.document.uploaded',
    source: 'KnowledgeBase',
    payload: { docId: 'string' },
    type: 'userAction',
    frequency: 'occasional',
  },
  {
    name: 'kb.document.queried',
    source: 'KnowledgeBase',
    payload: { query: 'string' },
    type: 'userAction',
    frequency: 'frequent',
    patterns: ['analysisWorkflow'],
  },

  // ── AI / COPILOT ─────────────────────────────────────────────────────────
  {
    name: 'copilot.suggestion.accepted',
    source: 'Copilot',
    payload: { suggestionId: 'string' },
    type: 'copilotInteraction',
    frequency: 'occasional',
  },
  {
    name: 'copilot.suggestion.rejected',
    source: 'Copilot',
    payload: { suggestionId: 'string' },
    type: 'copilotInteraction',
    frequency: 'occasional',
  },
  {
    name: 'copilot.manual_prompt',
    source: 'Copilot',
    payload: {},
    type: 'copilotInteraction',
    frequency: 'frequent',
  },
  {
    name: 'copilot.automation.enabled',
    source: 'Copilot/Settings',
    payload: {},
    type: 'userAction',
    frequency: 'rare',
  },
  {
    name: 'ai.pipeline.completed',
    source: 'AI/Pipeline',
    payload: { pipeline: 'string' },
    type: 'systemAction',
    frequency: 'occasional',
  },
  {
    name: 'ai.interaction',
    source: 'AI',
    payload: {},
    type: 'copilotInteraction',
    frequency: 'frequent',
  },

  // ── DRIVE ────────────────────────────────────────────────────────────────
  {
    name: 'drive.connected',
    source: 'Settings/Cloud',
    payload: {},
    type: 'userAction',
    frequency: 'rare',
    patterns: ['driveWorkflow'],
  },
  {
    name: 'drive.backup.saved',
    source: 'Settings/Cloud',
    payload: {},
    type: 'userAction',
    frequency: 'occasional',
    patterns: ['driveWorkflow'],
  },
  {
    name: 'drive.backup.restored',
    source: 'Settings/Cloud',
    payload: {},
    type: 'userAction',
    frequency: 'rare',
    patterns: ['driveWorkflow'],
  },

  // ── NAVIGAZIONE ──────────────────────────────────────────────────────────
  {
    name: 'navigation.view_changed',
    source: 'Navigation',
    payload: { from: 'string', to: 'string' },
    type: 'userAction',
    frequency: 'frequent',
  },

  // ── EXPORT ───────────────────────────────────────────────────────────────
  {
    name: 'export.generated',
    source: 'Export',
    payload: { format: 'pdf|csv', type: 'string' },
    type: 'userAction',
    frequency: 'occasional',
  },

  // ── ANALYTICS ────────────────────────────────────────────────────────────
  {
    name: 'analytics.viewed',
    source: 'Analytics/Dashboard',
    payload: {},
    type: 'userAction',
    frequency: 'occasional',
    patterns: ['analysisWorkflow'],
  },

  // ── SISTEMA ──────────────────────────────────────────────────────────────
  {
    name: 'app.session.started',
    source: 'App',
    payload: {},
    type: 'systemAction',
    frequency: 'frequent',
  },
  {
    name: 'onboarding.completed',
    source: 'Onboarding',
    payload: {},
    type: 'userAction',
    frequency: 'rare',
  },
];
