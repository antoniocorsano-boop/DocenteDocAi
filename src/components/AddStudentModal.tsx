import React, { useState, useEffect } from 'react';
import { Studente } from '../types';
import { TextField, SelectField, M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.cognome.trim() || !formData.nome.trim()) {
            alert('Compila tutti i campi obbligatori.');
            return;
        }
        onSave({
            id: studentToEdit?.id || `student-${Date.now()}`,
            ...formData,
        });
    };

    return (
        <M3Dialog
            title={studentToEdit ? 'Modifica Studente' : 'Aggiungi Studente'}
            onClose={onClose}
            maxWidth="md"
            level={1}
        >
            <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm">
                <form id="add-student-form" onSubmit={handleSubmit} className="space-y-6">
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
                </form>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button form="add-student-form" type="submit" variant="filled">Salva</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default AddStudentModal;
