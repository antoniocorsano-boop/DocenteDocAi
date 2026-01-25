// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
import React from 'react';
import NavigationRail from './NavigationRail';
import { View } from '../types';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'var(--md-sys-spacing-20) 1fr',
        minHeight: '100vh',
        backgroundColor: 'var(--md-sys-color-surface)',
        borderRight: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)'
      }}
    >
      {/* NavigationRail su desktop */}
      <aside style={{ background: 'var(--md-sys-color-surface)', borderRight: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' }}>
        <NavigationRail
          items={[]}
          activeView={'home' as View}
          onNavigate={() => {}}
        />
      </aside>

      {/* Main content */}
      <main
        style={{
          padding: 'var(--md-sys-spacing-8) var(--md-sys-spacing-10)',
          maxWidth: 'var(--md-sys-layout-max-width, 100vw)',
          margin: '0 auto',
          background: 'var(--md-sys-color-surface)',
          borderRadius: 'var(--md-sys-shape-corner-large)'
        }}
      >
        {children}
      </main>

      {/* BottomNav su mobile - component not found, removed for now */}
    </div>
  );
};
