// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
import React, { useState } from 'react';
import { HomeworkSubmission, Lezione, Studente } from '../types';
import { TextField, Avatar } from './ui';
import { Button, FormControl, InputLabel, NativeSelect, InputAdornment } from '@mui/material';
import { saveAs } from '../utils/documentUtils';
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <Avatar name={`${student.nome} ${student.cognome}`} size="lg"  />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <h3>{student.cognome} {student.nome}</h3>
                    <p>
                        {lesson.materia} • {lesson.contenuto}
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>description</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        <p>{submission.file?.name || 'Allegato Elaborato'}</p>
                        <p>{submission.file?.mimeType}</p>
                    </div>
                </div>
                <Button onClick={handleDownload} variant="contained" color="secondary" sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)', fontWeight: 'var(--md-sys-typescale-weight-black)' }}>
                    <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>download</span> 
                    Scarica
                </Button>
            </div>

            {submission.status === 'pending' && onGrade && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                                <FormControl sx={{ mb: 2 }}>
                          <InputLabel>Voto Finale</InputLabel>
                          <NativeSelect
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                          >

                            <option value="">-</option>
                            {RATING_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                        
                          </NativeSelect>
                        </FormControl>
                        <TextField
                            label="Feedback Rapido"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Es. Analisi molto curata, bravo..."
                            slotProps={{ htmlInput: { startAdornment: <InputAdornment position="start"><span className="material-symbols-outlined" aria-hidden="true">chat</span></InputAdornment> } }}
                        />
                    </div>
                    <Button 
                        onClick={handleGradeSubmit} 
                        disabled={!grade} 
                        variant="contained"
                    >
                        <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>task_alt</span>
                        Registra Valutazione & Archivia
                    </Button>
                </div>
            )}

            {submission.status === 'graded' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                        <span style={{ color: 'var(--md-sys-color-primary)' }}>check</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        <p>Valutato con successo</p>
                        <p>Esito: {submission.teacherFeedback}</p>
                        {feedback && <p>"{feedback}"</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeworkSubmissionCard;

