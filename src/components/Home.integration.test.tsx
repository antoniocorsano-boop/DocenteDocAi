import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Home from './Home';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';
import { useStudentStore } from '../stores/useStudentStore';

// Mocks per gli stores
vi.mock('../stores/useSettingsStore');
vi.mock('../stores/useAcademicStore');
vi.mock('../stores/useSystemStore');
vi.mock('../stores/useStudentStore');

// Mock UI components (coerenti con i unit tests)
vi.mock('./ui', () => ({
  ActionTile: ({ title, subtitle, onClick }: any) => (
    <button onClick={onClick} aria-label={`${title} - ${subtitle}`} style={{ padding: 'var(--md-sys-spacing-4)' }}>
      {title}
    </button>
  ),
  M3ExpressiveCard: ({ title, description, children }: any) => (
    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)' }}>
      <div>{title}</div>
      <div>{description}</div>
      {children}
    </div>
  ),
  M3Button: ({ children, onClick, variant, 'aria-label': ariaLabel, ...props }: any) => (
    <button onClick={onClick} data-variant={variant} aria-label={ariaLabel} {...props} style={{ color: 'var(--md-sys-color-primary)' }}>
      {children}
    </button>
  ),
  M3Typography: ({ children, variant, as, style }: any) => {
    const Component = as || 'span';
    return React.createElement(Component, { 'data-testid': 'm3-typography', style: { ...style, fontSize: 'var(--md-sys-typescale-body-large-font-size)' } }, children);
  },
  M3HeroCard: ({ children, onClick }: any) => (
    <div data-testid="m3-hero-card" onClick={onClick} style={{ borderRadius: 'var(--md-sys-shape-corner-large)' }}>
      {children}
    </div>
  ),
  M3SuggestionCard: ({ children, onClick }: any) => (
    <div data-testid="m3-suggestion-card" onClick={onClick}>
      {children}
    </div>
  ),
  M3SuggestionItem: ({ children }: any) => (
    <div data-testid="m3-suggestion-item">
      {children}
    </div>
  ),
  M3ActivityItem: ({ children }: any) => (
    <div data-testid="m3-activity-item">
      {children}
    </div>
  ),
  M3EmptyStateCard: ({ children }: any) => (
    <div data-testid="m3-empty-state-card">
      {children}
    </div>
  ),
}));

// Default mock data
const defaultMockStores = {
  settingsStore: { settings: { nomeInsegnante: 'Mario', cognomeInsegnante: 'Russo' } },
  systemStore: { activeSuggestion: null, dismissedSuggestions: new Set<string>(), suggestions: [] as any[] },
  academicStore: {
    lessons: {
      lesson1: { id: 'lesson1', classe: '3A', materia: 'Matematica', tipoLezione: 'Lezione in classe', obiettivi: 'Imparare le derivate' },
    },
  },
  studentStore: { students: [{ id: '1', nome: 'Luca', cognome: 'Bianchi', classe: '3A' }] },
};

const applyStoreMocks = (overrides?: Partial<typeof defaultMockStores>) => {
  const data = {
    settingsStore: overrides?.settingsStore ?? defaultMockStores.settingsStore,
    systemStore: overrides?.systemStore ?? defaultMockStores.systemStore,
    academicStore: overrides?.academicStore ?? defaultMockStores.academicStore,
    studentStore: overrides?.studentStore ?? defaultMockStores.studentStore,
  };
  (useSettingsStore as any).mockImplementation((selector: Function) => selector(data.settingsStore));
  (useSystemStore as any).mockImplementation((selector: Function) => selector(data.systemStore));
  (useAcademicStore as any).mockImplementation((selector: Function) => selector(data.academicStore));
  (useStudentStore as any).mockImplementation((selector: Function) => selector(data.studentStore));
};

describe('Home Component - Integration (lean)', () => {
  const mockNavigate = vi.fn();
  const mockDismissSuggestion = vi.fn();
  const mockOnOpenRegisterImport = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    applyStoreMocks();
  });

  it('renders greeting, quick actions, and hero card', () => {
    render(<Home onNavigate={mockNavigate} dismissSuggestion={mockDismissSuggestion} onOpenRegisterImport={mockOnOpenRegisterImport} />);
    expect(screen.getByText(/Buongiorno Prof\./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Appello - Presenze/i)).toBeInTheDocument();
    expect(screen.getByText('Vai alla classe')).toBeInTheDocument();
  });

  it('navigates via quick actions and hero buttons', async () => {
    render(<Home onNavigate={mockNavigate} dismissSuggestion={mockDismissSuggestion} onOpenRegisterImport={mockOnOpenRegisterImport} />);

    fireEvent.click(screen.getByLabelText(/Valutazioni - Voti/i));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('evaluations', undefined));

    fireEvent.click(screen.getByText('Vai alla classe'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('aula', { classe: '3A' }));
  });

  it('reacts to store state updates showing active suggestion and action', async () => {
    // Mostra suggerimento attivo
    applyStoreMocks({
      systemStore: {
        activeSuggestion: { id: 's1', message: 'Organizza una verifica', actionLabel: 'Apri guida', action: { type: 'navigate', payload: 'improvement-guide' } },
        dismissedSuggestions: new Set<string>(),
        suggestions: [],
      },
    } as any);

    render(<Home onNavigate={mockNavigate} dismissSuggestion={mockDismissSuggestion} onOpenRegisterImport={mockOnOpenRegisterImport} />);

    expect(screen.getByText('Organizza una verifica')).toBeInTheDocument();

    // Click su azione suggerimento
    fireEvent.click(screen.getByText('Apri guida'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('improvement-guide'));

    // Dismiss suggerimento
    fireEvent.click(screen.getByText('Ignora per ora'));
    await waitFor(() => expect(mockDismissSuggestion).toHaveBeenCalledWith('s1'));
  });

  it('has MD3 token styles present (spacing, color, corner)', () => {
    const { container } = render(<Home onNavigate={mockNavigate} dismissSuggestion={mockDismissSuggestion} onOpenRegisterImport={mockOnOpenRegisterImport} />);
    expect(container.querySelectorAll('[style*="--md-sys-spacing"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[style*="--md-sys-color"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[style*="--md-corner"]').length).toBeGreaterThan(0);
  });
});


