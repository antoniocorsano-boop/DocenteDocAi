// runtime/audit/driftDetector.ts
// Rileva la deriva (drift) del compliance score confrontando run production_live successivi.

import type { AuditRun, DriftReport } from "./types";

/** Delta minimo di punti per considerare un cambiamento significativo */
const SIGNIFICANCE_THRESHOLD = 2;

/**
 * Analizza la storia degli audit e calcola il drift del compliance score.
 * Confronta il run production_live più recente con quello precedente.
 * I run di simulazione (scenario diverso da "production_live") sono esclusi.
 *
 * @param runs  Lista completa dei run nello store (più recenti in testa)
 */
export function detectDrift(runs: AuditRun[]): DriftReport {
  const liveRuns = runs.filter(r => r.scenarioId === "production_live");

  if (liveRuns.length === 0) {
    return {
      status:        "stable",
      delta:          0,
      recentScore:    0,
      previousScore:  null,
      message:        "Nessun audit live registrato — esegui il primo audit in produzione.",
    };
  }

  const recent   = liveRuns[0];
  const previous = liveRuns[1] ?? null;

  if (!previous) {
    return {
      status:        "stable",
      delta:          0,
      recentScore:    recent.score,
      previousScore:  null,
      message:        `Baseline stabilita a ${recent.score}/100 — esegui altri audit per rilevare il trend.`,
    };
  }

  const delta = recent.score - previous.score;

  if (delta > SIGNIFICANCE_THRESHOLD) {
    return {
      status:        "improving",
      delta,
      recentScore:    recent.score,
      previousScore:  previous.score,
      message:        `Score migliorato di +${delta} pts (${previous.score} → ${recent.score}).`,
    };
  }

  if (delta < -SIGNIFICANCE_THRESHOLD) {
    return {
      status:        "degrading",
      delta,
      recentScore:    recent.score,
      previousScore:  previous.score,
      message:        `Score degradato di ${Math.abs(delta)} pts (${previous.score} → ${recent.score}) — verificare le ultime modifiche.`,
    };
  }

  return {
    status:        "stable",
    delta,
    recentScore:    recent.score,
    previousScore:  previous.score,
    message:        `Score stabile (Δ${delta >= 0 ? "+" : ""}${delta}) rispetto all'audit precedente.`,
  };
}
