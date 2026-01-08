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
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 mx-auto rounded-full aura-glass flex items-center justify-center animate-pulse">
          <span className="material-symbols-outlined text-2xl text-primary">hourglass_bottom</span>
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
    <div className="space-y-4 p-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 rounded-[var(--md-sys-shape-corner-small)] aura-glass animate-pulse" />
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


