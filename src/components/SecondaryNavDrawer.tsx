// MD3 Gold Compliant — nessun valore hardcoded, solo token MD3
// Drawer per la navigazione secondaria — @mui-migrated Fase 2C (V2 fix)
// MUI Drawer gestisce nativamente: ESC, focus trap, backdrop, animazione slide.

import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import { View } from '../types';
import { VIEW_LABELS } from './viewRegistry';

export interface SecondaryNavGroup {
  label: string;
  icon: string;
  items: { id: View; icon: string }[];
}

export const SECONDARY_NAV_GROUPS: SecondaryNavGroup[] = [
  {
    label: 'Strumenti Classe',
    icon: 'groups',
    items: [
      { id: 'studenti',                   icon: 'person' },
      { id: 'evaluations',                icon: 'grade' },
      { id: 'register',                   icon: 'menu_book' },
      { id: 'analytics',                  icon: 'bar_chart' },
      { id: 'class-competency-dashboard', icon: 'stacked_bar_chart' },
      { id: 'consiglio-di-classe',        icon: 'people' },
      { id: 'teacher-inbox',              icon: 'inbox' },
      { id: 'improvement-guide',          icon: 'trending_up' },
    ],
  },
  {
    label: 'Pianificazione',
    icon: 'edit_document',
    items: [
      { id: 'lessons',             icon: 'library_books' },
      { id: 'uda',                 icon: 'account_tree' },
      { id: 'rubriche',            icon: 'checklist' },
      { id: 'didattica-inclusiva', icon: 'accessibility' },
      { id: 'curriculum-manager',  icon: 'schema' },
      { id: 'competency-levels',   icon: 'leaderboard' },
    ],
  },
  {
    label: 'Risorse & AI',
    icon: 'auto_awesome',
    items: [
      { id: 'studio',         icon: 'science' },
      { id: 'knowledge-base', icon: 'database' },
      { id: 'reportistica',   icon: 'summarize' },
    ],
  },
  {
    label: 'Altre Sezioni',
    icon: 'more_horiz',
    items: [
      { id: 'orientamento', icon: 'explore' },
      { id: 'calendario',   icon: 'calendar_month' },
      { id: 'student-dashboard', icon: 'school' },
    ],
  },
];

interface SecondaryNavDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
  activeView: View;
  isDesktop: boolean;
}

const SecondaryNavDrawer: React.FC<SecondaryNavDrawerProps> = ({
  open,
  onClose,
  onNavigate,
  activeView,
  isDesktop,
}) => {
  const handleItemClick = (view: View) => {
    onNavigate(view);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor={isDesktop ? 'left' : 'bottom'}
      aria-label="Tutte le sezioni"
      slotProps={{
        backdrop: {
          sx: { bgcolor: 'var(--md-sys-color-scrim)' },
        },
        paper: {
          sx: isDesktop
            ? {
                top: 'var(--md-sys-spacing-16)',
                left: 'var(--md-sys-spacing-20)',
                bottom: 0,
                height: 'auto',
                width: 'calc(var(--md-sys-spacing-20) * 2)',
                bgcolor: 'var(--md-sys-color-surface-container-low)',
                borderRight: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                borderTop: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                overflowX: 'hidden',
                p: 'var(--md-sys-spacing-3) var(--md-sys-spacing-2)',
                boxShadow: 'var(--md-sys-elevation-level3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-2)',
              }
            : {
                left: 0,
                right: 0,
                bottom: 'var(--md-sys-bottom-nav-offset)',
                maxHeight: 'var(--md-sys-size-sheet-max-height)',
                bgcolor: 'var(--md-sys-color-surface-container-low)',
                borderTop: 'var(--md-sys-border-width-medium) solid var(--md-sys-color-outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) 0 0',
                overflowX: 'hidden',
                p: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                boxShadow: 'var(--md-sys-elevation-level4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-2)',
              },
        },
      }}
    >
      {/* Handle bar (mobile only) */}
      {!isDesktop && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 'var(--md-sys-spacing-1)' }}>
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              width: 'var(--md-sys-spacing-8)',
              height: 'var(--md-sys-spacing-1)',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              bgcolor: 'var(--md-sys-color-on-surface-variant)',
              opacity: 'var(--md-sys-state-opacity-empty)',
              display: 'block',
            }}
          />
        </Box>
      )}

      {/* Header (desktop) */}
      {isDesktop && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 'var(--md-sys-spacing-2)' }}>
          <Typography variant="subtitle2" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
            Tutte le sezioni
          </Typography>
          <IconButton
            aria-label="Chiudi menu"
            onClick={onClose}
            size="small"
            sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            <Box component="span" className="material-symbols-outlined" aria-hidden="true">close</Box>
          </IconButton>
        </Box>
      )}

      {SECONDARY_NAV_GROUPS.map((group) => (
        <Box component="section" key={group.label}>
          {/* Group header */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--md-sys-spacing-2)',
            px: 'var(--md-sys-spacing-2)',
            py: 'var(--md-sys-spacing-1)',
            mb: 'var(--md-sys-spacing-1)',
          }}>
            <Box
              component="span"
              className="material-symbols-outlined"
              aria-hidden="true"
              sx={{ fontSize: 'var(--md-sys-spacing-5)', color: 'var(--md-sys-color-primary)' }}
            >
              {group.icon}
            </Box>
            <Typography
              variant="caption"
              component="span"
              sx={{
                color: 'var(--md-sys-color-primary)',
                fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {group.label}
            </Typography>
          </Box>

          {/* Items */}
          <Box sx={{
            display: isDesktop ? 'flex' : 'grid',
            flexDirection: isDesktop ? 'column' : undefined,
            gridTemplateColumns: isDesktop ? undefined : 'repeat(3, 1fr)',
            gap: 'var(--md-sys-spacing-1)',
            mb: 'var(--md-sys-spacing-3)',
          }}>
            {group.items.map((item) => {
              const isActive = activeView === item.id;
              return (
                <ButtonBase
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  aria-label={VIEW_LABELS[item.id] ?? item.id}
                  aria-current={isActive ? 'page' : undefined}
                  sx={{
                    display: 'flex',
                    flexDirection: isDesktop ? 'row' : 'column',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-3)',
                    px: isDesktop ? 'var(--md-sys-spacing-3)' : 'var(--md-sys-spacing-1)',
                    py: isDesktop ? 'var(--md-sys-spacing-2)' : 'var(--md-sys-spacing-3)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    bgcolor: isActive
                      ? 'var(--md-sys-color-secondary-container)'
                      : 'transparent',
                    color: isActive
                      ? 'var(--md-sys-color-on-secondary-container)'
                      : 'var(--md-sys-color-on-surface-variant)',
                    transition: 'background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
                    width: '100%',
                    textAlign: isDesktop ? 'left' : 'center',
                    minHeight: 'var(--md-sys-spacing-11)',
                    '&:hover': {
                      bgcolor: isActive
                        ? 'color-mix(in srgb, var(--md-sys-color-secondary-container) 92%, var(--md-sys-color-on-secondary-container))'
                        : 'var(--md-sys-color-surface-container-high)',
                    },
                  }}
                >
                  <Box
                    component="span"
                    className="material-symbols-outlined"
                    aria-hidden="true"
                    sx={{
                      fontSize: 'var(--md-sys-spacing-6)',
                      fontVariationSettings: isActive
                        ? "'FILL' 1, 'wght' 400"
                        : "'FILL' 0, 'wght' 400",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{
                      color: 'inherit',
                      fontWeight: isActive
                        ? 'var(--md-sys-typescale-weight-semibold)'
                        : 'var(--md-sys-typescale-weight-medium)',
                      whiteSpace: isDesktop ? 'nowrap' : 'normal',
                      fontSize: isDesktop ? undefined : 'var(--md-sys-spacing-3)',
                      lineHeight: 1.2,
                    }}
                  >
                    {VIEW_LABELS[item.id] ?? item.id}
                  </Typography>
                </ButtonBase>
              );
            })}
          </Box>

          <Divider sx={{ mb: 'var(--md-sys-spacing-2)', borderColor: 'var(--md-sys-color-outline-variant)' }} />
        </Box>
      ))}
    </Drawer>
  );
};

export default SecondaryNavDrawer;
