import React from 'react';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

interface M3IconButtonProps {
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';
  size?: 'small' | 'medium' | 'large';
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title?: string;
  className?: string;
  disabled?: boolean;
  edge?: 'start' | 'end' | false;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 12,
  background: 'var(--md-sys-color-surface-container-high, #f7f2fa)',
  color: 'var(--md-sys-color-on-surface, #1c1b1f)',
  boxShadow: theme.shadows[1],
  transition: 'background 0.2s, box-shadow 0.2s',
  '&:hover': {
    background: 'var(--md-sys-color-surface-container-highest, #ece6f0)',
    boxShadow: theme.shadows[4],
  },
  '&:active': {
    boxShadow: theme.shadows[8],
  },
  padding: 8,
}));

const M3IconButton: React.FC<M3IconButtonProps> = ({
  icon,
  color = 'primary',
  size = 'medium',
  onClick,
  title,
  className = '',
  disabled = false,
  edge = false,
}) => (
  <StyledIconButton
    color={color}
    size={size}
    onClick={onClick}
    title={title}
    className={className}
    disabled={disabled}
    edge={edge}
  >
    {icon}
  </StyledIconButton>
);

export default M3IconButton;
