/**
 * Material Design 3 Expressive - Z-Index Hierarchy
 * 
 * Single source of truth for stacking context management.
 * Prevents z-index conflicts and modal hell.
 * 
 * Strategy:
 * - Base: 1000 (app shell)
 * - Modals: 1300-1600 (3+ levels supported)
 * - Floating: 2000-3000 (FAB, Snackbar, Tooltip)
 * 
 * Usage:
 * ```tsx
 * import { Z_INDEX } from '@/design-system/zIndex';
 * 
 * // Single modal
 * <div style={{ zIndex: Z_INDEX.modalBackdrop }}>
 * 
 * // Multi-level modal (ModalContext)
 * const zIndex = Z_INDEX.modalLevel(level);
 * ```
 */

/**
 * Z-Index constant map for all UI layers
 */
export const Z_INDEX = {
  // Layout layers
  layout: {
    appBar: 100,
    drawer: 200,
    scrim: 300,
  },

  // Popup layers
  dropdown: {
    popover: 1100,
    menu: 1100,
    autocomplete: 1100,
  },

  /**
   * Modal stacking system
   * - modalBackdrop: Base for all modal backdrops (1300)
   * - Levels increment by 100: Level 1 = 1400, Level 2 = 1500, Level 3 = 1600, etc.
   * 
   * ModalContext uses this to calculate: getZIndex(level) = 1300 + (level * 100)
   */
  modal: {
    /** Base z-index for modal backdrops */
    backdrop: 1300,
    /** Level 1 modal (single modal) */
    level1: 1400,
    /** Level 2 modal (modal within modal) */
    level2: 1500,
    /** Level 3 modal (nested 3 times) */
    level3: 1600,
    /** Level 4+ computed as: 1300 + (level * 100) */
    maxSupported: 3,
  },

  // Floating action button
  fab: 1200,

  // Notification layers (always on top)
  notification: {
    snackbar: 2000,
    toast: 2000,
    banner: 2500, // Banner di suggerimento AI
  },

  // Assistant layers
  assistant: {
    fab: 1300, // Sopra il NavigationRail ma sotto i modali
    modal: 2200, // Sopra i modali standard ma sotto i banner critici
  },

  // Top-level overlays
  overlay: {
    tooltip: 3000,
    contextMenu: 2500,
  },
} as const;

/**
 * Utility function to calculate modal z-index for any nesting level
 * 
 * Usage:
 * ```tsx
 * const zIndex = getModalZIndex(1);  // 1400
 * const zIndex = getModalZIndex(2);  // 1500
 * const zIndex = getModalZIndex(5);  // 1800
 * ```
 * 
 * @param level - Modal nesting level (1-based: 1, 2, 3, ...)
 * @returns z-index value for backdrop
 */
export function getModalZIndex(level: number): number {
  return Z_INDEX.modal.backdrop + level * 100;
}

/**
 * Get z-index for modal content (modal element itself, not backdrop)
 * Content should be 1 unit above backdrop
 * 
 * @param level - Modal nesting level
 * @returns z-index value for modal content
 */
export function getModalContentZIndex(level: number): number {
  return getModalZIndex(level) + 1;
}

/**
 * Type-safe z-index values for CSS-in-JS usage
 */
export type ZIndexKey = keyof typeof Z_INDEX;
export type ZIndexValue = typeof Z_INDEX[ZIndexKey];

/**
 * Export as CSS custom properties for global CSS usage
 * 
 * Usage in CSS:
 * ```css
 * .modal-backdrop {
 *   z-index: var(--z-modal-backdrop);
 * }
 * ```
 * 
 * Applied by: src/design-system/M3ExpressiveProvider.tsx
 */
export const Z_INDEX_CSS_VARS = {
  '--z-app-bar': `${Z_INDEX.layout.appBar}`,
  '--z-drawer': `${Z_INDEX.layout.drawer}`,
  '--z-modal-backdrop': `${Z_INDEX.modal.backdrop}`,
  '--z-modal-level-1': `${Z_INDEX.modal.level1}`,
  '--z-modal-level-2': `${Z_INDEX.modal.level2}`,
  '--z-modal-level-3': `${Z_INDEX.modal.level3}`,
  '--z-fab': `${Z_INDEX.fab}`,
  '--z-snackbar': `${Z_INDEX.notification.snackbar}`,
  '--z-tooltip': `${Z_INDEX.overlay.tooltip}`,
} as const;


