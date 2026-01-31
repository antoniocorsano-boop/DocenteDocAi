/* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */

import React from 'react';
import { M3Button } from './ui';

interface NavigationProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
  fullWidth?: boolean;
  label?: string;
  onClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView = 'home',
  onNavigate,
  fullWidth = false
}) => {
  const navItems = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'register', label: 'Registro', icon: 'menu_book' },
    { key: 'students', label: 'Studenti', icon: 'school' },
    { key: 'settings', label: 'Impostazioni', icon: 'settings' }
  ];

  return (
    <nav
      style={{
        width: fullWidth ? '100%' : 'var(--md-sys-spacing-20)',
        padding: 'var(--md-sys-spacing-4)',
        backgroundColor: 'var(--md-sys-color-surface-container)',
        borderRight: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-2)'
      }}
    >
      {navItems.map(item => (
        <M3Button
          key={item.key}
          variant={activeView === item.key ? 'filled' : 'text'}
          onClick={() => onNavigate?.(item.key)}
          style={{ justifyContent: 'flex-start' }}
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={{ marginRight: 'var(--md-sys-spacing-2)' }}>
            {item.icon}
          </span>
          {item.label}
        </M3Button>
      ))}
    </nav>
  );
};

// SNAPSHOT_PLACEHOLDER: Navigation component visual regression baseline
// TODO: Add Playwright snapshot test and link to [CHECKLIST.md](http://_vscodecontentref_/CHECKLIST.md) phase 3
