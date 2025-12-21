import { KnowledgeBaseEntry } from '../types';

// This service manages storing and retrieving Knowledge Base content
// to/from IndexedDB in a dedicated store.

const DB_NAME = 'OrarioDocAI_Data'; // Separate DB for heavy content
const DB_VERSION = 1;
const STORE_NAME = 'kb_content';
const MAIN_DB_NAME = 'OrarioDocAI_BackupDB'; // Main app state DB

let dbPromise: Promise<IDBDatabase> | null = null;

const getDb = (): Promise<IDBDatabase> => {
    if (dbPromise) {
        return dbPromise;
    }
    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => {
            console.error('IndexedDB KB error:', request.error);
            reject(new Error('Failed to open IndexedDB for KB.'));
        };
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
    return dbPromise;
};

/**
 * Saves heavy content of Knowledge Base entries to a dedicated IndexedDB store.
 * Only saves 'content', 'htmlContent', and 'fileContent'.
 * @param kbEntries The KnowledgeBaseEntry array to save.
 */
export const saveKbContentToIndexedDB = async (kbEntries: KnowledgeBaseEntry[]): Promise<void> => {
    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            kbEntries.forEach(entry => {
                if (entry.content || entry.htmlContent || entry.fileContent) {
                    const contentToSave = {
                        id: entry.id,
                        content: entry.content || '',
                        htmlContent: entry.htmlContent || '',
                        fileContent: entry.fileContent || undefined
                    };
                    store.put(contentToSave);
                }
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                console.error('Save KB transaction error:', transaction.error);
                reject(transaction.error);
            };
        });
    } catch (error) {
        console.error("Failed to initiate save KB content:", error);
        throw error;
    }
};

/**
 * Loads heavy content of Knowledge Base entries from IndexedDB.
 * @returns A map of {id: {content, htmlContent, fileContent}}
 */
export const loadKbContentFromIndexedDB = async (): Promise<Record<string, Partial<KnowledgeBaseEntry>>> => {
    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => {
                const result: Record<string, Partial<KnowledgeBaseEntry>> = {};
                request.result.forEach(entry => {
                    result[entry.id] = {
                        content: entry.content,
                        htmlContent: entry.htmlContent,
                        fileContent: entry.fileContent
                    };
                });
                resolve(result);
            };
            request.onerror = () => {
                console.error('Load KB request error:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error("Failed to initiate load KB content:", error);
        return {};
    }
};

/**
 * Deletes a specific KB content entry from IndexedDB.
 * @param id The ID of the KB entry to delete.
 */
export const deleteKbContentFromIndexedDB = async (id: string): Promise<void> => {
    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                console.error('Delete KB entry transaction error:', transaction.error);
                reject(transaction.error);
            };
        });
    } catch (error) {
        console.error("Failed to initiate delete KB entry:", error);
        throw error;
    }
};

/**
 * Clears all entries from the KB content IndexedDB store.
 */
export const clearIndexedDB = async (): Promise<void> => {
    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                console.error('Clear KB store transaction error:', transaction.error);
                reject(transaction.error);
            };
        });
    } catch (error) {
        console.error("Failed to initiate clear KB store:", error);
        throw error;
    }
};

// Also add a function to delete the main app state backup from the main DB
// This function needs to open the *other* DB
export const deleteMainAppBackup = async (): Promise<void> => {
    try {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(MAIN_DB_NAME, 1); // Assuming main DB uses version 1
            request.onerror = () => reject(new Error('Failed to open main app backup DB.'));
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => { /* no upgrade needed here */ };
        });

        return new Promise((resolve, reject) => {
            const transaction = db.transaction('app_state', 'readwrite'); // Assuming store name is 'app_state'
            const store = transaction.objectStore('app_state');
            const request = store.delete('latest_backup'); // Assuming key is 'latest_backup'
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                console.error('Delete main app backup transaction error:', transaction.error);
                reject(transaction.error);
            };
        });
    } catch (error) {
        console.error("Failed to initiate delete main app backup:", error);
        throw error;
    }
};
