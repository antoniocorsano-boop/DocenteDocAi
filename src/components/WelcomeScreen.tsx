import React, { useState } from 'react';
import Logo from './Logo';
import { SCHOOL_TYPES_DISCIPLINES } from '../constants';
import { ActionTile, InfoCard, TextField, SelectField, M3Button, M3IconButton } from './M3Components';

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
      <div className="m3-auth-card !max-w-lg md:!max-w-2xl animate-in fade-in zoom-in-95 duration-300">
          <div className="mb-8 md:mb-12 transform scale-110 md:scale-125">
            <Logo />
          </div>
          <h1 className="m3-headline-medium font-black mb-2">Benvenuto, Docente</h1>
          <p className="m3-body-medium md:m3-body-large font-bold opacity-50 uppercase tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-[11px] mb-8 md:mb-12">
              Configuriamo il tuo spazio di lavoro
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
              <ActionTile 
                title="Wizard Guidato"
                subtitle="Passo dopo passo"
                icon="auto_fix_high"
                variant="primary"
                onClick={() => setMode('wizard')}
                className="!py-8 md:!py-10 !rounded-[28px] md:!rounded-[40px] shadow-lg"
              />
              <ActionTile 
                title="Accesso Rapido"
                subtitle="Configurazione manuale"
                icon="bolt"
                variant="surface"
                onClick={() => setMode('quick')}
                className="!py-8 md:!py-10 !rounded-[28px] md:!rounded-[40px] shadow-lg"
              />
          </div>
          
          <InfoCard 
            title="I tuoi dati sono al sicuro"
            description="Tutto ciò che inserisci rimane salvato localmente sul tuo dispositivo. Nessun dato personale viene inviato ai nostri server."
            icon="security"
            variant="surface"
            className="mt-8 md:mt-12 !p-4 md:!p-6 !rounded-[24px] md:!rounded-[32px]"
          />
      </div>
  );

  const renderWizard = () => (
    <form onSubmit={handleWizardSubmit} className="m3-auth-card">
        <div className="w-full mb-10">
            <div className="flex justify-between items-center mb-8">
                <M3IconButton icon="arrow_back" ariaLabel="Indietro" onClick={() => { if(step > 1) setStep(s => s-1); else setMode('selection'); }} />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Passo {step} di 3</span>
                <div className="w-10"></div>
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
                    >
                        {Object.keys(SCHOOL_TYPES_DISCIPLINES).map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </SelectField>
                    <p className="text-[10px] font-bold text-on-surface-variant mt-3 px-2 uppercase opacity-60">Servirà per suggerire le materie corrette.</p>
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
                    />
                </div>
            )}
        </div>

        <div className="w-full flex gap-4">
            {step < 3 ? (
                <M3Button 
                    type="button" 
                    variant="filled"
                    color="primary"
                    className="w-full !h-14 font-black"
                    onClick={() => setStep(s => s + 1)} 
                    disabled={(step === 1 && !name) || (step === 3 && !className)}
                    aria-label="Continua"
                >
                    Continua
                    <span className="material-symbols-outlined ml-2 font-black">arrow_forward</span>
                </M3Button>
            ) : (
                <M3Button 
                    type="submit" 
                    variant="filled"
                    color="primary"
                    className="w-full !h-14 font-black"
                    disabled={!className}
                    aria-label="Inizia Ora"
                >
                    Inizia Ora
                    <span className="material-symbols-outlined ml-2 font-black">check</span>
                </M3Button>
            )}
        </div>
    </form>
  );

  const renderQuick = () => (
      <form onSubmit={handleQuickSubmit} className="m3-auth-card">
            <M3IconButton icon="arrow_back" ariaLabel="Indietro" onClick={() => setMode('selection')} className="absolute top-4 left-4 md:top-6 md:left-6" />
          
          <div className="mb-8 md:mb-12 transform scale-110 md:scale-125">
            <Logo />
          </div>
          
          <h1 className="m3-headline-medium font-black mb-6 md:mb-8">Accesso Rapido</h1>
          
          <div className="w-full mb-8 md:mb-10">
            <TextField 
                id="quick-name"
                label="Nome Docente"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Es. Prof. Rossi"
                required
                autoFocus
            />
          </div>

                    <M3Button type="submit" variant="filled" color="primary" className="w-full !h-16 font-black shadow-xl" aria-label="Entra nella Dashboard">
                        Entra nella Dashboard
                    </M3Button>
      </form>
  );

  return (
    <div className="m3-auth-screen">
        {mode === 'selection' && renderSelection()}
        {mode === 'wizard' && renderWizard()}
        {mode === 'quick' && renderQuick()}
    </div>
  );
};

export default WelcomeScreen;
