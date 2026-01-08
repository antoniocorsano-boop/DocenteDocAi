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
  children,
  className = ''
}) => (
  <div className={`hero-card ${className}`}>
    {children}
  </div>
);

export default M3HeroCard;

