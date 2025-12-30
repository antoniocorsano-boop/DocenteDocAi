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

const StyledCard = styled(Card)<{ color: string }>(
  ({ color }) => ({
    borderRadius: 24,
    background: color,
    boxShadow: 'var(--md-elevation-1)',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
    '&:hover': {
      boxShadow: 'var(--md-elevation-3)',
    },
    display: 'flex',
    flexDirection: 'column',
    minHeight: 180,
    position: 'relative',
    overflow: 'visible',
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
}) => (
  <StyledCard color={color} onClick={onClick} className={className}>
    <Box display="flex" alignItems="center" justifyContent="space-between" px={2} pt={2}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 1,
        }}
      >
        <Icon sx={{ color: '#333', fontSize: 32 }}>{icon}</Icon>
      </Box>
    </Box>
    <CardContent sx={{ flex: 1, pt: 1, pb: '16px !important' }}>
      <Typography variant="h6" color="text.primary" fontWeight={700} mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {description}
      </Typography>
      {children}
      {arrow && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Icon color="action" sx={{ opacity: 0.5, transition: 'transform 0.2s', '&:hover': { transform: 'translateX(4px)' } }}>
            arrow_forward
          </Icon>
        </Box>
      )}
    </CardContent>
  </StyledCard>
);

export default M3ExpressiveCard;
