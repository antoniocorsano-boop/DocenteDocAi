/**
 * MUI v7 Theme — bridged to existing MD3 CSS variables
 *
 * Questo tema delega tutti i valori cromatici, tipografici e di forma
 * ai token CSS var(--md-sys-*) già definiti nel sistema MD3 custom del progetto.
 * I componenti MUI si adatteranno automaticamente al tema chiaro/scuro
 * e ai token globali senza duplicare valori.
 */
import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  // CSS Variables abilitate: il tema usa var(--mui-*) internamente,
  // ma noi sovrascriviamo con i token MD3 tramite palette CSS vars.
  cssVariables: false,

  palette: {
    primary: {
      main: 'var(--md-sys-color-primary)',
      contrastText: 'var(--md-sys-color-on-primary)',
      dark: 'var(--md-sys-color-primary-container)',
      light: 'var(--md-sys-color-primary-container)',
    },
    secondary: {
      main: 'var(--md-sys-color-secondary)',
      contrastText: 'var(--md-sys-color-on-secondary)',
      dark: 'var(--md-sys-color-secondary-container)',
      light: 'var(--md-sys-color-secondary-container)',
    },
    error: {
      main: 'var(--md-sys-color-error)',
      contrastText: 'var(--md-sys-color-on-error)',
      dark: 'var(--md-sys-color-error-container)',
      light: 'var(--md-sys-color-error-container)',
    },
    background: {
      default: 'var(--md-sys-color-background)',
      paper: 'var(--md-sys-color-surface)',
    },
    text: {
      primary: 'var(--md-sys-color-on-surface)',
      secondary: 'var(--md-sys-color-on-surface-variant)',
      disabled: 'var(--md-sys-color-on-surface)',
    },
    divider: 'var(--md-sys-color-outline-variant)',
    action: {
      active: 'var(--md-sys-color-on-surface)',
      hover: 'var(--md-sys-color-surface-variant)',
      selected: 'var(--md-sys-color-secondary-container)',
      disabled: 'var(--md-sys-color-on-surface)',
      disabledBackground: 'var(--md-sys-color-surface-variant)',
    },
  },

  typography: {
    fontFamily: 'Roboto, sans-serif',
    // MD3 typescale mappati su MUI
    h1: {
      fontSize: 'var(--md-sys-typescale-display-large-font-size, 3.5625rem)',
      lineHeight: 'var(--md-sys-typescale-display-large-line-height, 4rem)',
      fontWeight: 'var(--md-sys-typescale-weight-regular, 400)',
    },
    h2: {
      fontSize: 'var(--md-sys-typescale-display-medium-font-size, 2.8125rem)',
      lineHeight: 'var(--md-sys-typescale-display-medium-line-height, 3.25rem)',
      fontWeight: 'var(--md-sys-typescale-weight-regular, 400)',
    },
    h3: {
      fontSize: 'var(--md-sys-typescale-display-small-font-size, 2.25rem)',
      lineHeight: 'var(--md-sys-typescale-display-small-line-height, 2.75rem)',
      fontWeight: 'var(--md-sys-typescale-weight-regular, 400)',
    },
    h4: {
      fontSize: 'var(--md-sys-typescale-headline-large-font-size, 2rem)',
      lineHeight: 'var(--md-sys-typescale-headline-large-line-height, 2.5rem)',
      fontWeight: 'var(--md-sys-typescale-weight-regular, 400)',
    },
    h5: {
      fontSize: 'var(--md-sys-typescale-headline-medium-font-size, 1.75rem)',
      lineHeight: 'var(--md-sys-typescale-headline-medium-line-height, 2.25rem)',
      fontWeight: 'var(--md-sys-typescale-weight-regular, 400)',
    },
    h6: {
      fontSize: 'var(--md-sys-typescale-headline-small-font-size, 1.5rem)',
      lineHeight: 'var(--md-sys-typescale-headline-small-line-height, 2rem)',
      fontWeight: 'var(--md-sys-typescale-weight-regular, 400)',
    },
    subtitle1: {
      fontSize: 'var(--md-sys-typescale-title-large-font-size, 1.375rem)',
      lineHeight: 'var(--md-sys-typescale-title-large-line-height, 1.75rem)',
      fontWeight: 'var(--md-sys-typescale-weight-regular, 400)',
    },
    subtitle2: {
      fontSize: 'var(--md-sys-typescale-title-medium-font-size, 1rem)',
      lineHeight: 'var(--md-sys-typescale-title-medium-line-height, 1.5rem)',
      fontWeight: 'var(--md-sys-typescale-weight-medium, 500)',
    },
    body1: {
      fontSize: 'var(--md-sys-typescale-body-large-font-size, 1rem)',
      lineHeight: 'var(--md-sys-typescale-body-large-line-height, 1.5rem)',
      fontWeight: 'var(--md-sys-typescale-weight-regular, 400)',
    },
    body2: {
      fontSize: 'var(--md-sys-typescale-body-medium-font-size, 0.875rem)',
      lineHeight: 'var(--md-sys-typescale-body-medium-line-height, 1.25rem)',
      fontWeight: 'var(--md-sys-typescale-weight-regular, 400)',
    },
    button: {
      fontSize: 'var(--md-sys-typescale-label-large-font-size, 0.875rem)',
      lineHeight: 'var(--md-sys-typescale-label-large-line-height, 1.25rem)',
      fontWeight: 'var(--md-sys-typescale-weight-medium, 500)',
      textTransform: 'none',
    },
    caption: {
      fontSize: 'var(--md-sys-typescale-body-small-font-size, 0.75rem)',
      lineHeight: 'var(--md-sys-typescale-body-small-line-height, 1rem)',
      fontWeight: 'var(--md-sys-typescale-weight-regular, 400)',
    },
    overline: {
      fontSize: 'var(--md-sys-typescale-label-small-font-size, 0.625rem)',
      lineHeight: 'var(--md-sys-typescale-label-small-line-height, 1rem)',
      fontWeight: 'var(--md-sys-typescale-weight-medium, 500)',
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

export default muiTheme;
