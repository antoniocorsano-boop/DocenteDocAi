import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import { styled } from '@mui/material/styles';

interface M3ExpressiveCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
  arrow?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const colorTokens: Record<string, { bg: string; fg: string }> = {
  primary: {
    bg: 'var(--sys-primary-container, #eaddff)',
    fg: 'var(--sys-on-primary-container, #21005d)'
  },
  secondary: {
    bg: 'var(--sys-secondary-container, #e8def8)',
    fg: 'var(--sys-on-secondary-container, #1d192b)'
  },
  tertiary: {
    bg: 'var(--sys-tertiary-container, #ffd8e4)',
    fg: 'var(--sys-on-tertiary-container, #31111d)'
  },
  surface: {
    bg: 'var(--sys-surface-container-high, #f3edf7)',
    fg: 'var(--sys-on-surface, #1c1b1f)'
  },
  surfaceVariant: {
    bg: 'var(--sys-surface-container-low, #f7f2fa)',
    fg: 'var(--sys-on-surface-variant, #49454f)'
  }
};

const StyledCard = styled(Card)<{ $bg: string; $fg: string; $clickable: boolean }>(
  ({ $bg, $fg, $clickable }) => ({
    borderRadius: 28,
    background: $bg,
    color: $fg,
    boxShadow: 'var(--md-elevation-1)',
    cursor: $clickable ? 'pointer' : 'default',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    '&:hover': {
      boxShadow: $clickable ? 'var(--md-elevation-3)' : 'var(--md-elevation-1)',
      transform: $clickable ? 'translateY(-1px)' : 'none'
    },
    display: 'flex',
    flexDirection: 'column',
    minHeight: 180,
    position: 'relative',
    overflow: 'visible',
    border: '1px solid var(--sys-outline-variant, rgba(0,0,0,0.08))'
  })
);

const M3ExpressiveCard: React.FC<M3ExpressiveCardProps> = ({
  icon,
  title,
  description,
  color,
  onClick,
  arrow = true,
  className = '',
  children,
}) => {
  const palette = colorTokens[color] ?? { bg: color || 'var(--sys-surface, #fdf8ff)', fg: 'var(--sys-on-surface, #1c1b1f)' };
  const clickable = Boolean(onClick);

  return (
    <StyledCard $bg={palette.bg} $fg={palette.fg} $clickable={clickable} onClick={onClick} className={className}>
      <Box display="flex" alignItems="center" justifyContent="space-between" px={2} pt={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--md-elevation-1)',
          }}
        >
          <Icon sx={{ color: palette.fg, fontSize: 30 }}>{icon}</Icon>
        </Box>
      </Box>
      <CardContent sx={{ flex: 1, pt: 1, pb: '16px !important' }}>
        <Typography variant="h6" sx={{ color: palette.fg }} fontWeight={700} mb={0.5}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: palette.fg, opacity: 0.85 }} mb={2}>
          {description}
        </Typography>
        {children}
        {arrow && (
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Icon sx={{ color: palette.fg, opacity: 0.6, transition: 'transform 0.2s', '&:hover': { transform: 'translateX(4px)' } }}>
              arrow_forward
            </Icon>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default M3ExpressiveCard;
