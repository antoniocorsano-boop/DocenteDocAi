
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
            <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
                <div className="flex flex-col gap-6 py-4">
                    <div className="p-8 bg-secondary-container/10 rounded-[var(--md-sys-shape-corner-large)] border border-secondary/20">
                        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]">
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
                        className="w-full"
                    />

                    {mode === 'change_class' ? (
                        <div className="bg-[var(--md-sys-color-surface-container-low)]est/50 p-8 rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]/30 flex flex-col gap-8">
                            <h3 className="m3-label-large text-primary px-4">Nuova Destinazione</h3>

                            {!isCustomClass ? (
                                <div className="flex flex-col gap-8">
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
                                        className="self-start"
                                    >
                                        + Crea Nuova Classe
                                    </M3Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-8">
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
                                        className="self-start"
                                    >
                                        Torna a lista esistente
                                    </M3Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-error-container/10 p-8 rounded-[var(--md-sys-shape-corner-extra-large)] border border-error/20 flex flex-col gap-8">
                            <h3 className="m3-label-large text-error px-4">Motivazione Uscita</h3>
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
                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant px-4">
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
