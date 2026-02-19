// MD3 Gold Compliant
// Tooltip accessibile con aria-describedby
// Audit: febbraio 2026

import React, { useState, useRef, useId } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipId = useId();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionStyles = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-8px)',
      marginBottom: 'var(--md-sys-spacing-2)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(8px)',
      marginTop: 'var(--md-sys-spacing-2)'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(-8px)',
      marginRight: 'var(--md-sys-spacing-2)'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(8px)',
      marginLeft: 'var(--md-sys-spacing-2)'
    }
  };

  // Clone children e aggiungi props per accessibilità
  const childrenWithProps = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      setIsFocused(true);
      showTooltip();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      setIsFocused(false);
      hideTooltip();
      children.props.onBlur?.(e);
    },
    'aria-describedby': isVisible || isFocused ? tooltipId : undefined
  });

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {childrenWithProps}
      
      {(isVisible || isFocused) && (
        <div
          id={tooltipId}
          role="tooltip"
          style={{
            position: 'absolute',
            zIndex: 1000,
            padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
            background: 'var(--md-sys-color-inverse-surface)',
            color: 'var(--md-sys-color-inverse-on-surface)',
            borderRadius: 'var(--md-sys-spacing-1)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            maxWidth: 'var(--md-sys-spacing-16)',
            whiteSpace: 'normal',
            fontSize: 'var(--md-sys-typescale-body-small-size)',
            fontWeight: '500',
            lineHeight: '1.4',
            pointerEvents: 'none',
            animation: 'tooltip-fade-in 200ms ease-out',
            ...positionStyles[position]
          }}
        >
          {content}
          
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              ...(position === 'top' && {
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderWidth: '6px 6px 0 6px',
                borderColor: 'var(--md-sys-color-inverse-surface) transparent transparent transparent'
              }),
              ...(position === 'bottom' && {
                top: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderWidth: '0 6px 6px 6px',
                borderColor: 'transparent transparent var(--md-sys-color-inverse-surface) transparent'
              }),
              ...(position === 'left' && {
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderWidth: '6px 0 6px 6px',
                borderColor: 'transparent transparent transparent var(--md-sys-color-inverse-surface)'
              }),
              ...(position === 'right' && {
                left: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderWidth: '6px 6px 6px 0',
                borderColor: 'transparent var(--md-sys-color-inverse-surface) transparent transparent'
              })
            }}
          />
        </div>
      )}
      
      <style>{`
        @keyframes tooltip-fade-in {
          from {
            opacity: 0;
            transform: ${position === 'top' ? 'translateX(-50%) translateY(-4px)' :
                         position === 'bottom' ? 'translateX(-50%) translateY(4px)' :
                         position === 'left' ? 'translateY(-50%) translateX(-4px)' :
                         'translateY(-50%) translateX(4px)'};
          }
          to {
            opacity: 1;
            transform: ${position === 'top' ? 'translateX(-50%) translateY(-8px)' :
                         position === 'bottom' ? 'translateX(-50%) translateY(8px)' :
                         position === 'left' ? 'translateY(-50%) translateX(-8px)' :
                         'translateY(-50%) translateX(8px)'};
          }
        }
      `}</style>
    </div>
  );
};

export default Tooltip;
