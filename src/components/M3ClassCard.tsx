import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface M3ClassCardProps {
  className: string;
  studentCount: number;
  classAverage: string | number;
  accentColor: string;
  dynamicBg: string;
  insufficientCount?: number;
  onClick?: () => void;
}

const StyledCard = styled(Card)<{ accentcolor: string; dynamicbg: string }>(
  ({ accentcolor, dynamicbg, theme }) => ({
    borderRadius: 20,
    borderLeft: `6px solid ${accentcolor}`,
    background: dynamicbg,
    boxShadow: theme.shadows[2],
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
    display: 'flex',
    flexDirection: 'column',
    minHeight: 180,
    position: 'relative',
    overflow: 'visible',
  })
);

const M3ClassCard: React.FC<M3ClassCardProps> = ({
  className,
  studentCount,
  classAverage,
  accentColor,
  dynamicBg,
  insufficientCount,
  onClick,
}) => (
  <StyledCard accentcolor={accentColor} dynamicbg={dynamicBg} onClick={onClick}>
    <Box display="flex" alignItems="center" justifyContent="space-between" px={2} pt={2}>
      <Typography variant="h6" color="text.primary" fontWeight={700}>
        {className}
      </Typography>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 1,
        }}
      >
        <span className="material-symbols-outlined" style={{ color: accentColor, fontSize: 32 }}>
          groups
        </span>
      </Box>
    </Box>
    <CardContent sx={{ flex: 1, pt: 1, pb: '16px !important' }}>
      {insufficientCount && insufficientCount > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'error.main',
            color: 'error.contrastText',
            borderRadius: '50%',
            px: 1.2,
            py: 0.5,
            fontWeight: 700,
            fontSize: 13,
            zIndex: 2,
            minWidth: 24,
            textAlign: 'center',
          }}
          title={`${insufficientCount} studenti con media insufficiente`}
        >
          {insufficientCount}
        </Box>
      )}
      <Box mt={2} mb={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography variant="body2" color="text.secondary">
            Studenti
          </Typography>
          <Typography variant="body2" color="text.primary" fontWeight={600}>
            {studentCount}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Media Classe
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            color={
              typeof classAverage === 'number' && classAverage < 6
                ? 'error.main'
                : 'text.primary'
            }
          >
            {classAverage}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <span className="material-symbols-outlined" style={{ opacity: 0.5, fontSize: 28, transition: 'transform 0.2s', verticalAlign: 'middle' }}>
          arrow_forward
        </span>
      </Box>
    </CardContent>
  </StyledCard>
);

export default M3ClassCard;
