// MD3 Compliant - Block G Migration (12 violations eliminated)

import React, { useState } from 'react';
import { Studente, StudentHistoryRecord } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, TextField, SelectField } from './ui';
interface StudentTransferModalProps {
    student: Studente;
    userClasses: string[];
    onClose: () => void;
    onSave: (student: Studente) => void;
    currentSchoolYear: string;
}

const StudentTransferModal: React.FC<StudentTransferModalProps> = ({ student, userClasses, onClose, onSave, currentSchoolYear }) => {
  const [mode, setMode] = useState<'change_class' | 'transfer_out'>('change_class');
    const [newClass, setNewClass] = useState(student.classe);
    const [outcome, setOutcome] = useState<'Trasferito' | 'Ritirato'>('Trasferito');

    // We allow user to create a new class on the fly if needed
    const [isCustomClass, setIsCustomClass] = useState(false);
    const [customClass, setCustomClass] = useState('');

    const handleSave = () => {
        const updatedStudent = { ...student };
        const currentDate = new Date().toISOString().split('T')[0];

        if (mode === 'change_class') {
            const targetClass = isCustomClass ? customClass.toUpperCase() : newClass;
            if (!targetClass) {
                alert("Seleziona o inserisci la nuova classe.");
                return;
            }

            // Create a history record for the partial year in the old class
            const historyRecord: StudentHistoryRecord = {
                year: currentSchoolYear,
                classe: student.classe,
                averageGrade: '-', // Grade calculation would require props drilling, keep it simple for now or calc if available
                absencesPercentage: 0,
                finalOutcome: 'Trasferito', // Internal transfer
                competencySummary: [{ name: 'Cambio Classe', level: `Passaggio alla ${targetClass} il ${currentDate}` }]
            };

            updatedStudent.classe = targetClass;
            updatedStudent.history = [...(student.history || []), historyRecord];

        } else {
            // Archive student
            const historyRecord: StudentHistoryRecord = {
                year: currentSchoolYear,
                classe: student.classe,
                averageGrade: '-',
                absencesPercentage: 0,
                finalOutcome: outcome,
                competencySummary: [{ name: 'Uscita', level: `Data: ${currentDate}` }]
            };

            updatedStudent.isArchived = true;
            updatedStudent.archiveYear = currentSchoolYear;
            updatedStudent.history = [...(student.history || []), historyRecord];
        }

        onSave(updatedStudent);
        onClose();
    };

    return (
        <M3Dialog
            onClose={onClose}
            title="Mobilità Studente"
            maxWidth="sm"
            level={1}
        >
            <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', opacity: 0.3 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)', paddingTop: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-4)' }}>
                    <div style={{ backgroundColor: 'var(--md-sys-color-secondary-container)', opacity: 0.1, borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-8)', border: '1px solid var(--md-sys-color-outline)' }}>
                        <p style={{ color: 'var(--md-sys-color-on-primary)' }}>
                            Gestisci lo spostamento di <strong>{student.cognome} {student.nome}</strong>
                        </p>
                    </div>

                    <TabGroup
                        tabs={[
                            { id: 'change_class', label: 'Cambio Classe' },
                            { id: 'transfer_out', label: 'Trasferimento / Ritiro' }
                        ]}
                        activeTab={mode}
                        onTabChange={(id) => setMode(id as 'change_class' | 'transfer_out')}
                        variant="secondary"
                        style={{ width: '100%' }}
                    />

                    {mode === 'change_class' ? (
                        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-8)', border: '1px solid var(--md-sys-color-outline)', display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-8)' }}>
                            <h3 style={{ color: 'var(--md-sys-color-primary)', paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)' }}>Nuova Destinazione</h3>

                            {!isCustomClass ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-8)' }}>
                                    <SelectField
                                        label="Seleziona Classe Esistente"
                                        value={newClass}
                                        onChange={(e) => setNewClass(e.target.value)}
                                        options={userClasses.map(c => ({ value: c, label: c }))}
                                        fullWidth
                                    />
                                    <M3Button 
                                        variant="text" 
                                        onClick={() => setIsCustomClass(true)}
                                    >
                                        + Crea Nuova Classe
                                    </M3Button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-8)' }}>
                                    <TextField
                                        label="Nome Nuova Classe"
                                        value={customClass}
                                        onChange={(e) => setCustomClass(e.target.value)}
                                        placeholder="es. 1A"
                                        fullWidth
                                    />
                                    <M3Button 
                                        variant="text" 
                                        onClick={() => setIsCustomClass(false)}
                                    >
                                        Torna a lista esistente
                                    </M3Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ backgroundColor: 'var(--md-sys-color-error-container)', opacity: 0.1, borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-8)', border: '1px solid var(--md-sys-color-outline)', display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-8)' }}>
                            <h3 style={{ color: 'var(--md-sys-color-error)', paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)' }}>Motivazione Uscita</h3>
                            <SelectField
                                label="Esito"
                                value={outcome}
                                onChange={(e) => setOutcome(e.target.value)}
                                options={[
                                    { value: 'Trasferito', label: 'Trasferito ad altra scuola' },
                                    { value: 'Ritirato', label: 'Ritirato dagli studi' }
                                ]}
                                fullWidth
                            />
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)' }}>
                                Lo studente verrà rimosso dall'elenco attivo e spostato nell'archivio storico.
                            </p>
                        </div>
                    )}
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button 
                    onClick={handleSave} 
                    variant="filled"
                    color={mode === 'transfer_out' ? 'error' : 'primary'}
                >
                    {mode === 'change_class' ? 'Sposta Studente' : 'Archivia Studente'}
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default StudentTransferModal;







