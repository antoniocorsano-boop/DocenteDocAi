import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../src/components/Home';
import { AppState } from '../../src/types';

// Mock the M3Components
vi.mock('../../src/components/M3Components', () => ({
    InfoCard: ({ title, description, icon, variant, action, className }: any) => (
        <div data-testid="info-card" className={className}>
            <h2>{title}</h2>
            <p>{description}</p>
            {action && <div data-testid="info-card-action">{action}</div>}
        </div>
    ),
    ActionTile: ({ title, icon, onClick }: any) => (
        <button data-testid="action-tile" onClick={onClick}>
            {title}
        </button>
    ),
}));

vi.mock('../../src/components/M3ExpressiveCard', () => ({
    default: ({ icon, title, description, color, children, onClick }: any) => (
        <div data-testid="m3-card" onClick={onClick}>
            <h3>{title}</h3>
            <p>{description}</p>
            {children}
        </div>
    ),
}));

// Mock useSettingsStore
vi.mock('../../src/stores/useSettingsStore', () => ({
    useSettingsStore: vi.fn((selector) => {
        const mockSettings = {
            nomeInsegnante: 'Mario',
            cognomeInsegnante: 'Rossi',
            // ... other settings
        };
        return selector({
            settings: mockSettings,
            // ... other state
        });
    }),
}));

const mockAppState = {
    user: { id: 'test-user', displayName: 'Test User' } as any,
    suggestions: [
        {
            id: 'test-suggestion-1',
            icon: 'lightbulb',
            title: 'Test Suggestion',
            description: 'This is a test AI suggestion',
            action: { type: 'navigate', payload: { view: 'home' } }
        }
    ],
    activeSuggestion: null,
    dismissedSuggestions: new Set(['ignored-suggestion']),
} as any as AppState;

const mockOnNavigate = vi.fn();
const mockDismissSuggestion = vi.fn();

describe('Home Component', () => {
    it('renders welcome message', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                appState={mockAppState}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        expect(screen.getByText('Buongiorno Prof. Rossi!')).toBeInTheDocument();
    });

    it('renders personalized suggestions', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                appState={mockAppState}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        expect(screen.getByText('Suggerimenti Personalizzati')).toBeInTheDocument();
        expect(screen.getByText('Test Suggestion')).toBeInTheDocument();
        expect(screen.getByText('This is a test AI suggestion')).toBeInTheDocument();
    });

    it('handles suggestion actions', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                appState={mockAppState}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        const openButton = screen.getByText('Apri');
        fireEvent.click(openButton);

        expect(mockOnNavigate).toHaveBeenCalledWith('home', undefined);
    });

    it('handles dismiss suggestion', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                appState={mockAppState}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        const ignoreButton = screen.getByText('Ignora');
        fireEvent.click(ignoreButton);

        expect(mockDismissSuggestion).toHaveBeenCalledWith('test-suggestion-1');
    });

    it('renders quick action buttons', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                appState={mockAppState}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        const labels = ['Appello', 'Valutazioni', 'Unità didattica', 'Documenti'];
        labels.forEach(label => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
        const quickActionButtons = screen.getAllByRole('button').filter(btn => labels.some(label => btn.textContent?.includes(label)));
        expect(quickActionButtons).toHaveLength(4);
    });

    it('handles metric card clicks', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                appState={mockAppState}
                dismissSuggestion={mockDismissSuggestion}
            />
        );

        // Test Studenti card click
        const studentiCard = screen.getByText('Studenti');
        fireEvent.click(studentiCard);
        expect(mockOnNavigate).toHaveBeenCalledWith('studenti');

        // Test Verifiche card click
        const verificheCard = screen.getByText('Verifiche oggi');
        fireEvent.click(verificheCard);
        expect(mockOnNavigate).toHaveBeenCalledWith('evaluations');

        // Test Presenze card click
        const presenzeCard = screen.getByText('Presenze');
        fireEvent.click(presenzeCard);
        expect(mockOnNavigate).toHaveBeenCalledWith('studenti');
    });
});