// MD3 Gold Compliant
// NavigationRail - Vertical sidebar navigation for tablet and desktop
// Rendered only on non-mobile via AppLayout (no JS breakpoint check needed)
// Audit: febbraio 2026
import React from 'react';
import { View } from '../types';
import { M3Typography } from './ui';

export interface NavigationRailItem {
  id: View;
  label: string;
  icon: string;
  activeIcon: string;
  badge?: number;
}

export interface NavigationRailProps {
  items: NavigationRailItem[];
  activeView: View;
  onNavigate: (view: View, context?: unknown) => void;
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

const NavigationRail: React.FC<NavigationRailProps> = ({ items, activeView, onNavigate }) => {
  return (
    <>
      <style>{`
        @keyframes badge-appear {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        [data-nav-rail-item]:focus-visible {
          outline: var(--md-sys-spacing-1) solid var(--md-sys-color-primary);
          outline-offset: var(--md-sys-spacing-1);
        }
      `}</style>
      <nav
        role="navigation"
        aria-label="Navigazione principale"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 'var(--md-sys-percent-100)',
          height: 'var(--md-sys-percent-100)',
          paddingBlock: 'var(--app-spacing-container)',
          gap: 'var(--md-sys-spacing-1)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {items.map((item) => {
          const isActive = isItemActive(item, activeView);

          return (
            <button
              key={item.id}
              data-nav-rail-item=""
              onClick={() => onNavigate(item.id, null)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--md-sys-spacing-1)',
                width: 'var(--md-sys-percent-100)',
                minHeight: 'var(--md-sys-spacing-14)',
                padding: `var(--app-spacing-component) 0`,
                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                color: isActive
                  ? 'var(--md-sys-color-on-secondary-container)'
                  : 'var(--md-sys-color-on-surface-variant)',
                transition: `background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard), color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'var(--md-sys-spacing-14)',
                  height: 'var(--md-sys-spacing-8)',
                  borderRadius: 'var(--md-sys-shape-corner-full)',
                  background: isActive
                    ? 'var(--md-sys-color-secondary-container)'
                    : 'transparent',
                  transition: `background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                  style={{
                    fontSize: 'var(--md-sys-spacing-6)',
                    lineHeight: 1,
                    color: 'inherit',
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24"
                      : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    transition: `font-variation-settings var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
                  }}
                >
                  {isActive ? item.activeIcon : item.icon}
                </span>

                {item.badge && item.badge > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: `calc(-1 * var(--md-sys-spacing-1))`,
                      right: `calc(-1 * var(--md-sys-spacing-1))`,
                      minWidth: 'var(--md-sys-spacing-4)',
                      height: 'var(--md-sys-spacing-4)',
                      padding: `0 var(--md-sys-spacing-1)`,
                      backgroundColor: 'var(--md-sys-color-error)',
                      color: 'var(--md-sys-color-on-error)',
                      borderRadius: 'var(--md-sys-shape-corner-full)',
                      fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                      fontWeight: 700,
                      lineHeight: 'var(--md-sys-spacing-4)',
                      textAlign: 'center',
                      zIndex: 'var(--md-sys-z-raised)',
                      animation: `badge-appear var(--app-motion-standard) var(--app-easing-standard)`,
                    }}
                    aria-label={`${item.badge} notifiche`}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </span>

              <M3Typography
                variant="label-small"
                style={{
                  fontWeight: isActive ? 700 : 400,
                  textAlign: 'center',
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 'var(--md-sys-spacing-16)',
                  transition: `color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
                }}
              >
                {item.label}
              </M3Typography>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default NavigationRail;
