
import React, { useState, useMemo } from 'react';
import { Studente, Lezione, KnowledgeBaseEntry, HomeworkSubmission, RegisterEntry, TimetableSettings } from '../types';
import { blobToBase64Parts, generateHomeworkPdf, viewPdfInNewTab } from '../utils/documentUtils';
import { useFileDrop } from '../hooks/useFileDrop';
import Avatar from './Avatar';
import { TabGroup } from './M3Components';
import PinPadModal from './PinPadModal';

interface StudentClassroomViewProps {
    student: Studente;
    lessons: Lezione[];
    register: RegisterEntry[];
    kb: KnowledgeBaseEntry[];
    submissions: HomeworkSubmission[];
    onUploadSubmission: (submission: HomeworkSubmission) => void;
    onLogout: () => void;
    onExitMode?: () => void; 
    securityPin?: string;
    settings?: TimetableSettings; 
}

const StudentClassroomView: React.FC<StudentClassroomViewProps> = ({ 
    student, lessons, register, kb, submissions, onUploadSubmission, onLogout, onExitMode, securityPin = '0000', settings
}) => {
    const [activeTab, setActiveTab] = useState<'feed' | 'homework' | 'materials'>('feed');
    const [isExitMenuOpen, setIsExitMenuOpen] = useState(false);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // Filter relevant data
    const classLessons = useMemo(() => 
        lessons.filter(l => l.classe === student.classe).sort((a,b) => b.id.localeCompare(a.id)), 
    [lessons, student.classe]);

    const feedItems = useMemo(() => {
        const items = [];
        for (const entry of register) {
            if (entry.classe === student.classe && entry.status === 'finalized') {
                const lesson = lessons.find(l => l.id === entry.lessonId);
                if (lesson) {
                    items.push({
                        type: 'lesson',
                        date: entry.date,
                        title: lesson.materia,
                        content: lesson.contenuto,
                        homework: lesson.compiti,
                        id: lesson.id,
                        originalLesson: lesson
                    });
                }
            }
        }
        return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [register, lessons, student.classe]);

    const pendingHomework = useMemo(() => {
        // Fix: Show homework ONLY if lesson is marked as done (svolta) OR is in finalized register
        // This prevents showing homework for future planned lessons
        return classLessons.filter(l => 
            l.compiti && 
            (l.svolta || register.some(r => r.lessonId === l.id && r.status === 'finalized')) &&
            !submissions.find(s => s.lessonId === l.id && s.studentId === student.id)
        );
    }, [classLessons, submissions, student.id, register]);

    const submittedHomework = useMemo(() => {
        return submissions.filter(s => s.studentId === student.id);
    }, [submissions, student.id]);

    const handleUpload = async (file: File, lessonId: string) => {
        try {
            const { data, mimeType } = await blobToBase64Parts(file);
            const submission: HomeworkSubmission = {
                id: `sub-${Date.now()}`,
                studentId: student.id,
                lessonId: lessonId,
                date: new Date().toISOString(),
                file: { name: file.name, data, mimeType },
                status: 'pending'
            };
            onUploadSubmission(submission);
            alert("Compito consegnato con successo!");
        } catch (e) {
            console.error(e);
            alert("Errore nel caricamento del file.");
        }
    };
    
    const handleDownloadHomeworkSheet = async (lesson: Lezione) => {
        if (!settings) {
            alert("Configurazione mancante. Impossibile generare il PDF.");
            return;
        }
        setIsGeneratingPdf(true);
        try {
            const blob = await generateHomeworkPdf(lesson, settings);
            viewPdfInNewTab(blob);
        } catch (e) {
            alert("Errore generazione PDF.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const UploadButton: React.FC<{ lessonId: string }> = ({ lessonId }) => {
        const onDrop = (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) handleUpload(acceptedFiles[0], lessonId);
        };
        const { getRootProps, getInputProps } = useFileDrop({ onDrop, multiple: false });
        return (
            <div {...getRootProps()} className="cursor-pointer border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl p-4 text-center hover:bg-primary/10 transition-colors mt-2">
                <input {...getInputProps()} />
                <span className="material-symbols-outlined text-primary mb-1">cloud_upload</span>
                <p className="text-xs font-bold text-primary">Carica Elaborato</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <header className="bg-surface border-b border-outline-variant p-4 flex justify-between items-center shadow-sm z-50 sticky top-0 relative">
                <div className="flex items-center gap-3">
                    <Avatar name={student.nome} surname={student.cognome} size="medium" />
                    <div>
                        <h1 className="text-lg font-bold text-on-surface leading-tight">Diario di Classe</h1>
                        <p className="text-xs text-on-surface-variant">Classe {student.classe}</p>
                    </div>
                </div>
                <button onClick={() => setIsExitMenuOpen(!isExitMenuOpen)} className="icon-button text-error bg-error-container/20">
                    <span className="material-symbols-outlined">power_settings_new</span>
                </button>
                
                {isExitMenuOpen && (
                    <div className="absolute top-16 right-4 bg-surface-container-high border border-outline-variant rounded-xl shadow-lg p-2 z-[60] w-56 flex flex-col animate-in fade-in zoom-in-95">
                        <button 
                            onClick={() => { onLogout(); setIsExitMenuOpen(false); }}
                            className="p-3 text-left hover:bg-surface-container text-on-surface rounded-lg flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-on-surface-variant">logout</span>
                            <div>
                                <p className="font-bold text-sm">Termina Sessione</p>
                                <p className="text-[10px] text-on-surface-variant">Torna al login studenti</p>
                            </div>
                        </button>
                        {onExitMode && (
                            <button 
                                onClick={() => { setIsPinModalOpen(true); setIsExitMenuOpen(false); }}
                                className="p-3 text-left hover:bg-error-container text-error rounded-lg flex items-center gap-3 mt-1"
                            >
                                <span className="material-symbols-outlined">lock</span>
                                <div>
                                    <p className="font-bold text-sm">Menu Docente</p>
                                    <p className="text-[10px] opacity-80">Richiede PIN</p>
                                </div>
                            </button>
                        )}
                    </div>
                )}
                {isExitMenuOpen && <div className="fixed inset-0 z-50" onClick={() => setIsExitMenuOpen(false)}></div>}
            </header>

            <div className="p-2 bg-surface-container-low">
                 <TabGroup 
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as 'feed' | 'homework' | 'materials')}
                    variant="secondary"
                    tabs={[
                        { id: 'feed', label: 'Attività', icon: 'feed' },
                        { id: 'homework', label: 'Compiti', icon: 'assignment', badge: pendingHomework.length || undefined },
                        { id: 'materials', label: 'Materiali', icon: 'folder' }
                    ]}
                    className="mb-2"
                />
            </div>

            <main className="flex-grow overflow-y-auto p-4 pb-20 bg-surface-container-low space-y-6">
                
                {activeTab === 'feed' && (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {feedItems.length > 0 ? feedItems.map((item) => (
                            <div key={item.id} className="card bg-surface">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded">
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.title}</span>
                                </div>
                                <h3 className="text-lg font-bold mb-2">{item.content}</h3>
                                {item.homework && (
                                    <div className="bg-surface-container-high p-3 rounded-lg border-l-4 border-tertiary mt-2">
                                        <div className="flex items-center gap-2 mb-1 text-tertiary font-bold text-xs uppercase">
                                            <span className="material-symbols-outlined text-sm">home_work</span>
                                            Compito
                                        </div>
                                        <p className="text-sm">{item.homework}</p>
                                    </div>
                                )}
                                {settings && (
                                     <button 
                                        onClick={() => handleDownloadHomeworkSheet(item.originalLesson)}
                                        disabled={isGeneratingPdf}
                                        className="button button-text w-full mt-2 text-xs flex items-center justify-center gap-2"
                                     >
                                         <span className="material-symbols-outlined text-sm">print</span>
                                         {isGeneratingPdf ? 'Generazione PDF...' : 'Scarica Scheda Lezione'}
                                     </button>
                                )}
                            </div>
                        )) : (
                            <div className="text-center p-10 text-on-surface-variant opacity-60">
                                <span className="material-symbols-outlined text-4xl mb-2">feed</span>
                                <p>Nessuna attività recente nel registro.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'homework' && (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        
                        <div>
                            <h3 className="m3-title-medium mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">pending_actions</span>
                                Da Consegnare ({pendingHomework.length})
                            </h3>
                            <div className="space-y-3">
                                {pendingHomework.map(lesson => (
                                    <div key={lesson.id} className="card border-l-4 border-l-primary">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold">{lesson.materia}</h4>
                                                <p className="text-sm text-on-surface-variant line-clamp-1">{lesson.contenuto}</p>
                                            </div>
                                            <span className="chip text-[10px]">Nuovo</span>
                                        </div>
                                        <div className="mt-3 p-3 bg-surface-container rounded text-sm">
                                            {lesson.compiti}
                                        </div>
                                        <UploadButton lessonId={lesson.id} />
                                    </div>
                                ))}
                                {pendingHomework.length === 0 && <p className="text-sm text-on-surface-variant italic">Nessun compito in sospeso.</p>}
                            </div>
                        </div>

                        <div>
                            <h3 className="m3-title-medium mb-3 text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined">history</span>
                                Storico Consegne
                            </h3>
                            <div className="space-y-2 opacity-80">
                                {submittedHomework.map(sub => {
                                    const relatedLesson = lessons.find(l => l.id === sub.lessonId);
                                    return (
                                        <div key={sub.id} className="p-3 bg-surface rounded-xl border border-outline-variant flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-sm">{relatedLesson?.materia || 'Materia'}</p>
                                                <p className="text-xs text-on-surface-variant">{new Date(sub.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sub.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {sub.status === 'graded' ? 'Valutato' : 'In attesa'}
                                                </span>
                                                {sub.teacherFeedback && <span className="text-xs mt-1 text-primary font-bold">Voto: {sub.teacherFeedback}</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'materials' && (
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                        {kb.map(entry => (
                            <div key={entry.id} className="card !p-3 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">
                                        {entry.fileName.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                    </span>
                                </div>
                                <p className="text-xs font-bold line-clamp-2">{entry.fileName}</p>
                            </div>
                        ))}
                        {kb.length === 0 && (
                            <div className="col-span-full text-center p-8 text-on-surface-variant">
                                <p>Nessun materiale condiviso.</p>
                            </div>
                        )}
                     </div>
                )}

            </main>
            
            {isPinModalOpen && onExitMode && (
                <PinPadModal
                    title="Uscita Modalità Studente"
                    correctPin={securityPin}
                    onSuccess={() => { setIsPinModalOpen(false); onExitMode(); }}
                    onCancel={() => setIsPinModalOpen(false)}
                />
            )}
        </div>
    );
};

export default StudentClassroomView;
