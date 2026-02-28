// =============================
// MD3 GOLD COMPLIANT HEADER
// Mobile-first responsive top app bar
// =============================

import React from 'react';
import { HeaderProps, BeforeInstallPromptEvent, Notifica } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { M3Typography } from './ui/M3Typography';
import Avatar from './ui/Avatar';
import Logo from './Logo';
import NKAHeaderAuraButton from '../nka/NKAHeaderAuraButton';
import { useNKAStore } from '../nka/useNKAStore';

interface ExtendedHeaderProps extends HeaderProps {
  onOpenNKA?: () => void;
  onOpenImageAnalysis?: () => void;
  onOpenVideoAnalysis?: () => void;
  onOpenHelp?: () => void;
  onOpenCircularAnalysis?: (url: string, title: string) => void;
  setNotifiche?: React.Dispatch<React.SetStateAction<Notifica[]>>;
  installPrompt?: BeforeInstallPromptEvent | null;
  onInstallApp?: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
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
  isMobile = false,
  isTablet = false,
}) => {
  const teacherName = settings?.nomeInsegnante || '';
  const teacherSurname = settings?.cognomeInsegnante || '';
  const isOnline = useOnlineStatus();
  const unreadCount = notifiche.filter(n => !n.letta).length;
  const { nodes } = useNKAStore();
  const hasNewNode = nodes.some(n => n.isNew);
  const showTeacherName = !isMobile && (teacherName || teacherSurname);

  // NOTE: className="material-symbols-outlined" is permitted for MD3 icon font usage only (see copilot-instructions.md)
  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--md-sys-z-app-bar)',
        background: 'var(--app-color-surface)',
        boxShadow: 'var(--md-sys-elevation-level1)',
        minHeight: isMobile ? 'var(--md-sys-spacing-14)' : 'var(--md-sys-spacing-12)',
        display: 'flex',
        alignItems: 'center',
        paddingInline: isMobile ? 'var(--app-spacing-component)' : 'var(--app-spacing-section)',
        gap: 'var(--md-sys-spacing-1)',
      }}
    >
      {/* Leading: Back + Operations + Aura */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-1)', flexShrink: 0 }}>
        {showBackButton && (
          <button
            aria-label="Indietro"
            onClick={onBack}
            style={{
              width: 'var(--md-sys-spacing-12)',
              height: 'var(--md-sys-spacing-12)',
              borderRadius: 'var(--md-sys-shape-corner-large)',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--md-sys-color-on-surface-variant)',
              cursor: 'pointer',
            }}
          >
            {/* MD3 icon font usage allowed */}
            <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          </button>
        )}
        <button
          aria-label="Operazioni rapide"
          onClick={onOpenOperations}
          style={{
            width: 'var(--md-sys-spacing-12)',
            height: 'var(--md-sys-spacing-12)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hasSuggestion ? 'var(--app-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
            cursor: 'pointer',
          }}
        >
          {/* MD3 icon font usage allowed */}
          <span className="material-symbols-outlined" aria-hidden="true">bolt</span>
        </button>
        {onOpenNKA && (
          <NKAHeaderAuraButton
            hasNewNode={hasNewNode}
            onClick={onOpenNKA}
            onLongPress={() => onNavigate('settings')}
          />
        )}
      </div>

      {/* Center: Logo + Teacher name (hidden on mobile) */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'center',
        gap: 'var(--app-spacing-component)',
        minWidth: 'var(--md-sys-spacing-0)',
        overflow: 'hidden',
      }}>
        <Logo isAiThinking={isAiProcessing} onHomeNavigate={() => !showBackButton && onNavigate('home')} />
        {showTeacherName && (
          <M3Typography
            variant={isTablet ? 'title-medium' : 'title-large'}
            style={{
              color: 'var(--app-color-on-surface)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {teacherName} {teacherSurname}
          </M3Typography>
        )}
      </div>

      {/* Trailing: Offline badge + Settings + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-1)', flexShrink: 0 }}>
        {!isOnline && (
          <div
            title="Modalità Offline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-1)',
              paddingInline: 'var(--md-sys-spacing-2)',
              paddingBlock: 'var(--md-sys-spacing-1)',
              borderRadius: 'var(--md-sys-shape-corner-large)',
              background: 'var(--md-sys-color-error-container)',
              color: 'var(--md-sys-color-on-error-container)',
            }}
          >
            {/* MD3 icon font usage allowed */}
            <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-5)' }}>cloud_off</span>
            {!isMobile && (
              <M3Typography variant="label-small" style={{ fontWeight: 500 }}>Offline</M3Typography>
            )}
          </div>
        )}
        {!isMobile && (
          <button
            aria-label="Impostazioni"
            onClick={() => onNavigate('settings')}
            style={{
              width: 'var(--md-sys-spacing-12)',
              height: 'var(--md-sys-spacing-12)',
              borderRadius: 'var(--md-sys-shape-corner-large)',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--md-sys-color-on-surface-variant)',
              cursor: 'pointer',
            }}
          >
            {/* MD3 icon font usage allowed */}
            <span className="material-symbols-outlined" aria-hidden="true">settings</span>
          </button>
        )}
        <button
          aria-label="Menu utente"
          style={{
            width: 'var(--md-sys-spacing-12)',
            height: 'var(--md-sys-spacing-12)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <Avatar
            name={`${teacherSurname || ''} ${teacherName || 'Docente'}`.trim()}
            src={user?.photoURL}
            size="sm"
          />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 'var(--md-sys-spacing-1)',
                right: 'var(--md-sys-spacing-1)',
                width: 'var(--md-sys-spacing-4)',
                height: 'var(--md-sys-spacing-4)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                background: 'var(--md-sys-color-error)',
                border: `var(--app-border-thin) solid var(--app-color-surface)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={`${unreadCount} notifiche non lette`}
            >
              <span
                style={{
                  fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                  fontWeight: 700,
                  color: 'var(--md-sys-color-on-error)',
                  lineHeight: 1,
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
