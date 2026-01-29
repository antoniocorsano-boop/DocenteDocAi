/**
 * Material Design 3 - Z-Index Hierarchy
 *
 * Single source of truth for stacking context management using MD3 tokens.
 * Prevents z-index conflicts and ensures consistent layering.
 *
 * MD3 Z-Index Hierarchy:
 * - Base: 0 (default stacking)
 * - Content: 100 (main content)
 * - Overlay: 200 (dropdowns, popovers)
 * - Modal: 300 (dialogs, modals)
 * - Tooltip: 400 (tooltips, help)
 * - Snackbar: 500 (notifications)
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
 * Z-Index constant map using MD3 semantic values
 * DEPRECATED: Use CSS tokens directly instead of Z_INDEX constants
 * @deprecated Use 'var(--md-sys-z-modal)' etc. directly in your code
 */
export const Z_INDEX = {
  // Layout layers
  layout: {
    appBar: 'var(--md-sys-z-content)',    // --md-sys-z-content
    drawer: 'var(--md-sys-z-overlay)',    // --md-sys-z-overlay
    scrim: 'var(--md-sys-z-modal)',     // --md-sys-z-modal
  },

  // Popup layers
  dropdown: {
    popover: 'var(--md-sys-z-overlay)',   // --md-sys-z-overlay
    menu: 'var(--md-sys-z-overlay)',      // --md-sys-z-overlay
    autocomplete: 'var(--md-sys-z-overlay)', // --md-sys-z-overlay
  },

  /**
   * Modal stacking system using MD3 tokens
   * - modalBackdrop: Base for all modal backdrops (--md-sys-z-modal = 300)
   * - Levels increment by 100: Level 1 = 400, Level 2 = 500, Level 3 = 600, etc.
   *
   * ModalContext uses this to calculate: getZIndex(level) = 300 + (level * 100)
   */
  modal: {
    /** Base z-index for modal backdrops (--md-sys-z-modal) */
    backdrop: 'var(--md-sys-z-modal)',
    /** Level 1 modal (single modal) */
    level1: 'var(--md-sys-z-tooltip)',
    /** Level 2 modal (modal within modal) */
    level2: 'var(--md-sys-z-snackbar)',
    /** Level 3 modal (nested 3 times) */
    level3: 'var(--md-sys-z-snackbar)', // Reuse for now
    /** Level 4+ computed as: var(--md-sys-z-modal) + level increments */
    maxSupported: 3,
  },

  // Floating action button
  fab: 'var(--md-sys-z-tooltip)', // Above modal but below some overlays

  // Notification layers (always on top)
  notification: {
    snackbar: 'var(--md-sys-z-snackbar)',  // --md-sys-z-snackbar
    toast: 'var(--md-sys-z-snackbar)',     // --md-sys-z-snackbar
    banner: 'var(--md-sys-z-snackbar)',    // Above snackbar for AI suggestions
  },

  // Assistant layers
  assistant: {
    fab: 'var(--md-sys-z-tooltip)',       // Same as main FAB
    modal: 'var(--md-sys-z-snackbar)',     // Above standard modals
  },

  // Top-level overlays
  overlay: {
    tooltip: 'var(--md-sys-z-tooltip)',   // --md-sys-z-tooltip
    contextMenu: 'var(--md-sys-z-tooltip)', // Above tooltip
  },
} as const;

/**
 * Utility function to calculate modal z-index for any nesting level
 * Uses MD3 modal base (300) + level increments
 *
 * Usage:
 * ```tsx
 * const zIndex = getModalZIndex(1);  // 400 (300 + 100)
 * const zIndex = getModalZIndex(2);  // 'var(--md-sys-z-snackbar)'
 * ```
 *
 * @param level - Modal nesting level (1-based: 1, 2, 3, ...)
 * @returns z-index CSS token for backdrop
 */
export function getModalZIndex(level: number): string {
  const tokens = [
    'var(--md-sys-z-modal)',      // level 0 (backdrop base)
    'var(--md-sys-z-tooltip)',    // level 1
    'var(--md-sys-z-snackbar)',   // level 2
    'var(--md-sys-z-snackbar)',   // level 3+ (reuse highest)
  ];
  return tokens[Math.min(level, tokens.length - 1)] || tokens[tokens.length - 1];
}

/**
 * Get z-index for modal content (modal element itself, not backdrop)
 * Content should be 1 unit above backdrop - but since we use tokens, return same token
 * 
 * @param level - Modal nesting level
 * @returns z-index CSS token for modal content
 */
export function getModalContentZIndex(level: number): string {
  return getModalZIndex(level); // Same token for simplicity
}

/**
 * Type-safe z-index values for CSS-in-JS usage
 */
export type ZIndexKey = keyof typeof Z_INDEX;
export type ZIndexValue = string; // Now returns CSS token strings

/**
 * Export as CSS custom properties for global CSS usage
 * Now aligned with MD3 z-index tokens
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
  '--z-app-bar': 'var(--md-sys-z-content)',
  '--z-drawer': 'var(--md-sys-z-overlay)',
  '--z-modal-backdrop': 'var(--md-sys-z-modal)',
  '--z-modal-level-1': 'var(--md-sys-z-tooltip)',
  '--z-modal-level-2': 'var(--md-sys-z-snackbar)',
  '--z-modal-level-3': 'var(--md-sys-z-snackbar)',
  '--z-fab': 'var(--md-sys-z-tooltip)',
  '--z-snackbar': 'var(--md-sys-z-snackbar)',
  '--z-tooltip': 'var(--md-sys-z-tooltip)',
} as const;


