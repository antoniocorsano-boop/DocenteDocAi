// MD3 Gold Compliant
// Theme Context per gestione Light/Dark/High Contrast modes
// Audit: febbraio 2026

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ContrastMode = 'normal' | 'high';

interface ThemeContextValue {
  // Theme mode
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  
  // Contrast mode
  contrast: ContrastMode;
  setContrast: (contrast: ContrastMode) => void;
  
  // Reduced motion
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  
  // Computed values
  effectiveTheme: 'light' | 'dark';
  isSystemTheme: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Storage keys
const STORAGE_KEY_MODE = 'docentedoc-theme-mode';
const STORAGE_KEY_CONTRAST = 'docentedoc-theme-contrast';
const STORAGE_KEY_MOTION = 'docentedoc-reduced-motion';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Theme mode state
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_MODE);
    return (stored as ThemeMode) || 'auto';
  });

  // Contrast mode state
  const [contrast, setContrastState] = useState<ContrastMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_CONTRAST);
    return (stored as ContrastMode) || 'normal';
  });

  // Reduced motion state
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_MOTION);
    if (stored !== null) return stored === 'true';
    
    // Default to system preference
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // System theme detection
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Computed effective theme
  const effectiveTheme = mode === 'auto' ? systemTheme : mode;
  const isSystemTheme = mode === 'auto';

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen to system reduced motion changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't explicitly set preference
      const stored = localStorage.getItem(STORAGE_KEY_MOTION);
      if (stored === null) {
        setReducedMotionState(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Set theme class
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${effectiveTheme}`);
    
    // Set contrast class
    root.classList.remove('contrast-normal', 'contrast-high');
    root.classList.add(`contrast-${contrast}`);
    
    // Set reduced motion class
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Set data attributes for CSS
    root.setAttribute('data-theme', effectiveTheme);
    root.setAttribute('data-contrast', contrast);
    root.setAttribute('data-reduced-motion', reducedMotion.toString());
  }, [effectiveTheme, contrast, reducedMotion]);

  // Persist mode
  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY_MODE, newMode);
  };

  // Persist contrast
  const setContrast = (newContrast: ContrastMode) => {
    setContrastState(newContrast);
    localStorage.setItem(STORAGE_KEY_CONTRAST, newContrast);
  };

  // Persist reduced motion
  const setReducedMotion = (value: boolean) => {
    setReducedMotionState(value);
    localStorage.setItem(STORAGE_KEY_MOTION, value.toString());
  };

  const value: ThemeContextValue = {
    mode,
    setMode,
    contrast,
    setContrast,
    reducedMotion,
    setReducedMotion,
    effectiveTheme,
    isSystemTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
