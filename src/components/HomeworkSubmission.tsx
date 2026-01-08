import React, { useState } from 'react';
import { HomeworkSubmission, Lezione, Studente } from '../types';
import { TextField, SelectField, M3Button, Avatar } from './ui';
import { RATING_OPTIONS } from '../constants';

interface HomeworkSubmissionProps {
    submission: HomeworkSubmission;
    student: Studente;
    lesson: Lezione;
    onGrade?: (submissionId: string, grade: string, feedback: string) => void;
}

const HomeworkSubmissionCard: React.FC<HomeworkSubmissionProps> = ({ submission, student, lesson, onGrade }) => {
    const [grade, setGrade] = useState<string>(submission.teacherFeedback || '');
    const [feedback, setFeedback] = useState<string>('');

    const handleDownload = () => {
        if (submission.file) {
            const byteCharacters = atob(submission.file.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: submission.file.mimeType });
            saveAs(blob, submission.file.name);
        }
    };

    const handleGradeSubmit = () => {
        if (onGrade) {
            onGrade(submission.id, grade, feedback);
        }
    };

    return (
        <div className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl border border-[var(--md-sys-color-outline-variant)]/30 rounded-4xl p-8 shadow-[var(--md-sys-elevation-level3)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-6 mb-8">
                <Avatar name={`${student.nome} ${student.cognome}`} size="lg" className="shadow-[var(--md-sys-elevation-level2)] ring-4 ring-primary/10" />
                <div className="min-w-0">
                    <h3 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] font-black truncate text-[var(--md-sys-color-on-surface)]">{student.cognome} {student.nome}</h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-4 opacity-70">
                        {lesson.materia} • {lesson.contenuto}
                    </p>
                </div>
            </div>

            <div className="bg-[var(--md-sys-color-surface-container-high)]/50 backdrop-blur-md p-6 rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]/20 flex items-center justify-between shadow-inner mb-8">
                <div className="flex items-center gap-8">
                    <div className="w-14 h-14 rounded-[var(--md-sys-shape-corner-large)] bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-3xl">description</span>
                    </div>
                    <div>
                        <p className="text-sm font-black text-[var(--md-sys-color-on-surface)]">{submission.file?.name || 'Allegato Elaborato'}</p>
                        <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant font-mono uppercase mt-4 opacity-60">{submission.file?.mimeType}</p>
                    </div>
                </div>
                <M3Button onClick={handleDownload} variant="tonal" className="!h-12 !px-6 text-sm font-black shadow-sm">
                    <span className="material-symbols-outlined mr-2">download</span> 
                    Scarica
                </M3Button>
            </div>

            {submission.status === 'pending' && onGrade && (
                <div className="space-y-6 pt-8 border-t border-[var(--md-sys-color-outline-variant)]/10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <SelectField
                            label="Voto Finale"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            containerClassName="md:col-span-1"
                        >
                            <option value="">-</option>
                            {RATING_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                        </SelectField>
                        <TextField
                            label="Feedback Rapido"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Es. Analisi molto curata, bravo..."
                            containerClassName="md:col-span-3"
                            leadingIcon="chat"
                        />
                    </div>
                    <M3Button 
                        onClick={handleGradeSubmit} 
                        disabled={!grade} 
                        variant="filled"
                        className="w-full justify-center shadow-[var(--md-sys-elevation-level2)] font-black !h-16 !rounded-[var(--md-sys-shape-corner-medium)] text-sm uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined mr-2">task_alt</span>
                        Registra Valutazione & Archivia
                    </M3Button>
                </div>
            )}

            {submission.status === 'graded' && (
                <div className="bg-secondary-container/10 text-secondary p-6 rounded-[var(--md-sys-shape-corner-large)] border border-secondary/20 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-[var(--md-sys-elevation-level2)]">
                        <span className="material-symbols-outlined text-3xl">check</span>
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest opacity-70">Valutato con successo</p>
                        <p className="m3-title-large font-black text-[var(--md-sys-color-on-surface)] mt-4">Esito: {submission.teacherFeedback}</p>
                        {feedback && <p className="text-sm opacity-70 mt-4 italic bg-[var(--md-sys-color-surface-container-low)]/50 p-6 rounded-[var(--md-sys-shape-corner-medium)] border border-[var(--md-sys-color-outline-variant)]/10">"{feedback}"</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeworkSubmissionCard;
