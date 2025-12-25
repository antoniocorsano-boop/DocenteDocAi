import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ViewRouter } from '../../src/components/views/ViewRouters';
import { DEFAULT_TIMETABLE_SETTINGS } from '../../src/constants';

const planningProps = {
  udas: [],
  eventi: [],
  rubriche: [],
  pianiInclusione: {},
  knowledgeBase: [],
  lessons: {},
  students: [],
  evaluations: [],
  competencyEvals: [],
  settings: DEFAULT_TIMETABLE_SETTINGS,
  aiSettings: { model: 'gemini-3-flash-preview' },
  curricula: [],
  viewContext: null,
  onNavigate: () => {},
  onSaveUda: () => {},
  onSaveRubrica: () => {},
  onSavePiano: () => {},
  onDeleteRubrica: () => {},
  onDeletePiano: () => {},
  onDeleteUda: () => {},
  onSaveReport: () => {},
  onSaveEvent: () => {},
  onAddLessons: () => {},
  setUdas: () => {},
  setRubriche: () => {},
  setPianiInclusione: () => {},
  setCurricula: () => {},
  showToast: () => {},
  showGuidanceTips: false,
  setIsLoadingModalOpen: () => {},
  setLoadingModalMessage: () => {},
  setIsGlobalAiLoading: () => {},
  setViewContext: () => {}
};

const analyticsProps = {
  reports: [],
  onDeleteReport: () => {},
  userClasses: [],
  students: [],
  evaluations: [],
  competencyEvaluations: [],
  settings: DEFAULT_TIMETABLE_SETTINGS,
  udas: [],
  lessons: {},
  onSaveReport: () => {},
  aiSettings: { model: 'gemini-3-flash-preview' },
  pianiInclusione: {},
  knowledgeBase: [],
  onAddKbEntry: () => {},
  onSaveUda: () => {},
  onAddLessons: () => {},
  onSaveEvent: () => {}
};

describe('ViewRouter - Planning & Analytics renderers', () => {
  it('renders UdaPlanner when viewName is "uda"', () => {
    const { unmount } = render(<ViewRouter viewName="uda" props={planningProps} />);
    expect(screen.getByText(/Planner Progetti/)).toBeDefined();
    unmount();
  });

  it('renders UdaPlanner when viewName is "uda"', () => {
    const { unmount } = render(<ViewRouter viewName="uda" props={planningProps} />);
    expect(screen.getByText(/Planner Progetti/)).toBeDefined();
    unmount();
  });

  it('renders ReportisticaHub when viewName is "reportistica"', () => {
    const { unmount } = render(<ViewRouter viewName="reportistica" props={analyticsProps} />);
    const matches = screen.getAllByText(/Archivio Report|Centro Documentazione/);
    expect(matches.length).toBeGreaterThan(0);
    unmount();
  });

  it('renders ReportisticaHub when viewName is "reportistica"', () => {
    const { unmount } = render(<ViewRouter viewName="reportistica" props={analyticsProps} />);
    const matches = screen.getAllByText(/Archivio Report|Centro Documentazione/);
    expect(matches.length).toBeGreaterThan(0);
    unmount();
  });
});
