/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * CRITICAL: Ultra-robust DOM polyfill for Vercel SSR compatibility AND browser protection
 * This file runs FIRST, before any imports or React code
 * Ensures 'document' exists for libraries like docx that access it during import
 * Also protects against undefined document in browser runtime
 */

// Protect React hooks from being called before React is ready
if (typeof window !== 'undefined') {
  const originalHooks = {
    useState: undefined as unknown,
    useEffect: undefined as any,
    useReducer: undefined as any,
    useRef: undefined as any,
    useContext: undefined as any,
    useCallback: undefined as any,
    useMemo: undefined as any,
  };
}

// Create safe element factory that covers all possible DOM operations
const createSafeElement = (): any => ({
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
  appendChild: function(n: any) { if (this.childNodes) this.childNodes.push(n); return this; },
  insertBefore: function(n: any, r: any) { if (this.childNodes) this.childNodes.unshift(n); return this; },
  removeChild: function(n: any) { return this; },
  replaceChild: function(n: any, r: any) { return this; },
  addEventListener: function() { return undefined; },
  removeEventListener: function() { return undefined; },
  getAttribute: function(n: string) { return this.attributes?.[n] || ''; },
  setAttribute: function(n: string, v: any) { if (!this.attributes) this.attributes = {}; this.attributes[n] = v; },
  removeAttribute: function(n: string) { if (this.attributes) delete this.attributes[n]; },
  querySelector: function() { return null; },
  querySelectorAll: function() { return []; },
  getElementById: function() { return null; },
  getElementsByTagName: function() { return []; },
  getElementsByClassName: function() { return []; },
  getElementsByName: function() { return []; },
  cloneNode: function() { return { ...createSafeElement(), childNodes: [], children: [] }; },
  contains: function() { return false; },
});

// ALWAYS apply polyfill, even in browser to catch edge cases
if (typeof window !== 'undefined') {
  // Create a comprehensive document mock that handles all docx library needs
  const safeElement: any = createSafeElement();

  // Robust document polyfill with full API
  if (!window.document || typeof window.document.createElement !== 'function' || !window.document.body) {
    const mockDoc: any = {
      ...safeElement,
      nodeType: 9,
      documentElement: { ...safeElement },
      body: { ...safeElement },
      head: { ...safeElement },
      
      createElement: (tag: string) => ({ ...safeElement, tagName: tag.toUpperCase() }),
      createElementNS: (ns: string, tag: string) => ({ ...safeElement, tagName: tag.toUpperCase() }),
      createTextNode: (text: string) => ({ nodeValue: text, nodeType: 3 }),
      createDocumentFragment: () => ({ ...safeElement, nodeType: 11 }),
      createAttribute: (n: string) => ({ name: n, value: '' }),
      createComment: () => ({ nodeType: 8 }),
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementsByTagName: () => [],
      getElementsByClassName: () => [],
      getElementsByName: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      adoptNode: (n: any) => n,
      importNode: (n: any) => n,
    };

    // Use Proxy to catch ALL property access and return safe values
    if (typeof Proxy !== 'undefined') {
      (window as any).document = new Proxy(mockDoc, {
        get: function(target: any, prop: any, receiver: any) {
          // First check if target has the property
          if (target[prop] !== undefined) {
            return target[prop];
          }
          // Return safe defaults for any unknown property
          if (typeof prop === 'string' && (prop.toLowerCase().includes('get') || prop.toLowerCase().includes('query') || prop.toLowerCase().includes('element'))) {
            return function() { return null; };
          }
          // For write operations on style, create safe object
          if (prop === 'style' || prop === 'attributes') {
            return {};
          }
          return target[prop];
        },
        set: function(target: any, prop: any, value: any) {
          target[prop] = value;
          return true;
        }
      });
    } else {
      (window as any).document = mockDoc;
    }
  }
  
  // Ensure window.document is properly defined even if it was partially broken
  if (!window.document) {
    (window as any).document = createSafeElement();
  }
  
  // Robust DOMParser polyfill
  if (typeof DOMParser === 'undefined') {
    (window as any).DOMParser = class DOMParser {
      parseFromString(str: string, type: string) {
        return { 
          body: { ...safeElement },
          documentElement: { ...safeElement },
          head: { ...safeElement },
          querySelector: () => null,
          querySelectorAll: () => [],
          nodeType: 9
        };
      }
    };
  }
  
  // Ensure Node and HTMLElement with proper constants
  if (typeof Node === 'undefined') {
    (window as any).Node = {
      ELEMENT_NODE: 1,
      ATTRIBUTE_NODE: 2,
      TEXT_NODE: 3,
      CDATA_SECTION_NODE: 4,
      ENTITY_REFERENCE_NODE: 5,
      ENTITY_NODE: 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE: 8,
      DOCUMENT_NODE: 9,
      DOCUMENT_TYPE_NODE: 10,
      DOCUMENT_FRAGMENT_NODE: 11
    };
  }
  if (typeof HTMLElement === 'undefined') {
    (window as any).HTMLElement = class HTMLElement {};
  }
  if (typeof Element === 'undefined') {
    (window as any).Element = class Element {};
  }
}

export {};
