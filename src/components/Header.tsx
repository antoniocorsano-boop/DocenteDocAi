/* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */

import React, { useState, useCallback } from 'react';
import { M3Typography, M3Button } from './ui';
import { UserProfile, TimetableSettings, Notifica } from '../types';

interface HeaderProps {
  teacherName?: string;
  onLogout?: () => void;
  fullWidth?: boolean;
  label?: string;
  onClick?: () => void;
  // Additional props for integration with existing system
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  user?: UserProfile | null;
  settings?: TimetableSettings;
  notifiche?: Notifica[];
  setNotifiche?: (notifiche: Notifica[] | ((prev: Notifica[]) => Notifica[])) => void;
  onOpenOperations?: () => void;
  hasSuggestion?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  teacherName = 'Docente',
  onLogout,
  fullWidth = true,
  title = 'DocenteDoc AI',
  showBackButton = false,
  onBack,
  user,
  onNavigate,
  isAiProcessing = false,
  onOpenOperations,
  hasSuggestion = false
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get teacher name from user object or fallback to prop
  const displayName = user?.displayName || teacherName;

  const handleLogoutClick = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const handleLogoutConfirm = useCallback(async () => {
    if (!onLogout) return;

    try {
      setIsLoggingOut(true);
      setShowLogoutConfirm(false);

      // Simulate logout process
      await new Promise(resolve => setTimeout(resolve, 500));

      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  }, [onLogout]);

  const handleLogoutCancel = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);

  const handleBackClick = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  const handleNavigation = useCallback((view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  }, [onNavigate]);

  return (
    <>
      <header
        style={{
          width: fullWidth ? '100%' : 'auto',
          padding: 'var(--md-sys-spacing-4)',
          backgroundColor: 'var(--md-sys-color-surface)',
          borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 'var(--md-sys-z-app-bar)'
        }}
        role="banner"
      >
        {/* Left section - Back button and title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
          {showBackButton && (
            <M3Button
              variant="text"
              onClick={handleBackClick}
              style={{
                minWidth: 'var(--md-sys-sizing-none)',
                padding: 'var(--md-sys-spacing-2)'
              }}
              aria-label="Torna indietro"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_back
              </span>
            </M3Button>
          )}

          <M3Typography
            variant="headline-small"
            style={{
              color: 'var(--md-sys-color-on-surface)',
              cursor: onNavigate ? 'pointer' : 'default'
            }}
            onClick={onNavigate ? () => handleNavigation('home') : undefined}
            role={onNavigate ? 'button' : undefined}
            tabIndex={onNavigate ? 0 : -1}
            onKeyDown={(e) => {
              if (onNavigate && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleNavigation('home');
              }
            }}
          >
            {title}
          </M3Typography>
        </div>

        {/* Center section - User greeting */}
        {user && (
          <div style={{ flex: 1, textAlign: 'center' }}>
            <M3Typography
              variant="body-large"
              style={{
                color: 'var(--md-sys-color-on-surface-variant)',
                fontStyle: 'italic'
              }}
            >
              Benvenuto, {displayName}
            </M3Typography>
          </div>
        )}

        {/* Right section - Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
          {/* AI Processing indicator */}
          {isAiProcessing && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-1)',
                padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
                backgroundColor: 'var(--md-sys-color-tertiary-container)',
                borderRadius: 'var(--md-sys-shape-corner-small)',
                color: 'var(--md-sys-color-on-tertiary-container)'
              }}
              aria-live="polite"
            >
              <div
                style={{
                  width: 'var(--md-sys-spacing-2)',
                  height: 'var(--md-sys-spacing-2)',
                  border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-on-tertiary-container)',
                  borderTop: 'var(--md-sys-border-width-thin) solid transparent',
                  borderRadius: 'var(--md-sys-shape-corner-full)',
                  animation: 'var(--md-sys-motion-circular)'
                }}
              />
              <M3Typography variant="label-small">AI attivo</M3Typography>
            </div>
          )}

          {/* Suggestion indicator */}
          {hasSuggestion && (
            <M3Button
              variant="tonal"
              onClick={() => handleNavigation('operations-center')}
              style={{
                minWidth: 'var(--md-sys-sizing-none)',
                padding: 'var(--md-sys-spacing-2)'
              }}
              aria-label="Hai suggerimenti disponibili"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                lightbulb
              </span>
            </M3Button>
          )}

          {/* Operations button */}
          {onOpenOperations && (
            <M3Button
              variant="text"
              onClick={onOpenOperations}
              style={{
                minWidth: 'var(--md-sys-sizing-none)',
                padding: 'var(--md-sys-spacing-2)'
              }}
              aria-label="Centro operativo"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                settings
              </span>
            </M3Button>
          )}

          {/* Logout button */}
          {user && (
            <M3Button
              variant="outlined"
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              style={{
                minWidth: 'var(--md-sys-sizing-none)',
                padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)'
              }}
              aria-label="Esci dall'applicazione"
            >
              {isLoggingOut ? (
                <div
                  style={{
                    width: 'var(--md-sys-spacing-3)',
                    height: 'var(--md-sys-spacing-3)',
                    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
                    borderTop: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-primary)',
                    borderRadius: 'var(--md-sys-shape-corner-full)',
                    animation: 'var(--md-sys-motion-circular)'
                  }}
                />
              ) : (
                <>
                  <span className="material-symbols-outlined" aria-hidden="true" style={{ marginRight: 'var(--md-sys-spacing-1)' }}>
                    logout
                  </span>
                  Logout
                </>
              )}
            </M3Button>
          )}
        </div>
      </header>

      {/* Logout confirmation dialog */}
      {showLogoutConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--md-sys-color-scrim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 'var(--md-sys-z-dialog)',
            padding: 'var(--md-sys-spacing-4)'
          }}
          onClick={handleLogoutCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          aria-describedby="logout-description"
        >
          <div
            style={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              borderRadius: 'var(--md-sys-shape-corner-large)',
              padding: 'var(--md-sys-spacing-6)',
              maxWidth: 'var(--md-sys-spacing-96)',
              width: 'var(--md-sys-sizing-full)',
              boxShadow: 'var(--md-sys-elevation-level3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <M3Typography
              variant="headline-small"
              id="logout-title"
              style={{
                color: 'var(--md-sys-color-on-surface)',
                marginBottom: 'var(--md-sys-spacing-2)'
              }}
            >
              Conferma logout
            </M3Typography>

            <M3Typography
              variant="body-medium"
              id="logout-description"
              style={{
                color: 'var(--md-sys-color-on-surface-variant)',
                marginBottom: 'var(--md-sys-spacing-6)'
              }}
            >
              Sei sicuro di voler uscire da DocenteDoc AI? Tutti i dati non salvati verranno persi.
            </M3Typography>

            <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-3)', justifyContent: 'flex-end' }}>
              <M3Button
                variant="text"
                onClick={handleLogoutCancel}
              >
                Annulla
              </M3Button>
              <M3Button
                variant="filled"
                onClick={handleLogoutConfirm}
                style={{
                  backgroundColor: 'var(--md-sys-color-error)',
                  color: 'var(--md-sys-color-on-error)'
                }}
              >
                Esci
              </M3Button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

// SNAPSHOT_PLACEHOLDER: Header component visual regression baseline
// TODO: Add Playwright snapshot test and link to [CHECKLIST.md](http://_vscodecontentref_/CHECKLIST.md) phase 3
