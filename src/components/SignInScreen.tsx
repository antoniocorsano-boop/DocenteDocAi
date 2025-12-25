
import React, { useEffect, useRef, useState } from 'react';
import Logo from './Logo.tsx';
import { UserProfile } from '../types.ts';
import { DEFAULT_TIMETABLE_SETTINGS } from '../constants.ts';
import { TextField } from './M3Components.tsx';

const SignInScreen: React.FC<{ onSignInSuccess: (profile: UserProfile) => void }> = ({ onSignInSuccess }) => {
  const [manualName, setManualName] = useState('');
  const signInButtonRef = useRef<HTMLDivElement>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualName.trim()) {
      onSignInSuccess({ id: 'local-' + Date.now(), displayName: manualName.trim() });
    }
  };

  useEffect(() => {
    // Only load/initialize the GSI script in production on allowed hosts, OR in dev when explicitly enabled
    const isProd = import.meta && (import.meta as any).env && (import.meta as any).env.PROD;
    const isDev = import.meta && (import.meta as any).env && (import.meta as any).env.DEV;
    const enableGsiDev = import.meta && (import.meta as any).env && (import.meta as any).env.VITE_ENABLE_GSI_DEV === 'true';
    const devClientId = import.meta && (import.meta as any).env && (import.meta as any).env.VITE_GSI_CLIENT_ID;

    const allowedHosts = ['docentedoc.app', 'your-production-domain.example'];
    const host = window.location.hostname;

    // If not allowed in production and not explicitly allowed in dev, skip
    if (!(isProd && allowedHosts.includes(host)) && !(isDev && enableGsiDev && !!devClientId)) {
      console.debug('[SignIn] GSI skipped in non-production/unauthorized origin', host);
      return;
    }

    const initGSI = () => {
      if (typeof google === 'undefined') return;

      const clientId = (isDev && enableGsiDev && devClientId) ? devClientId : DEFAULT_TIMETABLE_SETTINGS.googleClientId;

      google.accounts.id.initialize({
        client_id: clientId,
        callback: (res: any) => {
          if (res.credential) {
            const payload = JSON.parse(atob(res.credential.split('.')[1]));
            onSignInSuccess({
              id: payload.sub,
              displayName: payload.name,
              email: payload.email,
              photoURL: payload.picture
            });
          }
        }
      });

      if (signInButtonRef.current) {
        google.accounts.id.renderButton(signInButtonRef.current, {
          theme: 'outline', size: 'large', shape: 'pill', width: 300
        });
        // mark that GSI has been initialized so tests can detect the button
        try { signInButtonRef.current.setAttribute('data-gsi-loaded', 'true'); } catch(e) { /* ignore */ }
      }
    };

    // Avoid double-injecting when script already present
    if (typeof (window as any).google !== 'undefined') {
      initGSI();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGSI;
    document.head.appendChild(script);
  }, [onSignInSuccess]);

  return (
    <div className="auth-screen" data-testid="signin-screen">
      {/* Dynamic Ornaments - M3 Expressive Aura */}
      <div className="auth-ornament auth-ornament-1"></div>
      <div className="auth-ornament auth-ornament-2"></div>
      <div className="auth-ornament auth-ornament-3"></div>

      <div className="auth-card">
        <div className="auth-card-highlight"></div>

        <div className="auth-header">
          <div className="auth-logo">
            <Logo />
          </div>
          <div>
            <h1 className="auth-title">
              Ecosistema <span style={{ color: 'var(--sys-primary)' }}>Docente</span>
            </h1>
            <p className="auth-subtitle">Intelligenza Didattica</p>
          </div>
        </div>

        <div>
          <div className="auth-institutional-login">
            <p className="m3-label-small uppercase" style={{ fontWeight: 'bold', color: 'var(--sys-on-surface-variant)', letterSpacing: '0.1em' }}>Accesso Istituzionale</p>
            <div ref={signInButtonRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
            <p className="m3-body-small italic opacity-60">Sincronizzazione Drive attiva per il backup sicuro.</p>
          </div>

          <div className="auth-divider" style={{ margin: '32px 0' }}>
            <span>Oppure</span>
          </div>

          <form onSubmit={handleManualSubmit} className="auth-manual-login">
            <TextField
              label="Nome Docente"
              placeholder="Es. Prof. Rossi"
              value={manualName}
              onChange={e => setManualName(e.target.value)}
              required
              autoComplete="name"
              leadingIcon="person"
              className="bg-surface-container-high" // Fallback if class not strict, but TextField usually handles it or passes className
            />

            <button
              type="submit"
              className="button button-filled auth-submit-btn"
            >
              <span className="relative z-10 flex items-center gap-3">
                Entra in Locale
                <span className="material-symbols-outlined font-black text-2xl">arrow_forward</span>
              </span>
            </button>
          </form>
        </div>

        <footer className="auth-footer">
          <div className="auth-privacy-badge">
            <span className="material-symbols-outlined text-primary text-sm">enhanced_encryption</span>
            <p className="m3-label-small font-bold opacity-60 uppercase">Privacy First</p>
          </div>
          <p className="m3-label-small opacity-30">v4.0.0-rc1</p>
        </footer>
      </div>
    </div>
  );
};

export default SignInScreen;
