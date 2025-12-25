import React, { useState, useEffect, useRef } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
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

    // Accessibility & UX
    const overlayRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    useModalAccessibility({
        isOpen: true,
        onClose,
        overlayRef,
        containerRef,
        onOverlayClick: onClose
    });

    return (
        <div className="dialog-backdrop animate-fade-in" ref={overlayRef}>
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                className="dialog-container w-full max-w-lg sm:max-w-full md:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-2 md:p-6 animate-scale-in"
            >
                <div className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
        </div>
    );
};

export default AddStudentModal;
