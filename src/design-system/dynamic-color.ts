/**
 * dynamic-color.ts
 * Material Design 3 Dynamic Color support
 * Generates color schemes from source colors (wallpaper, image, etc.)
 * https://m3.material.io/styles/color/dynamic-color/overview
 */

import { Theme } from '../theme/tokens';

export interface DynamicColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

/**
 * Simple hex to HCT-like color conversion for dynamic theming
 * In a full implementation, this would use @material/material-color-utilities
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generate a dynamic color scheme from a source color
 * This is a simplified implementation - full MD3 uses HCT color space
 */
export function generateDynamicScheme(sourceColor: string): DynamicColorScheme {
  const hsl = hexToHSL(sourceColor);

  // Generate primary from source
  const primary = sourceColor;
  const onPrimary = hsl.l > 50 ? '#000000' : '#FFFFFF';

  // Secondary: 15° hue shift, lower chroma
  const secondaryHSL = { ...hsl, s: Math.max(0, hsl.s - 20), l: Math.min(90, hsl.l + 10) };
  const secondary = hslToHex(secondaryHSL.h + 15, secondaryHSL.s, secondaryHSL.l);
  const onSecondary = secondaryHSL.l > 50 ? '#000000' : '#FFFFFF';

  // Tertiary: 60° hue shift (complementary-ish)
  const tertiaryHSL = { ...hsl, s: Math.max(0, hsl.s - 10), l: Math.min(85, hsl.l + 5) };
  const tertiary = hslToHex((tertiaryHSL.h + 60) % 360, tertiaryHSL.s, tertiaryHSL.l);
  const onTertiary = tertiaryHSL.l > 50 ? '#000000' : '#FFFFFF';

  // Containers: lighter variants
  const primaryContainer = hslToHex(hsl.h, Math.max(0, hsl.s - 10), Math.min(95, hsl.l + 35));
  const onPrimaryContainer = hsl.l > 50 ? '#000000' : sourceColor;

  const secondaryContainer = hslToHex(secondaryHSL.h + 15, Math.max(0, secondaryHSL.s - 10), 95);
  const onSecondaryContainer = secondary;

  const tertiaryContainer = hslToHex((tertiaryHSL.h + 60) % 360, Math.max(0, tertiaryHSL.s - 10), 95);
  const onTertiaryContainer = tertiary;

  // Error (red family, fixed)
  const error = '#B3261E';
  const onError = '#FFFFFF';
  const errorContainer = '#F9DEDC';
  const onErrorContainer = '#410E0B';

  // Surfaces: neutral with slight hue from source
  const surface = hslToHex(hsl.h, 5, 98);
  const onSurface = '#1C1B1F';
  const surfaceVariant = hslToHex(hsl.h, 8, 92);
  const onSurfaceVariant = '#49454F';

  // Outlines
  const outline = hslToHex(hsl.h, 6, 74);
  const outlineVariant = hslToHex(hsl.h, 6, 88);

  // Shadows
  const shadow = '#000000';
  const scrim = '#000000';

  // Inverse
  const inverseSurface = '#313033';
  const inverseOnSurface = '#F4EFF4';
  const inversePrimary = hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 30));

  return {
    primary,
    onPrimary,
    primaryContainer,
    onPrimaryContainer,
    secondary,
    onSecondary,
    secondaryContainer,
    onSecondaryContainer,
    tertiary,
    onTertiary,
    tertiaryContainer,
    onTertiaryContainer,
    error,
    onError,
    errorContainer,
    onErrorContainer,
    surface,
    onSurface,
    surfaceVariant,
    onSurfaceVariant,
    outline,
    outlineVariant,
    shadow,
    scrim,
    inverseSurface,
    inverseOnSurface,
    inversePrimary,
  };
}

/**
 * Extract dominant color from an image
 * Returns a Promise that resolves to a hex color
 */
export async function extractColorFromImage(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Sample a small version for performance
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      // Get center pixel color (usually most representative)
      const pixelData = ctx.getImageData(50, 50, 1, 1).data;
      const hex = `#${
        pixelData[0].toString(16).padStart(2, '0') +
        pixelData[1].toString(16).padStart(2, '0') +
        pixelData[2].toString(16).padStart(2, '0')
      }`;

      resolve(hex.toUpperCase());
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Generate a theme from a wallpaper/image
 */
export async function generateThemeFromWallpaper(imageUrl: string): Promise<Partial<Theme>> {
  const sourceColor = await extractColorFromImage(imageUrl);
  const scheme = generateDynamicScheme(sourceColor);

  return {
    colors: scheme,
  };
}

/**
 * Apply dynamic colors to CSS custom properties
 */
export function applyDynamicColors(scheme: DynamicColorScheme): void {
  const root = document.documentElement;

  root.style.setProperty('--md-sys-color-primary', scheme.primary);
  root.style.setProperty('--md-sys-color-on-primary', scheme.onPrimary);
  root.style.setProperty('--md-sys-color-primary-container', scheme.primaryContainer);
  root.style.setProperty('--md-sys-color-on-primary-container', scheme.onPrimaryContainer);
  root.style.setProperty('--md-sys-color-secondary', scheme.secondary);
  root.style.setProperty('--md-sys-color-on-secondary', scheme.onSecondary);
  root.style.setProperty('--md-sys-color-secondary-container', scheme.secondaryContainer);
  root.style.setProperty('--md-sys-color-on-secondary-container', scheme.onSecondaryContainer);
  root.style.setProperty('--md-sys-color-tertiary', scheme.tertiary);
  root.style.setProperty('--md-sys-color-on-tertiary', scheme.onTertiary);
  root.style.setProperty('--md-sys-color-tertiary-container', scheme.tertiaryContainer);
  root.style.setProperty('--md-sys-color-on-tertiary-container', scheme.onTertiaryContainer);
  root.style.setProperty('--md-sys-color-error', scheme.error);
  root.style.setProperty('--md-sys-color-on-error', scheme.onError);
  root.style.setProperty('--md-sys-color-error-container', scheme.errorContainer);
  root.style.setProperty('--md-sys-color-on-error-container', scheme.onErrorContainer);
  root.style.setProperty('--md-sys-color-surface', scheme.surface);
  root.style.setProperty('--md-sys-color-on-surface', scheme.onSurface);
  root.style.setProperty('--md-sys-color-surface-variant', scheme.surfaceVariant);
  root.style.setProperty('--md-sys-color-on-surface-variant', scheme.onSurfaceVariant);
  root.style.setProperty('--md-sys-color-outline', scheme.outline);
  root.style.setProperty('--md-sys-color-outline-variant', scheme.outlineVariant);
  root.style.setProperty('--md-sys-color-shadow', scheme.shadow);
  root.style.setProperty('--md-sys-color-scrim', scheme.scrim);
  root.style.setProperty('--md-sys-color-inverse-surface', scheme.inverseSurface);
  root.style.setProperty('--md-sys-color-inverse-on-surface', scheme.inverseOnSurface);
  root.style.setProperty('--md-sys-color-inverse-primary', scheme.inversePrimary);
}

export default {
  generateDynamicScheme,
  extractColorFromImage,
  generateThemeFromWallpaper,
  applyDynamicColors,
};
