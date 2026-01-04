import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Some DOM methods used by the app (like scrollTo) are not implemented
// in the jsdom environment used by the tests. Provide no-op implementations
// so components that call them do not crash the tests.
if (typeof window !== 'undefined') {
	// window.scrollTo
	// @ts-ignore
	if (typeof window.scrollTo !== 'function') window.scrollTo = () => {};
	// HTMLElement.prototype.scrollTo
	// @ts-ignore
	if (typeof (window.HTMLElement as any).prototype.scrollTo !== 'function') {
		// @ts-ignore
		(window.HTMLElement as any).prototype.scrollTo = function () {};
	}
}

// Mock Google APIs
(global as any).google = {
  accounts: {
    oauth2: {
      initTokenClient: vi.fn(() => ({
        requestAccessToken: vi.fn(),
      })),
      revoke: vi.fn((token: string, cb: () => void) => cb()),
    },
  },
};

(global as any).gapi = {
  load: vi.fn((api, config) => {
    if (config && config.callback) config.callback();
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
(global as any).fetch = vi.fn();
