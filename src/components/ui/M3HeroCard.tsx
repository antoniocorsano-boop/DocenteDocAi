/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// LEGACY - MD3 Non-compliant
// @legacy
// @md3-noncompliant
// @do-not-extend

import React from 'react';

interface M3HeroCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * M3HeroCard - Base component for hero sections with glass effects and expressive styling.
 * Extends M3SurfaceCard with hero-specific visual treatments.
 */
const M3HeroCard: React.FC<M3HeroCardProps> = ({
  children
}) => (
  <div
    style={{
      borderRadius: 'var(--md-sys-shape-corner-large)',
      background: 'var(--md-sys-color-surface)',
      boxShadow: 'var(--md-sys-elevation-level3)',
      padding: 'var(--md-sys-spacing-8)',
      margin: 'var(--md-sys-spacing-8) 0',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

export default M3HeroCard;










// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
