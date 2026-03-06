// MD3 Gold Compliant
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
import M3Typography from './M3Typography';

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
  
  /** Custom className */
  className?: string;
  
  /** Custom z-index for the menu */
  zIndex?: number;
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
  minWidth = 'var(--md-sys-layout-menu-min-width)',
  maxWidth = 'var(--md-sys-layout-menu-max-width)',
  className: _className,
  zIndex,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      showBackdrop={false}
      zIndex={zIndex}
    >
      <div role="menu"
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
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-3)',
                width: 'var(--md-sys-percent-100)',
                minHeight: 'var(--md-sys-spacing-12)',  // 48dp — MD3 list item spec
                padding: 'var(--md-sys-spacing-0) var(--md-sys-spacing-4)',
                border: 'none',
                borderRadius: 'var(--md-sys-shape-corner-none)',
                textAlign: 'left',
                opacity: item.disabled ? 'var(--md-sys-state-opacity-disabled)' : undefined,
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                backgroundColor: focusedIndex === index ? 'var(--md-sys-color-surface-container-high)' : 'transparent',
                color: item.variant === 'error' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface)'
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
                    flexShrink: 0}}
                >
                  {item.icon}
                </span>
              )}
              <M3Typography variant="body-large" as="span" style={{ flexGrow: 1 }}>
                {item.label}
              </M3Typography>
            </button>
            
            {item.divider && (
              <div
                role="separator"
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

