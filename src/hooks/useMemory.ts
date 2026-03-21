/**
 * hooks/useMemory.ts — Memory Layer client hook (P30)
 *
 * Provides a React interface for the /memory API:
 *   save(content, metadata)  — persist a memory entry
 *   load(limit)              — fetch recent entries for current user
 *   entries                  — reactive state array
 *   loading                  — boolean pending flag
 *
 * Usage:
 *   const { entries, loading, save, load } = useMemory();
 *   useEffect(() => { load(20); }, [load]);
 */

import { useState, useCallback } from 'react';
import { saveMemory, fetchMemory } from '@/services/agentApiClient';
import type { MemoryEntry }        from '@/services/agentApiClient';

export interface UseMemoryReturn {
  entries: MemoryEntry[];
  loading: boolean;
  /** Persist a memory entry. Returns the new entry id, or null on failure. */
  save:    (content: string, metadata?: Record<string, unknown>) => Promise<string | null>;
  /** Load recent entries from the server into `entries`. */
  load:    (limit?: number) => Promise<void>;
}

export function useMemory(): UseMemoryReturn {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const save = useCallback(async (content: string, metadata?: Record<string, unknown>): Promise<string | null> => {
    const result = await saveMemory(content, metadata);
    return result?.id ?? null;
  }, []);

  const load = useCallback(async (limit = 20): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchMemory(limit);
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { entries, loading, save, load };
}
