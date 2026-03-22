/**
 * modules/orchestration/CognitiveStyleEngine.ts — P39
 *
 * Cognitive Relationship Layer.
 * Answers: "How does this user think and make decisions?"
 *
 * Derived incrementally from behavioural signals already tracked:
 *   - revealClicks       → wants depth (structure↑, exploration↑)
 *   - deepModeRatio      → prefers deliberate pace (structure↑)
 *   - suggestionAccept   → comfortable with guidance (autonomy↓)
 *   - blockedStateRatio  → needs more support (autonomy↓, structure↑)
 *
 * Design principles:
 *   - No ML. Pure heuristic, fully explainable.
 *   - Light bias, not aggressive override — user always feels in control.
 *   - Plug-in on top of EmotionalEngine: strategy → applyStyleBias.
 */

import type { EmotionalStrategy } from './EmotionalEngine';
import type { Mode }               from './ModeEngine';

// ── Types ─────────────────────────────────────────────────────────────────────

export type StyleLevel = 'low' | 'medium' | 'high';
export type SpeedPref  = 'fast' | 'balanced' | 'deliberate';

export interface CognitiveStyle {
  /** Preference for structured, step-by-step responses */
  structure:       StyleLevel;
  /** How much the user wants to self-direct vs. be guided */
  autonomy:        StyleLevel;
  /** Pace preference derived from mode usage */
  speedPreference: SpeedPref;
  /** Curiosity / willingness to browse alternatives */
  exploration:     StyleLevel;
}

/** Raw behavioural counters driving style derivation */
export interface CognitiveStyleSignals {
  revealClicks:          number;  // clicks on "approfondisci" / reveal button
  deepModeUsageCount:    number;  // times deep / manual mode was used
  fastModeUsageCount:    number;  // times fast mode was used
  totalTurns:            number;  // total messages sent
  suggestionAccepted:    number;  // accepted mode suggestions
  suggestionRejected:    number;  // rejected mode suggestions
  blockedTurns:          number;  // turns where emotional state was 'blocked'
}

// ── Factories ─────────────────────────────────────────────────────────────────

export function createCognitiveStyle(): CognitiveStyle {
  return {
    structure:       'medium',
    autonomy:        'medium',
    speedPreference: 'balanced',
    exploration:     'medium',
  };
}

export function createCognitiveStyleSignals(): CognitiveStyleSignals {
  return {
    revealClicks:       0,
    deepModeUsageCount: 0,
    fastModeUsageCount: 0,
    totalTurns:         0,
    suggestionAccepted: 0,
    suggestionRejected: 0,
    blockedTurns:       0,
  };
}

// ── Derivation ────────────────────────────────────────────────────────────────

function toLevel(score: number): StyleLevel {
  return score >= 0.6 ? 'high' : score >= 0.3 ? 'medium' : 'low';
}

/**
 * Derives a new CognitiveStyle from cumulative signals.
 * Called after each turn; blends with the existing style (EWA smoothing).
 */
export function deriveStyle(
  signals: CognitiveStyleSignals,
  current: CognitiveStyle,
): CognitiveStyle {
  const t = Math.max(signals.totalTurns, 1);

  // structure: reveal clicks + blocked ratio
  const structureScore =
    Math.min(1, signals.revealClicks / 5) * 0.5 +
    (signals.blockedTurns / t) * 0.5;

  // autonomy: high suggestion rejection + low blocked turns
  const acceptRatio    = signals.suggestionAccepted / Math.max(signals.suggestionAccepted + signals.suggestionRejected, 1);
  const autonomyScore  = (1 - acceptRatio) * 0.6 + (1 - signals.blockedTurns / t) * 0.4;

  // exploration: reveal clicks + proportion of non-fast turns
  const nonFastRatio     = 1 - signals.fastModeUsageCount / t;
  const explorationScore = Math.min(1, signals.revealClicks / 3) * 0.5 + nonFastRatio * 0.5;

  // speedPreference: deep vs fast ratio
  const deepRatio = signals.deepModeUsageCount / t;
  const fastRatio = signals.fastModeUsageCount / t;
  const speedPreference: SpeedPref =
    deepRatio > 0.4  ? 'deliberate' :
    fastRatio > 0.5  ? 'fast'       : 'balanced';

  const nextStructure   = toLevel(structureScore);
  const nextAutonomy    = toLevel(autonomyScore);
  const nextExploration = toLevel(explorationScore);

  // Exponential weighted average: keep 70% of current, blend 30% new
  // (for string levels convert to number and back)
  const LEVEL_NUM: Record<StyleLevel, number> = { low: 0, medium: 1, high: 2 };
  const NUM_LEVEL: StyleLevel[] = ['low', 'medium', 'high'];

  function blend(prev: StyleLevel, next: StyleLevel): StyleLevel {
    const blended = LEVEL_NUM[prev] * 0.7 + LEVEL_NUM[next] * 0.3;
    return NUM_LEVEL[Math.round(blended)] ?? 'medium';
  }

  return {
    structure:       blend(current.structure,    nextStructure),
    autonomy:        blend(current.autonomy,     nextAutonomy),
    speedPreference: t < 5 ? current.speedPreference : speedPreference,
    exploration:     blend(current.exploration,  nextExploration),
  };
}

// ── Strategy overlay ──────────────────────────────────────────────────────────

/**
 * Applies a light cognitive-style bias on top of the emotional strategy.
 * Never overrides emotional safety signals (reassuring tone stays).
 */
export function applyStyleBias(
  strategy: EmotionalStrategy,
  style:    CognitiveStyle,
): EmotionalStrategy {
  const result = { ...strategy };

  // High structure → always lead or suggest, never "none" guidance for guided users
  if (style.structure === 'high' && style.autonomy === 'low' && result.guidance === 'none') {
    result.guidance = 'suggest';
  }

  // High autonomy + high structure → deeper content, no need for hand-holding
  if (style.autonomy === 'high' && style.structure === 'high') {
    if (result.depth === 'light')  result.depth     = 'medium';
    if (result.uiDensity === 'low') result.uiDensity = 'medium';
  }

  // Fast speed preference → prefer lighter depth when emotional state allows
  if (style.speedPreference === 'fast' && strategy.tone !== 'reassuring') {
    if (result.depth === 'deep') result.depth = 'medium';
    // Raise maxBlocks ceiling for fast users (they scroll, they know what they want)
    if (!result.maxBlocks) result.maxBlocks = 6;
  }

  // High exploration → lift maxBlocks so more content is visible by default
  if (style.exploration === 'high' && !result.maxBlocks) {
    result.maxBlocks = 6;
  }

  return result;
}

// ── System prompt section ─────────────────────────────────────────────────────

export function buildStyleSection(style: CognitiveStyle): string {
  const lines: string[] = [];

  if (style.structure === 'high') {
    lines.push('STRUTTURA: Organizza la risposta in punti o step numerati. '
      + "Mantieni flusso lineare. L'utente preferisce chiarezza strutturale.");
  }

  if (style.autonomy === 'low') {
    lines.push("GUIDA ESPLICITA: Questo utente preferisce essere accompagnato. "
      + "Indica sempre il passo successivo in modo chiaro e diretto.");
  } else if (style.autonomy === 'high') {
    lines.push("AUTONOMIA: Questo utente preferisce decidere da solo. "
      + "Esponi le opzioni, non imporre una direzione.");
  }

  if (style.speedPreference === 'fast') {
    lines.push("RITMO: Rispondi in modo conciso. Massimo 2 paragrafi prima di un'azione proposta.");
  } else if (style.speedPreference === 'deliberate') {
    lines.push("PROFONDITÀ: L'utente apprezza il ragionamento esteso. Includi motivazioni e contesto.");
  }

  if (style.exploration === 'high') {
    lines.push("ESPLORAZIONE: Proponi varianti o angolature alternative quando rilevante.");
  }

  return lines.join('\n');
}

// ── Mode feedback ─────────────────────────────────────────────────────────────

/**
 * Returns a style signal update based on the mode used this turn.
 */
export function recordModeUsage(
  signals: CognitiveStyleSignals,
  mode:    Mode,
  isBlocked: boolean,
): CognitiveStyleSignals {
  return {
    ...signals,
    totalTurns:         signals.totalTurns + 1,
    deepModeUsageCount: (mode === 'deep' || mode === 'manual') ? signals.deepModeUsageCount + 1 : signals.deepModeUsageCount,
    fastModeUsageCount: mode === 'fast' ? signals.fastModeUsageCount + 1 : signals.fastModeUsageCount,
    blockedTurns:       isBlocked ? signals.blockedTurns + 1 : signals.blockedTurns,
  };
}
