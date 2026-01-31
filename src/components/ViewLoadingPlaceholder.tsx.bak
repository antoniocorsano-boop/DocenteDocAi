// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.
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
  message = 'Caricamento vista...'
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(0.6 * var(--md-sys-viewport-height-full))',
        gap: 'var(--app-spacing-section)'
      }}
    >
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
      <div style={{gap: 'var(--app-spacing-container)', textAlign: "center"}}>
        <div  style={{ width: 'var(--app-spacing-container)', height: 'var(--app-spacing-container)', marginLeft: "var(--app-layout-auto)", marginRight: "var(--app-layout-auto)", borderRadius: 'var(--app-spacing-container)', display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span  style={{fontSize: "var(--app-text-title)", color: "var(--app-color-primary)"}}>hourglass_bottom</span>
        </div>
        <p style={{ color: 'var(--app-color-on-surface-variant)' }}>Caricamento...</p>
      </div>
    </div>
  );
};

/**
 * Skeleton loader for table/list views
 */
export const SkeletonListLoading: React.FC = () => {
  return (
    <div style={{gap: 'var(--app-spacing-container)', padding: 'var(--app-spacing-container)'}}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ borderRadius: 'var(--md-sys-shape-corner-large)' ,  height: 'var(--md-sys-spacing-12)' }} />
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








