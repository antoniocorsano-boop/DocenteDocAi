// MD3 Gold Compliant
// App Shell: height-constrained flex column for proper scroll containment
// Audit: marzo 2026
import React from 'react';
import Box from '@mui/material/Box';
import BottomNav from './BottomNav';
import SecondaryNavDrawer from './SecondaryNavDrawer';
import { Header } from './Header';
import { View, UserProfile, TimetableSettings, Notifica, BeforeInstallPromptEvent, NavigationParams } from '../types';
import { VIEW_LABELS } from './viewRegistry';
import '../design-system/app-layout-responsive.css';

interface AppLayoutProps {
  children: React.ReactNode;
  view: View;
  onNavigate: (view: View, context?: NavigationParams) => void;
  user: UserProfile | null;
  settings: TimetableSettings;
  notifiche: Notifica[];
  setNotifiche: (input: Notifica[] | ((prev: Notifica[]) => Notifica[])) => void;
  onBack: () => void;
  onOpenImageAnalysis: () => void;
  onOpenVideoAnalysis: () => void;
  onOpenHelp: () => void;
  onOpenCircularAnalysis: (url: string, title: string) => void;
  isAiProcessing: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  onInstallApp: () => void;
  onOpenOperations: () => void;
  hasSuggestion: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  view,
  onNavigate,
  user,
  settings,
  notifiche,
  setNotifiche,
  onBack,
  onOpenImageAnalysis,
  onOpenVideoAnalysis,
  onOpenHelp,
  onOpenCircularAnalysis,
  isAiProcessing,
  installPrompt,
  onInstallApp,
  onOpenOperations,
  hasSuggestion,
}) => {
  const [mainNavOpen, setMainNavOpen] = React.useState(false);

  // Chiudi il drawer al cambio di vista
  React.useEffect(() => {
    setMainNavOpen(false);
  }, [view]);

  // Aggiorna document.title al cambio di view (accessibilità + SEO)
  React.useEffect(() => {
    const label = VIEW_LABELS[view] ?? view;
    document.title = view === 'home' ? 'DocenteDoc AI' : `${label} — DocenteDoc AI`;
  }, [view]);

  return (
    // Outer shell: full viewport height, no overflow — contains everything
    <Box className="app-shell-container" sx={{
      display: 'flex',
      flexDirection: 'column',
      height: 'var(--md-sys-viewport-height-dvh)',
      overflow: 'hidden',
      bgcolor: 'var(--md-sys-color-surface)',
    }}>
      {/* Header: static in flow, never overlaps content */}
      <Header
        showBackButton={view !== 'home'}
        onBack={onBack}
        onOpenImageAnalysis={onOpenImageAnalysis}
        onOpenVideoAnalysis={onOpenVideoAnalysis}
        onOpenHelp={onOpenHelp}
        user={user}
        settings={settings}
        notifiche={notifiche}
        setNotifiche={setNotifiche}
        onOpenCircularAnalysis={onOpenCircularAnalysis}
        onNavigate={onNavigate}
        isAiProcessing={isAiProcessing}
        installPrompt={installPrompt}
        onInstallApp={onInstallApp}
        onOpenOperations={onOpenOperations}
        hasSuggestion={hasSuggestion}
        onOpenMore={() => setMainNavOpen(p => !p)}
        moreOpen={mainNavOpen}
        currentView={view}
      />

      {/* Body: main scrollable content, full width — no persistent sidebar */}
      <Box
        component="main"
        className="app-main-content"
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          bgcolor: 'var(--md-sys-color-surface)',
          pb: { xs: 'calc(var(--md-sys-spacing-14) + env(safe-area-inset-bottom, 0px))', lg: 0 },
          minWidth: 0,
        }}
      >
        {children}
      </Box>

      {/* BottomNav: icon-only, position:fixed, auto-hidden on desktop via CSS */}
      <BottomNav
        activeView={view}
        onNavigate={(v) => onNavigate(v)}
        onOpenMore={() => setMainNavOpen(p => !p)}
        moreOpen={mainNavOpen}
      />

      {/* Unified Nav Drawer — primary + all secondary sections */}
      <SecondaryNavDrawer
        open={mainNavOpen}
        onClose={() => setMainNavOpen(false)}
        onNavigate={(v) => onNavigate(v)}
        activeView={view}
      />
    </Box>
  );
};
