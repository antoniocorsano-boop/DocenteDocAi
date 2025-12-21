// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveBackup, loadBackup, deleteBackup } from '../../services/backupService';
import { saveKbContentToIndexedDB, loadKbContentFromIndexedDB, deleteKbContentFromIndexedDB, clearIndexedDB } from '../../services/indexedDbService';
import { KnowledgeBaseEntry } from '../../types';

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
        global.indexedDB = {
            open: vi.fn(() => mockRequest),
            deleteDatabase: vi.fn(),
        };

        // Resetta i mock per ogni operazione di IndexedDB
        mockDb.transaction.mockClear();
        mockDb.transaction.mockImplementation(() => {
            const tx = {
                objectStore: vi.fn(() => ({
                    put: vi.fn(() => mockStoreRequest),
                    get: vi.fn(() => mockStoreRequest),
                    delete: vi.fn(() => mockStoreRequest),
                })),
                oncomplete: null,
                onerror: null,
            };
            // Simulate transaction completion by calling the oncomplete handler
            setTimeout(() => tx.oncomplete && tx.oncomplete(), 0);
            return tx;
        });

        mockStoreRequest.result = null; // Default a null per get/getAll
    });

    it('dovrebbe salvare un backup nello store app_state', async () => {
        const testState = { user: { id: '123' }, settings: {} };
        await saveBackup(testState);

        expect(global.indexedDB.open).toHaveBeenCalledWith('OrarioDocAI_BackupDB', 1);
        const transaction = mockDb.transaction.mock.results[0].value;
        expect(transaction.objectStore).toHaveBeenCalledWith('app_state');
        expect(transaction.objectStore().put).toHaveBeenCalledWith(testState, 'latest_backup');
    });

    it('dovrebbe caricare un backup dallo store app_state', async () => {
        const testState = { user: { id: '123' } };
        mockDb.transaction.mockImplementationOnce(() => {
            const tx = {
                objectStore: vi.fn(() => ({
                    get: vi.fn(() => mockStoreRequest),
                })),
                oncomplete: null,
                onerror: null,
            };
            setTimeout(() => {
                mockStoreRequest.result = testState;
                mockStoreRequest.onsuccess && mockStoreRequest.onsuccess();
            }, 0);
            return tx;
        });

        const loadedState = await loadBackup();

        expect(global.indexedDB.open).toHaveBeenCalledWith('OrarioDocAI_BackupDB', 1);
        expect(loadedState).toEqual(testState);
    });

    it('dovrebbe eliminare un backup dallo store app_state', async () => {
        await deleteBackup();

        expect(global.indexedDB.open).toHaveBeenCalledWith('OrarioDocAI_BackupDB', 1);
        const transaction = mockDb.transaction.mock.results[0].value;
        expect(transaction.objectStore).toHaveBeenCalledWith('app_state');
        expect(transaction.objectStore().delete).toHaveBeenCalledWith('latest_backup');
    });
});

describe('indexedDbService (IndexedDB kb_content)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.indexedDB = {
            open: vi.fn(() => mockRequest),
            deleteDatabase: vi.fn(),
        };

        // Resetta i mock per ogni operazione di IndexedDB
        mockDb.transaction.mockClear();
        mockDb.transaction.mockImplementation(() => {
            const tx = {
                objectStore: vi.fn(() => ({
                    put: vi.fn(() => mockStoreRequest),
                    get: vi.fn(() => mockStoreRequest),
                    delete: vi.fn(() => mockStoreRequest),
                    getAll: vi.fn(() => mockStoreRequest),
                    clear: vi.fn(() => mockStoreRequest),
                })),
                oncomplete: null,
                onerror: null,
            };
            setTimeout(() => tx.oncomplete && tx.oncomplete(), 0);
            return tx;
        });

        mockStoreRequest.result = null; // Default a null per get/getAll
    });

    it('dovrebbe salvare il contenuto pesante della Knowledge Base', async () => {
        const testKbEntries: KnowledgeBaseEntry[] = [
            { id: 'kb1', fileName: 'f1', content: 'c1', htmlContent: 'h1', fileContent: { data: 'd1', mimeType: 'm1' } },
        ];
        await saveKbContentToIndexedDB(testKbEntries);

        expect(global.indexedDB.open).toHaveBeenCalledWith('OrarioDocAI_Data', 1);
        const transaction = mockDb.transaction.mock.results[0].value;
        expect(transaction.objectStore).toHaveBeenCalledWith('kb_content');
        expect(transaction.objectStore().put).toHaveBeenCalledWith(testKbEntries[0]);
    });

    it('dovrebbe caricare il contenuto pesante della Knowledge Base', async () => {
        const testKbContent = {
            id: 'kb1',
            content: 'c1',
            htmlContent: 'h1',
            fileContent: { data: 'd1', mimeType: 'm1' }
        };
        mockDb.transaction.mockImplementationOnce(() => {
            const tx = {
                objectStore: vi.fn(() => ({
                    getAll: vi.fn(() => mockStoreRequest),
                })),
                oncomplete: null,
                onerror: null,
            };
            setTimeout(() => {
                mockStoreRequest.result = [testKbContent];
                mockStoreRequest.onsuccess && mockStoreRequest.onsuccess();
            }, 0);
            return tx;
        });

        const loadedContent = await loadKbContentFromIndexedDB();
        expect(loadedContent).toEqual({ kb1: { content: 'c1', htmlContent: 'h1', fileContent: { data: 'd1', mimeType: 'm1' } } });
    });

    it('dovrebbe eliminare una singola entry dalla Knowledge Base', async () => {
        await deleteKbContentFromIndexedDB('kb1');

        expect(global.indexedDB.open).toHaveBeenCalledWith('OrarioDocAI_Data', 1);
        const transaction = mockDb.transaction.mock.results[0].value;
        expect(transaction.objectStore).toHaveBeenCalledWith('kb_content');
        expect(transaction.objectStore().delete).toHaveBeenCalledWith('kb1');
    });

    it('dovrebbe svuotare lo store della Knowledge Base', async () => {
        await clearIndexedDB();

        expect(global.indexedDB.open).toHaveBeenCalledWith('OrarioDocAI_Data', 1);
        const transaction = mockDb.transaction.mock.results[0].value;
        expect(transaction.objectStore).toHaveBeenCalledWith('kb_content');
        expect(transaction.objectStore().clear).toHaveBeenCalledTimes(1);
    });
});
