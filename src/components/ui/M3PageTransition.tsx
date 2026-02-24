/**
 * M3PageTransition.tsx
 * Material Design 3 Page Transition component
 * https://m3.material.io/styles/motion/transitions/transition-patterns
 */

import React, { useState, useEffect } from 'react';

type TransitionType =
  | 'fade'
  | 'fade-through'
  | 'shared-axis-x'
  | 'shared-axis-y'
  | 'shared-axis-z'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right';

interface M3PageTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  transition?: TransitionType;
  duration?: 'short' | 'medium' | 'long';
  onExited?: () => void;
  style?: React.CSSProperties;
}

const M3PageTransition: React.FC<M3PageTransitionProps> = ({
  children,
  isActive,
  transition = 'fade-through',
  duration = 'medium',
  onExited,
  style = {},
}) => {
  const [state, setState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>(
    isActive ? 'entered' : 'exited'
  );

  const getDuration = () => {
    switch (duration) {
      case 'short':
        return 'var(--md-sys-motion-duration-short-4)';
      case 'medium':
        return 'var(--md-sys-motion-duration-medium-4)';
      case 'long':
        return 'var(--md-sys-motion-duration-long-4)';
      default:
        return 'var(--md-sys-motion-duration-medium-4)';
    }
  };

  const getEasing = () => {
    switch (transition) {
      case 'fade-through':
        return 'var(--md-sys-motion-easing-emphasized)';
      case 'shared-axis-x':
      case 'shared-axis-y':
      case 'shared-axis-z':
        return 'var(--md-sys-motion-easing-emphasized-decelerate)';
      default:
        return 'var(--md-sys-motion-easing-standard)';
    }
  };

  const getTransitionStyles = (): React.CSSProperties => {
    const baseTransition = `${getDuration()} ${getEasing()}`;

    switch (state) {
      case 'entering':
      case 'entered':
        switch (transition) {
          case 'fade':
            return {
              opacity: 1,
              transition: `opacity ${baseTransition}`,
            };
          case 'fade-through':
            return {
              opacity: 1,
              transform: 'scale(1)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'shared-axis-x':
            return {
              opacity: 1,
              transform: 'translateX(0)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'shared-axis-y':
            return {
              opacity: 1,
              transform: 'translateY(0)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'shared-axis-z':
            return {
              opacity: 1,
              transform: 'scale(1)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'slide-up':
            return {
              opacity: 1,
              transform: 'translateY(0)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'slide-down':
            return {
              opacity: 1,
              transform: 'translateY(0)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'slide-left':
            return {
              opacity: 1,
              transform: 'translateX(0)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'slide-right':
            return {
              opacity: 1,
              transform: 'translateX(0)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          default:
            return { opacity: 1 };
        }

      case 'exiting':
      case 'exited':
        switch (transition) {
          case 'fade':
            return {
              opacity: 0,
              transition: `opacity ${baseTransition}`,
            };
          case 'fade-through':
            return {
              opacity: 0,
              transform: 'scale(0.95)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'shared-axis-x':
            return {
              opacity: 0,
              transform: 'translateX(-30px)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'shared-axis-y':
            return {
              opacity: 0,
              transform: 'translateY(-30px)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'shared-axis-z':
            return {
              opacity: 0,
              transform: 'scale(0.8)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'slide-up':
            return {
              opacity: 0,
              transform: 'translateY(20px)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'slide-down':
            return {
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'slide-left':
            return {
              opacity: 0,
              transform: 'translateX(20px)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          case 'slide-right':
            return {
              opacity: 0,
              transform: 'translateX(-20px)',
              transition: `opacity ${baseTransition}, transform ${baseTransition}`,
            };
          default:
            return { opacity: 0 };
        }

      default:
        return {};
    }
  };

  useEffect(() => {
    if (isActive) {
      if (state === 'exited') {
        setState('entering');
        const timer = setTimeout(() => {
          setState('entered');
        }, 50);
        return () => clearTimeout(timer);
      }
    } else {
      if (state === 'entered' || state === 'entering') {
        setState('exiting');
        const timer = setTimeout(() => {
          setState('exited');
          onExited?.();
        }, 300); // Match transition duration
        return () => clearTimeout(timer);
      }
    }
  }, [isActive, state, onExited]);

  if (state === 'exited' && !isActive) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        ...getTransitionStyles(),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default M3PageTransition;
