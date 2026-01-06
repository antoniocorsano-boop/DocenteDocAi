import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../../src/components/Home';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useAcademicStore } from '../../src/stores/useAcademicStore';
import { useSystemStore } from '../../src/stores/useSystemStore';
import { useStudentStore } from '../../src/stores/useStudentStore';

// Store mocks
vi.mock('../../src/stores/useSettingsStore');
vi.mock('../../src/stores/useAcademicStore');
vi.mock('../../src/stores/useSystemStore');
vi.mock('../../src/stores/useStudentStore');

// Stable UI mocks (match component expectations)
vi.mock('../../src/components/ui', async () => {
  return {
    ActionTile: ({ title, subtitle, onClick }: any) => (
      <button onClick={onClick} aria-label={`${title} - ${subtitle}`}>{title}</button>
    ),
    M3ExpressiveCard: ({ title, description, children }: any) => (
      <div>
        <div>{title}</div>
        <div>{description}</div>
        {children}
      </div>
    ),
    M3Button: ({ children, onClick, variant, 'aria-label': ariaLabel, ...props }: any) => (
      <button onClick={onClick} data-variant={variant} aria-label={ariaLabel} {...props}>
        {children}
      </button>
    ),
  };
});

const defaultMockStores = {
  settingsStore: { settings: { nomeInsegnante: 'Mario', cognomeInsegnante: 'Rossi' } },
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

describe('Home Accessibility', () => {
  const mockNavigate = vi.fn();
  const mockDismissSuggestion = vi.fn();
  const mockOnOpenRegisterImport = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    applyStoreMocks();
  });

  it('has a single h1 and a hero h2', () => {
    render(<Home onNavigate={mockNavigate} dismissSuggestion={mockDismissSuggestion} onOpenRegisterImport={mockOnOpenRegisterImport} />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent).toMatch(/Buongiorno Prof\./i);

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2.textContent).toMatch(/Matematica/i);
  });

  it('exposes aria-labels on hero action buttons', () => {
    render(<Home onNavigate={mockNavigate} dismissSuggestion={mockDismissSuggestion} onOpenRegisterImport={mockOnOpenRegisterImport} />);
    expect(screen.getByLabelText('Vai alla classe')).toBeInTheDocument();
    expect(screen.getByLabelText('Organizza contenuti')).toBeInTheDocument();
  });

  it('quick action tiles include descriptive aria-labels', () => {
    render(<Home onNavigate={mockNavigate} dismissSuggestion={mockDismissSuggestion} onOpenRegisterImport={mockOnOpenRegisterImport} />);
    expect(screen.getByLabelText(/Appello - Registra presenze/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Valutazioni - Inserisci voti/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Registro - Sincronizza dati/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Documenti - Modelli \& report/i)).toBeInTheDocument();
  });

  it('suggestion actions expose aria-labels when active', () => {
    applyStoreMocks({
      systemStore: {
        activeSuggestion: { id: 's1', message: 'Organizza una verifica', actionLabel: 'Apri guida', action: { type: 'navigate', payload: 'improvement-guide' } },
        dismissedSuggestions: new Set<string>(),
        suggestions: [],
      },
    } as any);

    render(<Home onNavigate={mockNavigate} dismissSuggestion={mockDismissSuggestion} onOpenRegisterImport={mockOnOpenRegisterImport} />);
    expect(screen.getByLabelText('Apri guida')).toBeInTheDocument();
    expect(screen.getByLabelText('Ignora suggerimento')).toBeInTheDocument();
  });

  it('buttons are programmatically focusable', () => {
    render(<Home onNavigate={mockNavigate} dismissSuggestion={mockDismissSuggestion} onOpenRegisterImport={mockOnOpenRegisterImport} />);
    const goToClass = screen.getByLabelText('Vai alla classe');
    (goToClass as HTMLButtonElement).focus();
    expect(document.activeElement).toBe(goToClass);

    const quickAction = screen.getByLabelText(/Appello - Registra presenze/i);
    (quickAction as HTMLButtonElement).focus();
    expect(document.activeElement).toBe(quickAction);
  });

  it('uses semantic color-mix for MD3 colors (no hardcoded colors)', () => {
    const { container } = render(<Home onNavigate={mockNavigate} dismissSuggestion={mockDismissSuggestion} onOpenRegisterImport={mockOnOpenRegisterImport} />);
    const elementsWithColors = container.querySelectorAll('[style*="--md-sys-color"]');
    expect(elementsWithColors.length).toBeGreaterThan(0);
  });
});
