import { Theme, ColorTokens } from '../types'; // FIX: Updated import path to types
import LEGACY_COLORS from './legacy-colors';

/* eslint-disable design-system/no-hardcoded-colors */

/**
 * DESIGN SYSTEM EXCEPTION: Base Color Token Definitions
 * 
 * These HEX color values are HARDCODED by design. They are the SOURCE OF TRUTH
 * for the Material Design 3 default color system. These values are used to:
 * 
 * 1. Generate CSS variables (--md-sys-color-primary, --md-sys-color-secondary, etc.)
 * 2. Define the design token system in src/design-system/index.ts
 * 3. Automatically switch between light and dark mode
 * 
 * These values MUST NOT be used directly in component code.
 * Instead, always use the generated CSS variables:
 *   ❌ WRONG: color: 'var(--app-legacy-color-6750a4, var(--app-legacy-color-6750a4, #6750A4))'
 *   ✅ RIGHT: color: 'var(--md-sys-color-primary)'
 * 
 * Documented in: docs/DESIGN_SYSTEM_CONSOLIDATION.md § 5 (Exceptions)
 */

// Source of Truth for raw color values in HEX
export const lightColors: ColorTokens = {
  primary: LEGACY_COLORS.primary, onPrimary: LEGACY_COLORS.white, primaryContainer: LEGACY_COLORS.primaryContainer, onPrimaryContainer: LEGACY_COLORS.primaryContainerOn,
  secondary: LEGACY_COLORS.secondary, onSecondary: LEGACY_COLORS.white, secondaryContainer: LEGACY_COLORS.primaryContainer, onSecondaryContainer: LEGACY_COLORS.onSecondaryContainer,
  tertiary: LEGACY_COLORS.tertiary, onTertiary: LEGACY_COLORS.white, tertiaryContainer: LEGACY_COLORS.gold, onTertiaryContainer: LEGACY_COLORS.onTertiaryContainer,
  error: LEGACY_COLORS.error, onError: LEGACY_COLORS.white, errorContainer: LEGACY_COLORS.errorContainer, onErrorContainer: LEGACY_COLORS.onErrorContainer,
  background: 'var(--md-sys-color-surface)', onBackground: 'var(--md-sys-color-on-surface)',
  surface: LEGACY_COLORS.surfaceLight, onSurface: LEGACY_COLORS.onBackground, surfaceVariant: LEGACY_COLORS.surfaceVariant, onSurfaceVariant: LEGACY_COLORS.onSurfaceVariant,
  outline: LEGACY_COLORS.outline, outlineVariant: LEGACY_COLORS.outlineVariant,
  surfaceContainerLowest: LEGACY_COLORS.white, surfaceContainerLow: LEGACY_COLORS.surfaceContainerLow, surfaceContainer: LEGACY_COLORS.surfaceContainer, surfaceContainerHigh: LEGACY_COLORS.surfaceContainerHigh, surfaceContainerHighest: LEGACY_COLORS.surfaceContainerHighest,
  surfaceDisabled: LEGACY_COLORS.surfaceDisabledLight,
};

export const darkColors: ColorTokens = {
  primary: LEGACY_COLORS.primaryLight, onPrimary: LEGACY_COLORS.primaryLightOn, primaryContainer: LEGACY_COLORS.primaryLightContainer, onPrimaryContainer: LEGACY_COLORS.primaryContainer,
  secondary: LEGACY_COLORS.secondaryLight, onSecondary: LEGACY_COLORS.secondaryLightOn, secondaryContainer: LEGACY_COLORS.secondaryLightContainer, onSecondaryContainer: LEGACY_COLORS.onSecondaryContainer,
  tertiary: LEGACY_COLORS.tertiaryLight, onTertiary: LEGACY_COLORS.tertiaryLightOn, tertiaryContainer: LEGACY_COLORS.tertiaryLightContainer, onTertiaryContainer: LEGACY_COLORS.gold,
  error: LEGACY_COLORS.errorLight, onError: LEGACY_COLORS.errorLightOn, errorContainer: LEGACY_COLORS.errorLightContainer, onErrorContainer: LEGACY_COLORS.errorContainer,
  background: LEGACY_COLORS.onBackground, onBackground: LEGACY_COLORS.surfaceLight,
  surface: LEGACY_COLORS.onBackground, onSurface: LEGACY_COLORS.surfaceLight, surfaceVariant: LEGACY_COLORS.onSurfaceVariant, onSurfaceVariant: LEGACY_COLORS.surfaceContainerHighest,
  outline: LEGACY_COLORS.outline, outlineVariant: LEGACY_COLORS.outlineVariant,
  surfaceContainerLowest: LEGACY_COLORS.onBackground, surfaceContainerLow: LEGACY_COLORS.surfaceContainerLow, surfaceContainer: LEGACY_COLORS.surfaceContainer, surfaceContainerHigh: LEGACY_COLORS.surfaceContainerHigh, surfaceContainerHighest: LEGACY_COLORS.surfaceContainerHighest,
  surfaceDisabled: LEGACY_COLORS.surfaceDisabledDark,
};

/** Default light theme instance. */
export const defaultLightTheme: Theme = {
  name: 'Default Light',
  mode: 'light',
  visualStyle: 'aura',
  colors: lightColors,
  glassBlur: 30,
  radiusMultiplier: 1,
  fontScale: 1,
  contrastLevel: 0,
};

/** Default dark theme instance. */
export const defaultDarkTheme: Theme = {
  name: 'Default Dark',
  mode: 'dark',
  visualStyle: 'aura',
  colors: darkColors,
  glassBlur: 30,
  radiusMultiplier: 1,
  fontScale: 1,
  contrastLevel: 0,
};


// --- Color Utilities ---

interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }

export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
};

export const hexToRgbString = (hex: string): string | null => {
  const rgb = hexToRgb(hex);
  return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : null;
};

export const rgbToHsl = (r: number, g: number, b: number): HSL => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; 
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const hslToRgb = (h: number, s: number, l: number): RGB => {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; 
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
};

export const adjustColor = (hue: number, saturation: number, lightness: number): string => {
    const rgb = hslToRgb(hue, saturation, lightness);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
};

export const getRelativeLuminance = (r: number, g: number, b: number): number => {
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;

    const R = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const G = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const B = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

export const getLegibleTextColor = (hexBackgroundColor: string): string => {
    const rgb = hexToRgb(hexBackgroundColor);
    if (!rgb) return 'var(--md-sys-color-on-surface)'; 

    const bgLuminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
    
    const contrastWhite = (1.0 + 0.05) / (bgLuminance + 0.05);
    const contrastBlack = (bgLuminance + 0.05) / (0.0 + 0.05);

    return contrastBlack >= contrastWhite ? 'var(--md-sys-color-on-surface)' : 'var(--app-legacy-color-ffffff, var(--app-legacy-color-ffffff, #FFFFFF))';
};


