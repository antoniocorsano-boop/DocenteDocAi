/*
COPILOT TASK:
Generate a full ESLint configuration for this React/MD3 project.
- Infrastructure files: tokens.ts, theme.tsx
- UI components: all other .tsx files
Rules:
- Keep TypeScript, hooks, and unused-vars active everywhere.
- Apply strict MD3 UI rules only to UI components.
- Relax MD3-specific rules in tokens.ts and theme.tsx (like no-hardcoded-colors, no className, no Tailwind)
- Explain why each override exists in comments
*/


import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { tokens } from './tokens';

// Tipo per gli overrides
export interface ThemeOverrides {
  colors?: Partial<typeof tokens.colors>;
  typography?: Partial<typeof tokens.typography>;
  spacing?: Partial<typeof tokens.spacing>;
  motion?: Partial<typeof tokens.motion>;
}

// Tipo per il tema
export interface Theme {
  colors: typeof tokens.colors;
  typography: typeof tokens.typography;
  spacing: typeof tokens.spacing;
  motion: typeof tokens.motion;
  breakpoints: typeof tokens.breakpoints;
  isDark: boolean;
  toggleDarkMode: () => void;
  overrides: ThemeOverrides;
  updateOverrides: (newOverrides: ThemeOverrides) => void;
  resetOverrides: () => void;
}

// Crea il context
const ThemeContext = createContext<Theme | undefined>(undefined);

// Hook per usare il tema
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a M3ThemeProvider');
  }
  return context;
};

// M3ThemeProvider component
interface M3ThemeProviderProps {
  children: ReactNode;
  defaultDark?: boolean;
}

export const M3ThemeProvider: React.FC<M3ThemeProviderProps> = ({ children, defaultDark = false }) => {
  const [isDark, setIsDark] = useState(defaultDark);
  const [overrides, setOverrides] = useState<ThemeOverrides>({});

  // Carica il tema e gli overrides dal localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('m3-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    const savedOverrides = localStorage.getItem('m3-theme-overrides');
    if (savedOverrides) {
      try {
        setOverrides(JSON.parse(savedOverrides));
      } catch (e) {
        console.warn('Failed to parse theme overrides from localStorage');
      }
    }
  }, []);

  // Salva il tema e gli overrides nel localStorage
  useEffect(() => {
    localStorage.setItem('m3-theme', isDark ? 'dark' : 'light');
    // Applica classe al body per CSS globale
    document.body.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('m3-theme-overrides', JSON.stringify(overrides));
  }, [overrides]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const updateOverrides = (newOverrides: ThemeOverrides) => {
    setOverrides(prev => ({ ...prev, ...newOverrides }));
  };

  const resetOverrides = () => {
    setOverrides({});
  };

  // Funzione per unire gli overrides con i token base
  const mergeTokens = <T extends Record<string, any>>(base: T, override?: Partial<T>): T => {
    if (!override) return base;
    const merged = { ...base };
    Object.keys(override).forEach(key => {
      if (override[key] !== undefined) {
        merged[key] = override[key];
      }
    });
    return merged;
  };

  const theme: Theme = {
    colors: mergeTokens(isDark ? tokens.colors.dark : tokens.colors.light, overrides.colors),
    typography: mergeTokens(tokens.typography, overrides.typography),
    spacing: mergeTokens(tokens.spacing, overrides.spacing),
    motion: mergeTokens(tokens.motion, overrides.motion),
    breakpoints: tokens.breakpoints,
    isDark,
    toggleDarkMode,
    overrides,
    updateOverrides,
    resetOverrides,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};