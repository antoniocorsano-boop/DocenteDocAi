import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { M3ThemeProvider } from './theme/M3ThemeProvider';
import { M3Surface } from './components/ui/M3Surface';
import { M3Typography, type M3TypographyProps } from './components/ui/M3Typography';

// Helper per renderizzare componenti con M3ThemeProvider
const renderWithM3Theme = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>): ReturnType<typeof render> =>
  render(ui, { wrapper: M3ThemeProvider, ...options });

// Wrapper per test con surface MD3
const TestSurfaceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <M3ThemeProvider>
    <M3Surface 
      variant="container-low" 
      role="region"
      aria-label="Test container"
    >
      {children}
    </M3Surface>
  </M3ThemeProvider>
);

// Helper per renderizzare con surface MD3 completa
const renderWithM3Surface = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>): ReturnType<typeof render> =>
  render(ui, { wrapper: TestSurfaceWrapper, ...options });

// Helper per test con tipografia MD3
const renderWithM3Typography = (text: string, variant: string = 'body-medium'): ReturnType<typeof render> =>
  renderWithM3Theme(
    <M3Typography 
      variant={variant as M3TypographyProps['variant']}
      role="text"
      aria-label={`Test text: ${text}`}
    >
      {text}
    </M3Typography>
  );

// Mock per stati di loading durante i test
const TestLoadingSkeleton: React.FC = () => (
  <M3Surface variant="container-low" aria-label="Loading content">
    <M3Typography variant="body-medium" aria-live="polite">
      Loading test content...
    </M3Typography>
  </M3Surface>
);

// Mock per stati di errore durante i test
const TestErrorState: React.FC<{ message?: string }> = ({ message = 'Test error occurred' }) => (
  <M3Surface 
    variant="error-container" 
    role="alert"
    aria-label="Test error state"
  >
    <M3Typography variant="body-medium" color="on-error-container">
      {message}
    </M3Typography>
  </M3Surface>
);

// Mock per stati vuoti durante i test
const TestEmptyState: React.FC<{ message?: string }> = ({ message = 'No test data available' }) => (
  <M3Surface 
    variant="container-low" 
    role="status"
    aria-label="Empty test state"
  >
    <M3Typography variant="body-medium" color="on-surface-variant">
      {message}
    </M3Typography>
  </M3Surface>
);

export { 
  render,
  renderWithM3Theme,
  renderWithM3Surface,
  renderWithM3Typography,
  TestLoadingSkeleton,
  TestErrorState,
  TestEmptyState
};
