/**
 * orchestration/patternDetector.ts
 *
 * Rilevamento leggero di pattern sulle azioni dell'utente.
 *
 * Mantiene un log in memoria (max 20 voci) delle azioni eseguite attraverso
 * il ThumbMenu / executeAction. Se la stessa azione viene ripetuta ≥ 3 volte
 * negli ultimi 15 minuti, viene restituito un DetectedPattern come candidato
 * per la creazione di una skill emergente.
 *
 * Design:
 *  – Singleton module-level (no store Zustand — dati effimeri)
 *  – Puro sync — no side-effect
 *  – Non persiste: si azzera a ogni reload (intentional)
 */

import type { CognitiveDomain } from '../cognitiveLayer/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActionLog {
  /** ctaType dell'azione eseguita (es. 'OPEN_REGISTER') */
  ctaType:   string;
  /** Dominio della entry contestuale */
  domain?:   CognitiveDomain;
  /** Tag della entry contestuale */
  tags?:     string[];
  /** Epoch ms dell'esecuzione */
  timestamp: number;
}

export interface DetectedPattern {
  /** ctaType ripetuto */
  ctaType:    string;
  /** Dominio più frequente nelle ripetizioni */
  domain?:    CognitiveDomain;
  /** Unione dei tag delle ripetizioni */
  tags:       string[];
  /** Numero di volte rilevate nella finestra */
  count:      number;
  /** Timestamp dell'ultima occorrenza */
  lastSeenAt: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const MAX_LOG_SIZE       = 20;
const PATTERN_WINDOW_MS  = 15 * 60 * 1_000;  // 15 minuti
const MIN_REPEAT_COUNT   = 3;
const DYNAMIC_PREFIX     = 'DYNAMIC_SKILL::';  // evita self-loop

// ─── State ────────────────────────────────────────────────────────────────────

let _log: ActionLog[] = [];

// ─── API ──────────────────────────────────────────────────────────────────────

/**
 * Registra un'azione eseguita.
 * Chiamare da useThumbMenu.handleSelect dopo ogni esecuzione riuscita.
 */
export function recordAction(entry: ActionLog): void {
  _log = [..._log, entry].slice(-MAX_LOG_SIZE);
}

/**
 * Analizza il log e restituisce il primo pattern rilevabile, o null.
 *
 * Pattern = stesso ctaType ripetuto ≥ MIN_REPEAT_COUNT volte nella finestra.
 * I ctaType DYNAMIC_SKILL:: vengono ignorati per prevenire self-loop.
 */
export function detectPattern(): DetectedPattern | null {
  const cutoff = Date.now() - PATTERN_WINDOW_MS;
  const recent = _log.filter(e => e.timestamp >= cutoff && !e.ctaType.startsWith(DYNAMIC_PREFIX));

  if (recent.length < MIN_REPEAT_COUNT) return null;

  // Raggruppa per ctaType
  const buckets = new Map<string, ActionLog[]>();
  for (const entry of recent) {
    const list = buckets.get(entry.ctaType) ?? [];
    list.push(entry);
    buckets.set(entry.ctaType, list);
  }

  for (const [ctaType, entries] of buckets) {
    if (entries.length < MIN_REPEAT_COUNT) continue;

    const last = entries[entries.length - 1];
    const tags = [...new Set(entries.flatMap(e => e.tags ?? []))];

    // Dominio più frequente fra le occorrenze (default: domain dell'ultima)
    const domainFreq = new Map<string, number>();
    for (const e of entries) {
      if (e.domain) domainFreq.set(e.domain, (domainFreq.get(e.domain) ?? 0) + 1);
    }
    const topDomain = [...domainFreq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] as CognitiveDomain | undefined;

    return {
      ctaType,
      domain:     topDomain ?? last.domain,
      tags,
      count:      entries.length,
      lastSeenAt: last.timestamp,
    };
  }

  return null;
}

/**
 * Svuota il log.
 * Chiamare dopo conferma o dismissal di una skill per evitare re-trigger.
 */
export function clearActionLog(): void {
  _log = [];
}

/** Snapshot di sola lettura del log (per debug / test). */
export function getActionLog(): readonly ActionLog[] {
  return _log;
}
