
import React, { useState, useMemo } from 'react';
import { Studente, Uda, TimetableSettings, AiSettings, Report, EventoCalendario, Lezione, KnowledgeBaseEntry, PianoInclusione } from '../types';
import { generateClassPlanningDocument, generateSituazionePartenza, suggestAnnualPlan, generateMethodologyStrategies } from '../services/aiService';
import { generateHtmlDocxBlob, saveAs } from '../utils/documentUtils';
import AiThinkingGem from './AiThinkingGem';
import { InfoCard } from './M3Components';
import { useUIStore } from '../stores/useUIStore';

interface AnnualPlanningWizardProps {
    onClose: () => void;
    userClasses: string[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
    onSaveUda: (uda: Uda) => void;
    onAddLessons: (lessons: Lezione[]) => void;
    onSaveReport: (report: Report) => void;
    onSaveEvent: (event: EventoCalendario) => void;
    knowledgeBase: KnowledgeBaseEntry[];
    students: Studente[];
    pianiInclusione: Record<string, PianoInclusione>;
}

type WizardStep = 'context' | 'situation' | 'methodology' | 'sequence' | 'preview' | 'document';

const AnnualPlanningWizard: React.FC<AnnualPlanningWizardProps> = ({
    onClose, userClasses, settings, aiSettings, onSaveUda, onAddLessons, onSaveReport, onSaveEvent, knowledgeBase, students, pianiInclusione
}) => {
    const [step, setStep] = useState<WizardStep>('context');
    
    // UI Store for toast notifications
    const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));
    
    // Step 1: Context
    const [selectedClass, setSelectedClass] = useState<string>(userClasses[0] || '');
    const [selectedSubject, setSelectedSubject] = useState<string>(settings.disciplines[0] || '');
    const [selectedKbFiles, setSelectedKbFiles] = useState<string[]>([]);
    
    // Step 2: Situation (AI Assisted)
    const [situationTags, setSituationTags] = useState<string[]>([]);
    const [situationNotes, setSituationNotes] = useState('');
    const [situationText, setSituationText] = useState('');
    const [isGeneratingSituation, setIsGeneratingSituation] = useState(false);

    // Step 3: Methodology & Goals
    const [methodology, setMethodology] = useState('Lezione frontale partecipata, Cooperative Learning, Laboratorio.');
    const [isGeneratingMethodology, setIsGeneratingMethodology] = useState(false);

    // Step 4: UDA Sequence
    interface PlannedUda {
        id: string;
        title: string;
        hours: number;
        topic: string;
    }
    const [plannedUdas, setPlannedUdas] = useState<PlannedUda[]>([]);
    const [newUdaTitle, setNewUdaTitle] = useState('');
    const [newUdaHours, setNewUdaHours] = useState(10);
    const [hoursPerWeek, setHoursPerWeek] = useState(3);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [showSequenceHelp, setShowSequenceHelp] = useState(false); // NEW: Context Help State

    // Step 5: Milestones
    const currentYear = new Date().getMonth() >= 8 ? new Date().getFullYear() : new Date().getFullYear() - 1;
    const [term1End, setTerm1End] = useState<string>(`${currentYear}-12-22`);
    const [term2End, setTerm2End] = useState<string>(`${currentYear + 1}-06-08`);
    
    // Step 6: Preview
    const [schedulePreview, setSchedulePreview] = useState<{ uda: PlannedUda, start: string, end: string }[]>([]);
    
    // General
    const [isProcessing, setIsProcessing] = useState(false);

    // --- HELPERS ---
    const recommendedFiles = useMemo(() => knowledgeBase.filter(kb => 
        kb.fileName.toLowerCase().includes('programmazione') || 
        kb.fileName.toLowerCase().includes('ptof') ||
        kb.fileName.toLowerCase().includes('curricol') ||
        kb.category === 'programmazione' || 
        kb.category === 'normativa'
    ), [knowledgeBase]);

    const toggleKbFile = (id: string) => {
        setSelectedKbFiles(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const SITUATION_TAGS = [
        "Numerosa", "Poca partecipazione", "Vivace", "Livello Eterogeneo", 
        "Buona preparazione base", "Lacune diffuse", "Presenza BES/DSA", 
        "Studenti Stranieri (NAI)", "Collaborativa", "Difficoltà relazionali"
    ];

    // --- LOGIC ---

    const handleGenerateSituation = async () => {
        setIsGeneratingSituation(true);
        try {
            const text = await generateSituazionePartenza(aiSettings, {
                classe: selectedClass,
                tags: situationTags,
                notes: situationNotes
            });
            setSituationText(text);
        } catch (e) {
            console.error("Errore generazione testo situazione:", e);
            showToast("Errore durante la generazione del testo della situazione di partenza. Riprova.", "error");
        } finally {
            setIsGeneratingSituation(false);
        }
    };

    const handleGenerateMethodology = async () => {
        setIsGeneratingMethodology(true);
        try {
            const text = await generateMethodologyStrategies(aiSettings, situationText || "Classe standard");
            setMethodology(text);
        } catch (e) {
            console.error("Errore generazione metodologia:", e);
            showToast("Errore durante la generazione delle strategie metodologiche. Riprova.", "error");
        } finally {
            setIsGeneratingMethodology(false);
        }
    };

    const handleGeneratePlanFromKb = async () => {
        const kbContent = knowledgeBase
            .filter(kb => selectedKbFiles.includes(kb.id))
            .map(kb => kb.content)
            .join('\n\n');
        
        if (!kbContent) {
            showToast("Seleziona almeno un documento dalla Knowledge Base (Step 1) per generare il piano.", "info");
            return;
        }

        setIsGeneratingPlan(true);
        try {
            const plan = await suggestAnnualPlan(aiSettings, kbContent, selectedSubject, selectedClass);
            if (plan.length > 0) {
                setPlannedUdas(plan.map((u, i) => ({...u, id: `plan-gen-${i}`})));
            } else {
                showToast("L'AI non ha trovato UDA nel documento. Puoi inserirle manualmente.", "info");
            }
        } catch (e) {
            console.error("Errore durante l'analisi del documento:", e);
            showToast("Errore durante l'analisi del documento. Riprova.", "error");
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    const addUdaToPlan = () => {
        if (!newUdaTitle.trim()) return;
        const newId = `temp-${Date.now()}`;
        setPlannedUdas([...plannedUdas, { id: newId, title: newUdaTitle, hours: newUdaHours, topic: newUdaTitle }]);
        setNewUdaTitle('');
        setNewUdaHours(10);
    };

    const updateUdaHours = (id: string, hours: number) => {
        setPlannedUdas(prev => prev.map(u => u.id === id ? { ...u, hours } : u));
    };

    const removeUdaFromPlan = (index: number) => {
        const list = [...plannedUdas];
        list.splice(index, 1);
        setPlannedUdas(list);
    };

    const calculateSchedule = () => {
        // Start around mid-September
        const currentDate = new Date(`${currentYear}-09-12`); 
        
        const schedule = plannedUdas.map(pUda => {
            const safeHoursPerWeek = Math.max(1, hoursPerWeek);
            const weeksNeeded = Math.ceil(pUda.hours / safeHoursPerWeek);
            
            const startDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + (weeksNeeded * 7));
            
            // Break for Christmas
            if (startDate.getMonth() < 11 && currentDate.getMonth() === 0) {
                currentDate.setDate(currentDate.getDate() + 14);
            }

            return {
                uda: pUda,
                start: startDate.toISOString().split('T')[0],
                end: currentDate.toISOString().split('T')[0]
            };
        });
        
        setSchedulePreview(schedule);
        setStep('preview');
    };

    const handleFinalize = async () => {
        setIsProcessing(true);
        try {
            for (const item of schedulePreview) {
                const newUda: Uda = {
                    id: `uda-gen-${Date.now()}-${Math.random()}`,
                    title: item.uda.title,
                    classe: selectedClass,
                    materia: selectedSubject,
                    introduction: `Unità di apprendimento su: ${item.uda.topic}`,
                    finalProduct: 'Verifica sommativa o elaborato',
                    competencyIds: [], 
                    phases: [
                        { id: 'ph1', title: 'Fase 1: Attivazione', description: 'Introduzione', activities: 'Lezione partecipata', duration: '2' },
                        { id: 'ph2', title: 'Fase 2: Svolgimento', description: 'Approfondimento', activities: 'Lezione ed esercizi', duration: (Math.max(1, item.uda.hours - 4)).toString() },
                        { id: 'ph3', title: 'Fase 3: Verifica', description: 'Valutazione', activities: 'Prova', duration: '2' }
                    ],
                    evaluation: 'Griglia di valutazione disciplinare',
                    tools: 'Libro di testo, LIM',
                    startDate: item.start,
                    endDate: item.end
                };
                onSaveUda(newUda);

                // Placeholder lessons
                const numLessons = Math.ceil(item.uda.hours / 1.5);
                const newLessons: Lezione[] = [];
                for(let i=0; i<numLessons; i++) {
                    newLessons.push({
                        id: `les-gen-${newUda.id}-${i}`,
                        classe: selectedClass,
                        materia: selectedSubject,
                        contenuto: `${item.uda.title} - Lezione ${i+1}`,
                        unitaDiApprendimento: newUda.title,
                        svolta: false
                    });
                }
                onAddLessons(newLessons);
            }

            onSaveEvent({ id: `evt-term1-${Date.now()}`, titolo: 'Fine 1° Periodo', data: term1End, tipo: 'scadenza', descrizione: 'Termine inserimento voti.' });
            onSaveEvent({ id: `evt-term2-${Date.now()}`, titolo: 'Termine Lezioni', data: term2End, tipo: 'scadenza', descrizione: 'Ultimo giorno di scuola.' });

            setStep('document');
        } catch (error) {
            console.error("Errore nel salvataggio dei dati:", error);
            showToast("Errore nel salvataggio dei dati. Riprova.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateDoc = async () => {
        setIsProcessing(true);
        try {
            const udaList = schedulePreview.map(s => 
                `• ${s.uda.title} (${s.uda.hours}h): dal ${new Date(s.start).toLocaleDateString()} al ${new Date(s.end).toLocaleDateString()}`
            ).join('\n');

            const kbContext = knowledgeBase
                .filter(kb => selectedKbFiles.includes(kb.id))
                .map(kb => `--- DOC: ${kb.fileName} ---\n${kb.content.substring(0, 5000)}`)
                .join('\n\n');

            const studentsInClass = students.filter(s => s.classe === selectedClass);
            const besCount = studentsInClass.filter(s => !!pianiInclusione[s.id]).length;
            const stats = `Classe composta da ${studentsInClass.length} studenti.`;
            const inclStats = `Sono presenti ${besCount} studenti con Piano di Inclusione (BES/DSA).`;

            const htmlContent = await generateClassPlanningDocument(aiSettings, {
                classe: selectedClass,
                materia: selectedSubject,
                docente: settings.nomeInsegnante,
                annoScolastico: settings.annoScolasticoCorrente,
                studentiStats: stats,
                inclusioneStats: inclStats,
                udaList: udaList,
                kbContext: kbContext,
                metodologie: methodology,
                situazionePartenza: situationText
            });

            const blob = await generateHtmlDocxBlob(htmlContent, `Programmazione ${selectedClass}`);
            const fileName = `Programmazione_${selectedClass}_${selectedSubject}.docx`;
            
            const newReport: Report = {
                id: `rep-prog-${Date.now()}`,
                nome: `Programmazione Annuale ${selectedClass}`,
                dataCreazione: new Date().toISOString(),
                contesto: { tipo: 'classe', id: selectedClass, titolo: selectedClass },
                modelloUsato: { nome: 'Programmazione Annuale (Wizard)', tipo: 'docx' },
                file: { name: fileName, content: "", mimeType: 'application/msword' }
            };
            onSaveReport(newReport);
            saveAs(blob, fileName);
            
            onClose();
        } catch (e: unknown) {
            console.error("Errore generazione documento:", e);
            showToast("Errore durante la generazione del documento. Riprova.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="wizard-steps-container">
            {['Contesto', 'Analisi', 'Metodi', 'Piano', 'Anteprima', 'Output'].map((label, idx) => {
                const stepIds: WizardStep[] = ['context', 'situation', 'methodology', 'sequence', 'preview', 'document'];
                const isActive = stepIds.indexOf(step) === idx;
                const isDone = stepIds.indexOf(step) > idx;
                
                let circleClass = 'wizard-step-circle';
                if (isActive) circleClass += ' active';
                else if (isDone) circleClass += ' completed';

                return (
                    <div key={label} className="wizard-step-item">
                        <div className={circleClass}>{idx + 1}</div>
                        {idx < 5 && <div className={`wizard-step-line ${isDone ? 'completed' : ''}`}></div>}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-4xl h-[90vh]">
                <div className="dialog-header">
                    <h2 className="m3-headline-medium">Progettazione Annuale Guidata</h2>
                    <button onClick={onClose} className="icon-button" title="Chiudi Wizard"><span className="material-symbols-outlined">close</span></button>
                </div>
                
                <div className="dialog-content">
                    {renderStepIndicator()}

                    {step === 'context' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <h3 className="m3-title-large mb-2">1. Definisci il Contesto</h3>
                                <div className="form-grid-2">
                                    <div>
                                        <label className="form-label">Classe Target</label>
                                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="form-select w-full" title="Seleziona la classe per la programmazione">
                                            {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Materia</label>
                                        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="form-select w-full" title="Seleziona la materia">
                                            {settings.disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                                <h4 className="m3-title-medium mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-secondary">folder_open</span>
                                    Documenti di Riferimento (KB)
                                </h4>
                                <div className="selection-container" style={{ maxHeight: '180px' }}>
                                    {recommendedFiles.length > 0 ? recommendedFiles.map(kb => (
                                        <div key={kb.id} className="chip-checkbox">
                                            <input type="checkbox" id={`kb-annual-${kb.id}`} checked={selectedKbFiles.includes(kb.id)} onChange={() => toggleKbFile(kb.id)} />
                                            <label htmlFor={`kb-annual-${kb.id}`} className="chip w-full justify-start" title={kb.fileName}>
                                                {selectedKbFiles.includes(kb.id) && <span className="material-symbols-outlined text-lg">check</span>}
                                                <span className="material-symbols-outlined text-primary mr-2 text-base">description</span>
                                                <span className="truncate">{kb.fileName}</span>
                                            </label>
                                        </div>
                                    )) : (
                                        <p className="text-center p-4 text-sm text-on-surface-variant">Nessun documento suggerito. Caricali nella KB con tag "Programmazione".</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'situation' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="m3-title-large">2. Analisi della Classe</h3>
                            <div className="wizard-tag-grid">
                                {SITUATION_TAGS.map(tag => (
                                    <button 
                                        key={tag}
                                        onClick={() => setSituationTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag])}
                                        className={`wizard-tag ${situationTags.includes(tag) ? 'active' : ''}`}
                                        title={`Aggiungi tag: ${tag}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            <div>
                                <label className="form-label">Note Aggiuntive</label>
                                <textarea className="form-textarea w-full" rows={2} value={situationNotes} onChange={e => setSituationNotes(e.target.value)} placeholder="Dettagli specifici sulla classe..." />
                            </div>
                            <button onClick={handleGenerateSituation} disabled={isGeneratingSituation} className="button button-tonal w-full flex justify-center gap-2" title="Usa l'AI per scrivere l'analisi">
                                {isGeneratingSituation ? <AiThinkingGem size="small" inline text="Analisi..." /> : 'Genera Analisi con AI'}
                            </button>
                            {situationText && <textarea className="form-textarea w-full mt-4" rows={6} value={situationText} onChange={e => setSituationText(e.target.value)} />}
                        </div>
                    )}

                    {step === 'methodology' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="m3-title-large">3. Obiettivi e Metodologie</h3>
                            <div className="bg-secondary-container/30 p-4 rounded-xl border border-outline-variant">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="m3-title-medium">Strategie Didattiche</label>
                                    <button onClick={handleGenerateMethodology} disabled={isGeneratingMethodology} className="button button-text !h-auto !py-1 flex items-center gap-2" title="Suggerisci metodologie adatte al contesto">
                                        {isGeneratingMethodology ? <AiThinkingGem size="small" inline /> : <><span className="material-symbols-outlined text-base mr-1">lightbulb</span> Suggerisci</>}
                                    </button>
                                </div>
                                <textarea className="form-textarea w-full" rows={6} value={methodology} onChange={e => setMethodology(e.target.value)} />
                            </div>
                        </div>
                    )}

                    {step === 'sequence' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h3 className="m3-title-large">4. Piano Annuale UDA</h3>
                                    <button 
                                        onClick={() => setShowSequenceHelp(!showSequenceHelp)} 
                                        className="icon-button text-secondary !w-8 !h-8" 
                                        title="Info sulla sequenza"
                                    >
                                        <span className="material-symbols-outlined">help</span>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-lg">
                                        <span className="text-sm">Ore/Sett:</span>
                                        <input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(Math.max(1, parseInt(e.target.value)))} className="w-10 bg-transparent text-center font-bold border-b border-outline-variant" title="Ore settimanali di lezione" />
                                    </div>
                                    <button onClick={handleGeneratePlanFromKb} disabled={isGeneratingPlan || selectedKbFiles.length === 0} className="button button-tonal flex items-center gap-2" title="Genera lista UDA dai documenti KB">
                                        {isGeneratingPlan ? <AiThinkingGem size="small" inline text="Leggo..." /> : 'Genera da KB'}
                                    </button>
                                </div>
                            </div>

                            {showSequenceHelp && (
                                <InfoCard 
                                    title="Organizzazione Moduli"
                                    description="Definisci le Unità di Apprendimento (UDA) in ordine cronologico. L'app calcolerà automaticamente le date sul calendario in base al monte ore di ciascuna UDA."
                                    variant="secondary"
                                    icon="info"
                                    onClose={() => setShowSequenceHelp(false)}
                                    className="mb-4"
                                />
                            )}

                            <div className="flex gap-2 items-end mb-4 p-3 bg-surface-container rounded-xl">
                                <div className="flex-grow"><label className="form-label">Titolo UDA</label><input type="text" value={newUdaTitle} onChange={e => setNewUdaTitle(e.target.value)} className="form-input w-full" onKeyDown={e => e.key === 'Enter' && addUdaToPlan()} placeholder="Es. Il Verismo" /></div>
                                <div className="w-24"><label className="form-label">Ore</label><input type="number" value={newUdaHours} onChange={e => setNewUdaHours(parseInt(e.target.value))} className="form-input w-full" /></div>
                                <button onClick={addUdaToPlan} className="button button-filled mb-1" title="Aggiungi alla lista">Aggiungi</button>
                            </div>
                            {isGeneratingPlan ? <div className="p-8 flex justify-center"><AiThinkingGem size="medium" text="Generazione piano..." /></div> : (
                                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                                    {plannedUdas.map((uda, idx) => (
                                        <div key={uda.id} className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant shadow-sm">
                                            <span className="material-symbols-outlined text-on-surface-variant cursor-grab active:cursor-grabbing" title="Trascina per riordinare (futuro)">drag_indicator</span>
                                            
                                            <div className="flex-grow flex flex-col">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full">
                                                        UDA {idx + 1}
                                                    </span>
                                                    <p className="font-bold text-on-surface text-sm">{uda.title}</p>
                                                </div>
                                                <p className="text-xs text-on-surface-variant truncate opacity-80">{uda.topic || uda.title}</p>
                                            </div>

                                            <div className="flex items-center gap-2 bg-surface px-2 py-1 rounded-lg border border-outline-variant/50">
                                                <input 
                                                    type="number" 
                                                    value={uda.hours} 
                                                    onChange={e => updateUdaHours(uda.id, parseInt(e.target.value))} 
                                                    className="w-10 text-center bg-transparent font-bold text-sm border-none focus:ring-0 p-0" 
                                                    title="Modifica ore stimate"
                                                />
                                                <span className="text-xs text-on-surface-variant">ore</span>
                                            </div>

                                            <button onClick={() => removeUdaFromPlan(idx)} className="icon-button text-error hover:bg-error-container !w-8 !h-8" title="Rimuovi UDA">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                    {plannedUdas.length === 0 && (
                                        <p className="text-center text-on-surface-variant italic p-4">Nessuna UDA pianificata. Aggiungine una o genera dalla KB.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h3 className="m3-title-large">5. Anteprima Temporale</h3>
                            <div className="responsive-grid">
                                <div><label className="form-label">Fine 1° Periodo</label><input type="date" value={term1End} onChange={e => setTerm1End(e.target.value)} className="form-input w-full" /></div>
                                <div><label className="form-label">Termine Lezioni</label><input type="date" value={term2End} onChange={e => setTerm2End(e.target.value)} className="form-input w-full" /></div>
                            </div>
                            <div className="relative border-l-2 border-outline-variant ml-4 space-y-6 py-2 max-h-[300px] overflow-y-auto">
                                {schedulePreview.map((item, idx) => (
                                    <div key={idx} className="relative pl-6">
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface ${item.end > term2End ? 'bg-error' : 'bg-primary'}`}></div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-primary">{new Date(item.start).toLocaleDateString()} - {new Date(item.end).toLocaleDateString()}</p>
                                        <h4 className="text-lg font-medium">{item.uda.title}</h4>
                                        <p className="text-sm text-on-surface-variant">{item.uda.hours} ore</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'document' && (
                        <div className="space-y-6 flex flex-col items-center justify-center h-full text-center animate-in zoom-in-95">
                            <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-4"><span className="material-symbols-outlined text-5xl">check_circle</span></div>
                            <h3 className="m3-headline-small">Pianificazione Completata!</h3>
                            <button onClick={handleGenerateDoc} disabled={isProcessing} className="button button-filled flex items-center gap-2" title="Scarica il documento finale">
                                {isProcessing ? <AiThinkingGem size="small" inline text="Generazione..." /> : 'Genera Documento Programmazione'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="dialog-footer">
                    {step !== 'document' && (
                        <>
                            {step !== 'context' && <button onClick={() => setStep(p => p === 'situation' ? 'context' : p === 'methodology' ? 'situation' : p === 'sequence' ? 'methodology' : 'sequence')} className="button button-text" title="Torna indietro">Indietro</button>}
                            <div className="flex-grow"></div>
                            {step === 'context' && <button onClick={() => setStep('situation')} className="button button-filled" title="Vai all'analisi">Avanti</button>}
                            {step === 'situation' && <button onClick={() => setStep('methodology')} className="button button-filled" title="Vai alla metodologia">Avanti</button>}
                            {step === 'methodology' && <button onClick={() => setStep('sequence')} className="button button-filled" title="Vai al piano">Avanti</button>}
                            {step === 'sequence' && <button onClick={() => { calculateSchedule(); setStep('preview'); }} disabled={plannedUdas.length === 0} className="button button-filled" title="Calcola date">Calcola</button>}
                            {step === 'preview' && <button onClick={handleFinalize} disabled={isProcessing} className="button button-filled flex items-center gap-2" title="Salva tutto nel database">{isProcessing ? <AiThinkingGem size="small" inline /> : 'Conferma'}</button>}
                        </>
                    )}
                    {step === 'document' && <button onClick={onClose} className="button button-text" title="Chiudi wizard">Chiudi</button>}
                </div>
            </div>
        </div>
    );
};

export default AnnualPlanningWizard;
