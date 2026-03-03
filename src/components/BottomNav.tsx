// MD3 Expressive — Bottom Navigation Bar
// Active indicator: animated pill (scale + opacity) using spring expressive tokens.
// MD3 spec: pill 64×32dp, corner-full, secondary-container color.
import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

// Mirror NavigationRail items — max 5 for MD3 bottom nav
const navItems: { id: View; label: string; icon: string; activeIcon: string }[] = [
  { id: 'home',              label: 'Home',      icon: 'home',            activeIcon: 'home' },
  { id: 'timetable',         label: 'Orario',    icon: 'schedule',        activeIcon: 'watch_later' },
  { id: 'progettazione-hub', label: 'Progetta',  icon: 'design_services', activeIcon: 'edit_document' },
  { id: 'aula',              label: 'Classi',    icon: 'groups',          activeIcon: 'groups' },
  { id: 'calendario',        label: 'Agenda',    icon: 'calendar_month',  activeIcon: 'event_note' },
];

// Spring tokens for pill expansion — fast spatial for snappy feel
const SPRING_SPATIAL =
  'var(--md-sys-motion-spring-expressive-fast-spatial-duration, 350ms) ' +
  'var(--md-sys-motion-spring-expressive-fast-spatial, cubic-bezier(0.42, 1.67, 0.21, 0.90))';

const SPRING_EFFECTS =
  'var(--md-sys-motion-spring-expressive-fast-effects-duration, 150ms) ' +
  'var(--md-sys-motion-spring-expressive-fast-effects, cubic-bezier(0.31, 0.94, 0.34, 1.00))';

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  return (
    <>
      <style>{`
        /* 1024px = var(--md-sys-breakpoint-desktop) — CSS custom properties cannot be used in @media queries */
        @media (min-width: 1024px) {
          .bottom-nav-container { display: none !important; }
        }
        /* Remove default button focus outline — replaced by MD3 state layer */
        .bottom-nav-item:focus-visible .bottom-nav-pill {
          outline: var(--md-sys-border-width-medium) solid var(--md-sys-color-primary);
          outline-offset: var(--md-sys-spacing-0-5);
        }
      `}</style>
      <nav
        className="bottom-nav-container"
        aria-label="Navigazione principale"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 'var(--md-sys-z-nav)',
          background: 'var(--md-sys-color-surface-container)',
          boxShadow: 'var(--md-sys-elevation-level2)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          padding: 'var(--md-sys-spacing-2) 0',
          paddingBottom: 'calc(var(--md-sys-spacing-2) + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {navItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              className="bottom-nav-item"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-1)',
                flex: 1,
                minHeight: 'var(--md-sys-spacing-16)', // 64px touch target
                padding: 'var(--md-sys-spacing-2) 0',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                outline: 'none',
              }}
            >
              {/* Icon wrapper — pill lives here */}
              <span
                className="bottom-nav-pill"
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // MD3 spec pill area: 64×32dp
                  width: 'var(--md-sys-spacing-16)',  // 64px
                  height: 'var(--md-sys-spacing-8)',  // 32px
                }}
              >
                {/* Animated pill indicator */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'var(--md-sys-shape-corner-full)',
                    backgroundColor: 'var(--md-sys-color-secondary-container)',
                    transform: isActive ? 'scaleX(1) scaleY(1)' : 'scaleX(0) scaleY(0)',
                    opacity: isActive ? 1 : 0,
                    transition: [
                      `transform ${SPRING_SPATIAL}`,
                      `opacity ${SPRING_EFFECTS}`,
                    ].join(', '),
                    transformOrigin: 'center',
                  }}
                />
                {/* Icon — sits on top of pill via z-index */}
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                  style={{
                    position: 'relative',
                    zIndex: 'var(--md-sys-z-content)',
                    fontSize: 'var(--md-sys-spacing-6)', // 24px
                    color: isActive
                      ? 'var(--md-sys-color-on-secondary-container)'
                      : 'var(--md-sys-color-on-surface-variant)',
                    fontVariationSettings: isActive
                      ? '"FILL" 1, "wght" 600'
                      : '"FILL" 0, "wght" 400',
                    transition: [
                      `color ${SPRING_EFFECTS}`,
                      `font-variation-settings ${SPRING_EFFECTS}`,
                    ].join(', '),
                  }}
                >
                  {isActive ? item.activeIcon : item.icon}
                </span>
              </span>

              {/* Label */}
              <span
                style={{
                  fontFamily: 'var(--md-sys-typescale-label-small-font-family)',
                  fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                  fontWeight: isActive ? '700' : '400',
                  letterSpacing: 'var(--md-sys-typescale-label-small-tracking, 0.5px)',
                  color: isActive
                    ? 'var(--md-sys-color-on-surface)'
                    : 'var(--md-sys-color-on-surface-variant)',
                  transition: `color ${SPRING_EFFECTS}, font-weight ${SPRING_EFFECTS}`,
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
