import React, { createContext, useContext, ReactNode } from 'react';

// Definizione del tipo per il tema MD3
interface MD3Theme {
  layers: {
    sys: {
      color: {
        primary: string;
        surface: string;
        onPrimary: string;
        onSurface: string;
        // Aggiungi altri colori MD3 necessari
      };
      typography: {
        'body-large': {
          fontFamily: string;
          fontSize: string;
          fontWeight: string;
          lineHeight: string;
        };
        // Aggiungi altre varianti tipografiche
      };
    };
    ref: {
      spacing: number[]; // Array di valori di spacing, es. [0, 4, 8, 16, ...]
      shape: {
        corner: {
          full: string;
          medium: string;
          // Altri corner radii
        };
      };
    };
  };
}

// Valori di default MD3 (puoi sostituirli con CSS vars reali)
const defaultTheme: MD3Theme = {
  layers: {
    sys: {
      color: {
        primary: '#1976d2', // Esempio, usa var(--md-sys-color-primary) se definito
        surface: '#ffffff',
        onPrimary: '#ffffff',
        onSurface: '#000000',
      },
      typography: {
        'body-large': {
          fontFamily: 'Roboto, sans-serif',
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '24px',
        },
      },
    },
    ref: {
      spacing: [0, 4, 8, 16, 24, 32, 48, 64], // Valori numerici
      shape: {
        corner: {
          full: '9999px',
          medium: '8px',
        },
      },
    },
  },
};

// Crea il contesto
const ThemeContext = createContext<MD3Theme | undefined>(undefined);

// Hook per usare il tema
export const useTheme = (): MD3Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a M3ThemeProvider');
  }
  return context;
};

// Provider del tema
interface M3ThemeProviderProps {
  children: ReactNode;
}

export const M3ThemeProvider: React.FC<M3ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};