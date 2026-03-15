// MD3 GOLD COMPLIANT — SecondaryNavDrawer: menu "Altro" riprogettato
// Bottom sheet mobile / lateral drawer desktop
// Backdrop: rgba semi-trasparente (NON il token scrim che è opaco)

import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
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
          // rgba perché il token --md-sys-color-scrim è opaco al 100% → schermo nero
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.32)' },
        },
        paper: {
          sx: isDesktop
            ? {
                top: 'var(--md-sys-spacing-16)',
                left: 'var(--md-sys-spacing-20)',
                bottom: 0,
                height: 'auto',
                width: '280px',
                bgcolor: 'var(--md-sys-color-surface-container)',
                borderRight: '1px solid var(--md-sys-color-outline-variant)',
                borderTop: '1px solid var(--md-sys-color-outline-variant)',
                overflowY: 'auto',
                overflowX: 'hidden',
                p: 'var(--md-sys-spacing-4) var(--md-sys-spacing-3)',
                boxShadow: 'var(--md-sys-elevation-level2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-1)',
              }
            : {
                left: 0,
                right: 0,
                bottom: 'var(--md-sys-bottom-nav-offset)',
                maxHeight: '80dvh',
                bgcolor: 'var(--md-sys-color-surface-container)',
                borderRadius: 'var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) 0 0',
                overflowY: 'auto',
                overflowX: 'hidden',
                p: '0 var(--md-sys-spacing-4) var(--md-sys-spacing-6)',
                boxShadow: 'var(--md-sys-elevation-level3)',
              },
        },
      }}
    >
      {/* ── Handle bar (mobile) ──────────────────────────────────────── */}
      {!isDesktop && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 'var(--md-sys-spacing-3)', pb: 'var(--md-sys-spacing-1)', flexShrink: 0 }}>
          <Box component="span" aria-hidden="true" sx={{
            width: 32, height: 4,
            borderRadius: 'var(--md-sys-shape-corner-full)',
            bgcolor: 'var(--md-sys-color-on-surface-variant)',
            opacity: 0.4,
            display: 'block',
          }} />
        </Box>
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: isDesktop ? 'var(--md-sys-spacing-2)' : 0,
        py: 'var(--md-sys-spacing-3)',
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
          <Box component="span" className="material-symbols-outlined" aria-hidden="true"
            sx={{ fontSize: 20, color: 'var(--md-sys-color-primary)' }}>apps</Box>
          <Typography variant="titleMedium" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
            Tutte le sezioni
          </Typography>
        </Box>
        <IconButton
          aria-label="Chiudi menu"
          onClick={onClose}
          size="small"
          sx={{ color: 'var(--md-sys-color-on-surface-variant)', '&:hover': { bgcolor: 'var(--md-sys-color-surface-container-high)' } }}
        >
          <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 20 }}>close</Box>
        </IconButton>
      </Box>

      {/* ── Gruppi di navigazione ────────────────────────────────────── */}
      {SECONDARY_NAV_GROUPS.map((group) => (
        <Box component="section" key={group.label} sx={{ mb: 'var(--md-sys-spacing-4)' }}>
          {/* Intestazione sezione */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)',
            px: isDesktop ? 'var(--md-sys-spacing-2)' : 0,
            mb: 'var(--md-sys-spacing-2)',
          }}>
            <Box component="span" className="material-symbols-outlined" aria-hidden="true"
              sx={{ fontSize: 16, color: 'var(--md-sys-color-primary)' }}>
              {group.icon}
            </Box>
            <Typography variant="overline" sx={{
              color: 'var(--md-sys-color-primary)',
              letterSpacing: '0.08em',
              fontWeight: 'var(--md-sys-typescale-weight-semibold)',
            }}>
              {group.label}
            </Typography>
          </Box>

          {/* Item grid/lista */}
          <Box sx={{
            display: isDesktop ? 'flex' : 'grid',
            flexDirection: isDesktop ? 'column' : undefined,
            gridTemplateColumns: isDesktop ? undefined : 'repeat(4, 1fr)',
            gap: 'var(--md-sys-spacing-1)',
          }}>
            {group.items.map((item) => {
              const isActive = activeView === item.id;
              return (
                <ButtonBase
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  aria-label={VIEW_LABELS[item.id] ?? item.id}
                  aria-current={isActive ? 'page' : undefined}
                  focusRipple
                  sx={{
                    display: 'flex',
                    flexDirection: isDesktop ? 'row' : 'column',
                    alignItems: 'center',
                    justifyContent: isDesktop ? 'flex-start' : 'center',
                    gap: isDesktop ? 'var(--md-sys-spacing-3)' : 'var(--md-sys-spacing-1)',
                    px: isDesktop ? 'var(--md-sys-spacing-3)' : 'var(--md-sys-spacing-1)',
                    py: isDesktop ? 'var(--md-sys-spacing-2)' : 'var(--md-sys-spacing-3)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    bgcolor: isActive ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                    color: isActive ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
                    transition: 'background-color 0.15s',
                    width: '100%',
                    textAlign: isDesktop ? 'left' : 'center',
                    '&:hover': { bgcolor: isActive ? 'var(--md-sys-color-secondary-container)' : 'var(--md-sys-color-surface-container-high)' },
                    '&:focus-visible': { outline: '2px solid var(--md-sys-color-primary)', outlineOffset: 2 },
                  }}
                >
                  {/* Icona con sfondo pill when active (mobile) */}
                  {isDesktop ? (
                    <Box component="span" className="material-symbols-outlined" aria-hidden="true"
                      sx={{
                        fontSize: 20,
                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                        color: 'inherit', flexShrink: 0,
                      }}>
                      {item.icon}
                    </Box>
                  ) : (
                    <Box sx={{
                      width: 36, height: 36,
                      borderRadius: 'var(--md-sys-shape-corner-large)',
                      bgcolor: isActive ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-surface-container-high)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Box component="span" className="material-symbols-outlined" aria-hidden="true"
                        sx={{
                          fontSize: 18,
                          fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                          color: isActive ? 'var(--md-sys-color-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
                        }}>
                        {item.icon}
                      </Box>
                    </Box>
                  )}
                  <Typography
                    variant="labelSmall"
                    component="span"
                    sx={{
                      color: 'inherit',
                      fontWeight: isActive ? 'var(--md-sys-typescale-weight-semibold)' : 'var(--md-sys-typescale-weight-regular)',
                      lineHeight: 1.2,
                      fontSize: isDesktop ? '0.8125rem' : '0.625rem',
                      whiteSpace: isDesktop ? 'nowrap' : 'normal',
                      wordBreak: isDesktop ? undefined : 'break-word',
                    }}
                  >
                    {VIEW_LABELS[item.id] ?? item.id}
                  </Typography>
                </ButtonBase>
              );
            })}
          </Box>
        </Box>
      ))}
    </Drawer>
  );
};

export default SecondaryNavDrawer;
