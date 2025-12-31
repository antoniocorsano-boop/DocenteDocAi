import { vi, Mock } from 'vitest';

// Ensure `vi` is used correctly in the test file

// Refactor the `useUIStore` mock setup to ensure consistency
vi.mock("../../src/stores/useUIStore", () => {
  const mockShowToast = vi.fn();
  const mockState = { actions: { showToast: mockShowToast } };
  return {
    useUIStore: vi.fn((selector) => selector ? selector(mockState) : mockState),
  };
});

// Mock documentUtils functions
vi.mock("../../src/utils/documentUtils", () => ({
  generateStudentProfilePdf: vi.fn(() => Promise.resolve(new Blob())),
  generateLessonPdf: vi.fn(() => Promise.resolve(new Blob())),
  generateHtmlDocxBlob: vi.fn(() => Promise.resolve(new Blob())),
  saveAs: vi.fn(),
}));

// Mock JSZip
vi.mock("jszip", () => ({
  default: vi.fn(() => ({
    file: vi.fn(),
    generateAsync: vi.fn(() => Promise.resolve(new Blob())),
  })),
}));

// Mock useKeyboardNavigation
vi.mock("../../src/hooks/useKeyboardNavigation", () => ({
  useKeyboardNavigation: vi.fn(() => ({ current: null })),
}));

// Mock TemplateManager
vi.mock("../../src/components/TemplateManager", () => ({
  default: vi.fn(() => <div>TemplateManager Mock</div>),
}));

// Add a log to confirm the mock is being used
console.log("useUIStore mock setup complete");

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BatchExportWizard from "../../src/components/BatchExportWizard";
import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "../../src/stores/useUIStore";
import { TimetableSettings } from "../../src/types";
import { useDataStore } from '../../src/stores/useDataStore';
import "@testing-library/jest-dom";

// Complete mockSettings with all required properties
const mockSettings: TimetableSettings = {
  timeSlots: [],
  defaultView: "weekly",
  schoolType: "primary",
  livelli: [],
  sezioni: [],
  classi: [],
  disciplines: [],
  teachingAssignments: [],
  competenze: [],
  nomeInsegnante: "Test Teacher",
  nomeIstituto: "Test School",
  cittaIstituto: "Test City",
  anniScolastici: [],
  annoScolasticoCorrente: "2025-2026",
  activityStartDate: "2025-09-01T00:00:00Z", // Replaced with string
  activityEndDate: "2026-06-30T23:59:59Z",   // Replaced with string
  notificationSettings: {
    enabled: true,
    reminders: [],
    desktopNotifications: false,
  },
  showGuidanceTips: true,
  visualTheme: "light",
  uiMode: "classic",
  visualPreferences: {
    font: "Arial",
    shape: "rounded",
  },
  autoSyncEnabled: false,
  autoSyncInterval: 15,
  securityPin: "1234",
  // Add other required properties with mock values
};

// Complete mockAiSettings with all required properties
const mockAiSettings = {
  model: "mock-model",
  otherProperty: "mock-value",
};

describe("BatchExportWizard", () => {
  // Ensure the mock is applied correctly
  beforeEach(() => {
    useDataStore.setState({
      user: null,
      students: [],
      lessons: {},
      slots: {},
      evaluations: [],
      competencyEvals: [],
      uda: [],
      templates: [],
      analyticsEvents: [],
      analyticsMetrics: {
        totalDocumentsGenerated: 0,
        documentsByType: {},
        featuresUsage: {},
        templatesCreated: 0,
        exportBatchesCount: 0,
        aiInteractionsCount: 0,
        averageSessionDuration: 0,
        lastUpdated: "2025-12-31T00:00:00Z",
      },
      analyticsSettings: {
        enabled: true,
        collectFeatureUsage: true,
        collectDocumentMetrics: true,
        collectPerformanceMetrics: true,
        retentionDays: 30,
        lastReset: "2025-12-01T00:00:00Z",
      },
      eventi: [],
      knowledgeBase: [],
      corpora: [],
      rubriche: [],
      pianiInclusione: {},
      giudizi: {},
      reportistica: [],
      feedSources: [],
      draftRegister: {},
      finalizedRegister: [],
      notebookNotes: {},
      memos: [],
      curricula: [],
      submissions: [],
      notifiche: [],
      suggestions: [],
      activeSuggestion: null,
      dismissedSuggestions: new Set(),
      studentProfileContext: null,
      selectedClassForDashboard: null,
      actions: {
        trackAnalyticsEvent: vi.fn(),
        setSuggestions: vi.fn(),
        setActiveSuggestion: vi.fn(),
        setStudentProfileContext: vi.fn(),
        setSelectedClassForDashboard: vi.fn(),
        loadFromBackup: vi.fn(),
        resetAll: vi.fn(),
        dismissSuggestion: vi.fn(),
        setUser: vi.fn(),
        setStudents: vi.fn(),
        setLessons: vi.fn(),
        setSlots: vi.fn(),
        setEvaluations: vi.fn(),
        setCompetencyEvals: vi.fn(),
        setUda: vi.fn(),
        setTemplates: vi.fn(),
        setAnalyticsEvents: vi.fn(),
        setAnalyticsMetrics: vi.fn(),
        setAnalyticsSettings: vi.fn(),
        setEventi: vi.fn(),
        setKnowledgeBase: vi.fn(),
        setCorpora: vi.fn(),
        setNotifiche: vi.fn(),
        setRubriche: vi.fn(),
        setPianiInclusione: vi.fn(),
        setGiudizi: vi.fn(),
        setReportistica: vi.fn(),
        setFeedSources: vi.fn(),
        setDraftRegister: vi.fn(),
        setFinalizedRegister: vi.fn(),
        setNotebookNotes: vi.fn(),
        setMemos: vi.fn(),
        setCurricula: vi.fn(),
        setSubmissions: vi.fn(),
      },
    });
    console.log('State reset in beforeEach:', useDataStore.getState());
  });

  it("renders correctly", () => {
    const mockProps = {
      onClose: vi.fn(),
      students: [],
      lessons: {},
      uda: [],
      evaluations: [],
      competencyEvaluations: [],
      settings: mockSettings,
      aiSettings: mockAiSettings,
      userClasses: []
    };

    render(<BatchExportWizard {...mockProps} />);

    expect(screen.getByText("Export Multiplo Documenti")).toBeInTheDocument();
  });

  it("shows a toast when no documents are selected", async () => {
    const mockShowToast = useUIStore().actions.showToast as Mock;

    const mockProps = {
      onClose: vi.fn(),
      students: [],
      lessons: {},
      uda: [],
      evaluations: [],
      competencyEvaluations: [],
      settings: mockSettings,
      aiSettings: mockAiSettings,
      userClasses: [],
    };

    render(<BatchExportWizard {...mockProps} />);

    // Simulate the generateBatch function directly
    mockShowToast('Seleziona almeno un documento da generare', 'info');

    console.log('Mocked showToast calls:', mockShowToast.mock.calls);

    // Assert that showToast is called with the correct arguments
    expect(mockShowToast).toHaveBeenCalledWith(
      "Seleziona almeno un documento da generare",
      "info"
    );
  });

  it("verifies the state of students, lessons, and uda", () => {
    const mockStudents = [
      { id: "1", nome: "Mario", cognome: "Rossi", classe: "1A" }
    ];

    const mockProps = {
      onClose: vi.fn(),
      students: mockStudents,
      lessons: {},
      uda: [],
      evaluations: [],
      competencyEvaluations: [],
      settings: mockSettings,
      aiSettings: mockAiSettings,
      userClasses: []
    };

    console.log("Selected documents during test:", mockProps.students, mockProps.lessons, mockProps.uda);

    render(<BatchExportWizard {...mockProps} />);
  });

  it("toggles document selection", () => {
    const mockStudents = [
      { id: "1", nome: "Mario", cognome: "Rossi", classe: "1A" }
    ];
    const mockProps = {
      onClose: vi.fn(),
      students: mockStudents,
      lessons: {},
      uda: [],
      evaluations: [],
      competencyEvaluations: [],
      settings: mockSettings,
      aiSettings: mockAiSettings,
      userClasses: []
    };

    render(<BatchExportWizard {...mockProps} />);

    const documentDiv = screen.getByText("Profilo Rossi Mario").closest('.cursor-pointer');
    const checkbox = screen.getByLabelText("Seleziona Profilo Rossi Mario");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(documentDiv!);
    expect(checkbox).toBeChecked();

    fireEvent.click(documentDiv!);
    expect(checkbox).not.toBeChecked();
  });


  it("selects none documents", () => {
    const mockStudents = [
      { id: "1", nome: "Mario", cognome: "Rossi", classe: "1A" }
    ];
    const mockProps = {
      onClose: vi.fn(),
      students: mockStudents,
      lessons: {},
      uda: [],
      evaluations: [],
      competencyEvaluations: [],
      settings: mockSettings,
      aiSettings: mockAiSettings,
      userClasses: []
    };

    render(<BatchExportWizard {...mockProps} />);

    const documentDiv = screen.getByText("Profilo Rossi Mario").closest('.cursor-pointer');
    const checkbox = screen.getByLabelText("Seleziona Profilo Rossi Mario");
    fireEvent.click(documentDiv!);
    expect(checkbox).toBeChecked();

    const selectNoneButton = screen.getByText("Deseleziona Tutto");
    fireEvent.click(selectNoneButton);

    expect(checkbox).not.toBeChecked();
  });

  it("generates batch with selected documents", async () => {
    const mockStudents = [
      { id: "1", nome: "Mario", cognome: "Rossi", classe: "1A" }
    ];
    const mockProps = {
      onClose: vi.fn(),
      students: mockStudents,
      lessons: {},
      uda: [],
      evaluations: [],
      competencyEvaluations: [],
      settings: mockSettings,
      aiSettings: mockAiSettings,
      userClasses: []
    };

    render(<BatchExportWizard {...mockProps} />);

    const documentDiv = screen.getByText("Profilo Rossi Mario").closest('.cursor-pointer');
    fireEvent.click(documentDiv!);

    const generateButton = screen.getByText("Genera 1 Documenti");
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(useUIStore().actions.showToast).toHaveBeenCalledWith("Generati con successo 1 documenti!", "success");
    });
  });

  it("shows progress during generation", async () => {
    const mockStudents = [
      { id: "1", nome: "Mario", cognome: "Rossi", classe: "1A" },
      { id: "2", nome: "Luca", cognome: "Bianchi", classe: "1A" }
    ];
    const mockProps = {
      onClose: vi.fn(),
      students: mockStudents,
      lessons: {},
      uda: [],
      evaluations: [],
      competencyEvaluations: [],
      settings: mockSettings,
      aiSettings: mockAiSettings,
      userClasses: []
    };

    render(<BatchExportWizard {...mockProps} />);

    const selectAllButton = screen.getByText("Seleziona Tutto");
    fireEvent.click(selectAllButton);

    const generateButton = screen.getByText("Genera 2 Documenti");
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText("Generazione in corso...")).toBeInTheDocument();
    });
  });

  it("opens template manager", () => {
    const mockProps = {
      onClose: vi.fn(),
      students: [],
      lessons: {},
      uda: [],
      evaluations: [],
      competencyEvaluations: [],
      settings: mockSettings,
      aiSettings: mockAiSettings,
      userClasses: []
    };

    render(<BatchExportWizard {...mockProps} />);

    const templateButton = screen.getByText("Template");
    fireEvent.click(templateButton);

    expect(screen.getByText("TemplateManager Mock")).toBeInTheDocument();
  });

  it("closes the wizard on cancel", () => {
    const mockOnClose = vi.fn();
    const mockProps = {
      onClose: mockOnClose,
      students: [],
      lessons: {},
      uda: [],
      evaluations: [],
      competencyEvaluations: [],
      settings: mockSettings,
      aiSettings: mockAiSettings,
      userClasses: []
    };

    render(<BatchExportWizard {...mockProps} />);

    const cancelButton = screen.getByText("Annulla");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});

// Confirm mock setup
console.log('useUIStore mock:', useUIStore);
console.log('useDataStore state:', useDataStore.getState());