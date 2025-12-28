import React, { useState, useEffect, useRef } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { Studente } from '../types';
import { TextField, SelectField } from './M3Components';

interface AddStudentModalProps {
    studentToEdit?: Studente;
    userClasses: string[];
    onClose: () => void;
    onSave: (student: Studente) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ studentToEdit, userClasses, onClose }) => {
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
        <div
            className="dialog-backdrop animate-fade-in"
            ref={overlayRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(0,0,0,0.32)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={e => {
                if (e.target === overlayRef.current) onClose();
            }}
        >
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-student-title"
                tabIndex={-1}
                className="dialog-container animate-scale-in"
                style={{
                    maxWidth: '95vw',
                    width: '100%',
                    maxHeight: '95vh',
                    margin: '0 auto',
                    padding: '0',
                    overflowY: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 2px 24px rgba(0,0,0,0.18)',
                    background: 'var(--sys-surface)',
                    position: 'relative',
                    outline: 'none',
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 id="add-student-title" className="m3-headline-medium font-black">{studentToEdit ? 'Modifica Studente' : 'Aggiungi Studente'}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Chiudi"
                        style={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            background: 'none',
                            border: 'none',
                            fontSize: 24,
                            color: 'var(--sys-primary)',
                            cursor: 'pointer',
                        }}
                    >
                        ×
                    </button>
                </div>
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
