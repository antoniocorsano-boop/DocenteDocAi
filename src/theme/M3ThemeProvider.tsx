import React, { createContext, useContext, ReactNode } from 'react';
import { Paper, Typography } from '@mui/material';

// Definizione del tipo per il tema MD3
interface MD3Theme {
  layers: {
    sys: {
      color: {
        primary: string;
        surface: string;
        onPrimary: string;
        onSurface: string;
        error: string;
        onError: string;
        surfaceVariant: string;
        onSurfaceVariant: string;
        outline: string;
        outlineVariant: string;
      };
      typography: {
        'body-large': {
          fontFamily: string;
          fontSize: string;
          fontWeight: string;
          lineHeight: string;
        };
        'headline-medium': {
          fontFamily: string;
          fontSize: string;
          fontWeight: string;
          lineHeight: string;
        };
        'label-large': {
          fontFamily: string;
          fontSize: string;
          fontWeight: string;
          lineHeight: string;
        };
      };
      elevation: {
        level0: string;
        level1: string;
        level2: string;
        level3: string;
      };
    };
    ref: {
      spacing: number[];
      shape: {
        corner: {
          full: string;
          medium: string;
          small: string;
          large: string;
        };
      };
    };
  };
}

// Valori di default MD3
const defaultTheme: MD3Theme = {
  layers: {
    sys: {
      color: {
        primary: 'var(--md-sys-color-primary)',
        surface: 'var(--md-sys-color-surface)',
        onPrimary: 'var(--md-sys-color-on-primary)',
        onSurface: 'var(--md-sys-color-on-surface)',
        error: 'var(--md-sys-color-error)',
        onError: 'var(--md-sys-color-on-error)',
        surfaceVariant: 'var(--md-sys-color-surface-variant)',
        onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)',
        outline: 'var(--md-sys-color-outline)',
        outlineVariant: 'var(--md-sys-color-outline-variant)',
      },
      typography: {
        'body-large': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: 'var(--md-sys-typescale-body-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-weight-regular)',
          lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
        },
        'headline-medium': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
          fontWeight: 'var(--md-sys-typescale-weight-regular)',
          lineHeight: 'var(--md-sys-typescale-headline-medium-line-height)',
        },
        'label-large': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: 'var(--md-sys-typescale-label-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-weight-medium)',
          lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
        },
      },
      elevation: {
        level0: 'var(--md-sys-elevation-level0)',
        level1: 'var(--md-sys-elevation-level1)',
        level2: 'var(--md-sys-elevation-level2)',
        level3: 'var(--md-sys-elevation-level3)',
      },
    },
    ref: {
      spacing: [0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96],
      shape: {
        corner: {
          full: 'var(--md-sys-shape-corner-full)',
          medium: 'var(--md-sys-shape-corner-medium)',
          small: 'var(--md-sys-shape-corner-small)',
          large: 'var(--md-sys-shape-corner-large)',
        },
      },
    },
  },
};

// Crea il contesto
const ThemeContext = createContext<MD3Theme | undefined>(undefined);

type ThemeStatus = 'loading' | 'loaded' | 'error';

// Hook per usare il tema
export const useM3Theme = (): MD3Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useM3Theme must be used within a M3ThemeProvider');
  }
  return context;
};

// Provider del tema
interface M3ThemeProviderProps {
  children: ReactNode;
  customTheme?: Partial<MD3Theme>;
}

export const M3ThemeProvider: React.FC<M3ThemeProviderProps> = ({ 
  children,
  customTheme 
}) => {
  const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
  const [status, setStatus] = React.useState<ThemeStatus>(isTest ? 'loaded' : 'loading');
  const [error, setError] = React.useState<string | undefined>();

  // Simula il caricamento del tema
  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        // Simula caricamento async del tema
        await new Promise(resolve => setTimeout(resolve, 100));
        setStatus('loaded');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load theme');
        setStatus('error');
      }
    };

    loadTheme();
  }, []);

  // Merge del tema custom con quello di default
  const mergedTheme: MD3Theme = React.useMemo(() => {
    if (!customTheme) return defaultTheme;
    
    return {
      layers: {
        sys: {
          color: { ...defaultTheme.layers.sys.color, ...customTheme.layers?.sys?.color },
          typography: { ...defaultTheme.layers.sys.typography, ...customTheme.layers?.sys?.typography },
          elevation: { ...defaultTheme.layers.sys.elevation, ...customTheme.layers?.sys?.elevation },
        },
        ref: {
          spacing: customTheme.layers?.ref?.spacing || defaultTheme.layers.ref.spacing,
          shape: {
            corner: { ...defaultTheme.layers.ref.shape.corner, ...customTheme.layers?.ref?.shape?.corner },
          },
        },
      },
    };
  }, [customTheme]);

  // Loading state
  if (status === 'loading') {
    return (
      <Paper
        elevation={0}
        role="main"
        aria-label="Loading theme"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'var(--md-sys-viewport-height-full)',
          padding: 'var(--md-sys-spacing-6)',
        }}
      >
        <Typography variant="body1" role="status" aria-live="polite">
          Loading theme...
        </Typography>
      </Paper>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <Paper
        elevation={0}
        role="alert"
        aria-label="Theme loading error"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'var(--md-sys-viewport-height-full)',
          padding: 'var(--md-sys-spacing-6)',
          gap: 'var(--md-sys-spacing-4)',
          backgroundColor: 'var(--md-sys-color-error-container)',
          color: 'var(--md-sys-color-on-error-container)',
        }}
      >
        <Typography variant="h5" role="heading" aria-level={1}>
          Theme Loading Error
        </Typography>
        <Typography variant="body1" role="status">
          {error || 'Failed to load application theme'}
        </Typography>
      </Paper>
    );
  }

  return (
    <ThemeContext.Provider value={mergedTheme}>
      <Paper
        elevation={0}
        role="application"
        aria-label="DocenteDoc AI Application"
        sx={{
          minHeight: 'var(--md-sys-viewport-height-full)',
          backgroundColor: 'var(--md-sys-color-background)',
          color: 'var(--md-sys-color-on-background)',
        }}
      >
        {children}
      </Paper>
    </ThemeContext.Provider>
  );
};
