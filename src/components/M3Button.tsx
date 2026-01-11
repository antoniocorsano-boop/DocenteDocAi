
import React from 'react';
import { useTheme } from '../theme/theme';

interface M3ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const M3Button: React.FC<M3ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick
}) => {
  const theme = useTheme();

  // Responsive padding basato su breakpoint
  const getPadding = () => {
    if (window.innerWidth < parseInt(theme.breakpoints.mobile)) return theme.spacing['3']; // mobile
    if (window.innerWidth < parseInt(theme.breakpoints.tablet)) return theme.spacing['4']; // tablet
    return theme.spacing['5']; // desktop+
  };

  // Responsive font size
  const getFontSize = () => {
    if (size === 'small') return theme.typography.caption.fontSize;
    if (size === 'large') return theme.typography.heading2.fontSize;
    return theme.typography.body1.fontSize;
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.colors[variant] || theme.colors.primary,
    color: theme.colors[`on${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof theme.colors] || theme.colors.onPrimary,
    fontSize: getFontSize(),
    lineHeight: size === 'small' ? theme.typography.caption.lineHeight : theme.typography.body1.lineHeight,
    fontWeight: theme.typography.body1.fontWeight,
    padding: getPadding(),
    margin: theme.spacing['2'],
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: `all ${theme.motion.duration.short2} ${theme.motion.easing.standard}`,
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
  };

  const handleHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = `0 4px 8px ${theme.colors.shadow}`;
  };

  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = `0 2px 4px ${theme.colors.shadow}`;
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
};