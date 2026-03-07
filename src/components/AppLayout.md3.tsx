// MD3 Gold Compliant
// App Shell: height-constrained flex column for proper scroll containment
// Audit: marzo 2026
import React from 'react';
import { Box } from '@mui/material';
import NavigationRail from './NavigationRail';
import BottomNav from './BottomNav';
import SecondaryNavDrawer from './SecondaryNavDrawer';
import { Header } from './Header';
import { View, UserProfile, TimetableSettings, Notifica, BeforeInstallPromptEvent, NavigationParams } from '../types';
import { VIEW_LABELS } from './viewRegistry';

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
  onOpenNKA?: () => void;
}

const NAV_ITEMS = [
  { id: 'home' as View,               label: 'Home',       icon: 'home',            activeIcon: 'home' },
  { id: 'timetable' as View,          label: 'Orario',     icon: 'schedule',        activeIcon: 'watch_later' },
  { id: 'progettazione-hub' as View,  label: 'Progetta',   icon: 'design_services', activeIcon: 'edit_document' },
  { id: 'aula' as View,               label: 'Classi',     icon: 'groups',          activeIcon: 'groups' },
  { id: 'orientamento' as View,       label: 'Orientamento', icon: 'explore',       activeIcon: 'explore' },
  { id: 'calendario' as View,         label: 'Agenda',     icon: 'calendar_month',  activeIcon: 'event_note' },
];

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
  onOpenNKA
}) => {
  // Usa matchMedia per reagire al breakpoint senza polling resize
  const [isDesktop, setIsDesktop] = React.useState(
    () => window.matchMedia('(min-width: 1024px)').matches
  );
  const [secondaryNavOpen, setSecondaryNavOpen] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Chiudi il drawer secondario al cambio di vista
  React.useEffect(() => {
    setSecondaryNavOpen(false);
  }, [view]);

  // Aggiorna document.title al cambio di view (accessibilità + SEO)
  React.useEffect(() => {
    const label = VIEW_LABELS[view] ?? view;
    document.title = view === 'home' ? 'DocenteDoc AI' : `${label} — DocenteDoc AI`;
  }, [view]);

  return (
    // Outer shell: full viewport height, no overflow — contains everything
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: 'var(--md-sys-viewport-height-dvh)',
      overflow: 'hidden',
      bgcolor: 'background.paper',
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
        onOpenNKA={onOpenNKA}
        currentView={view}
      />

      {/* Body row: nav sidebar + scrollable content */}
      <Box sx={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Navigation Rail: in-flow sidebar, hidden on mobile */}
        {isDesktop && (
          <Box
            component="aside"
            aria-label="Navigazione laterale"
            sx={{
              width: 'var(--md-sys-spacing-20)',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              borderRight: 'var(--md-sys-border-width-thin) solid',
              borderColor: 'divider',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <NavigationRail
              items={NAV_ITEMS}
              activeView={view}
              onNavigate={(v, c) => onNavigate(v, c as NavigationParams)}
              onOpenMore={() => setSecondaryNavOpen(p => !p)}
              moreOpen={secondaryNavOpen}
            />
          </Box>
        )}

        {/* Main content: fills remaining width, scrolls independently */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            bgcolor: 'background.paper',
            pb: isDesktop ? undefined : 'calc(var(--md-sys-spacing-16) + env(safe-area-inset-bottom, 0px))',
            minWidth: 0,
          }}
        >
          {children}
        </Box>
      </Box>

      {/* BottomNav: position:fixed, auto-hidden on desktop via its own CSS */}
      <BottomNav
        activeView={view}
        onNavigate={(v) => onNavigate(v)}
        onOpenMore={() => setSecondaryNavOpen(p => !p)}
        moreOpen={secondaryNavOpen}
      />

      {/* Drawer secondario — tutte le sezioni non esposte nel nav principale */}
      <SecondaryNavDrawer
        open={secondaryNavOpen}
        onClose={() => setSecondaryNavOpen(false)}
        onNavigate={(v) => onNavigate(v)}
        activeView={view}
        isDesktop={isDesktop}
      />
    </Box>
  );
};
