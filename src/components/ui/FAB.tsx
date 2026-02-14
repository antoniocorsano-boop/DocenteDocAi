// MD3 Gold Compliant
// Floating Action Button ottimizzato per mobile
// Audit: febbraio 2026

import React, { useState } from 'react';

interface FABProps {
  icon: string;
  label?: string;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  extended?: boolean; // Show label alongside icon
  disabled?: boolean;
}

export const FAB: React.FC<FABProps> = ({
  icon,
  label,
  onClick,
  size = 'medium',
  position = 'bottom-right',
  extended = false,
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Size mapping
  const sizeMap = {
    small: {
      width: 'var(--md-sys-spacing-10)',
      height: 'var(--md-sys-spacing-10)',
      iconSize: '20px'
    },
    medium: {
      width: 'var(--md-sys-spacing-14)',
      height: 'var(--md-sys-spacing-14)',
      iconSize: '24px'
    },
    large: {
      width: 'var(--md-sys-spacing-16)',
      height: 'var(--md-sys-spacing-16)',
      iconSize: '28px'
    }
  }[size];

  // Position mapping
  const positionStyles = {
    'bottom-right': {
      bottom: 'var(--md-sys-spacing-4)',
      right: 'var(--md-sys-spacing-4)'
    },
    'bottom-center': {
      bottom: 'var(--md-sys-spacing-4)',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    'bottom-left': {
      bottom: 'var(--md-sys-spacing-4)',
      left: 'var(--md-sys-spacing-4)'
    }
  }[position];

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
      aria-label={label || 'Azione principale'}
      style={{
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: extended ? 'var(--md-sys-spacing-2)' : '0',
        width: extended ? 'auto' : sizeMap.width,
        height: sizeMap.height,
        padding: extended ? '0 var(--md-sys-spacing-4)' : '0',
        minWidth: extended ? 'var(--md-sys-spacing-14)' : sizeMap.width,
        backgroundColor: disabled 
          ? 'var(--md-sys-color-surface-variant)' 
          : 'var(--md-sys-color-primary-container)',
        color: disabled 
          ? 'var(--md-sys-color-on-surface-variant)' 
          : 'var(--md-sys-color-on-primary-container)',
        border: 'none',
        borderRadius: extended ? 'var(--md-sys-spacing-4)' : 'var(--md-sys-spacing-4)',
        boxShadow: disabled 
          ? 'none' 
          : isPressed 
            ? '0 2px 8px rgba(0,0,0,0.2)' 
            : '0 4px 12px rgba(0,0,0,0.25)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPressed && !disabled 
          ? `${positionStyles.transform || ''} scale(0.95)` 
          : `${positionStyles.transform || ''} scale(1)`,
        opacity: disabled ? 0.5 : 1,
        zIndex: 1000,
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...positionStyles
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: sizeMap.iconSize,
          fontVariationSettings: '"FILL" 1, "wght" 600'
        }}
      >
        {icon}
      </span>
      
      {extended && label && (
        <span
          style={{
            fontWeight: '600',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
};

// FAB with multiple actions (Speed Dial)
interface FABAction {
  icon: string;
  label: string;
  onClick: () => void;
}

interface FABSpeedDialProps {
  mainIcon: string;
  actions: FABAction[];
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export const FABSpeedDial: React.FC<FABSpeedDialProps> = ({
  mainIcon,
  actions,
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleActionClick = (action: FABAction) => {
    action.onClick();
    setIsOpen(false);
  };

  const positionStyles = {
    'bottom-right': {
      bottom: 'var(--md-sys-spacing-4)',
      right: 'var(--md-sys-spacing-4)'
    },
    'bottom-center': {
      bottom: 'var(--md-sys-spacing-4)',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    'bottom-left': {
      bottom: 'var(--md-sys-spacing-4)',
      left: 'var(--md-sys-spacing-4)'
    }
  }[position];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            animation: 'fade-in 200ms ease-out'
          }}
        />
      )}

      {/* Actions */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--md-sys-spacing-3)',
            zIndex: 1000,
            ...positionStyles,
            bottom: `calc(${positionStyles.bottom} + var(--md-sys-spacing-14) + var(--md-sys-spacing-2))`
          }}
        >
          {actions.map((action, index) => (
            <div
              key={index}
              onClick={() => handleActionClick(action)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-3)',
                animation: `slide-up 250ms ease-out ${index * 50}ms both`,
                cursor: 'pointer'
              }}
            >
              {/* Label */}
              <div
                style={{
                  padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  color: 'var(--md-sys-color-on-surface)',
                  borderRadius: 'var(--md-sys-spacing-1)',
                  fontSize: '14px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                {action.label}
              </div>

              {/* Mini FAB */}
              <div
                style={{
                  width: 'var(--md-sys-spacing-10)',
                  height: 'var(--md-sys-spacing-10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--md-sys-color-secondary-container)',
                  color: 'var(--md-sys-color-on-secondary-container)',
                  borderRadius: 'var(--md-sys-spacing-3)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '20px',
                    fontVariationSettings: '"FILL" 1, "wght" 600'
                  }}
                >
                  {action.icon}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <FAB
        icon={isOpen ? 'close' : mainIcon}
        onClick={() => setIsOpen(!isOpen)}
        position={position}
      />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default FAB;
