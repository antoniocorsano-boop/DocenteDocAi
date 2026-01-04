/**
 * Ensure the Performance API exists before React/Scheduler load so React
 * never tries to hand the scheduler an undefined timing object.
 */
const ensurePerformanceApi = () => {
  const now = () => Date.now();

  if (typeof window !== 'undefined') {
    if (!window.performance) {
      (window as any).performance = {};
    }
    if (typeof window.performance.now !== 'function') {
      (window.performance as any).now = now;
    }
  }

  if (typeof globalThis !== 'undefined') {
    if (!globalThis.performance) {
      (globalThis as any).performance = {};
    }
    if (typeof globalThis.performance.now !== 'function') {
      (globalThis.performance as any).now = now;
    }
  }
};

/**
 * CRITICAL: Initialize scheduler for React BEFORE any imports
 * This prevents "Cannot set properties of undefined (setting 'unstable_now')" error
 */
const ensureScheduler = () => {
  // Get the timing function
  const getTimingFunction = () => {
    if (typeof performance !== 'undefined' && performance.now) {
      return () => performance.now();
    }
    return () => Date.now();
  };

  // Create scheduler object with all required functions
  const schedulerImpl: any = {
    unstable_now: getTimingFunction(),
    unstable_scheduleCallback: (priority: number, callback: Function) => {
      if (typeof setImmediate !== 'undefined') {
        return setImmediate(callback as TimerHandler);
      }
      return setTimeout(callback as TimerHandler, 0);
    },
    unstable_cancelCallback: (timerId: number) => {
      if (typeof clearImmediate !== 'undefined') {
        clearImmediate(timerId);
      } else {
        clearTimeout(timerId);
      }
    },
    unstable_shouldYield: () => false,
    unstable_getFirstCallbackNode: () => null,
    unstable_pauseExecution: () => {},
    unstable_continueExecution: () => {},
    unstable_ImmediatePriority: 1,
    unstable_UserBlockingPriority: 2,
    unstable_NormalPriority: 3,
    unstable_LowPriority: 4,
    unstable_IdlePriority: 5,
  };

  // Ensure globalThis.scheduler exists and is writable
  if (typeof globalThis !== 'undefined') {
    // Use Object.defineProperty to ensure we can set it even if it's read-only
    try {
      Object.defineProperty(globalThis, 'scheduler', {
        value: schedulerImpl,
        writable: true,
        configurable: true,
      });
    } catch (e) {
      // Fallback if property is not configurable
      (globalThis as any).scheduler = schedulerImpl;
    }
  }

  // Also ensure window.scheduler if in browser
  if (typeof window !== 'undefined') {
    try {
      Object.defineProperty(window, 'scheduler', {
        value: schedulerImpl,
        writable: true,
        configurable: true,
      });
    } catch (e) {
      (window as any).scheduler = schedulerImpl;
    }
  }
};

ensurePerformanceApi();
ensureScheduler();

export {};