/**
 * ReducedMotionProvider.tsx
 * Provider component that applies reduced motion preferences globally
 * Wraps the app to respect accessibility settings
 */

import React, { createContext, useContext, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ReducedMotionContextType {
  prefersReducedMotion: boolean;
}

const ReducedMotionContext = createContext<ReducedMotionContextType>({
  prefersReducedMotion: false,
});

export const useReducedMotionContext = () => useContext(ReducedMotionContext);

interface ReducedMotionProviderProps {
  children: React.ReactNode;
}

export const ReducedMotionProvider: React.FC<ReducedMotionProviderProps> = ({
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Apply global styles when reduced motion is preferred
  useEffect(() => {
    if (prefersReducedMotion) {
      // Add a class to body for CSS-based reduced motion
      document.body.classList.add('reduced-motion');

      // Optional: Show a subtle indicator that reduced motion is active
      console.info('Reduced motion preference detected - animations disabled');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    return () => {
      document.body.classList.remove('reduced-motion');
    };
  }, [prefersReducedMotion]);

  return (
    <ReducedMotionContext.Provider value={{ prefersReducedMotion }}>
      {children}
      {/* Global styles for reduced motion */}
      <style>{`
        /* When reduced motion is preferred, disable all animations */
        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        /* Keep essential animations for functionality */
        .reduced-motion .m3-essential-motion,
        .reduced-motion .m3-essential-motion * {
          animation-duration: var(--md-sys-motion-duration-short-1) !important;
          transition-duration: var(--md-sys-motion-duration-short-1) !important;
        }
      `}</style>
    </ReducedMotionContext.Provider>
  );
};

export default ReducedMotionProvider;
