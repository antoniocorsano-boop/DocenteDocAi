/**
 * MUI v7 Theme — bridged to existing MD3 CSS variables
 *
 * Questo tema delega tutti i valori cromatici, tipografici e di forma
 * ai token CSS var(--md-sys-*) già definiti nel sistema MD3 custom del progetto.
 * I componenti MUI si adatteranno automaticamente al tema chiaro/scuro
 * e ai token globali senza duplicare valori.
 */
import { createTheme, Theme } from '@mui/material/styles';

// MD3 palette values per mode — hex only, never CSS vars (MUI Error #9)
const lightPalette = {
  primary: { main: '#6750A4', contrastText: '#FFFFFF', dark: '#4F378B', light: '#EADDFF' },
  secondary: { main: '#625B71', contrastText: '#FFFFFF', dark: '#4A4458', light: '#E8DEF8' },
  error: { main: '#B3261E', contrastText: '#FFFFFF', dark: '#8C1D18', light: '#F9DEDC' },
  background: { default: '#FDFBFF', paper: '#FDFBFF' },
  text: { primary: '#1C1B1F', secondary: '#49454F', disabled: 'rgba(28,27,31,0.38)' },
  divider: '#C4C7C5',
  action: { active: '#1C1B1F', hover: '#E7E0EC', selected: '#E8DEF8', disabled: '#1C1B1F', disabledBackground: '#E7E0EC' },
};

const darkPalette = {
  primary: { main: '#D0BCFF', contrastText: '#381E72', dark: '#B69DF8', light: '#EADDFF' },
  secondary: { main: '#CCC2DC', contrastText: '#332D41', dark: '#B0A7C0', light: '#E8DEF8' },
  error: { main: '#F2B8B5', contrastText: '#601410', dark: '#CC7B77', light: '#F9DEDC' },
  background: { default: '#1C1B1F', paper: '#1C1B1F' },
  text: { primary: '#E6E1E5', secondary: '#CAC4D0', disabled: '#938F99' },
  divider: '#444746',
  action: { active: '#E6E1E5', hover: '#2E2D33', selected: '#2E273D', disabled: '#938F99', disabledBackground: '#2E2D33' },
};

export function buildMuiTheme(mode: 'light' | 'dark'): Theme {
  const palette = mode === 'dark' ? darkPalette : lightPalette;
  return createTheme({
  cssVariables: false,

  palette: {
    mode,
    // NOTA: i valori hex rispecchiano i token MD3 definiti in theme.css.
    // Non usare CSS variables qui: MUI chiama alpha()/lighten()/darken() su questi valori
    // a runtime e non sa parsare i CSS custom property → MUI Error #9.
    // I componenti usano i token var(--md-sys-color-*) tramite sx prop e styled.
    ...palette,
  },

  typography: {
    fontFamily: 'Roboto, sans-serif',
    // MD3 typescale mappati su MUI — valori raw per MUI JS (no CSS vars: MUI non sa parsarli)
    // I token CSS corrispondenti sono in theme.css --md-sys-typescale-*
    h1: {
      fontSize: '3.5625rem',       // --md-sys-typescale-display-large-font-size
      lineHeight: '4rem',          // --md-sys-typescale-display-large-line-height
      fontWeight: 400,             // --md-sys-typescale-weight-regular
    },
    h2: {
      fontSize: '2.8125rem',       // --md-sys-typescale-display-medium-font-size
      lineHeight: '3.25rem',       // --md-sys-typescale-display-medium-line-height
      fontWeight: 400,
    },
    h3: {
      fontSize: '2.25rem',         // --md-sys-typescale-display-small-font-size
      lineHeight: '2.75rem',       // --md-sys-typescale-display-small-line-height
      fontWeight: 400,
    },
    h4: {
      fontSize: '2rem',            // --md-sys-typescale-headline-large-font-size
      lineHeight: '2.5rem',        // --md-sys-typescale-headline-large-line-height
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.75rem',         // --md-sys-typescale-headline-medium-font-size
      lineHeight: '2.25rem',       // --md-sys-typescale-headline-medium-line-height
      fontWeight: 400,
    },
    h6: {
      fontSize: '1.5rem',          // --md-sys-typescale-headline-small-font-size
      lineHeight: '2rem',          // --md-sys-typescale-headline-small-line-height
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '1.375rem',        // --md-sys-typescale-title-large-font-size
      lineHeight: '1.75rem',       // --md-sys-typescale-title-large-line-height
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '1rem',            // --md-sys-typescale-title-medium-font-size
      lineHeight: '1.5rem',        // --md-sys-typescale-title-medium-line-height
      fontWeight: 500,             // --md-sys-typescale-weight-medium
    },
    body1: {
      fontSize: '1rem',            // --md-sys-typescale-body-large-font-size
      lineHeight: '1.5rem',        // --md-sys-typescale-body-large-line-height
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',        // --md-sys-typescale-body-medium-font-size
      lineHeight: '1.25rem',       // --md-sys-typescale-body-medium-line-height
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem',        // --md-sys-typescale-label-large-font-size
      lineHeight: '1.25rem',       // --md-sys-typescale-label-large-line-height
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',         // --md-sys-typescale-body-small-font-size
      lineHeight: '1rem',          // --md-sys-typescale-body-small-line-height
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.625rem',        // --md-sys-typescale-label-small-font-size
      lineHeight: '1rem',          // --md-sys-typescale-label-small-line-height
      fontWeight: 500,
      textTransform: 'none',
    },
  },

  shape: {
    // MD3 corner medium come default
    borderRadius: 12,
  },

  spacing: 4, // MD3 base spacing unit = 4px

  components: {
    // I componenti MUI non devono interferire col sistema MD3 custom.
    // Ogni componente usa i token CSS vars tramite palette/typography.
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--md-sys-shape-corner-full, 100px)',
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'var(--md-sys-color-surface)',
          color: 'var(--md-sys-color-on-surface)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--md-sys-shape-corner-medium, 12px)',
          backgroundColor: 'var(--md-sys-color-surface-container)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 'var(--md-sys-shape-corner-extra-large, 28px)',
          backgroundColor: 'var(--md-sys-color-surface-container-high)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--md-sys-shape-corner-extra-small, 4px)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--md-sys-color-outline)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--md-sys-color-on-surface)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--md-sys-color-primary)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--md-sys-shape-corner-small, 8px)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'var(--md-sys-color-inverse-surface)',
          color: 'var(--md-sys-color-inverse-on-surface)',
          borderRadius: 'var(--md-sys-shape-corner-extra-small, 4px)',
        },
      },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--md-sys-color-inverse-surface)',
          color: 'var(--md-sys-color-inverse-on-surface)',
          borderRadius: 'var(--md-sys-shape-corner-extra-small, 4px)',
        },
      },
    },
  },
  });
}

// Default export: light theme (used in tests and as SSR-safe fallback)
const muiTheme = buildMuiTheme('light');
export default muiTheme;
