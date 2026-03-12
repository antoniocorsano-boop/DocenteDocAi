import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithM3Theme } from '../../src/test-utils';
import '@testing-library/jest-dom';
import React from 'react';
import Home from '../../src/components/Home';
import { View } from '../../src/types';

// Mock stores
vi.mock('../../src/stores/useSettingsStore');
vi.mock('../../src/stores/useAcademicStore');
vi.mock('../../src/stores/useSystemStore');
vi.mock('../../src/stores/useStudentStore');

// Mock the M3Components
vi.mock('../../src/components/ui', () => ({
    ActionTile: ({ title, subtitle, icon, variant, onClick }: any) => (
        <button data-testid="action-tile" onClick={onClick}>
            {title} - {subtitle}
        </button>
    ),
    AppLayout: ({ children }: any) => (
        <div data-testid="app-layout">
            {children}
        </div>
    ),
    PageWrapper: ({ children }: any) => (
        <div data-testid="page-wrapper">
            {children}
        </div>
    ),
    EmptyState: ({ title, description }: any) => (
        <div data-testid="empty-state">{title} - {description}</div>
    ),
}));

// Mock AppLayout
vi.mock('../../src/components/AppLayout.md3', () => ({
  AppLayout: ({ children }: any) => (
    <div data-testid="app-layout">
      {children}
    </div>
  ),
}));


const mockOnNavigate = vi.fn();
const mockDismissSuggestion = vi.fn();

describe('Home Component', () => {
    it('renders main sections and quick actions', () => {
        render(
            <Home
                onNavigate={mockOnNavigate}
                dismissSuggestion={mockDismissSuggestion}
            />
        );
        // Hero section
        expect(screen.getAllByText(/Buongiorno|Buon pomeriggio|Buona sera|Pianifica la prossima lezione|Prossima Lezione/)).not.toHaveLength(0);
        // Metrics section
        expect(screen.getAllByText('Studenti')).not.toHaveLength(0);
        expect(screen.getAllByText('Valutazioni')).not.toHaveLength(0);
        // Recent Activities section
        expect(screen.getAllByText('Attività recenti')).not.toHaveLength(0);
        // Quick Actions section
        expect(screen.getAllByText('Registro')).not.toHaveLength(0);
        expect(screen.getAllByText('Presenze')).not.toHaveLength(0);
        expect(screen.getAllByText('Valutazioni')).not.toHaveLength(0);
        // FAB
        expect(screen.getAllByText('Inizia Giornata')).not.toHaveLength(0);
    });
});
