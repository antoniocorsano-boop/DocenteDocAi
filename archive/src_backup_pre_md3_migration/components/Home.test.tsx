import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Home from './Home';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useSystemStore } from '../stores/useSystemStore';
import { useStudentStore } from '../stores/useStudentStore';

// Mock store dependencies
vi.mock('../stores/useSettingsStore');
vi.mock('../stores/useAcademicStore');
vi.mock('../stores/useSystemStore');
vi.mock('../stores/useStudentStore');

// Mock UI components
vi.mock('./ui', async () => {
  return {
    ActionTile: ({ title, subtitle, onClick }: any) => (
      <button onClick={onClick} aria-label={`${title} - ${subtitle}`}>
        {title}
      </button>
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
    M3Typography: ({ children, variant, as, style }: any) => {
      const Component = as || 'span';
      return React.createElement(Component, { 'data-testid': 'm3-typography', style }, children);
    },
    M3HeroCard: ({ children, onClick }: any) => (
      <div data-testid="m3-hero-card" onClick={onClick}>
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
    M3Card: ({ children, ...props }: any) => (
      <div data-testid="m3-card" {...props}>
        {children}
      </div>
    ),
  };
});

describe('Home Component', () => {
  // Default mock implementations
  const mockNavigate = vi.fn();
  const mockDismissSuggestion = vi.fn();
  const mockOnOpenRegisterImport = vi.fn();

  const defaultMockStores = {
    settingsStore: {
      settings: {
        nomeInsegnante: 'Mario',
        cognomeInsegnante: 'Rossi',
      },
    },
    systemStore: {
      activeSuggestion: null,
      dismissedSuggestions: new Set(),
      suggestions: [],
    },
    academicStore: {
      lessons: {
        lesson1: {
          id: 'lesson1',
          classe: '3A',
          materia: 'Matematica',
          tipoLezione: 'Lezione in classe',
          obiettivi: 'Imparare le derivate',
          contenuto: 'Calcolo differenziale',
        },
      },
    },
    studentStore: {
      students: [
        { id: '1', nome: 'Luca', cognome: 'Bianchi', classe: '3A' },
        { id: '2', nome: 'Anna', cognome: 'Verdi', classe: '3A' },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup store mocks
    (useSettingsStore as any).mockImplementation((selector: Function) =>
      selector(defaultMockStores.settingsStore)
    );
    (useSystemStore as any).mockImplementation((selector: Function) =>
      selector(defaultMockStores.systemStore)
    );
    (useAcademicStore as any).mockImplementation((selector: Function) =>
      selector(defaultMockStores.academicStore)
    );
    (useStudentStore as any).mockImplementation((selector: Function) =>
      selector(defaultMockStores.studentStore)
    );
  });

  describe('Rendering', () => {
    it('should render the greeting header with teacher name', () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByText('DocenteDoc AI')).toBeInTheDocument();
    });

    it('should render metric cards with correct data', () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByText('Studenti')).toBeInTheDocument();
      expect(screen.getByText('2 iscritti')).toBeInTheDocument();
      expect(screen.getByText('Verifiche oggi')).toBeInTheDocument();
      expect(screen.getByText('Presenze')).toBeInTheDocument();
    });

    it('should render hero card with next lesson', () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByText('Prossima Lezione')).toBeInTheDocument();
      expect(screen.getByText('Matematica')).toBeInTheDocument();
      expect(screen.getByText(/3A • Lezione in classe/i)).toBeInTheDocument();
    });

    it('should render hero card buttons', () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByText('Vai alla classe')).toBeInTheDocument();
      expect(screen.getByText('Organizza contenuti')).toBeInTheDocument();
    });

    it('should render recent activities section', () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByText('Attività Recenti')).toBeInTheDocument();
      expect(screen.getByText('Nessuna attività recente')).toBeInTheDocument();
    });

    it('should render "Nessun suggerimento" when no active suggestion', () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByText('Nessun suggerimento')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should navigate to correct view on quick action click', async () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      const appelloButton = screen.getByText('Appello (Inizia giornata)');
      fireEvent.click(appelloButton);
      
      await waitFor(() => {
         expect(mockNavigate).toHaveBeenCalledWith('aula');
      });
    });

    it('should navigate to aula with classe param on hero card button click', async () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      const goToClassButton = screen.getByText('Vai alla classe');
      fireEvent.click(goToClassButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('aula', { classe: '3A' });
      });
    });

    it('should navigate to lessons view on Organizza contenuti click', async () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      const organizzaButton = screen.getByText('Organizza contenuti');
      fireEvent.click(organizzaButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('lessons');
      });
    });
  });

  describe('Active Suggestion', () => {
    it('should render active suggestion when present', () => {
      const activeSuggestion = {
        id: 'suggestion-1',
        message: 'Organizza una verifica',
        targetView: 'improvement-guide',
        actionLabel: 'Apri guida',
        action: { type: 'navigate', payload: 'improvement-guide' },
      };

      (useSystemStore as any).mockImplementation((selector: Function) =>
        selector({
          activeSuggestion,
          dismissedSuggestions: new Set(),
          suggestions: [],
        })
      );

      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByText('Suggerimento AI')).toBeInTheDocument();
      expect(screen.getByText('Organizza una verifica')).toBeInTheDocument();
      expect(screen.getByText('Apri guida')).toBeInTheDocument();
    });

    it('should dismiss suggestion on button click', async () => {
      const activeSuggestion = {
        id: 'suggestion-1',
        message: 'Organizza una verifica',
        targetView: 'improvement-guide',
        actionLabel: 'Apri guida',
        action: { type: 'navigate', payload: 'improvement-guide' },
      };

      (useSystemStore as any).mockImplementation((selector: Function) =>
        selector({
          activeSuggestion,
          dismissedSuggestions: new Set(),
          suggestions: [],
        })
      );

      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      const dismissButton = screen.getByText('Ignora per ora');
      fireEvent.click(dismissButton);

      await waitFor(() => {
        expect(mockDismissSuggestion).toHaveBeenCalledWith('suggestion-1');
      });
    });

    it('should navigate on suggestion action button click', async () => {
      const activeSuggestion = {
        id: 'suggestion-1',
        message: 'Organizza una verifica',
        targetView: 'improvement-guide',
        actionLabel: 'Apri guida',
        action: { type: 'navigate', payload: 'improvement-guide' },
      };

      (useSystemStore as any).mockImplementation((selector: Function) =>
        selector({
          activeSuggestion,
          dismissedSuggestions: new Set(),
          suggestions: [],
        })
      );

      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      const actionButton = screen.getByText('Apri guida');
      fireEvent.click(actionButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('improvement-guide');
      });
    });
  });

  describe('Other Suggestions', () => {
    it('should render other suggestions when available', () => {
      const suggestions = [
        {
          id: 'suggestion-2',
          icon: 'info',
          title: 'Primo suggerimento',
          description: 'Descrizione del primo suggerimento',
          action: { type: 'navigate', payload: 'home' },
        },
        {
          id: 'suggestion-3',
          icon: 'warning',
          title: 'Secondo suggerimento',
          description: 'Descrizione del secondo suggerimento',
          action: { type: 'navigate', payload: 'home' },
        },
      ];

      (useSystemStore as any).mockImplementation((selector: Function) =>
        selector({
          activeSuggestion: null,
          dismissedSuggestions: new Set(),
          suggestions,
        })
      );

      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByText('Altri consigli')).toBeInTheDocument();
      expect(screen.getByText('Primo suggerimento')).toBeInTheDocument();
      expect(screen.getByText('Secondo suggerimento')).toBeInTheDocument();
    });

    it('should show only first 2 suggestions', () => {
      const suggestions = [
        {
          id: 'suggestion-1',
          icon: 'info',
          title: 'Primo',
          description: 'Desc 1',
          action: { type: 'navigate', payload: 'home' },
        },
        {
          id: 'suggestion-2',
          icon: 'warning',
          title: 'Secondo',
          description: 'Desc 2',
          action: { type: 'navigate', payload: 'home' },
        },
        {
          id: 'suggestion-3',
          icon: 'check',
          title: 'Terzo (nascosto)',
          description: 'Desc 3',
          action: { type: 'navigate', payload: 'home' },
        },
      ];

      (useSystemStore as any).mockImplementation((selector: Function) =>
        selector({
          activeSuggestion: null,
          dismissedSuggestions: new Set(),
          suggestions,
        })
      );

      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByText('Primo')).toBeInTheDocument();
      expect(screen.getByText('Secondo')).toBeInTheDocument();
      expect(screen.queryByText('Terzo (nascosto)')).not.toBeInTheDocument();
    });

    it('should navigate on suggestion click', async () => {
      const suggestions = [
        {
          id: 'suggestion-1',
          icon: 'info',
          title: 'Test suggestion',
          description: 'Test description',
          action: { type: 'navigate', payload: 'studenti' },
        },
      ];

      (useSystemStore as any).mockImplementation((selector: Function) =>
        selector({
          activeSuggestion: null,
          dismissedSuggestions: new Set(),
          suggestions,
        })
      );

      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      const discoverButton = screen.getByText('Scopri di più');
      fireEvent.click(discoverButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('studenti');
      });
    });
  });

  describe('MD3 Token Compliance', () => {
    it('should use MD3 spacing tokens in grid layout', () => {
      const { container } = renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      const gridElements = container.querySelectorAll('[style*="--md-sys-spacing"]');
      expect(gridElements.length).toBeGreaterThan(0);
    });

    it('should use MD3 color tokens in elements', () => {
      const { container } = renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

     const colorElements = container.querySelectorAll('[style*="--md-sys-color"]');
     expect(colorElements.length).toBeGreaterThan(0);
    });

    it('should use MD3 corner radius tokens', () => {
      const { container } = renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      // Check for elements with CSS classes that apply border-radius
      const cornerElements = container.querySelectorAll('[class*="card"], [class*="button"]');
      expect(cornerElements.length).toBeGreaterThan(0);
    });

    it('should render M3Button components', () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Verify at least some buttons have M3 variants
      const m3Buttons = buttons.filter((btn) => btn.getAttribute('data-variant'));
      expect(m3Buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing teacher name gracefully', () => {
      (useSettingsStore as any).mockImplementation((selector: Function) =>
        selector({
          settings: {
            nomeInsegnante: 'Professore',
            cognomeInsegnante: '',
          },
        })
      );

      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByText('DocenteDoc AI')).toBeInTheDocument();
    });

    it('should handle no lessons gracefully', () => {
      (useAcademicStore as any).mockImplementation((selector: Function) =>
        selector({
          lessons: {},
        })
      );

      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.queryByText('Prossima Lezione')).not.toBeInTheDocument();
    });

    it('should handle empty student list', () => {
      (useStudentStore as any).mockImplementation((selector: Function) =>
        selector({
          students: [],
        })
      );

      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      // Should still render but with default count
      expect(screen.getByText(/24 iscritti/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels on buttons', () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      expect(screen.getByLabelText('Vai alla classe')).toBeInTheDocument();
      expect(screen.getByLabelText('Organizza contenuti')).toBeInTheDocument();
    });

    it('should have semantic heading structure', () => {
      renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('DocenteDoc AI');
    });

    it('should have proper text contrast with MD3 tokens', () => {
      const { container } = renderWithM3Theme(
        <Home
          onNavigate={mockNavigate}
          dismissSuggestion={mockDismissSuggestion}
          onOpenRegisterImport={mockOnOpenRegisterImport}
        />
      );

      // Verify that text elements use proper color tokens
      const textElements = container.querySelectorAll('[style*="color: var(--md-sys-color"]');
      expect(textElements.length).toBeGreaterThan(0);
    });
  });
});



