import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { itIT } from '@mui/material/locale';


import { AppThemeState } from '../types';

// Utility per leggere i CSS tokens generati da applyTheme
function getCssVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name);
  return val?.trim() || fallback;
}

interface M3ExpressiveProviderProps {
  children: React.ReactNode;
  themeState: AppThemeState;
}

const M3ExpressiveProvider: React.FC<M3ExpressiveProviderProps> = ({ children, themeState }) => {
  // Palette dinamica da CSS tokens (MD3)
  const mode = themeState.mode === 'system'
    ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : themeState.mode;

  // Leggi i token principali (sincronizzati da applyTheme)
  const palette = {
    mode,
    primary: {
      main: getCssVar('--sys-primary', '#6750A4'),
      contrastText: getCssVar('--sys-on-primary', '#fff'),
    },
    secondary: {
      main: getCssVar('--sys-secondary', '#625B71'),
      contrastText: getCssVar('--sys-on-secondary', '#fff'),
    },
    background: {
      default: getCssVar('--sys-background', '#FDFBFF'),
      paper: getCssVar('--sys-surface', '#F3EDF7'),
    },
    error: {
      main: getCssVar('--sys-error', '#B3261E'),
      contrastText: getCssVar('--sys-on-error', '#fff'),
    },
  };

  const theme = createTheme({
    palette,
    shape: {
      borderRadius: 28,
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 40,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0px 4px 24px ' + getCssVar('--sys-primary', 'rgba(103, 80, 164, 0.08)'),
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 40,
            boxShadow: '0px 8px 32px ' + getCssVar('--sys-primary', 'rgba(103, 80, 164, 0.10)'),
            border: '1.5px solid ' + getCssVar('--sys-primary-container', '#EADDFF'),
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            fontWeight: 500,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 28,
            boxShadow: '0px 16px 48px ' + getCssVar('--sys-primary', 'rgba(103, 80, 164, 0.12)'),
          },
        },
      },
    },
  }, itIT);
  
    return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
    );
  };

  export default M3ExpressiveProvider;


