// MD3 Gold Compliant
// BottomNav - MD3 Navigation Bar for mobile (compact breakpoint)
// Audit: febbraio 2026

import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const NAV_ITEMS = [
  { id: 'home' as View, label: 'Home', icon: 'home', activeIcon: 'home' },
  { id: 'timetable' as View, label: 'Orario', icon: 'schedule', activeIcon: 'watch_later' },
  { id: 'progettazione-hub' as View, label: 'Progetta', icon: 'design_services', activeIcon: 'edit_document' },
  { id: 'aula' as View, label: 'Classi', icon: 'groups', activeIcon: 'groups' },
  { id: 'calendario' as View, label: 'Agenda', icon: 'calendar_month', activeIcon: 'event_note' },
];

const ACTIVE_VIEWS: Partial<Record<View, View>> = {
  'knowledge-base': 'progettazione-hub',
  studio: 'progettazione-hub',
  lessons: 'progettazione-hub',
  uda: 'progettazione-hub',
  rubriche: 'progettazione-hub',
  reportistica: 'progettazione-hub',
  'didattica-inclusiva': 'progettazione-hub',
  'curriculum-manager': 'progettazione-hub',
  evaluations: 'aula',
  register: 'aula',
  studenti: 'aula',
  'improvement-guide': 'aula',
  'consiglio-di-classe': 'aula',
  'class-competency-dashboard': 'aula',
  analytics: 'aula',
  'teacher-inbox': 'aula',
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  const resolvedActive = (ACTIVE_VIEWS[activeView] as View) ?? activeView;

  return (
    <nav
      aria-label="Navigazione principale"
      style={{
        position: 'fixed',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: 'var(--md-sys-z-nav)',
        background: 'var(--md-sys-color-surface-container)',
        boxShadow: 'var(--md-sys-elevation-3)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingTop: 'var(--md-sys-spacing-2)',
        paddingBottom: 'calc(var(--md-sys-spacing-2) + env(safe-area-inset-bottom, 0px))',
        paddingInline: 'var(--md-sys-spacing-1)',
        borderTop: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
      }}
    >
      {NAV_ITEMS.map(item => {
        const isActive = resolvedActive === item.id;
        return (
          <button
            key={item.id}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
            style={{
              flex: '1',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-1)',
              padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-1)',
              borderRadius: 'var(--md-sys-radius-3)',
              cursor: 'pointer',
              minHeight: 'var(--md-sys-spacing-12)',
              transition: 'color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2,0,0,1))',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'var(--md-sys-spacing-14)',
                height: 'var(--md-sys-spacing-8)',
                borderRadius: 'var(--md-sys-radius-7)',
                background: isActive ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                transition: 'background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2,0,0,1))',
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
                  fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                  transition: 'color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2,0,0,1)), font-variation-settings var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2,0,0,1))',
                }}
              >
                {isActive ? item.activeIcon : item.icon}
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--md-sys-typescale-label-small-font-size, var(--md-sys-spacing-3))',
                fontWeight: isActive ? '600' : '400',
                letterSpacing: '0.5px',
                color: isActive
                  ? 'var(--md-sys-color-on-surface)'
                  : 'var(--md-sys-color-on-surface-variant)',
                transition: 'color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2,0,0,1))',
                lineHeight: '1',
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
