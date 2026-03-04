// MD3 Gold Compliant
// App Shell: height-constrained flex column for proper scroll containment
// Audit: marzo 2026
import React from 'react';
import NavigationRail from './NavigationRail';
import BottomNav from './BottomNav';
import { Header } from './Header';
import { View, UserProfile, TimetableSettings, Notifica, BeforeInstallPromptEvent, NavigationParams } from '../types';

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
  const [isDesktop, setIsDesktop] = React.useState(() => window.innerWidth >= 1024);

  React.useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    // Outer shell: full viewport height, no overflow — contains everything
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      overflow: 'hidden',
      background: 'var(--md-sys-color-surface)',
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
      />

      {/* Body row: nav sidebar + scrollable content */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden', // contain children
        minHeight: 0,       // allow flex child to shrink below content size
      }}>
        {/* Navigation Rail: in-flow sidebar, hidden on mobile */}
        {isDesktop && (
          <aside
            style={{
              width: 'var(--md-sys-spacing-20)',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--md-sys-color-surface)',
              borderRight: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
            aria-label="Navigazione laterale"
          >
            <NavigationRail
              items={NAV_ITEMS}
              activeView={view}
              onNavigate={(v, c) => onNavigate(v, c as NavigationParams)}
            />
          </aside>
        )}

        {/* Main content: fills remaining width, scrolls independently */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          background: 'var(--md-sys-color-surface)',
          // Bottom padding for mobile bottom nav (64px + safe area)
          paddingBottom: isDesktop ? undefined : 'calc(var(--md-sys-spacing-16) + env(safe-area-inset-bottom, 0px))',
          minWidth: 0, // allow flex child to shrink
        }}>
          {children}
        </main>
      </div>

      {/* BottomNav: position:fixed, auto-hidden on desktop via its own CSS */}
      <BottomNav activeView={view} onNavigate={(v) => onNavigate(v)} />
    </div>
  );
};
