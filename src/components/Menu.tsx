import React from 'react';
import { View } from '../types';

interface MenuProps {
  currentView: View;
  onNavigate: (view: View, context?: unknown) => void;
}

interface MenuItemDef {
  id: View;
  label: string;
  icon: string;
  activeIcon: string;
}

const mainMenuItems: MenuItemDef[] = [
  { id: 'home', label: 'Home', icon: 'home', activeIcon: 'home' },
  { id: 'timetable', label: 'Orario', icon: 'schedule', activeIcon: 'watch_later' },
  { id: 'progettazione-hub', label: 'Progetta', icon: 'design_services', activeIcon: 'edit_document' },
  { id: 'aula', label: 'Classi', icon: 'groups', activeIcon: 'groups' },
  { id: 'calendario', label: 'Agenda', icon: 'calendar_month', activeIcon: 'event_note' },
];

const Menu: React.FC<MenuProps> = ({ currentView, onNavigate }) => {

  const isViewActive = (item: MenuItemDef) => {
    const parentMap: Partial<Record<View, View[]>> = {
      'progettazione-hub': ['knowledge-base', 'studio', 'lessons', 'uda', 'rubriche', 'reportistica', 'didattica-inclusiva', 'curriculum-manager'],
      'aula': ['evaluations', 'register', 'studenti', 'improvement-guide', 'consiglio-di-classe', 'class-competency-dashboard', 'analytics', 'teacher-inbox'],
    };
    return currentView === item.id || (parentMap[item.id]?.includes(currentView));
  }

  return (
    <nav
      className="bottom-nav-bar m3-navigation-drawer"
      style={{
        background: 'var(--sys-surface-tint)',
        boxShadow: 'var(--depth-shadow-2)',
        borderRadius: 'var(--shape-l)',
        fontFamily: 'var(--font-variable)',
        fontVariationSettings: 'var(--font-variation-settings)',
        WebkitFontSmoothing: 'var(--typography-font-smoothing)',
        fontFeatureSettings: 'var(--typography-font-feature-settings)',
        zIndex: 'var(--z-nav)',
        padding: 'var(--spacing-2) var(--spacing-4)',
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      aria-label="Navigazione principale"
      role="navigation"
    >
      {mainMenuItems.map(item => {
        const active = isViewActive(item);
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id, null)}
            className={`nav-item ${active ? 'active' : ''}`}
            aria-label={item.label}
            tabIndex={0}
            style={{
              background: active ? 'var(--state-layer-pressed)' : 'var(--state-layer-hover)',
              color: active ? 'var(--sys-primary)' : 'var(--sys-on-surface-variant)',
              boxShadow: active ? 'var(--depth-shadow-1)' : 'none',
              borderRadius: 'var(--shape-m)',
              outline: 'none',
              transition: 'background 0.2s, color 0.2s',
              padding: 'var(--spacing-2) var(--spacing-1)',
              minWidth: '56px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onFocus={e => e.currentTarget.style.background = 'var(--state-layer-focus)'}
            onBlur={e => e.currentTarget.style.background = active ? 'var(--state-layer-pressed)' : 'var(--state-layer-hover)'}
          >
            <div className="nav-icon-container" style={{ marginBottom: 'var(--spacing-1)' }}>
              <span
                className={`material-symbols-outlined ${active ? 'filled-icon' : ''}`}
                style={{ fontSize: '24px', color: active ? 'var(--sys-primary)' : 'var(--sys-on-surface-variant)' }}
                aria-hidden="true"
              >
                {active ? item.activeIcon : item.icon}
              </span>
            </div>
            <span
              className="m3-label-small font-black uppercase tracking-[0.2em]"
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-variable)',
                fontVariationSettings: 'var(--font-variation-settings)',
                color: active ? 'var(--sys-primary)' : 'var(--sys-on-surface-variant)',
                letterSpacing: '0.12em',
                marginTop: '2px',
              }}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  );
};

export default Menu;
