/**
 * routes/memory.ts — Memory Layer (P30)
 *
 * POST /memory          — save a memory entry for the authenticated user
 * GET  /memory          — retrieve recent memory entries (query: ?limit=20)
 *
 * Memory entries capture user interactions, agent outputs and relevant events
 * to provide continuity across sessions.  Phase 2 will add vector embeddings.
 */

import { Router }            from 'express';
import crypto                from 'crypto';
import { z }                 from 'zod';
import type { Pool }         from 'pg';
import type { RequestHandler } from 'express';
import { requireAuth }       from '../middleware/requireAuth';
import { logger }            from '../logger';

// ── Schemas ───────────────────────────────────────────────────────────────────

const SaveMemorySchema = z.object({
  content:  z.string().min(1).max(32_000),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const GetMemoryQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform(v => Math.min(Math.max(parseInt(v ?? '20', 10) || 20, 1), 100)),
});

// ── DB row type ───────────────────────────────────────────────────────────────

interface MemoryRow {
  id:         string;
  user_id:    string;
  content:    string;
  metadata:   Record<string, unknown>;
  created_at: string;
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createMemoryRouter(pool: Pool | null): Router {
  const router = Router();

  // POST /memory — save entry
  const saveMemory: RequestHandler = async (req, res): Promise<void> => {
    const parsed = SaveMemorySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Input non valido', issues: parsed.error.issues });
      return;
    }

    const { content, metadata } = parsed.data;
    const userId = req.session.userId!;
    const id     = crypto.randomUUID();

    if (!pool) {
      // Dev fallback — log and return OK without persisting
      logger.info({ message: 'memory_entry (no DB)', component: 'memory', userId, preview: content.slice(0, 80) });
      res.status(201).json({ id });
      return;
    }

    try {
      await pool.query(
        `INSERT INTO memory_entries (id, user_id, content, metadata) VALUES ($1,$2,$3,$4)`,
        [id, userId, content, JSON.stringify(metadata ?? {})],
      );
      res.status(201).json({ id });
    } catch (err) {
      logger.error({ message: 'memory:save failed', component: 'memory', err: String(err) });
      res.status(500).json({ error: 'Impossibile salvare memoria' });
    }
  };

  // GET /memory — retrieve history
  const getMemory: RequestHandler = async (req, res): Promise<void> => {
    const { data: query } = GetMemoryQuerySchema.safeParse(req.query);
    const limit = query?.limit ?? 20;
    const userId = req.session.userId!;

    if (!pool) {
      res.json({ entries: [] });
      return;
    }

    try {
      const { rows } = await pool.query<MemoryRow>(
        `SELECT id, user_id, content, metadata, created_at
           FROM memory_entries
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT $2`,
        [userId, limit],
      );
      res.json({ entries: rows });
    } catch (err) {
      logger.error({ message: 'memory:get failed', component: 'memory', err: String(err) });
      res.status(500).json({ error: 'Impossibile recuperare la memoria' });
    }
  };

  router.post('/', requireAuth, saveMemory);
  router.get('/',  requireAuth, getMemory);

  return router;
}
