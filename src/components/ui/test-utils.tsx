import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { M3ThemeProvider } from '../../theme/M3ThemeProvider';

// Helper per renderizzare componenti con M3ThemeProvider
const renderWithM3Theme = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: M3ThemeProvider, ...options });

// Esporta anche render normale se necessario
export { render };
export { renderWithM3Theme };