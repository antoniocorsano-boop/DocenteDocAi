/**
 * ViewLoadingPlaceholder - Loading UI for Lazy-Loaded Views
 * 
 * Displays a smooth loading skeleton while view chunks are being loaded.
 * Improves perceived performance during code splitting transitions.
 */

import React from 'react';
import { AiThinkingGem } from './ui';

interface ViewLoadingPlaceholderProps {
  message?: string;
  className?: string;
}

/**
 * Default loading placeholder - shown while view code is loading
 */
export const ViewLoadingPlaceholder: React.FC<ViewLoadingPlaceholderProps> = ({ 
  message = 'Caricamento vista...', 
  className = '' 
}) => {
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
    <div className="min-h-[40vh]" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ gap: "var(--md-sys-spacing-4)", textAlign: "center" }}>
        <div className="aura-glass animate-pulse" style={{ width: "3rem", height: "3rem", marginLeft: "auto", marginRight: "auto", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "1.5rem", color: "var(--md-sys-color-primary)" }}>hourglass_bottom</span>
        </div>
        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant">Caricamento...</p>
      </div>
    </div>
  );
};

/**
 * Skeleton loader for table/list views
 */
export const SkeletonListLoading: React.FC = () => {
  return (
    <div style={{ gap: "var(--md-sys-spacing-4)", padding: "var(--md-sys-spacing-4)" }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-[var(--md-sys-shape-corner-small)] aura-glass animate-pulse" style={{ height: "4rem" }} />
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


