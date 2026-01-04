
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
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, ActionTile, SectionHeader, InfoCard, TabGroup, SelectField } from './ui';
import { useUIStore } from '../stores/useUIStore';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import BatchExportWizard from './BatchExportWizard';

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
                level={1}
            >
                <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm space-y-6">
                        {wizard === 'uda' && (
                            <SelectField 
                                label="Seleziona Progetto (UDA)"
                                value={udaForReport?.id || ''} 
                                onChange={e => setUdaForReport(props.uda.find((u: Uda) => u.id === e.target.value) || null)} 
                            >
                                <option value="">Seleziona...</option>
                                {props.uda.map((u: Uda) => (
                                    <option key={u.id} value={u.id}>{u.title} ({u.classe})</option>
                                ))}
                            </SelectField>
                        )}
                        {(wizard === 'student' || wizard === 'lesson' || wizard === 'syllabus') && (
                            <SelectField 
                                label="1. Seleziona Classe"
                                value={selectedClass} 
                                onChange={e => { setSelectedClass(e.target.value); setSelectedStudent(null); setSelectedLesson(null); }} 
                            >
                                <option value="">Seleziona...</option>
                                {props.userClasses.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </SelectField>
                        )}
                        
                        {selectedClass && wizard === 'student' && (
                            <SelectField 
                                label="2. Seleziona Studente"
                                value={selectedStudent?.id || ''} 
                                onChange={e => setSelectedStudent(studentsInClass.find(s => s.id === e.target.value) || null)} 
                            >
                                <option value="">Seleziona...</option>
                                {studentsInClass.map(s => (
                                    <option key={s.id} value={s.id}>{s.cognome} {s.nome}</option>
                                ))}
                            </SelectField>
                        )}

                        {selectedClass && wizard === 'lesson' && (
                            <SelectField 
                                label="2. Seleziona Lezione"
                                value={selectedLesson?.id || ''} 
                                onChange={e => setSelectedLesson(lessonsInClass.find((l: Lezione) => l.id === e.target.value) || null)} 
                            >
                                <option value="">Seleziona...</option>
                                {lessonsInClass.map((l: Lezione) => (
                                    <option key={l.id} value={l.id}>{l.contenuto}</option>
                                ))}
                            </SelectField>
                        )}

                        {selectedClass && wizard === 'syllabus' && (
                            <SelectField 
                                label="2. Seleziona Materia"
                                value={selectedSubject} 
                                onChange={e => setSelectedSubject(e.target.value)} 
                            >
                                <option value="">Seleziona...</option>
                                {props.settings.disciplines.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </SelectField>
                        )}
                    </M3DialogContent>
                    <M3DialogActions>
                        <M3Button onClick={resetWizard} variant="text" disabled={isGenerating}>Annulla</M3Button>
                        {(wizard === 'student' && selectedStudent) && <M3Button onClick={() => handleGenerateStudentPdf(selectedStudent)} variant="filled" disabled={isGenerating}>{isGenerating ? "Generazione..." : "Genera PDF"}</M3Button>}
                        {(wizard === 'lesson' && selectedLesson) && <M3Button onClick={() => handleGenerateLessonPdf(selectedLesson)} variant="filled" disabled={isGenerating}>{isGenerating ? "Generazione..." : "Genera PDF"}</M3Button>}
                        {(wizard === 'syllabus' && selectedClass && selectedSubject) && <M3Button onClick={handleGenerateSyllabus} variant="filled" disabled={isGenerating}>{isGenerating ? "Generazione..." : "Scarica DOC"}</M3Button>}
                    </M3DialogActions>
            </M3Dialog>
        );
    };

    return (
        <div className="space-y-8 pb-20">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-on-surface">Reportistica & Documenti</h1>
                    <p className="text-on-surface-variant">Genera documentazione didattica, verbali e reportistica avanzata.</p>
                </div>
                <div className="flex items-center gap-2">
                    <M3Button 
                        variant="tonal" 
                        startIcon={<span className="material-symbols-outlined">folder_zip</span>}
                        onClick={() => setIsBatchExportOpen(true)}
                    >
                        Export Massivo
                    </M3Button>
                </div>
            </div>

            {/* --- QUICK ACTIONS / RECENT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <SectionHeader 
                        title="Documentazione Didattica" 
                        subtitle="Seleziona la fase dell'anno scolastico"
                        icon="auto_stories"
                    />
                    
                    <TabGroup 
                        tabs={[
                            { id: 'avvio', label: 'Avvio Anno', icon: 'rocket_launch' },
                            { id: 'itinere', label: 'In Itinere', icon: 'trending_up' },
                            { id: 'valutazione', label: 'Valutazione', icon: 'fact_check' },
                            { id: 'chiusura', label: 'Chiusura', icon: 'task_alt' }
                        ]}
                        activeTab={activePhase}
                        onTabChange={(id) => setActivePhase(id as DocPhase)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {activeTemplates.map(template => (
                            <ActionTile 
                                key={template.id}
                                title={template.title}
                                subtitle={template.subtitle}
                                icon={template.icon}
                                variant={template.variant}
                                onClick={template.action}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <SectionHeader title="Documenti Recenti" icon="history" />
                    <div className="space-y-3">
                        {recentDocs.length > 0 ? recentDocs.map(doc => (
                            <InfoCard 
                                key={doc.id}
                                title={doc.fileName.replace('.html', '')}
                                icon="description"
                                variant="surface"
                                onClick={() => setViewingDoc(doc)}
                            >
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs opacity-70">Generato il {new Date(parseInt(doc.id.split('-')[2] || Date.now().toString())).toLocaleDateString()}</span>
                                    <M3Button variant="text" size="small" onClick={(e) => { e.stopPropagation(); openEditorForDoc(doc); }}>Modifica</M3Button>
                                </div>
                            </InfoCard>
                        )) : (
                            <div className="p-8 text-center border-2 border-dashed border-outline-variant rounded-3xl opacity-50">
                                <span className="material-symbols-rounded text-4xl mb-2">drafts</span>
                                <p className="text-sm">Nessun documento generato di recente.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- ARCHIVE --- */}
            <div className="space-y-4">
                <SectionHeader title="Archivio Report" icon="inventory_2" />
                <ArchivioReport 
                    reportistica={props.reportistica} 
                    onDeleteReport={props.onDeleteReport} 
                    onSaveReportToKb={(report) => {
                        props.onAddKbEntry({
                            id: `report-${Date.now()}`,
                            fileName: report.file.name,
                            content: report.file.content,
                            category: 'Report',
                            tags: ['AI', 'Report', report.contesto.tipo]
                        });
                    }}
                />
            </div>

            {/* --- MODALS & WIZARDS --- */}
            {renderWizardOverlay()}

            {isCouncilWizardOpen && (
                <ConsiglioClasseWizard 
                    onClose={() => setIsCouncilWizardOpen(false)}
                    userClasses={props.userClasses}
                    students={props.students}
                    evaluations={props.evaluations}
                    competencyEvaluations={props.competencyEvaluations}
                    settings={props.settings}
                    aiSettings={props.aiSettings}
                    onSaveReport={props.onSaveReport}
                />
            )}

            {wizard === 'planning' && (
                <ClassPlanningWizard 
                    onClose={() => setWizard(null)}
                    userClasses={props.userClasses}
                    students={props.students}
                    settings={props.settings}
                    aiSettings={props.aiSettings}
                    onSaveUda={props.onSaveUda}
                    onAddLessons={props.onAddLessons}
                    onSaveReport={props.onSaveReport}
                    onSaveEvent={props.onSaveEvent}
                    knowledgeBase={props.knowledgeBase}
                    pianiInclusione={props.pianiInclusione}
                />
            )}

            {udaForReport && (
                <UdaExportModal 
                    onClose={() => setUdaForReport(null)}
                    uda={udaForReport}
                    competenze={props.settings.competenze}
                    settings={props.settings}
                    onSaveReport={props.onSaveReport}
                    aiSettings={props.aiSettings}
                />
            )}

            {isBatchExportOpen && (
                <BatchExportWizard 
                    onClose={() => setIsBatchExportOpen(false)}
                    students={props.students}
                    lessons={props.lessons}
                    evaluations={props.evaluations}
                    competencyEvaluations={props.competencyEvaluations}
                    settings={props.settings}
                    uda={props.uda}
                    aiSettings={props.aiSettings}
                    userClasses={props.userClasses}
                />
            )}

            {/* --- SMART EDITOR OVERLAY --- */}
            {editorOpen && (
                <SmartDocumentEditor 
                    onClose={() => setEditorOpen(false)}
                    initialContent={editorContent}
                    documentTitle={editorTitle}
                    aiSettings={props.aiSettings}
                    onSaveToKb={(content, title) => {
                        props.onAddKbEntry({
                            id: `doc-${Date.now()}`,
                            fileName: `${title}.html`,
                            content: content,
                            category: 'Documento',
                            tags: ['AI', 'Editor']
                        });
                        setEditorOpen(false);
                    }}
                />
            )}

            {/* --- DOCUMENT VIEWER --- */}
            {viewingDoc && (
                <DocumentViewerModal 
                    onClose={() => setViewingDoc(null)}
                    title={viewingDoc.fileName}
                    htmlContent={viewingDoc.content}
                    onSaveToKb={(isFormatted, data) => {
                        props.onAddKbEntry({
                            id: `doc-copy-${Date.now()}`,
                            fileName: data.title,
                            content: data.content,
                            category: 'Documento',
                            tags: ['Copia']
                        });
                    }}
                />
            )}
        </div>
    );
};

export default ReportisticaHub;
