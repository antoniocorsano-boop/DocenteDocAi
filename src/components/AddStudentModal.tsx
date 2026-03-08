// MD3 Compliant - Block G Migration (5 violations eliminated)
import React, { useState, useEffect } from 'react';
import { Studente } from '../types';
import { Button, Box  , FormControl, InputLabel, NativeSelect } from '@mui/material';
import { M3Dialog, TextField } from './ui';
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
                classe: studentToEdit.classe });
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
            ...formData });
    };

    return (
        <M3Dialog
            title={studentToEdit ? 'Modifica Studente' : 'Aggiungi Studente'}
            onClose={onClose}
            maxWidth="md"
            buttons={<>
                <Button onClick={onClose} variant="text">Annulla</Button>
                <Button form="add-student-form" type="submit" variant="contained">Salva</Button>
            </>}
        >
            <Box
                component="form"
                id="add-student-form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)' }}
            >
                <Box sx={{ display: 'grid', gridTemplateColumns: 'var(--md-sys-grid-fr-1)', gap: 'var(--md-sys-spacing-8)' }}>
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
                </Box>
                                <FormControl sx={{ mb: 2 }}>
                  <InputLabel htmlFor="student-classe-select">Classe</InputLabel>
                  <NativeSelect
                    value={formData.classe}
                    onChange={e => setFormData({ ...formData, classe: e.target.value })}
                    required
                    inputProps={{ id: 'student-classe-select', name: 'classe' }}
                  >

                    {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                
                  </NativeSelect>
                </FormControl>
            </Box>
        </M3Dialog>
    );
};

export default AddStudentModal;

