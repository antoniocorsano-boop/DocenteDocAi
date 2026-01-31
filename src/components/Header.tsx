// =============================
// MD3 GOLD COMPLIANT HEADER
// =============================

import React from 'react';
import { HeaderProps } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { M3Typography } from './ui/M3Typography';
import Avatar from './ui/Avatar';
import Logo from './Logo';


export const Header: React.FC<HeaderProps> = ({
  showBackButton,
  onBack,
  user,
  notifiche,
  onNavigate,
  isAiProcessing,
  hasSuggestion,
  onOpenOperations
}) => {
  // Teacher identity intentionally not rendered in Header (moved to Home)
  const isOnline = useOnlineStatus();
  const unreadCount = notifiche.filter(n => !n.letta).length;

  // NOTE: className="material-symbols-outlined" is permitted for MD3 icon font usage only (see copilot-instructions.md)
  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--md-sys-z-app-bar)',
        background: 'var(--md-sys-color-surface)',
        boxShadow: 'var(--md-sys-elevation-level1)',
        minHeight: 'var(--md-sys-spacing-12)',
        display: 'flex',
        alignItems: 'center',
        paddingInline: 'var(--app-spacing-section)',
        paddingBlock: 'var(--md-sys-spacing-2)' // Reduced for mobile-first compact header
      }}
    >
      {/* Leading: Back + Aura */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--app-spacing-element)' }} aria-label="Azioni principali">
        {showBackButton && (
          <button
            aria-label="Indietro"
            onClick={onBack}
            style={{
              width: 'var(--app-spacing-section)',
              aspectRatio: '1',
              borderRadius: 'var(--md-sys-shape-corner-large)',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--app-color-on-surface-variant)'
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
            width: 'var(--app-spacing-section)',
            aspectRatio: '1',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hasSuggestion ? 'var(--app-color-primary)' : 'var(--app-color-on-surface-variant)'
          }}
        >
          {/* MD3 icon font usage allowed */}
          <span className="material-symbols-outlined" aria-hidden="true">bolt</span>
        </button>
      </nav>

      {/* Title/Logo */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--app-spacing-component)' }}>
        <Logo isAiThinking={isAiProcessing} onHomeNavigate={() => !showBackButton && onNavigate('home')} />
      </div>

      {/* Trailing: Status, Settings, Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--app-spacing-element)' }}>
        {!isOnline && (
          <div
            title="Modalità Offline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-1)',
              paddingInline: 'var(--app-spacing-component)',
              paddingBlock: 'var(--md-sys-spacing-1)',
              borderRadius: 'var(--md-sys-shape-corner-large)',
              background: 'var(--md-sys-color-error-container)',
              color: 'var(--md-sys-color-on-error-container)'
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
          style={{
            width: 'var(--app-spacing-section)',
            aspectRatio: '1',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--app-color-on-surface-variant)',
            // Ensure minimum touch target for mobile (use app token)
            minWidth: 'var(--app-spacing-touch)',
            minHeight: 'var(--app-spacing-touch)'
          }}
        >
          {/* MD3 icon font usage allowed */}
          <span className="material-symbols-outlined" aria-hidden="true">settings</span>
        </button>
        <button
          aria-label="Menu utente"
          style={{
            width: 'var(--app-spacing-section)',
            aspectRatio: '1',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minWidth: 'var(--app-spacing-touch)',
            minHeight: 'var(--app-spacing-touch)'
          }}
        >
          <Avatar
            // Avatar kept as an action only; teacher textual identity moved to Home
            name={user?.displayName ?? ''}
            src={user?.photoURL}
            size="sm"
          />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 'var(--app-spacing-element)',
                aspectRatio: '1',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                background: 'var(--md-sys-color-error)',
                border: 'var(--app-border-thin) solid var(--app-color-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label={`${unreadCount} notifiche non lette`}
            >
              <span
                style={{
                  fontSize: 'var(--app-spacing-element)',
                  fontWeight: 700,
                  color: 'var(--md-sys-color-on-error)',
                  lineHeight: 1
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
