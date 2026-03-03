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
        M3Surface: ({ children, ...props }: any) => (
            <div data-testid="m3-surface" {...props}>{children}</div>
        ),
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
    M3Card: ({ children, onClick, className }: any) => (
        <div data-testid="m3-card" className={className} onClick={onClick}>
            {children}
        </div>
    ),
    M3Button: ({ children, onClick }: any) => (
        <button data-testid="m3-button" onClick={onClick}>
            {children}
        </button>
    ),
    M3Typography: ({ children, variant, as, style }: any) => {
        const Component = as || 'span';
        return React.createElement(Component, { 'data-testid': 'm3-typography', style }, children);
    },
    M3HeroCard: ({ children, onClick, headline, supportingText }: any) => (
        <div data-testid="m3-hero-card" onClick={onClick}>
            {headline && <div>{headline}</div>}
            {supportingText && <div>{supportingText}</div>}
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
    M3FlexContainer: ({ children, flex, minHeight, style, ...props }: any) => (
        <div
            data-testid="m3-flex-container"
            style={{
                display: 'flex',
                flex,
                minHeight,
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    ),
    M3Aside: ({ children, flex, flexBasis, background, borderRight, zIndex, style, ...props }: any) => (
        <aside
            data-testid="m3-aside"
            style={{
                flex,
                flexBasis,
                background,
                borderRight,
                zIndex,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                ...style,
            }}
            {...props}
        >
            {children}
        </aside>
    ),
    M3Chip: ({ children, label, onClick, ...props }: any) => (
        <button data-testid="m3-chip" onClick={onClick} {...props}>{label || children}</button>
    ),
    M3StateLayer: ({ children, ...props }: any) => (
        <div data-testid="m3-state-layer" {...props}>{children}</div>
    ),
    AppLayout: ({ children }: any) => (
        <div data-testid="app-layout">
            {children}
        </div>
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
