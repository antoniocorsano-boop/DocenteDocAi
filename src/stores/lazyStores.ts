/**
 * CRITICAL: Lazy-load zustand stores to ensure React is initialized first
 * This prevents "Cannot read properties of undefined (reading 'useState')" errors
 */

let cachedDataStore: any = null;
let cachedUIStore: any = null;
let cachedSettingsStore: any = null;

// Lazy load data store
export async function getDataStore() {
  if (!cachedDataStore) {
    const { useDataStore } = await import('./useDataStore');
    cachedDataStore = useDataStore;
  }
  return cachedDataStore;
}

// Lazy load UI store
export async function getUIStore() {
  if (!cachedUIStore) {
    const { useUIStore } = await import('./useUIStore');
    cachedUIStore = useUIStore;
  }
  return cachedUIStore;
}

// Lazy load settings store
export async function getSettingsStore() {
  if (!cachedSettingsStore) {
    const { useSettingsStore } = await import('./useSettingsStore');
    cachedSettingsStore = useSettingsStore;
  }
  return cachedSettingsStore;
}

// Synchronous getters that return cached or error if not loaded
export function getDataStoreSync() {
  if (!cachedDataStore) {
    throw new Error('DataStore not loaded yet. Use getDataStore() or ensure it\'s imported in App.');
  }
  return cachedDataStore;
}

export function getUIStoreSync() {
  if (!cachedUIStore) {
    throw new Error('UIStore not loaded yet. Use getUIStore() or ensure it\'s imported in App.');
  }
  return cachedUIStore;
}

export function getSettingsStoreSync() {
  if (!cachedSettingsStore) {
    throw new Error('SettingsStore not loaded yet. Use getSettingsStore() or ensure it\'s imported in App.');
  }
  return cachedSettingsStore;
}

// Pre-load all stores (call this once in main.tsx after React is ready)
export async function preloadAllStores() {
  await Promise.all([
    getDataStore(),
    getUIStore(),
    getSettingsStore(),
  ]);
}
