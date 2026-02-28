// MD3 Gold Compliant - Mobile-First Responsive Header
// Tutti gli stili usano esclusivamente token MD3
// Audit: febbraio 2026

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
  showMenuButton?: boolean;
  onMenuOpen?: () => void;
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
  showMenuButton = false,
  onMenuOpen,
}) => {
  const teacherName = settings?.nomeInsegnante || '';
  const teacherSurname = settings?.cognomeInsegnante || '';
  const isOnline = useOnlineStatus();
  const unreadCount = notifiche.filter(n => !n.letta).length;
  const { nodes } = useNKAStore();
  const hasNewNode = nodes.some(n => n.isNew);

  const iconButtonStyle: React.CSSProperties = {
    width: 'var(--app-spacing-section)',
    aspectRatio: '1',
    borderRadius: 'var(--md-sys-shape-corner-large, var(--md-sys-radius-4))',
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--md-sys-color-on-surface-variant)',
    flexShrink: 0,
  };

  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: '0',
        zIndex: 'var(--md-sys-z-app-bar)',
        background: 'var(--app-color-surface)',
        boxShadow: 'var(--md-sys-elevation-1)',
        minHeight: 'var(--header-height, var(--md-sys-spacing-16))',
        display: 'flex',
        alignItems: 'center',
        paddingInline: 'var(--app-spacing-container)',
        gap: 'var(--md-sys-spacing-1)',
      }}
    >
      {/* Leading group */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--md-sys-spacing-1)',
          flexShrink: 0,
        }}
      >
        {showMenuButton && (
          <button
            aria-label="Apri menu di navigazione"
            onClick={onMenuOpen}
            style={iconButtonStyle}
          >
            {/* MD3 icon font usage allowed */}
            <span className="material-symbols-outlined" aria-hidden="true">menu</span>
          </button>
        )}
        {!showMenuButton && showBackButton && (
          <button
            aria-label="Indietro"
            onClick={onBack}
            style={iconButtonStyle}
          >
            {/* MD3 icon font usage allowed */}
            <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          </button>
        )}
        {showMenuButton && showBackButton && (
          <button
            aria-label="Indietro"
            onClick={onBack}
            style={iconButtonStyle}
          >
            {/* MD3 icon font usage allowed */}
            <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          </button>
        )}
        <button
          aria-label="Operazioni rapide"
          onClick={onOpenOperations}
          style={{
            ...iconButtonStyle,
            color: hasSuggestion ? 'var(--app-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
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

      {/* Center: Logo + name */}
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--app-spacing-component)',
          minWidth: '0',
          overflow: 'hidden',
        }}
      >
        <Logo
          isAiThinking={isAiProcessing}
          onHomeNavigate={() => !showBackButton && onNavigate('home')}
        />
        <M3Typography
          variant="title-medium"
          style={{
            color: 'var(--app-color-on-surface)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {teacherName} {teacherSurname}
        </M3Typography>
      </div>

      {/* Trailing group */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--md-sys-spacing-1)',
          flexShrink: 0,
        }}
      >
        {!isOnline && (
          <div
            title="Modalità Offline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-1)',
              paddingInline: 'var(--app-spacing-component)',
              paddingBlock: 'var(--md-sys-spacing-1)',
              borderRadius: 'var(--md-sys-shape-corner-large, var(--md-sys-radius-4))',
              background: 'var(--md-sys-color-error-container)',
              color: 'var(--md-sys-color-on-error-container)',
            }}
          >
            {/* MD3 icon font usage allowed */}
            <span className="material-symbols-outlined" aria-hidden="true">cloud_off</span>
            <M3Typography variant="label-small" style={{ fontWeight: 500 }}>Offline</M3Typography>
          </div>
        )}
        <button
          aria-label="Impostazioni"
          onClick={() => onNavigate('settings')}
          style={iconButtonStyle}
        >
          {/* MD3 icon font usage allowed */}
          <span className="material-symbols-outlined" aria-hidden="true">settings</span>
        </button>
        <button
          aria-label="Menu utente"
          style={{
            ...iconButtonStyle,
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
                top: '0',
                right: '0',
                width: 'var(--app-spacing-element)',
                aspectRatio: '1',
                borderRadius: 'var(--md-sys-shape-corner-full, var(--md-sys-radius-full))',
                background: 'var(--md-sys-color-error)',
                border: 'var(--app-border-thin) solid var(--app-color-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={`${unreadCount} notifiche non lette`}
            >
              <span
                style={{
                  fontSize: 'var(--md-sys-spacing-2)',
                  fontWeight: 700,
                  color: 'var(--md-sys-color-on-error)',
                  lineHeight: 1,
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
