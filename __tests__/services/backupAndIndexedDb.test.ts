// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveBackup, loadBackup, deleteBackup } from '../../src/services/backupService';
import { saveKbContentToIndexedDB, loadKbContentFromIndexedDB, deleteKbContentFromIndexedDB, clearIndexedDB } from '../../src/services/indexedDbService';
import { KnowledgeBaseEntry } from '../../src/types';

// Use fake timers to control setTimeout in tests
vi.useFakeTimers();

// Mock di IndexedDB
const mockDb = {
    transaction: vi.fn(() => ({
        objectStore: vi.fn(() => ({
            put: vi.fn(),
            get: vi.fn(),
            delete: vi.fn(),
            getAll: vi.fn(),
            clear: vi.fn(),
        })),
        oncomplete: null,
        onerror: null,
    })),
    close: vi.fn(),
    objectStoreNames: {
        contains: vi.fn(() => true),
    },
};

const mockRequest = {
    result: mockDb,
    error: null,
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null,
};

const mockStoreRequest = {
    result: null,
    onsuccess: null,
    onerror: null,
};


describe('backupService (IndexedDB app_state)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Reset mockDb properly - ensure result is set immediately for sync mock
        mockRequest.result = mockDb;
        mockRequest.onsuccess = null;
        mockRequest.onerror = null;
        mockRequest.onupgradeneeded = null;
        
        global.indexedDB = {
            open: vi.fn(() => {
                // Trigger onsuccess asynchronously but before timers advance
                setTimeout(() => {
                    if (mockRequest.onsuccess) mockRequest.onsuccess({ target: mockRequest } as any);
                }, 0);
                return mockRequest;
            }),
            deleteDatabase: vi.fn(),
        };

        // Resetta i mock per ogni operazione di IndexedDB
        mockDb.transaction.mockClear();
        mockDb.transaction.mockImplementation(() => {
            const store = {
                put: vi.fn(() => {
                    const req = { result: null, onsuccess: null, onerror: null };
                    // Fire onsuccess synchronously
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
                get: vi.fn(() => {
                    const req = { result: null, onsuccess: null, onerror: null };
                    // Fire onsuccess synchronously
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
                delete: vi.fn(() => {
                    const req = { result: null, onsuccess: null, onerror: null };
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
                getAll: vi.fn(() => {
                    const req = { result: [], onsuccess: null, onerror: null };
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
                clear: vi.fn(() => {
                    const req = { result: null, onsuccess: null, onerror: null };
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
            };
            const tx = {
                objectStore: vi.fn(() => store),
                oncomplete: null,
                onerror: null,
            };
            // Simulate transaction completion after store operations
            setTimeout(() => tx.oncomplete && tx.oncomplete(), 0);
            return tx;
        });

        mockStoreRequest.result = null; // Default a null per get/getAll
    });

    it('dovrebbe salvare un backup nello store app_state', async () => {
        const testState = { user: { id: '123' }, settings: {} };
        const savePromise = saveBackup(testState);
        
        // Advance timers to trigger callbacks
        await vi.runAllTimersAsync();
        await savePromise;

        expect(global.indexedDB.open).toHaveBeenCalledWith('OrarioDocAI_BackupDB', 3);
        const transaction = mockDb.transaction.mock.results[0].value;
        expect(transaction.objectStore).toHaveBeenCalledWith('app_state');
        expect(transaction.objectStore().put).toHaveBeenCalledWith(testState, 'latest_backup');
    });

    it('dovrebbe caricare un backup dallo store app_state', async () => {
        const testState = { user: { id: '123' } };
        
        // Setup: mockDb.transaction returns a tx with proper get behavior
        mockDb.transaction.mockImplementationOnce(() => {
            const store = {
                get: vi.fn(() => {
                    const req = { result: testState, onsuccess: null, onerror: null };
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
            };
            const tx = {
                objectStore: vi.fn(() => store),
                oncomplete: null,
                onerror: null,
            };
            setTimeout(() => tx.oncomplete && tx.oncomplete(), 0);
            return tx;
        });

        const loadPromise = loadBackup();
        
        // Advance timers to trigger callbacks
        await vi.runAllTimersAsync();
        const loadedState = await loadPromise;

        // DB may already be open from previous test (cached), so just verify the result
        expect(loadedState).toEqual(testState);
    });

    it('dovrebbe eliminare un backup dallo store app_state', async () => {
        const deletePromise = deleteBackup();
        
        // Advance timers to trigger callbacks
        await vi.runAllTimersAsync();
        await deletePromise;

        // Verify deletion was called
        const transaction = mockDb.transaction.mock.results[0].value;
        expect(transaction.objectStore).toHaveBeenCalledWith('app_state');
        expect(transaction.objectStore().delete).toHaveBeenCalledWith('latest_backup');
    });
});

describe('indexedDbService (IndexedDB kb_content)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
        global.indexedDB = {
            open: vi.fn(() => {
                // Trigger onsuccess asynchronously but before timers advance
                setTimeout(() => {
                    if (mockRequest.onsuccess) mockRequest.onsuccess({ target: mockRequest } as any);
                }, 0);
                return mockRequest;
            }),
            deleteDatabase: vi.fn(),
        };

        // Resetta i mock per ogni operazione di IndexedDB
        mockDb.transaction.mockClear();
        mockDb.transaction.mockImplementation(() => {
            const store = {
                put: vi.fn(() => {
                    const req = { result: null, onsuccess: null, onerror: null };
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
                get: vi.fn(() => {
                    const req = { result: null, onsuccess: null, onerror: null };
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
                delete: vi.fn(() => {
                    const req = { result: null, onsuccess: null, onerror: null };
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
                getAll: vi.fn(() => {
                    const req = { result: [], onsuccess: null, onerror: null };
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
                clear: vi.fn(() => {
                    const req = { result: null, onsuccess: null, onerror: null };
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
            };
            const tx = {
                objectStore: vi.fn(() => store),
                oncomplete: null,
                onerror: null,
            };
            // Simulate transaction completion after store operations
            setTimeout(() => tx.oncomplete && tx.oncomplete(), 0);
            return tx;
        });

        mockStoreRequest.result = null; // Default a null per get/getAll
    });

    it('dovrebbe salvare il contenuto pesante della Knowledge Base', async () => {
        const testKbEntries: KnowledgeBaseEntry[] = [
            { id: 'kb1', fileName: 'f1', content: 'c1', htmlContent: 'h1', fileContent: { data: 'd1', mimeType: 'm1' } },
        ];
        const savePromise = saveKbContentToIndexedDB(testKbEntries);
        
        // Advance timers to trigger callbacks
        await vi.runAllTimersAsync();
        await savePromise;

        // Verify the transaction was created and put was called
        const transaction = mockDb.transaction.mock.results[0].value;
        expect(transaction.objectStore).toHaveBeenCalledWith('kb_content');
        // Get the actual store object that was returned
        const store = transaction.objectStore.mock.results[0].value;
        // The service filters the entry to only save specific properties
        expect(store.put).toHaveBeenCalledWith({
            id: 'kb1',
            content: 'c1',
            htmlContent: 'h1',
            fileContent: { data: 'd1', mimeType: 'm1' }
        });
    });

    it('dovrebbe caricare il contenuto pesante della Knowledge Base', async () => {
        const testKbContent = {
            id: 'kb1',
            content: 'c1',
            htmlContent: 'h1',
            fileContent: { data: 'd1', mimeType: 'm1' }
        };
        
        mockDb.transaction.mockImplementationOnce(() => {
            const store = {
                getAll: vi.fn(() => {
                    const req = { result: [testKbContent], onsuccess: null, onerror: null };
                    setTimeout(() => req.onsuccess && req.onsuccess(), 0);
                    return req;
                }),
            };
            const tx = {
                objectStore: vi.fn(() => store),
                oncomplete: null,
                onerror: null,
            };
            setTimeout(() => tx.oncomplete && tx.oncomplete(), 0);
            return tx;
        });

        const loadPromise = loadKbContentFromIndexedDB();
        
        // Advance timers to trigger callbacks
        await vi.runAllTimersAsync();
        const loadedContent = await loadPromise;
        
        expect(loadedContent).toEqual({ kb1: { content: 'c1', htmlContent: 'h1', fileContent: { data: 'd1', mimeType: 'm1' } } });
    });

    it('dovrebbe eliminare una singola entry dalla Knowledge Base', async () => {
        const deletePromise = deleteKbContentFromIndexedDB('kb1');
        
        // Advance timers to trigger callbacks
        await vi.runAllTimersAsync();
        await deletePromise;

        // Verify deletion was called
        const transaction = mockDb.transaction.mock.results[0].value;
        expect(transaction.objectStore).toHaveBeenCalledWith('kb_content');
        expect(transaction.objectStore().delete).toHaveBeenCalledWith('kb1');
    });

    it('dovrebbe svuotare lo store della Knowledge Base', async () => {
        const clearPromise = clearIndexedDB();
        
        // Advance timers to trigger callbacks
        await vi.runAllTimersAsync();
        await clearPromise;

        // Verify clear was called
        const transaction = mockDb.transaction.mock.results[0].value;
        expect(transaction.objectStore).toHaveBeenCalledWith('kb_content');
        expect(transaction.objectStore().clear).toHaveBeenCalledTimes(1);
    });
});
