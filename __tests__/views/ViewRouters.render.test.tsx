import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ViewRouter } from '../../src/components/views/ViewRouters';
import { DEFAULT_TIMETABLE_SETTINGS } from '../../src/constants';

const baseSchedulingProps = {
  slots: {},
  lessons: {},
  settings: DEFAULT_TIMETABLE_SETTINGS,
  eventi: [],
  aiSettings: { model: 'gemini-3-flash-preview' },
  activeSuggestion: null,
  curricula: [],
  onEditSlot: () => {},
  onShowSlotActions: () => {},
  onAiSuggest: () => {},
  onNavigate: () => {},
  onScheduleLesson: () => {},
  onAddLessons: () => {},
  onUpdateLesson: () => {},
  onStartClassroom: () => {},
  setIsLoadingModalOpen: () => {},
  setLoadingModalMessage: () => {},
  setEventi: () => {},
  activeSlotKey: undefined,
  showGuidanceTips: false,
};

describe('ViewRouter rendering', () => {
  it('rejects English alias "calendar" (now use canonical token)', () => {
    render(<ViewRouter viewName="calendar" props={baseSchedulingProps} />);
    expect(screen.getByText(/non trovata/)).toBeDefined();
  });

  it('renders Calendar when passed Italian canonical "calendario"', () => {
    render(<ViewRouter viewName="calendario" props={baseSchedulingProps} />);
    expect(screen.getByText(/Oggi/)).toBeDefined();
    expect(screen.getByText(/Nuovo Evento/)).toBeDefined();
  });
});
