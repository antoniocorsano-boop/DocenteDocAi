// MD3 Gold Compliant
// Custom hook per hover effects su componenti cliccabili
// Audit: febbraio 2026

import { useState, useMemo } from 'react';

export type ElevationLevel = 'level1' | 'level2' | 'level3';

interface UseHoverEffectReturn {
  style: React.CSSProperties;
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
}

const elevationShadows: Record<ElevationLevel, string> = {
  level1: '0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
  level2: '0 2px 4px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.1)',
  level3: '0 4px 8px rgba(0,0,0,0.05), 0 8px 16px rgba(0,0,0,0.1)',
};

/**
 * Hook che fornisce stili e handlers per hover effects
 * @param elevation - Livello di elevazione da applicare (default: level2)
 * @returns Oggetto con style e event handlers per hover
 *
 * Esempio:
 * ```tsx
 * const hoverEffect = useHoverEffect('level2');
 *
 * <div
 *   style={{ ...hoverEffect.style, padding: '16px' }}
 *   onMouseEnter={hoverEffect.onMouseEnter}
 *   onMouseLeave={hoverEffect.onMouseLeave}
 * >
 *   Contenuto
 * </div>
 * ```
 */
export const useHoverEffect = (elevation: ElevationLevel = 'level2'): UseHoverEffectReturn => {
  const [isHovered, setIsHovered] = useState(false);

  const style = useMemo(() => ({
    transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isHovered ? elevationShadows[elevation] : 'none',
  }), [isHovered, elevation]);

  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);

  return {
    style,
    onMouseEnter,
    onMouseLeave,
  };
};

export default useHoverEffect;
