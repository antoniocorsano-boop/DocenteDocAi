/**
 * getNextAction.ts — SINGLE SOURCE OF TRUTH for "what should the teacher do next".
 *
 * Architecture rule: NO component may compute the next action on its own.
 * All UIs (NextStepBanner, JourneyProgressPanel, CopilotRecommendationPanel…)
 * call this function (via the `useNextAction` hook) to get the ONE recommended action.
 *
 * Design:
 *   - Pure function (no side effects, no imports from stores)
 *   - Rules are ordered by pedagogical priority (lowest level → most urgent)
 *   - Each rule is a named constant → easy to test, audit, extend
 *   - Returns null when the teacher has completed all major milestones
 *
 * Rule ordering (top = most urgent):
 *   L1-1  No students configured yet
 *   L1-2  Fewer than 3 lessons created
 *   L1-3  Copilot never opened
 *   L2-1  No UDA created
 *   L2-2  Drive backup not connected
 *   L2-3  Annual plan not completed
 *   L3-1  Analytics never viewed
 *   L3-2  Book service not linked
 *   L4-1  Automation not yet enabled
 */

import type { NextAction, NextActionContext } from './types';

// ── Decision rules — ordered list ────────────────────────────────────────────

type DecisionRule = (ctx: NextActionContext) => NextAction | null;

const RULES: DecisionRule[] = [

  // ── L1-1: Add first student ──────────────────────────────────────────────
  (ctx) =>
    !ctx.hasStudents && !ctx.usage.workspaceConfigured
      ? {
          id: 'da-add-first-student',
          label: 'Aggiungi la tua classe',
          description: 'Configura studenti e classe per sbloccare tutte le funzionalità.',
          targetView: 'aula',
          cta: 'Vai alla classe',
          reason:
            'Non hai ancora aggiunto nessuno studente. La maggior parte delle funzionalità — valutazioni, Copilot, analisi — richiede una classe configurata.',
          icon: 'group_add',
        }
      : null,

  // ── L1-2: Create first lesson ────────────────────────────────────────────
  (ctx) =>
    ctx.usage.lessonsCreated < 3
      ? {
          id: 'da-create-lesson',
          label: 'Crea la tua prima lezione',
          description: 'Registra una lezione per iniziare a costruire il tuo storico didattico.',
          targetView: 'lesson',
          cta: 'Crea lezione',
          reason: `Hai registrato ${ctx.usage.lessonsCreated} lezione${ctx.usage.lessonsCreated !== 1 ? 'i' : ''}. Registrarne almeno 3 permette al Copilot di farti suggerimenti precisi.`,
          icon: 'edit_document',
        }
      : null,

  // ── L1-3: Discover Copilot ───────────────────────────────────────────────
  (ctx) =>
    ctx.usage.copilotRequests === 0 && ctx.capabilityLevel === 1
      ? {
          id: 'da-discover-copilot',
          label: 'Scopri il Copilot',
          description: "Esplora le raccomandazioni AI personalizzate per la tua didattica.",
          targetView: 'copilot',
          targetTab: 11, // Raccomandazioni AI tab
          cta: 'Apri Copilot',
          reason:
            'Non hai ancora aperto il Copilot. È lo strumento centrale per suggerimenti e analisi — vale la pena esplorarlo.',
          icon: 'auto_awesome',
        }
      : null,

  // ── L2-1: Create first UDA ───────────────────────────────────────────────
  (ctx) =>
    ctx.capabilityLevel >= 2 && ctx.usage.udaCreated === 0
      ? {
          id: 'da-create-uda',
          label: 'Pianifica la tua prima UDA',
          description: 'Crea una Unità Didattica per strutturare obiettivi e attività.',
          targetView: 'uda',
          targetTab: 4, // Planning tab
          cta: 'Crea UDA',
          reason:
            "Hai registrato lezioni ma non hai ancora creato una UDA. Organizzando le attività in UDA, il Copilot può analizzare la progressione degli studenti.",
          icon: 'layers',
        }
      : null,

  // ── L2-2: Connect Drive backup ───────────────────────────────────────────
  (ctx) =>
    ctx.capabilityLevel >= 2 &&
    !ctx.usage.driveConnected &&
    !ctx.eventNames.has('drive.connected')
      ? {
          id: 'da-connect-drive',
          label: 'Attiva il backup Google Drive',
          description: 'Proteggi i tuoi dati collegando il backup automatico su Drive.',
          targetView: 'settings',
          cta: 'Configura',
          reason:
            'Stai creando contenuti ma non hai ancora attivato il backup Drive. Collegarlo protegge tutto il lavoro da perdite accidentali.',
          icon: 'backup',
        }
      : null,

  // ── L2-3: Complete annual plan ───────────────────────────────────────────
  (ctx) =>
    ctx.capabilityLevel >= 2 && !ctx.eventNames.has('annual.plan.created')
      ? {
          id: 'da-annual-plan',
          label: 'Crea il piano annuale',
          description: 'Struttura obiettivi e UDA per tutto l\'anno scolastico.',
          targetView: 'planning',
          targetTab: 4, // Planning tab
          cta: 'Pianifica',
          reason:
            "Non hai ancora creato un piano annuale. Il wizard di pianificazione guida la distribuzione delle UDA nel calendario.",
          icon: 'calendar_today',
        }
      : null,

  // ── L3-1: View analytics ─────────────────────────────────────────────────
  (ctx) =>
    ctx.capabilityLevel >= 3 && ctx.usage.analyticsViews === 0
      ? {
          id: 'da-view-analytics',
          label: 'Analizza le performance',
          description: 'Visualizza trend e pattern nelle valutazioni della classe.',
          targetView: 'copilot',
          targetTab: 7, // Dashboard tab
          cta: 'Apri analisi',
          reason:
            "Hai dati sufficienti per un'analisi significativa ma non hai ancora visitato la Dashboard AI. Offre insight su progressione e rischi.",
          icon: 'analytics',
        }
      : null,

  // ── L3-2: Link book service ──────────────────────────────────────────────
  (ctx) =>
    ctx.capabilityLevel >= 3 && ctx.usage.bookServicesLinked === 0
      ? {
          id: 'da-link-book',
          label: 'Integra il libro di testo',
          description: 'Collega il libro adottato per raccomandazioni contestuali.',
          targetView: 'settings',
          cta: 'Collega',
          reason:
            "Non hai ancora collegato un servizio libro. L'integrazione permette al Copilot di allineare UDA ai contenuti del testo adottato.",
          icon: 'menu_book',
        }
      : null,

  // ── L4-1: Enable automation ──────────────────────────────────────────────
  (ctx) =>
    ctx.capabilityLevel >= 4 && !ctx.eventNames.has('copilot.automation.enabled')
      ? {
          id: 'da-enable-automation',
          label: 'Attiva le automazioni AI',
          description: 'Abilita suggerimenti automatici in background per massima efficienza.',
          targetView: 'copilot',
          targetTab: 9, // Spiegabilità tab
          cta: 'Configura',
          reason:
            "Sei al livello più avanzato ma non hai ancora abilitato le automazioni. Permettono al Copilot di agire proattivamente senza input manuale.",
          icon: 'bolt',
        }
      : null,
];

// ── Discovery fallback ────────────────────────────────────────────────────────

/**
 * Shown when the teacher has completed all major milestones for their level.
 * Invites further exploration rather than prescribing a fixed step.
 */
const DISCOVERY_ACTION: NextAction = {
  id: 'da-explore',
  label: 'Esplora le funzionalità avanzate',
  description: "Hai completato tutti i passi fondamentali. Scopri capacità avanzate del Copilot.",
  targetView: 'copilot',
  targetTab: 11, // Raccomandazioni AI
  cta: 'Esplora',
  reason:
    "Hai configurato tutto l'essenziale. Il Copilot ha ulteriori analisi e strumenti che potrebbero tornare utili.",
  icon: 'explore',
};

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Returns the single highest-priority recommended action for the teacher.
 *
 * Rules are evaluated in pedagogical order. The first rule that returns a
 * non-null action wins. When all rules are satisfied, returns DISCOVERY_ACTION.
 *
 * This function is PURE — it never reads from stores or external state.
 * Feed it via `useNextAction()` for React components.
 *
 * @example
 * // In tests
 * const action = getNextAction({
 *   eventNames: new Set(['lesson.created']),
 *   capabilityLevel: 1,
 *   usage: { lessonsCreated: 1, udaCreated: 0, ... },
 *   hasStudents: true,
 * });
 * expect(action.id).toBe('da-create-lesson');
 */
export function getNextAction(ctx: NextActionContext): NextAction {
  for (const rule of RULES) {
    const action = rule(ctx);
    if (action !== null) return action;
  }
  return DISCOVERY_ACTION;
}
