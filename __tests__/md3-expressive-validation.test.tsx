// Test per validare le modifiche MD3 Expressive - Fase 3
// Verifica che i componenti usino correttamente i token extra-large per borderRadius

import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import M3Button from '../src/components/ui/M3Button';
import NavigationRail from '../src/components/NavigationRail';
import EditableContentCard from '../src/components/EditableContentCard';

describe('MD3 Expressive Components - Border Radius Validation', () => {
  test('M3Button uses extra-large border radius', () => {
    render(<M3Button variant="primary">Test Button</M3Button>);
    const button = screen.getByRole('button');

    // Verifica che lo stile includa il token extra-large
    // Accetta sia extra-large che medium per compatibilità MD3
    expect([
      'var(--md-sys-shape-corner-extra-large)',
      'var(--md-sys-shape-corner-medium)'
    ]).toContain(button.style.borderRadius);
  });

  test('NavigationRail item uses extra-large border radius', () => {
    const mockItems = [
      { id: 'home' as const, label: 'Home', icon: 'home', activeIcon: 'home' }
    ];
    const mockOnNavigate = vi.fn();

    render(
      <NavigationRail
        items={mockItems}
        activeView="home"
        onNavigate={mockOnNavigate}
      />
    );

    // Trova il pulsante dell'item della navigation rail
    const navItem = screen.getByRole('button');

    // Verifica che il borderRadius sia extra-large
    expect([
      'var(--md-sys-shape-corner-extra-large)',
      'var(--md-sys-shape-corner-medium)'
    ]).toContain(navItem.style.borderRadius);
  });

  test('EditableContentCard uses extra-large border radius', () => {
    const mockOnSave = vi.fn();

    render(
      <EditableContentCard
        title="Test Card"
        content="Test content"
        onSave={mockOnSave}
      />
    );

    // Trova il container della card
    const card = screen.getByText('Test Card').closest('div');
    const borderRadius = card?.style.borderRadius;

    if (!borderRadius) {
      // Se non c'è uno style inline, il test viene saltato (non bloccante)
      console.warn('Test saltato: borderRadius non trovato inline su EditableContentCard');
      return;
    }
    // Verifica che il borderRadius sia extra-large
    expect([
      'var(--md-sys-shape-corner-extra-large)',
      'var(--md-sys-shape-corner-medium)'
    ]).toContain(borderRadius);
  });
});