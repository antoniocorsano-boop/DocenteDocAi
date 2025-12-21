import React from 'react';
import { View } from '../types';

interface MenuProps {
  currentView: View;
  onNavigate: (view: View, context?: any) => void;
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
    <nav className="bottom-nav-bar">
      {mainMenuItems.map(item => {
        const active = isViewActive(item);
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id, null)}
            className={`nav-item ${active ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div className="nav-icon-container">
              <span className={`material-symbols-outlined ${active ? 'filled-icon' : ''}`} style={{ fontSize: '24px' }}>
                {active ? item.activeIcon : item.icon}
              </span>
            </div>
            <span className="m3-label-small font-black uppercase tracking-[0.2em] mt-1.5" style={{ fontSize: '8px' }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  );
};

export default Menu;
