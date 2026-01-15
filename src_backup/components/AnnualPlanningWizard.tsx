// LEGACY - MD3 Non-compliant
import React, { useState, useMemo } from 'react';
import { 
    M3Dialog, 
    M3DialogContent, 
    M3DialogActions, 
    M3Button, 
    InfoCard,
    AiThinkingGem 
} from './ui';
import { Studente, Uda, TimetableSettings, AiSettings, Report, EventoCalendario, Lezione, KnowledgeBaseEntry, PianoInclusione } from '../types';
import { generateClassPlanningDocument, generateSituazionePartenza, suggestAnnualPlan, generateMethodologyStrategies } from '../services/aiService';
import { generateHtmlDocxBlob, saveAs } from '../utils/documentUtils';
import { useUIStore } from '../stores/useUIStore';
import { useTheme } from '../theme/theme';

interface AnnualPlanningWizardProps {
    onClose: () => void;
    userClasses: string[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
    udas: Uda[];
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
  const { layers } = useTheme();
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
    const [situationStatus, setSituationStatus] = useState<string | null>(null);

    // Step 3: Methodology & Goals
    const [methodology, setMethodology] = useState('Lezione frontale partecipata, Cooperative Learning, Laboratorio.');
    const [methodologyStatus, setMethodologyStatus] = useState<string | null>(null);

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
    const [planGenerationStatus, setPlanGenerationStatus] = useState<string | null>(null);
    const [showSequenceHelp, setShowSequenceHelp] = useState(false); 

    // Step 5: Milestones
    const currentYear = new Date().getMonth() >= 8 ? new Date().getFullYear() : new Date().getFullYear() - 1;
    const [term1End, setTerm1End] = useState<string>(`${currentYear}-12-22`);
    const [term2End, setTerm2End] = useState<string>(`${currentYear + 1}-06-08`);
    
    // Step 6: Preview
    const [schedulePreview, setSchedulePreview] = useState<{ uda: PlannedUda, start: string, end: string }[]>([]);
    
    // General
    const [processingStatus, setProcessingStatus] = useState<string | null>(null);

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
        setSituationStatus("Analisi dei parametri...");
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
            setSituationStatus(null);
        }
    };

    const handleGenerateMethodology = async () => {
        setMethodologyStatus("Ricerca strategie didattiche...");
        try {
            const text = await generateMethodologyStrategies(aiSettings, situationText || "Classe standard");
            setMethodology(text);
        } catch (e) {
            console.error("Errore generazione metodologia:", e);
            showToast("Errore durante la generazione delle strategie metodologiche. Riprova.", "error");
        } finally {
            setMethodologyStatus(null);
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

        setPlanGenerationStatus("Lettura documenti KB...");
        try {
            // Small delay for UX
            await new Promise(r => setTimeout(r, 800));
            setPlanGenerationStatus("Estrazione struttura UDA...");
            
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
            setPlanGenerationStatus(null);
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
        setProcessingStatus("Salvataggio dati...");
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
            setProcessingStatus(null);
        }
    };

    const handleGenerateDoc = async () => {
        setProcessingStatus("Organizzazione contenuti...");
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

            setProcessingStatus("Scrittura documento...");
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
            setProcessingStatus(null);
        }
    };

    const renderStepIndicator = () => (
        <div  role="navigation" aria-label="Progressi del wizard">
            {['Contesto', 'Analisi', 'Metodi', 'Piano', 'Anteprima', 'Output'].map((label, idx) => {
                const stepIds: WizardStep[] = ['context', 'situation', 'methodology', 'sequence', 'preview', 'document'];
                const isActive = stepIds.indexOf(step) === idx;
                const isDone = stepIds.indexOf(step) > idx;
                
                let circleClass = 'wizard-step-circle';
                if (isActive) circleClass += ' active';
                else if (isDone) circleClass += ' completed';

                return (
                    <div key={label}  aria-current={isActive ? 'step' : undefined}>
                        <div className={circleClass} aria-hidden="true">{idx + 1}</div>
                        <span >{label} {isDone ? '(Completato)' : isActive ? '(Corrente)' : ''}</span>
                        {idx < 5 && <div className={`wizard-step-line ${isDone ? 'completed' : ''}`} aria-hidden="true"></div>}
                    </div>
                );
            })}
        </div>
    );

    return (
        <M3Dialog
            onClose={onClose}
            title="Progettazione Annuale Guidata"
            mode="fullscreen"
        >
            <M3DialogContent>
                    {renderStepIndicator()}

                    {step === 'context' && (
                        <div  style={{gap: layers.ref.spacing['6']}}>
                            <div>
                                <h3  style={{marginBottom: layers.ref.spacing['8']}}>1. Definisci il Contesto</h3>
                                <div >
                                    <div>
                                        <label htmlFor="wizard-select-class" >Classe Target</label>
                                        <select id="wizard-select-class" name="wizard-select-class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}  style={{ width: "100%" }} title="Seleziona la classe per la programmazione">
                                            {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="wizard-select-subject" >Materia</label>
                                        <select id="wizard-select-subject" name="wizard-select-subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}  style={{ width: "100%" }} title="Seleziona la materia">
                                            {settings.disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)], borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline"}}>
                                <h4  style={{marginBottom: layers.ref.spacing['8'], display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                    <span  style={{color: "layers.sys.colors.secondary"}}>folder_open</span>
                                    Documenti di Riferimento (KB)
                                </h4>
                                <div  style={{ maxHeight: ref.spacing[180] }}>
                                    {recommendedFiles.length > 0 ? recommendedFiles.map(kb => (
                                        <div key={kb.id} >
                                            <input type="checkbox" id={`kb-annual-${kb.id}`} checked={selectedKbFiles.includes(kb.id)} onChange={() => toggleKbFile(kb.id)} />
                                            <label htmlFor={`kb-annual-${kb.id}`}  style={{ width: "100%", justifyContent: "flex-start" }} title={kb.fileName}>
                                                {selectedKbFiles.includes(kb.id) && <span >check</span>}
                                                <span style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)] }} style={{color: "layers.sys.colors.primary", marginRight: "0.5rem"}}>description</span>
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{kb.fileName}</span>
                                            </label>
                                        </div>
                                    )) : (
                                        <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{textAlign: "center", padding: layers.ref.spacing['8']}}>Nessun documento suggerito. Caricali nella KB con tag "Programmazione".</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'situation' && (
                        <div  style={{gap: layers.ref.spacing['6']}}>
                            <h3 >2. Analisi della Classe</h3>
                            <div >
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
                                <label htmlFor="wizard-situation-notes" >Note Aggiuntive</label>
                                <textarea id="wizard-situation-notes" name="wizard-situation-notes"  style={{ width: "100%" }} rows={2} value={situationNotes} onChange={e => setSituationNotes(e.target.value)} placeholder="Dettagli specifici sulla classe..." />
                            </div>
                            <M3Button variant="tonal" fullWidth onClick={handleGenerateSituation} disabled={!!situationStatus} title="Usa l'AI per scrivere l'analisi">
                                {situationStatus ? <AiThinkingGem size="small" inline text={situationStatus} /> : 'Genera Analisi con AI'}
                            </M3Button>
                            {situationText && (
                                <div style={{gap: layers.ref.spacing['2']}}>
                                    <label htmlFor="wizard-situation-text" >Testo Analisi (Modificabile)</label>
                                    <textarea id="wizard-situation-text" name="wizard-situation-text"  style={{ width: "100%" }} rows={6} value={situationText} onChange={e => setSituationText(e.target.value)} />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'methodology' && (
                        <div  style={{gap: layers.ref.spacing['6']}}>
                            <h3 >3. Obiettivi e Metodologie</h3>
                            <div style={{ backgroundColor: sys.colors.secondary-container/30, borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline"}}>
                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: layers.ref.spacing['8']}}>
                                    <label htmlFor="wizard-methodology-text" >Strategie Didattiche</label>
                                    <M3Button variant="text" onClick={handleGenerateMethodology} disabled={!!methodologyStatus}  style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}} title="Suggerisci metodologie adatte al contesto">
                                        {methodologyStatus ? <AiThinkingGem size="small" inline text="Thinking..." /> : <><span style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)] }}>lightbulb</span> Suggerisci</>}
                                    </M3Button>
                                </div>
                                <textarea id="wizard-methodology-text" name="wizard-methodology-text"  style={{ width: "100%" }} rows={6} value={methodology} onChange={e => setMethodology(e.target.value)} />
                            </div>
                        </div>
                    )}

                    {step === 'sequence' && (
                        <div  style={{gap: layers.ref.spacing['4']}}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                    <h3 >4. Piano Annuale UDA</h3>
                                    <button 
                                        onClick={() => setShowSequenceHelp(!showSequenceHelp)} 
                                         style={{color: "layers.sys.colors.secondary"}} 
                                        title="Info sulla sequenza"
                                        aria-label="Mostra informazioni sulla sequenza UDA"
                                    >
                                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}} aria-hidden="true">help</span>
                                    </button>
                                </div>
                                <div style={{display: "flex", gap: layers.ref.spacing['8']}}>
                                    <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container)], borderRadius: ref.shape[] }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                        <label htmlFor="wizard-hours-per-week" >Ore/Sett:</label>
                                        <input id="wizard-hours-per-week" name="wizard-hours-per-week" type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(Math.max(1, parseInt(e.target.value)))}  style={{width: "2.5rem", backgroundColor: "transparent", textAlign: "center", fontWeight: "bold", borderBottom: "1px solid layers.sys.colors.outline"}} title="Ore settimanali di lezione" />
                                    </div>
                                    <M3Button variant="tonal" onClick={handleGeneratePlanFromKb} disabled={!!planGenerationStatus || selectedKbFiles.length === 0} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}} title="Genera lista UDA dai documenti KB">
                                        {planGenerationStatus ? <AiThinkingGem size="small" inline text={planGenerationStatus} /> : 'Genera da KB'}
                                    </M3Button>
                                </div>
                            </div>

                            {showSequenceHelp && (
                                <InfoCard 
                                    title="Organizzazione Moduli"
                                    description="Definisci le Unità di Apprendimento (UDA) in ordine cronologico. L'app calcolerà automaticamente le date sul calendario in base al monte ore di ciascuna UDA."
                                    variant="secondary"
                                    icon="info"
                                    onClose={() => setShowSequenceHelp(false)}
                                    style={{marginBottom: layers.ref.spacing['8']}}
                                />
                            )}

                            <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container)], borderRadius: ref.shape[] }} style={{display: "flex", gap: layers.ref.spacing['8'], alignItems: "flex-end", marginBottom: layers.ref.spacing['8'], padding: layers.ref.spacing['6']}}>
                                <div style={{ flexGrow: "1" }}>
                                    <label htmlFor="wizard-new-uda-title" >Titolo UDA</label>
                                    <input id="wizard-new-uda-title" name="wizard-new-uda-title" type="text" value={newUdaTitle} onChange={e => setNewUdaTitle(e.target.value)}  style={{ width: "100%" }} onKeyDown={e => e.key === 'Enter' && addUdaToPlan()} placeholder="Es. Il Verismo" />
                                </div>
                                <div style={{ width: ref.spacing[96] }}>
                                    <label htmlFor="wizard-new-uda-hours" >Ore</label>
                                    <input id="wizard-new-uda-hours" name="wizard-new-uda-hours" type="number" value={newUdaHours} onChange={e => setNewUdaHours(parseInt(e.target.value))}  style={{ width: "100%" }} />
                                </div>
                                <M3Button variant="filled" onClick={addUdaToPlan} style={{marginBottom: layers.ref.spacing['4']}} title="Aggiungi alla lista">Aggiungi</M3Button>
                            </div>
                            {planGenerationStatus ? <div style={{padding: layers.ref.spacing['8'], display: "flex", justifyContent: "center"}}><AiThinkingGem size="medium" text={planGenerationStatus} /></div> : (
                                <div  style={{gap: layers.ref.spacing['3'], overflowY: "auto"}}>
                                    {plannedUdas.map((uda, idx) => (
                                        <div key={uda.id} style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container)], borderRadius: ref.shape[] }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], padding: layers.ref.spacing['6'], border: "1px solid layers.sys.colors.outline"}}>
                                            <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} title="Trascina per riordinare (futuro)">drag_indicator</span>
                                            
                                            <div style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
                                                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], marginBottom: layers.ref.spacing['4']}}>
                                                    <span style={{ color: sys.colors.[10px] }} style={{fontWeight: "bold", backgroundColor: "layers.sys.colors.primary", color: "layers.sys.colors.on-primary", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: ref.spacing[9999]}}>
                                                        UDA {idx + 1}
                                                    </span>
                                                    <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "bold" }}>{uda.title}</p>
                                                </div>
                                                <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: "0.8" }}>{uda.topic || uda.title}</p>
                                            </div>

                                            <div style={{ borderRadius: ref.shape[] }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], backgroundColor: "layers.sys.colors.surface", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], border: "1px solid layers.sys.colors.outline"}}>
                                                <input 
                                                    id={`wizard-uda-hours-${uda.id}`}
                                                    name={`wizard-uda-hours-${uda.id}`}
                                                    type="number" 
                                                    value={uda.hours} 
                                                    onChange={e => updateUdaHours(uda.id, parseInt(e.target.value))} 
                                                    style={{ padding: ref.spacing[0] }} style={{ width: "2.5rem", textAlign: "center", backgroundColor: "transparent", fontWeight: "bold", border: "none" }} 
                                                    title="Modifica ore stimate"
                                                />
                                                <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>ore</span>
                                            </div>

                                            <M3Button variant="text" color="error" onClick={() => removeUdaFromPlan(idx)}  title="Rimuovi UDA">
                                                <span >delete</span>
                                            </M3Button>
                                        </div>
                                    ))}
                                    {plannedUdas.length === 0 && (
                                        <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{textAlign: "center", padding: layers.ref.spacing['8']}}>Nessuna UDA pianificata. Aggiungine una o genera dalla KB.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'preview' && (
                        <div  style={{gap: layers.ref.spacing['4']}}>
                            <h3 >5. Anteprima Temporale</h3>
                            <div >
                                <div><label htmlFor="wizard-term1-end" >Fine 1° Periodo</label><input id="wizard-term1-end" name="wizard-term1-end" type="date" value={term1End} onChange={e => setTerm1End(e.target.value)}  style={{ width: "100%" }} /></div>
                                <div><label htmlFor="wizard-term2-end" >Termine Lezioni</label><input id="wizard-term2-end" name="wizard-term2-end" type="date" value={term2End} onChange={e => setTerm2End(e.target.value)}  style={{ width: "100%" }} /></div>
                            </div>
                            <div  style={{gap: layers.ref.spacing['6'], paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4'], overflowY: "auto"}}>
                                {schedulePreview.map((item, idx) => (
                                    <div key={idx}  style={{paddingLeft: layers.ref.spacing['6']}}>
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface ${item.end > term2End ? 'bg-error' : 'bg-primary'}`}></div>
                                        <p  style={{fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.025em", color: "layers.sys.colors.primary"}}>{new Date(item.start).toLocaleDateString()} - {new Date(item.end).toLocaleDateString()}</p>
                                        <h4  style={{ fontWeight: "500" }}>{item.uda.title}</h4>
                                        <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>{item.uda.hours} ore</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'document' && (
                        <div  style={{gap: layers.ref.spacing['6'], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center"}}>
                            <div style={{ color: sys.colors.on-secondary-container }} style={{width: ref.spacing[80], height: ref.spacing[80], borderRadius: ref.spacing[9999], backgroundColor: "layers.sys.colors.secondary-container", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: layers.ref.spacing['8']}}><span style={{ color: sys.colors.5xl }}>check_circle</span></div>
                            <h3 style={{ color: sys.colors.[var(--md-sys-typescale-headline-small)] }}>Pianificazione Completata!</h3>
                            <M3Button variant="filled" onClick={handleGenerateDoc} disabled={!!processingStatus} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}} title="Scarica il documento finale">
                                {processingStatus ? <AiThinkingGem size="small" inline text={processingStatus} /> : 'Genera Documento Programmazione'}
                            </M3Button>
                        </div>
                    )}
            </M3DialogContent>

            <M3DialogActions>
                    {step !== 'document' && (
                        <>
                            {step !== 'context' && <M3Button variant="text" onClick={() => setStep(p => p === 'situation' ? 'context' : p === 'methodology' ? 'situation' : p === 'sequence' ? 'methodology' : 'sequence')} title="Torna indietro">Indietro</M3Button>}
                            <div style={{ flexGrow: "1" }}></div>
                            {step === 'context' && <M3Button variant="filled" onClick={() => setStep('situation')} title="Vai all'analisi">Avanti</M3Button>}
                            {step === 'situation' && <M3Button variant="filled" onClick={() => setStep('methodology')} title="Vai alla metodologia">Avanti</M3Button>}
                            {step === 'methodology' && <M3Button variant="filled" onClick={() => setStep('sequence')} title="Vai al piano">Avanti</M3Button>}
                            {step === 'sequence' && <M3Button variant="filled" onClick={() => { calculateSchedule(); setStep('preview'); }} disabled={plannedUdas.length === 0} title="Calcola date">Calcola</M3Button>}
                            {step === 'preview' && <M3Button variant="filled" onClick={handleFinalize} disabled={!!processingStatus} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}} title="Salva tutto nel database">{processingStatus ? <AiThinkingGem size="small" inline /> : 'Conferma'}</M3Button>}
                        </>
                    )}
                    {step === 'document' && <M3Button variant="text" onClick={onClose} title="Chiudi wizard">Chiudi</M3Button>}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default React.memo(AnnualPlanningWizard);



