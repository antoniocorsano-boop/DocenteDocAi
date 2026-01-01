/**
 * CRITICAL: Build-time polyfill for Vercel/Node.js environment
 * Runs BEFORE any code imports to prevent SSR errors
 * This is a .js file to ensure it's executed in Node.js during build
 */

// Check if we're in a Node.js or SSR environment
if (typeof globalThis !== 'undefined' && !globalThis.document) {
  // Create a safe element factory
  const createSafeElement = () => ({
    tagName: 'DIV',
    className: '',
    id: '',
    style: {},
    attributes: {},
    childNodes: [],
    children: [],
    parentNode: null,
    textContent: '',
    innerHTML: '',
    nodeType: 1,
    appendChild: (n) => { if (this.childNodes) this.childNodes.push(n); return this; },
    insertBefore: (n, r) => { if (this.childNodes) this.childNodes.unshift(n); return this; },
    removeChild: (n) => this,
    replaceChild: (n, r) => this,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    getAttribute: (n) => this.attributes?.[n] || '',
    setAttribute: (n, v) => { if (!this.attributes) this.attributes = {}; this.attributes[n] = v; },
    removeAttribute: (n) => { if (this.attributes) delete this.attributes[n]; },
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    getElementsByName: () => [],
    cloneNode: () => ({ ...createSafeElement(), childNodes: [], children: [] }),
    contains: () => false,
  });

  const safeElement = createSafeElement();

  // Create mock document
  const mockDoc = {
    ...safeElement,
    nodeType: 9,
    documentElement: { ...safeElement },
    body: { ...safeElement },
    head: { ...safeElement },
    
    createElement: (tag) => ({ ...safeElement, tagName: tag.toUpperCase() }),
    createElementNS: (ns, tag) => ({ ...safeElement, tagName: tag.toUpperCase() }),
    createTextNode: (text) => ({ nodeValue: text, nodeType: 3 }),
    createDocumentFragment: () => ({ ...safeElement, nodeType: 11 }),
    createAttribute: (n) => ({ name: n, value: '' }),
    createComment: () => ({ nodeType: 8 }),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    getElementsByName: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    adoptNode: (n) => n,
    importNode: (n) => n,
  };

  // Use Proxy to safely handle all property access
  globalThis.document = new Proxy(mockDoc, {
    get: (target, prop) => {
      if (target[prop] !== undefined) {
        return target[prop];
      }
      // Return safe defaults for method-like property names
      if (typeof prop === 'string' && (prop.toLowerCase().includes('get') || prop.toLowerCase().includes('query') || prop.toLowerCase().includes('element'))) {
        return function() { return null; };
      }
      return undefined;
    },
    set: (target, prop, value) => {
      target[prop] = value;
      return true;
    }
  });
}

// Ensure window is defined in Node environment
if (typeof globalThis !== 'undefined' && !globalThis.window) {
  globalThis.window = globalThis;
}

// CRITICAL: Ensure scheduler can access Performance API
if (typeof globalThis !== 'undefined') {
  // Create performance object if it doesn't exist
  if (!globalThis.performance) {
    globalThis.performance = {};
  }
  
  // Ensure performance.now exists
  if (!globalThis.performance.now || typeof globalThis.performance.now !== 'function') {
    globalThis.performance.now = () => Date.now();
  }

  // Create/ensure a scheduler-compatible timing function
  if (typeof globalThis !== 'undefined' && !globalThis.__REACT_SCHEDULER_INITIALIZED__) {
    const originalNow = globalThis.performance.now;
    
    // Add a stable timing reference for the scheduler
    globalThis.__REACT_SCHEDULER_INITIALIZED__ = true;
    
    // Ensure the scheduler can initialize its unstable_now
    try {
      // This will ensure scheduler module can create its unstable_now property
      globalThis.performance.now = originalNow;
    } catch (e) {
      // Silently handle any errors
    }
  }
}

// Ensure process.env exists for React and dependencies
if (typeof globalThis !== 'undefined' && !globalThis.process) {
  globalThis.process = {
    env: {
      NODE_ENV: 'production',
    },
  };
}

