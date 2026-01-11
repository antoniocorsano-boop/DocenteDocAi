import React from 'react';
import { useTheme } from '../theme/theme';
import M3Typography from './ui/M3Typography'; // Assume this exists or import from library

interface M3ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const M3Button: React.FC<M3ButtonProps> = ({ children, onClick, disabled }) => {
  const { theme } = useTheme();

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.onPrimary,
    padding: theme.spacing[4],
    borderRadius: 'var(--md-sys-shape-corner-medium)', // Assume shape var exists
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `background-color ${theme.motion.duration} ${theme.motion.easing}`,
    minHeight: '44px', // Touch target
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight,
    lineHeight: theme.typography.body1.lineHeight,
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : 'Button'}
    >
      <M3Typography variant="body-large">{children}</M3Typography>
    </button>
  );
};