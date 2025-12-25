import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AssistantModal from '../../src/components/AssistantModal';
import { vi } from 'vitest';

describe('AssistantModal', () => {
  it('renders and handles send + AI response and Escape', async () => {
    const onClose = vi.fn();
    const { container } = render(<AssistantModal open={true} onClose={onClose} />);

    expect(screen.getByText('Assistente DocenteDoc AI')).toBeInTheDocument();
    expect(screen.getByText('Come posso usare questa funzione?')).toBeInTheDocument();

    const input = screen.getByLabelText("Scrivi una domanda o comando per l'assistente");
    fireEvent.change(input, { target: { value: 'ciao' } });

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    // wait for the simulated AI response (uses a 900ms timeout in the component)
    const ai = await screen.findByText('Risposta AI (demo): ciao', {}, { timeout: 2000 });
    expect(ai).toBeInTheDocument();

    // Escape should trigger onClose
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});