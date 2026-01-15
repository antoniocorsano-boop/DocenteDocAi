// LEGACY - MD3 Non-compliant
/**
 * ViewLoadingPlaceholder - Loading UI for Lazy-Loaded Views
 * 
 * Displays a smooth loading skeleton while view chunks are being loaded.
 * Improves perceived performance during code splitting transitions.
 */

import React from 'react';
import { AiThinkingGem } from './ui';
import { useTheme } from '../theme/theme';

interface ViewLoadingPlaceholderProps {
  message?: string;
  className?: string;
}

/**
 * Default loading placeholder - shown while view code is loading
 */
export const ViewLoadingPlaceholder: React.FC<ViewLoadingPlaceholderProps> = ({ 
  message = 'Caricamento vista...', 
   
}) => {
  const { layers } = useTheme();
  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-6 ${className}`}>
      <AiThinkingGem size="large" text={message} />
    </div>
  );
};

/**
 * Minimal loading placeholder - lightweight version
 */
export const MinimalViewLoading: React.FC = () => {
  return (
    <div  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{gap: layers.ref.spacing['4'], textAlign: "center"}}>
        <div  style={{ width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], marginLeft: "auto", marginRight: "auto", borderRadius: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span  style={{fontSize: "1.5rem", color: "layers.sys.color.primary"}}>hourglass_bottom</span>
        </div>
        <p style={{ color: layers.sys.color.onSurfaceVariant }}>Caricamento...</p>
      </div>
    </div>
  );
};

/**
 * Skeleton loader for table/list views
 */
export const SkeletonListLoading: React.FC = () => {
  return (
    <div style={{gap: layers.ref.spacing['4'], padding: layers.ref.spacing['4']}}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ borderRadius: layers.ref.shape.corner.large }} style={{ height: layers.ref.spacing['12'] }} />
      ))}
    </div>
  );
};

/**
 * Preload hint - called on route navigation to prefetch next view
 */
export function useViewPreload(viewName: string): void {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger prefetch via dynamic import
      import('./viewRegistry/lazyViewLoader').then(mod => {
        if (mod.preloadView) {
          mod.preloadView(viewName);
        }
      }).catch(err => {
        console.warn('[view-preload] Failed to import lazy loader:', err);
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [viewName]);
}

export default ViewLoadingPlaceholder;







