// MD3 Compliant - Block J Migration Complete (5 violations eliminated)

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
import { generateClassPlanningDocument, generateSituazionePartenza, suggestAnnualPlan } from '../services/aiService';
import { generateHtmlDocxBlob, saveAs } from '../utils/documentUtils';
import { useUIStore } from '../stores/useUIStore';
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
        const [situazioneText, setSituazioneText] = useState('');
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
            setSituazioneText(text);
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
            // Qui dovresti chiamare una funzione AI per generare la metodologia, es:
            // const generated = await generateMethodology(aiSettings, ...);
            // setMethodology(generated);
            // Per ora, lasciamo il valore di default o aggiorniamo con una stringa fittizia:
            setMethodology("Lezione frontale partecipata, Cooperative Learning, Laboratorio.");
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
                    endDate: item.end,
                    // Proprietà aggiuntive richieste da Uda
                    startPos: 0,
                    width: 1,
                    color: '',
                    borderColor: '',
                    textColor: ''
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
                situazionePartenza: situazioneText,
                studentiStats: stats,
                inclusioneStats: inclStats,
                udaList: udaList,
                kbContext: kbContext,
                metodologie: methodology,
                materia: selectedSubject
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)', padding: 'var(--md-sys-spacing-4)' }} role="navigation" aria-label="Progressi del wizard">
            {['Contesto', 'Analisi', 'Metodi', 'Piano', 'Anteprima', 'Output'].map((label, idx) => {
                const stepIds: WizardStep[] = ['context', 'situation', 'methodology', 'sequence', 'preview', 'document'];
                const isActive = stepIds.indexOf(step) === idx;
                const isDone = stepIds.indexOf(step) > idx;

                return (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }} aria-current={isActive ? 'step' : undefined}>
                        <div
                            style={{
                                width: 'var(--md-sys-spacing-10)',
                                height: 'var(--md-sys-spacing-10)',
                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isDone ? 'var(--md-sys-color-primary)' : isActive ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container-high)',
                                color: isDone ? 'var(--md-sys-color-on-primary)' : isActive ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
                                border: `var(--md-sys-border-width-thick) solid ${isActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                fontWeight: 'var(--md-sys-typescale-weight-bold)',
                                // transition rimossa per compliance MD3
                            }}
                            aria-hidden="true"
                        >
                            {idx + 1}
                        </div>
                        <span style={{ fontSize: 'var(--md-sys-typescale-body-small-size)', textAlign: 'center', color: 'var(--md-sys-color-on-surface)' }}>
                            {label} {isDone ? '(Completato)' : isActive ? '(Corrente)' : ''}
                        </span>
                        {idx < 5 && (
                            <div
                                style={{
                                    width: 'var(--md-sys-spacing-8)',
                                    height: 'var(--md-sys-border-width-thick)',
                                    backgroundColor: isDone ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)',
                                    marginTop: 'var(--md-sys-spacing-2)',
                                    // transition rimossa per compliance MD3
                                }}
                                aria-hidden="true"
                            />
                        )}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                            <div>
                                <h3 style={{ marginBottom: 'var(--md-sys-spacing-8)' }}>1. Definisci il Contesto</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                    <div>
                                        <label htmlFor="wizard-select-class">Classe Target</label>
                                        <select id="wizard-select-class" name="wizard-select-class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ width: 'var(--md-sys-percent-100)' }} title="Seleziona la classe per la programmazione">
                                            {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="wizard-select-subject">Materia</label>
                                        <select id="wizard-select-subject" name="wizard-select-subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{ width: 'var(--md-sys-percent-100)' }} title="Seleziona la materia">
                                            {settings.disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-8)', border: `var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)` }}>
                                <h4 style={{ marginBottom: 'var(--md-sys-spacing-8)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)' }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-secondary)' }}>folder_open</span>
                                    Documenti di Riferimento (KB)
                                </h4>
                                <div style={{ maxHeight: 'var(--md-sys-layout-popup-min-width)', overflowY: 'auto' }}>
                                    {recommendedFiles.length > 0 ? recommendedFiles.map(kb => (
                                        <div key={kb.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 'var(--md-sys-spacing-2)' }}>
                                            <input type="checkbox" id={`kb-annual-${kb.id}`} checked={selectedKbFiles.includes(kb.id)} onChange={() => toggleKbFile(kb.id)} />
                                            <label htmlFor={`kb-annual-${kb.id}`} style={{ display: 'flex', flexDirection: 'row', width: 'var(--md-sys-percent-full)', justifyContent: 'flex-start', cursor: 'pointer' }} title={kb.fileName}>
                                                {selectedKbFiles.includes(kb.id) && <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>check</span>}
                                                <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-primary)', marginRight: "var(--md-sys-spacing-2)" }}>description</span>
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{kb.fileName}</span>
                                            </label>
                                        </div>
                                    )) : (
                                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: "center", padding: 'var(--md-sys-spacing-8)' }}>Nessun documento suggerito. Caricali nella KB con tag "Programmazione".</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'situation' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                            <h3>2. Analisi della Classe</h3>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-2)' }}>
                                {SITUATION_TAGS.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSituationTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag])}
                                        style={{
                                            padding: `var(--md-sys-spacing-2) var(--md-sys-spacing-3)`,
                                            borderRadius: 'var(--md-sys-shape-corner-large)',
                                            border: `var(--md-sys-border-width-thin) solid ${situationTags.includes(tag) ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                                            backgroundColor: situationTags.includes(tag) ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container-high)',
                                            color: situationTags.includes(tag) ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
                                            cursor: 'pointer',
                                            // transition rimossa per compliance MD3
                                            fontSize: 'var(--md-sys-typescale-body-small-size)'
                                        }}
                                        title={`Aggiungi tag: ${tag}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            <div>
                                <label htmlFor="wizard-situation-notes">Note Aggiuntive</label>
                                <textarea id="wizard-situation-notes" name="wizard-situation-notes" style={{ width: 'var(--md-sys-percent-full)' }} rows={2} value={situationNotes} onChange={e => setSituationNotes(e.target.value)} placeholder="Dettagli specifici sulla classe..." />
                            </div>
                            <M3Button variant="tonal" fullWidth onClick={handleGenerateSituation} disabled={!!situationStatus} title="Usa l'AI per scrivere l'analisi">
                                {situationStatus ? <AiThinkingGem size="small" inline text={situationStatus} /> : 'Genera Analisi con AI'}
                            </M3Button>
                            {situazioneText && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}>
                                    <label htmlFor="wizard-situation-text">Testo Analisi (Modificabile)</label>
                                    <textarea id="wizard-situation-text" name="wizard-situation-text" style={{ width: 'var(--md-sys-percent-full)' }} rows={6} value={situazioneText} onChange={e => setSituazioneText(e.target.value)} />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'methodology' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                            <h3>3. Obiettivi e Metodologie</h3>
                            <div style={{ backgroundColor: 'var(--md-sys-color-secondary-container)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-8)', border: `var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 'var(--md-sys-spacing-8)' }}>
                                    <label htmlFor="wizard-methodology-text">Strategie Didattiche</label>
                                    <M3Button variant="text" onClick={handleGenerateMethodology} disabled={!!methodologyStatus} style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: 'var(--md-sys-spacing-8)' }} title="Suggerisci metodologie adatte al contesto">
                                        {methodologyStatus ? <AiThinkingGem size="small" inline text="Thinking..." /> : <><span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-primary)' }}>lightbulb</span> Suggerisci</>}
                                    </M3Button>
                                </div>
                                <textarea id="wizard-methodology-text" name="wizard-methodology-text" style={{ width: 'var(--md-sys-percent-full)' }} rows={6} value={methodology} onChange={e => setMethodology(e.target.value)} />
                            </div>
                        </div>
                    )}

                    {step === 'sequence' && (
                        <div style={{ gap: 'var(--md-sys-spacing-4)' }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: 'var(--md-sys-spacing-8)' }}>
                                    <h3>4. Piano Annuale UDA</h3>
                                    <button
                                        onClick={() => setShowSequenceHelp(!showSequenceHelp)}
                                        style={{ color: "var(--md-sys-color-secondary)", background: 'none', border: 'none', cursor: 'pointer' }}
                                        title="Info sulla sequenza"
                                        aria-label="Mostra informazioni sulla sequenza UDA"
                                    >
                                        <span className="material-symbols-outlined" aria-hidden="true">help</span>
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--md-sys-spacing-2)' }}>
                                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', padding: 'var(--md-sys-spacing-2)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)" }}>
                                        <label htmlFor="wizard-hours-per-week">Ore/Sett:</label>
                                        <input id="wizard-hours-per-week" name="wizard-hours-per-week" type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(Math.max(1, parseInt(e.target.value)))} style={{ width: "var(--md-sys-spacing-10)", backgroundColor: "transparent", textAlign: "center", fontWeight: "var(--md-sys-typescale-weight-bold)", borderBottom: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)" }} title="Ore settimanali di lezione" />
                                    </div>
                                    <M3Button variant="tonal" onClick={handleGeneratePlanFromKb} disabled={!!planGenerationStatus || selectedKbFiles.length === 0} style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: 'var(--md-sys-spacing-8)' }} title="Genera lista UDA dai documenti KB">
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
                                />
                            )}

                            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)', display: "flex", gap: 'var(--md-sys-spacing-8)', alignItems: "flex-end", marginBottom: 'var(--md-sys-spacing-8)', padding: 'var(--md-sys-spacing-6)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)" }}>
                                <div style={{ flexGrow: 1 }}>
                                    <label htmlFor="wizard-new-uda-title">Titolo UDA</label>
                                    <input id="wizard-new-uda-title" name="wizard-new-uda-title" type="text" value={newUdaTitle} onChange={e => setNewUdaTitle(e.target.value)} style={{ width: 'var(--md-sys-percent-full)' }} onKeyDown={e => e.key === 'Enter' && addUdaToPlan()} placeholder="Es. Il Verismo" />
                                </div>
                                <div style={{ width: 'var(--md-sys-spacing-16)' }}>
                                    <label htmlFor="wizard-new-uda-hours">Ore</label>
                                    <input id="wizard-new-uda-hours" name="wizard-new-uda-hours" type="number" value={newUdaHours} onChange={e => setNewUdaHours(parseInt(e.target.value))} style={{ width: 'var(--md-sys-percent-full)' }} />
                                </div>
                                <M3Button variant="filled" onClick={addUdaToPlan} style={{ marginBottom: 'var(--md-sys-spacing-4)' }} title="Aggiungi alla lista">Aggiungi</M3Button>
                            </div>
                            {planGenerationStatus ? <div style={{ padding: 'var(--md-sys-spacing-8)', display: "flex", justifyContent: "center" }}><AiThinkingGem size="medium" text={planGenerationStatus} /></div> : (
                                <div style={{ gap: 'var(--md-sys-spacing-3)', overflowY: "auto", maxHeight: 'var(--md-sys-spacing-24)' }}>
                                    {plannedUdas.map((uda, idx) => (
                                        <div key={uda.id} style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)', padding: 'var(--md-sys-spacing-6)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)" }}>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-on-surface-variant)', cursor: 'grab' }} title="Trascina per riordinare (futuro)">drag_indicator</span>

                                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: 'var(--md-sys-spacing-8)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                                                    <span style={{ fontWeight: "var(--md-sys-typescale-weight-bold)", backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)' }}>
                                                        UDA {idx + 1}
                                                    </span>
                                                    <p style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: "var(--md-sys-typescale-weight-bold)" }}>{uda.title}</p>
                                                </div>
                                                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: "var(--md-sys-state-opacity-caption)" }}>{uda.topic || uda.title}</p>
                                            </div>

                                            <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', backgroundColor: "var(--md-sys-color-surface-container-low)", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)" }}>
                                                <input
                                                    id={`wizard-uda-hours-${uda.id}`}
                                                    name={`wizard-uda-hours-${uda.id}`}
                                                    type="number"
                                                    value={uda.hours}
                                                    onChange={e => updateUdaHours(uda.id, parseInt(e.target.value))}
                                                    style={{ padding: 'var(--md-sys-spacing-4)', width: "var(--md-sys-spacing-10)", textAlign: "center", backgroundColor: "transparent", fontWeight: "var(--md-sys-typescale-weight-bold)", border: "none" }}
                                                    title="Modifica ore stimate"
                                                />
                                                <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>ore</span>
                                            </div>

                                            <M3Button variant="text" color="error" onClick={() => removeUdaFromPlan(idx)} title="Rimuovi UDA">
                                                <span className="material-symbols-outlined">delete</span>
                                            </M3Button>
                                        </div>
                                    ))}
                                    {plannedUdas.length === 0 && (
                                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: "center", padding: 'var(--md-sys-spacing-8)' }}>Nessuna UDA pianificata. Aggiungine una o genera dalla KB.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'preview' && (
                        <div style={{ gap: 'var(--md-sys-spacing-4)' }}>
                            <h3>5. Anteprima Temporale</h3>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-6)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <label htmlFor="wizard-term1-end">Fine 1° Periodo</label>
                                    <input id="wizard-term1-end" name="wizard-term1-end" type="date" value={term1End} onChange={e => setTerm1End(e.target.value)} style={{ width: 'var(--md-sys-percent-full)' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <label htmlFor="wizard-term2-end">Termine Lezioni</label>
                                    <input id="wizard-term2-end" name="wizard-term2-end" type="date" value={term2End} onChange={e => setTerm2End(e.target.value)} style={{ width: 'var(--md-sys-percent-full)' }} />
                                </div>
                            </div>
                            <div style={{ gap: 'var(--md-sys-spacing-6)', paddingTop: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-4)', overflowY: "auto", maxHeight: 'var(--md-sys-spacing-24)' }}>
                                {schedulePreview.map((item, idx) => (
                                    <div key={idx} style={{ position: "relative", paddingLeft: 'var(--md-sys-spacing-6)' }}>
                                        <div style={{ position: 'absolute', left: 'calc(var(--md-sys-spacing-2) * -1)', top: 'var(--md-sys-spacing-1)', width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-percent-full)', borderWidth: 'var(--md-sys-border-width-thin)', borderColor: 'var(--md-sys-color-outline-variant)', backgroundColor: item.end > term2End ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)' }}></div>
                                        <p style={{ fontWeight: "var(--md-sys-typescale-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-small-tracking)", color: "var(--md-sys-color-primary)" }}>{new Date(item.start).toLocaleDateString()} - {new Date(item.end).toLocaleDateString()}</p>
                                        <h4 style={{ fontWeight: "var(--md-sys-typescale-weight-medium)", color: 'var(--md-sys-color-on-surface)' }}>{item.uda.title}</h4>
                                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{item.uda.hours} ore</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'document' && (
                        <div style={{ gap: 'var(--md-sys-spacing-6)', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "var(--md-sys-percent-full)", textAlign: "center" }}>
                            <div style={{ color: 'var(--md-sys-color-on-secondary-container)', width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-secondary)', display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 'var(--md-sys-spacing-8)' }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-on-secondary-container)' }}>check_circle</span>
                            </div>
                            <h3 style={{ color: 'var(--md-sys-color-on-surface)' }}>Pianificazione Completata!</h3>
                            <M3Button variant="filled" onClick={handleGenerateDoc} disabled={!!processingStatus} style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: 'var(--md-sys-spacing-8)' }} title="Scarica il documento finale">
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
                            {step === 'preview' && <M3Button variant="filled" onClick={handleFinalize} disabled={!!processingStatus} style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}} title="Salva tutto nel database">{processingStatus ? <AiThinkingGem size="small" inline /> : 'Conferma'}</M3Button>}
                        </>
                    )}
                    {step === 'document' && <M3Button variant="text" onClick={onClose} title="Chiudi wizard">Chiudi</M3Button>}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default React.memo(AnnualPlanningWizard);

