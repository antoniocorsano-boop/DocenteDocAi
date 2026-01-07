
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Logo from './Logo';
import { UserProfile } from '../types';
import { DEFAULT_TIMETABLE_SETTINGS, WELCOME_MESSAGES, EDUCATIONAL_QUOTES } from '../constants';
import { TextField, M3Button } from './ui';

const SignInScreen: React.FC<{ onSignInSuccess: (profile: UserProfile) => void }> = ({ onSignInSuccess }) => {
  const [manualName, setManualName] = useState('');
  const signInButtonRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = useMemo(() => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)], []);
  const quote = useMemo(() => EDUCATIONAL_QUOTES[Math.floor(Math.random() * EDUCATIONAL_QUOTES.length)], []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualName.trim()) {
      onSignInSuccess({ id: 'local-' + Date.now(), displayName: manualName.trim() });
    }
  };

  useEffect(() => {
    const env = (import.meta as ImportMeta).env;
    const isProd = env && env.PROD;
    const isDev = env && env.DEV;
    const enableGsiDev = env && env.VITE_ENABLE_GSI_DEV === 'true';
    const devClientId = env && env.VITE_GSI_CLIENT_ID;

    const allowedHosts = ['docentedoc.app', 'your-production-domain.example'];
    const host = window.location.hostname;

    if (!(isProd && allowedHosts.includes(host)) && !(isDev && enableGsiDev && !!devClientId)) {
      console.debug('[SignIn] GSI skipped in non-production/unauthorized origin', host);
      return;
    }

    const initGSI = () => {
      if (typeof google === 'undefined') return;

      const clientId = (isDev && enableGsiDev && devClientId) ? devClientId : DEFAULT_TIMETABLE_SETTINGS.googleClientId;

      google.accounts.id.initialize({
        client_id: clientId,
        callback: (res: { credential?: string }) => {
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
          theme: 'outline', size: 'large', shape: 'pill'
        });
        try { signInButtonRef.current.setAttribute('data-gsi-loaded', 'true'); } catch { /* ignore */ }
      }
    };

    if (typeof (window as unknown as { google?: unknown }).google !== 'undefined') {
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
    <div className="fixed inset-0 flex flex-col lg:flex-row bg-surface overflow-y-auto lg:overflow-hidden" data-testid="signin-screen">
      {/* Left Side: Hero & Branding (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8 overflow-hidden bg-primary-container/20">
        {/* Aura Ornaments */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 max-w-md space-y-8">
          <div className="flex flex-col items-start space-y-4">
            <div className="w-24 h-24 p-8 bg-surface-container-high/50 backdrop-blur-xl rounded-3xl border border-outline-variant/20 shadow-2xl">
              <Logo />
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-black tracking-tighter text-on-surface leading-none">
                Docente<span className="text-primary">Doc</span> AI
              </h1>
              <p className="text-lg font-medium text-on-surface-variant opacity-70">
                {welcomeMessage}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-outline-variant/20">
            <blockquote className="space-y-3">
              <p className="text-xl font-serif italic text-on-surface-variant leading-relaxed">
                "{quote.text}"
              </p>
              <footer className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                — {quote.author}
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Mobile Aura Ornaments (Hidden on Desktop) */}
        <div className="lg:hidden absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="lg:hidden absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-lg p-6 md:p-8 lg:p-10 bg-surface-container-low/30 backdrop-blur-2xl rounded-4xl border border-outline-variant/20 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

          <div className="flex flex-col items-center text-center mb-6 lg:hidden">
            <div className="w-16 h-16 mb-8 p-6 bg-surface-container-high/50 rounded-3xl border border-outline-variant/20 shadow-inner">
              <Logo />
            </div>
            <div>
              <h1 className="m3-headline-small font-black tracking-tight text-on-surface">
                Ecosistema <span className="text-primary">Docente</span>
              </h1>
              <p className="m3-label-medium font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">Intelligenza Didattica</p>
            </div>
          </div>

          <div className="hidden lg:block mb-6">
            <h2 className="m3-title-large font-black text-on-surface text-lg md:text-xl lg:text-2xl">Accedi al tuo account</h2>
            <p className="text-xs md:text-sm text-on-surface-variant opacity-70">Scegli il metodo di accesso preferito</p>
          </div>

          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            <div className="flex flex-col items-center gap-6 w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Accesso Istituzionale</p>
              <div ref={signInButtonRef} className="w-full flex justify-center min-h-[40px] md:min-h-[48px]"></div>
              <p className="m3-label-small italic text-on-surface-variant/40">Sincronizzazione Drive attiva per il backup sicuro.</p>
            </div>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-outline-variant/10"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30">Oppure</span>
              <div className="flex-grow border-t border-outline-variant/10"></div>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <TextField
                label="Nome Docente"
                placeholder="Es. Prof. Rossi"
                value={manualName}
                onChange={e => setManualName(e.target.value)}
                required
                autoComplete="name"
                leadingIcon="person"
                className="bg-surface-container-high/50"
              />

              <M3Button
                type="submit"
                variant="filled"
                className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
              >
                <span className="flex items-center gap-6">
                  Entra in Locale
                  <span className="material-symbols-outlined font-black text-xl">arrow_forward</span>
                </span>
              </M3Button>
            </form>
          </div>

          <footer className="mt-8 md:mt-10 lg:mt-12 pt-6 md:pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-8 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
              <span className="material-symbols-outlined text-primary text-xs">enhanced_encryption</span>
              <p className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-widest">Privacy First</p>
            </div>
            <p className="text-[8px] md:text-[9px] font-black text-on-surface-variant/20 uppercase tracking-widest">v4.0.0-rc1</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
