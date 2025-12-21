
import React, { useState } from 'react';
import { Studente, StudentHistoryRecord } from '../types';
import { TabGroup, M3Dialog, TextField, SelectField } from './M3Components';

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
        let updatedStudent = { ...student };
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
            isOpen={true}
            onClose={onClose}
            title="Mobilità Studente"
            headline={`Gestisci lo spostamento di ${student.cognome} ${student.nome}`}
            buttons={
                <>
                    <button onClick={onClose} className="button button-text">Annulla</button>
                    <button onClick={handleSave} className={`button button-filled ${mode === 'transfer_out' ? 'bg-error text-on-error' : ''}`}>
                        {mode === 'change_class' ? 'Sposta Studente' : 'Archivia Studente'}
                    </button>
                </>
            }
        >
            <div className="flex flex-col gap-6 pt-2">
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
                    <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-4">
                        <h3 className="m3-label-large text-primary">Nuova Destinazione</h3>

                        {!isCustomClass ? (
                            <div className="flex flex-col gap-2">
                                <SelectField
                                    label="Seleziona Classe"
                                    id="new-class-select"
                                    value={newClass}
                                    onChange={(e) => setNewClass(e.target.value)}
                                >
                                    {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                </SelectField>
                                <button onClick={() => setIsCustomClass(true)} className="button button-text !h-auto !py-2 text-xs self-start">
                                    La classe non è in elenco? Aggiungila manualmente
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <TextField
                                    label="Classe Manuale"
                                    placeholder="Es. 1C"
                                    id="custom-class-input"
                                    value={customClass}
                                    onChange={(e) => setCustomClass(e.target.value)}
                                    autoFocus
                                />
                                <button onClick={() => setIsCustomClass(false)} className="button button-text !h-auto !py-2 text-xs self-start">
                                    Torna all'elenco classi
                                </button>
                            </div>
                        )}

                        <p className="m3-body-small text-on-surface-variant opacity-80">
                            Lo studente verrà spostato nella nuova classe. I dati pregressi (voti, note) rimarranno visibili nel profilo.
                        </p>
                    </div>
                ) : (
                    <div className="bg-error-container/30 text-on-surface p-4 rounded-xl border border-error/20 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-error">
                            <span className="material-symbols-outlined">archive</span>
                            <h3 className="m3-label-large">Archiviazione (Uscita)</h3>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="outcome-trasferito" className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-surface-container-highest/50 transition-colors">
                                <input
                                    id="outcome-trasferito"
                                    type="radio"
                                    name="outcome"
                                    checked={outcome === 'Trasferito'}
                                    onChange={() => setOutcome('Trasferito')}
                                    className="accent-error w-5 h-5"
                                />
                                <span className="font-bold">Trasferito ad altra scuola</span>
                            </label>
                            <label htmlFor="outcome-ritirato" className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-surface-container-highest/50 transition-colors">
                                <input
                                    id="outcome-ritirato"
                                    type="radio"
                                    name="outcome"
                                    checked={outcome === 'Ritirato'}
                                    onChange={() => setOutcome('Ritirato')}
                                    className="accent-error w-5 h-5"
                                />
                                <span className="font-bold">Ritirato dagli studi</span>
                            </label>
                        </div>
                        <p className="m3-body-small opacity-70">
                            Lo studente verrà rimosso dagli elenchi attivi ma i suoi dati saranno conservati nell'archivio storico.
                        </p>
                    </div>
                )}
            </div>
        </M3Dialog>
    );
};

export default StudentTransferModal;
