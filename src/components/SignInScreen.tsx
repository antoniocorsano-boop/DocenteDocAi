import React, { useEffect, useRef, useState } from 'react';
import { TextField, M3Button } from './ui';
import Logo from './Logo';
import { UserProfile } from '../types';

interface SignInScreenProps {
  onSignInSuccess: (profile: UserProfile) => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onSignInSuccess }) => {
  const [manualName, setManualName] = useState('');
  const signInButtonRef = useRef<HTMLDivElement>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    onSignInSuccess({
      id: `local-${Date.now()}`,
      displayName: manualName.trim(),
    });
  };

  useEffect(() => {
    // Google Sign-In / GSI logic (when enabled)
  }, [onSignInSuccess]);

  return (
    <main
      data-testid="signin-screen"
      className="
        min-h-screen w-full
        flex items-center justify-center
        md3-bg
        p-4
      "
    >
      <section
        className="
          w-full
          md3-bg-surface
          border border-outline-variant/20
        "
        style={{
          maxWidth: '450px',
          borderRadius: 'var(--md-sys-shape-corner-extra-large)',
          margin: '0 auto',
        }}
        aria-labelledby="signin-title"
      >
        {/* Header */}
        <header 
          className="flex flex-col items-center text-center"
          style={{
            padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-3) var(--md-sys-spacing-2)`
          }}
        >
          <div
            className="
              flex items-center justify-center
              w-8 h-8 mb-2
              md3-bg-surface-container
              border border-outline-variant/20
            "
            style={{
              borderRadius: 'var(--md-sys-shape-corner-large)',
            }}
          >
            <Logo />
          </div>

          <h1
            id="signin-title"
            className="md3-headline-small tracking-tight text-on-surface"
          >
            Ecosistema <span className="text-primary">Docente</span>
          </h1>

          <p className="md3-label-medium font-bold text-on-surface-variant uppercase tracking-[0.2em]">
            Intelligenza Didattica
          </p>
        </header>

        {/* Content */}
        <div 
          style={{
            padding: `0 var(--md-sys-spacing-3) var(--md-sys-spacing-3)`,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--md-sys-spacing-2)'
          }}
        >
          <h2 className="md3-title-large text-on-surface text-center">
            Accedi al tuo account
          </h2>

          {/* Institutional login */}
          <div 
            className="flex flex-col items-center"
            style={{ gap: 'var(--md-sys-spacing-2)' }}
          >
            <p className="md3-label-small font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Accesso istituzionale
            </p>

            <div
              ref={signInButtonRef}
              className="w-full flex justify-center min-h-[40px]"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-outline-variant/10" />
            <span className="mx-4 md3-label-small font-bold uppercase tracking-widest text-on-surface-variant/40">
              Oppure
            </span>
            <div className="flex-grow border-t border-outline-variant/10" />
          </div>

          {/* Manual login */}
          <form
            onSubmit={handleManualSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}
            aria-label="Accesso locale"
          >
            <TextField
              label="Nome docente"
              placeholder="Es. Prof. Rossi"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              required
              autoComplete="name"
              leadingIcon="person"
              fullWidth
            />

            <M3Button
              type="submit"
              variant="filled"
              color="primary"
              fullWidth
              style={{
                borderRadius: 'var(--md-sys-shape-corner-medium)',
              }}
            >
              <span
                className="flex items-center justify-center uppercase font-bold tracking-[0.2em]"
                style={{ gap: 'var(--md-sys-spacing-6)' }}
              >
                Entra in locale
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </span>
            </M3Button>
          </form>
        </div>

        {/* Footer */}
        <footer 
          className="border-t border-outline-variant/10 flex justify-center"
          style={{
            padding: `var(--md-sys-spacing-1) var(--md-sys-spacing-3)`
          }}
        >
          <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
            v4.0.0-rc1
          </p>
        </footer>
      </section>
    </main>
  );
};

export default SignInScreen;
