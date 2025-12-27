import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProgettazioneHub from '../ProgettazioneHub';

const mockUdas = [
  {
    id: 'uda-1',
    title: 'Unità 1',
    materia: 'Matematica',
    startDate: '2025-09-01',
    endDate: '2025-09-10',
    classe: '1A',
    introduction: '',
    phases: [],
    finalProduct: '',
    evaluation: ''
  }
];

const mockEvents: any[] = [];

const defaultProps: any = {
  onNavigate: vi.fn(),
  udas: mockUdas,
  events: mockEvents,
  settings: { activityStartDate: '2025-09-01', activityEndDate: '2026-06-30', classi: [], competenze: [] },
  aiSettings: {},
  onSaveUda: vi.fn(),
  onAddLessons: vi.fn(),
  onSaveReport: vi.fn(),
  onSaveEvent: vi.fn(),
  initialAction: undefined,
  knowledgeBase: [],
  students: [],
  pianiInclusione: [],
};

describe('ProgettazioneHub Gantt integration', () => {
  it('renders UDA bar with correct title', () => {
    render(<ProgettazioneHub {...defaultProps} />);
    expect(screen.getByText('Unità 1')).toBeInTheDocument();
  });

  it('keyboard ArrowRight on focused bar calls onSaveUda', async () => {
    const onSave = vi.fn();
    render(<ProgettazioneHub {...defaultProps} onSaveUda={onSave} />);
    const bar = await screen.findByRole('button', { name: /Sposta UDA Unità 1/i });
    bar.focus();
    fireEvent.keyDown(bar, { key: 'ArrowRight' });
    expect(onSave).toHaveBeenCalled();
  });
});