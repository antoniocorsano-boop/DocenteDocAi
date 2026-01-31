// Removed unused ColorTokens import

/* eslint-disable design-system/no-hardcoded-colors */

/**
 * DESIGN SYSTEM EXCEPTION: Avatar Color Palettes
 * This is used to create a unique color for each class name (timetable slots).
 */
export const generateHueFromString = (str: string): number => {
  let hash = 0;
  const len = str.length;
  
  if (len === 0) return 0;

  for (let i = 0; i < len; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Additional mixing for short strings
  if (len < 5) {
      const lastChar = str.charCodeAt(len - 1);
      const firstChar = str.charCodeAt(0);
      hash = hash * 13 + lastChar * 157 + firstChar * 31;
  }

  return Math.abs(hash % 360);
};

// M3 EXPRESSIVE CONTAINER PALETTE (DESIGN SYSTEM EXCEPTION)
// These are HARDCODED by design as they represent Material Design 3's
// predefined expressive color containers used for avatar backgrounds.
// Pastel/Light backgrounds with Dark contrasting text.
// Better for readability and fits the modern M3 look.
// 
// These are NOT used in component styling—use var(--sys-*) tokens instead.
// Exception documented in: docs/DESIGN_SYSTEM_CONSOLIDATION.md § 5
import LEGACY_COLORS from '../design-system/legacy-colors';

const AVATAR_PALETTES = [
  { bg: LEGACY_COLORS.primaryContainer, text: LEGACY_COLORS.primaryContainerOn },
  { bg: LEGACY_COLORS.avatar.avatar2Bg, text: LEGACY_COLORS.avatar.avatar2Text },
  { bg: LEGACY_COLORS.avatar.avatar3Bg, text: LEGACY_COLORS.avatar.avatar3Text },
  { bg: LEGACY_COLORS.avatar.avatar4Bg, text: LEGACY_COLORS.avatar.avatar4Text },
  { bg: LEGACY_COLORS.avatar.avatar5Bg, text: LEGACY_COLORS.avatar.avatar5Text },
  { bg: LEGACY_COLORS.avatar.avatar6Bg, text: LEGACY_COLORS.avatar.avatar6Text },
  { bg: LEGACY_COLORS.avatar.avatar7Bg, text: LEGACY_COLORS.avatar.avatar7Text },
  { bg: LEGACY_COLORS.avatar.avatar8Bg, text: LEGACY_COLORS.avatar.avatar8Text },
  { bg: LEGACY_COLORS.avatar.avatar9Bg, text: LEGACY_COLORS.avatar.avatar9Text },
  { bg: LEGACY_COLORS.avatar.avatar10Bg, text: LEGACY_COLORS.avatar.avatar10Text },
  { bg: LEGACY_COLORS.surfaceVariant, text: LEGACY_COLORS.onSurfaceVariant },
  { bg: LEGACY_COLORS.errorContainer, text: LEGACY_COLORS.onErrorContainer },
];

/**
 * Returns a set of harmonious M3 Container colors for an avatar based on a string.
 * Guarantees accessible contrast (Dark Text on Light Background).
 */
export const getAvatarColors = (str: string): { bg: string; textColor: string } => {
    if (!str) return AVATAR_PALETTES[0];
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash % AVATAR_PALETTES.length);
    return AVATAR_PALETTES[index];
};


