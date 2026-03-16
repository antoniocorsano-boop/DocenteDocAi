// MD3 GOLD COMPLIANT — UnifiedNavDrawer: menu principale + tutte le sezioni
// Drawer laterale sinistro, stile Google Drive — si apre sempre da logo/header

import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
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
      { id: 'teacher-dashboard', icon: 'space_dashboard' },
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
}

// Primary nav items shown at the top of the drawer
const PRIMARY_NAV_ITEMS: { id: View; icon: string }[] = [
  { id: 'home',              icon: 'home' },
  { id: 'timetable',         icon: 'schedule' },
  { id: 'progettazione-hub', icon: 'design_services' },
  { id: 'aula',              icon: 'groups' },
  { id: 'orientamento',      icon: 'explore' },
  { id: 'calendario',        icon: 'calendar_month' },
];

// Unified nav item — always row layout (icon + label)
const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <ButtonBase
    onClick={onClick}
    aria-label={label}
    aria-current={isActive ? 'page' : undefined}
    focusRipple
    sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 'var(--md-sys-spacing-3)',
      px: 'var(--md-sys-spacing-3)',
      py: 'var(--md-sys-spacing-2)',
      borderRadius: 'var(--md-sys-shape-corner-large)',
      bgcolor: isActive ? 'var(--md-sys-color-secondary-container)' : 'transparent',
      color: isActive ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
      transition: 'background-color 0.15s',
      width: '100%',
      textAlign: 'left',
      '&:hover': { bgcolor: isActive ? 'var(--md-sys-color-secondary-container)' : 'var(--md-sys-color-surface-container-high)' },
      '&:focus-visible': { outline: '2px solid var(--md-sys-color-primary)', outlineOffset: 2 },
    }}
  >
    <Box
      component="span"
      className="material-symbols-outlined"
      aria-hidden="true"
      sx={{
        fontSize: 20,
        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
        color: 'inherit',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="labelLarge"
      component="span"
      sx={{
        color: 'inherit',
        fontWeight: isActive
          ? 'var(--md-sys-typescale-weight-semibold)'
          : 'var(--md-sys-typescale-weight-regular)',
      }}
    >
      {label}
    </Typography>
  </ButtonBase>
);

const SecondaryNavDrawer: React.FC<SecondaryNavDrawerProps> = ({
  open,
  onClose,
  onNavigate,
  activeView,
}) => {
  const handleItemClick = (view: View) => {
    onNavigate(view);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      aria-label="Navigazione principale"
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.32)' },
        },
        paper: {
          sx: {
            width: 300,
            maxWidth: '85vw',
            bgcolor: 'var(--md-sys-color-surface-container)',
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* ── Branding header ──────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 'var(--md-sys-spacing-4)',
          py: 'var(--md-sys-spacing-4)',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
          <Box
            component="span"
            className="material-symbols-outlined"
            aria-hidden="true"
            sx={{ fontSize: 28, color: 'var(--md-sys-color-primary)', fontVariationSettings: '"FILL" 1' }}
          >
            psychology
          </Box>
          <Typography variant="titleMedium" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
            DocenteDoc <Box component="strong" sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>AI</Box>
          </Typography>
        </Box>
        <IconButton
          aria-label="Chiudi menu"
          onClick={onClose}
          size="small"
          sx={{
            color: 'var(--md-sys-color-on-surface-variant)',
            '&:hover': { bgcolor: 'var(--md-sys-color-surface-container-high)' },
          }}
        >
          <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 20 }}>close</Box>
        </IconButton>
      </Box>

      <Divider />

      {/* ── Navigazione principale ──────────────────────────────── */}
      <Box
        component="section"
        aria-label="Navigazione principale"
        sx={{ px: 'var(--md-sys-spacing-3)', pt: 'var(--md-sys-spacing-3)', pb: 'var(--md-sys-spacing-2)' }}
      >
        <Typography
          variant="overline"
          sx={{
            color: 'var(--md-sys-color-primary)',
            px: 'var(--md-sys-spacing-2)',
            display: 'block',
            mb: 'var(--md-sys-spacing-1)',
            letterSpacing: '0.08em',
            fontWeight: 'var(--md-sys-typescale-weight-semibold)',
          }}
        >
          Principale
        </Typography>
        {PRIMARY_NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={VIEW_LABELS[item.id] ?? item.id}
            isActive={activeView === item.id}
            onClick={() => handleItemClick(item.id)}
          />
        ))}
      </Box>

      <Divider />

      {/* ── Gruppi di navigazione ────────────────────────────────── */}
      {SECONDARY_NAV_GROUPS.map((group) => (
        <Box
          component="section"
          key={group.label}
          aria-label={group.label}
          sx={{ px: 'var(--md-sys-spacing-3)', pt: 'var(--md-sys-spacing-3)', pb: 'var(--md-sys-spacing-1)' }}
        >
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)',
            px: 'var(--md-sys-spacing-2)',
            mb: 'var(--md-sys-spacing-1)',
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-1)' }}>
            {group.items.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={VIEW_LABELS[item.id] ?? item.id}
                isActive={activeView === item.id}
                onClick={() => handleItemClick(item.id)}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Drawer>
  );
};

export default SecondaryNavDrawer;
