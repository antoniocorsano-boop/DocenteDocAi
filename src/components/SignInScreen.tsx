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
      className="md3-bg" style={{ minHeight: "100vh", width: "100%", overflowY: "auto" }}
    >
      {/* Hero Section */}
      <section
        className="py-16 md:py-24 bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)]/20 relative overflow-hidden" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderBottom: "1px solid var(--md-sys-color-outline)" }}
      >
        {/* Background gradient animation - MOVED BELOW CONTENT */}

        <div
          className="bg-[var(--md-sys-color-surface-container-high)] border-[var(--md-sys-color-outline-variant)]/20 rounded-[var(--md-sys-shape-corner-extra-large)] shadow-elevation-2 hover:shadow-elevation-4 transition-shadow duration-300" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "5rem", height: "5rem", marginBottom: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}
        >
          <Logo />
        </div>

        <h1
          className="md3-display-small text-[var(--md-sys-color-on-surface)] max-w-4xl" style={{ letterSpacing: "-0.005em", marginBottom: "var(--md-sys-spacing-4)" }}
        >
          DocenteDoc AI: <span style={{
  color: 'var(--md-sys-color-primary)'
}}>L'AI che trasforma</span> la tua didattica
        </h1>

        <p className="md3-headline-small text-[var(--md-sys-color-on-surface)]-variant max-w-2xl" style={{ marginBottom: "var(--md-sys-spacing-8)" }}>
          Crea contenuti, valuta studenti e gestisci classi con intelligenza artificiale. Tutto offline, sicuro e gratuito.
        </p>

        <div className="sm:flex-row" style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-4)", marginBottom: "var(--md-sys-spacing-8)" }}>
          <M3Button
            variant="filled"
            color="primary"
            size="large"
            className="rounded-[var(--md-sys-shape-corner-large)] px-8 py-3 shadow-elevation-2 hover:shadow-elevation-4 duration-300" style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
            onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="tracking-[0.2em]" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-2)", textTransform: "uppercase", fontWeight: "bold" }}>
              Inizia Gratuitamente
              <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_forward</span>
            </span>
          </M3Button>

          <M3Button
            variant="outlined"
            color="primary"
            size="large"
            className="rounded-[var(--md-sys-shape-corner-large)] px-8 py-3 hover:bg-primary/5 duration-300" style={{ transition: "color 300ms" }}
            onClick={() => window.open('#demo', '_blank')} // Placeholder for demo
          >
            <span className="tracking-[0.2em]" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-2)", textTransform: "uppercase", fontWeight: "bold" }}>
              Vedi Demo
              <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>play_arrow</span>
            </span>
          </M3Button>
        </div>

        {/* Social proof teaser */}
        <div className="text-[var(--md-sys-color-on-surface)]-variant" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)" }}>
          <div className="-space-x-2" style={{ display: "flex" }}>
            <div className="border-2 border-surface" style={{ width: "2rem", height: "2rem", backgroundColor: "var(--md-sys-color-primary)", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold", color: "var(--md-sys-color-on-primary)" }}>P</div>
            <div className="border-2 border-surface" style={{ width: "2rem", height: "2rem", backgroundColor: "var(--md-sys-color-secondary)", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold", color: "var(--md-sys-color-on-secondary)" }}>R</div>
            <div className="border-2 border-surface text-on-tertiary" style={{ width: "2rem", height: "2rem", backgroundColor: "var(--md-sys-color-tertiary)", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold" }}>M</div>
          </div>
          <span className="md3-label-medium">Usato da 10.000+ docenti italiani</span>
        </div>

        {/* Background gradient animation - BELOW ALL CONTENT */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-tertiary/5 animate-pulse pointer-events-none" style={{ zIndex: -1 }}></div>
      </section>

      {/* Features Section */}
      <section
        className="py-16 md:py-24 md3-bg" style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}
      >
        <div className="max-w-6xl" style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="md3-headline-large text-[var(--md-sys-color-on-surface)] mb-12" style={{ textAlign: "center" }}>
            Potenzia la tua didattica con l'AI
          </h2>

          <div className="md:grid-cols-2 lg:grid-cols-3" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)" }}>
            <M3Card
              variant="elevated"
              className="hover:shadow-elevation-4 duration-300 group" style={{ padding: "var(--md-sys-spacing-6)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer" }}
              onClick={() => {/* Placeholder for feature navigation */}}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--md-sys-spacing-4)" }}>
                <span className="material-symbols-outlined text-4xl mr-4 group-hover:scale-110" style={{ color: "var(--md-sys-color-primary)", transition: "transform 300ms" }}>auto_awesome</span>
                <h3 className="md3-title-large text-[var(--md-sys-color-on-surface)]">AI Assistente Didattico</h3>
              </div>
              <p className="md3-body-medium text-[var(--md-sys-color-on-surface)]-variant" style={{ marginBottom: "var(--md-sys-spacing-4)" }}>
                Genera lezioni complete, valutazioni e contenuti personalizzati in pochi secondi con l'intelligenza artificiale.
              </p>
              {/* Mockup screenshot */}
              <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-medium)] border-[var(--md-sys-color-outline-variant)]/20" style={{ padding: "var(--md-sys-spacing-4)", border: "1px solid var(--md-sys-color-outline)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-2)", marginBottom: "var(--md-sys-spacing-2)" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)" }}>school</span>
                  <span className="md3-label-small text-[var(--md-sys-color-on-surface)]">Lezione Matematica - Algebra</span>
                </div>
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[var(--md-sys-shape-corner-small)]" style={{ height: "5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined text-3xl text-primary/50">image</span>
                </div>
              </div>
            </M3Card>

            <M3Card
              variant="elevated"
              className="hover:shadow-elevation-4 duration-300 group" style={{ padding: "var(--md-sys-spacing-6)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--md-sys-spacing-4)" }}>
                <span className="material-symbols-outlined text-4xl mr-4 group-hover:scale-110" style={{ color: "var(--md-sys-color-secondary)", transition: "transform 300ms" }}>security</span>
                <h3 className="md3-title-large text-[var(--md-sys-color-on-surface)]">Dashboard Sicura</h3>
              </div>
              <p className="md3-body-medium text-[var(--md-sys-color-on-surface)]-variant" style={{ marginBottom: "var(--md-sys-spacing-4)" }}>
                I tuoi dati rimangono locali sul dispositivo. Nessun upload nel cloud, massima privacy per i dati degli studenti.
              </p>
              <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-medium)] border-[var(--md-sys-color-outline-variant)]/20" style={{ padding: "var(--md-sys-spacing-4)", border: "1px solid var(--md-sys-color-outline)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-2)", marginBottom: "var(--md-sys-spacing-2)" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-secondary)" }}>lock</span>
                  <span className="md3-label-small text-[var(--md-sys-color-on-surface)]">Dati Locali - Offline First</span>
                </div>
                <div className="bg-gradient-to-r from-secondary/10 to-tertiary/10 rounded-[var(--md-sys-shape-corner-small)]" style={{ height: "5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined text-3xl text-secondary/50">cloud_off</span>
                </div>
              </div>
            </M3Card>

            <M3Card
              variant="elevated"
              className="hover:shadow-elevation-4 duration-300 group" style={{ padding: "var(--md-sys-spacing-6)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--md-sys-spacing-4)" }}>
                <span className="material-symbols-outlined text-4xl mr-4 group-hover:scale-110" style={{ color: "var(--md-sys-color-tertiary)", transition: "transform 300ms" }}>group</span>
                <h3 className="md3-title-large text-[var(--md-sys-color-on-surface)]">Gestione Classe Intelligente</h3>
              </div>
              <p className="md3-body-medium text-[var(--md-sys-color-on-surface)]-variant" style={{ marginBottom: "var(--md-sys-spacing-4)" }}>
                Monitora presenze, valutazioni e progressi con suggerimenti AI per interventi personalizzati.
              </p>
              <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-medium)] border-[var(--md-sys-color-outline-variant)]/20" style={{ padding: "var(--md-sys-spacing-4)", border: "1px solid var(--md-sys-color-outline)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-2)", marginBottom: "var(--md-sys-spacing-2)" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-tertiary)" }}>analytics</span>
                  <span className="md3-label-small text-[var(--md-sys-color-on-surface)]">Dashboard Studenti</span>
                </div>
                <div className="bg-gradient-to-r from-tertiary/10 to-primary/10 rounded-[var(--md-sys-shape-corner-small)]" style={{ height: "5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined text-3xl text-tertiary/50">bar_chart</span>
                </div>
              </div>
            </M3Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section
        className="py-16 md:py-24 bg-[var(--md-sys-color-surface-container-low)] border-y border-[var(--md-sys-color-outline-variant)]/20" style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}
      >
        <div className="max-w-4xl" style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          <h2 className="md3-headline-large text-[var(--md-sys-color-on-surface)] mb-12">
            Fidati dei docenti che lo usano
          </h2>

          <div className="md:grid-cols-2 mb-12" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)" }}>
            <div className="md3-bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-extra-large)] border-[var(--md-sys-color-outline-variant)]/20" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)", marginBottom: "var(--md-sys-spacing-4)" }}>
                <div style={{ width: "3rem", height: "3rem", backgroundColor: "var(--md-sys-color-primary)", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--md-sys-color-on-primary)", fontWeight: "bold" }}>MR</div>
                <div style={{ textAlign: "left" }}>
                  <div className="md3-title-medium text-[var(--md-sys-color-on-surface)]">Prof.ssa Maria Rossi</div>
                  <div className="md3-label-small text-[var(--md-sys-color-on-surface)]-variant">Docente di Matematica, Milano</div>
                </div>
              </div>
              <p className="md3-body-medium text-[var(--md-sys-color-on-surface)]-variant italic">
                "DocenteDoc AI mi ha fatto risparmiare ore settimanali nella preparazione delle lezioni. L'AI genera contenuti di qualità eccellente!"
              </p>
            </div>

            <div className="md3-bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-extra-large)] border-[var(--md-sys-color-outline-variant)]/20" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)", marginBottom: "var(--md-sys-spacing-4)" }}>
                <div style={{ width: "3rem", height: "3rem", backgroundColor: "var(--md-sys-color-secondary)", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--md-sys-color-on-secondary)", fontWeight: "bold" }}>GB</div>
                <div style={{ textAlign: "left" }}>
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
          <div className="md:grid-cols-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--md-sys-spacing-6)" }}>
            <div style={{ textAlign: "center" }}>
              <div className="md3-display-small" style={{ color: "var(--md-sys-color-primary)", fontWeight: "900" }}>10K+</div>
              <div className="md3-label-large text-[var(--md-sys-color-on-surface)]-variant">Docenti</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="md3-display-small" style={{ color: "var(--md-sys-color-secondary)", fontWeight: "900" }}>50K+</div>
              <div className="md3-label-large text-[var(--md-sys-color-on-surface)]-variant">Lezioni Generate</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="md3-display-small" style={{ color: "var(--md-sys-color-tertiary)", fontWeight: "900" }}>95%</div>
              <div className="md3-label-large text-[var(--md-sys-color-on-surface)]-variant">Soddisfazione</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="md3-display-small" style={{ color: "var(--md-sys-color-primary)", fontWeight: "900" }}>4.8★</div>
              <div className="md3-label-large text-[var(--md-sys-color-on-surface)]-variant">Valutazione</div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section
        id="login-section"
        className="py-16 md:py-24 md3-bg border-[var(--md-sys-color-outline-variant)]/20" style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderTop: "1px solid var(--md-sys-color-outline)" }}
      >
        <div className="max-w-md" style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="md3-headline-medium text-[var(--md-sys-color-on-surface)]" style={{ textAlign: "center", marginBottom: "var(--md-sys-spacing-8)" }}>
            Inizia il tuo viaggio con l'AI didattica
          </h2>

          {/* Institutional login */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--md-sys-spacing-4)", marginBottom: "var(--md-sys-spacing-6)" }}>
            <p className="md3-label-medium tracking-[0.2em] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Accesso istituzionale
            </p>
            <div
              ref={signInButtonRef}
              className="min-h-[40px]" style={{ width: "100%", display: "flex", justifyContent: "center" }}
            />
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--md-sys-spacing-6)" }}>
            <div className="border-[var(--md-sys-color-outline-variant)]/10" style={{ flexGrow: "1", borderTop: "1px solid var(--md-sys-color-outline)" }} />
            <span className="mx-4 md3-label-small text-[var(--md-sys-color-on-surface)]-variant/40" style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Oppure
            </span>
            <div className="border-[var(--md-sys-color-outline-variant)]/10" style={{ flexGrow: "1", borderTop: "1px solid var(--md-sys-color-outline)" }} />
          </div>

          {/* Manual login */}
          <form
            onSubmit={handleManualSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-4)" }}
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
              <span className="tracking-[0.2em]" style={{ display: "flex", alignItems: "center", justifyContent: "center", textTransform: "uppercase", fontWeight: "bold", gap: "var(--md-sys-spacing-2)" }}>
                Entra Gratuitamente
                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_forward</span>
              </span>
            </M3Button>
          </form>

          {/* Footer */}
          <footer className="mt-8" style={{ textAlign: "center" }}>
            <p className="text-[var(--md-sys-color-on-surface)]-variant/40" style={{ fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              v4.0.0-rc1 • PWA Offline-First
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default SignInScreen;


