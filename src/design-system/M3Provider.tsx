import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { itIT } from '@mui/material/locale';

// Palette e shape ispirati a Material 3 (M3)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4',
      contrastText: '#fff',
    },
    secondary: {
      main: '#625B71',
    },
    background: {
      default: '#FDFBFF',
      paper: '#F3EDF7',
    },
    error: {
      main: '#B3261E',
    },
  },
  shape: {
    borderRadius: 16, // M3 expressive
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    // Puoi aggiungere qui le scale M3 se vuoi
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24, // Più arrotondato per "expressive"
          textTransform: 'none',
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
  },
}, itIT);

interface M3ProviderProps {
  children: React.ReactNode;
}

const M3Provider: React.FC<M3ProviderProps> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default M3Provider;
