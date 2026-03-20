/**
 * orchestration/orchestrationService.ts
 *
 * Il "cervello runtime" che coordina i tre layer fondamentali:
 *   Cognitive Layer  → genera suggerimenti contestuali
 *   Capability System → verifica cosa può fare l'utente
 *   Trust Layer       → verifica integrità della catena audit
 *
 * Design:
 *   - buildContext()   → calcolo ephemeral on-demand (no cache, no store)
 *   - executeAction()  → check permission → crea TrustRecord → dispatch
 *   - Nessuno store aggiuntivo: il context vive solo in memoria finché usato
 *
 * Filtri per ruolo:
 *   TEACHER    → azioni dominio pedagogical | compliance
 *   ADMIN      → tutte le azioni
 *   PRINCIPAL  → tutte le azioni
 */

import './defaultSkills';
import { useCognitiveStore }      from '../cognitiveLayer/cognitiveStore';
import { generateSuggestions }    from '../cognitiveLayer/suggestionEngine';
import { listCapabilities, isCapabilityEnabled } from '../capabilitySystem/capabilityService';
import { useTrustStore }          from '../trustLayer/trustStore';
import { verifyChain, createTrustRecord } from '../trustLayer/trustService';
import { tenantRegistry }         from '../../services/tenant/tenantRegistry';
import { skillRegistry }          from './skillRegistry';
import type { CognitiveSuggestion, CognitiveDomain } from '../cognitiveLayer/types';
import type {
  OrchestrationContext,
  OrchestrationAction,
  OrchestrationOptions,
  ExecuteActionResult,
  TrustStatus,
} from './types';

// ─── Priority mapping ─────────────────────────────────────────────────────────

const PRIORITY_NUMBER: Record<string, number> = {
  critical: 1,
  high:     2,
  medium:   3,
  low:      4,
};

// ─── Role filter ──────────────────────────────────────────────────────────────

/**
 * Domini visibili per ruolo.
 * TEACHER vede solo azioni didattiche e compliance.
 * ADMIN e PRINCIPAL vedono tutto.
 */
const ROLE_ALLOWED_DOMAINS: Record<string, Set<CognitiveDomain>> = {
  TEACHER: new Set(['pedagogical', 'compliance']),
};

function isActionAllowedForRole(domain: CognitiveDomain, role?: string): boolean {
  if (!role || role === 'ADMIN' || role === 'PRINCIPAL') return true;
  const allowed = ROLE_ALLOWED_DOMAINS[role];
  return allowed ? allowed.has(domain) : true;
}

// ─── Trust status ─────────────────────────────────────────────────────────────

async function getTrustStatus(tenantId: string): Promise<TrustStatus> {
  const records = useTrustStore.getState().getByTenant(tenantId);
  if (records.length === 0) return 'empty';
  try {
    const result = await verifyChain(tenantId);
    return result.valid ? 'verified' : 'broken';
  } catch {
    return 'broken';
  }
}

// ─── Suggestion → Action mapper ───────────────────────────────────────────────

function suggestionToAction(s: CognitiveSuggestion): OrchestrationAction | null {
  if (!s.ctaType) return null;
  return {
    id:           s.id,
    label:        s.cta ?? s.title,
    capabilityId: skillRegistry.resolve(s.ctaType)?.capabilityId,
    priority:     PRIORITY_NUMBER[s.priority] ?? 4,
    ctaType:      s.ctaType,
    domain:       s.domain,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Costruisce il contesto di orchestrazione per un input specifico.
 *
 * Il context è ephemeral — ricalcolato ad ogni chiamata (no stale data).
 * Restituisce null se l'entry non viene trovata in store.
 */
export async function buildContext(
  inputId: string,
  opts: OrchestrationOptions,
): Promise<OrchestrationContext | null> {
  const { tenantId, role, maxSuggestions = 10 } = opts;

  // 1. Trova la CognitiveEntry in store
  const entry = useCognitiveStore.getState().entries.find(e => e.id === inputId);
  if (!entry) return null;

  // 2. Ricalcola sempre suggestions (mai da cache)
  const rawSuggestions = generateSuggestions(entry, opts.scheduleContext).slice(0, maxSuggestions);

  // 3. Mappa suggestions → actions (solo quelle con ctaType) e filtra per ruolo
  const actions: OrchestrationAction[] = rawSuggestions
    .map(suggestionToAction)
    .filter((a): a is OrchestrationAction => a !== null)
    .filter(a => isActionAllowedForRole(a.domain, role))
    .sort((a, b) => a.priority - b.priority);

  // 4. Capability del tenant
  const capabilities = listCapabilities(tenantId);

  // 5. Trust status (async)
  const trustStatus = await getTrustStatus(tenantId);

  return {
    inputId,
    suggestions: rawSuggestions,
    actions,
    capabilities,
    trustStatus,
  };
}

/**
 * Esegue un'azione dell'orchestrazione.
 *
 * Pipeline:
 *   1. Verifica capability gate
 *   2. Crea TrustRecord di audit
 *   3. Ritorna risultato
 */
export async function executeAction(
  ctaType: string,
  suggestion: CognitiveSuggestion,
  opts: OrchestrationOptions,
): Promise<ExecuteActionResult> {
  const { tenantId } = opts;
  const ctx = tenantRegistry.getContext();

  // 1. Capability check
  const capabilityId = skillRegistry.resolve(ctaType)?.capabilityId;
  if (capabilityId && !isCapabilityEnabled(tenantId, capabilityId)) {
    return {
      success: false,
      reason:  `Capability '${capabilityId}' non attiva per questo tenant.`,
    };
  }

  // 2. TrustRecord di audit
  try {
    const record = await createTrustRecord({
      eventType:   'DOCUMENT_GENERATED',
      tenantId,
      actorId:     ctx.userId,
      description: `Azione eseguita: ${ctaType} — da suggestion "${suggestion.title}"`,
      payload:     { ctaType, suggestionId: suggestion.id, domain: suggestion.domain },
    });

    return { success: true, trustRecordId: record.id };
  } catch (err) {
    return {
      success: false,
      reason:  err instanceof Error ? err.message : 'Errore durante la creazione del TrustRecord.',
    };
  }
}
