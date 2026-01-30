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
    <nav
      aria-label="Navigazione principale mobile"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 'var(--md-sys-z-nav)',
        background: 'var(--app-color-surface)',
        borderTop: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: 'var(--app-spacing-component) 0',
      }}
    >
      {navItems.map(item => (
        <button
          key={item.id}
          aria-label={item.label}
          aria-current={activeView === item.id ? 'page' : undefined}
          onClick={() => onNavigate(item.id as View)}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: activeView === item.id ? 'var(--app-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
            fontFamily: 'var(--md-sys-typescale-label-medium-font-family)',
            fontSize: 'var(--app-text-label)',
            padding: 'var(--md-sys-spacing-1) var(--app-spacing-component)',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            outline: 'none',
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--app-text-title)' }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
