import React, { useState } from 'react';
import { HomeworkSubmission, Lezione, Studente } from '../types';
import { TextField, SelectField, M3Button, Avatar } from './ui';
import { RATING_OPTIONS } from '../constants';

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for homework submission cards, grading forms, and status displays
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
        <div className="homework-submission-card">
            <div className="homework-submission-header">
                <Avatar name={`${student.nome} ${student.cognome}`} size="lg" className="shadow-[var(--md-sys-elevation-level2)] ring-4 ring-primary/10" />
                <div className="homework-submission-student-info">
                    <h3 className="homework-submission-student-name">{student.cognome} {student.nome}</h3>
                    <p className="homework-submission-student-meta">
                        {lesson.materia} • {lesson.contenuto}
                    </p>
                </div>
            </div>

            <div className="homework-submission-file-section">
                <div className="homework-submission-file-info">
                    <div className="homework-submission-file-icon">
                        <span className="material-symbols-outlined text-3xl">description</span>
                    </div>
                    <div>
                        <p className="homework-submission-file-details">{submission.file?.name || 'Allegato Elaborato'}</p>
                        <p className="homework-submission-file-meta">{submission.file?.mimeType}</p>
                    </div>
                </div>
                <M3Button onClick={handleDownload} variant="tonal" className="!h-12 !px-6 shadow-sm" style={{ fontSize: "0.875rem", fontWeight: "900" }}>
                    <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>download</span> 
                    Scarica
                </M3Button>
            </div>

            {submission.status === 'pending' && onGrade && (
                <div className="homework-submission-grading-form">
                    <div className="homework-submission-grading-grid">
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
                        className="homework-submission-submit-btn"
                    >
                        <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>task_alt</span>
                        Registra Valutazione & Archivia
                    </M3Button>
                </div>
            )}

            {submission.status === 'graded' && (
                <div className="homework-submission-graded-status">
                    <div className="homework-submission-graded-icon">
                        <span className="material-symbols-outlined text-3xl">check</span>
                    </div>
                    <div>
                        <p className="homework-submission-graded-meta">Valutato con successo</p>
                        <p className="homework-submission-graded-result">Esito: {submission.teacherFeedback}</p>
                        {feedback && <p className="homework-submission-feedback">"{feedback}"</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeworkSubmissionCard;


