// MD3 Expressive — Page transition wrapper
// Uses MD3 spring expressive tokens for Google-app-like feel
// Supports fade-through (unrelated views) and slide-up (nested views)

import React, { useEffect, useRef, useState } from 'react';

/**
 * - `fade-through`: scale 0.92→1 + opacity 0→1 (Gmail/Photos style, for top-level view changes)
 * - `slide-up`: translateY(var(--md-sys-spacing-4))→0 + opacity 0→1 (for panel/section entrances)
 * - `fade`: opacity only, no spatial movement (for overlays, loading replacements)
 */
export type PageTransitionVariant = 'fade-through' | 'slide-up' | 'fade';

interface PageTransitionProps {
  children: React.ReactNode;
  /** Animation style. Default: 'fade-through' */
  variant?: PageTransitionVariant;
  /** When true, resets and re-runs the entrance animation. Change this on view switches. */
  transitionKey?: string | number;
  /** When true briefly hides content (e.g. while async data loads). */
  isLoading?: boolean;
}

const SPRING_SPATIAL = `
  var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms)
  var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00))
`.trim().replace(/\n\s+/g, ' ');

const SPRING_EFFECTS = `
  var(--md-sys-motion-spring-expressive-default-effects-duration, 200ms)
  var(--md-sys-motion-spring-expressive-default-effects, cubic-bezier(0.34, 0.80, 0.34, 1.00))
`.trim().replace(/\n\s+/g, ' ');

function getHiddenStyle(variant: PageTransitionVariant): React.CSSProperties {
  switch (variant) {
    case 'fade-through': return { opacity: 0, transform: 'scale(0.92)' };
    case 'slide-up':     return { opacity: 0, transform: 'translateY(var(--md-sys-spacing-4))' };
    case 'fade':         return { opacity: 0, transform: 'none' };
  }
}

function getVisibleStyle(): React.CSSProperties {
  return { opacity: 1, transform: 'none' };
}

function getTransition(variant: PageTransitionVariant): string {
  if (variant === 'fade') {
    return `opacity ${SPRING_EFFECTS}`;
  }
  return `opacity ${SPRING_EFFECTS}, transform ${SPRING_SPATIAL}`;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variant = 'fade-through',
  transitionKey,
  isLoading = false,
}) => {
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<number | null>(null);

  const triggerEnter = () => {
    setVisible(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    // Double rAF ensures the hidden style is painted before transitioning in
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = requestAnimationFrame(() => setVisible(true));
    });
  };

  // Initial mount
  useEffect(() => {
    triggerEnter();
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  // Re-trigger on view key change
  useEffect(() => {
    if (transitionKey !== undefined) triggerEnter();
  }, [transitionKey]);

  // Re-trigger when loading resolves
  useEffect(() => {
    if (!isLoading) triggerEnter();
  }, [isLoading]);

  const currentStyle: React.CSSProperties = {
    ...(visible && !isLoading ? getVisibleStyle() : getHiddenStyle(variant)),
    transition: getTransition(variant),
    willChange: variant !== 'fade' ? 'opacity, transform' : 'opacity',
  };

  return (
    <div style={currentStyle}>
      {children}
    </div>
  );
};

export default PageTransition;
