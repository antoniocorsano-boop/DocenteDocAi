
import React, { useState, useMemo } from 'react';
import { Studente, Valutazione, TimetableSettings, AiSettings, Report, ValutazioneCompetenza, PeriodoValutazione } from '../types';
import { generateCouncilDataPdf, viewPdfInNewTab } from '../utils/documentUtils';
import { TabGroup, SelectField, InfoCard } from './M3Components';
import { M3Dialog } from './M3Dialog';


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
            <div className="dialog-content space-y-6">
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

                 <div className="space-y-2">
                    <label className="text-[11px] text-primary font-black uppercase tracking-[0.2em] px-2">Periodo di Valutazione</label>
                    <TabGroup
                        tabs={[
                            { id: 'primo-quadrimestre', label: 'Primo Quadrimestre (1Q)' },
                            { id: 'secondo-quadrimestre', label: 'Scrutinio Finale (2Q)' }
                        ]}
                        activeTab={periodo}
                        onTabChange={(id) => setPeriodo(id as PeriodoValutazione)}
                        variant="primary"
                        className="w-full"
                    />
                </div>
            </div>
            <div className="dialog-footer border-t border-outline-variant pt-4">
                <button onClick={props.onClose} className="button button-text rounded-lg hover:shadow-md transition-all">Annulla</button>
                <button onClick={() => setStep(2)} disabled={!selectedClass} className="button button-filled shadow-lg font-black rounded-lg hover:shadow-md transition-all">
                    Continua <span className="material-symbols-outlined ml-2">arrow_forward</span>
                </button>
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <div className="dialog-content space-y-6">
                <div className="p-5 bg-primary-container/20 rounded-3xl border border-primary/20 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary">Context Active</p>
                        <h3 className="m3-title-large font-black text-on-surface">{selectedClass} • {periodo === 'primo-quadrimestre' ? '1Q' : 'Finale'}</h3>
                    </div>
                    <button onClick={() => setStep(1)} className="button button-tonal !h-10 !px-4 text-xs font-bold uppercase rounded-lg hover:shadow-md transition-all">Cambia</button>
                </div>

                <div className="action-list space-y-3">
                    <button onClick={handleGeneratePdf} className="op-tile op-tile-variant-primary !bg-surface shadow-md group rounded-lg hover:shadow-md transition-all">
                        <div className="op-tile-icon-container"><span className="material-symbols-outlined group-hover:scale-110 transition-transform">picture_as_pdf</span></div>
                        <div className="op-tile-content">
                            <p className="op-tile-title">Tabellone Dati (PDF)</p>
                            <p className="op-tile-subtitle">Medie, trend e rilevazioni competenze.</p>
                        </div>
                    </button>
                </div>
                
                <p className="m3-body-small text-on-surface-variant italic text-center px-4">
                    Il report verrà generato e aperto in una nuova scheda del browser.
                </p>
            </div>
            <div className="dialog-footer">
                <button onClick={() => setStep(1)} className="button button-text rounded-lg hover:shadow-md transition-all">Indietro</button>
            </div>
        </>
    );
    
    if (isLoading) {
        return (
             <M3Dialog
                 onClose={() => {}}
                 title=""
                 maxWidth="sm"
             >
                <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-6"></div>
                    <p className="m3-title-medium font-black text-primary animate-pulse">{loadingMessage}</p>
                </div>
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
