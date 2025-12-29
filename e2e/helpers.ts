import { Page } from '@playwright/test';

export async function setTestMode(page: Page) {
  await page.addInitScript(() => {
    (window as any).__TEST_MODE = true;
  });
}

export async function seedIndexedDB(page: Page) {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      try {
        const DB_NAME = 'OrarioDocAI_BackupDB';
        const STORE_NAME = 'app_state';
        const BACKUP_KEY = 'latest_backup';

        const req = indexedDB.open(DB_NAME, 3);
        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
        };
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const payload = {
            user: { id: 'test-local', displayName: 'Test Teacher' },
            students: [],
            lessons: [],
            slots: {},
            evaluations: [],
            udas: [],
            knowledgeBase: [],
            notifiche: [],
            settings: {},
            aiSettings: {},
            themeState: null
          };
          store.put(payload, BACKUP_KEY);
          tx.oncomplete = () => { db.close(); resolve(); };
          tx.onerror = () => { db.close(); resolve(); };
        };
        req.onerror = () => { resolve(); };
      } catch (e) { resolve(); }
    });
  });
}

export async function waitForAppShell(page: Page, timeout = 15000) {
  await page.waitForSelector('.app-shell', { timeout }).catch(() => {});
}
