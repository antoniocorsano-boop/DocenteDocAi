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
        <div  style={{ width: ref.spacing[48], height: ref.spacing[48], marginLeft: "auto", marginRight: "auto", borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span  style={{fontSize: "1.5rem", color: "layers.sys.colors.primary"}}>hourglass_bottom</span>
        </div>
        <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Caricamento...</p>
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
        <div key={i} style={{ borderRadius: ref.shape[] }} style={{ height: ref.spacing[64] }} />
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



