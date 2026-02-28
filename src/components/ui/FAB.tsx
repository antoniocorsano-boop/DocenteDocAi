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
  extended?: boolean;
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

  const sizeMap = {
    small: {
      width: 'var(--md-sys-spacing-10)',
      height: 'var(--md-sys-spacing-10)',
      iconSize: 'var(--md-sys-spacing-5)'
    },
    medium: {
      width: 'var(--md-sys-spacing-14)',
      height: 'var(--md-sys-spacing-14)',
      iconSize: 'var(--md-sys-spacing-6)'
    },
    large: {
      width: 'var(--md-sys-spacing-16)',
      height: 'var(--md-sys-spacing-16)',
      iconSize: 'var(--md-sys-spacing-7)'
    }
  }[size];

  const positionStyles = {
    'bottom-right': {
      bottom: 'var(--md-sys-spacing-4)',
      right: 'var(--md-sys-spacing-4)'
    },
    'bottom-center': {
      bottom: 'var(--md-sys-spacing-4)',
      left: 'var(--md-sys-percent-50)',
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
        borderRadius: 'var(--md-sys-spacing-4)',
        boxShadow: disabled
          ? 'none'
          : isPressed
            ? 'var(--md-sys-elevation-2)'
            : 'var(--md-sys-elevation-3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: `transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard), box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard), opacity var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)`,
        transform: isPressed && !disabled
          ? `${positionStyles.transform || ''} scale(0.95)`
          : `${positionStyles.transform || ''} scale(1)`,
        opacity: disabled ? 0.5 : 1,
        zIndex: 'var(--md-sys-z-modal)',
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
            fontSize: 'var(--md-sys-spacing-3_5)',
            whiteSpace: 'nowrap'
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
};

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
      left: 'var(--md-sys-percent-50)',
      transform: 'translateX(-50%)'
    },
    'bottom-left': {
      bottom: 'var(--md-sys-spacing-4)',
      left: 'var(--md-sys-spacing-4)'
    }
  }[position];

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--md-sys-color-scrim)',
            zIndex: 'var(--md-sys-z-snackbar)',
            animation: `fade-in var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-decelerated)`
          }}
        />
      )}

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--md-sys-spacing-3)',
            zIndex: 'var(--md-sys-z-modal)',
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
                animation: `slide-up var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-decelerated) ${index * 50}ms both`,
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  color: 'var(--md-sys-color-on-surface)',
                  borderRadius: 'var(--md-sys-spacing-1)',
                  fontSize: 'var(--md-sys-spacing-3_5)',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  boxShadow: 'var(--md-sys-elevation-2)'
                }}
              >
                {action.label}
              </div>

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
                  boxShadow: 'var(--md-sys-elevation-2)'
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 'var(--md-sys-spacing-5)',
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
            transform: translateY(var(--md-sys-spacing-5));
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
