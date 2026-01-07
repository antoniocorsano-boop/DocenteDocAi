import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../src/components/Home';
import { View } from '../../src/types';

// Mock the M3Components
vi.mock('../../src/components/ui', () => ({
    ActionTile: ({ title, subtitle, icon, variant, onClick }: any) => (
        <button data-testid="action-tile" onClick={onClick}>
            {title} - {subtitle}
        </button>
    ),
    M3ExpressiveCard: ({ icon, title, description, color, children, onClick }: any) => (
        <div data-testid="m3-card" onClick={onClick}>
            <h3>{title}</h3>
            <p>{description}</p>
            {children}
        </div>
    ),
    M3Button: ({ children, onClick }: any) => (
        <button data-testid="m3-button" onClick={onClick}>
            {children}
        </button>
    ),
}));

// Mock useSettingsStore
vi.mock('../../src/stores/useSettingsStore', () => ({
    useSettingsStore: vi.fn((selector) => {
        const mockSettings = {
            nomeInsegnante: 'Mario',
            cognomeInsegnante: 'Rossi',
        };
        return selector({
            settings: mockSettings,
        });
    }),
}));

// Helper to create system state
// Helper per creare lo stato di sistema mockato
const createSystemState = (overrides = {}) => ({
    activeSuggestion: {
        id: 'test-suggestion-1',
        icon: 'lightbulb',
        title: 'Test Suggestion',
        message: 'Test Suggestion',
        description: 'This is a test AI suggestion',
        actionLabel: 'Apri',
        action: { type: 'navigate', payload: 'home' }
    },
    dismissedSuggestions: new Set(),
    suggestions: [
        {
            id: 'test-suggestion-2',
            icon: 'school',
            title: 'Other Suggestion',
            description: 'Another test suggestion',
            action: { type: 'navigate', payload: { view: 'aula' } }
        }
    ],
    ...overrides,
});

// Mock useSystemStore
vi.mock('../../src/stores/useSystemStore', () => ({
    useSystemStore: vi.fn((selector) => selector(createSystemState())),
}));

// Mock useAcademicStore
vi.mock('../../src/stores/useAcademicStore', () => ({
    useAcademicStore: vi.fn((selector) => {
        return selector({
            lessons: {},
        });
    }),
}));

// Mock useStudentStore
vi.mock('../../src/stores/useStudentStore', () => ({
    useStudentStore: vi.fn((selector) => {
        return selector({
            students: [],
        });
    }),
}));


const mockOnNavigate = vi.fn();
const mockDismissSuggestion = vi.fn();

// Reset mocks and store state before each test
import { useSystemStore } from '../../src/stores/useSystemStore';
beforeEach(() => {
    vi.clearAllMocks();
    (useSystemStore as any).mockImplementation((selector: any) => selector(createSystemState()));
});

describe('Home Component', () => {
    it('renders welcome message', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        expect(screen.getByText('Buongiorno Prof. Rossi!')).toBeInTheDocument();
    });

    it('renders AI suggestions', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        expect(screen.getByText('Suggerimento AI')).toBeInTheDocument();
        expect(screen.getByText('Test Suggestion')).toBeInTheDocument();
        expect(screen.getByText('Scopri come ottimizzare il tuo workflow didattico.')).toBeInTheDocument();
    });

    it('handles suggestion actions', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        const openButton = screen.getByText('Apri');
        fireEvent.click(openButton);

        expect(mockOnNavigate).toHaveBeenCalledWith('home');
    });

    it('handles dismiss suggestion', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        const ignoreButton = screen.getByText('Ignora per ora');
        fireEvent.click(ignoreButton);

        expect(mockDismissSuggestion).toHaveBeenCalledWith('test-suggestion-1');
    });


    it('renders quick action buttons', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                dismissSuggestion={mockDismissSuggestion}
            />
        );
        // Update labels to match actual quick actions
        const labels = ['Appello', 'Valutazioni', 'Registro', 'Progettazione'];
        labels.forEach(label => {
            expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
        });
    });
    it('hides AI suggestion when already dismissed', () => {
        (useSystemStore as any).mockImplementation((selector: any) => selector(createSystemState({ dismissedSuggestions: new Set(['test-suggestion-1']) })));
        render(
            <Home
                onNavigate={mockOnNavigate}
                dismissSuggestion={mockDismissSuggestion}
            />
        );
        expect(screen.getByText('Nessun suggerimento')).toBeInTheDocument();
        expect(screen.queryByText('Suggerimento AI')).not.toBeInTheDocument();
    });

    it('handles metric card clicks', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        // Test Studenti card click
        const studentiCard = screen.getByText('Studenti');
        fireEvent.click(studentiCard);
        expect(mockOnNavigate).toHaveBeenCalledWith('studenti');

        // Test Verifiche oggi card click
        const verificheCard = screen.getByText('Verifiche oggi');
        fireEvent.click(verificheCard);
        expect(mockOnNavigate).toHaveBeenCalledWith('evaluations');

        // Test Presenze card click
        const presenzeCard = screen.getByText('Presenze');
        fireEvent.click(presenzeCard);
        expect(mockOnNavigate).toHaveBeenCalledWith('studenti');
    });
});
