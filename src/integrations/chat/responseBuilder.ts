/**
 * responseBuilder.ts — Builds structured chat responses with contextual CTAs.
 *
 * Pure/isomorphic: no store imports, no browser APIs.
 * Safe to use in both Edge Functions (api/) and client-side code.
 *
 * Usage:
 *   // In edge functions (api/webhook-*.ts):
 *   const reply = buildEdgeResponse(intent, confirmText, suggestions);
 *
 *   // In client-side action subscribers:
 *   const reply = buildActionResponse(result, intent.source);
 */

import type { ParsedIntent, ChatResponse } from '../../types/integration.types';
import type { ActionResult } from './actionRouter';

// ─── CTA catalogue ────────────────────────────────────────────────────────────

/** Default quick-reply suggestions per intent action */
const DEFAULT_CTAs: Record<string, string[]> = {
    create_class:      ['Aggiungi studenti', 'Mostra classi', 'Crea UDA'],
    add_student:       ['Aggiungi un altro', 'Mostra studenti', 'Crea UDA'],
    import_students:   ['Apri app', 'Mostra classi', 'Annulla'],
    classroom_import:  ['Apri impostazioni', 'Mostra classi', 'Aiuto'],
    drive_sync:        ['Apri app', 'Mostra studenti', 'Stato backup'],
    create_uda:        ['Apri app', 'Mostra classi', 'Aggiungi evento'],
    schedule_event:    ['Aggiungi altro evento', 'Mostra studenti', 'Cosa devo fare'],
    mark_attendance:   ['Apri app', 'Mostra studenti', 'Cosa devo fare'],
    add_evaluation:    ['Aggiungi voto', 'Mostra studenti', 'Cosa devo fare'],
    show_students:     ['Mostra classi', 'Aggiungi studente', 'Crea UDA'],
    show_class:        ['Mostra studenti', 'Crea classe', 'Crea UDA'],
    generate_content:  ['Apri app', 'Crea UDA', 'Cosa devo fare'],
    unknown:           ['Cosa devo fare', 'Mostra studenti', 'Crea classe'],
};

const APP_OPEN_CTA = 'Apri DocenteDoc AI';

// ─── Edge function response (server-side, after parseIntent) ──────────────────

/**
 * Builds the chat reply for edge functions that have already parsed intent
 * but cannot execute store actions.
 *
 * @param intent     - Result of commandInterpreter.parseIntent()
 * @param message    - Confirmation message from buildConfirmationMessage()
 * @param suggestions - Suggestions from getSuggestions()
 */
export function buildEdgeResponse(
    intent: ParsedIntent,
    message: string,
    suggestions: string[]
): ChatResponse {
    const prefix = intent.action === 'unknown' ? '❓ ' : '✅ ';
    const ctaList = suggestions.length > 0 ? suggestions : (DEFAULT_CTAs[intent.action] ?? DEFAULT_CTAs.unknown);

    return {
        text: prefix + message,
        suggestions: ctaList.slice(0, 3),
    };
}

// ─── Client-side response (after routeIntent executes the action) ─────────────

/**
 * Builds the chat reply after routeIntent() has executed the action
 * against the real Zustand stores.
 *
 * @param result - ActionResult from routeIntent()
 * @param action - Intent action (for CTA lookup)
 */
export function buildActionResponse(
    result: ActionResult,
    action: string
): ChatResponse {
    const statusEmoji = result.ok ? '✅' : '⚠️';

    let text = `${statusEmoji} ${result.message}`;

    if (result.requiresApp) {
        text += `\n\n👉 _${APP_OPEN_CTA}_`;
    }

    const ctaList = DEFAULT_CTAs[action] ?? DEFAULT_CTAs.unknown;
    const suggestions = result.requiresApp
        ? [APP_OPEN_CTA, ...ctaList.slice(0, 2)]
        : ctaList.slice(0, 3);

    return { text, suggestions };
}

// ─── Generic formatter (legacy compat / spec alignment) ──────────────────────

/**
 * Simple wrapper for direct use without an ActionResult.
 * Matches the API from the original spec's responseBuilder.
 *
 * @param baseMessage - Core message text
 * @param suggestions - Optional CTA list (defaults to common actions)
 */
export function buildResponse(
    baseMessage: string,
    suggestions?: string[]
): ChatResponse {
    const ctaList = suggestions ?? ['Cosa devo fare', 'Mostra studenti', 'Crea classe'];
    const ctaText = ctaList.map((s) => `• ${s}`).join('\n');

    return {
        text: `${baseMessage}\n\n👉 Prossima azione:\n${ctaText}`,
        suggestions: ctaList.slice(0, 3),
    };
}

// ─── Utility: format ChatResponse as plain text for Telegram/WhatsApp ─────────

/**
 * Converts a ChatResponse to a plain string for platforms that
 * don't support rich buttons (fallback mode).
 */
export function responseToPlainText(response: ChatResponse): string {
    if (!response.suggestions || response.suggestions.length === 0) {
        return response.text;
    }
    const suggestionsLine = response.suggestions.map((s) => `• ${s}`).join('\n');
    return `${response.text}\n\n${suggestionsLine}`;
}
