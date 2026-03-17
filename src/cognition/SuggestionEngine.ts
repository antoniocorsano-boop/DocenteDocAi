﻿/**
 * SuggestionEngine — generates contextual CopilotSuggestions based on the
 * TeacherModel, current InteractionMode and AI Maturity score.
 *
 * Rules (source: docs/architecture/teacher-cognitive-model.md):
 *  - Max 3 active suggestions returned
 *  - Cooldown: same "type" not re-suggested within 24h (checked via lastUpdated)
 *  - Bridge InteractionMode: praticante+classica → suggest semi-osmotica
 *  - Bridge AI Maturity: score≥40 → include advanced suggestions
 *  - Never gates features — only proactive recommendations
 */

import type { TeacherModel, CopilotSuggestion, JourneyLevel } from '../types/teacherModel.types';
import type { InteractionMode } from '../types/aiMaturita.types';
import { toJourneyLevel } from './CapabilityEngine';
import { generateArtisticSuggestions } from '../services/ArtisticConsilium';
import type { ArtisticSuggestion } from '../services/ArtisticConsilium';

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface SuggestionContext {
  model: TeacherModel;
  interactionMode: InteractionMode;
  aiMaturitaScore: number;
  /** True when teacher is in personal mode (no class assigned yet) */
  isPersonalMode?: boolean;
}

/** Static suggestion catalogue (id is stable for cooldown tracking) */
const CATALOGUE: (CopilotSuggestion & {
  minLevel: JourneyLevel;
  minAiScore?: number;
  /** Only shown when teacher is in personal mode (no class) */
  personalModeOnly?: boolean;
  /** Only shown when at least one book service has been linked */
  requiresBookLinked?: boolean;
})[] = [
  // esploratore suggestions
  {
    id: 'sug-lesson-streak',
    type: 'feature',
    minLevel: 'esploratore',
    message: 'Hai creato le prime lezioni! Prova a registrare anche le presenze per sbloccare gli insight.',
    targetView: 'classroom',
    icon: 'school',
  },
  {
    id: 'sug-try-copilot',
    type: 'feature',
    minLevel: 'esploratore',
    message: 'Il Copilot Docente può generare valutazioni personalizzate. Prova a usarlo nella tab AI.',
    targetView: 'copilot',
    icon: 'smart_toy',
  },
  // praticante suggestions
  {
    id: 'sug-drive-backup',
    type: 'workflow',
    minLevel: 'praticante',
    message: 'I tuoi dati crescono: attiva il backup su Google Drive nelle impostazioni.',
    targetView: 'settings',
    icon: 'cloud_sync',
  },
  {
    id: 'sug-mode-semi-osmotica',
    type: 'automation',
    minLevel: 'praticante',
    message: "Sei pronto per la modalità Semi-osmotica: il Copilot anticipa le tue azioni. Attivala nelle impostazioni AI.",
    targetView: 'settings',
    icon: 'tune',
  },
  {
    id: 'sug-uda-planning',
    type: 'workflow',
    minLevel: 'praticante',
    message: 'Hai completato più UDA! Usa la Pianificazione Annuale per collegare tutto in un percorso.',
    targetView: 'planning',
    icon: 'calendar_month',
  },
  {
    id: 'sug-analytics-insights',
    type: 'feature',
    minLevel: 'praticante',
    minAiScore: 40,
    message: 'Il tuo punteggio AI è alto: esplora la dashboard Analytics per insight predittivi sugli studenti.',
    targetView: 'copilot',
    icon: 'insights',
  },
  // maestro suggestions
  {
    id: 'sug-automation-full',
    type: 'automation',
    minLevel: 'maestro',
    message: "Sei un Maestro: abilita le automazioni complete e lascia che il Copilot lavori in background.",
    targetView: 'copilot',
    icon: 'auto_awesome',
  },
  {
    id: 'sug-mode-osmotica',
    type: 'automation',
    minLevel: 'maestro',
    minAiScore: 60,
    message: "Sei pronto per la modalità Osmotica: il Copilot gestisce tutto in autonomia. Attivala.",
    targetView: 'settings',
    icon: 'psychology',
  },
  // ── Personal Mode / Onboarding ──
  {
    id: 'sug-personal-mode-start',
    type: 'feature',
    minLevel: 'esploratore',
    personalModeOnly: true,
    message: 'Stai lavorando in modalità personale. Crea una UDA o carica risorse nella Knowledge Base — senza bisogno di studenti.',
    targetView: 'planning',
    icon: 'person',
  },
  {
    id: 'sug-add-first-class',
    type: 'workflow',
    minLevel: 'esploratore',
    message: 'Aggiungi la prima classe per sbloccare il registro presenze, le valutazioni e gli insight sugli studenti.',
    targetView: 'classroom',
    icon: 'group_add',
  },
  // ── Integrazioni libro / servizi ──
  {
    id: 'sug-book-integration-uda',
    type: 'workflow',
    minLevel: 'esploratore',
    requiresBookLinked: true,
    message: 'Hai collegato un servizio libro. Integra le risorse digitali direttamente nelle tue UDA!',
    targetView: 'planning',
    icon: 'auto_stories',
  },
  // ── AI Artistica ──
  {
    id: 'sug-artistic-consilium',
    type: 'feature',
    minLevel: 'praticante',
    message: 'Il Consilium Artistico suggerisce attività creative e interdisciplinari per le tue UDA. Prova l\'AI Artistica!',
    targetView: 'copilot',
    icon: 'palette',
  },
];

function isOnCooldown(suggestion: CopilotSuggestion, model: TeacherModel): boolean {
  const age = Date.now() - model.lastUpdated;
  // Simple approximation: if model was recently updated the cooldown is based on session
  // For a full implementation, store dismissal timestamps per suggestion id
  if (model.dismissedHints.includes(suggestion.id)) return true;
  // Apply type-level cooldown based on model's lastUpdated proximity
  return age < COOLDOWN_MS && model.dismissedHints.some((h) => h.startsWith(suggestion.type));
}

export function generateNextActions(ctx: SuggestionContext): CopilotSuggestion[] {
  const { model, interactionMode, aiMaturitaScore, isPersonalMode } = ctx;
  const journeyLevel = toJourneyLevel(model.capabilityLevel);

  const levelOrder: JourneyLevel[] = ['esploratore', 'praticante', 'maestro'];
  const currentIdx = levelOrder.indexOf(journeyLevel);

  const candidates = CATALOGUE.filter((sug) => {
    // Must match current or lower level
    const sugIdx = levelOrder.indexOf(sug.minLevel);
    if (sugIdx > currentIdx) return false;
    // AI maturity requirement
    if (sug.minAiScore !== undefined && aiMaturitaScore < sug.minAiScore) return false;
    // Cooldown
    if (isOnCooldown(sug, model)) return false;
    // Personal mode gate
    if (sug.personalModeOnly && !isPersonalMode) return false;
    // Book integration gate
    if (sug.requiresBookLinked && !(model.usageProfile.bookServicesLinked ?? 0)) return false;
    return true;
  });

  // InteractionMode bridge: boost mode-advancing suggestions for praticante in classica mode
  if (journeyLevel === 'praticante' && interactionMode === 'classica') {
    const modeIdx = candidates.findIndex((s) => s.id === 'sug-mode-semi-osmotica');
    if (modeIdx > 0) {
      const [item] = candidates.splice(modeIdx, 1);
      candidates.unshift(item);
    }
  }
  if (journeyLevel === 'maestro' && interactionMode !== 'osmotica') {
    const modeIdx = candidates.findIndex((s) => s.id === 'sug-mode-osmotica');
    if (modeIdx > 0) {
      const [item] = candidates.splice(modeIdx, 1);
      candidates.unshift(item);
    }
  }

  return candidates.slice(0, 3);
}

// ── Async enrichment with AI-generated artistic suggestions ──────────────────────

function activityTypeToIcon(type: ArtisticSuggestion['activityType']): string {
  const map: Record<ArtisticSuggestion['activityType'], string> = {
    visual: 'palette',
    musical: 'music_note',
    theatrical: 'theater_comedy',
    literary: 'menu_book',
    interdisciplinary: 'auto_awesome',
  };
  return map[type] ?? 'palette';
}

/**
 * Async: calls the Consilium Artistico pipeline and returns TCM-format suggestions.
 * Only runs for praticante or maestro level to avoid unnecessary AI calls.
 * These are merged into nextActions by useJourneyProgress.
 */
export async function generateArtisticNextActions(
  ctx: SuggestionContext,
): Promise<CopilotSuggestion[]> {
  const journeyLevel = toJourneyLevel(ctx.model.capabilityLevel);
  if (journeyLevel === 'esploratore') return [];

  const context = {
    gradeLevel: journeyLevel === 'maestro' ? 'scuola secondaria superiore' : 'scuola secondaria',
    learningObjectives:
      ctx.aiMaturitaScore >= 60
        ? ['interdisciplinarità', 'competenze trasversali', 'creatività']
        : ['arricchimento didattico'],
  };

  const suggestions = await generateArtisticSuggestions(context).catch(() => []);
  return suggestions.map((s) => ({
    id: `sug-artistic.ai.${s.id}`,
    type: 'feature' as const,
    message: `${s.title} (${s.estimatedMinutes}àmin) — ${s.description.slice(0, 80)}`,
    targetView: 'copilot',
    icon: activityTypeToIcon(s.activityType),
  }));
}
