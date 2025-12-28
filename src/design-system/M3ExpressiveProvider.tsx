import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { itIT } from '@mui/material/locale';

// Palette e shape ispirati a Material 3 Expressive (default)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4',
      contrastText: '#fff',
    },
    secondary: {
      main: '#625B71',
      contrastText: '#fff',
    },
    background: {
      default: '#FDFBFF',
      paper: '#F3EDF7',
    },
    error: {
      main: '#B3261E',
      contrastText: '#fff',
    },
  },
  shape: {
    borderRadius: 28, // M3 expressive
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    // Puoi aggiungere qui le scale M3 se vuoi
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 40, // Più arrotondato per "expressive"
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0px 4px 24px rgba(103, 80, 164, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 40,
          boxShadow: '0px 8px 32px rgba(103, 80, 164, 0.10)',
          border: '1.5px solid #EADDFF',
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
          boxShadow: '0px 16px 48px rgba(103, 80, 164, 0.12)',
        },
      },
    },
  },
}, itIT);

interface M3ExpressiveProviderProps {
  children: React.ReactNode;
}

const M3ExpressiveProvider: React.FC<M3ExpressiveProviderProps> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default M3ExpressiveProvider;
