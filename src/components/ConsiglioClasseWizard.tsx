
import React, { useState, useMemo } from 'react';
import { Studente, Valutazione, TimetableSettings, AiSettings, Report, ValutazioneCompetenza, PeriodoValutazione } from '../types';
import { generateCouncilDataPdf, viewPdfInNewTab } from '../utils/documentUtils';
import { 
    M3Dialog, 
    M3DialogContent, 
    M3DialogActions, 
    M3Button, 
    TabGroup, 
    SelectField, 
    InfoCard 
} from './ui';

interface ConsiglioClasseWizardProps {
    onClose: () => void;
    userClasses: string[];
    students: Studente[];
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
    onSaveReport: (report: Report) => void;
}

const ConsiglioClasseWizard: React.FC<ConsiglioClasseWizardProps> = (props) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedClass, setSelectedClass] = useState<string>(props.userClasses[0] || '');
    const [periodo, setPeriodo] = useState<PeriodoValutazione>('primo-quadrimestre');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const classStudents = useMemo(() => {
        return props.students.filter(s => s.classe === selectedClass);
    }, [selectedClass, props.students]);
    
    const handleGeneratePdf = async () => {
        if (!selectedClass) return;
        setIsLoading(true);
        setLoadingMessage('Aggregazione dati e creazione PDF...');
        try {
            const blob = await generateCouncilDataPdf(
                selectedClass,
                periodo,
                classStudents,
                props.evaluations,
                props.competencyEvaluations,
                props.settings
            );
            viewPdfInNewTab(blob);
            props.onClose();
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Errore durante la generazione del PDF.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep1 = () => (
        <>
            <M3DialogContent style={{ gap: "var(--md-sys-spacing-6)" }}>
                <InfoCard 
                    title="Seleziona il contesto" 
                    description="Scegli la classe e il periodo di riferimento per il quale desideri generare il report." 
                    icon="tune"
                    variant="surface"
                    className="!p-6"
                />
                
                <SelectField 
                    id="council-class-select"
                    label="Classe" 
                    value={selectedClass} 
                    onChange={e => setSelectedClass(e.target.value)}
                >
                    {props.userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </SelectField>

                 <div style={{ gap: "var(--md-sys-spacing-2)" }}>
                    <label className="m3-label-small tracking-[0.2em]" style={{ color: "var(--md-sys-color-primary)", fontWeight: "900", textTransform: "uppercase", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>Periodo di Valutazione</label>
                    <TabGroup
                        tabs={[
                            { id: 'primo-quadrimestre', label: 'Primo Quadrimestre (1Q)' },
                            { id: 'secondo-quadrimestre', label: 'Scrutinio Finale (2Q)' }
                        ]}
                        activeTab={periodo}
                        onTabChange={(id) => setPeriodo(id as PeriodoValutazione)}
                        variant="primary"
                        style={{ width: "100%" }}
                    />
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button variant="text" onClick={props.onClose}>Annulla</M3Button>
                <M3Button 
                    variant="filled" 
                    onClick={() => setStep(2)} 
                    disabled={!selectedClass}
                    endIcon={<span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_forward</span>}
                >
                    Continua
                </M3Button>
            </M3DialogActions>
        </>
    );

    const renderStep2 = () => (
        <>
            <M3DialogContent style={{ gap: "var(--md-sys-spacing-6)" }}>
                <div className="bg-primary-container/20 rounded-[var(--md-sys-shape-corner-extra-large)] border-primary/20" style={{ padding: "var(--md-sys-spacing-5)", border: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <p className="text-[9px]" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-primary)" }}>Context Active</p>
                        <h3 className="m3-title-large text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900" }}>{selectedClass} • {periodo === 'primo-quadrimestre' ? '1Q' : 'Finale'}</h3>
                    </div>
                    <M3Button variant="tonal" onClick={() => setStep(1)} className="!h-10 !px-4" style={{ fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>Cambia</M3Button>
                </div>

                <div className="action-list" style={{ gap: "var(--md-sys-spacing-3)" }}>
                    <button onClick={handleGeneratePdf} className="op-tile op-tile-variant-primary !bg-surface shadow-[var(--md-sys-elevation-level1)] group rounded-[var(--md-sys-shape-corner-small)] hover:shadow-[var(--md-sys-elevation-level1)]" style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", width: "100%", textAlign: "left" }}>
                        <div className="op-tile-icon-container"><span className="material-symbols-outlined group-hover:scale-110" style={{ transition: "transform 300ms" }}>picture_as_pdf</span></div>
                        <div className="op-tile-content">
                            <p className="op-tile-title">Tabellone Dati (PDF)</p>
                            <p className="op-tile-subtitle">Medie, trend e rilevazioni competenze.</p>
                        </div>
                    </button>
                </div>
                
                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant italic" style={{ textAlign: "center", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>
                    Il report verrà generato e aperto in una nuova scheda del browser.
                </p>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button variant="text" onClick={() => setStep(1)}>Indietro</M3Button>
            </M3DialogActions>
        </>
    );
    
    if (isLoading) {
        return (
             <M3Dialog
                 onClose={() => {}}
                 title=""
                 maxWidth="sm"
             >
                <M3DialogContent className="py-8" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <div className="animate-spin" style={{ borderRadius: "9999px", height: "4rem", width: "4rem", borderBottom: "4px solid var(--md-sys-color-outline)", borderColor: "var(--md-sys-color-primary)", marginBottom: "var(--md-sys-spacing-6)" }}></div>
                    <p className="m3-title-medium animate-pulse" style={{ fontWeight: "900", color: "var(--md-sys-color-primary)" }}>{loadingMessage}</p>
                </M3DialogContent>
            </M3Dialog>
        )
    }

    return (
        <M3Dialog
            onClose={props.onClose}
            title="Wizard Report Consiglio"
            maxWidth="xl"
        >
            {step === 1 ? renderStep1() : renderStep2()}
        </M3Dialog>
    );
};

export default ConsiglioClasseWizard;


