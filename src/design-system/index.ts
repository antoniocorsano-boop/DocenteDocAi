import { Theme, ColorTokens, DesignSystemDefinition } from '../types';
import { defaultLightTheme, defaultDarkTheme, hexToRgb, rgbToHsl, adjustColor, getLegibleTextColor, hexToRgbString } from './utils';

/**
 * The single source of truth for the design system definition.
 * It is immutable to prevent accidental changes at runtime.
 */
export const baseDesignSystem: Readonly<DesignSystemDefinition> = Object.freeze({
  version: '4.0.0-rc1',
  colors: {
    primary: { value: defaultLightTheme.colors.primary, description: 'The primary color for main interactive elements.', cssVar: '--sys-primary' },
    onPrimary: { value: defaultLightTheme.colors.onPrimary, description: 'Text and icons on top of the primary color.', cssVar: '--sys-on-primary' },
    primaryContainer: { value: defaultLightTheme.colors.primaryContainer, description: 'A container color derived from the primary color.', cssVar: '--sys-primary-container' },
    onPrimaryContainer: { value: defaultLightTheme.colors.onPrimaryContainer, description: 'Text and icons on top of the primary container color.', cssVar: '--sys-on-primary-container' },
    secondary: { value: defaultLightTheme.colors.secondary, description: 'The secondary color for less prominent elements.', cssVar: '--sys-secondary' },
    onSecondary: { value: defaultLightTheme.colors.onSecondary, description: 'Text and icons on top of the secondary color.', cssVar: '--sys-on-secondary' },
    secondaryContainer: { value: defaultLightTheme.colors.secondaryContainer, description: 'A container color derived from the secondary color.', cssVar: '--sys-secondary-container' },
    onSecondaryContainer: { value: defaultLightTheme.colors.onSecondaryContainer, description: 'Text and icons on top of the secondary container color.', cssVar: '--sys-on-secondary-container' },
    tertiary: { value: defaultLightTheme.colors.tertiary, description: 'The tertiary color for contrasting accents.', cssVar: '--sys-tertiary' },
    onTertiary: { value: defaultLightTheme.colors.onTertiary, description: 'Text and icons on top of the tertiary color.', cssVar: '--sys-on-tertiary' },
    tertiaryContainer: { value: defaultLightTheme.colors.tertiaryContainer, description: 'A container color derived from the tertiary color.', cssVar: '--sys-tertiary-container' },
    onTertiaryContainer: { value: defaultLightTheme.colors.onTertiaryContainer, description: 'Text and icons on top of the tertiary container color.', cssVar: '--sys-on-tertiary-container' },
    error: { value: defaultLightTheme.colors.error, description: 'Color for error states.', cssVar: '--sys-error' },
    onError: { value: defaultLightTheme.colors.onError, description: 'Text and icons on top of the error color.', cssVar: '--sys-on-error' },
    errorContainer: { value: defaultLightTheme.colors.errorContainer, description: 'A container color for error states.', cssVar: '--sys-error-container' },
    onErrorContainer: { value: defaultLightTheme.colors.onErrorContainer, description: 'Text and icons on top of the error container color.', cssVar: '--sys-on-error-container' },
    background: { value: defaultLightTheme.colors.background, description: 'The main background color of the app.', cssVar: '--sys-background' },
    onBackground: { value: defaultLightTheme.colors.onBackground, description: 'Text and icons on top of the background color.', cssVar: '--sys-on-background' },
    surface: { value: defaultLightTheme.colors.surface, description: 'The color of component surfaces like cards and menus.', cssVar: '--sys-surface' },
    onSurface: { value: defaultLightTheme.colors.onSurface, description: 'Text and icons on top of surface colors.', cssVar: '--sys-on-surface' },
    surfaceVariant: { value: defaultLightTheme.colors.surfaceVariant, description: 'A variant of the surface color for subtle differentiation.', cssVar: '--sys-surface-variant' },
    onSurfaceVariant: { value: defaultLightTheme.colors.onSurfaceVariant, description: 'Text and icons on top of surface variant colors.', cssVar: '--sys-on-surface-variant' },
    outline: { value: defaultLightTheme.colors.outline, description: 'Color for borders and dividers.', cssVar: '--sys-outline' },
    outlineVariant: { value: defaultLightTheme.colors.outlineVariant, description: 'A subtler color for borders and dividers.', cssVar: '--sys-outline-variant' },
    surfaceContainerLowest: { value: defaultLightTheme.colors.surfaceContainerLowest, description: 'Lowest emphasis surface color.', cssVar: '--sys-surface-container-lowest' },
    surfaceContainerLow: { value: defaultLightTheme.colors.surfaceContainerLow, description: 'Low emphasis surface color.', cssVar: '--sys-surface-container-low' },
    surfaceContainer: { value: defaultLightTheme.colors.surfaceContainer, description: 'Default emphasis surface color.', cssVar: '--sys-surface-container' },
    surfaceContainerHigh: { value: defaultLightTheme.colors.surfaceContainerHigh, description: 'High emphasis surface color.', cssVar: '--sys-surface-container-high' },
    surfaceContainerHighest: { value: defaultLightTheme.colors.surfaceContainerHighest, description: 'Highest emphasis surface color.', cssVar: '--sys-surface-container-highest' },
    surfaceDisabled: { value: defaultLightTheme.colors.surfaceDisabled, description: 'Color for disabled surfaces.', cssVar: '--sys-surface-disabled' },
  },
  typography: {
    displayLarge: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '57px', fontWeight: '400', lineHeight: '64px' }, description: 'Style for large, impactful display text.', cssVar: '--typography-display-large' },
    displayMedium: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '45px', fontWeight: '400', lineHeight: '52px' }, description: 'Style for medium display text.', cssVar: '--typography-display-medium' },
    displaySmall: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '36px', fontWeight: '400', lineHeight: '44px' }, description: 'Style for small display text.', cssVar: '--typography-display-small' },
    headlineLarge: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '32px', fontWeight: '400', lineHeight: '40px' }, description: 'Style for large headlines.', cssVar: '--typography-headline-large' },
    headlineMedium: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '28px', fontWeight: '400', lineHeight: '36px' }, description: 'Style for medium headlines.', cssVar: '--typography-headline-medium' },
    headlineSmall: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '24px', fontWeight: '400', lineHeight: '32px' }, description: 'Style for small headlines.', cssVar: '--typography-headline-small' },
    titleLarge: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '22px', fontWeight: '400', lineHeight: '28px' }, description: 'Style for large titles.', cssVar: '--typography-title-large' },
    titleMedium: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '16px', fontWeight: '500', lineHeight: '24px' }, description: 'Style for medium titles.', cssVar: '--typography-title-medium' },
    titleSmall: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '14px', fontWeight: '500', lineHeight: '20px' }, description: 'Style for small titles.', cssVar: '--typography-title-small' },
    labelLarge: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '14px', fontWeight: '500', lineHeight: '20px' }, description: 'Style for large labels, like buttons.', cssVar: '--typography-label-large' },
    labelMedium: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '12px', fontWeight: '500', lineHeight: '16px' }, description: 'Style for medium labels.', cssVar: '--typography-label-medium' },
    labelSmall: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '11px', fontWeight: '500', lineHeight: '16px' }, description: 'Style for small labels.', cssVar: '--typography-label-small' },
    bodyLarge: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '16px', fontWeight: '400', lineHeight: '24px' }, description: 'Style for large body text.', cssVar: '--typography-body-large' },
    bodyMedium: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '14px', fontWeight: '400', lineHeight: '20px' }, description: 'Style for medium body text.', cssVar: '--typography-body-medium' },
    bodySmall: { value: { fontFamily: "'Roboto', sans-serif", fontSize: '12px', fontWeight: '400', lineHeight: '16px' }, description: 'Style for small body text.', cssVar: '--typography-body-small' },
  },
  spacing: {
    '1': { value: '0.25rem', description: '4px', cssVar: '--spacing-1' },
    '2': { value: '0.5rem', description: '8px', cssVar: '--spacing-2' },
    '3': { value: '0.75rem', description: '12px', cssVar: '--spacing-3' },
    '4': { value: '1rem', description: '16px', cssVar: '--spacing-4' },
    '6': { value: '1.5rem', description: '24px', cssVar: '--spacing-6' },
    '8': { value: '2rem', description: '32px', cssVar: '--spacing-8' },
  }
});

/** Default light theme instance. */
export { defaultLightTheme };

/** Default dark theme instance. */
export { defaultDarkTheme };


// --- Main Functions (Moved from utils.ts) ---

const generateRolePalette = (hexSeed: string, mode: 'light' | 'dark', role: 'primary' | 'secondary' | 'tertiary' | 'error') => {
    const rgb = hexToRgb(hexSeed);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    let mainL, contL;

    if (mode === 'light') {
        mainL = role === 'primary' ? 40 : (role === 'error' ? 40 : 50); 
        contL = 96; 
    } else {
        mainL = 80; 
        contL = 30; 
    }

    const mainHex = adjustColor(hsl.h, hsl.s, mainL);
    const containerHex = adjustColor(hsl.h, hsl.s, contL);

    const onMainHex = getLegibleTextColor(mainHex);
    const onContainerHex = getLegibleTextColor(containerHex);

    return {
        main: mainHex,
        container: containerHex,
        onMain: onMainHex,
        onContainer: onContainerHex
    };
};

const generateNeutralPalette = (hexSeed: string, mode: 'light' | 'dark') => {
    const rgb = hexToRgb(hexSeed);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    const neutralS = 4; 
    const variantS = 8;

    if (mode === 'light') {
        return {
            background: adjustColor(hsl.h, neutralS, 99),
            onBackground: adjustColor(hsl.h, neutralS, 10),
            surface: adjustColor(hsl.h, neutralS, 99),
            onSurface: adjustColor(hsl.h, neutralS, 10),
            surfaceVariant: adjustColor(hsl.h, variantS, 90), 
            onSurfaceVariant: adjustColor(hsl.h, variantS, 30),
            outline: adjustColor(hsl.h, variantS, 50),
            outlineVariant: adjustColor(hsl.h, variantS, 80),
            surfaceContainerLowest: adjustColor(hsl.h, neutralS, 100),
            surfaceContainerLow: adjustColor(hsl.h, neutralS, 96),
            surfaceContainer: adjustColor(hsl.h, neutralS, 94),
            surfaceContainerHigh: adjustColor(hsl.h, neutralS, 92),
            surfaceContainerHighest: adjustColor(hsl.h, neutralS, 90),
        };
    } else {
        return {
            background: adjustColor(hsl.h, neutralS, 6), 
            onBackground: adjustColor(hsl.h, neutralS, 90),
            surface: adjustColor(hsl.h, neutralS, 6),
            onSurface: adjustColor(hsl.h, neutralS, 90),
            surfaceVariant: adjustColor(hsl.h, variantS, 30), 
            onSurfaceVariant: adjustColor(hsl.h, variantS, 80),
            outline: adjustColor(hsl.h, variantS, 60),
            outlineVariant: adjustColor(hsl.h, variantS, 30),
            surfaceContainerLowest: adjustColor(hsl.h, neutralS, 4),
            surfaceContainerLow: adjustColor(hsl.h, neutralS, 10),
            surfaceContainer: adjustColor(hsl.h, neutralS, 12),
            surfaceContainerHigh: adjustColor(hsl.h, neutralS, 17),
            surfaceContainerHighest: adjustColor(hsl.h, neutralS, 22),
        };
    }
};

export const validateTheme = (theme: unknown): theme is Theme => {
  if (typeof theme !== 'object' || theme === null) return false;
  const themeObj = theme as Theme;
  if (!themeObj.mode || !themeObj.colors) return false;
  const baseColorKeys = Object.keys(baseDesignSystem.colors); 
  const themeColorKeys = Object.keys(themeObj.colors);
  return baseColorKeys.every(key => themeColorKeys.includes(key));
};

export const createTheme = (config: { name: string; mode: 'light' | 'dark'; colors?: Partial<ColorTokens> }): Theme => {
  const baseTheme = config.mode === 'light' ? defaultLightTheme : defaultDarkTheme;
  const newColors = { ...baseTheme.colors };

  const primarySeed = (config.colors && config.colors.primary) ? config.colors.primary : baseTheme.colors.primary;

  const neutralPalette = generateNeutralPalette(primarySeed, config.mode);
  if (neutralPalette) {
      Object.assign(newColors, neutralPalette);
  }

  const roles = ['primary', 'secondary', 'tertiary', 'error'] as const;
  
  roles.forEach(role => {
      const roleSeed = (config.colors && config.colors[role]) ? config.colors[role] : (baseTheme.colors as any)[role]; // Cast to any to handle indexing
      const palette = generateRolePalette(roleSeed || (baseTheme.colors as any)[role], config.mode, role); // Cast to any to handle indexing
      
      if (palette) {
          const mainKey = role;
          const containerKey = `${role}Container` as keyof ColorTokens;
          const onMainKey = `on${role.charAt(0).toUpperCase() + role.slice(1)}` as keyof ColorTokens;
          const onContainerKey = `on${role.charAt(0).toUpperCase() + role.slice(1)}Container` as keyof ColorTokens;

          if (!(config.colors as any)?.[mainKey]) (newColors as any)[mainKey] = palette.main;
          if (!(config.colors as any)?.[containerKey]) (newColors as any)[containerKey] = palette.container;
          if (!(config.colors as any)?.[onMainKey]) (newColors as any)[onMainKey] = palette.onMain;
          if (!(config.colors as any)?.[onContainerKey]) (newColors as any)[onContainerKey] = palette.onContainer;
      }
  });

  if (config.colors) {
      for (const key in config.colors) {
          if (Object.prototype.hasOwnProperty.call(config.colors, key)) {
              const tokenKey = key as keyof ColorTokens;
              if (config.colors[tokenKey]) {
                  (newColors as any)[tokenKey] = config.colors[tokenKey]!; // Cast to any
              }
          }
      }
  }

  return {
    name: config.name,
    mode: config.mode,
    colors: newColors,
  };
};

export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  const body = document.body;
  
  let themeToApply = theme;

  if (!validateTheme(theme)) {
    themeToApply = (theme as Partial<Theme>).mode === 'dark' ? defaultDarkTheme : defaultLightTheme;
  }
  
  root.style.colorScheme = themeToApply.mode;

  const classesToRemove = Array.from(body.classList).filter(c => c.startsWith('theme-'));
  if (classesToRemove.length > 0) body.classList.remove(...classesToRemove);
  
  body.classList.add(`theme-${themeToApply.mode}`);

  if (themeToApply.name) {
      const themeSlug = themeToApply.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      
      if (themeSlug && themeSlug !== themeToApply.mode) {
          body.classList.add(`theme-${themeSlug}`);
      }
  }
  
  for (const key in themeToApply.colors) {
    const tokenName = key as keyof ColorTokens;
    const tokenInfo = baseDesignSystem.colors[tokenName];
    if (tokenInfo) {
      const value = (themeToApply.colors as any)[tokenName]; // Cast to any
      root.style.setProperty(tokenInfo.cssVar, value);
      
      const rgbValue = hexToRgbString(value);
      if (rgbValue) {
        root.style.setProperty(`${tokenInfo.cssVar}-rgb`, rgbValue);
      }
    }
  }

  for (const key in baseDesignSystem.typography) {
    const tokenName = key as keyof typeof baseDesignSystem.typography;
    const tokenInfo = baseDesignSystem.typography[tokenName];
    for (const prop in tokenInfo.value) {
      const propName = prop as keyof typeof tokenInfo.value;
      root.style.setProperty(`${tokenInfo.cssVar}-${propName.toString()}`, (tokenInfo.value as any)[propName] as string); // Cast to any
    }
  }

  for (const key in baseDesignSystem.spacing) {
    const tokenName = key as keyof typeof baseDesignSystem.spacing;
    const tokenInfo = baseDesignSystem.spacing[tokenName];
    root.style.setProperty(tokenInfo.cssVar, tokenInfo.value);
  }
};