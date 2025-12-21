// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAppEngine } from '../../hooks/useAppEngine';
import * as backupService from '../../services/backupService';
import * as indexedDbService from '../../services/indexedDbService';
import * as googleDriveService from '../../services/googleDriveService';
import { DEFAULT_TIMETABLE_SETTINGS, INITIAL_KB_GUIDE } from '../../constants';
import { AppState, UserProfile } from '../../types';

// Mock di tutti i servizi esterni
vi.mock('../../services/backupService');
vi.mock('../../services/indexedDbService');
vi.mock('../../services/googleDriveService');

// Mock del prompt di conferma per evitare popup nei test
global.confirm = vi.fn(() => true);

describe('useAppEngine', () => {
  const mockUser: UserProfile = { id: 'test-user', displayName: 'Test User' };
  const initialAppState: AppState = {
    user: mockUser,
    settings: DEFAULT_TIMETABLE_SETTINGS,
    themeState: { mode: 'light', customizationName: 'M3 Default' },
    aiSettings: { model: 'gemini-2.5-flash' },
    students: [],
    lessons: {},
    slots: {},
    evaluations: [],
    competencyEvals: [],
    udas: [],
    eventi: [],
    knowledgeBase: [INITIAL_KB_GUIDE],
    corpora: [],
    notifiche: [],
    rubriche: [],
    pianiInclusione: {},
    giudizi: {},
    reports: [],
    feedSources: [],
    draftRegister: {},
    finalizedRegister: [],
    notebookNotes: {},
    memos: [],
    backupState: { status: 'synced', lastBackup: null },
    driveSyncState: { isAuthenticated: false, isSyncing: false, lastSyncTime: null },
    installPrompt: null,
    suggestions: [],
    studentProfileContext: null,
    selectedClassForDashboard: null,
    activeSuggestion: null,
    dismissedSuggestions: new Set(),
    isGlobalAiLoading: false,
  };

  beforeEach(() => {
    // Reset mocks prima di ogni test
    vi.clearAllMocks();
    (backupService.loadBackup as vi.Mock).mockResolvedValue(null);
    (backupService.saveBackup as vi.Mock).mockResolvedValue(undefined);
    (backupService.deleteBackup as vi.Mock).mockResolvedValue(undefined);
    (indexedDbService.loadKbContentFromIndexedDB as vi.Mock).mockResolvedValue({});
    (indexedDbService.saveKbContentToIndexedDB as vi.Mock).mockResolvedValue(undefined);
    (indexedDbService.clearIndexedDB as vi.Mock).mockResolvedValue(undefined);
    (googleDriveService.initTokenClient as vi.Mock).mockReturnValue(true);
    (googleDriveService.requestAccessToken as vi.Mock).mockImplementation(() => {});
    (googleDriveService.revokeAccessToken as vi.Mock).mockImplementation(() => {});
    (googleDriveService.uploadBackup as vi.Mock).mockResolvedValue(undefined);
    (googleDriveService.downloadBackup as vi.Mock).mockResolvedValue(initialAppState);
    (googleDriveService.getBackupMetadata as vi.Mock).mockResolvedValue(null);
  });

  describe('Initial Load and Debounced Save', () => {
    it('dovrebbe caricare i dati dal backup locale all\'avvio', async () => {
      const mockLoadedState = {
        ...initialAppState,
        students: [{ id: 's1', nome: 'John', cognome: 'Doe', classe: '1A' }],
        settings: { ...initialAppState.settings, nomeInsegnante: 'Prof. Smith' },
      };
      (backupService.loadBackup as vi.Mock).mockResolvedValue(mockLoadedState);
      (indexedDbService.loadKbContentFromIndexedDB as vi.Mock).mockResolvedValue({
        [INITIAL_KB_GUIDE.id]: { content: 'Full KB Content' },
      });

      const { result } = renderHook(() => useAppEngine());

      // Attendere il completamento dell'effetto di caricamento iniziale
      await waitFor(() => expect(result.current.appState.students).toEqual(mockLoadedState.students));

      expect(result.current.appState.students).toEqual(mockLoadedState.students);
      expect(result.current.appState.settings.nomeInsegnante).toBe('Prof. Smith');
      expect(result.current.appState.knowledgeBase[0].content).toBe('Full KB Content');
    });

    it('dovrebbe salvare i dati con un debounce', async () => {
      // Mocking user to trigger save effect
      const { result } = renderHook(() => useAppEngine());
      act(() => {
        result.current.actions.setUser(mockUser);
      });
      // Aspettare il caricamento iniziale prima di forzare modifiche
      await waitFor(() => expect(result.current.appState.user).toBe(mockUser));


      act(() => {
        result.current.actions.setStudents([{ id: 's1', nome: 'John', cognome: 'Doe', classe: '1A' }]);
      });

      // Il salvataggio non dovrebbe avvenire immediatamente
      expect(backupService.saveBackup).not.toHaveBeenCalled();

      // Avanza i timer di 2 secondi per il debounce
      vi.advanceTimersByTime(2000);

      // Ora il salvataggio dovrebbe essere avvenuto
      await waitFor(() => {
        expect(backupService.saveBackup).toHaveBeenCalledTimes(1);
        expect(indexedDbService.saveKbContentToIndexedDB).toHaveBeenCalledTimes(1);
      });

      // Verifica che la KB sia stata salvata in formato lightweight nel backup principale
      const savedState = (backupService.saveBackup as vi.Mock).mock.calls[0][0];
      expect(savedState.knowledgeBase[0].content).toBe('');
      expect(savedState.knowledgeBase[0].htmlContent).toBeUndefined(); // Assuming it's undefined initially
    });
  });

  describe('Google Drive Synchronization', () => {
    it('dovrebbe connettersi a Google Drive', async () => {
      const { result } = renderHook(() => useAppEngine());
      act(() => {
        result.current.actions.handleConnectDrive();
      });
      expect(googleDriveService.requestAccessToken).toHaveBeenCalledTimes(1);
      // initTokenClient's callback handles isAuthenticated = true. Mock this:
      await act(async () => {
        const initCallback = (googleDriveService.initTokenClient as vi.Mock).mock.calls[0][0];
        initCallback({ access_token: 'some-token' });
      });
      await waitFor(() => expect(result.current.appState.driveSyncState.isAuthenticated).toBe(true));
    });

    it('dovrebbe disconnettersi da Google Drive', async () => {
      const { result } = renderHook(() => useAppEngine());
      // Simulate being authenticated
      act(() => result.current.actions.setDriveSyncState(prev => ({ ...prev, isAuthenticated: true })));

      act(() => {
        result.current.actions.handleDisconnectDrive();
      });
      expect(googleDriveService.revokeAccessToken).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(result.current.appState.driveSyncState.isAuthenticated).toBe(false));
    });

    it('dovrebbe caricare il backup su Google Drive', async () => {
      const { result } = renderHook(() => useAppEngine());
      // Simulate being authenticated
      act(() => result.current.actions.setDriveSyncState(prev => ({ ...prev, isAuthenticated: true })));

      act(() => {
        result.current.actions.handleSyncToDrive();
      });
      await waitFor(() => expect(googleDriveService.uploadBackup).toHaveBeenCalledTimes(1));
      expect(result.current.appState.driveSyncState.isSyncing).toBe(false);
      expect(result.current.appState.driveSyncState.lastSyncTime).toBeInstanceOf(Date);
      expect(result.current.modals.toast).toEqual({ message: 'Backup completato!', type: 'success' });
    });

    it('dovrebbe gestire i conflitti durante il caricamento', async () => {
      (googleDriveService.getBackupMetadata as vi.Mock).mockResolvedValue({ modifiedTime: new Date(Date.now() + 60000).toISOString() }); // Remote is newer
      (global.confirm as vi.Mock).mockReturnValueOnce(false); // User cancels overwrite

      const { result } = renderHook(() => useAppEngine());
      act(() => result.current.actions.setDriveSyncState(prev => ({ ...prev, isAuthenticated: true, lastSyncTime: new Date() })));

      act(() => {
        result.current.actions.handleSyncToDrive();
      });

      await waitFor(() => expect(result.current.appState.driveSyncState.isSyncing).toBe(false));
      expect(googleDriveService.uploadBackup).not.toHaveBeenCalled();
    });

    it('dovrebbe ripristinare i dati da Google Drive', async () => {
      const mockRestoredState = {
        ...initialAppState,
        students: [{ id: 's2', nome: 'Jane', cognome: 'Doe', classe: '2A' }],
      };
      (googleDriveService.downloadBackup as vi.Mock).mockResolvedValue(mockRestoredState);

      const { result } = renderHook(() => useAppEngine());
      // Simulate being authenticated
      act(() => result.current.actions.setDriveSyncState(prev => ({ ...prev, isAuthenticated: true })));

      act(() => {
        result.current.actions.handleRestoreFromDrive();
      });
      await waitFor(() => expect(googleDriveService.downloadBackup).toHaveBeenCalledTimes(1));
      expect(result.current.appState.students).toEqual(mockRestoredState.students);
      expect(result.current.modals.toast).toEqual({ message: 'Dati ripristinati da Drive!', type: 'success' });
    });
  });

  describe('Demo Data and Cleanup', () => {
    it('dovrebbe caricare i dati demo', async () => {
      const { result } = renderHook(() => useAppEngine());

      act(() => {
        result.current.actions.handleLoadDemoData();
      });
      await waitFor(() => expect(result.current.appState.students.length).toBeGreaterThan(0));
      expect(result.current.appState.students[0].nome).toBe('Mario');
      expect(result.current.modals.toast).toEqual({ message: 'Dati demo caricati!', type: 'success' });
    });

    it('dovrebbe pulire tutti i dati', async () => {
      (global.confirm as vi.Mock).mockReturnValueOnce(true); // User confirms deletion
      const { result } = renderHook(() => useAppEngine());
      act(() => {
        result.current.actions.setStudents([{ id: 's1', nome: 'John', cognome: 'Doe', classe: '1A' }]);
        result.current.actions.handleCleanDemoData();
      });
      await waitFor(() => expect(backupService.deleteBackup).toHaveBeenCalledTimes(1));
      expect(indexedDbService.clearIndexedDB).toHaveBeenCalledTimes(1);
      expect(result.current.appState.students).toEqual([]);
      expect(result.current.modals.toast).toEqual({ message: 'Dati eliminati.', type: 'success' });
    });
  });

  describe('Toast Notifications', () => {
    it('dovrebbe mostrare e nascondere i toast', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useAppEngine());

      act(() => {
        result.current.actions.showToast('Test Message', 'success');
      });

      expect(result.current.modals.toast).toEqual({ message: 'Test Message', type: 'success' });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.modals.toast).toBeNull();
      vi.useRealTimers();
    });
  });
});