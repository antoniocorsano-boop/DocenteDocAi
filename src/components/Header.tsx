// =============================
// MD3 GOLD COMPLIANT HEADER
// =============================

import React from 'react';
import { HeaderProps, BeforeInstallPromptEvent, Notifica, View } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { M3Typography } from './ui/M3Typography';
import M3IconButton from './ui/M3IconButton';
import Avatar from './ui/Avatar';
import Logo from './Logo';
import NKAHeaderAuraButton from '../nka/NKAHeaderAuraButton';
import { useNKAStore } from '../nka/useNKAStore';
import Breadcrumb from './Breadcrumb';

interface ExtendedHeaderProps extends Omit<HeaderProps, 'onOpenImageAnalysis' | 'onOpenVideoAnalysis' | 'onOpenHelp' | 'onOpenCircularAnalysis' | 'setNotifiche' | 'installPrompt' | 'onInstallApp'> {
  onOpenNKA?: () => void;
  onOpenImageAnalysis?: () => void;
  onOpenVideoAnalysis?: () => void;
  onOpenHelp?: () => void;
  onOpenCircularAnalysis?: (url: string, title: string) => void;
  setNotifiche?: React.Dispatch<React.SetStateAction<Notifica[]>>;
  installPrompt?: BeforeInstallPromptEvent | null;
  onInstallApp?: () => void;
  /** View corrente — necessaria per il Breadcrumb */
  currentView?: View;
}

export const Header: React.FC<ExtendedHeaderProps> = ({
  showBackButton,
  onBack,
  user,
  settings,
  notifiche,
  onNavigate,
  isAiProcessing,
  hasSuggestion,
  onOpenOperations,
  onOpenNKA,
  currentView,
}) => {
  const teacherName = settings?.nomeInsegnante || '';
  const teacherSurname = settings?.cognomeInsegnante || '';
  const isOnline = useOnlineStatus();
  const unreadCount = notifiche.filter(n => !n.letta).length;
  const { nodes } = useNKAStore();
  const hasNewNode = nodes.some(n => n.isNew);

  // Scroll elevation: tint header when main content is scrolled
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const main = document.querySelector('main, [data-scroll-content]');
    if (!main) return;
    const onScroll = () => setScrolled((main as HTMLElement).scrollTop > 4);
    main.addEventListener('scroll', onScroll, { passive: true });
    return () => main.removeEventListener('scroll', onScroll);
  }, []);

  // NOTE: className="material-symbols-outlined" is permitted for MD3 icon font usage only (see copilot-instructions.md)
  return (
    <header
      role="banner"
      style={{
        flexShrink: 0,
        position: 'relative',
        zIndex: 'var(--md-sys-z-app-bar)',
        background: scrolled
          ? 'var(--md-sys-color-surface-container)'
          : 'var(--md-sys-color-surface)',
        borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-surface-container)',
        boxShadow: scrolled ? 'var(--md-sys-elevation-level2)' : 'none',
        minHeight: 'var(--md-sys-spacing-16)',
        display: 'flex',
        alignItems: 'center',
        paddingInline: 'var(--md-sys-spacing-4)',
        transition: [
          `background var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
          `box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
        ].join(', '),
      }}
    >
      {/* Leading: Back + Aura */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }} aria-label="Azioni principali">
        {showBackButton && (
          <M3IconButton
            icon="arrow_back"
            ariaLabel="Indietro"
            onClick={onBack}
          />
        )}
        <M3IconButton
          icon="bolt"
          ariaLabel="Operazioni rapide"
          onClick={onOpenOperations}
          variant={hasSuggestion ? 'tonal' : 'standard'}
        />
        {onOpenNKA && (
          <NKAHeaderAuraButton
            hasNewNode={hasNewNode}
            onClick={onOpenNKA}
            onLongPress={() => onNavigate('settings')}
          />
        )}
      </nav>

      {/* Title/Logo + Breadcrumb — left-aligned per MD3 top app bar spec */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)', marginLeft: 'var(--md-sys-spacing-3)', minWidth: 0 }}>
        <Logo isAiThinking={isAiProcessing} onHomeNavigate={() => !showBackButton && onNavigate('home')} />
        {showBackButton && currentView ? (
          <Breadcrumb currentView={currentView} onNavigate={onNavigate} />
        ) : (
          <M3Typography variant="title-medium" style={{ color: 'var(--md-sys-color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            DocenteDoc
          </M3Typography>
        )}
      </div>

      {/* Trailing: Status, Settings, Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
        {!isOnline && (
          <div
            role="status"
            aria-label="Modalità Offline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-1)',
              paddingInline: 'var(--md-sys-spacing-2)',
              paddingBlock: 'var(--md-sys-spacing-1)',
              borderRadius: 'var(--md-sys-shape-corner-large)',
              background: 'var(--md-sys-color-error-container)',
              color: 'var(--md-sys-color-on-error-container)'
            }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">cloud_off</span>
            <M3Typography variant="label-small">Offline</M3Typography>
          </div>
        )}
        <M3IconButton
          icon="settings"
          ariaLabel="Impostazioni"
          onClick={() => onNavigate('settings')}
        />
        <button
          aria-label="Menu utente"
          onClick={() => onNavigate('settings')}
          style={{
            width: 'var(--md-sys-spacing-11)',
            aspectRatio: '1',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 0,
          }}
        >
          <Avatar
            name={`${teacherSurname || ''} ${teacherName || 'Docente'}`.trim()}
            src={user?.photoURL}
            size="sm"
          />
          {unreadCount > 0 && (
            <span
              aria-label={`${unreadCount} notifiche non lette`}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                minWidth: 'var(--md-sys-spacing-4)',
                height: 'var(--md-sys-spacing-4)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                background: 'var(--md-sys-color-error)',
                border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 var(--md-sys-spacing-1)',
              }}
            >
              <M3Typography variant="label-small" style={{ color: 'var(--md-sys-color-on-error)', lineHeight: 1 }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </M3Typography>
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
