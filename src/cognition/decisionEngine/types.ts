/**
 * decisionEngine/types.ts — canonical NextAction type.
 *
 * NextAction is the SINGLE OUTPUT of the decision engine.
 * Every part of the UI that needs to guide the user MUST use this type —
 * never compute "what to do next" inside a component.
 */

/**
 * A single, high-priority recommended action for the current teacher.
 *
 * Rules:
 *   - ONE action at a time (the engine picks the most important one)
 *   - label / cta are display-ready, never internal identifiers
 *   - reason is human-readable (shown in "Perché?" popovers)
 *   - targetTab is the CopilotDocentePanel tab index to highlight (optional)
 *   - targetView is the app-level route/view to navigate to (optional)
 */
export interface NextAction {
  /** Stable identifier — used for deduplication and test assertions */
  id: string;
  /** Short action label (used as chip or heading) */
  label: string;
  /** One-sentence description of what this action does */
  description: string;
  /**
   * App-level view key to navigate to when the CTA is clicked.
   * Matches the `onNavigate` view keys in Home/Router.
   */
  targetView?: string;
  /**
   * Index of the CopilotDocentePanel tab to highlight.
   * Provides a visual cue directing the user to the right panel.
   */
  targetTab?: number;
  /** Label for the CTA button (e.g. "Inizia", "Apri", "Configura") */
  cta: string;
  /** Human-readable motivation shown in the "Perché?" popover */
  reason: string;
  /** Material Symbols icon name */
  icon: string;
}

/**
 * Minimal context required by `getNextAction`.
 *
 * All fields are read-only to enforce pure-function semantics.
 * The hook `useNextAction` builds this from stores.
 */
export interface NextActionContext {
  /**
   * Names of events that have occurred in the user's session / history.
   * Drives capability level computation and rule evaluation.
   */
  readonly eventNames: ReadonlySet<string>;
  /** Computed CapabilityLevel (1–4) */
  readonly capabilityLevel: 1 | 2 | 3 | 4;
  /** Quantitative usage counters from TeacherModel.usageProfile */
  readonly usage: {
    readonly lessonsCreated: number;
    readonly udaCreated: number;
    readonly copilotRequests: number;
    readonly driveConnected: boolean;
    readonly bookServicesLinked: number;
    readonly analyticsViews: number;
    readonly workspaceConfigured: boolean;
  };
  /** True when the teacher has at least one student */
  readonly hasStudents: boolean;
}
