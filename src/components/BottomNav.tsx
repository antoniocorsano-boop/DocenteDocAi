import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

// Example items, should match NavigationRail for consistency
const navItems = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'lessons', label: 'Lezioni', icon: 'menu_book' },
  { id: 'students', label: 'Studenti', icon: 'group' },
  { id: 'profile', label: 'Profilo', icon: 'person' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          .bottom-nav-container {
            display: none !important;
          }
        }
      `}</style>
      <nav
        aria-label="Navigazione principale mobile"
        style={{
          position: 'fixed',
          left: 'var(--md-sys-spacing-0)',
          right: 'var(--md-sys-spacing-0)',
          bottom: 'var(--md-sys-spacing-0)',
          zIndex: 'var(--md-sys-z-nav)',
          background: 'var(--md-sys-color-surface-container)',
          boxShadow: 'var(--md-sys-elevation-3)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-0)',
          paddingBottom: 'calc(var(--md-sys-spacing-2) + env(safe-area-inset-bottom))',
        }}
      >
      {navItems.map(item => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate(item.id as View)}
            style={{
              background: isActive
                ? 'var(--md-sys-color-primary-container)'
                : 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-1)',
              minWidth: 'var(--md-sys-spacing-10)',
              minHeight: 'var(--md-sys-spacing-8)',
              padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
              borderRadius: 'var(--md-sys-radius-3)',
              cursor: 'pointer',
              transition: 'color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard), background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
              position: 'relative',
            }}
          >
            <span
              className="material-symbols-outlined"
              aria-hidden="true"
              style={{
                fontSize: 'var(--md-sys-spacing-6)',
                color: isActive
                  ? 'var(--md-sys-color-on-primary-container)'
                  : 'var(--md-sys-color-on-surface-variant)',
                fontVariationSettings: isActive ? '"FILL" 1, "wght" 600' : '"FILL" 0, "wght" 400',
                transition: 'color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)'
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontFamily: 'var(--md-sys-typescale-label-small-font-family)',
                fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                fontWeight: isActive ? '600' : '400',
                letterSpacing: '0.5px',
                color: isActive
                  ? 'var(--md-sys-color-on-primary-container)'
                  : 'var(--md-sys-color-on-surface-variant)',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
    </>
  );
};

export default BottomNav;
