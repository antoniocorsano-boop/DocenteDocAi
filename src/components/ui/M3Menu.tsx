// MD3 Compliant - Updated for layered theme access
/**
 * M3Menu - Material Design 3 Menu Component
 * 
 * Lightweight, M3-native menu replacement for MUI Menu.
 * A specialized version of M3Popover optimized for menu items.
 * Supports:
 * - Menu items with icons, labels, and actions
 * - Dividers between groups
 * - Disabled items
 * - Keyboard navigation (arrow up/down, Enter to select)
 * - Automatic focus management
 */

import React, { useEffect, useRef, useState } from 'react';
import M3Popover from './M3Popover';

// ============================================================================
// TYPES
// ============================================================================

export interface M3MenuItemConfig {
  /** Unique key for menu item */
  key: string;
  
  /** Label text */
  label: React.ReactNode;
  
  /** Optional icon (React component or HTML string) */
  icon?: React.ReactNode;
  
  /** Called when item is clicked */
  onClick: () => void;
  
  /** Disable this item */
  disabled?: boolean;
  
  /** Color variant: 'default' | 'error' */
  variant?: 'default' | 'error';
  
  /** Optional divider after this item */
  divider?: boolean;
}

export interface M3MenuProps {
  /** Whether menu is open */
  open: boolean;
  
  /** HTML element to anchor menu to */
  anchorEl: HTMLElement | null;
  
  /** Called when menu should close */
  onClose: () => void;
  
  /** Menu items configuration */
  items: M3MenuItemConfig[];
  
  /** Optional menu title */
  title?: React.ReactNode;
  
  /** Min width of menu */
  minWidth?: number | string;
  
  /** Max width of menu */
  maxWidth?: number | string;
  
  /** Z-index */
  zIndex?: number;
  
  /** Custom className */
  className?: string;
}

// ============================================================================
// M3MENU COMPONENT
// ============================================================================

export const M3Menu: React.FC<M3MenuProps> = ({
  open,
  anchorEl,
  onClose,
  items,
  title,
  minWidth = 200,
  maxWidth = 320,
  zIndex = 1300,
  className,
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Reset focus when menu opens
  useEffect(() => {
    if (open) {
      setFocusedIndex(-1);
      // Focus first enabled item
      setTimeout(() => {
        const firstEnabledIndex = items.findIndex(item => !item.disabled);
        if (firstEnabledIndex >= 0) {
          setFocusedIndex(firstEnabledIndex);
          itemRefs.current[firstEnabledIndex]?.focus();
        }
      }, 100);
    }
  }, [open, items]);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        let nextIndex = focusedIndex + 1;
        while (nextIndex < items.length && items[nextIndex].disabled) {
          nextIndex++;
        }
        if (nextIndex < items.length) {
          setFocusedIndex(nextIndex);
          itemRefs.current[nextIndex]?.focus();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        let prevIndex = focusedIndex - 1;
        while (prevIndex >= 0 && items[prevIndex].disabled) {
          prevIndex--;
        }
        if (prevIndex >= 0) {
          setFocusedIndex(prevIndex);
          itemRefs.current[prevIndex]?.focus();
        }
      } else if (event.key === 'Enter' && focusedIndex >= 0) {
        event.preventDefault();
        handleItemClick(focusedIndex);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, focusedIndex, items]);
  
  const handleItemClick = (index: number) => {
    const item = items[index];
    if (!item.disabled) {
      item.onClick();
      onClose();
    }
  };
  
  return (
    <M3Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      title={title}
      minWidth={minWidth}
      maxWidth={maxWidth}
      zIndex={zIndex}
      showBackdrop={false}
    >
      <div role="menu"
        // eslint-disable-next-line design-system/no-classname
        className={`m3-menu ${className || ''}`.trim()}
        style={{ outline: 'none' }}>
        {items.map((item, index) => (
          <React.Fragment key={item.key}>
            <button
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              role="menuitem"
              onClick={handleItemClick.bind(null, index)}
              disabled={item.disabled}
              // eslint-disable-next-line design-system/no-classname
              className={item.variant === 'error' ? 'm3-menu-item--error' : undefined}
              style={{
                opacity: item.disabled ? 'var(--md-sys-state-opacity-disabled)' : '1',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                backgroundColor: focusedIndex === index ? 'var(--md-sys-color-surface-container-high)' : 'transparent',
                color: item.variant === 'error' ? 'var(--md-sys-color-error)' : 'inherit'
              }}
              onMouseEnter={() => !item.disabled && setFocusedIndex(index)}
              onMouseLeave={() => setFocusedIndex(-1)}
              aria-disabled={item.disabled}
            >
              {item.icon && (
                <span
                  style={{display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                    fontFamily: 'var(--md-sys-typescale-body-medium-font)',
                    lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
                    flexShrink: 0}}
                >
                  {item.icon}
                </span>
              )}
              <span
                style={{flexGrow: 1,
                  fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                  fontFamily: 'var(--md-sys-typescale-body-medium-font)'}}
              >
                {item.label}
              </span>
            </button>
            
            {item.divider && (
              <div
                role="separator"
                // eslint-disable-next-line design-system/no-classname
                className="m3-menu__divider"
                style={{
                  height: 'var(--md-sys-spacing-1)',
                  backgroundColor: 'var(--md-sys-color-outline-variant)',
                  margin: 'var(--md-sys-spacing-1) 0'
                }}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </M3Popover>
  );
};

export default M3Menu;








