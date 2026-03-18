/**
 * agentOrchestrator.ts — Runs all agents and merges results.
 *
 * Responsibilities:
 *   - Call each agent with the shared AgentContext
 *   - Deduplicate by actionKey (first occurrence wins)
 *   - Sort by priority descending
 *   - Cap output at MAX_SUGGESTIONS to avoid cognitive overload
 *
 * Architecture: pure function — no side effects, no store reads.
 * All context is passed in by the caller (useAgentSuggestions hook).
 */

import type { AgentContext, AgentSuggestion } from './types';
import { runRegulatoryAgent }        from './regulatoryAgent';
import { runFinancialAgent }         from './financialAgent';
import { runIntegrationAgent }       from './integrationAgent';
import { runOnboardingAgent }        from './onboardingAgent';
import { runAnalyticsAgent }         from './analyticsAgent';
import { runArtisticCulturalAgent }  from './artisticCulturalAgent';

/** Maximum number of agent suggestions surfaced at once */
const MAX_SUGGESTIONS = 4;

/**
 * Run all agents and return merged, deduplicated, priority-sorted suggestions.
 * Capped at MAX_SUGGESTIONS to minimize cognitive load.
 */
export function runAllAgents(ctx: AgentContext): AgentSuggestion[] {
  const raw: AgentSuggestion[] = [
    ...runOnboardingAgent(ctx),       // highest priority — setup first
    ...runRegulatoryAgent(ctx),
    ...runIntegrationAgent(ctx),
    ...runFinancialAgent(ctx),
    ...runAnalyticsAgent(ctx),
    ...runArtisticCulturalAgent(ctx), // lowest gate — needs praticante+
  ];

  // Deduplicate by actionKey — first occurrence wins (agents ordered by importance)
  const seenActionKeys = new Set<string>();
  const deduped = raw.filter((s) => {
    if (seenActionKeys.has(s.actionKey)) return false;
    seenActionKeys.add(s.actionKey);
    return true;
  });

  // Sort by priority descending
  deduped.sort((a, b) => b.priority - a.priority);

  return deduped.slice(0, MAX_SUGGESTIONS);
}
