// MD3 Gold Compliant — solo token MD3, nessun valore hardcoded
// Onboarding wizard mostrato al primo avvio dell'app
import React, { useState, useRef, useEffect } from 'react';
import { TimetableSettings } from '../types';

interface OnboardingWizardProps {
  settings: TimetableSettings;
  onComplete: (updates: Partial<TimetableSettings>) => void;
}

type OnboardingStep = 1 | 2 | 3;

const TOTAL_STEPS: OnboardingStep = 3;

const DISCIPLINE_DEFAULTS = [
  'Italiano', 'Matematica', 'Storia', 'Geografia', 'Scienze',
  'Inglese', 'Arte', 'Musica', 'Educazione Fisica', 'Tecnologia',
  'Fisica', 'Chimica', 'Filosofia', 'Diritto', 'Informatica',
];

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ settings, onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [nome, setNome] = useState(settings.nomeInsegnante ?? '');
  const [cognome, setCognome] = useState(settings.cognomeInsegnante ?? '');
  const [istituto, setIstituto] = useState(settings.nomeIstituto ?? '');
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(
    settings.disciplines?.length ? settings.disciplines : []
  );
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleComplete = () => {
    onComplete({
      nomeInsegnante: nome.trim() || settings.nomeInsegnante,
      cognomeInsegnante: cognome.trim() || settings.cognomeInsegnante,
      nomeIstituto: istituto.trim() || settings.nomeIstituto,
      disciplines: selectedDisciplines.length ? selectedDisciplines : settings.disciplines,
      onboarded: true,
    });
  };

  const handleSkip = () => onComplete({ onboarded: true });

  // Escape → skip wizard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleSkip(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus trap — Tab/Shift+Tab rimane dentro il dialog
  useEffect(() => {
    const container = dialogRef.current;
    if (!container) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>('button, input, a, [tabindex]:not([tabindex="-1"])')
      ).filter(el => !(el as HTMLButtonElement).disabled);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    container.addEventListener('keydown', onKey);
    return () => container.removeEventListener('keydown', onKey);
  }, []);

  const toggleDiscipline = (d: string) =>
    setSelectedDisciplines(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 'var(--md-sys-z-modal, 600)' as unknown as number,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--md-sys-color-scrim)',
    padding: 'var(--md-sys-spacing-4)',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--md-sys-color-surface)',
    borderRadius: 'var(--md-sys-shape-corner-extra-large)',
    boxShadow: 'var(--md-sys-elevation-level3)',
    padding: 'var(--md-sys-spacing-8)',
    width: 'var(--md-sys-percent-full)',
    maxWidth: 'var(--md-sys-layout-dialog-compact-max-width)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--md-sys-spacing-6)',
  };

  const inputStyle: React.CSSProperties = {
    width: 'var(--md-sys-percent-full)',
    padding: 'var(--md-sys-spacing-4)',
    borderRadius: 'var(--md-sys-shape-corner-small)',
    border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
    backgroundColor: 'var(--md-sys-color-surface-container-low)',
    color: 'var(--md-sys-color-on-surface)',
    fontFamily: 'var(--md-sys-typescale-body-large-font, inherit)',
    fontSize: 'var(--md-sys-typescale-body-large-size)',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    color: 'var(--md-sys-color-on-surface-variant)',
    fontFamily: 'var(--md-sys-typescale-label-medium-font, inherit)',
    fontSize: 'var(--md-sys-typescale-label-medium-size)',
    marginBottom: 'var(--md-sys-spacing-2)',
    display: 'block',
  };

  const primaryBtnStyle: React.CSSProperties = {
    padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-6)',
    borderRadius: 'var(--md-sys-shape-corner-full)',
    border: 'none',
    backgroundColor: 'var(--md-sys-color-primary)',
    color: 'var(--md-sys-color-on-primary)',
    fontFamily: 'var(--md-sys-typescale-label-large-font, inherit)',
    fontSize: 'var(--md-sys-typescale-label-large-size)',
    fontWeight: 'var(--md-sys-typescale-weight-bold)',
    cursor: 'pointer',
    minWidth: 'var(--md-sys-spacing-20)',
    minHeight: 'var(--md-sys-spacing-11)',
    transition: 'background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
  };

  const textBtnStyle: React.CSSProperties = {
    ...primaryBtnStyle,
    backgroundColor: 'transparent',
    color: 'var(--md-sys-color-primary)',
  };

  // Progress indicator
  const progressBar = (
    <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-2)', justifyContent: 'center' }}>
      {([1, 2, 3] as OnboardingStep[]).map(s => (
        <div
          key={s}
          style={{
            height: 'var(--md-sys-spacing-1)',
            flex: 1,
            borderRadius: 'var(--md-sys-shape-corner-full)',
            backgroundColor: s <= step
              ? 'var(--md-sys-color-primary)'
              : 'var(--md-sys-color-outline-variant)',
          }}
        />
      ))}
    </div>
  );

  return (
    <div ref={dialogRef} style={overlayStyle} role="dialog" aria-modal="true" aria-label="Benvenuto in DocenteDoc AI">
      <div style={cardStyle}>
        {progressBar}

        {/* STEP 1 — Identificazione */}
        {step === 1 && (
          <>
            <div>
              <p style={{ color: 'var(--md-sys-color-primary)', fontFamily: 'var(--md-sys-typescale-label-large-font, inherit)', marginBottom: 'var(--md-sys-spacing-2)' }}>
                Passo 1 di {TOTAL_STEPS}
              </p>
              <h2 style={{ color: 'var(--md-sys-color-on-surface)', fontFamily: 'var(--md-sys-typescale-headline-small-font, inherit)', fontSize: 'var(--md-sys-typescale-headline-small-font-size)', margin: '0 0 var(--md-sys-spacing-2)' }}>
                Benvenuto in DocenteDoc AI 👋
              </h2>
              <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'var(--md-sys-typescale-body-medium-font, inherit)' }}>
                Configuriamo insieme il tuo profilo docente. Puoi completare o saltare in qualsiasi momento.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
              <div>
                <label htmlFor="onb-nome" style={labelStyle}>Nome</label>
                <input
                  id="onb-nome"
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Es. Maria"
                  style={inputStyle}
                  autoFocus
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="onb-cognome" style={labelStyle}>Cognome</label>
                <input
                  id="onb-cognome"
                  type="text"
                  value={cognome}
                  onChange={e => setCognome(e.target.value)}
                  placeholder="Es. Rossi"
                  style={inputStyle}
                  autoComplete="family-name"
                />
              </div>
              <div>
                <label htmlFor="onb-istituto" style={labelStyle}>Nome istituto</label>
                <input
                  id="onb-istituto"
                  type="text"
                  value={istituto}
                  onChange={e => setIstituto(e.target.value)}
                  placeholder="Es. I.C. Manzoni"
                  style={inputStyle}
                  autoComplete="organization"
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button style={textBtnStyle} onClick={handleSkip} type="button">Salta tutto</button>
              <button style={primaryBtnStyle} onClick={() => setStep(2)} type="button">Avanti</button>
            </div>
          </>
        )}

        {/* STEP 2 — Materie */}
        {step === 2 && (
          <>
            <div>
              <p style={{ color: 'var(--md-sys-color-primary)', fontFamily: 'var(--md-sys-typescale-label-large-font, inherit)', marginBottom: 'var(--md-sys-spacing-2)' }}>
                Passo 2 di {TOTAL_STEPS}
              </p>
              <h2 style={{ color: 'var(--md-sys-color-on-surface)', fontFamily: 'var(--md-sys-typescale-headline-small-font, inherit)', fontSize: 'var(--md-sys-typescale-headline-small-font-size)', margin: '0 0 var(--md-sys-spacing-2)' }}>
                Le tue materie
              </h2>
              <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'var(--md-sys-typescale-body-medium-font, inherit)' }}>
                Seleziona le discipline che insegni (puoi modificarle in Impostazioni).
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-2)', maxHeight: 'var(--md-sys-viewport-height-30)', overflowY: 'auto' }}>
              {DISCIPLINE_DEFAULTS.map(d => {
                const selected = selectedDisciplines.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDiscipline(d)}
                    style={{
                      padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
                      borderRadius: 'var(--md-sys-shape-corner-full)',
                      border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
                      cursor: 'pointer',
                      backgroundColor: selected ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                      color: selected ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
                      fontFamily: 'var(--md-sys-typescale-label-medium-font, inherit)',
                      fontSize: 'var(--md-sys-typescale-label-medium-size)',
                      fontWeight: selected ? 'var(--md-sys-typescale-weight-bold)' : 'var(--md-sys-typescale-weight-medium)',
                      transition: 'background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
                    }}
                    aria-pressed={selected}
                  >
                    {selected && <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-label-medium-size)', verticalAlign: 'middle', marginRight: 'var(--md-sys-spacing-1)' }}>check</span>}
                    {d}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button style={textBtnStyle} onClick={() => setStep(1)} type="button">Indietro</button>
              <button style={primaryBtnStyle} onClick={() => setStep(3)} type="button">Avanti</button>
            </div>
          </>
        )}

        {/* STEP 3 — Pronto */}
        {step === 3 && (
          <>
            <div style={{ textAlign: 'center', padding: 'var(--md-sys-spacing-4) 0' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-spacing-16)', color: 'var(--md-sys-color-primary)', display: 'block', marginBottom: 'var(--md-sys-spacing-4)' }}>
                check_circle
              </span>
              <p style={{ color: 'var(--md-sys-color-primary)', fontFamily: 'var(--md-sys-typescale-label-large-font, inherit)', marginBottom: 'var(--md-sys-spacing-2)' }}>
                Passo 3 di {TOTAL_STEPS}
              </p>
              <h2 style={{ color: 'var(--md-sys-color-on-surface)', fontFamily: 'var(--md-sys-typescale-headline-small-font, inherit)', fontSize: 'var(--md-sys-typescale-headline-small-font-size)', margin: '0 0 var(--md-sys-spacing-4)' }}>
                Tutto pronto{nome ? `, ${nome}` : ''}!
              </h2>
              <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'var(--md-sys-typescale-body-medium-font, inherit)' }}>
                Puoi sempre modificare il tuo profilo in <strong>Impostazioni</strong>. Buon lavoro!
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)', alignItems: 'center' }}>
              <button style={primaryBtnStyle} onClick={handleComplete} type="button">
                Inizia a usare DocenteDoc AI
              </button>
              <button style={textBtnStyle} onClick={() => setStep(2)} type="button">Indietro</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
