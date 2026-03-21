/**
 * services/agentApiClient.ts — HTTP client for the P30 Agent Platform API (P30)
 *
 * Thin fetch wrappers around:
 *   GET    /agents            — list active agents
 *   POST   /agents            — create agent
 *   PATCH  /agents/:id        — update agent
 *   POST   /agents/:id/run    — execute agent server-side
 *   POST   /memory            — save memory entry
 *   GET    /memory            — retrieve memory history
 *
 * All requests include `credentials: 'include'` so the session cookie is sent.
 * Network errors are returned as `{ error: string }` objects — never thrown.
 */

const BASE = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? '';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServerAgent {
  id:               string;
  user_id:          string;
  name:             string;
  type:             'compliance' | 'cognitive' | 'monitoring' | 'custom';
  config:           Record<string, unknown>;
  estimated_tokens: number;
  is_active:        boolean;
  created_at:       string;
  updated_at:       string;
}

export interface ServerRunResult {
  success:    boolean;
  data?:      unknown;
  error?:     string | null;
  tokensUsed: number;
  durationMs: number;
  simulated:  boolean;
  blocked_by: string | null;
  run_id:     string;
}

export interface MemoryEntry {
  id:         string;
  user_id:    string;
  content:    string;
  metadata:   Record<string, unknown>;
  created_at: string;
}

export interface CreateAgentPayload {
  name:             string;
  type:             'compliance' | 'cognitive' | 'monitoring' | 'custom';
  config?:          Record<string, unknown>;
  estimated_tokens?: number;
}

// ─── Agents ───────────────────────────────────────────────────────────────────

/** Fetch list of active agents from the server registry. */
export async function fetchAgents(): Promise<ServerAgent[]> {
  if (!BASE) return [];
  try {
    const res = await fetch(`${BASE}/agents`, { credentials: 'include' });
    if (!res.ok) return [];
    const json = await res.json() as { agents: ServerAgent[] };
    return json.agents ?? [];
  } catch {
    return [];
  }
}

/** Create a new agent in the server registry. */
export async function createAgent(payload: CreateAgentPayload): Promise<{ id: string } | { error: string }> {
  if (!BASE) return { error: 'VITE_BACKEND_URL non configurato' };
  const res = await fetch(`${BASE}/agents`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify(payload),
  });
  return res.json() as Promise<{ id: string } | { error: string }>;
}

/** Update an agent's config or active state. */
export async function updateAgent(
  id: string,
  patch: Partial<Pick<ServerAgent, 'name' | 'config' | 'estimated_tokens' | 'is_active'>>,
): Promise<{ ok: true } | { error: string }> {
  if (!BASE) return { error: 'VITE_BACKEND_URL non configurato' };
  const res = await fetch(`${BASE}/agents/${encodeURIComponent(id)}`, {
    method:      'PATCH',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify(patch),
  });
  return res.json() as Promise<{ ok: true } | { error: string }>;
}

// ─── Agent execution ──────────────────────────────────────────────────────────

/**
 * Execute an agent on the server.
 * Returns a `ServerRunResult` on success or a synthetic error result on failure.
 */
export async function runAgentOnServer(
  id: string,
  input: unknown,
): Promise<ServerRunResult> {
  const errorResult = (msg: string): ServerRunResult => ({
    success:    false,
    error:      msg,
    tokensUsed: 0,
    durationMs: 0,
    simulated:  false,
    blocked_by: null,
    run_id:     '',
  });

  if (!BASE) return errorResult('VITE_BACKEND_URL non configurato');

  try {
    const res = await fetch(`${BASE}/agents/${encodeURIComponent(id)}/run`, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ input }),
    });

    if (res.status === 401) return errorResult('Non autenticato');
    if (res.status === 404) return errorResult(`Agente "${id}" non trovato sul server`);
    if (res.status === 402) return errorResult('Budget token esaurito');
    if (res.status === 429) return errorResult('Troppe richieste — riprova tra un minuto');

    return res.json() as Promise<ServerRunResult>;
  } catch (err) {
    return errorResult(err instanceof Error ? err.message : 'Errore di rete');
  }
}

// ─── Memory ───────────────────────────────────────────────────────────────────

/** Persist a memory entry for the current user. */
export async function saveMemory(
  content: string,
  metadata?: Record<string, unknown>,
): Promise<{ id: string } | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}/memory`, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ content, metadata }),
    });
    if (!res.ok) return null;
    return res.json() as Promise<{ id: string }>;
  } catch {
    return null;
  }
}

/** Retrieve recent memory entries for the current user. */
export async function fetchMemory(limit = 20): Promise<MemoryEntry[]> {
  if (!BASE) return [];
  try {
    const url = `${BASE}/memory?limit=${Math.min(Math.max(limit, 1), 100)}`;
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) return [];
    const json = await res.json() as { entries: MemoryEntry[] };
    return json.entries ?? [];
  } catch {
    return [];
  }
}
