import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import M3ExpressiveCard from '../../../src/components/ui/M3ExpressiveCard';

describe('M3ExpressiveCard', () => {
  const mockProps = {
    icon: 'history',
    title: 'Attività Recenti',
    description: 'Ultime azioni svolte',
    color: 'primary'
  };

  it('renders correctly with title and description', () => {
    render(<M3ExpressiveCard {...mockProps} />);
    
    expect(screen.getByText('Attività Recenti')).toBeInTheDocument();
    expect(screen.getByText('Ultime azioni svolte')).toBeInTheDocument();
    expect(screen.getByText('history')).toBeInTheDocument();
  });

  it('calls onClick when clicked and is clickable', () => {
    const onClick = vi.fn();
    render(<M3ExpressiveCard {...mockProps} onClick={onClick} />);
    
    const card = screen.getByText('Attività Recenti').closest('div');
    fireEvent.click(card!);
    expect(onClick).toHaveBeenCalled();
  });

  it('does not have button role when onClick is not provided', () => {
    render(<M3ExpressiveCard {...mockProps} />);
    
    const card = screen.queryByRole('button');
    expect(card).not.toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <M3ExpressiveCard {...mockProps}>
        <div data-testid="child-content">Child Content</div>
      </M3ExpressiveCard>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('applies correct color styles', () => {
    const { container } = render(<M3ExpressiveCard {...mockProps} color="secondary" />);
    // container.firstChild is the global M3ThemeProvider application wrapper;
    // the actual card is its first child
    const appWrapper = container.firstChild as HTMLElement;
    const card = appWrapper?.firstChild as HTMLElement;
    
    // Check that the card has the expected inline styles for secondary color
    expect(card.style.backgroundColor).toBe('var(--md-sys-color-secondary-container)');
    expect(card.style.backdropFilter).toBe('blur(var(--md-sys-blur-large))');
    expect(card.style.border).toContain('var(--md-sys-color-outline-variant)');
  });
});
