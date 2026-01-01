
import React, { useState, useMemo, useEffect } from 'react';
import { Report, Studente, Lezione, Uda, TimetableSettings, Valutazione, ValutazioneCompetenza, AiSettings, KnowledgeBaseEntry, PianoInclusione, EventoCalendario } from '../types';
import { saveAs } from '../utils/documentUtils';
import ArchivioReport from './ArchivioReport';
import { UdaExportModal } from './UdaExportModal';
import { generateStudentProfilePdf, generateLessonPdf, generateHtmlDocxBlob, viewPdfInNewTab, generatePdfBrochure } from '../utils/documentUtils';
import ConsiglioClasseWizard from './ConsiglioClasseWizard';
import ClassPlanningWizard from './ClassPlanningWizard';
import SmartDocumentEditor from './SmartDocumentEditor';
import DocumentViewerModal from './DocumentViewerModal'; 
import { getDocumentTemplate } from '../utils/templateUtils';
import { ActionTile, SectionHeader, InfoCard, TabGroup } from './M3Components';
import { useUIStore } from '../stores/useUIStore';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import BatchExportWizard from './BatchExportWizard';
import { M3Dialog } from './M3Dialog';

// --- TYPE DEFINITIONS FOR REGISTRY ---
type DocPhase = 'avvio' | 'itinere' | 'valutazione' | 'chiusura';

interface DocTemplateDef {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    phase: DocPhase;
    variant: 'primary' | 'secondary' | 'tertiary' | 'surface';
    action: () => void;
    description?: string;
}

interface ReportisticaHubProps {
    reportistica: Report[];
    onDeleteReport: (reportId: string) => void;
    userClasses: string[];
    students: Studente[];
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    uda: Uda[];
    lessons: Record<string, Lezione>;
    onSaveReport: (report: Report) => void;
    aiSettings: AiSettings;
    pianiInclusione: Record<string, PianoInclusione>;
    knowledgeBase: KnowledgeBaseEntry[];
    onAddKbEntry: (entry: KnowledgeBaseEntry) => void;
    onSaveUda: (uda: Uda) => void;
    onAddLessons: (lessons: Lezione[]) => void;
    onSaveEvent: (event: EventoCalendario) => void;
}

const ReportisticaHub: React.FC<ReportisticaHubProps> = (props) => {
    const [wizard, setWizard] = useState<'uda' | 'student' | 'lesson' | 'planning' | 'syllabus' | null>(null);
    const [isCouncilWizardOpen, setIsCouncilWizardOpen] = useState(false);
    const [activePhase, setActivePhase] = useState<DocPhase>('avvio');
    
    // Editor State
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorContent, setEditorContent] = useState('');
    const [editorTitle, setEditorTitle] = useState('');

    // Document Viewer State (for KB items)
    const [viewingDoc, setViewingDoc] = useState<KnowledgeBaseEntry | null>(null);

    const [udaForReport, setUdaForReport] = useState<Uda | null>(null);
    
    // State for multi-step wizards
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>(''); 
    const [selectedStudent, setSelectedStudent] = useState<Studente | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lezione | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Batch Export State
    const [isBatchExportOpen, setIsBatchExportOpen] = useState(false);

    // UI Store for toast notifications
    const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

    const resetWizard = () => {
        setWizard(null);
        setIsCouncilWizardOpen(false);
        setUdaForReport(null);
        setSelectedClass('');
        setSelectedSubject('');
        setSelectedStudent(null);
        setSelectedLesson(null);
        setIsGenerating(false);
        setEditorOpen(false);
    };

    // Keyboard navigation hook for modals
    const modalRef = useKeyboardNavigation(!!wizard, resetWizard);

    // Determine current suggested phase based on date
    const currentSuggestedPhase = useMemo((): DocPhase => {
        const month = new Date().getMonth(); // 0-11
        if (month >= 8 && month <= 10) return 'avvio'; // Sept-Nov
        if (month === 0 || month === 1 || month === 5) return 'valutazione'; // Jan, Feb, Jun
        if (month >= 2 && month <= 4) return 'itinere'; // Mar-May
        if (month === 6 || month === 7) return 'chiusura'; // Jul-Aug (Exams/Finals)
        return 'itinere';
    }, []);

    // Set initial phase if not set manually
    useEffect(() => {
        setActivePhase(currentSuggestedPhase);
    }, [currentSuggestedPhase]);

    // --- RECENT DOCS FROM KB ---
    const recentDocs = useMemo(() => {
        return props.knowledgeBase
            .filter(kb => kb.isGenerated === true && (kb.category === 'programmazione' || kb.category === 'valutazione' || kb.htmlContent))
            .sort((a, b) => {
                // Try to sort by ID timestamp if available, else name
                const timeA = parseInt(a.id.split('-')[2] || '0');
                const timeB = parseInt(b.id.split('-')[2] || '0');
                return timeB - timeA;
            })
            .slice(0, 4); // Show top 4
    }, [props.knowledgeBase]);

    // --- TEMPLATE OPENER ---
    const openEditorWithTemplate = (templateId: string, contextClass?: string) => {
        const ctxClass = contextClass || props.userClasses[0];
        const ctxStudents = props.students.filter(s => s.classe === ctxClass);
        
        const content = getDocumentTemplate(templateId, {
            teacherName: props.settings.nomeInsegnante,
            className: ctxClass,
            subject: props.settings.disciplines[0] || '',
            students: ctxStudents,
            uda: props.uda.filter((u: Uda) => u.classe === ctxClass)
        });
        
        setEditorContent(content);
        setEditorTitle(templateId === 'planning_doc' ? `Progettazione ${ctxClass}` : 'Nuovo Documento');
        setEditorOpen(true);
        setWizard(null); // Close selection wizard if open
    };
    
    const openEditorForDoc = (doc: KnowledgeBaseEntry) => {
        if (doc.htmlContent) {
            setEditorContent(doc.htmlContent);
        } else {
            // Convert plain text to basic HTML paragraphs
            setEditorContent(doc.content.split('\n').map(p => `<p>${p}</p>`).join(''));
        }
        setEditorTitle(doc.fileName.replace('.html', '').replace('.txt', ''));
        setEditorOpen(true);
        setViewingDoc(null);
    };

    // --- SAVE EDITOR CONTENT TO KB ---
    const handleSaveEditorContent = (content: string, title: string) => {
        const safeTitle = title.endsWith('.html') ? title : `${title}.html`;
        // Check if updating existing doc (simple name match for now, ideally ID)
        // For simplicity, we create a new version/entry to avoid overwriting original templates if name changes
        const newEntry: KnowledgeBaseEntry = {
            id: `doc-gen-${Date.now()}`,
            fileName: safeTitle.replace(/\s+/g, '_'),
            content: title + "\n" + content.replace(/<[^>]+>/g, ' '), // Plain text index
            htmlContent: content,
            category: 'programmazione',
            isGenerated: true,
            fileContent: {
                data: btoa(unescape(encodeURIComponent(content))), // Simple base64 for text
                mimeType: 'text/html'
            }
        };
        props.onAddKbEntry(newEntry);
        // No alert, handled by parent or UI update
        setEditorOpen(false);
    };

    // --- GENERATION HANDLERS ---
    const handleGenerateStudentPdf = async (student: Studente) => {
        if (!student) return;
        setIsGenerating(true);
        try {
            const studentEvals = props.evaluations.filter(e => e.studenteId === student.id);
            const studentCompEvals = props.competencyEvaluations.filter(e => e.studenteId === student.id);
            const blob = await generateStudentProfilePdf(student, studentEvals, studentCompEvals, props.settings);
            viewPdfInNewTab(blob);
        } catch (e) {
            console.error("Failed to generate student PDF:", e);
            showToast("Errore durante la generazione del profilo studente. Riprova più tardi.", "error");
        } finally {
            setIsGenerating(false);
            resetWizard();
        }
    };

    const handleGenerateLessonPdf = async (lesson: Lezione) => {
        if (!lesson) return;
        setIsGenerating(true);
        try {
            const blob = await generateLessonPdf(lesson);
            viewPdfInNewTab(blob);
        } catch (e) {
            console.error("Failed to generate lesson PDF:", e);
            showToast("Errore durante la generazione del piano lezione. Riprova più tardi.", "error");
        } finally {
            setIsGenerating(false);
            resetWizard();
        }
    };

    const handleGenerateBrochure = async () => {
        setIsGenerating(true);
        try {
            const content = {
                brochureTitle: `Offerta Formativa ${props.settings.annoScolasticoCorrente}`,
                introduction: `Benvenuti all'istituto ${props.settings.nomeIstituto}. Il nostro approccio didattico mette al centro lo studente.`,
                useCases: [
                    { title: "Didattica per Competenze", benefits: ["Apprendimento attivo", "Valutazione formativa"] },
                    { title: "Inclusione", benefits: ["Piani personalizzati (PDP/PEI)", "Ambienti flessibili"] }
                ],
                technicalGuarantees: { title: "Innovazione", content: "Utilizziamo strumenti avanzati come OrarioDoc AI." },
                roadmap: { title: "Percorso", items: [{ title: "Accoglienza", description: "Attività di ingresso" }, { title: "Svolgimento", description: "Lezioni e UDA" }] },
                callToAction: "Costruiamo il futuro."
            };
            const blob = await generatePdfBrochure(content);
            viewPdfInNewTab(blob);
        } catch (e) {
            console.error("Errore generazione brochure:", e);
            showToast("Errore durante la generazione della brochure. Riprova più tardi.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateSyllabus = async () => {
        if (!selectedClass || !selectedSubject) return;
        setIsGenerating(true);
        try {
            const completedLessons = (Object.values(props.lessons) as Lezione[])
                .filter(l => l.classe === selectedClass && l.materia === selectedSubject && l.svolta)
                .sort((a,b) => a.contenuto.localeCompare(b.contenuto)); 
            
            let html = `<h1>Programma Svolto</h1>`;
            html += `<h2>Classe: ${selectedClass} - Materia: ${selectedSubject}</h2>`;
            html += `<p><strong>Docente:</strong> ${props.settings.nomeInsegnante}</p>`;
            html += `<h3>Argomenti Trattati</h3><ul>`;
            if (completedLessons.length === 0) html += `<li>Nessuna lezione "svolta".</li>`;
            else completedLessons.forEach(l => html += `<li>${l.contenuto}</li>`);
            html += `</ul>`;
            
            const blob = await generateHtmlDocxBlob(html, `Programma Svolto ${selectedClass}`);
            saveAs(blob, `Programma_${selectedClass}_${selectedSubject}.docx`);
        } catch(e) {
             console.error("Errore generazione programma:", e);
             showToast("Errore durante la generazione del programma svolto. Riprova più tardi.", "error");
        } finally {
            setIsGenerating(false);
            resetWizard();
        }
    };

    // --- DOCUMENT REGISTRY ---
    const DOC_REGISTRY: DocTemplateDef[] = [
        // FASE: AVVIO
        {
            id: 'planning_doc',
            title: 'Progettazione Disciplinare',
            subtitle: 'Editor Smart con AI',
            icon: 'architecture',
            phase: 'avvio',
            variant: 'primary',
            action: () => setWizard('planning'), // Uses wizard first to select class, then opens Editor
            description: 'Redigi il piano annuale assistito dall\'AI.'
        },
        {
            id: 'brochure',
            title: 'Brochure Offerta',
            subtitle: 'Presentazione corso (PDF)',
            icon: 'campaign',
            phase: 'avvio',
            variant: 'tertiary',
            action: handleGenerateBrochure
        },
        
        // FASE: IN ITINERE
        {
            id: 'lesson_plan',
            title: 'Piano Lezione',
            subtitle: 'Scheda singola (PDF)',
            icon: 'history_edu',
            phase: 'itinere',
            variant: 'surface',
            action: () => setWizard('lesson')
        },
        {
            id: 'uda_doc',
            title: 'Documento UDA',
            subtitle: 'Dettaglio Unità (PDF/Doc)',
            icon: 'assignment',
            phase: 'itinere',
            variant: 'secondary',
            action: () => setWizard('uda')
        },
        {
            id: 'student_profile',
            title: 'Scheda Studente',
            subtitle: 'Profilo completo (PDF)',
            icon: 'person_search',
            phase: 'itinere',
            variant: 'surface',
            action: () => setWizard('student')
        },

        // FASE: VALUTAZIONE
        {
            id: 'council_report',
            title: 'Report Scrutinio',
            subtitle: 'Voti e Giudizi (PDF)',
            icon: 'gavel',
            phase: 'valutazione',
            variant: 'primary',
            action: () => setIsCouncilWizardOpen(true)
        },
        {
            id: 'relazione_finale',
            title: 'Relazione Finale (Editor)',
            subtitle: 'Doc modificabile',
            icon: 'edit_document',
            phase: 'valutazione',
            variant: 'secondary',
            action: () => openEditorWithTemplate('council_report') // Opens direct editor
        },
        
        // FASE: CHIUSURA
        {
            id: 'syllabus',
            title: 'Programma Svolto',
            subtitle: 'Elenco argomenti (Word)',
            icon: 'format_list_bulleted',
            phase: 'chiusura',
            variant: 'secondary',
            action: () => setWizard('syllabus')
        }
    ];

    const activeTemplates = DOC_REGISTRY.filter(d => d.phase === activePhase);

    // --- WIZARD RENDERER ---
    const renderWizardOverlay = () => {
        if (!wizard || wizard === 'planning') return null; // 'planning' uses dedicated component

        const studentsInClass = props.students.filter(s => s.classe === selectedClass);
        const lessonsInClass = Object.values(props.lessons).filter((l: Lezione) => l.classe === selectedClass);

        return (
            <M3Dialog
                onClose={resetWizard}
                title="Configura Documento"
                maxWidth="lg"
                modalRef={modalRef}
            >
                <div className="space-y-4">
                        {wizard === 'uda' && (
                            <>
                                <label htmlFor="uda-select" className="form-label">Seleziona Progetto (UDA)</label>
                                <select 
                                    id="uda-select"
                                    value={udaForReport?.id || ''} 
                                    onChange={e => setUdaForReport(props.uda.find((u: Uda) => u.id === e.target.value) || null)} 
                                    className="form-select w-full"
                                    aria-describedby="uda-help"
                                >
                                    <option value="">Seleziona...</option>
                                    {props.uda.map((u: Uda) => <option key={u.id} value={u.id}>{u.title} ({u.classe})</option>)}
                                </select>
                                <div id="uda-help" className="sr-only">Seleziona il progetto UDA per cui generare la documentazione</div>
                            </>
                        )}
                        {(wizard === 'student' || wizard === 'lesson' || wizard === 'syllabus') && (
                            <div>
                                <label htmlFor="class-select" className="form-label">1. Seleziona Classe</label>
                                <select 
                                    id="class-select"
                                    value={selectedClass} 
                                    onChange={e => { setSelectedClass(e.target.value); setSelectedStudent(null); setSelectedLesson(null); }} 
                                    className="form-select w-full"
                                    aria-describedby="class-help"
                                >
                                    <option value="">Seleziona...</option>
                                    {props.userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <div id="class-help" className="sr-only">Seleziona la classe per cui configurare il documento</div>
                            </div>
                        )}
                        
                        {selectedClass && wizard === 'student' && (
                            <div>
                                <label htmlFor="student-select" className="form-label">2. Seleziona Studente</label>
                                <select 
                                    id="student-select"
                                    value={selectedStudent?.id || ''} 
                                    onChange={e => setSelectedStudent(studentsInClass.find(s => s.id === e.target.value) || null)} 
                                    className="form-select w-full"
                                    aria-describedby="student-help"
                                >
                                    <option value="">Seleziona...</option>
                                    {studentsInClass.map(s => <option key={s.id} value={s.id}>{s.cognome} {s.nome}</option>)}
                                </select>
                                <div id="student-help" className="sr-only">Seleziona lo studente per cui generare il profilo</div>
                            </div>
                        )}

                        {selectedClass && wizard === 'lesson' && (
                            <div>
                                <label htmlFor="lesson-select" className="form-label">2. Seleziona Lezione</label>
                                <select 
                                    id="lesson-select"
                                    value={selectedLesson?.id || ''} 
                                    onChange={e => setSelectedLesson(lessonsInClass.find((l: Lezione) => l.id === e.target.value) || null)} 
                                    className="form-select w-full"
                                    aria-describedby="lesson-help"
                                >
                                    <option value="">Seleziona...</option>
                                    {lessonsInClass.map((l: Lezione) => <option key={l.id} value={l.id}>{l.contenuto}</option>)}
                                </select>
                                <div id="lesson-help" className="sr-only">Seleziona la lezione per cui generare il piano</div>
                            </div>
                        )}

                        {selectedClass && wizard === 'syllabus' && (
                            <div>
                                <label htmlFor="subject-select" className="form-label">2. Seleziona Materia</label>
                                <select 
                                    id="subject-select"
                                    value={selectedSubject} 
                                    onChange={e => setSelectedSubject(e.target.value)} 
                                    className="form-select w-full"
                                    aria-describedby="subject-help"
                                >
                                    <option value="">Seleziona...</option>
                                    {props.settings.disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <div id="subject-help" className="sr-only">Seleziona la materia per cui generare il programma svolto</div>
                            </div>
                        )}
                    </div>
                    <div className="dialog-footer">
                        <button onClick={resetWizard} className="button button-text" disabled={isGenerating} aria-label="Annulla e chiudi la configurazione">Annulla</button>
                        {(wizard === 'student' && selectedStudent) && <button onClick={() => handleGenerateStudentPdf(selectedStudent)} className="button button-filled" disabled={isGenerating} aria-label={`Genera profilo PDF per ${selectedStudent.cognome} ${selectedStudent.nome}`}>{isGenerating ? "Generazione..." : "Genera PDF"}</button>}
                        {(wizard === 'lesson' && selectedLesson) && <button onClick={() => handleGenerateLessonPdf(selectedLesson)} className="button button-filled" disabled={isGenerating} aria-label={`Genera piano lezione PDF per "${selectedLesson.contenuto}"`}>{isGenerating ? "Generazione..." : "Genera PDF"}</button>}
                        {(wizard === 'syllabus' && selectedClass && selectedSubject) && <button onClick={handleGenerateSyllabus} className="button button-filled" disabled={isGenerating} aria-label={`Scarica programma svolto per ${selectedClass} - ${selectedSubject}`}>{isGenerating ? "Generazione..." : "Scarica DOC"}</button>}
                    </div>
                </div>
            </M3Dialog>
        );
    };

    return (
        <div className="page-layout">
            <div className="flex justify-between items-center mb-2">
                <h1 className="m3-display-medium">Centro Documentazione</h1>
            </div>
            
            <InfoCard 
                title="Gestione Documentale Avanzata"
                description="Genera, archivia e modifica tutta la documentazione scolastica. I documenti creati qui vengono salvati nella tua Knowledge Base per futuri utilizzi."
                icon="folder_managed"
                variant="surface"
                className="mb-6"
            />

            {/* --- BATCH EXPORT QUICK ACTION --- */}
            <div className="mb-8">
                <ActionTile 
                    title="Export Multiplo"
                    subtitle="Genera più documenti insieme"
                    icon="download"
                    variant="secondary"
                    onClick={() => setIsBatchExportOpen(true)}
                    tooltip="Seleziona e genera più documenti contemporaneamente"
                    className="w-full max-w-sm"
                />
            </div>

            {/* --- RECENT DOCS (KB) --- */}
            {recentDocs.length > 0 && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-4">
                    <SectionHeader title="Le tue Bozze Recenti" icon="edit_note" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {recentDocs.map(doc => (
                            <div 
                                key={doc.id} 
                                className="bg-surface-container border border-outline-variant rounded-xl p-3 cursor-pointer hover:bg-surface-container-high transition-colors flex flex-col gap-2 group"
                                onClick={() => setViewingDoc(doc)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setViewingDoc(doc); } }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Visualizza documento ${doc.fileName.replace('.html', '')}`}
                            >
                                <div className="flex items-start justify-between">
                                    <span className="material-symbols-outlined text-primary text-2xl" aria-hidden="true">article</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); openEditorForDoc(doc); }} 
                                        className="icon-button !w-8 !h-8 bg-surface/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Modifica nell'Editor"
                                        aria-label={`Modifica ${doc.fileName.replace('.html', '')} nell'editor`}
                                    >
                                        <span className="material-symbols-outlined text-sm" aria-hidden="true">edit</span>
                                    </button>
                                </div>
                                <p className="font-bold text-sm truncate" title={doc.fileName}>{doc.fileName.replace('.html', '')}</p>
                                <p className="text-xs text-on-surface-variant">Modificato di recente</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- PHASE SELECTOR --- */}
            <TabGroup 
                activeTab={activePhase}
                onTabChange={(id) => setActivePhase(id as DocPhase)}
                variant="primary"
                className="mb-6"
                tabs={[
                    { id: 'avvio', label: '1. Avvio Anno', icon: 'start' },
                    { id: 'itinere', label: '2. In Itinere', icon: 'timelapse' },
                    { id: 'valutazione', label: '3. Valutazione', icon: 'fact_check' },
                    { id: 'chiusura', label: '4. Chiusura', icon: 'flag' },
                ]}
            />

            {/* --- TEMPLATES GRID --- */}
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="section-header-expressive mb-4 capitalize">
                    Modelli Fase: {activePhase}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeTemplates.map(template => (
                        <ActionTile 
                            key={template.id}
                            title={template.title}
                            subtitle={template.subtitle}
                            icon={template.icon}
                            variant={template.variant}
                            onClick={template.action}
                            tooltip={template.description}
                            className="h-full"
                        />
                    ))}
                    {activeTemplates.length === 0 && (
                        <div className="col-span-full text-center p-8 text-on-surface-variant opacity-60 border-2 border-dashed border-outline-variant rounded-xl">
                            Nessun modello disponibile per questa fase al momento.
                        </div>
                    )}
                </div>
            </div>
            
            {/* WIZARDS & EDITORS */}
            {renderWizardOverlay()}
            
            {editorOpen && (
                <SmartDocumentEditor 
                    initialContent={editorContent}
                    documentTitle={editorTitle}
                    onClose={() => setEditorOpen(false)}
                    aiSettings={props.aiSettings}
                    onSaveToKb={handleSaveEditorContent}
                />
            )}

            {wizard === 'planning' && (
                <ClassPlanningWizard
                    onClose={resetWizard}
                    userClasses={props.userClasses}
                    students={props.students}
                    knowledgeBase={props.knowledgeBase}
                    pianiInclusione={props.pianiInclusione}
                    settings={props.settings}
                    aiSettings={props.aiSettings}
                    onSaveReport={props.onSaveReport}
                    onSaveUda={props.onSaveUda}
                    onAddLessons={props.onAddLessons}
                    onSaveEvent={props.onSaveEvent}
                />
            )}
            
            {isCouncilWizardOpen && (
                <ConsiglioClasseWizard
                    onClose={resetWizard}
                    userClasses={props.userClasses}
                    students={props.students}
                    evaluations={props.evaluations}
                    competencyEvaluations={props.competencyEvaluations}
                    settings={props.settings}
                    aiSettings={props.aiSettings}
                    onSaveReport={props.onSaveReport}
                />
            )}

            {udaForReport && (
                <UdaExportModal
                    uda={udaForReport}
                    aiSettings={props.aiSettings}
                    competenze={props.settings.competenze}
                    settings={props.settings}
                    onClose={resetWizard}
                    onSaveReport={props.onSaveReport}
                />
            )}

            {viewingDoc && (
                <DocumentViewerModal
                    title={viewingDoc.fileName}
                    htmlContent={viewingDoc.htmlContent || `<pre>${viewingDoc.content}</pre>`}
                    onClose={() => setViewingDoc(null)}
                    onOpenCreateLesson={() => {
                        setViewingDoc(null);
                    }}
                />
            )}

            {isBatchExportOpen && (
                <BatchExportWizard
                    onClose={() => setIsBatchExportOpen(false)}
                    students={props.students}
                    lessons={props.lessons}
                    uda={props.uda}
                    evaluations={props.evaluations}
                    competencyEvaluations={props.competencyEvaluations}
                    settings={props.settings}
                    aiSettings={props.aiSettings}
                    userClasses={props.userClasses}
                />
            )}

            <div className="mt-12">
                <SectionHeader title="Archivio Report (PDF/Snapshot)" icon="history" />
                <ArchivioReport reportistica={props.reportistica} onDeleteReport={props.onDeleteReport} onSaveReportToKb={() => { /* Reuse save logic or custom */ }} />
            </div>
        </div>
    );
};

export default ReportisticaHub;
