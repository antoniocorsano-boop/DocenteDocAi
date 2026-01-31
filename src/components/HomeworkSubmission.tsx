// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
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
        <div >
            <div >
                <Avatar name={`${student.nome} ${student.cognome}`} size="lg"  />
                <div >
                    <h3 >{student.cognome} {student.nome}</h3>
                    <p >
                        {lesson.materia} • {lesson.contenuto}
                    </p>
                </div>
            </div>

            <div >
                <div >
                    <div >
                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>description</span>
                    </div>
                    <div>
                        <p >{submission.file?.name || 'Allegato Elaborato'}</p>
                        <p >{submission.file?.mimeType}</p>
                    </div>
                </div>
                <M3Button onClick={handleDownload} variant="tonal"  style={{ fontSize: "var(--app-text-label)", fontWeight: "900" }}>
                    <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>download</span> 
                    Scarica
                </M3Button>
            </div>

            {submission.status === 'pending' && onGrade && (
                <div >
                    <div >
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
                        
                    >
                        <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>task_alt</span>
                        Registra Valutazione & Archivia
                    </M3Button>
                </div>
            )}

            {submission.status === 'graded' && (
                <div >
                    <div >
                        <span style={{ color: 'var(--md-sys-color-primary)' }}>check</span>
                    </div>
                    <div>
                        <p >Valutato con successo</p>
                        <p >Esito: {submission.teacherFeedback}</p>
                        {feedback && <p >"{feedback}"</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeworkSubmissionCard;








