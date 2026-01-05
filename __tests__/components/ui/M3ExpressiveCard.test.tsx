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
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
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
    const card = container.firstChild as HTMLElement;
    
    // Check if background color matches secondary container token
    expect(card.style.backgroundColor).toBe('var(--sys-secondary-container)');
  });
});
