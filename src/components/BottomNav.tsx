// MD3 Gold Compliant
// Mobile bottom navigation bar per MD3 spec
// Rendered only on mobile via AppLayout — no media query hiding needed
// Audit: febbraio 2026
import React from 'react';
import { View } from '../types';
import { NavigationRailItem } from './NavigationRail';

interface BottomNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
  items: NavigationRailItem[];
}

const isItemActive = (item: NavigationRailItem, currentView: View): boolean => {
  const parentMap: Partial<Record<View, View[]>> = {
    'progettazione-hub': [
      'knowledge-base', 'studio', 'lessons', 'uda', 'rubriche',
      'reportistica', 'didattica-inclusiva', 'curriculum-manager'
    ],
    'aula': [
      'evaluations', 'register', 'studenti', 'improvement-guide',
      'consiglio-di-classe', 'class-competency-dashboard', 'analytics', 'teacher-inbox'
    ],
  };
  return currentView === item.id || (parentMap[item.id]?.includes(currentView) ?? false);
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate, items }) => {
  return (
    <nav
      aria-label="Navigazione principale"
      role="navigation"
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
        alignItems: 'stretch',
        paddingTop: 'var(--md-sys-spacing-1)',
        paddingBottom: 'calc(var(--md-sys-spacing-1) + env(safe-area-inset-bottom))',
        borderTop: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
      }}
    >
      {items.map((item) => {
        const isActive = isItemActive(item, activeView);
        return (
          <button
            key={item.id}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
            style={{
              flex: 'var(--md-sys-flex-auto)',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--md-sys-spacing-1)',
              minHeight: 'var(--md-sys-spacing-14)',
              padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-1)',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'var(--md-sys-spacing-16)',
                height: 'var(--md-sys-spacing-8)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                background: isActive ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                transition: `background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
              }}
            >
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{
                  fontSize: 'var(--md-sys-spacing-6)',
                  color: isActive
                    ? 'var(--md-sys-color-on-secondary-container)'
                    : 'var(--md-sys-color-on-surface-variant)',
                  fontVariationSettings: isActive
                    ? '"FILL" 1, "wght" 600'
                    : '"FILL" 0, "wght" 400',
                  transition: `color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard), font-variation-settings var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
                }}
              >
                {isActive ? item.activeIcon : item.icon}
              </span>
            </span>
            <span
              style={{
                fontFamily: 'var(--md-sys-typescale-label-small-font-family)',
                fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                fontWeight: isActive ? 700 : 400,
                color: isActive
                  ? 'var(--md-sys-color-on-surface)'
                  : 'var(--md-sys-color-on-surface-variant)',
                letterSpacing: '0.5px',
                lineHeight: 1,
                transition: `color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
