/**
 * cognitiveLayer/cognitiveService.ts
 *
 * Orchestratore del layer cognitivo.
 * Flusso: classifyInput → buildEntry → cognitiveStore.addEntry
 *         → generateSuggestions → createTrustRecord → return entry
 *
 * ingestInput() è l'unico punto di ingresso consigliato per alimentare il layer.
 */

import { classifyInput } from './classifier';
import { generateSuggestions } from './suggestionEngine';
import { useCognitiveStore } from './cognitiveStore';
import type {
  CognitiveEntry,
  CognitiveSuggestion,
  CognitiveInputType,
} from './types';
import { createTrustRecord } from '../trustLayer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IngestParams {
  tenantId: string;
  sourceId: string;
  inputType: CognitiveInputType;
  content: string;
  label?: string;
  meta?: Record<string, unknown>;
}

interface IngestResult {
  entry: CognitiveEntry;
  suggestions: CognitiveSuggestion[];
}

// ─── ID helper ────────────────────────────────────────────────────────────────

function cogId(): string {
  return `cog_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Ingesta un input testuale o strutturato nel layer cognitivo.
 *
 * @returns  IngestResult con l'entry classificata e i suggerimenti generati.
 */
export async function ingestInput(params: IngestParams): Promise<IngestResult> {
  const { tenantId, sourceId, inputType, content, label, meta } = params;

  // 1. Classify
  const classification = classifyInput(content);

  // 2. Build entry
  const entry: CognitiveEntry = {
    id: cogId(),
    tenantId,
    inputType,
    domain: classification.domain,
    confidence: classification.confidence,
    content,
    label: label ?? `${classification.domain} — ${inputType}`,
    enteredAt: Date.now(),
    sourceId,
    tags: classification.tags,
    meta: meta ?? {},
  };

  // 3. Persist entry
  useCognitiveStore.getState().addEntry(entry);

  // 4. Generate suggestions (sync, pure)
  const suggestions = generateSuggestions(entry);

  // 5. Trust record (fire-and-forget — non blocca il flusso se fallisce)
  void createTrustRecord({
    eventType: 'AI_ACTION',
    tenantId,
    actorId: sourceId,
    description: `CognitiveLayer ingest — domain:${entry.domain} confidence:${entry.confidence}`,
    payload: {
      cognitiveEntryId: entry.id,
      inputType,
      domain: entry.domain,
      confidence: entry.confidence,
      tags: entry.tags,
    },
  });

  return { entry, suggestions };
}
