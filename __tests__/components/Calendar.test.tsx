
// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from '../../components/Calendar';
import { EventoCalendario, AiSettings } from '../../types';

describe('Calendar', () => {
  const mockEventi: EventoCalendario[] = [
    { id: 'e1', titolo: 'Consiglio Classe', data: new Date().toISOString().split('T')[0], tipo: 'consiglio' },
    { id: 'e2', titolo: 'Scadenza Progetto', data: '2023-12-25', tipo: 'scadenza' }
  ];
  const mockSetEventi = vi.fn();
  const mockAiSettings: AiSettings = { model: 'gemini-2.5-flash' };
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-10-15')); // Set fixed date for consistency
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('dovrebbe renderizzare il calendario e gli eventi', () => {
    render(<Calendar eventi={mockEventi} setEventi={mockSetEventi} aiSettings={mockAiSettings} onNavigate={mockOnNavigate} />);
    
    expect(screen.getByText('ottobre 2023')).toBeInTheDocument();
    // Assuming the current date event is visible (Consiglio Classe uses current date from test run, fixed to 2023-10-15)
    // Wait, mockEventi[0].data is dynamic in definition: new Date()... which uses system time.
    // Since we fixed system time to Oct 15, 2023, the event is on Oct 15.
    
    // We need to ensure the grid renders days.
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('dovrebbe cambiare mese', () => {
    render(<Calendar eventi={mockEventi} setEventi={mockSetEventi} aiSettings={mockAiSettings} onNavigate={mockOnNavigate} />);
    
    const nextButton = screen.getByLabelText('Successivo');
    fireEvent.click(nextButton);
    expect(screen.getByText('novembre 2023')).toBeInTheDocument();
  });

  it('dovrebbe aprire il modale di creazione evento cliccando su un giorno', () => {
    render(<Calendar eventi={mockEventi} setEventi={mockSetEventi} aiSettings={mockAiSettings} onNavigate={mockOnNavigate} />);
    
    const dayCell = screen.getByText('15').closest('.calendar-day-cell');
    fireEvent.click(dayCell!);
    
    expect(screen.getByText('Nuovo Evento')).toBeInTheDocument();
  });

  it('dovrebbe aprire l\'azione evento cliccando su un evento esistente', () => {
    // Forcing an event on a visible day
    const events = [{ id: 'e1', titolo: 'Test Event', data: '2023-10-15', tipo: 'impegno' as const }];
    render(<Calendar eventi={events} setEventi={mockSetEventi} aiSettings={mockAiSettings} onNavigate={mockOnNavigate} />);
    
    const eventPill = screen.getByText('Test Event');
    fireEvent.click(eventPill);
    
    // Popover should appear (check for Modify/Delete buttons or title in popover)
    expect(screen.getByText('Modifica')).toBeInTheDocument();
  });

  it('dovrebbe cambiare vista tra Mese e Settimana', () => {
    render(<Calendar eventi={mockEventi} setEventi={mockSetEventi} aiSettings={mockAiSettings} onNavigate={mockOnNavigate} />);
    
    const weekButton = screen.getByText('Sett.');
    fireEvent.click(weekButton);
    
    expect(document.querySelector('.week-view')).toBeInTheDocument();
  });
});
