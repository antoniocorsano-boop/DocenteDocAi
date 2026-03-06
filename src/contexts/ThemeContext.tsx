import React, { createContext, useContext, useEffect, useState } from 'react';
import M3Surface from '../components/ui/M3Surface';
import { M3Typography } from '../components/ui/M3Typography';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ContrastMode = 'normal' | 'high';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  contrast: ContrastMode;
  setContrast: (contrast: ContrastMode) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  effectiveTheme: 'light' | 'dark';
  isSystemTheme: boolean;
  isLoading: boolean;
  error: string | null;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY_MODE = 'docentedoc-theme-mode';
const STORAGE_KEY_CONTRAST = 'docentedoc-theme-contrast';
const STORAGE_KEY_MOTION = 'docentedoc-reduced-motion';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MODE);
      return (stored as ThemeMode) || 'auto';
    } catch (_err) {
      setError('Failed to load theme preferences');
      return 'auto';
    }
  });

  const [contrast, setContrastState] = useState<ContrastMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONTRAST);
      return (stored as ContrastMode) || 'normal';
    } catch (_err) {
      return 'normal';
    }
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MOTION);
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_err) {
      return false;
    }
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (_err) {
      return 'light';
    }
  });

  const effectiveTheme = mode === 'auto' ? systemTheme : mode;
  const isSystemTheme = mode === 'auto';

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsLoading(false);
      } catch (_err) {
        setError('Failed to initialize theme');
        setIsLoading(false);
      }
    };
    
    initializeTheme();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        setSystemTheme(e.matches ? 'dark' : 'light');
      } catch (_err) {
        setError('Failed to detect system theme');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_MOTION);
        if (stored === null) {
          setReducedMotionState(e.matches);
        }
      } catch (_err) {
        setError('Failed to detect motion preferences');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    try {
      const root = document.documentElement;
      
      root.classList.remove('theme-light', 'theme-dark');
      root.classList.add(`theme-${effectiveTheme}`);
      
      root.classList.remove('contrast-normal', 'contrast-high');
      root.classList.add(`contrast-${contrast}`);
      
      if (reducedMotion) {
        root.classList.add('reduced-motion');
      } else {
        root.classList.remove('reduced-motion');
      }

      root.setAttribute('data-theme', effectiveTheme);
      root.setAttribute('data-contrast', contrast);
      root.setAttribute('data-reduced-motion', reducedMotion.toString());
    } catch (_err) {
      setError('Failed to apply theme');
    }
  }, [effectiveTheme, contrast, reducedMotion]);

  const setMode = (newMode: ThemeMode) => {
    try {
      setModeState(newMode);
      localStorage.setItem(STORAGE_KEY_MODE, newMode);
      setError(null);
    } catch (_err) {
      setError('Failed to save theme preference');
    }
  };

  const setContrast = (newContrast: ContrastMode) => {
    try {
      setContrastState(newContrast);
      localStorage.setItem(STORAGE_KEY_CONTRAST, newContrast);
      setError(null);
    } catch (_err) {
      setError('Failed to save contrast preference');
    }
  };

  const setReducedMotion = (value: boolean) => {
    try {
      setReducedMotionState(value);
      localStorage.setItem(STORAGE_KEY_MOTION, value.toString());
      setError(null);
    } catch (_err) {
      setError('Failed to save motion preference');
    }
  };

  const value: ThemeContextValue = {
    mode,
    setMode,
    contrast,
    setContrast,
    reducedMotion,
    setReducedMotion,
    effectiveTheme,
    isSystemTheme,
    isLoading,
    error
  };

  if (isLoading) {
    return (
      <M3Surface
        role="status"
        aria-label="Loading theme preferences"
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'var(--md-sys-viewport-height-full)',
          padding: 'var(--md-sys-spacing-6)'
        }}
      >
        <M3Typography variant="body-large">
          Caricamento preferenze tema...
        </M3Typography>
      </M3Surface>
    );
  }

  if (error) {
    return (
      <M3Surface
        role="alert"
        aria-label="Theme error"
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'var(--md-sys-viewport-height-full)',
          padding: 'var(--md-sys-spacing-6)',
          gap: 'var(--md-sys-spacing-4)'
        }}
      >
        <M3Typography 
          variant="body-large"
          id="theme-error-message"
        >
          {error}
        </M3Typography>
        <M3Typography 
          variant="body-medium"
          style={{ 
            textAlign: 'center',
            color: 'var(--md-sys-color-on-surface-variant)'
          }}
        >
          Using default theme settings. Please refresh to retry.
        </M3Typography>
      </M3Surface>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      <M3Surface
        role="application"
        aria-label="DocenteDoc AI application"
        style={{ 
          minHeight: 'var(--md-sys-viewport-height-full)',
          backgroundColor: 'var(--md-sys-color-background)'
        }}
      >
        {children}
      </M3Surface>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
