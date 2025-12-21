
import React, { useState, useMemo } from 'react';
import { Studente, KnowledgeBaseEntry } from '../types';
import Avatar from './Avatar';
import AddStudentModal from './AddStudentModal';
import ImportStudentsModal from './ImportStudentsModal';
import StudentTransferModal from './StudentTransferModal';
import { EmptyState, M3Card } from './M3Components';

interface StudentManagerProps {
    students: Studente[];
    onSaveStudent: (student: Studente) => void;
    onDeleteStudent: (id: string) => void;
    onImportStudents: (newStudents: Studente[]) => void;
    userClasses: string[];
    initialClass?: string;
    knowledgeBase: KnowledgeBaseEntry[];
}

const StudentManager: React.FC<StudentManagerProps> = ({
    students, onSaveStudent, onDeleteStudent, onImportStudents, userClasses, initialClass, knowledgeBase
}) => {
    const [filterClass, setFilterClass] = useState<string>(initialClass || 'all');
    const [editingStudent, setEditingStudent] = useState<Studente | 'new' | null>(null);
    const [transferringStudent, setTransferringStudent] = useState<Studente | null>(null); // NEW STATE
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showArchived, setShowArchived] = useState(false);

    const filteredStudents = useMemo(() => {
        let result = students;

        if (!showArchived) {
            result = result.filter(s => !s.isArchived);
        } else {
            // If archive mode is ON, show all
        }

        if (filterClass !== 'all') {
            result = result.filter(s => s.classe === filterClass);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(s =>
                s.cognome.toLowerCase().includes(term) ||
                s.nome.toLowerCase().includes(term)
            );
        }

        return result.sort((a, b) => a.cognome.localeCompare(b.cognome));
    }, [students, filterClass, searchTerm, showArchived]);

    const handleRestoreStudent = (student: Studente) => {
        if (confirm(`Vuoi ripristinare ${student.cognome} ${student.nome} come studente attivo?`)) {
            onSaveStudent({ ...student, isArchived: false, archiveYear: undefined });
        }
    };

    return (
        <div className="page-layout pb-20">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <h1 className="page-title">Gestione Studenti</h1>
                <div className="flex gap-2">
                    <button onClick={() => setIsImportModalOpen(true)} className="button button-tonal">
                        <span className="material-symbols-outlined mr-2">upload_file</span>
                        Importa
                    </button>
                    <button onClick={() => setEditingStudent('new')} className="button button-filled">
                        <span className="material-symbols-outlined mr-2">add</span>
                        Nuovo
                    </button>
                </div>
            </div>

            <M3Card className="h-full flex flex-col">
                <div className="flex flex-wrap gap-4 items-center mb-4 p-2 bg-surface-container-high/50 rounded-xl border border-outline-variant/10">
                    <div className="flex items-center gap-2 flex-grow min-w-[200px]">
                        <span className="material-symbols-outlined text-on-surface-variant">search</span>
                        <input
                            type="text"
                            placeholder="Cerca studente..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 w-full text-sm font-bold text-on-surface placeholder:text-on-surface-variant/50"
                        />
                    </div>
                    <select
                        value={filterClass}
                        onChange={e => setFilterClass(e.target.value)}
                        className="bg-transparent text-sm font-bold text-on-surface border-none focus:ring-0 cursor-pointer"
                    >
                        <option value="all">Tutte le classi</option>
                        {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className={`button !h-9 !px-3 text-xs ${showArchived ? 'bg-secondary-container text-on-secondary-container' : 'button-text'}`}
                        title={showArchived ? "Nascondi archiviati" : "Mostra archiviati"}
                    >
                        <span className="material-symbols-outlined text-base mr-1">{showArchived ? 'archive' : 'unarchive'}</span>
                        {showArchived ? 'Archivio ON' : 'Archivio OFF'}
                    </button>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredStudents.length > 0 ? filteredStudents.map(student => (
                        <div key={student.id} className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-surface-container-highest/50 group ${student.isArchived ? 'opacity-70 grayscale' : ''}`}>
                            <Avatar name={student.nome} surname={student.cognome} size="medium" />
                            <div className="flex-grow min-w-0">
                                <h3 className="m3-title-medium truncate font-bold">{student.cognome} {student.nome}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="m3-body-small text-on-surface-variant">Classe {student.classe}</span>
                                    {student.isArchived && (
                                        <span className="text-[10px] bg-surface-container-high px-1.5 rounded border border-outline-variant font-medium">
                                            {student.archiveYear ? `Archiviato ${student.archiveYear}` : 'ARCHIVIATO'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {student.isArchived ? (
                                    <button onClick={() => handleRestoreStudent(student)} className="icon-button text-primary" title="Ripristina Studente">
                                        <span className="material-symbols-outlined">restore_from_trash</span>
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => setTransferringStudent(student)} className="icon-button text-secondary" title="Cambio Classe / Trasferimento">
                                            <span className="material-symbols-outlined">transfer_within_a_station</span>
                                        </button>
                                        <button onClick={() => setEditingStudent(student)} className="icon-button" title="Modifica">
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    </>
                                )}
                                <button onClick={() => { if (confirm("Eliminare definitivamente studente?")) onDeleteStudent(student.id); }} className="icon-button text-error" title="Elimina Definitivamente">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <EmptyState
                            title="Nessuno studente trovato"
                            description="Modifica i filtri o aggiungi nuovi studenti."
                            icon="person_search"
                        />
                    )}
                </div>
            </M3Card>

            {editingStudent && (
                <AddStudentModal
                    studentToEdit={editingStudent === 'new' ? undefined : editingStudent}
                    userClasses={userClasses}
                    onClose={() => setEditingStudent(null)}
                    onSave={onSaveStudent}
                />
            )}

            {transferringStudent && (
                <StudentTransferModal
                    student={transferringStudent}
                    userClasses={userClasses}
                    currentSchoolYear={new Date().getFullYear() + "/" + (new Date().getFullYear() + 1)} // Simple calculation or pass from props if available
                    onClose={() => setTransferringStudent(null)}
                    onSave={onSaveStudent}
                />
            )}

            {isImportModalOpen && (
                <ImportStudentsModal
                    onClose={() => setIsImportModalOpen(false)}
                    onImport={onImportStudents}
                    userClasses={userClasses}
                    knowledgeBase={knowledgeBase}
                />
            )}
        </div>
    );
};

export default StudentManager;
