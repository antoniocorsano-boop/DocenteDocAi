// MD3 Gold Compliant
// Mobile-first responsive app shell using MD3 navigation patterns
// Audit: febbraio 2026
import React from 'react';
import NavigationRail from './NavigationRail';
import BottomNav from './BottomNav';
import { Header } from './Header';
import { M3Surface, M3FlexContainer, M3Aside } from './ui';
import { useBreakpoint } from './ui/ResponsiveContainer';
import { View, UserProfile, TimetableSettings, Notifica, BeforeInstallPromptEvent, NavigationParams } from '../types';

const NAV_ITEMS = [
  { id: 'home' as View, label: 'Home', icon: 'home', activeIcon: 'home' },
  { id: 'timetable' as View, label: 'Orario', icon: 'schedule', activeIcon: 'watch_later' },
  { id: 'progettazione-hub' as View, label: 'Progetta', icon: 'design_services', activeIcon: 'edit_document' },
  { id: 'aula' as View, label: 'Classi', icon: 'groups', activeIcon: 'groups' },
  { id: 'orientamento' as View, label: 'Orienta', icon: 'explore', activeIcon: 'explore' },
  { id: 'calendario' as View, label: 'Agenda', icon: 'calendar_month', activeIcon: 'event_note' },
];

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
  const { isMobile, isTablet } = useBreakpoint();
  const showBottomNav = isMobile;
  const showRail = !isMobile;

  const handleNavigate = (v: View, c?: unknown) => onNavigate(v, c as NavigationParams);

  return (
    <M3Surface style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'var(--md-sys-viewport-height-full)',
      background: 'var(--app-color-surface)'
    }}>
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
        isMobile={isMobile}
        isTablet={isTablet}
      />

      <M3FlexContainer
        flex="var(--md-sys-flex-auto)"
        minHeight="var(--md-sys-spacing-0)"
        background="var(--app-color-surface)"
      >
        {showRail && (
          <M3Aside
            flexBasis="var(--md-sys-spacing-20)"
            background="var(--app-color-surface)"
            borderRight="var(--app-border-thin) solid var(--md-sys-color-outline-variant)"
            style={{ zIndex: 'var(--md-sys-z-nav)', flexShrink: 0 }}
          >
            <NavigationRail
              items={NAV_ITEMS}
              activeView={view}
              onNavigate={handleNavigate}
            />
          </M3Aside>
        )}

        <M3Surface style={{
          flex: 'var(--md-sys-flex-auto)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          background: 'var(--app-color-surface-container)',
          overflowY: 'auto',
          paddingBottom: showBottomNav ? 'var(--md-sys-spacing-16)' : 'var(--md-sys-spacing-0)',
          minWidth: 'var(--md-sys-spacing-0)',
        }}>
          {children}
        </M3Surface>
      </M3FlexContainer>

      {showBottomNav && (
        <BottomNav
          activeView={view}
          onNavigate={(v) => onNavigate(v)}
          items={NAV_ITEMS}
        />
      )}
    </M3Surface>
  );
};
