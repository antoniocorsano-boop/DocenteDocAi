import { TextField, M3Button } from './ui/index';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Logo from './Logo';
import { UserProfile } from '../types';
import { WELCOME_MESSAGES, EDUCATIONAL_QUOTES } from '../constants';

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
    // ...GSI logic here...
  }, [onSignInSuccess]);
  return (
    <main className="signin-root md3-bg flex flex-col h-screen w-full" data-testid="signin-screen">
      <section className="signin-hero md3-bg-primary flex flex-col justify-center items-center w-full flex-1 px-4 py-4 md:px-8 md:py-12 lg:px-16 lg:py-20">
        <div className="signin-hero-content w-full max-w-2xl flex flex-col md:flex-row md:items-center" style={{ gap: 'var(--md-sys-spacing-8)' }}>
          <div className="signin-logo-container flex justify-center items-center mb-6 md:mb-0">
            <div className="md3-logo-bg flex justify-center items-center rounded-3xl border border-outline-variant/20 shadow-2xl w-24 h-24 p-8">
              <Logo />
            </div>
          </div>
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="md3-headline-large font-black tracking-tight text-on-surface leading-none">
              Docente<span className="text-primary">Doc</span> AI
            </h1>
            <p className="md3-title-medium text-on-surface-variant opacity-70">{welcomeMessage}</p>
          </div>
        </div>
        <div className="signin-quote w-full max-w-2xl pt-8 border-t border-outline-variant/20 mt-8">
          <blockquote className="space-y-3">
            <p className="md3-body-large font-serif italic text-on-surface-variant leading-relaxed">"{quote.text}"</p>
            <footer className="md3-label-small font-black uppercase tracking-[0.2em] text-primary">— {quote.author}</footer>
          </blockquote>
        </div>
      </section>

      <section className="signin-form-section flex-1 flex flex-col justify-center items-center w-full px-2 py-2 md:px-8 md:py-12 lg:px-16 lg:py-20 relative overflow-y-auto">
        <div className="aura-primary"></div>
        <div className="aura-secondary aura-delay"></div>
        <div className="signin-form-container relative z-10 w-full max-w-md md:max-w-lg lg:max-w-xl p-4 md:p-8 lg:p-10 md3-bg-surface border border-outline-variant/20 shadow-2xl overflow-hidden" style={{ borderRadius: 'var(--md-sys-shape-corner-extra-large)' }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="md3-logo-bg flex justify-center items-center border border-outline-variant/20 shadow-inner w-16 h-16 mb-8 p-6" style={{ borderRadius: 'var(--md-sys-shape-corner-large)' }}>
              <Logo />
            </div>
            <div>
              <h2 className="md3-headline-small font-black tracking-tight text-on-surface">Ecosistema <span className="text-primary">Docente</span></h2>
              <p className="md3-label-medium font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">Intelligenza Didattica</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="md3-title-large font-black text-on-surface text-lg md:text-xl lg:text-2xl">Accedi al tuo account</h3>
            <p className="md3-body-small text-on-surface-variant opacity-70">Scegli il metodo di accesso preferito</p>
          </div>
          <div className="space-y-6 md:space-y-7 lg:space-y-8">
            <div className="flex flex-col items-center gap-6 w-full">
              <p className="md3-label-small font-black uppercase tracking-[0.2em] text-on-surface-variant">Accesso Istituzionale</p>
              <div ref={signInButtonRef} className="w-full flex justify-center min-h-[40px] md:min-h-[48px]"></div>
              <p className="md3-label-small italic text-on-surface-variant/40">Sincronizzazione Drive attiva per il backup sicuro.</p>
            </div>
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-outline-variant/10"></div>
              <span className="flex-shrink mx-4 md3-label-small font-black uppercase tracking-widest text-on-surface-variant/30">Oppure</span>
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
                className="md3-bg-surface-container-high"
              />
              <M3Button
                type="submit"
                variant="filled"
                className="w-full py-4 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
                style={{ borderRadius: 'var(--md-sys-shape-corner-medium)' }}
              >
                <span className="flex items-center" style={{ gap: 'var(--md-sys-spacing-6)' }}>
                  Entra in Locale
                  <span className="material-symbols-outlined font-black text-xl">arrow_forward</span>
                </span>
              </M3Button>
            </form>
          </div>

          <footer className="mt-8 md:mt-10 lg:mt-12 pt-6 md:pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10" style={{ gap: 'var(--md-sys-spacing-8)' }}>
              <span className="material-symbols-outlined text-primary text-xs">enhanced_encryption</span>
              <p className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-widest">Privacy First</p>
            </div>
            <p className="text-[8px] md:text-[9px] font-black text-on-surface-variant/20 uppercase tracking-widest">v4.0.0-rc1</p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default SignInScreen;
