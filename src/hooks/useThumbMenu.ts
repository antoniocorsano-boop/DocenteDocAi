/**
 * useThumbMenu.ts — Hook per gestire lo stato e la logica del ThumbMenu.
 *
 * Incapsula:
 *   - apertura del menu (buildContext async on-demand)
 *   - selezione azione (executeAction + trust record)
 *   - chiusura e reset dello stato
 *
 * Il contesto di orchestrazione è ephemeral: calcolato all'apertura del menu
 * e scartato alla chiusura — nessuna persistenza.
 *
 * Uso:
 *   const { open, anchorEl, context, openMenu, handleSelect, handleClose } =
 *     useThumbMenu('tenant-id');
 *
 *   // In un click handler:
 *   openMenu(entry.id, e.currentTarget);
 */

import { useCallback, useState } from 'react';

import { buildContext, executeAction } from '../modules/orchestration/orchestrationService';
import { recordAction }              from '../modules/orchestration/patternDetector';
import { tenantRegistry, getUserDomain } from '../services/tenant/tenantRegistry';
import { useUIStore } from '../stores/useUIStore';
import { useUserBehaviorStore } from '../stores/useUserBehaviorStore';
import type { OrchestrationAction, OrchestrationContext, ScheduleContext } from '../modules/orchestration/types';
import type { CognitiveSuggestion } from '../modules/cognitiveLayer/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseThumbMenuState {
  /** Menu visibile */
  open:       boolean;
  /** Elemento di ancoraggio passato all'ultimo openMenu() */
  anchorEl:   HTMLElement | null;
  /** Contesto calcolato (null se non ancora aperto o dopo chiusura) */
  context:    OrchestrationContext | null;
  /** true mentre buildContext è in esecuzione */
  loading:    boolean;
}

export interface UseThumbMenuHandlers {
  /** Apre il menu per un inputId dato, calcolando il contesto */
  openMenu:     (inputId: string, el: HTMLElement, scheduleCtx?: ScheduleContext) => Promise<void>;
  /** Esegue l'azione selezionata e chiude il menu */
  handleSelect: (action: OrchestrationAction) => Promise<void>;
  /** Chiude il menu e resetta lo stato */
  handleClose:  () => void;
}

export type UseThumbMenuReturn = UseThumbMenuState & UseThumbMenuHandlers;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @param tenantId - ID del tenant attivo
 */
export function useThumbMenu(tenantId: string): UseThumbMenuReturn {
  const [open,     setOpen]     = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [context,  setContext]  = useState<OrchestrationContext | null>(null);
  const [loading,  setLoading]  = useState(false);

  const openMenu = useCallback(async (inputId: string, el: HTMLElement, scheduleCtx?: ScheduleContext) => {
    const ctx  = tenantRegistry.getContext();
    const role = ctx.role;

    setAnchorEl(el);
    setLoading(true);

    try {
      const orchestrCtx = await buildContext(inputId, {
        tenantId,
        role,
        domain: getUserDomain(role),
        scheduleContext: scheduleCtx,
      });
      if (!orchestrCtx) {
        useUIStore.getState().actions.showToast('Contenuto non disponibile', 'error');
        return;
      }
      setContext(orchestrCtx);
      setOpen(true);
    } catch {
      useUIStore.getState().actions.showToast('Errore nel caricamento', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const handleSelect = useCallback(async (action: OrchestrationAction) => {
    if (!context) return;

    // Trova la suggestion raw corrispondente all'azione
    const suggestion: CognitiveSuggestion | undefined =
      context.suggestions.find(s => s.id === action.id);

    if (suggestion) {
      const ctx = tenantRegistry.getContext();
      const result = await executeAction(action.ctaType, suggestion, {
        tenantId,
        role:   ctx.role,
        domain: getUserDomain(ctx.role),
      });
      const { showToast } = useUIStore.getState().actions;
      if (result.success) {
        showToast(`${action.label} completata`, 'success');
        // Behavior model: registra azione eseguita per learning loop
        useUserBehaviorStore.getState().onActionExecuted(action.ctaType);
        // Pattern detector: registra l'azione per il rilevamento di skill emergenti
        recordAction({
          ctaType:   action.ctaType,
          domain:    suggestion.domain,
          tags:      (suggestion as { tags?: string[] }).tags ?? [],
          timestamp: Date.now(),
        });
      } else {
        showToast(result.reason ?? 'Non disponibile.', 'error');
      }
    }

    // Chiudi indipendentemente dall'esito — non bloccare la UI
    setOpen(false);
  }, [context, tenantId]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setAnchorEl(null);
    setContext(null);
  }, []);

  return {
    open,
    anchorEl,
    context,
    loading,
    openMenu,
    handleSelect,
    handleClose,
  };
}
