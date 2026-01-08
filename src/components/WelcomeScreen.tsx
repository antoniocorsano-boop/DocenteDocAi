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
      <div className="relative z-10 w-full max-w-lg md:max-w-2xl p-8 md:p-12 mx-4 bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-2xl rounded-5xl border border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-10 md:mb-14 p-6 bg-[var(--md-sys-color-surface-container-high)]/50 rounded-4xl border border-[var(--md-sys-color-outline-variant)]/20 shadow-inner transform scale-110 md:scale-125">
            <Logo />
          </div>
          <h1 className="m3-headline-medium font-black tracking-tight text-[var(--md-sys-color-on-surface)] mb-8">Benvenuto, Docente</h1>
          <p className="text-[10px] md:text-[11px] font-black text-[var(--md-sys-color-on-surface)]-variant/60 uppercase tracking-[0.3em] mb-10 md:mb-14">
              Configuriamo il tuo spazio di lavoro
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <ActionTile 
                title="Wizard Guidato"
                subtitle="Passo dopo passo"
                icon="auto_fix_high"
                variant="primary"
                onClick={() => setMode('wizard')}
                className="!py-10 md:!py-12 !rounded-4xl shadow-[var(--md-sys-elevation-level3)] shadow-primary/10 hover:shadow-primary/20 transition-all"
              />
              <ActionTile 
                title="Accesso Rapido"
                subtitle="Configurazione manuale"
                icon="bolt"
                variant="surface"
                onClick={() => setMode('quick')}
                className="!py-10 md:!py-12 !rounded-4xl shadow-[var(--md-sys-elevation-level3)] shadow-surface-container-highest/10 hover:shadow-surface-container-highest/20 transition-all"
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
    <form onSubmit={handleWizardSubmit} className="relative z-10 w-full max-w-md p-8 md:p-10 mx-4 bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-2xl rounded-5xl border border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)] animate-in slide-in-from-bottom-10 duration-500">
        <div className="w-full mb-10">
            <div className="flex justify-between items-center mb-10">
                <M3IconButton icon="arrow_back" ariaLabel="Indietro" onClick={() => { if(step > 1) setStep(s => s-1); else setMode('selection'); }} className="bg-[var(--md-sys-color-surface-container-high)]/50" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Passo {step} di 3</span>
                <div className="w-12"></div>
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
                    <p className="text-[10px] font-black text-[var(--md-sys-color-on-surface)]-variant/40 mt-4 px-4 uppercase tracking-widest">Servirà per suggerire le materie corrette.</p>
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

        <div className="w-full">
            {step < 3 ? (
                <M3Button 
                    type="button" 
                    variant="filled"
                    className="w-full py-6 rounded-[var(--md-sys-shape-corner-extra-large)] font-black text-xs uppercase tracking-[0.2em] shadow-[var(--md-sys-elevation-level2)] shadow-primary/20"
                    onClick={() => setStep(s => s + 1)} 
                    disabled={(step === 1 && !name) || (step === 3 && !className)}
                    aria-label="Continua"
                >
                    Continua
                    <span className="material-symbols-outlined ml-3 font-black text-xl">arrow_forward</span>
                </M3Button>
            ) : (
                <M3Button 
                    type="submit" 
                    variant="filled"
                    className="w-full py-6 rounded-[var(--md-sys-shape-corner-extra-large)] font-black text-xs uppercase tracking-[0.2em] shadow-[var(--md-sys-elevation-level2)] shadow-primary/20"
                    disabled={!className}
                    aria-label="Inizia Ora"
                >
                    Inizia Ora
                    <span className="material-symbols-outlined ml-3 font-black text-xl">check</span>
                </M3Button>
            )}
        </div>
    </form>
  );

  const renderQuick = () => (
      <form onSubmit={handleQuickSubmit} className="relative z-10 w-full max-w-md p-8 md:p-10 mx-4 bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-2xl rounded-5xl border border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)] flex flex-col items-center text-center animate-in slide-in-from-bottom-10 duration-500">
            <M3IconButton icon="arrow_back" ariaLabel="Indietro" onClick={() => setMode('selection')} className="absolute top-6 left-6 bg-[var(--md-sys-color-surface-container-high)]/50" />
          
          <div className="mb-10 p-6 bg-[var(--md-sys-color-surface-container-high)]/50 rounded-4xl border border-[var(--md-sys-color-outline-variant)]/20 shadow-inner transform scale-110">
            <Logo />
          </div>
          
          <h1 className="m3-headline-medium font-black tracking-tight text-[var(--md-sys-color-on-surface)] mb-8">Accesso Rapido</h1>
          <p className="text-[10px] font-black text-[var(--md-sys-color-on-surface)]-variant/60 uppercase tracking-[0.3em] mb-10">Configurazione manuale</p>
          
          <div className="w-full mb-10">
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
                className="w-full py-6 rounded-[var(--md-sys-shape-corner-extra-large)] font-black text-xs uppercase tracking-[0.2em] shadow-[var(--md-sys-elevation-level2)] shadow-primary/20" 
                aria-label="Entra nella Dashboard"
            >
                Entra nella Dashboard
                <span className="material-symbols-outlined ml-3 font-black text-xl">login</span>
            </M3Button>
      </form>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface overflow-hidden">
        {/* Aura Ornaments */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-tertiary/5 blur-[150px] rounded-full"></div>

        {mode === 'selection' && renderSelection()}
        {mode === 'wizard' && renderWizard()}
        {mode === 'quick' && renderQuick()}
    </div>
  );
};

export default WelcomeScreen;
