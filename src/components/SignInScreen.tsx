import React, { useEffect, useRef, useState } from 'react';
import { TextField, M3Button, M3Card } from './ui';
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
        md3-bg
        overflow-y-auto
      "
    >
      {/* Hero Section */}
      <section
        className="
          flex flex-col items-center justify-center
          text-center px-4 py-16 md:py-24
          bg-[var(--md-sys-color-surface-container-low)]
          border-b border-[var(--md-sys-color-outline-variant)]/20
          relative overflow-hidden
        "
      >
        {/* Background gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-tertiary/5 animate-pulse"></div>

        <div
          className="
            flex items-center justify-center
            w-20 h-20 mb-6
            bg-[var(--md-sys-color-surface-container-high)]
            border border-[var(--md-sys-color-outline-variant)]/20
            rounded-[var(--md-sys-shape-corner-extra-large)]
            shadow-elevation-2
            hover:shadow-elevation-4 transition-shadow duration-300
          "
        >
          <Logo />
        </div>

        <h1
          className="md3-display-small tracking-tight text-[var(--md-sys-color-on-surface)] mb-4 max-w-4xl"
        >
          DocenteDoc AI: <span className="text-primary">L'AI che trasforma</span> la tua didattica
        </h1>

        <p className="md3-headline-small text-[var(--md-sys-color-on-surface)]-variant mb-8 max-w-2xl">
          Crea contenuti, valuta studenti e gestisci classi con intelligenza artificiale. Tutto offline, sicuro e gratuito.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <M3Button
            variant="filled"
            color="primary"
            size="large"
            className="rounded-[var(--md-sys-shape-corner-large)] px-8 py-3 shadow-elevation-2 hover:shadow-elevation-4 transition-all duration-300"
            onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="flex items-center gap-2 uppercase font-bold tracking-[0.2em]">
              Inizia Gratuitamente
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </M3Button>

          <M3Button
            variant="outlined"
            color="primary"
            size="large"
            className="rounded-[var(--md-sys-shape-corner-large)] px-8 py-3 hover:bg-primary/5 transition-colors duration-300"
            onClick={() => window.open('#demo', '_blank')} // Placeholder for demo
          >
            <span className="flex items-center gap-2 uppercase font-bold tracking-[0.2em]">
              Vedi Demo
              <span className="material-symbols-outlined">play_arrow</span>
            </span>
          </M3Button>
        </div>

        {/* Social proof teaser */}
        <div className="flex items-center gap-4 text-[var(--md-sys-color-on-surface)]-variant">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full border-2 border-surface flex items-center justify-center text-xs font-bold text-on-primary">P</div>
            <div className="w-8 h-8 bg-secondary rounded-full border-2 border-surface flex items-center justify-center text-xs font-bold text-on-secondary">R</div>
            <div className="w-8 h-8 bg-tertiary rounded-full border-2 border-surface flex items-center justify-center text-xs font-bold text-on-tertiary">M</div>
          </div>
          <span className="md3-label-medium">Usato da 10.000+ docenti italiani</span>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="
          px-4 py-16 md:py-24
          md3-bg
        "
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="md3-headline-large text-[var(--md-sys-color-on-surface)] text-center mb-12">
            Potenzia la tua didattica con l'AI
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <M3Card
              variant="elevated"
              className="p-6 hover:shadow-elevation-4 transition-all duration-300 group cursor-pointer"
              onClick={() => {/* Placeholder for feature navigation */}}
            >
              <div className="flex items-center mb-4">
                <span className="material-symbols-outlined text-4xl text-primary mr-4 group-hover:scale-110 transition-transform">auto_awesome</span>
                <h3 className="md3-title-large text-[var(--md-sys-color-on-surface)]">AI Assistente Didattico</h3>
              </div>
              <p className="md3-body-medium text-[var(--md-sys-color-on-surface)]-variant mb-4">
                Genera lezioni complete, valutazioni e contenuti personalizzati in pochi secondi con l'intelligenza artificiale.
              </p>
              {/* Mockup screenshot */}
              <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-medium)] p-4 border border-[var(--md-sys-color-outline-variant)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">school</span>
                  <span className="md3-label-small text-[var(--md-sys-color-on-surface)]">Lezione Matematica - Algebra</span>
                </div>
                <div className="h-20 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[var(--md-sys-shape-corner-small)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary/50">image</span>
                </div>
              </div>
            </M3Card>

            <M3Card
              variant="elevated"
              className="p-6 hover:shadow-elevation-4 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <span className="material-symbols-outlined text-4xl text-secondary mr-4 group-hover:scale-110 transition-transform">security</span>
                <h3 className="md3-title-large text-[var(--md-sys-color-on-surface)]">Dashboard Sicura</h3>
              </div>
              <p className="md3-body-medium text-[var(--md-sys-color-on-surface)]-variant mb-4">
                I tuoi dati rimangono locali sul dispositivo. Nessun upload nel cloud, massima privacy per i dati degli studenti.
              </p>
              <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-medium)] p-4 border border-[var(--md-sys-color-outline-variant)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary">lock</span>
                  <span className="md3-label-small text-[var(--md-sys-color-on-surface)]">Dati Locali - Offline First</span>
                </div>
                <div className="h-20 bg-gradient-to-r from-secondary/10 to-tertiary/10 rounded-[var(--md-sys-shape-corner-small)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-secondary/50">cloud_off</span>
                </div>
              </div>
            </M3Card>

            <M3Card
              variant="elevated"
              className="p-6 hover:shadow-elevation-4 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <span className="material-symbols-outlined text-4xl text-tertiary mr-4 group-hover:scale-110 transition-transform">group</span>
                <h3 className="md3-title-large text-[var(--md-sys-color-on-surface)]">Gestione Classe Intelligente</h3>
              </div>
              <p className="md3-body-medium text-[var(--md-sys-color-on-surface)]-variant mb-4">
                Monitora presenze, valutazioni e progressi con suggerimenti AI per interventi personalizzati.
              </p>
              <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-medium)] p-4 border border-[var(--md-sys-color-outline-variant)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-tertiary">analytics</span>
                  <span className="md3-label-small text-[var(--md-sys-color-on-surface)]">Dashboard Studenti</span>
                </div>
                <div className="h-20 bg-gradient-to-r from-tertiary/10 to-primary/10 rounded-[var(--md-sys-shape-corner-small)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-tertiary/50">bar_chart</span>
                </div>
              </div>
            </M3Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section
        className="
          px-4 py-16 md:py-24
          bg-[var(--md-sys-color-surface-container-low)]
          border-y border-[var(--md-sys-color-outline-variant)]/20
        "
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="md3-headline-large text-[var(--md-sys-color-on-surface)] mb-12">
            Fidati dei docenti che lo usano
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="md3-bg-[var(--md-sys-color-surface-container-low)] p-6 rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary font-bold">MR</div>
                <div className="text-left">
                  <div className="md3-title-medium text-[var(--md-sys-color-on-surface)]">Prof.ssa Maria Rossi</div>
                  <div className="md3-label-small text-[var(--md-sys-color-on-surface)]-variant">Docente di Matematica, Milano</div>
                </div>
              </div>
              <p className="md3-body-medium text-[var(--md-sys-color-on-surface)]-variant italic">
                "DocenteDoc AI mi ha fatto risparmiare ore settimanali nella preparazione delle lezioni. L'AI genera contenuti di qualità eccellente!"
              </p>
            </div>

            <div className="md3-bg-[var(--md-sys-color-surface-container-low)] p-6 rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-on-secondary font-bold">GB</div>
                <div className="text-left">
                  <div className="md3-title-medium text-[var(--md-sys-color-on-surface)]">Prof. Giovanni Bianchi</div>
                  <div className="md3-label-small text-[var(--md-sys-color-on-surface)]-variant">Docente di Italiano, Roma</div>
                </div>
              </div>
              <p className="md3-body-medium text-[var(--md-sys-color-on-surface)]-variant italic">
                "La sicurezza dei dati è fondamentale. Con DocenteDoc, tutto rimane offline e sotto il mio controllo."
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="md3-display-small text-primary font-black">10K+</div>
              <div className="md3-label-large text-[var(--md-sys-color-on-surface)]-variant">Docenti</div>
            </div>
            <div className="text-center">
              <div className="md3-display-small text-secondary font-black">50K+</div>
              <div className="md3-label-large text-[var(--md-sys-color-on-surface)]-variant">Lezioni Generate</div>
            </div>
            <div className="text-center">
              <div className="md3-display-small text-tertiary font-black">95%</div>
              <div className="md3-label-large text-[var(--md-sys-color-on-surface)]-variant">Soddisfazione</div>
            </div>
            <div className="text-center">
              <div className="md3-display-small text-primary font-black">4.8★</div>
              <div className="md3-label-large text-[var(--md-sys-color-on-surface)]-variant">Valutazione</div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section
        id="login-section"
        className="
          px-4 py-16 md:py-24
          md3-bg
          border-t border-[var(--md-sys-color-outline-variant)]/20
        "
      >
        <div className="max-w-md mx-auto">
          <h2 className="md3-headline-medium text-[var(--md-sys-color-on-surface)] text-center mb-8">
            Inizia il tuo viaggio con l'AI didattica
          </h2>

          {/* Institutional login */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <p className="md3-label-medium font-bold uppercase tracking-[0.2em] text-[var(--md-sys-color-on-surface)]-variant">
              Accesso istituzionale
            </p>
            <div
              ref={signInButtonRef}
              className="w-full flex justify-center min-h-[40px]"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-[var(--md-sys-color-outline-variant)]/10" />
            <span className="mx-4 md3-label-small font-bold uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant/40">
              Oppure
            </span>
            <div className="flex-grow border-t border-[var(--md-sys-color-outline-variant)]/10" />
          </div>

          {/* Manual login */}
          <form
            onSubmit={handleManualSubmit}
            className="flex flex-col gap-4"
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
              className="rounded-[var(--md-sys-shape-corner-large)] hover:shadow-elevation-2 transition-shadow duration-300"
            >
              <span className="flex items-center justify-center uppercase font-bold tracking-[0.2em] gap-2">
                Entra Gratuitamente
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </M3Button>
          </form>

          {/* Footer */}
          <footer className="mt-8 text-center">
            <p className="text-xs font-bold text-[var(--md-sys-color-on-surface)]-variant/40 uppercase tracking-widest">
              v4.0.0-rc1 • PWA Offline-First
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default SignInScreen;
