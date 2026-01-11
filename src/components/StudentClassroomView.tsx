
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
            <div {...getRootProps()} className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-[var(--md-sys-shape-corner-medium)] hover:bg-primary/10 group" style={{ cursor: "pointer", padding: "var(--md-sys-spacing-6)", textAlign: "center", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", marginTop: "var(--md-sys-spacing-4)" }}>
                <input {...getInputProps()} />
                <span className="material-symbols-outlined text-3xl group-hover:scale-110" style={{ color: "var(--md-sys-color-primary)", marginBottom: "var(--md-sys-spacing-8)", transition: "transform 300ms" }}>cloud_upload</span>
                <p style={{ fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-primary)" }}>Carica Elaborato</p>
                <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant" style={{ opacity: "0.6", marginTop: "var(--md-sys-spacing-4)" }}>Trascina qui il file o clicca per selezionare</p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--md-sys-color-surface)" }}>
            {/* Aura Ornaments */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] pointer-events-none" style={{ borderRadius: "9999px" }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary/5 blur-[120px] pointer-events-none" style={{ borderRadius: "9999px" }} />

            <header className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl border-[var(--md-sys-color-outline-variant)]/10 sticky top-0 z-50" style={{ borderBottom: "1px solid var(--md-sys-color-outline)", padding: "var(--md-sys-spacing-6)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                    <Avatar name={`${student.nome} ${student.cognome}`} size="md" className="shadow-[var(--md-sys-elevation-level2)] border-2 border-white/20" />
                    <div className="space-y-0.5">
                        <h1 className="text-[var(--md-sys-color-on-surface)]" style={{ fontSize: "1.25rem", fontWeight: "900", letterSpacing: "-0.005em" }}>Diario di Classe</h1>
                        <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.7" }}>Classe {student.classe} • {student.nome} {student.cognome}</p>
                    </div>
                </div>
                <M3Button onClick={() => setIsExitMenuOpen(!isExitMenuOpen)} variant="tonal" className="!w-12 !h-12 !p-0 !rounded-full" style={{ color: "var(--md-sys-color-error)" }}>
                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>power_settings_new</span>
                </M3Button>
                
                {isExitMenuOpen && (
                    <div className="absolute top-20 right-6 bg-[var(--md-sys-color-surface-container-high)]/90 backdrop-blur-2xl border-[var(--md-sys-color-outline-variant)]/20 rounded-[var(--md-sys-shape-corner-large)] shadow-[var(--md-sys-elevation-level4)] z-[60] w-64 animate-in fade-in zoom-in-95 duration-300" style={{ border: "1px solid var(--md-sys-color-outline)", padding: "var(--md-sys-spacing-6)", display: "flex", flexDirection: "column" }}>
                        <button 
                            onClick={() => { onLogout(); setIsExitMenuOpen(false); }}
                            className="hover:bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] rounded-[var(--md-sys-shape-corner-medium)]" style={{ padding: "var(--md-sys-spacing-8)", textAlign: "left", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", transition: "color 300ms" }}
                        >
                            <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant">logout</span>
                            <div className="space-y-0.5">
                                <p style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Termina Sessione</p>
                                <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant" style={{ opacity: "0.7" }}>Torna al login studenti</p>
                            </div>
                        </button>
                        {onExitMode && (
                            <button 
                                onClick={() => { setIsPinModalOpen(true); setIsExitMenuOpen(false); }}
                                className="hover:bg-error/10 rounded-[var(--md-sys-shape-corner-medium)]" style={{ padding: "var(--md-sys-spacing-8)", textAlign: "left", color: "var(--md-sys-color-error)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", transition: "color 300ms", marginTop: "var(--md-sys-spacing-4)" }}
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>lock</span>
                                <div className="space-y-0.5">
                                    <p style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Menu Docente</p>
                                    <p className="text-[10px]" style={{ opacity: "0.7" }}>Richiede PIN di sicurezza</p>
                                </div>
                            </button>
                        )}
                    </div>
                )}
                {isExitMenuOpen && <div className="fixed inset-0 z-50" onClick={() => setIsExitMenuOpen(false)}></div>}
            </header>

            <div className="bg-[var(--md-sys-color-surface-container-low)]/50 backdrop-blur-md border-[var(--md-sys-color-outline-variant)]/10" style={{ padding: "var(--md-sys-spacing-8)", borderBottom: "1px solid var(--md-sys-color-outline)" }}>
                 <TabGroup 
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as 'feed' | 'homework' | 'materials')}
                    variant="secondary"
                    tabs={[
                        { id: 'feed', label: 'Attività', icon: 'feed' },
                        { id: 'homework', label: 'Compiti', icon: 'assignment', badge: pendingHomework.length || undefined },
                        { id: 'materials', label: 'Materiali', icon: 'folder' }
                    ]}
                    className="max-w-2xl" style={{ marginLeft: "auto", marginRight: "auto" }}
                />
            </div>

            <main className="pb-24 relative z-10" style={{ flexGrow: "1", overflowY: "auto", padding: "var(--md-sys-spacing-6)", gap: "var(--md-sys-spacing-8)" }}>
                
                {activeTab === 'feed' && (
                    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ gap: "var(--md-sys-spacing-6)", marginLeft: "auto", marginRight: "auto" }}>
                        {feedItems.length > 0 ? feedItems.map((item) => (
                            <M3ExpressiveCard key={item.id} style={{ padding: "var(--md-sys-spacing-8)", gap: "var(--md-sys-spacing-6)" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}>
                                        <span className="text-[10px] bg-secondary/10 px-3 py-1.5" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-secondary)", borderRadius: "9999px" }}>
                                            {new Date(item.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                                        </span>
                                        <span className="text-[10px] tracking-[0.2em]" style={{ fontWeight: "900", textTransform: "uppercase", color: "var(--md-sys-color-primary)" }}>{item.title}</span>
                                    </div>
                                </div>
                                <h3 className="text-[var(--md-sys-color-on-surface)]" style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "-0.005em" }}>{item.content}</h3>
                                {item.homework && (
                                    <div className="bg-tertiary/5 rounded-[var(--md-sys-shape-corner-large)] border-tertiary/10" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", gap: "var(--md-sys-spacing-3)" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", color: "var(--md-sys-color-tertiary)" }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>home_work</span>
                                            <span className="text-[10px]" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Compito per casa</span>
                                        </div>
                                        <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.875rem", fontWeight: "500", lineHeight: "1.625" }}>{item.homework}</p>
                                    </div>
                                )}
                                {settings && (
                                     <M3Button 
                                        onClick={() => handleDownloadHomeworkSheet(item.originalLesson)}
                                        disabled={isGeneratingPdf}
                                        variant="text"
                                        className="text-[10px]" style={{ width: "100%", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}
                                     >
                                         <span className="material-symbols-outlined" style={{ marginRight: "0.5rem", fontSize: "0.875rem" }}>print</span>
                                         {isGeneratingPdf ? 'Generazione PDF...' : 'Scarica Scheda Lezione'}
                                     </M3Button>
                                )}
                            </M3ExpressiveCard>
                        )) : (
                            <div className="p-20 bg-[var(--md-sys-color-surface-container-low)]/30 rounded-5xl border-[var(--md-sys-color-outline-variant)]/10" style={{ textAlign: "center", border: "1px solid var(--md-sys-color-outline)" }}>
                                <span className="material-symbols-outlined text-6xl text-[var(--md-sys-color-on-surface)]-variant" style={{ marginBottom: "var(--md-sys-spacing-8)", opacity: "0.2" }}>feed</span>
                                <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.875rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessuna attività recente nel registro.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'homework' && (
                    <div className="space-y-10 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ marginLeft: "auto", marginRight: "auto" }}>
                        
                        <div style={{ gap: "var(--md-sys-spacing-6)" }}>
                            <SectionHeader 
                                title={`Da Consegnare (${pendingHomework.length})`} 
                                icon="pending_actions" 
                                className="!mb-0"
                            />
                            <div style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                                {pendingHomework.map(lesson => (
                                    <M3ExpressiveCard key={lesson.id} className="border-l-8 border-l-primary" style={{ padding: "var(--md-sys-spacing-8)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--md-sys-spacing-8)" }}>
                                            <div style={{ gap: "var(--md-sys-spacing-1)" }}>
                                                <h4 style={{ fontSize: "1.25rem", fontWeight: "900", letterSpacing: "-0.005em" }}>{lesson.materia}</h4>
                                                <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.6" }}>{lesson.contenuto}</p>
                                            </div>
                                            <span className="text-[9px] bg-primary/10 px-3 py-1" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-primary)", borderRadius: "9999px" }}>Nuovo</span>
                                        </div>
                                        <div className="bg-[var(--md-sys-color-surface-container-high)]/50 rounded-[var(--md-sys-shape-corner-medium)]" style={{ padding: "var(--md-sys-spacing-6)", fontSize: "0.875rem", fontWeight: "500", lineHeight: "1.625" }}>
                                            {lesson.compiti}
                                        </div>
                                        <UploadButton lessonId={lesson.id} />
                                    </M3ExpressiveCard>
                                ))}
                                {pendingHomework.length === 0 && (
                                    <div className="p-12 bg-[var(--md-sys-color-surface-container-low)]/30 rounded-5xl border-[var(--md-sys-color-outline-variant)]/10" style={{ border: "1px solid var(--md-sys-color-outline)", textAlign: "center" }}>
                                        <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.875rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessun compito in sospeso.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ gap: "var(--md-sys-spacing-6)" }}>
                            <SectionHeader 
                                title="Storico Consegne" 
                                icon="history" 
                                className="!mb-0"
                            />
                            <div style={{ gap: "var(--md-sys-spacing-3)" }}>
                                {submittedHomework.map(sub => {
                                    const relatedLesson = lessons.find(l => l.id === sub.lessonId);
                                    return (
                                        <div key={sub.id} className="bg-[var(--md-sys-color-surface-container-low)]/50 backdrop-blur-xl rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]/10 group hover:bg-[var(--md-sys-color-surface-container-low)]" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color 300ms" }}>
                                            <div style={{ gap: "var(--md-sys-spacing-1)" }}>
                                                <p style={{ fontWeight: "900", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{relatedLesson?.materia || 'Materia'}</p>
                                                <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "500", opacity: "0.6" }}>{new Date(sub.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--md-sys-spacing-8)" }}>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${sub.status === 'graded' ? 'bg-secondary-container/50 text-on-secondary-container' : 'bg-tertiary-container/50 text-on-tertiary-container'}`}>
                                                    {sub.status === 'graded' ? 'Valutato' : 'In attesa'}
                                                </span>
                                                {sub.teacherFeedback && <span style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--md-sys-color-primary)" }}>Voto: {sub.teacherFeedback}</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                                {submittedHomework.length === 0 && (
                                    <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant py-8" style={{ textAlign: "center", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessuna consegna effettuata.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'materials' && (
                     <div className="md:grid-cols-3 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--md-sys-spacing-6)", marginLeft: "auto", marginRight: "auto" }}>
                        {kb.map(entry => (
                            <M3ExpressiveCard key={entry.id} className="!p-6 hover:scale-105 group" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--md-sys-spacing-8)", transition: "transform 300ms", cursor: "pointer" }}>
                                <div className="rounded-[var(--md-sys-shape-corner-medium)] bg-secondary/10 group-hover:bg-secondary group-hover:text-white" style={{ width: "4rem", height: "4rem", color: "var(--md-sys-color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 300ms" }}>
                                    <span className="material-symbols-outlined text-3xl">
                                        {entry.fileName.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                    </span>
                                </div>
                                <p className="text-[10px] line-clamp-2" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: "1.625" }}>{entry.fileName}</p>
                            </M3ExpressiveCard>
                        ))}
                        {kb.length === 0 && (
                            <div className="col-span-full p-20 bg-[var(--md-sys-color-surface-container-low)]/30 rounded-5xl border-[var(--md-sys-color-outline-variant)]/10" style={{ textAlign: "center", border: "1px solid var(--md-sys-color-outline)" }}>
                                <span className="material-symbols-outlined text-6xl text-[var(--md-sys-color-on-surface)]-variant" style={{ marginBottom: "var(--md-sys-spacing-8)", opacity: "0.2" }}>folder_off</span>
                                <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.875rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.4" }}>Nessun materiale condiviso.</p>
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


