/**
 * useReducedMotion.ts
 * React hook to detect user's reduced motion preference
 * Essential for MD3 Expressive accessibility compliance
 */

import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Respects system accessibility settings
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get motion duration based on user preference
 * Returns 0 for reduced motion, otherwise returns the specified duration
 */
export function useMotionDuration(
  normalDuration: string = 'var(--md-sys-motion-duration-medium)'
): string {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? '0.01ms' : normalDuration;
}

/**
 * Get appropriate easing based on user preference
 */
export function useMotionEasing(
  normalEasing: string = 'var(--md-sys-motion-easing-standard)'
): string {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? 'linear' : normalEasing;
}

export default useReducedMotion;
