import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import M3ChoiceCard from '../../../src/components/ui/M3ChoiceCard';

describe('M3ChoiceCard', () => {
  const mockProps = {
    icon: 'school',
    label: 'Lezione',
    onClick: vi.fn(),
    selected: false
  };

  it('renders correctly with label and icon', () => {
    render(<M3ChoiceCard {...mockProps} />);
    
    expect(screen.getByText('Lezione')).toBeInTheDocument();
    expect(screen.getByText('school')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<M3ChoiceCard {...mockProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockProps.onClick).toHaveBeenCalled();
  });

  it('applies selected styles when selected is true', () => {
    render(<M3ChoiceCard {...mockProps} selected={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    // Check that the background color is set to primary container when selected
    expect(button.style.backgroundColor).toBe('var(--app-color-primary-container)');
  });

  it('applies default styles when selected is false', () => {
    render(<M3ChoiceCard {...mockProps} selected={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    // Check that the background color contains surface container when not selected
    expect(button.style.backgroundColor).toContain('var(--app-color-surface-container)');
  });
});
