// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
import React from 'react';
import NavigationRail from './NavigationRail';
import { Header } from './Header';
import { M3Surface, M3FlexContainer, M3Aside } from './ui';
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
  hasSuggestion
}) => {
  // Responsive logic for NavigationRail container (initialize from CSS token; SSR-safe)
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const bp = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--md-sys-breakpoint-mobile')) || 600;
      return window.innerWidth < bp;
    } catch (e) {
      return window.innerWidth < 600;
    }
  });

  React.useEffect(() => {
    const checkMobile = () => {
      const mobileBreakpoint = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--md-sys-breakpoint-mobile')) || 600;
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <M3Surface style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'var(--md-sys-viewport-height-full)',
      background: 'var(--app-color-surface)'
    }}>
      <Header
        title="DocenteDoc AI"
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
      />
      <M3FlexContainer
        flex="var(--md-sys-flex-auto)"
        minHeight="var(--md-sys-spacing-0)"
        background="var(--app-color-surface)"
      >
        {!isMobile && (
          <M3Aside
            flexBasis="var(--md-sys-spacing-20)"
            background="var(--app-color-surface)"
            borderRight="var(--app-border-thin) solid var(--md-sys-color-outline-variant)"
            style={{ zIndex: 'var(--md-sys-z-nav)' }}
          >
          </M3Aside>
        )}
        <M3Surface style={{
          flex: 'var(--md-sys-flex-auto)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          background: 'var(--app-color-surface-container)',
          // Add bottom padding on mobile to avoid FAB overlapping BottomNav
          paddingBottom: isMobile ? 'calc(var(--app-spacing-section) + var(--md-sys-size-fab, 72px))' : undefined
        }}>
          {children}
        </M3Surface>
      </M3FlexContainer>
      <NavigationRail
        items={[
          { id: 'home', label: 'Home', icon: 'home', activeIcon: 'home' },
          { id: 'timetable', label: 'Orario', icon: 'schedule', activeIcon: 'watch_later' },
          { id: 'progettazione-hub', label: 'Progetta', icon: 'design_services', activeIcon: 'edit_document' },
          { id: 'aula', label: 'Classi', icon: 'groups', activeIcon: 'groups' },
          { id: 'orientamento', label: 'Orientamento', icon: 'explore', activeIcon: 'explore' },
          { id: 'calendario', label: 'Agenda', icon: 'calendar_month', activeIcon: 'event_note' }
        ]}
        activeView={view}
        onNavigate={(v, c) => onNavigate(v, c as NavigationParams)}
        isMobile={isMobile}
      />
    </M3Surface>
  );
};
