/* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */

import React, { useState, useEffect, useCallback } from 'react';
import { M3Button } from './ui';

interface NavigationItem {
  key: string;
  label: string;
  icon: string;
  badge?: number;
  disabled?: boolean;
}

interface NavigationProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
  fullWidth?: boolean;
  label?: string;
  onClick?: () => void;
  items?: NavigationItem[];
  orientation?: 'vertical' | 'horizontal';
  showLabels?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView = 'home',
  onNavigate,
  fullWidth = false,
  items = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'register', label: 'Registro', icon: 'menu_book' },
    { key: 'students', label: 'Studenti', icon: 'school' },
    { key: 'settings', label: 'Impostazioni', icon: 'settings' }
  ],
  orientation = 'vertical',
  showLabels = true
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  const handleNavigate = useCallback((key: string) => {
    if (onNavigate) {
      onNavigate(key);
    }
  }, [onNavigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    const enabledItems = items.filter(item => !item.disabled);
    const currentIndex = enabledItems.findIndex(item => item.key === items[index].key);

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight': {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % enabledItems.length;
        setFocusedIndex(items.findIndex(item => item.key === enabledItems[nextIndex].key));
        break;
      }
      case 'ArrowUp':
      case 'ArrowLeft': {
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? enabledItems.length - 1 : currentIndex - 1;
        setFocusedIndex(items.findIndex(item => item.key === enabledItems[prevIndex].key));
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (!items[index].disabled) {
          handleNavigate(items[index].key);
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        setFocusedIndex(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      }
    }
  }, [items, handleNavigate]);

  const handleFocus = useCallback(() => {
    setIsKeyboardNav(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsKeyboardNav(false);
    setFocusedIndex(-1);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsKeyboardNav(false);
  }, []);

  useEffect(() => {
    // Reset focus when active view changes
    setFocusedIndex(-1);
  }, [activeView]);

  const containerStyles: React.CSSProperties = {
    width: fullWidth ? '100%' : orientation === 'vertical' ? 'var(--md-sys-spacing-20)' : 'auto',
    padding: 'var(--md-sys-spacing-4)',
    backgroundColor: 'var(--md-sys-color-surface-container)',
    borderRight: orientation === 'vertical' ? 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' : 'none',
    borderBottom: orientation === 'horizontal' ? 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' : 'none',
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    gap: 'var(--md-sys-spacing-2)',
    role: 'navigation',
    'aria-label': 'Navigazione principale'
  };

  return (
    <nav style={containerStyles}>
      {items.map((item, index) => {
        const isActive = activeView === item.key;
        const isFocused = focusedIndex === index && isKeyboardNav;

        return (
          <M3Button
            key={item.key}
            variant={isActive ? 'filled' : 'text'}
            onClick={() => !item.disabled && handleNavigate(item.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            disabled={item.disabled}
            style={{
              justifyContent: orientation === 'vertical' ? 'flex-start' : 'center',
              position: 'relative',
              width: orientation === 'horizontal' ? 'auto' : '100%',
              minWidth: orientation === 'horizontal' ? 'var(--md-sys-spacing-12)' : 'auto',
              outline: isFocused ? 'var(--md-sys-border-width-thin) solid var(--md-sys-color-focus)' : 'none',
              outlineOffset: 'var(--md-sys-spacing-1)'
            }}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`${item.label}${item.badge ? ` (${item.badge} elementi)` : ''}`}
          >
            <span
              className="material-symbols-outlined"
              aria-hidden="true"
              style={{
                marginRight: showLabels && orientation === 'vertical' ? 'var(--md-sys-spacing-2)' : '0',
                fontSize: 'var(--md-sys-typescale-label-large-size)'
              }}
            >
              {item.icon}
            </span>
            {showLabels && (
              <span style={{ flex: 1, textAlign: orientation === 'vertical' ? 'left' : 'center' }}>
                {item.label}
              </span>
            )}
            {item.badge && item.badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 'var(--md-sys-spacing-1)',
                  right: 'var(--md-sys-spacing-1)',
                  backgroundColor: 'var(--md-sys-color-error)',
                  color: 'var(--md-sys-color-on-error)',
                  borderRadius: 'var(--md-sys-shape-corner-full)',
                  padding: '0 var(--md-sys-spacing-1)',
                  fontSize: 'var(--md-sys-typescale-label-small-size)',
                  fontWeight: 'var(--md-sys-typescale-label-small-weight)',
                  minWidth: 'var(--md-sys-spacing-3)',
                  height: 'var(--md-sys-spacing-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1
                }}
                aria-label={`${item.badge} notifiche`}
              >
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </M3Button>
        );
      })}
    </nav>
  );
};

// SNAPSHOT_PLACEHOLDER: Navigation component visual regression baseline
// TODO: Add Playwright snapshot test and link to [CHECKLIST.md](http://_vscodecontentref_/CHECKLIST.md) phase 3

// SNAPSHOT_PLACEHOLDER: Navigation component visual regression baseline
// TODO: Add Playwright snapshot test and link to [CHECKLIST.md](http://_vscodecontentref_/CHECKLIST.md) phase 3
