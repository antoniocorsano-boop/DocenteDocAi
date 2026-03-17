import { Page } from '@playwright/test';

export async function setTestMode(page: Page): Promise<void> {
  await page.addInitScript((): void => {
    const windowExt = window as unknown as { __TEST_MODE?: boolean; __SILENCE_ASSISTANT_LOGS?: boolean; __SILENT_PREFIXES?: string[] };
    windowExt.__TEST_MODE = true;
    // Also allow explicit silence flag for verbose components
    windowExt.__SILENCE_ASSISTANT_LOGS = true;
    // Quiet common noisy prefixes used across the app during E2E
    windowExt.__SILENT_PREFIXES = ['[IndexedDbService]', '[BackupService]', '[FloatingSatelliteCopilot]', 'PW_CONSOLE'];

    // Pre-accept privacy consent so the blocking modal never appears in tests
    try {
      localStorage.setItem('privacy_consent_v1', JSON.stringify({ accepted: true, ts: new Date().toISOString() }));
    } catch { /* ignore */ }
    // Wrap console methods to filter noisy messages coming from in-page code
    try {
      const methods = ['log', 'info', 'warn', 'error', 'debug'];
      methods.forEach((m): void => {
        const consoleExt = console as unknown as Record<string, unknown>;
        const orig = consoleExt[m];
        consoleExt[m] = function (...args: unknown[]) {
          try {
            const first = args && args.length ? args[0] : '';
            const text = typeof first === 'string' ? first : JSON.stringify(first || args.slice(0, 1));
            const prefixes = (window as unknown as { __SILENT_PREFIXES?: string[] }).__SILENT_PREFIXES || [];
            for (let i = 0; i < prefixes.length; i++) {
              const p = prefixes[i];
              if (!p) continue;
              if (typeof text === 'string' && (text.startsWith(p) || text.indexOf(p) !== -1)) {
                return; // swallow
              }
            }
          } catch {
            // ignore
          }
          return (orig as unknown as (...args: unknown[]) => unknown).apply(console, args);
        };
      });
    } catch {
      // best-effort
    }
  });
}

export async function seedIndexedDB(page: Page): Promise<void> {
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
            settings: { onboarded: true },
            aiSettings: {},
            themeState: null
          };
          store.put(payload, BACKUP_KEY);
          tx.oncomplete = () => { db.close(); resolve(); };
          tx.onerror = () => { db.close(); resolve(); };
        };
        req.onerror = () => { resolve(); };
      } catch { resolve(); }
    });
  });
}

export async function waitForAppShell(page: Page, timeout = 15000): Promise<void> {
  await page.waitForSelector('.app-shell', { timeout }).catch(() => {});
}
