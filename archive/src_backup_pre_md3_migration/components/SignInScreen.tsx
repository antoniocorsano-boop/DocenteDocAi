// LEGACY - MD3 Non-compliant
import React, { useEffect, useRef, useState } from 'react';
import { TextField, M3Button, M3Card } from './ui';
import Logo from './Logo';
import { UserProfile } from '../types';
import { useTheme } from '../theme/theme';

interface SignInScreenProps {
  onSignInSuccess: (profile: UserProfile) => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onSignInSuccess }) => {
  const { layers } = useTheme();
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
        style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)] }} style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderBottom: "1px solid layers.sys.colors.outline"}}
      >
        {/* Background gradient animation - MOVED BELOW CONTENT */}

        <div
          style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)], borderRadius: ref.shape[] }} style={{display: "flex", alignItems: "center", justifyContent: "center", width: ref.spacing[80], height: ref.spacing[80], marginBottom: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline"}}
        >
          <Logo />
        </div>

        <h1
          style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{letterSpacing: "-0.005em", marginBottom: layers.ref.spacing['4']}}
        >
          DocenteDoc AI: <span style={{color: 'layers.sys.colors.primary'}}>L'AI che trasforma</span> la tua didattica
        </h1>

        <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{marginBottom: layers.ref.spacing['8']}}>
          Crea contenuti, valuta studenti e gestisci classi con intelligenza artificiale. Tutto offline, sicuro e gratuito.
        </p>

        <div  style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['4'], marginBottom: layers.ref.spacing['8']}}>
          <M3Button
            variant="filled"
            color="primary"
            size="large"
            style={{ borderRadius: ref.shape[] }} style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
            onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span  style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['2'], textTransform: "uppercase", fontWeight: "bold"}}>
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
            style={{ borderRadius: ref.shape[] }} style={{ transition: "color 300ms" }}
            onClick={() => window.open('#demo', '_blank')} // Placeholder for demo
          >
            <span  style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['2'], textTransform: "uppercase", fontWeight: "bold"}}>
              Vedi Demo
              <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>play_arrow</span>
            </span>
          </M3Button>
        </div>

        {/* Social proof teaser */}
        <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['4']}}>
          <div  style={{ display: "flex" }}>
            <div  style={{width: ref.spacing[32], height: ref.spacing[32], backgroundColor: "layers.sys.colors.primary", borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold", color: "layers.sys.colors.on-primary"}}>P</div>
            <div  style={{width: ref.spacing[32], height: ref.spacing[32], backgroundColor: "layers.sys.colors.secondary", borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold", color: "layers.sys.colors.on-secondary"}}>R</div>
            <div style={{ color: sys.colors.on-tertiary }} style={{width: ref.spacing[32], height: ref.spacing[32], backgroundColor: "layers.sys.colors.tertiary", borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold"}}>M</div>
          </div>
          <span >Usato da 10.000+ docenti italiani</span>
        </div>

        {/* Background gradient animation - BELOW ALL CONTENT */}
        <div style={{ backgroundColor: sys.colors.gradient-to-br }} style={{ zIndex: -1 }}></div>
      </section>

      {/* Features Section */}
      <section
         style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}
      >
        <div  style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ textAlign: "center" }}>
            Potenzia la tua didattica con l'AI
          </h2>

          <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6']}}>
            <M3Card
              variant="elevated"
               style={{padding: layers.ref.spacing['6'], transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer"}}
              onClick={() => {/* Placeholder for feature navigation */}}
            >
              <div style={{display: "flex", alignItems: "center", marginBottom: layers.ref.spacing['4']}}>
                <span style={{ color: sys.colors.4xl }} style={{color: "layers.sys.colors.primary", transition: "transform 300ms"}}>auto_awesome</span>
                <h3 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }}>AI Assistente Didattico</h3>
              </div>
              <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{marginBottom: layers.ref.spacing['4']}}>
                Genera lezioni complete, valutazioni e contenuti personalizzati in pochi secondi con l'intelligenza artificiale.
              </p>
              {/* Mockup screenshot */}
              <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)], borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['4'], border: "1px solid layers.sys.colors.outline"}}>
                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['2'], marginBottom: layers.ref.spacing['2']}}>
                  <span  style={{color: "layers.sys.colors.primary"}}>school</span>
                  <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }}>Lezione Matematica - Algebra</span>
                </div>
                <div style={{ backgroundColor: sys.colors.gradient-to-r, borderRadius: ref.shape[] }} style={{ height: ref.spacing[80], display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: sys.colors.3xl, color: sys.colors.primary/50 }}>image</span>
                </div>
              </div>
            </M3Card>

            <M3Card
              variant="elevated"
               style={{padding: layers.ref.spacing['6'], transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer"}}
            >
              <div style={{display: "flex", alignItems: "center", marginBottom: layers.ref.spacing['4']}}>
                <span style={{ color: sys.colors.4xl }} style={{color: "layers.sys.colors.secondary", transition: "transform 300ms"}}>security</span>
                <h3 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }}>Dashboard Sicura</h3>
              </div>
              <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{marginBottom: layers.ref.spacing['4']}}>
                I tuoi dati rimangono locali sul dispositivo. Nessun upload nel cloud, massima privacy per i dati degli studenti.
              </p>
              <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)], borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['4'], border: "1px solid layers.sys.colors.outline"}}>
                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['2'], marginBottom: layers.ref.spacing['2']}}>
                  <span  style={{color: "layers.sys.colors.secondary"}}>lock</span>
                  <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }}>Dati Locali - Offline First</span>
                </div>
                <div style={{ backgroundColor: sys.colors.gradient-to-r, borderRadius: ref.shape[] }} style={{ height: ref.spacing[80], display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: sys.colors.3xl, color: sys.colors.secondary/50 }}>cloud_off</span>
                </div>
              </div>
            </M3Card>

            <M3Card
              variant="elevated"
               style={{padding: layers.ref.spacing['6'], transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer"}}
            >
              <div style={{display: "flex", alignItems: "center", marginBottom: layers.ref.spacing['4']}}>
                <span style={{ color: sys.colors.4xl }} style={{color: "layers.sys.colors.tertiary", transition: "transform 300ms"}}>group</span>
                <h3 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }}>Gestione Classe Intelligente</h3>
              </div>
              <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{marginBottom: layers.ref.spacing['4']}}>
                Monitora presenze, valutazioni e progressi con suggerimenti AI per interventi personalizzati.
              </p>
              <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)], borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['4'], border: "1px solid layers.sys.colors.outline"}}>
                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['2'], marginBottom: layers.ref.spacing['2']}}>
                  <span  style={{color: "layers.sys.colors.tertiary"}}>analytics</span>
                  <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }}>Dashboard Studenti</span>
                </div>
                <div style={{ backgroundColor: sys.colors.gradient-to-r, borderRadius: ref.shape[] }} style={{ height: ref.spacing[80], display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: sys.colors.3xl, color: sys.colors.tertiary/50 }}>bar_chart</span>
                </div>
              </div>
            </M3Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section
        style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)] }} style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}
      >
        <div  style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          <h2 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }}>
            Fidati dei docenti che lo usano
          </h2>

          <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['8']}}>
            <div style={{ borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline"}}>
              <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['4'], marginBottom: layers.ref.spacing['4']}}>
                <div style={{width: ref.spacing[48], height: ref.spacing[48], backgroundColor: "layers.sys.colors.primary", borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center", color: "layers.sys.colors.on-primary", fontWeight: "bold"}}>MR</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }}>Prof.ssa Maria Rossi</div>
                  <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Docente di Matematica, Milano</div>
                </div>
              </div>
              <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>
                "DocenteDoc AI mi ha fatto risparmiare ore settimanali nella preparazione delle lezioni. L'AI genera contenuti di qualità eccellente!"
              </p>
            </div>

            <div style={{ borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline"}}>
              <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['4'], marginBottom: layers.ref.spacing['4']}}>
                <div style={{width: ref.spacing[48], height: ref.spacing[48], backgroundColor: "layers.sys.colors.secondary", borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center", color: "layers.sys.colors.on-secondary", fontWeight: "bold"}}>GB</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }}>Prof. Giovanni Bianchi</div>
                  <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Docente di Italiano, Roma</div>
                </div>
              </div>
              <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>
                "La sicurezza dei dati è fondamentale. Con DocenteDoc, tutto rimane offline e sotto il mio controllo."
              </p>
            </div>
          </div>

          {/* Stats */}
          <div  style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: layers.ref.spacing['6']}}>
            <div style={{ textAlign: "center" }}>
              <div  style={{color: "layers.sys.colors.primary", fontWeight: "900"}}>10K+</div>
              <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Docenti</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div  style={{color: "layers.sys.colors.secondary", fontWeight: "900"}}>50K+</div>
              <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Lezioni Generate</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div  style={{color: "layers.sys.colors.tertiary", fontWeight: "900"}}>95%</div>
              <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Soddisfazione</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div  style={{color: "layers.sys.colors.primary", fontWeight: "900"}}>4.8★</div>
              <div style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Valutazione</div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section
        id="login-section"
         style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderTop: "1px solid layers.sys.colors.outline"}}
      >
        <div  style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{textAlign: "center", marginBottom: layers.ref.spacing['8']}}>
            Inizia il tuo viaggio con l'AI didattica
          </h2>

          {/* Institutional login */}
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: layers.ref.spacing['4'], marginBottom: layers.ref.spacing['6']}}>
            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              Accesso istituzionale
            </p>
            <div
              ref={signInButtonRef}
               style={{ width: "100%", display: "flex", justifyContent: "center" }}
            />
          </div>

          {/* Divider */}
          <div style={{display: "flex", alignItems: "center", marginBottom: layers.ref.spacing['6']}}>
            <div  style={{flexGrow: "1", borderTop: "1px solid layers.sys.colors.outline"}} />
            <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant/40 }} style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Oppure
            </span>
            <div  style={{flexGrow: "1", borderTop: "1px solid layers.sys.colors.outline"}} />
          </div>

          {/* Manual login */}
          <form
            onSubmit={handleManualSubmit}
            style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['4']}}
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
              style={{ borderRadius: ref.shape[] }}
            >
              <span  style={{display: "flex", alignItems: "center", justifyContent: "center", textTransform: "uppercase", fontWeight: "bold", gap: layers.ref.spacing['2']}}>
                Entra Gratuitamente
                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_forward</span>
              </span>
            </M3Button>
          </form>

          {/* Footer */}
          <footer  style={{ textAlign: "center" }}>
            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant/40 }} style={{ fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              v4.0.0-rc1 • PWA Offline-First
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default SignInScreen;



