import '@testing-library/jest-dom/vitest';

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
