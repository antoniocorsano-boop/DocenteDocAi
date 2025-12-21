import { ColorTokens } from '../types'; // FIX: Updated import path to types

/**
 * Generates a consistent hue value from a string.
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

// M3 EXPRESSIVE CONTAINER PALETTE
// Pastel/Light backgrounds with Dark contrasting text.
// Better for readability and fits the modern M3 look (instead of dark solid blobs).
const AVATAR_PALETTES = [
    { bg: '#EADDFF', text: '#21005D' }, // Primary Container (Purple)
    { bg: '#E8DEF8', text: '#1D192B' }, // Secondary Container (Slate)
    { bg: '#FFD8E4', text: '#31111D' }, // Tertiary Container (Pink)
    { bg: '#FFDBCF', text: '#380D00' }, // Orange Container
    { bg: '#C4EED0', text: '#07210F' }, // Green Container
    { bg: '#D7E3FF', text: '#001B3D' }, // Blue Container
    { bg: '#E0E0FF', text: '#00006E' }, // Indigo Container
    { bg: '#FFD9E3', text: '#3E001D' }, // Rose Container
    { bg: '#F2DDA6', text: '#261900' }, // Yellow Container
    { bg: '#CBE6FF', text: '#001E30' }, // Cyan Container
    { bg: '#E6E0E9', text: '#1D1B20' }, // Surface Variant (Grey)
    { bg: '#F9DEDC', text: '#410E0B' }, // Error Container (Red)
];

/**
 * Returns a set of harmonious M3 Container colors for an avatar based on a string.
 * Guarantees accessible contrast (Dark Text on Light Background).
 */
export const getAvatarColors = (str: string) => {
    if (!str) return AVATAR_PALETTES[0];
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash % AVATAR_PALETTES.length);
    return AVATAR_PALETTES[index];
};
