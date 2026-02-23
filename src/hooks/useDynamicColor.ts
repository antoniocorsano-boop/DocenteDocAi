/**
 * useDynamicColor.ts
 * React hook for Material Design 3 Dynamic Color
 */

import { useState, useCallback, useEffect } from 'react';
import {
  DynamicColorScheme,
  generateDynamicScheme,
  extractColorFromImage,
  applyDynamicColors,
} from '../design-system/dynamic-color';

interface UseDynamicColorReturn {
  scheme: DynamicColorScheme | null;
  isLoading: boolean;
  error: Error | null;
  generateFromColor: (color: string) => void;
  generateFromImage: (imageUrl: string) => Promise<void>;
  resetToDefault: () => void;
}

const defaultScheme: DynamicColorScheme = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#D0BCFF',
};

export function useDynamicColor(
  autoApply: boolean = true
): UseDynamicColorReturn {
  const [scheme, setScheme] = useState<DynamicColorScheme | null>(defaultScheme);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Apply colors to CSS when scheme changes
  useEffect(() => {
    if (autoApply && scheme) {
      applyDynamicColors(scheme);
    }
  }, [scheme, autoApply]);

  const generateFromColor = useCallback((color: string) => {
    try {
      setError(null);
      const newScheme = generateDynamicScheme(color);
      setScheme(newScheme);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate color scheme'));
    }
  }, []);

  const generateFromImage = useCallback(async (imageUrl: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const color = await extractColorFromImage(imageUrl);
      const newScheme = generateDynamicScheme(color);
      setScheme(newScheme);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to extract color from image'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setScheme(defaultScheme);
    setError(null);
  }, []);

  return {
    scheme,
    isLoading,
    error,
    generateFromColor,
    generateFromImage,
    resetToDefault,
  };
}

export default useDynamicColor;
