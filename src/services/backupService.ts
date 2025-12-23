import { KnowledgeBaseEntry } from '../types'; // FIX: Updated import path for types

// This service manages storing and retrieving the entire application state
// to/from IndexedDB for robust automatic backups.

const DB_NAME = 'OrarioDocAI_BackupDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';
const BACKUP_KEY = 'latest_backup';

let dbPromise: Promise<IDBDatabase> | null = null;

// --- PERSISTENCE MANAGER ---
export const initPersistentStorage = async (): Promise<boolean> => {
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        return isPersisted;
    }
    return false;
};

export const checkStorageQuota = async () => {
    if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        return estimate;
    }
    return null;
};

const getDb = (): Promise<IDBDatabase> => {
    if (dbPromise) {
        return dbPromise;
    }
    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        // Support synchronous test mocks that provide result immediately
        // If result is already available, resolve without waiting for onsuccess
        if ((request as any).result) {
            try {
                const db = (request as any).result as IDBDatabase;
                resolve(db);
                return;
            } catch {}
        }
        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject(new Error('Failed to open IndexedDB.'));
        };
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
    return dbPromise;
};

/**
 * Saves the entire application state to IndexedDB.
 * @param state The application state object to save.
 * @returns A promise that resolves when the save is complete.
 */
export const saveBackup = async (state: object): Promise<void> => {
    try {
        // Try to request persistence on save if not already granted implicitly
        // We don't await this to avoid blocking the save
        if (!navigator.storage?.persisted || !(await navigator.storage.persisted())) {
            initPersistentStorage().catch(console.error);
        }

        const db = await getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(state, BACKUP_KEY);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                console.error('Save backup transaction error:', transaction.error);
                reject(transaction.error);
            };
        });
    } catch (error) {
        console.error("Failed to initiate save backup:", error);
        throw error; // Re-throw to be caught by the caller
    }
};

/**
 * Loads the application state from IndexedDB.
 * @returns A promise that resolves with the saved state object, or null if no backup is found.
 */
export const loadBackup = async (): Promise<any | null> => {
    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(BACKUP_KEY);
            request.onsuccess = () => {
                resolve(request.result || null);
            };
            request.onerror = () => {
                console.error('Load backup request error:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error("Failed to initiate load backup:", error);
        return null;
    }
};

/**
 * Deletes the automatic backup from IndexedDB.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteBackup = async (): Promise<void> => {
    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(BACKUP_KEY);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                console.error('Delete backup transaction error:', transaction.error);
                reject(transaction.error);
            };
        });
    } catch (error) {
        console.error("Failed to initiate delete backup:", error);
        throw error;
    }
};
