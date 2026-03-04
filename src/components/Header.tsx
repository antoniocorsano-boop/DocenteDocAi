// =============================
// MD3 GOLD COMPLIANT HEADER
// =============================

import React from 'react';
import { HeaderProps, BeforeInstallPromptEvent, Notifica, View } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { M3Typography } from './ui/M3Typography';
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

  // NOTE: className="material-symbols-outlined" is permitted for MD3 icon font usage only (see copilot-instructions.md)
  return (
    <header
      role="banner"
      style={{
        flexShrink: 0,
        position: 'relative',
        zIndex: 'var(--md-sys-z-app-bar)',
        background: 'var(--md-sys-color-surface)',
        borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-surface-container)',
        minHeight: 'var(--md-sys-spacing-16)',
        display: 'flex',
        alignItems: 'center',
        paddingInline: 'var(--md-sys-spacing-4)',
      }}
    >
      {/* Leading: Back + Aura */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }} aria-label="Azioni principali">
        {showBackButton && (
          <button
            aria-label="Indietro"
            onClick={onBack}
            style={{
              width: 'var(--md-sys-spacing-11)',
              aspectRatio: '1',
              borderRadius: 'var(--md-sys-shape-corner-large)',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--md-sys-color-on-surface-variant)'
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
            width: 'var(--md-sys-spacing-11)',
            aspectRatio: '1',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hasSuggestion ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)'
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
            title="Modalità Offline"
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
            {/* MD3 icon font usage allowed */}
            <span className="material-symbols-outlined" aria-hidden="true">cloud_off</span>
            <M3Typography variant="label-small" style={{ fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>Offline</M3Typography>
          </div>
        )}
        <button
          aria-label="Impostazioni"
          onClick={() => onNavigate('settings')}
          style={{
            width: 'var(--md-sys-spacing-11)',
            aspectRatio: '1',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--md-sys-color-on-surface-variant)'
          }}
        >
          {/* MD3 icon font usage allowed */}
          <span className="material-symbols-outlined" aria-hidden="true">settings</span>
        </button>
        <button
          aria-label="Menu utente"
          style={{
            width: 'var(--md-sys-spacing-11)',
            aspectRatio: '1',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
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
                top: 0,
                right: 0,
                width: 'var(--md-sys-spacing-3)',
                aspectRatio: '1',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                background: 'var(--md-sys-color-error)',
                border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label={`${unreadCount} notifiche non lette`}
            >
              <span
                style={{
                  fontSize: 'var(--md-sys-spacing-3)',
                  fontWeight: 'var(--md-sys-typescale-weight-bold)',
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
