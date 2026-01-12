import React, { useState } from 'react';
import Logo from './Logo';
import { SCHOOL_TYPES_DISCIPLINES } from '../constants';
import { ActionTile, InfoCard, TextField, SelectField, M3Button, M3IconButton } from './ui';

interface WelcomeScreenProps {
  onSetupComplete: (data: { name: string; schoolType?: string; firstClass?: string; isGuided: boolean }) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSetupComplete }) => {
  const [mode, setMode] = useState<'selection' | 'wizard' | 'quick'>('selection');
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [schoolType, setSchoolType] = useState(Object.keys(SCHOOL_TYPES_DISCIPLINES)[0]);
  const [className, setClassName] = useState('');

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetupComplete({ 
        name, 
        schoolType, 
        firstClass: className, 
        isGuided: true 
    });
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (name.trim()) {
          onSetupComplete({ 
              name, 
              isGuided: false 
          });
      }
  };

  const renderSelection = () => (
      <div className="relative z-10 max-w-lg md:max-w-2xl md:p-12 mx-4 bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-2xl rounded-5xl border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)] animate-in fade-in zoom-in-95 duration-500" style={{ width: "100%", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div className="mb-10 md:mb-14 bg-[var(--md-sys-color-surface-container-high)]/50 rounded-4xl border-[var(--md-sys-color-outline-variant)]/20 shadow-inner transform scale-110 md:scale-125" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
            <Logo />
          </div>
          <h1 className="m3-headline-medium text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900", letterSpacing: "-0.005em", marginBottom: "var(--md-sys-spacing-8)" }}>Benvenuto, Docente</h1>
          <p className="text-[10px] md:text-[11px] text-[var(--md-sys-color-on-surface)]-variant/60 tracking-[0.3em] mb-10 md:mb-14" style={{ fontWeight: "900", textTransform: "uppercase" }}>
              Configuriamo il tuo spazio di lavoro
          </p>

          <div className="md:grid-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)", width: "100%" }}>
              <ActionTile 
                title="Wizard Guidato"
                subtitle="Passo dopo passo"
                icon="auto_fix_high"
                variant="primary"
                onClick={() => setMode('wizard')}
                className="!py-10 md:!py-12 !rounded-4xl shadow-[var(--md-sys-elevation-level3)] shadow-primary/10 hover:shadow-primary/20" style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
              <ActionTile 
                title="Accesso Rapido"
                subtitle="Configurazione manuale"
                icon="bolt"
                variant="surface"
                onClick={() => setMode('quick')}
                className="!py-10 md:!py-12 !rounded-4xl shadow-[var(--md-sys-elevation-level3)] shadow-surface-container-highest/10 hover:shadow-surface-container-highest/20" style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
          </div>
          
          <InfoCard 
            title="I tuoi dati sono al sicuro"
            description="Tutto ciò che inserisci rimane salvato localmente sul tuo dispositivo. Nessun dato personale viene inviato ai nostri server."
            icon="security"
            variant="surface"
            className="mt-10 md:mt-14 !p-6 md:!p-8 !rounded-[var(--md-sys-shape-corner-large)] bg-[var(--md-sys-color-surface-container-low)]/50 border-[var(--md-sys-color-outline-variant)]/10"
          />
      </div>
  );

  const renderWizard = () => (
    <form onSubmit={handleWizardSubmit} className="relative z-10 max-w-md md:p-10 mx-4 bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-2xl rounded-5xl border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)] animate-in slide-in-from-bottom-10 duration-500" style={{ width: "100%", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
        <div className="mb-10" style={{ width: "100%" }}>
            <div className="mb-10" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <M3IconButton icon="arrow_back" ariaLabel="Indietro" onClick={() => { if(step > 1) setStep(s => s-1); else setMode('selection'); }} className="bg-[var(--md-sys-color-surface-container-high)]/50" />
                <span className="text-[10px] tracking-[0.4em]" style={{ fontWeight: "900", color: "var(--md-sys-color-primary)", textTransform: "uppercase" }}>Passo {step} di 3</span>
                <div style={{ width: "3rem" }}></div>
            </div>
            
            {step === 1 && (
                <div className="animate-in slide-in-from-right fade-in duration-300">
                    <TextField 
                        id="wizard-name"
                        label="Come ti chiami?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Es. Prof. Rossi"
                        autoFocus
                        className="bg-[var(--md-sys-color-surface-container-high)]/50"
                    />
                </div>
            )}

            {step === 2 && (
                <div className="animate-in slide-in-from-right fade-in duration-300">
                    <SelectField 
                        id="wizard-school-type"
                        label="Tipo di Scuola"
                        value={schoolType}
                        onChange={(e) => setSchoolType(e.target.value)}
                        className="bg-[var(--md-sys-color-surface-container-high)]/50"
                    >
                        {Object.keys(SCHOOL_TYPES_DISCIPLINES).map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </SelectField>
                    <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant/40" style={{ fontWeight: "900", marginTop: "var(--md-sys-spacing-4)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Servirà per suggerire le materie corrette.</p>
                </div>
            )}

            {step === 3 && (
                <div className="animate-in slide-in-from-right fade-in duration-300">
                    <TextField 
                        id="wizard-class-name"
                        label="La tua classe principale"
                        value={className}
                        onChange={(e) => setClassName(e.target.value.toUpperCase())}
                        placeholder="Es. 3A"
                        autoFocus
                        containerClassName="uppercase"
                        className="bg-[var(--md-sys-color-surface-container-high)]/50"
                    />
                </div>
            )}
        </div>

        <div style={{ width: "100%" }}>
            {step < 3 ? (
                <M3Button 
                    type="button" 
                    variant="filled"
                    className="py-6 rounded-[var(--md-sys-shape-corner-extra-large)] tracking-[0.2em] shadow-[var(--md-sys-elevation-level2)] shadow-primary/20" style={{ width: "100%", fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase" }}
                    onClick={() => setStep(s => s + 1)} 
                    disabled={(step === 1 && !name) || (step === 3 && !className)}
                    aria-label="Continua"
                >
                    Continua
                    <span className="material-symbols-outlined ml-3" style={{ fontWeight: "900", fontSize: "1.25rem" }}>arrow_forward</span>
                </M3Button>
            ) : (
                <M3Button 
                    type="submit" 
                    variant="filled"
                    className="py-6 rounded-[var(--md-sys-shape-corner-extra-large)] tracking-[0.2em] shadow-[var(--md-sys-elevation-level2)] shadow-primary/20" style={{ width: "100%", fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase" }}
                    disabled={!className}
                    aria-label="Inizia Ora"
                >
                    Inizia Ora
                    <span className="material-symbols-outlined ml-3" style={{ fontWeight: "900", fontSize: "1.25rem" }}>check</span>
                </M3Button>
            )}
        </div>
    </form>
  );

  const renderQuick = () => (
      <form onSubmit={handleQuickSubmit} className="relative z-10 max-w-md md:p-10 mx-4 bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-2xl rounded-5xl border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)] animate-in slide-in-from-bottom-10 duration-500" style={{ width: "100%", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <M3IconButton icon="arrow_back" ariaLabel="Indietro" onClick={() => setMode('selection')} className="absolute top-6 left-6 bg-[var(--md-sys-color-surface-container-high)]/50" />
          
          <div className="mb-10 bg-[var(--md-sys-color-surface-container-high)]/50 rounded-4xl border-[var(--md-sys-color-outline-variant)]/20 shadow-inner transform scale-110" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
            <Logo />
          </div>
          
          <h1 className="m3-headline-medium text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900", letterSpacing: "-0.005em", marginBottom: "var(--md-sys-spacing-8)" }}>Accesso Rapido</h1>
          <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant/60 tracking-[0.3em] mb-10" style={{ fontWeight: "900", textTransform: "uppercase" }}>Configurazione manuale</p>
          
          <div className="mb-10" style={{ width: "100%" }}>
            <TextField 
                id="quick-name"
                label="Nome Docente"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Es. Prof. Rossi"
                required
                autoFocus
                className="bg-[var(--md-sys-color-surface-container-high)]/50"
            />
          </div>

            <M3Button 
                type="submit" 
                variant="filled" 
                className="py-6 rounded-[var(--md-sys-shape-corner-extra-large)] tracking-[0.2em] shadow-[var(--md-sys-elevation-level2)] shadow-primary/20" style={{ width: "100%", fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase" }} 
                aria-label="Entra nella Dashboard"
            >
                Entra nella Dashboard
                <span className="material-symbols-outlined ml-3" style={{ fontWeight: "900", fontSize: "1.25rem" }}>login</span>
            </M3Button>
      </form>
  );

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--md-sys-color-surface)" }}>
        {/* Aura Ornaments */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] animate-pulse" style={{ borderRadius: "9999px" }}></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] animate-pulse" style={{ borderRadius: "9999px" }} style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-tertiary/5 blur-[150px]" style={{ borderRadius: "9999px" }}></div>

        {mode === 'selection' && renderSelection()}
        {mode === 'wizard' && renderWizard()}
        {mode === 'quick' && renderQuick()}
    </div>
  );
};

export default WelcomeScreen;


