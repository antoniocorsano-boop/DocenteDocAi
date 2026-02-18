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
        background: 'var(--md-sys-color-surface-container)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: 'var(--md-sys-spacing-2) 0',
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
            borderRadius: 'var(--md-sys-spacing-3)',
            cursor: 'pointer',
            transition: 'all 200ms var(--md-sys-motion-easing-standard)',
            position: 'relative',
          }}
        >
          <span 
            aria-hidden="true" 
            style={{ 
              fontFamily: '"Material Symbols Outlined"',
              fontSize: '24px',
              color: isActive
                ? 'var(--md-sys-color-on-primary-container)'
                : 'var(--md-sys-color-on-surface-variant)',
              fontVariationSettings: isActive ? '"FILL" 1, "wght" 600' : '"FILL" 0, "wght" 400',
              transition: 'all 200ms'
            }}
          >
            {item.icon}
          </span>
          <span
            style={{
              fontFamily: 'var(--md-sys-typescale-label-small-font-family)',
              fontSize: '11px',
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
  );
};

export default BottomNav;
