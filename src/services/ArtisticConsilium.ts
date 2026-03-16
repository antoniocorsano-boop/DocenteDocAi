/**
 * ArtisticConsilium — AI Artistica Educativa.
 *
 * Generates artistic-educational activity suggestions for teachers, enriching
 * UDA planning and lesson design with creative, interdisciplinary activities.
 *
 * Flow: Cognition → Suggestion → UI
 *   1. Registers CognitionBus listeners for uda.created, planning.wizard.completed,
 *      kb.document.uploaded (low-cost, synchronous quick hints)
 *   2. Exposes generateArtisticSuggestions() for async, rich AI suggestions
 *      (called on demand from the UI, uses the 'artistic.consilium' pipeline)
 *   3. Returns CopilotSuggestion objects compatible with the standard Copilot UI
 *
 * Security: all AI calls route through /api/ai (Vercel Edge proxy) —
 *   no API keys in browser code.
 * Safety: all AI output is sanitized against XSS before surfacing to UI.
 */

import { cognitionBus } from '../cognition/CognitionBus';
import { streamAIToString } from '../ai/orchestrator/StreamingManager';
import type { CopilotSuggestion } from '../types/teacherModel.types';

// ── Types ──────────────────────────────────────────────────────────────────────

/** Input context for AI-driven artistic suggestion generation */
export interface ArtisticContext {
  /** Materia scolastica (es. "Arte", "Musica", "Letteratura italiana") */
  subject?: string;
  /** Livello scolastico (es. "Scuola secondaria di secondo grado, biennio") */
  gradeLevel?: string;
  /** Titolo dell'UDA associata */
  udaTitle?: string;
  /** Obiettivi di apprendimento dell'UDA */
  learningObjectives?: string[];
  /** Attività già pianificate (per evitare duplicati) */
  existingActivities?: string[];
}

/** A single AI-generated artistic activity proposal */
export interface ArtisticSuggestion {
  id: string;
  title: string;
  description: string;
  activityType: 'visual' | 'musical' | 'theatrical' | 'literary' | 'interdisciplinary';
  /** Estimated class time in minutes */
  estimatedMinutes: number;
  materials: string[];
  /** Ready-to-use CopilotSuggestion chip for the Copilot UI */
  copilotSuggestion: CopilotSuggestion;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Sanitizes AI output against XSS */
function sanitize(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildPrompt(context: ArtisticContext): string {
  const lines = [
    'Genera 2 attività artistiche interdisciplinari per questa UDA:',
    context.subject ? `Materia: ${context.subject}` : '',
    context.gradeLevel ? `Livello: ${context.gradeLevel}` : '',
    context.udaTitle ? `UDA: "${context.udaTitle}"` : '',
    context.learningObjectives?.length
      ? `Obiettivi: ${context.learningObjectives.join('; ')}`
      : '',
    context.existingActivities?.length
      ? `Attività già presenti (non duplicare): ${context.existingActivities.join(', ')}`
      : '',
    '',
    'Rispondi con un JSON array. Ogni oggetto deve avere:',
    '  title (string), description (string, 2-3 frasi),',
    '  activityType (visual|musical|theatrical|literary|interdisciplinary),',
    '  estimatedMinutes (number), materials (string[]).',
  ].filter(Boolean);
  return lines.join('\n');
}

/** Parses the JSON array returned by the AI, tolerates markdown fences */
function parseArtisticSuggestions(raw: string): ArtisticSuggestion[] {
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const items = JSON.parse(jsonMatch[0]) as Array<Record<string, unknown>>;
    const VALID_TYPES = ['visual', 'musical', 'theatrical', 'literary', 'interdisciplinary'] as const;

    return items
      .filter((item) => item && typeof item === 'object')
      .map((item, i): ArtisticSuggestion => {
        const title = sanitize(String(item['title'] ?? 'Attività artistica'));
        const description = sanitize(String(item['description'] ?? ''));
        const activityType = VALID_TYPES.includes(item['activityType'] as never)
          ? (item['activityType'] as ArtisticSuggestion['activityType'])
          : 'interdisciplinary';
        const estimatedMinutes =
          typeof item['estimatedMinutes'] === 'number' ? item['estimatedMinutes'] : 30;
        const materials = Array.isArray(item['materials'])
          ? (item['materials'] as unknown[]).map((m) => sanitize(String(m)))
          : [];

        return {
          id: `artistic.ai.${Date.now()}.${i}`,
          title,
          description,
          activityType,
          estimatedMinutes,
          materials,
          copilotSuggestion: {
            id: `artistic.chip.${Date.now()}.${i}`,
            type: 'feature',
            message: `${title} (${estimatedMinutes} min) — ${description}`,
            targetView: 'copilot',
            icon: 'palette',
          },
        };
      })
      .slice(0, 3);
  } catch {
    return [];
  }
}

// ── Public API — async AI generation ──────────────────────────────────────────

/**
 * Generates 1-3 artistic educational activity suggestions via the AI pipeline.
 * Uses the 'artistic.consilium' pipeline (registered in PipelineRegistry).
 *
 * Call from UI on demand (e.g. "Mostra attività artistiche" button).
 */
export async function generateArtisticSuggestions(
  context: ArtisticContext,
): Promise<ArtisticSuggestion[]> {
  const raw = await streamAIToString({
    pipelineId: 'artistic.consilium',
    prompt: buildPrompt(context),
    temperature: 0.7,
    maxTokens: 600,
  }).catch(() => '');

  return parseArtisticSuggestions(raw);
}

/**
 * Synchronous quick hint (no AI call, <1ms).
 * Suitable for CognitionBus handlers where latency must be zero.
 */
export function getQuickArtisticHint(udaTitle?: string): CopilotSuggestion {
  const topic = udaTitle ? `"${sanitize(udaTitle)}"` : 'questa UDA';
  return {
    id: `artistic.quick.${Date.now()}`,
    type: 'feature',
    message: `Il Consilium Artistico può suggerire attività creative per ${topic}. Vuoi provare l'AI Artistica?`,
    targetView: 'copilot',
    icon: 'palette',
  };
}

// ── CognitionBus integration ───────────────────────────────────────────────────

export type ArtisticHintCallback = (hint: CopilotSuggestion) => void;

let _busInitialized = false;

/**
 * Wires ArtisticConsilium to CognitionBus. Idempotent.
 * Call once from app startup (alongside UsageTracker / WorkflowPatternDetector init).
 *
 * @param onHint — callback that surfaces the quick hint in the UI (e.g. CopilotProvider)
 */
export function initArtisticConsilium(onHint: ArtisticHintCallback): void {
  if (_busInitialized) return;
  _busInitialized = true;

  // UDA creation — primary creative trigger
  cognitionBus.on('uda.created', (payload) => {
    onHint(getQuickArtisticHint(payload.udaId));
  });

  // Planning wizard completion — rich planning context, good moment for artistic enrichment
  cognitionBus.on('planning.wizard.completed', () => {
    onHint({
      id: `artistic.planning.${Date.now()}`,
      type: 'workflow',
      message: 'Piano didattico completato! Vuoi arricchirlo con attività artistiche e interdisciplinari?',
      targetView: 'copilot',
      icon: 'palette',
    });
  });

  // KB document uploaded — content might inspire visual/literary activities
  cognitionBus.on('kb.document.uploaded', () => {
    onHint({
      id: `artistic.kb.${Date.now()}`,
      type: 'feature',
      message: 'Documento caricato — il Consilium Artistico può suggerire attività collegate al contenuto.',
      targetView: 'copilot',
      icon: 'auto_stories',
    });
  });
}

/** Reset for testing only */
export function _resetArtisticConsilium(): void {
  _busInitialized = false;
}
