/**
 * CognitionBus — lightweight mitt-based event bus for the TCM module.
 *
 * This is NOT the global EventBus described in Roadmap STEP 2.
 * When that global bus is implemented, CognitionBus becomes a subscriber.
 *
 * Usage:
 *   import { cognitionBus } from '@/cognition/CognitionBus';
 *   cognitionBus.emit('lesson.created', { lessonId: '123' });
 *   cognitionBus.on('lesson.created', handler);
 */

import mitt from 'mitt';

export type CognitionEvents = {
  // ── Registro / Lezioni ────────────────────────────────────────────────
  'lesson.created': { lessonId?: string };
  'lesson.updated': { lessonId?: string };
  'lesson.deleted': { lessonId?: string };
  'attendance.recorded': { lessonId?: string };
  // ── Valutazioni ───────────────────────────────────────────────────────
  'assessment.generated': { assessmentId?: string };
  'evaluation.added': { studentId?: string };
  'evaluation.bulk_added': { count?: number };
  'rubric.created': { rubricId?: string };
  // ── UDA / Progettazione ───────────────────────────────────────────────
  'uda.created': { udaId?: string };
  'uda.updated': { udaId?: string };
  'planning.wizard.completed': Record<string, never>;
  'annual.plan.created': Record<string, never>;
  // ── Studenti ──────────────────────────────────────────────────────────
  'student.added': { studentId?: string };
  'student.profile.updated': { studentId?: string };
  'student.risk.changed': { studentId?: string; risk?: string };
  // — Crescita classe (milestone)
  'class.first_student_added': { studentId?: string };
  'class.roster.completed': { studentCount?: number };
  // ── Knowledge Base ────────────────────────────────────────────────────
  'kb.document.uploaded': { docId?: string };
  'kb.document.queried': { query?: string };
  // ── AI / Copilot ──────────────────────────────────────────────────────
  'copilot.suggestion.accepted': { suggestionId?: string };
  'copilot.suggestion.rejected': { suggestionId?: string };
  'copilot.manual_prompt': Record<string, never>;
  'copilot.automation.enabled': Record<string, never>;
  'ai.pipeline.completed': { pipeline?: string };
  'ai.interaction': Record<string, never>;
  // ── Drive ─────────────────────────────────────────────────────────────
  'drive.connected': Record<string, never>;
  'drive.backup.saved': Record<string, never>;
  'drive.backup.restored': Record<string, never>;
  // ── Navigazione ───────────────────────────────────────────────────────
  'navigation.view_changed': { from?: string; to?: string };
  // ── Export ────────────────────────────────────────────────────────────
  'export.generated': { format?: 'pdf' | 'csv'; type?: string };
  // ── Analytics ─────────────────────────────────────────────────────────
  'analytics.viewed': Record<string, never>;
  // ── Workspace / Uso personale ─────────────────────────────────────────
  /** Docente aggiorna una preferenza (tema, lingua, layout, privacy…) */
  'teacher.preference.updated': { key?: string; value?: string };
  /** Prima configurazione completata (wizard / onboarding settings) */
  'workspace.configured': Record<string, never>;
  /** Docente raggiunge un'area/feature per la prima volta */
  'feature.discovered': { feature?: string };
  /** Passaggio tra modalità personale e modalità classe */
  'session.mode': { mode?: 'personal' | 'classroom' };
  // ── Libri / Servizi esterni ───────────────────────────────────────────
  /** Collegamento account libro di testo / editore */
  'book.account.linked': { serviceId?: string; bookIsbn?: string; publisher?: string };
  /** Interazione con un servizio libro collegato */
  'book.service.interacted': { serviceId?: string; action?: string; resourceId?: string };
  /** Connessione generica a servizio esterno (LMS, registro, portale PA…) */
  'external.service.connected': { serviceId?: string; serviceType?: string };
  // ── AI Artistica Educativa ────────────────────────────────────────────
  /** Il Consilium Artistico ha generato attività AI per una UDA */
  'artistic.suggestions.generated': { count?: number; subject?: string; gradeLevel?: string };
  // ── Sistema ───────────────────────────────────────────────────────────
  'app.session.started': Record<string, never>;
  'onboarding.completed': Record<string, never>;
};

/** Singleton CognitionBus — import this everywhere */
export const cognitionBus = mitt<CognitionEvents>();
