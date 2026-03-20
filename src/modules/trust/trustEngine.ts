/**
 * modules/trust/trustEngine.ts
 *
 * Trust Engine — calcolo puro del modello di fiducia di Jarvis.
 *
 * Tre dimensioni orthogonali:
 *   systemTrust  — quanto Jarvis si fida dei propri algoritmi (0–1)
 *   userTrust    — quanto l'utente ha confermato le azioni Jarvis (0–1)
 *   skillTrust   — per-skill, aggiornato con l'uso effettivo (0–1 ciascuna)
 *
 * Design: zero dipendenze da store o React. Pure computation only.
 * Il TrustScore viene persistito da useTrustStore.
 */

import type { AutoSettingsDelta } from '../autoSettings/autoSettingsEngine';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrustScore {
  /** Confidenza interna nei calcoli del sistema (scende se l'utente corregge). */
  systemTrust: number;                      // 0–1
  /** Fiducia maturata dall'utente verso le azioni automatiche. */
  userTrust:   number;                      // 0–1
  /** Trust granulare per singola skill emergente (skillId → 0–1). */
  skillTrust:  Readonly<Record<string, number>>;
}

export type TrustEvent =
  | { type: 'delta_applied';   deltaId: string; category: string }
  | { type: 'delta_dismissed'; deltaId: string; category: string }
  | { type: 'skill_used';      skillId: string }
  | { type: 'user_corrected' };  // utente ha annullato un'azione automatica

// ─── Constants ────────────────────────────────────────────────────────────────

export const DEFAULT_TRUST: TrustScore = {
  systemTrust: 0.70,
  userTrust:   0.50,
  skillTrust:  {},
};

/** Minimo systemTrust richiesto per azioni su categoria 'automation'. */
export const TRUST_THRESHOLD_AUTOMATION = 0.65;
/** Minimo systemTrust per categorie theme/general. */
export const TRUST_THRESHOLD_THEME      = 0.55;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clamp  = (v: number): number => Math.max(0, Math.min(1, v));
const lerp   = (a: number, b: number, t: number): number => a + (b - a) * t;

// ─── Core functions ───────────────────────────────────────────────────────────

/**
 * Applica un evento al punteggio di trust, restituendo il nuovo stato.
 * Immutabile — non modifica l'oggetto in ingresso.
 */
export function applyTrustEvent(event: TrustEvent, current: TrustScore): TrustScore {
  switch (event.type) {

    case 'delta_applied': {
      // Utente o sistema ha applicato → boost leggero su userTrust
      // Le categorie AI richiedono più coraggio → reward maggiore
      const boost = event.category === 'ai' ? 0.06 : 0.03;
      return {
        ...current,
        userTrust: clamp(current.userTrust + boost),
        // Piccolo miglioramento al systemTrust: le decisioni corrette rinforzano
        systemTrust: clamp(current.systemTrust + 0.01),
      };
    }

    case 'delta_dismissed': {
      // Utente ha rigettato → Jarvis aveva torto sulle preferenze
      const penalty = event.category === 'ai' ? 0.08 : 0.05;
      return {
        ...current,
        userTrust:   clamp(current.userTrust   - penalty),
        systemTrust: clamp(current.systemTrust - 0.02),
      };
    }

    case 'skill_used': {
      const prev = current.skillTrust[event.skillId] ?? 0.50;
      return {
        ...current,
        skillTrust: {
          ...current.skillTrust,
          [event.skillId]: clamp(prev + 0.05),
        },
      };
    }

    case 'user_corrected': {
      // Impatto più forte: l'utente ha dovuto correggere Jarvis esplicitamente
      return {
        ...current,
        systemTrust: clamp(current.systemTrust - 0.12),
        userTrust:   clamp(current.userTrust   - 0.06),
      };
    }

    default:
      return current;
  }
}

/**
 * Confidence effettiva di un delta, modulata dal systemTrust.
 *   systemTrust=1.0 → confidence invariata
 *   systemTrust=0.5 → moltiplicatore = 0.75 (conservative floor = 0.5)
 *
 * In questo modo, se Jarvis ha spesso sbagliato, le sue decisioni future
 * vengono richieste a soglie più alte.
 */
export function effectiveConfidence(base: number, trust: TrustScore): number {
  const FLOOR = 0.50;
  const multiplier = lerp(FLOOR, 1.0, trust.systemTrust);
  return clamp(base * multiplier);
}

/**
 * Un delta è "a basso rischio" se:
 *   – non modifica impostazioni AI (categoria 'ai')
 *   – il systemTrust supera la soglia richiesta per quella categoria
 *
 * Solo i delta low-risk possono essere applicati in modalità stealth totale.
 */
export function isLowRisk(
  delta: Pick<AutoSettingsDelta, 'category' | 'confidence'>,
  trust: TrustScore,
): boolean {
  if (delta.category === 'ai') return false;
  const threshold = delta.category === 'automation'
    ? TRUST_THRESHOLD_AUTOMATION
    : TRUST_THRESHOLD_THEME;
  return trust.systemTrust >= threshold;
}

/**
 * Score composito leggibile [0–100] per mostrare la "salute" del sistema.
 * Utilizzato da JarvisNexus footer per feedback visivo all'utente.
 */
export function trustHealthScore(trust: TrustScore): number {
  return Math.round((trust.systemTrust * 0.6 + trust.userTrust * 0.4) * 100);
}
