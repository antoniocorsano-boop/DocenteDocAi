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
              background: active ? 'rgba(25, 118, 210, 0.10)' : 'rgba(255,255,255,0.10)',
              color: active ? 'var(--sys-primary)' : 'var(--sys-on-surface-variant)',
              borderRadius: 'var(--shape-m)',
              outline: 'none',
              transition: 'background 0.2s, color 0.2s',
              padding: '0.5rem 0.7rem',
              minWidth: '56px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: active ? '0 2px 8px rgba(25,118,210,0.10)' : 'none',
              backdropFilter: active ? 'blur(2px)' : undefined,
            }}
            onFocus={e => e.currentTarget.style.background = 'rgba(25, 118, 210, 0.18)'}
            onBlur={e => e.currentTarget.style.background = active ? 'rgba(25, 118, 210, 0.10)' : 'rgba(255,255,255,0.10)'}
          >
            <div
              className="nav-icon-container"
              style={{
                marginBottom: '0.15rem',
                background: active ? 'var(--sys-primary-container, #e3f2fd)' : 'transparent',
                borderRadius: '50%',
                padding: '0.6rem', // aumentato per area touch
                boxShadow: active ? 'var(--elevation-1, 0 2px 8px rgba(25,118,210,0.10))' : 'none',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none', // lascia il click al button
              }}
            >
              <span
                className={`material-symbols-outlined ${active ? 'filled-icon' : ''}`}
                style={{ fontSize: '28px', color: active ? 'var(--sys-primary)' : 'var(--sys-on-surface-variant)', pointerEvents: 'none' }}
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
