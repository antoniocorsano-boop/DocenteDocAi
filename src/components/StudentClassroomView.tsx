
import React, { useState, useMemo } from 'react';
import { Studente, Lezione, KnowledgeBaseEntry, HomeworkSubmission, RegisterEntry, TimetableSettings } from '../types';
import { blobToBase64Parts, generateHomeworkPdf, viewPdfInNewTab } from '../utils/documentUtils';
import { useFileDrop } from '../hooks/useFileDrop';
import { TabGroup, M3Button, SectionHeader, M3ExpressiveCard, Avatar } from './ui';
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
        } catch (e) {
            console.error(e);
        }
    };
    
    const handleDownloadHomeworkSheet = async (lesson: Lezione) => {
        if (!settings) return;
        setIsGeneratingPdf(true);
        try {
            const blob = await generateHomeworkPdf(lesson, settings);
            viewPdfInNewTab(blob);
        } catch (e) {
            console.error(e);
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
            <div {...getRootProps()} className="cursor-pointer border-2 border-dashed border-primary/30 bg-primary/5 rounded-[var(--md-sys-shape-corner-medium)] p-6 text-center hover:bg-primary/10 transition-all mt-4 group">
                <input {...getInputProps()} />
                <span className="material-symbols-outlined text-primary text-3xl mb-8 group-hover:scale-110 transition-transform">cloud_upload</span>
                <p className="text-xs font-black uppercase tracking-widest text-primary">Carica Elaborato</p>
                <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant opacity-60 mt-4">Trascina qui il file o clicca per selezionare</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-surface relative overflow-hidden">
            {/* Aura Ornaments */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary/5 rounded-full blur-[120px] pointer-events-none" />

            <header className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl border-b border-[var(--md-sys-color-outline-variant)]/10 p-6 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <Avatar name={`${student.nome} ${student.cognome}`} size="md" className="shadow-[var(--md-sys-elevation-level2)] border-2 border-white/20" />
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-black tracking-tight text-[var(--md-sys-color-on-surface)]">Diario di Classe</h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant opacity-70">Classe {student.classe} • {student.nome} {student.cognome}</p>
                    </div>
                </div>
                <M3Button onClick={() => setIsExitMenuOpen(!isExitMenuOpen)} variant="tonal" className="!w-12 !h-12 !p-0 !rounded-full text-error">
                    <span className="material-symbols-outlined">power_settings_new</span>
                </M3Button>
                
                {isExitMenuOpen && (
                    <div className="absolute top-20 right-6 bg-[var(--md-sys-color-surface-container-high)]/90 backdrop-blur-2xl border border-[var(--md-sys-color-outline-variant)]/20 rounded-[var(--md-sys-shape-corner-large)] shadow-[var(--md-sys-elevation-level4)] p-6 z-[60] w-64 flex flex-col animate-in fade-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => { onLogout(); setIsExitMenuOpen(false); }}
                            className="p-8 text-left hover:bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] rounded-[var(--md-sys-shape-corner-medium)] flex items-center gap-8 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant">logout</span>
                            <div className="space-y-0.5">
                                <p className="font-black text-xs uppercase tracking-widest">Termina Sessione</p>
                                <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant opacity-70">Torna al login studenti</p>
                            </div>
                        </button>
                        {onExitMode && (
                            <button 
                                onClick={() => { setIsPinModalOpen(true); setIsExitMenuOpen(false); }}
                                className="p-8 text-left hover:bg-error/10 text-error rounded-[var(--md-sys-shape-corner-medium)] flex items-center gap-8 transition-colors mt-4"
                            >
                                <span className="material-symbols-outlined">lock</span>
                                <div className="space-y-0.5">
                                    <p className="font-black text-xs uppercase tracking-widest">Menu Docente</p>
                                    <p className="text-[10px] opacity-70">Richiede PIN di sicurezza</p>
                                </div>
                            </button>
                        )}
                    </div>
                )}
                {isExitMenuOpen && <div className="fixed inset-0 z-50" onClick={() => setIsExitMenuOpen(false)}></div>}
            </header>

            <div className="bg-[var(--md-sys-color-surface-container-low)]/50 backdrop-blur-md p-8 border-b border-[var(--md-sys-color-outline-variant)]/10">
                 <TabGroup 
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as 'feed' | 'homework' | 'materials')}
                    variant="secondary"
                    tabs={[
                        { id: 'feed', label: 'Attività', icon: 'feed' },
                        { id: 'homework', label: 'Compiti', icon: 'assignment', badge: pendingHomework.length || undefined },
                        { id: 'materials', label: 'Materiali', icon: 'folder' }
                    ]}
                    className="max-w-2xl mx-auto"
                />
            </div>

            <main className="flex-grow overflow-y-auto p-6 pb-24 space-y-8 relative z-10">
                
                {activeTab === 'feed' && (
                    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {feedItems.length > 0 ? feedItems.map((item) => (
                            <M3ExpressiveCard key={item.id} className="p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-secondary/10 text-secondary px-3 py-1.5 rounded-full">
                                            {new Date(item.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{item.title}</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-[var(--md-sys-color-on-surface)]">{item.content}</h3>
                                {item.homework && (
                                    <div className="bg-tertiary/5 p-6 rounded-[var(--md-sys-shape-corner-large)] border border-tertiary/10 space-y-3">
                                        <div className="flex items-center gap-8 text-tertiary">
                                            <span className="material-symbols-outlined text-lg">home_work</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Compito per casa</span>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed text-[var(--md-sys-color-on-surface)]-variant">{item.homework}</p>
                                    </div>
                                )}
                                {settings && (
                                     <M3Button 
                                        onClick={() => handleDownloadHomeworkSheet(item.originalLesson)}
                                        disabled={isGeneratingPdf}
                                        variant="text"
                                        className="w-full font-black text-[10px] uppercase tracking-widest"
                                     >
                                         <span className="material-symbols-outlined mr-2 text-sm">print</span>
                                         {isGeneratingPdf ? 'Generazione PDF...' : 'Scarica Scheda Lezione'}
                                     </M3Button>
                                )}
                            </M3ExpressiveCard>
                        )) : (
                            <div className="text-center p-20 bg-[var(--md-sys-color-surface-container-low)]/30 rounded-5xl border border-[var(--md-sys-color-outline-variant)]/10">
                                <span className="material-symbols-outlined text-6xl mb-8 text-[var(--md-sys-color-on-surface)]-variant opacity-20">feed</span>
                                <p className="text-sm font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant opacity-40">Nessuna attività recente nel registro.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'homework' && (
                    <div className="space-y-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        <div className="space-y-6">
                            <SectionHeader 
                                title={`Da Consegnare (${pendingHomework.length})`} 
                                icon="pending_actions" 
                                className="!mb-0"
                            />
                            <div className="space-y-4">
                                {pendingHomework.map(lesson => (
                                    <M3ExpressiveCard key={lesson.id} className="p-8 border-l-8 border-l-primary">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="space-y-1">
                                                <h4 className="text-xl font-black tracking-tight">{lesson.materia}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant opacity-60">{lesson.contenuto}</p>
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">Nuovo</span>
                                        </div>
                                        <div className="p-6 bg-[var(--md-sys-color-surface-container-high)]/50 rounded-[var(--md-sys-shape-corner-medium)] text-sm font-medium leading-relaxed">
                                            {lesson.compiti}
                                        </div>
                                        <UploadButton lessonId={lesson.id} />
                                    </M3ExpressiveCard>
                                ))}
                                {pendingHomework.length === 0 && (
                                    <div className="p-12 bg-[var(--md-sys-color-surface-container-low)]/30 rounded-5xl border border-[var(--md-sys-color-outline-variant)]/10 text-center">
                                        <p className="text-sm font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant opacity-40">Nessun compito in sospeso.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <SectionHeader 
                                title="Storico Consegne" 
                                icon="history" 
                                className="!mb-0"
                            />
                            <div className="space-y-3">
                                {submittedHomework.map(sub => {
                                    const relatedLesson = lessons.find(l => l.id === sub.lessonId);
                                    return (
                                        <div key={sub.id} className="p-6 bg-[var(--md-sys-color-surface-container-low)]/50 backdrop-blur-xl rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]/10 flex justify-between items-center group hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors">
                                            <div className="space-y-1">
                                                <p className="font-black text-sm uppercase tracking-widest">{relatedLesson?.materia || 'Materia'}</p>
                                                <p className="text-[10px] font-medium text-[var(--md-sys-color-on-surface)]-variant opacity-60">{new Date(sub.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-8">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${sub.status === 'graded' ? 'bg-secondary-container/50 text-on-secondary-container' : 'bg-tertiary-container/50 text-on-tertiary-container'}`}>
                                                    {sub.status === 'graded' ? 'Valutato' : 'In attesa'}
                                                </span>
                                                {sub.teacherFeedback && <span className="text-xs font-black text-primary">Voto: {sub.teacherFeedback}</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                                {submittedHomework.length === 0 && (
                                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant opacity-40 py-8">Nessuna consegna effettuata.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'materials' && (
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {kb.map(entry => (
                            <M3ExpressiveCard key={entry.id} className="!p-6 flex flex-col items-center text-center gap-8 hover:scale-105 transition-transform cursor-pointer group">
                                <div className="w-16 h-16 rounded-[var(--md-sys-shape-corner-medium)] bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">
                                        {entry.fileName.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest line-clamp-2 leading-relaxed">{entry.fileName}</p>
                            </M3ExpressiveCard>
                        ))}
                        {kb.length === 0 && (
                            <div className="col-span-full text-center p-20 bg-[var(--md-sys-color-surface-container-low)]/30 rounded-5xl border border-[var(--md-sys-color-outline-variant)]/10">
                                <span className="material-symbols-outlined text-6xl mb-8 text-[var(--md-sys-color-on-surface)]-variant opacity-20">folder_off</span>
                                <p className="text-sm font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant opacity-40">Nessun materiale condiviso.</p>
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


