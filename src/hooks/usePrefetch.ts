/**
 * usePrefetch — warms bundle chunks for the most-likely next views.
 *
 * After a view has rendered, staggered dynamic imports trigger Vite to
 * fetch the adjacent route chunks in the background. This eliminates the
 * loading placeholder for common navigation patterns on slow connections.
 *
 * Adjacent views are defined in PREFETCH_MAP (viewRegistry.ts).
 * Prefetch is staggered (1.5 s base + 500 ms per view) so it never
 * competes with the user's current interaction.
 *
 * Roadmap: #21 — Pre-fetch dati successivi per mobile smooth experience
 */
import { useEffect } from 'react';
import type { View } from '../types';
import { PREFETCH_MAP } from '../components/viewRegistry';

/**
 * Call inside any top-level component to prefetch adjacent view chunks.
 *
 * @param currentView The currently active application view.
 */
export function usePrefetch(currentView: View): void {
  useEffect(() => {
    const loaders = PREFETCH_MAP[currentView];
    if (!loaders || loaders.length === 0) return;

    const BASE_DELAY_MS = 1500;
    const STAGGER_MS = 500;

    const timeouts: ReturnType<typeof setTimeout>[] = loaders.map((load, i) =>
      setTimeout(() => {
        load().catch(() => {
          // Silent — prefetch is best-effort only
        });
      }, BASE_DELAY_MS + i * STAGGER_MS),
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [currentView]);
}
