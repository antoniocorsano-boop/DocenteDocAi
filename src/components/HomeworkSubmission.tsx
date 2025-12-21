import React, { useState } from 'react';
import { HomeworkSubmission, Lezione, Studente } from '../types'; // FIX: Corrected import path to ../types
import Avatar from './Avatar';
import { saveAs } from '../utils/documentUtils';
import { TextField, SelectField, TextArea } from './M3Components';
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
        <div className="card border-l-4 border-l-primary flex flex-col gap-8 shadow-xl !rounded-[40px] !p-8 animate-in fade-in">
            <div className="flex items-center gap-6">
                <Avatar name={student.nome} surname={student.cognome} size="large" className="shadow-md" />
                <div className="min-w-0">
                    <h3 className="m3-headline-small font-black truncate">{student.cognome} {student.nome}</h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-1 opacity-70">
                        {lesson.materia} • {lesson.contenuto}
                    </p>
                </div>
            </div>

            <div className="bg-surface-container-high p-6 rounded-[32px] border border-outline-variant flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-container text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <div>
                        <p className="text-sm font-black text-on-surface">{submission.file?.name || 'Allegato Elaborato'}</p>
                        <p className="text-[10px] text-on-surface-variant font-mono uppercase mt-1 opacity-60">{submission.file?.mimeType}</p>
                    </div>
                </div>
                <button onClick={handleDownload} className="button button-tonal !h-12 !px-6 text-sm font-black shadow-sm">
                    <span className="material-symbols-outlined mr-2">download</span> Scarica
                </button>
            </div>

            {submission.status === 'pending' && onGrade && (
                <div className="space-y-6 pt-6 border-t border-outline-variant/30">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        />
                    </div>
                    <button onClick={handleGradeSubmit} disabled={!grade} className="button button-filled w-full justify-center shadow-lg font-black !h-14 !rounded-[24px]">
                        Registra Valutazione & Archivia
                    </button>
                </div>
            )}

            {submission.status === 'graded' && (
                <div className="bg-secondary-container/20 text-secondary p-6 rounded-[32px] border border-secondary/20 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-2xl">check</span>
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-widest">Valutato con successo</p>
                        <p className="m3-title-medium font-black text-on-surface mt-1">Esito: {submission.teacherFeedback}</p>
                        {feedback && <p className="text-xs opacity-70 mt-1 italic">"{feedback}"</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeworkSubmissionCard;
