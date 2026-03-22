/**
 * types/uiBlocks.ts — P37 Smart Conversational UI Block Types (v2)
 *
 * Discriminated union of all structured block types rendered inside the
 * SmartChat message feed.  Each block variant carries the minimum data needed
 * for its renderer — no logic lives here.
 *
 * Base variants (P36.5):
 *   text     — plain markdown text
 *   plan     — numbered action plan
 *   actions  — clickable agent-execution buttons
 *   insight  — explainability panel
 *   status   — small one-line informational bar
 *
 * New variants (P37):
 *   form     — rendered form driven by FormSchema
 *   table    — MUI Table with columns + rows
 *   chart    — Recharts-based data visualization
 *   sandbox  — secure sandboxed HTML/code preview
 *   timeline — chronological event list
 */

// ── Action (shared by plan + actions blocks) ──────────────────────────────────

export interface UIAction {
  /** Button label shown to the user */
  label:    string;
  /** Agent ID to invoke when clicked (matches AgentManager registry) */
  agentId:  string;
  /** Optional hint for the action (shown as tooltip) */
  hint?:    string;
}

// ── Insight data (explainability) ─────────────────────────────────────────────

export interface UIInsightData {
  /** Agent IDs that executed in this run */
  agentsUsed:    string[];
  /** Composite confidence score [0, 1] */
  confidence:    number;
  /** Whether memory was retrieved and injected */
  memoryUsed:    boolean;
  /** Memory snippets shown to user (truncated) */
  memoryItems:   string[];
  /** Intent type detected by IntentEngine */
  intentType:    string;
  /** Wall-clock duration of the full run */
  durationMs:    number;
  /** Mode that was active for this run */
  mode:          string;
  /** Adaptive info — which agents were preferred/avoided */
  adaptiveHints: string[];
}

// ── Status data ───────────────────────────────────────────────────────────────

export interface UIStatusData {
  /** Short descriptive label */
  label:    string;
  /** Severity level for colour coding */
  severity: 'info' | 'success' | 'warning' | 'error';
  /** Optional extra detail string */
  detail?:  string;
}

// ── Form block types (P37) ────────────────────────────────────────────────────

export interface FormField {
  name:          string;
  label:         string;
  type:          'text' | 'number' | 'select' | 'textarea' | 'date';
  required?:     boolean;
  options?:      Array<{ value: string; label: string }>;
  placeholder?:  string;
  defaultValue?: string | number;
}

export interface FormSchema {
  title?:       string;
  fields:       FormField[];
  submitLabel?: string;
  /** Action ID dispatched via ActionBridge on submit */
  actionId:     string;
}

// ── Table block type (P37) ────────────────────────────────────────────────────

export interface TableConfig {
  columns:  string[];
  rows:     Array<Record<string, unknown>>;
  caption?: string;
}

// ── Chart block type (P37) ────────────────────────────────────────────────────

export interface ChartDataPoint {
  name:  string;
  value: number;
  [key: string]: unknown;
}

export interface ChartConfig {
  chartType: 'bar' | 'line' | 'pie' | 'area';
  data:      ChartDataPoint[];
  xKey?:     string;
  yKeys?:    string[];
  title?:    string;
  colors?:   string[];
}

// ── Sandbox block type (P37) ──────────────────────────────────────────────────

export interface SandboxConfig {
  html?:     string;
  code?:     string;
  language?: string;
}

// ── Timeline block type (P37) ─────────────────────────────────────────────────

export interface TimelineEvent {
  date:         string;
  title:        string;
  description?: string;
  type?:        'info' | 'success' | 'warning' | 'error';
}

// ── Message metadata (P37) ────────────────────────────────────────────────────

export interface MessageMetadata {
  source?:   'ui' | 'chat' | 'system';
  actionId?: string;
}

// ── UIBlock discriminated union ────────────────────────────────────────────────

export type UIBlock =
  // ── P36.5 base variants ───────────────────────────────────────────────────
  | { type: 'text';     content:  string }
  | { type: 'plan';     steps:    string[] }
  | { type: 'actions';  actions:  UIAction[] }
  | { type: 'insight';  data:     UIInsightData }
  | { type: 'status';   data:     UIStatusData }
  // ── P37 new variants ──────────────────────────────────────────────────────
  | { type: 'form';     schema:   FormSchema }
  | { type: 'table';    config:   TableConfig }
  | { type: 'chart';    config:   ChartConfig }
  | { type: 'sandbox';  config:   SandboxConfig }
  | { type: 'timeline'; events:   TimelineEvent[] };

// ── P38.6: AdaptedBlock — UIBlock augmented with soft density flag ─────────────

/**
 * UIBlock augmented with an optional hidden flag set by adaptBlocks().
 * The UI collapses hidden blocks behind a reveal button — no content is discarded.
 */
export type AdaptedBlock = UIBlock & { hidden?: boolean };

// ── Chat message ──────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id:        string;
  role:      MessageRole;
  /** Raw text for user messages; structured blocks for assistant messages */
  content:   string;
  /** Structured UI blocks — present only on assistant messages */
  blocks?:   UIBlock[];
  /** Timestamp (ms since epoch) */
  timestamp: number;
  /** True when this message was generated in deep/manual mode */
  isDeep?:   boolean;
  /** Origin metadata injected by ActionBridge (P37) */
  metadata?: MessageMetadata;
}
