
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
            <M3DialogContent style={{gap: 'var(--app-spacing-section)'}}>
                <InfoCard 
                    title="Seleziona il contesto" 
                    description="Scegli la classe e il periodo di riferimento per il quale desideri generare il report." 
                    icon="tune"
                    variant="surface"
                    
                />
                
                <SelectField 
                    id="council-class-select"
                    label="Classe" 
                    value={selectedClass} 
                    onChange={e => setSelectedClass(e.target.value)}
                >
                    {props.userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </SelectField>

                 <div style={{gap: 'var(--app-spacing-component)'}}>
                    <label  style={{color: "var(--app-color-primary)", fontWeight: "900", textTransform: "uppercase", paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)'}}>Periodo di Valutazione</label>
                    <TabGroup
                        tabs={[
                            { id: 'primo-quadrimestre', label: 'Primo Quadrimestre (1Q)' },
                            { id: 'secondo-quadrimestre', label: 'Scrutinio Finale (2Q)' }
                        ]}
                        activeTab={periodo}
                        onTabChange={(id) => setPeriodo(id as PeriodoValutazione)}
                        variant="primary"
                        style={{ width: "var(--app-layout-full)" }}
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
            <M3DialogContent style={{gap: 'var(--app-spacing-section)'}}>
                <div style={{ backgroundColor: sys.colors.primaryContainer/20, borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--app-spacing-touch)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <div>
                        <p style={{fontWeight: "900", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)", color: "var(--app-color-primary)"}}>Context Active</p>
                        <h3 style={{ color: 'var(--app-color-on-primary)' ,  fontWeight: "900" }}>{selectedClass} • {periodo === 'primo-quadrimestre' ? '1Q' : 'Finale'}</h3>
                    </div>
                    <M3Button variant="tonal" onClick={() => setStep(1)}  style={{ fontSize: "var(--md-sys-typescale-body-small-size)", fontWeight: "bold", textTransform: "uppercase" }}>Cambia</M3Button>
                </div>

                <div  style={{gap: 'var(--app-spacing-element)'}}>
                    <button onClick={handleGeneratePdf} style={{ borderRadius: 'var(--md-sys-shape-corner-large)' ,  transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)', width: "var(--app-layout-full)", textAlign: "left" }}>
                        <div ><span  style={{ transition: "transform var(--app-motion-standard)" }}>picture_as_pdf</span></div>
                        <div >
                            <p >Tabellone Dati (PDF)</p>
                            <p >Medie, trend e rilevazioni competenze.</p>
                        </div>
                    </button>
                </div>
                
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' , textAlign: "center", paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)'}}>
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
                <M3DialogContent  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <div  style={{borderRadius: 'var(--app-spacing-container)', height: 'var(--app-spacing-container)', width: 'var(--app-spacing-container)', borderBottom: "var(--app-border-thick) solid var(--md-sys-color-outline)", borderColor: "var(--app-color-primary)", marginBottom: 'var(--app-spacing-section)'}}></div>
                    <p  style={{fontWeight: "900", color: "var(--app-color-primary)"}}>{loadingMessage}</p>
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








