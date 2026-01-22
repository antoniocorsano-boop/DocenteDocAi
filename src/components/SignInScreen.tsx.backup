// MD3 Compliant
import React, { useEffect, useRef, useState } from 'react';
import { TextField, M3Button, M3Card, M3Typography } from './ui';
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
       style={{ minHeight: "100vh", width: "100%", overflowY: "auto" }}
    >
      {/* Hero Section */}
      <section
        style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', borderBottom: "1px solid var(--md-sys-color-outline)" }}
      >
        {/* Background gradient animation - MOVED BELOW CONTENT */}

        <div
          style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)', display: "flex", alignItems: "center", justifyContent: "center", width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)', border: "1px solid var(--md-sys-color-outline)" }}
        >
          <Logo />
        </div>

        <M3Typography
          variant="headline-large"
          style={{ color: 'var(--md-sys-color-on-primary)', letterSpacing: "-0.005em", marginBottom: 'var(--md-sys-spacing-4)' }}
        >
          DocenteDoc AI: <span style={{color: 'var(--md-sys-color-primary)'}}>L'AI che trasforma</span> la tua didattica
        </M3Typography>

        <M3Typography variant="body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-8)' }}>
          Crea contenuti, valuta studenti e gestisci classi con intelligenza artificiale. Tutto offline, sicuro e gratuito.
        </M3Typography>

        <div  style={{display: "flex", flexDirection: "column", gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-8)'}}>
          <M3Button
            variant="filled"
            color="primary"
            size="large"
            style={{ borderRadius: 'var(--md-sys-shape-corner-large)', transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
            onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span  style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-2)', textTransform: "uppercase", fontWeight: "bold"}}>
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
            style={{ borderRadius: 'var(--md-sys-shape-corner-large)', transition: "color 300ms" }}
            onClick={() => window.open('#demo', '_blank')} // Placeholder for demo
          >
            <span  style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-2)', textTransform: "uppercase", fontWeight: "bold"}}>
              Vedi Demo
              <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>play_arrow</span>
            </span>
          </M3Button>
        </div>

        {/* Social proof teaser */}
        <div style={{ color: 'var(--md-sys-color-on-surface-variant)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-4)' }}>
          <div  style={{ display: "flex" }}>
            <div  style={{width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-primary)', borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold", color: 'var(--md-sys-color-on-primary)'}}>P</div>
            <div  style={{width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-secondary)', borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold", color: 'var(--md-sys-color-on-secondary)'}}>R</div>
            <div style={{width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-tertiary)', borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold", color: 'var(--md-sys-color-on-tertiary)'}}>M</div>
          </div>
          <span >Usato da 10.000+ docenti italiani</span>
        </div>

        {/* Background gradient animation - BELOW ALL CONTENT */}
        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', zIndex: -1 }}></div>
      </section>

      {/* Features Section */}
      <section
         style={{paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)'}}
      >
        <div  style={{ marginLeft: "auto", marginRight: "auto" }}>
          <M3Typography variant="headline-medium" style={{ color: 'var(--md-sys-color-on-primary)', textAlign: "center" }}>
            Potenzia la tua didattica con l'AI
          </M3Typography>

          <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: 'var(--md-sys-spacing-6)'}}>
            <M3Card
              variant="elevated"
               style={{padding: 'var(--md-sys-spacing-6)', transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer"}}
              onClick={() => {/* Placeholder for feature navigation */}}
            >
              <div style={{display: "flex", alignItems: "center", marginBottom: 'var(--md-sys-spacing-4)'}}>
                <span style={{color: 'var(--md-sys-color-primary)', transition: "transform 300ms"}}>auto_awesome</span>
                <M3Typography variant="title-large" style={{ color: 'var(--md-sys-color-on-primary)' }}>AI Assistente Didattico</M3Typography>
              </div>
              <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                Genera lezioni complete, valutazioni e contenuti personalizzati in pochi secondi con l'intelligenza artificiale.
              </M3Typography>
              {/* Mockup screenshot */}
              <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-4)', border: "1px solid var(--md-sys-color-outline)" }}>
                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-2)'}}>
                  <span  style={{color: 'var(--md-sys-color-primary)'}}>school</span>
                  <span style={{ color: 'var(--md-sys-color-on-primary)' }}>Lezione Matematica - Algebra</span>
                </div>
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', height: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: 'var(--md-sys-color-primary)' }}>image</span>
                </div>
              </div>
            </M3Card>

            <M3Card
              variant="elevated"
               style={{padding: 'var(--md-sys-spacing-6)', transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer"}}
            >
              <div style={{display: "flex", alignItems: "center", marginBottom: 'var(--md-sys-spacing-4)'}}>
                <span style={{color: 'var(--md-sys-color-secondary)', transition: "transform 300ms"}}>security</span>
                <M3Typography variant="title-large" style={{ color: 'var(--md-sys-color-on-primary)' }}>Dashboard Sicura</M3Typography>
              </div>
              <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                I tuoi dati rimangono locali sul dispositivo. Nessun upload nel cloud, massima privacy per i dati degli studenti.
              </M3Typography>
              <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-4)', border: "1px solid var(--md-sys-color-outline)" }}>
                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-2)'}}>
                  <span  style={{color: 'var(--md-sys-color-secondary)'}}>lock</span>
                  <span style={{ color: 'var(--md-sys-color-on-primary)' }}>Dati Locali - Offline First</span>
                </div>
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', height: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: 'var(--md-sys-color-secondary)' }}>cloud_off</span>
                </div>
              </div>
            </M3Card>

            <M3Card
              variant="elevated"
               style={{padding: 'var(--md-sys-spacing-6)', transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer"}}
            >
              <div style={{display: "flex", alignItems: "center", marginBottom: 'var(--md-sys-spacing-4)'}}>
                <span style={{color: 'var(--md-sys-color-tertiary)', transition: "transform 300ms"}}>group</span>
                <M3Typography variant="title-large" style={{ color: 'var(--md-sys-color-on-primary)' }}>Gestione Classe Intelligente</M3Typography>
              </div>
              <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                Monitora presenze, valutazioni e progressi con suggerimenti AI per interventi personalizzati.
              </M3Typography>
              <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-4)', border: "1px solid var(--md-sys-color-outline)" }}>
                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-2)'}}>
                  <span  style={{color: 'var(--md-sys-color-tertiary)'}}>analytics</span>
                  <span style={{ color: 'var(--md-sys-color-on-primary)' }}>Dashboard Studenti</span>
                </div>
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', height: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: 'var(--md-sys-color-tertiary)' }}>bar_chart</span>
                </div>
              </div>
            </M3Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section
        style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)' }}
      >
        <div  style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          <M3Typography variant="headline-medium" style={{ color: 'var(--md-sys-color-on-primary)' }}>
            Fidati dei docenti che lo usano
          </M3Typography>

          <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: 'var(--md-sys-spacing-8)'}}>
            <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-6)', border: "1px solid var(--md-sys-color-outline)" }}>
              <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-4)'}}>
                <div style={{width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-primary)', borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", color: 'var(--md-sys-color-on-primary)', fontWeight: "bold"}}>MR</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: 'var(--md-sys-color-on-primary)' }}>Prof.ssa Maria Rossi</div>
                  <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Docente di Matematica, Milano</div>
                </div>
              </div>
              <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                "DocenteDoc AI mi ha fatto risparmiare ore settimanali nella preparazione delle lezioni. L'AI genera contenuti di qualità eccellente!"
              </M3Typography>
            </div>

            <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-6)', border: "1px solid var(--md-sys-color-outline)" }}>
              <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-4)'}}>
                <div style={{width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-secondary)', borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", color: 'var(--md-sys-color-on-secondary)', fontWeight: "bold"}}>GB</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: 'var(--md-sys-color-on-primary)' }}>Prof. Giovanni Bianchi</div>
                  <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Docente di Italiano, Roma</div>
                </div>
              </div>
              <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                "La sicurezza dei dati è fondamentale. Con DocenteDoc, tutto rimane offline e sotto il mio controllo."
              </M3Typography>
            </div>
          </div>

          {/* Stats */}
          <div  style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 'var(--md-sys-spacing-6)'}}>
            <div style={{ textAlign: "center" }}>
              <div  style={{color: 'var(--md-sys-color-primary)', fontWeight: "900"}}>10K+</div>
              <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Docenti</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div  style={{color: 'var(--md-sys-color-secondary)', fontWeight: "900"}}>50K+</div>
              <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Lezioni Generate</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div  style={{color: 'var(--md-sys-color-tertiary)', fontWeight: "900"}}>95%</div>
              <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Soddisfazione</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div  style={{color: 'var(--md-sys-color-primary)', fontWeight: "900"}}>4.8★</div>
              <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Valutazione</div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section
        id="login-section"
         style={{paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', borderTop: "1px solid var(--md-sys-color-outline)"}}
      >
        <div  style={{ marginLeft: "auto", marginRight: "auto" }}>
          <M3Typography variant="headline-medium" style={{ textAlign: "center", marginBottom: 'var(--md-sys-spacing-8)' }}>
            Inizia il tuo viaggio con l'AI didattica
          </M3Typography>

          {/* Institutional login */}
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)'}}>
            <M3Typography variant="label-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "bold", textTransform: "uppercase" }}>
              Accesso istituzionale
            </M3Typography>
            <div
              ref={signInButtonRef}
               style={{ width: "100%", display: "flex", justifyContent: "center" }}
            />
          </div>

          {/* Divider */}
          <div style={{display: "flex", alignItems: "center", marginBottom: 'var(--md-sys-spacing-6)'}}>
            <div  style={{flexGrow: "1", borderTop: "1px solid var(--md-sys-color-outline)"}} />
            <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Oppure
            </span>
            <div  style={{flexGrow: "1", borderTop: "1px solid var(--md-sys-color-outline)"}} />
          </div>

          {/* Manual login */}
          <form
            onSubmit={handleManualSubmit}
            style={{display: "flex", flexDirection: "column", gap: 'var(--md-sys-spacing-4)'}}
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
              style={{ borderRadius: 'var(--md-sys-shape-corner-large)' }}
            >
              <span  style={{display: "flex", alignItems: "center", justifyContent: "center", textTransform: "uppercase", fontWeight: "bold", gap: 'var(--md-sys-spacing-2)'}}>
                Entra Gratuitamente
                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_forward</span>
              </span>
            </M3Button>
          </form>

          {/* Footer */}
          <footer  style={{ textAlign: "center" }}>
            <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              v4.0.0-rc1 • PWA Offline-First
            </M3Typography>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default SignInScreen;








