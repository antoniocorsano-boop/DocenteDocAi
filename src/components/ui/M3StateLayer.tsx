// MD3 Expressive — State Layer
// Implements the MD3 interaction state overlay: hover, focus-visible, pressed.
// This is the primary visual cue for interactivity in Material Design 3 apps
// (Google Photos, Gmail, Maps all rely on this pattern).
//
// MD3 opacity spec (on-surface color by default):
//   hover    → 0.08
//   focus    → 0.12
//   pressed  → 0.16
//   disabled → 0 (no overlay)
//
// Transition uses --md-sys-motion-spring-expressive-fast-effects tokens.

import React, { useCallback, useRef, useState } from 'react';

type AllowedTag = 'div' | 'button' | 'a' | 'li' | 'article' | 'span';

export interface M3StateLayerProps {
  children: React.ReactNode;
  /** Render as this element. Default: 'div'. Use 'button' for interactive elements. */
  as?: AllowedTag;
  /** MD3 color token for the state overlay. Default: var(--md-sys-color-on-surface) */
  stateColor?: string;
  /** Disables all state layer effects. */
  disabled?: boolean;
  /** Outer container style (applied to the wrapper element, not the overlay). */
  style?: React.CSSProperties;
  /** Outer container role */
  role?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  tabIndex?: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLElement>;
}

/** MD3 state layer opacity values. */
const OPACITY = {
  idle:    0,
  hover:   0.08,
  focus:   0.12,
  pressed: 0.16,
} as const;

const SPRING_FAST_EFFECTS = `
  var(--md-sys-motion-spring-expressive-fast-effects-duration, 150ms)
  var(--md-sys-motion-spring-expressive-fast-effects, cubic-bezier(0.31, 0.94, 0.34, 1.00))
`.trim().replace(/\n\s+/g, ' ');

/**
 * M3StateLayer — wraps any content with an MD3-compliant interaction overlay.
 *
 * @example
 * // Interactive card with state layer
 * <M3StateLayer as="div" role="button" tabIndex={0} onClick={handleClick}
 *   style={{ borderRadius: 'var(--md-sys-shape-corner-medium)', cursor: 'pointer' }}>
 *   <M3Typography>Click me</M3Typography>
 * </M3StateLayer>
 *
 * @example
 * // Custom color state layer (e.g. on a primary-container surface)
 * <M3StateLayer stateColor="var(--md-sys-color-on-primary-container)" style={...}>
 *   {children}
 * </M3StateLayer>
 */
export const M3StateLayer: React.FC<M3StateLayerProps> = ({
  children,
  as: Component = 'div',
  stateColor = 'var(--md-sys-color-on-surface)',
  disabled = false,
  style,
  onClick,
  onKeyDown,
  onKeyUp,
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine the overlay opacity following MD3 priority: pressed > focus > hover > idle
  const overlayOpacity = disabled
    ? OPACITY.idle
    : pressed
    ? OPACITY.pressed
    : focused
    ? OPACITY.focus
    : hovered
    ? OPACITY.hover
    : OPACITY.idle;

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => { setHovered(false); setPressed(false); }, []);
  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => { setFocused(false); setPressed(false); }, []);

  const handleMouseDown = useCallback(() => {
    if (disabled) return;
    setPressed(true);
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setPressed(false);
    // Brief "lingering" press visual — release after spring duration
    pressTimer.current = setTimeout(() => setPressed(false), 150);
  }, []);

  // Touch support
  const handleTouchStart = useCallback(() => {
    if (disabled) return;
    setPressed(true);
  }, [disabled]);

  const handleTouchEnd = useCallback(() => {
    setPressed(false);
  }, []);

  React.useEffect(() => {
    return () => { if (pressTimer.current) clearTimeout(pressTimer.current); };
  }, []);

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    outline: 'none',
    ...style,
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundColor: stateColor,
    opacity: overlayOpacity,
    pointerEvents: 'none',
    transition: `opacity ${SPRING_FAST_EFFECTS}`,
  };

  return (
    <Component
      style={wrapperStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={disabled ? undefined : onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {children}
      <span aria-hidden="true" style={overlayStyle} />
    </Component>
  );
};

export default M3StateLayer;
