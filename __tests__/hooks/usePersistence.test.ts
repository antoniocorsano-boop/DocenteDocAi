import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock services
vi.mock('../../src/services/indexedDbService.ts', () => ({
  saveKbContentToIndexedDB: vi.fn(),
  saveBackup: vi.fn()
}));
vi.mock('../../src/services/backupService.ts', () => ({
  saveBackup: vi.fn(),
  loadBackup: vi.fn()
}));

// Mock stores using factory functions to avoid hoisting issues
const mockSetBackupState = vi.fn();
const mockUIState = {
  actions: { setBackupState: mockSetBackupState },
  modals: { isRestoring: false },
  canShowInstallPrompt: false,
  isGlobalAiLoading: false,
  navigationHistory: [],
  backupState: {},
  driveSyncState: {}
};

vi.mock('../../src/stores/useStudentStore.ts', () => ({
  useStudentStore: {
    getState: vi.fn(() => ({ actions: {} })),
    subscribe: vi.fn(() => vi.fn())
  }
}));
vi.mock('../../src/stores/useAcademicStore.ts', () => ({
  useAcademicStore: {
    getState: vi.fn(() => ({ actions: {} })),
    subscribe: vi.fn(() => vi.fn())
  }
}));
vi.mock('../../src/stores/useSystemStore.ts', () => ({
  useSystemStore: {
    getState: vi.fn(() => ({ actions: {}, dismissedSuggestions: new Set(), knowledgeBase: [] })),
    subscribe: vi.fn(() => vi.fn())
  }
}));
vi.mock('../../src/stores/useSettingsStore.ts', () => ({
  useSettingsStore: {
    getState: vi.fn(() => ({ actions: {} })),
    subscribe: vi.fn(() => vi.fn())
  }
}));
vi.mock('../../src/stores/useUIStore.ts', () => ({
  useUIStore: {
    getState: vi.fn(() => mockUIState),
    subscribe: vi.fn(() => vi.fn())
  }
}));

// Now import the hook after mocks are defined
import { usePersistence } from '../../src/hooks/usePersistence';
import { useUIStore } from '../../src/stores/useUIStore';

describe('usePersistence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize and subscribe to stores', () => {
    renderHook(() => usePersistence(true));

    expect(useUIStore.subscribe).toHaveBeenCalled();
  });

  it('should trigger save after debounce', async () => {
    const { saveBackup } = await import('../../src/services/backupService.ts');
    
    renderHook(() => usePersistence(true));

    // Simulate store change
    const triggerSave = vi.mocked(useUIStore.subscribe).mock.calls[0][0];
    act(() => {
      triggerSave({} as any, {} as any);
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(saveBackup).toHaveBeenCalled();
  });

  it('should handle save errors gracefully', async () => {
    const { saveBackup } = await import('../../src/services/backupService.ts');
    vi.mocked(saveBackup).mockRejectedValueOnce(new Error('Save failed'));
    
    renderHook(() => usePersistence(true));

    const triggerSave = vi.mocked(useUIStore.subscribe).mock.calls[0][0];
    await act(async () => {
      triggerSave({} as any, {} as any);
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();
    });

    expect(mockSetBackupState).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
  });

  it('should not save if data is not loaded', async () => {
    const { saveBackup } = await import('../../src/services/backupService.ts');
    
    renderHook(() => usePersistence(false));

    expect(useUIStore.subscribe).not.toHaveBeenCalled();
    expect(saveBackup).not.toHaveBeenCalled();
  });

  it('should handle missing store functions gracefully', () => {
    const originalGetState = useUIStore.getState;
    // @ts-ignore
    useUIStore.getState = undefined;

    renderHook(() => usePersistence(true));

    expect(useUIStore.subscribe).not.toHaveBeenCalled();

    // Restore
    useUIStore.getState = originalGetState;
  });

  it('should handle getState errors', () => {
    vi.mocked(useUIStore.getState).mockImplementationOnce(() => {
      throw new Error('getState failed');
    });

    renderHook(() => usePersistence(true));

    expect(useUIStore.subscribe).not.toHaveBeenCalled();
  });

  it('should save knowledge base content if present', async () => {
    const { saveKbContentToIndexedDB } = await import('../../src/services/indexedDbService.ts');
    const { useSystemStore } = await import('../../src/stores/useSystemStore.ts');
    
    vi.mocked(useSystemStore.getState).mockReturnValue({
      actions: {},
      dismissedSuggestions: new Set(),
      knowledgeBase: [{ id: '1', content: 'test' }]
    } as any);

    renderHook(() => usePersistence(true));

    const triggerSave = vi.mocked(useUIStore.subscribe).mock.calls[0][0];
    await act(async () => {
      triggerSave({} as any, {} as any);
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();
    });

    expect(saveKbContentToIndexedDB).toHaveBeenCalled();
  });

  it('should handle missing optional fields in stores', async () => {
    const { saveBackup } = await import('../../src/services/backupService.ts');
    const { useSystemStore } = await import('../../src/stores/useSystemStore.ts');
    const { useUIStore } = await import('../../src/stores/useUIStore.ts');

    vi.mocked(useSystemStore.getState).mockReturnValue({
      actions: {},
      dismissedSuggestions: undefined,
      knowledgeBase: undefined
    } as any);

    vi.mocked(useUIStore.getState).mockReturnValue({
      actions: { setBackupState: mockSetBackupState },
      modals: undefined,
    } as any);

    renderHook(() => usePersistence(true));

    const triggerSave = vi.mocked(useUIStore.subscribe).mock.calls[0][0];
    await act(async () => {
      triggerSave({} as any, {} as any);
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();
    });

    expect(saveBackup).toHaveBeenCalled();
  });

  it('should prevent concurrent saves', async () => {
    const { saveBackup } = await import('../../src/services/backupService.ts');
    
    // Make saveBackup take some time
    vi.mocked(saveBackup).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderHook(() => usePersistence(true));

    const triggerSave = vi.mocked(useUIStore.subscribe).mock.calls[0][0];
    
    await act(async () => {
      triggerSave({} as any, {} as any);
      vi.advanceTimersByTime(2000);
    });

    // First save starts
    expect(saveBackup).toHaveBeenCalledTimes(1);

    // Trigger another save while first is still running
    await act(async () => {
      triggerSave({} as any, {} as any);
      vi.advanceTimersByTime(2000);
    });

    // Should still be 1 because isSavingRef.current is true
    expect(saveBackup).toHaveBeenCalledTimes(1);

    // Finish first save
    await act(async () => {
      vi.advanceTimersByTime(100);
      await vi.runAllTimersAsync();
    });
  });

  it('should handle missing setBackupState in catch block', async () => {
    const { saveBackup } = await import('../../src/services/backupService.ts');
    const { useUIStore } = await import('../../src/stores/useUIStore.ts');

    vi.mocked(saveBackup).mockRejectedValueOnce(new Error('Save failed'));
    
    // First call (in useEffect) returns truthy setBackupState to allow subscription
    // Second call (in handleSave) returns falsy setBackupState to test the branch
    vi.mocked(useUIStore.getState)
      .mockReturnValueOnce({
        actions: { setBackupState: vi.fn() },
        modals: { isRestoring: false },
      } as any)
      .mockReturnValue({
        actions: { setBackupState: undefined },
        modals: { isRestoring: false },
      } as any);

    renderHook(() => usePersistence(true));

    const triggerSave = vi.mocked(useUIStore.subscribe).mock.calls[0][0];
    await act(async () => {
      triggerSave({} as any, {} as any);
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();
    });

    expect(saveBackup).toHaveBeenCalled();
  });

  it('should handle missing setBackupState in success path', async () => {
    const { saveBackup } = await import('../../src/services/backupService.ts');
    const { useUIStore } = await import('../../src/stores/useUIStore.ts');

    vi.mocked(saveBackup).mockResolvedValueOnce(undefined);
    
    vi.mocked(useUIStore.getState)
      .mockReturnValueOnce({
        actions: { setBackupState: vi.fn() },
        modals: { isRestoring: false },
      } as any)
      .mockReturnValue({
        actions: { setBackupState: undefined },
        modals: { isRestoring: false },
      } as any);

    renderHook(() => usePersistence(true));

    const triggerSave = vi.mocked(useUIStore.subscribe).mock.calls[0][0];
    await act(async () => {
      triggerSave({} as any, {} as any);
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();
    });

    expect(saveBackup).toHaveBeenCalled();
  });

  it('should not save if isRestoring is true', () => {
    vi.mocked(useUIStore.getState).mockReturnValue({
      actions: { setBackupState: vi.fn() },
      modals: { isRestoring: true },
    } as any);

    renderHook(() => usePersistence(true));

    expect(useUIStore.subscribe).not.toHaveBeenCalled();
  });

  it('should cleanup on unmount', async () => {
    const unsub = vi.fn();
    const { useStudentStore } = await import('../../src/stores/useStudentStore.ts');
    const { useAcademicStore } = await import('../../src/stores/useAcademicStore.ts');
    const { useSystemStore } = await import('../../src/stores/useSystemStore.ts');
    const { useSettingsStore } = await import('../../src/stores/useSettingsStore.ts');
    const { useUIStore } = await import('../../src/stores/useUIStore.ts');

    vi.mocked(useUIStore.getState).mockReturnValue({
      actions: { setBackupState: vi.fn() },
      modals: { isRestoring: false },
    } as any);

    vi.mocked(useStudentStore.subscribe).mockReturnValue(unsub);
    vi.mocked(useAcademicStore.subscribe).mockReturnValue(unsub);
    vi.mocked(useSystemStore.subscribe).mockReturnValue(unsub);
    vi.mocked(useSettingsStore.subscribe).mockReturnValue(unsub);
    vi.mocked(useUIStore.subscribe).mockReturnValue(unsub);

    const { unmount } = renderHook(() => usePersistence(true));
    
    act(() => {
      unmount();
    });

    expect(unsub).toHaveBeenCalledTimes(5);
  });

  it('should not save KB if empty', async () => {
    const { saveKbContentToIndexedDB } = await import('../../src/services/indexedDbService.ts');
    const { useSystemStore } = await import('../../src/stores/useSystemStore.ts');
    const { useUIStore } = await import('../../src/stores/useUIStore.ts');
    
    vi.mocked(useUIStore.getState).mockReturnValue({
      actions: { setBackupState: vi.fn() },
      modals: { isRestoring: false },
    } as any);

    vi.mocked(useSystemStore.getState).mockReturnValue({
      actions: {},
      dismissedSuggestions: new Set(),
      knowledgeBase: []
    } as any);

    renderHook(() => usePersistence(true));

    const triggerSave = vi.mocked(useUIStore.subscribe).mock.calls[0][0];
    await act(async () => {
      triggerSave({} as any, {} as any);
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();
    });

    expect(saveKbContentToIndexedDB).not.toHaveBeenCalled();
  });

  it('should debounce multiple triggers', async () => {
    const { saveBackup } = await import('../../src/services/backupService.ts');
    
    renderHook(() => usePersistence(true));

    const triggerSave = vi.mocked(useUIStore.subscribe).mock.calls[0][0];
    
    act(() => {
      triggerSave({} as any, {} as any);
      vi.advanceTimersByTime(1000);
      triggerSave({} as any, {} as any); // Should clear previous timeout
      vi.advanceTimersByTime(1000);
    });

    // Should not have called yet
    expect(saveBackup).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(1000);
      await vi.runAllTimersAsync();
    });

    expect(saveBackup).toHaveBeenCalledTimes(1);
  });

  it('should clear timeout on unmount if pending', () => {
    renderHook(() => usePersistence(true));

    const triggerSave = vi.mocked(useUIStore.subscribe).mock.calls[0][0];
    
    const { unmount } = renderHook(() => usePersistence(true));
    
    act(() => {
      triggerSave({} as any, {} as any);
    });

    unmount();
    // No crash, timeout cleared
  });
});
