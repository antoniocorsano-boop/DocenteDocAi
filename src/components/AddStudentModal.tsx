import React, { useState, useEffect } from 'react';
import { Studente } from '../types';
import { TextField, SelectField, M3Dialog } from './M3Components';

interface AddStudentModalProps {
    studentToEdit?: Studente;
    userClasses: string[];
    onClose: () => void;
    onSave: (student: Studente) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ studentToEdit, userClasses, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        cognome: '',
        nome: '',
        classe: userClasses[0] || ''
    });

    useEffect(() => {
        if (studentToEdit) {
            setFormData({
                cognome: studentToEdit.cognome,
                nome: studentToEdit.nome,
                classe: studentToEdit.classe,
            });
        }
    }, [studentToEdit]);

    const handleSaveClick = () => {
        if (!formData.cognome || !formData.nome || !formData.classe) {
            alert("Per favore, compila tutti i campi.");
            return;
        }
        const studentData: Studente = {
            id: studentToEdit?.id || `stud-${Date.now()}`,
            ...formData
        };
        onSave(studentData);
        onClose();
    };

    return (
        <M3Dialog
            isOpen={true}
            onClose={onClose}
            title={studentToEdit ? 'Modifica Studente' : 'Aggiungi Studente'}
            buttons={
                <>
                    <button type="button" onClick={onClose} className="button button-text rounded-lg hover:shadow-md transition-all">Annulla</button>
                    <button type="button" onClick={handleSaveClick} className="button button-filled rounded-lg hover:shadow-md transition-all">Salva Studente</button>
                </>
            }
        >
            <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        id="student-cognome-input"
                        name="cognome"
                        label="Cognome"
                        value={formData.cognome}
                        onChange={e => setFormData({ ...formData, cognome: e.target.value })}
                        placeholder="Es. Rossi"
                        required
                    />
                    <TextField
                        id="student-nome-input"
                        name="nome"
                        label="Nome"
                        value={formData.nome}
                        onChange={e => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Es. Mario"
                        required
                    />
                </div>
                <SelectField
                    id="student-classe-select"
                    name="classe"
                    label="Classe"
                    value={formData.classe}
                    onChange={e => setFormData({ ...formData, classe: e.target.value })}
                    required
                >
                    {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </SelectField>
            </div>
        </M3Dialog>
    );
};

export default AddStudentModal;
