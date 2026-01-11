import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock localStorage for vitest
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Some DOM methods used by the app (like scrollTo) are not implemented
// in the jsdom environment used by the tests. Provide no-op implementations
// so components that call them do not crash the tests.
if (typeof window !== 'undefined') {
	// window.scrollTo
	// @ts-expect-error - scrollTo not in jsdom
	if (typeof window.scrollTo !== 'function') window.scrollTo = () => {};
	// HTMLElement.prototype.scrollTo
	// @ts-expect-error - scrollTo not in jsdom
	if (typeof (window.HTMLElement as unknown as { prototype: { scrollTo?: unknown } }).prototype.scrollTo !== 'function') {
		// @ts-expect-error - scrollTo not in jsdom
		(window.HTMLElement as unknown as { prototype: Record<string, unknown> }).prototype.scrollTo = function () {};
	}
}

// Mock Google APIs
const globalWithGoogle = global as unknown as { google?: unknown; gapi?: unknown; fetch?: unknown };
globalWithGoogle.google = {
  accounts: {
    oauth2: {
      initTokenClient: vi.fn(() => ({
        requestAccessToken: vi.fn(),
      })),
      revoke: vi.fn((token: unknown, cb: () => void) => cb()),
    },
  },
};

globalWithGoogle.gapi = {
  load: vi.fn((api: unknown, config: unknown) => {
    const cfg = config as unknown as { callback?: () => void };
    if (cfg && cfg.callback) cfg.callback();
  }),
  client: {
    init: vi.fn(() => Promise.resolve()),
    gmail: {
      users: {
        messages: {
          list: vi.fn(),
          get: vi.fn(),
          send: vi.fn(),
        },
      },
    },
  },
};

// Mock fetch
globalWithGoogle.fetch = vi.fn();
