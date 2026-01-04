
import React, { useState, useMemo } from 'react';
import { Studente, KnowledgeBaseEntry } from '../types';
import AddStudentModal from './AddStudentModal';
import ImportStudentsModal from './ImportStudentsModal';
import StudentTransferModal from './StudentTransferModal';
import { EmptyState, M3Button, SectionHeader, Avatar, TextField, SelectField } from './ui';

interface StudentManagerProps {
    students: Studente[];
    onSaveStudent: (student: Studente) => void;
    onDeleteStudent: (id: string) => void;
    onImportStudents: (newStudents: Studente[]) => void;
    userClasses: string[];
    initialClass?: string;
    knowledgeBase: KnowledgeBaseEntry[];
}

interface StudentItemProps {
    student: Studente;
    onEdit: (student: Studente) => void;
    onTransfer: (student: Studente) => void;
    onDelete: (id: string) => void;
    onRestore: (student: Studente) => void;
}

const StudentItem = React.memo(({ student, onEdit, onTransfer, onDelete, onRestore }: StudentItemProps) => (
    <div
      className={`flex items-center gap-5 p-4 rounded-2xl transition-all hover:bg-surface-container-highest/50 group relative focus-visible:ring-2 focus-visible:ring-primary focus:outline-none ${student.isArchived ? 'opacity-60 grayscale' : ''}`}
      aria-label={`Studente ${student.cognome} ${student.nome}, classe ${student.classe}${student.isArchived ? ', archiviato' : ''}`}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onEdit(student);
          e.preventDefault();
        }
      }}
    >
      <Avatar name={`${student.nome} ${student.cognome}`} size="lg" className="shadow-md" />
      <div className="flex-grow min-w-0">
          <h3 className="m3-title-large truncate font-black text-on-surface">{student.cognome} {student.nome}</h3>
          <div className="flex items-center gap-3 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Classe {student.classe}</span>
              {student.isArchived && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-black uppercase tracking-widest border border-outline-variant/20">
                      {student.archiveYear ? `Archiviato ${student.archiveYear}` : 'ARCHIVIATO'}
                  </span>
              )}
          </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          {student.isArchived ? (
              <M3Button onClick={() => onRestore(student)} variant="icon" className="text-primary hover:bg-primary/10" title="Ripristina Studente">
                  <span className="material-symbols-outlined">restore_from_trash</span>
              </M3Button>
          ) : (
              <>
                  <M3Button onClick={() => onTransfer(student)} variant="icon" className="text-secondary hover:bg-secondary/10" title="Cambio Classe / Trasferimento">
                      <span className="material-symbols-outlined">transfer_within_a_station</span>
                  </M3Button>
                  <M3Button onClick={() => onEdit(student)} variant="icon" className="hover:bg-surface-container-highest" title="Modifica">
                      <span className="material-symbols-outlined">edit</span>
                  </M3Button>
              </>
          )}
          <M3Button onClick={() => { if (confirm("Eliminare definitivamente studente?")) onDelete(student.id); }} variant="icon" className="text-error hover:bg-error/10" title="Elimina Definitivamente">
              <span className="material-symbols-outlined">delete</span>
          </M3Button>
      </div>
    </div>
));

const StudentManager: React.FC<StudentManagerProps> = ({
    students, onSaveStudent, onDeleteStudent, onImportStudents, userClasses, initialClass, knowledgeBase
}) => {
    const [filterClass, setFilterClass] = useState<string>(initialClass || 'all');
    const [editingStudent, setEditingStudent] = useState<Studente | 'new' | null>(null);
    const [transferringStudent, setTransferringStudent] = useState<Studente | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showArchived, setShowArchived] = useState(false);

    const filteredStudents = useMemo(() => {
        let result = students;

        if (!showArchived) {
            result = result.filter(s => !s.isArchived);
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
        <div className="page-layout pb-24">
            <SectionHeader
                title="Gestione Studenti"
                subtitle="Archivia, importa e aggiorna anagrafica e stato classe."
                actions={
                    <div className="flex gap-3">
                        <M3Button onClick={() => setIsImportModalOpen(true)} variant="tonal" className="font-black text-xs uppercase tracking-widest">
                            <span className="material-symbols-outlined mr-2">upload_file</span>
                            Importa
                        </M3Button>
                        <M3Button onClick={() => setEditingStudent('new')} variant="filled" className="font-black text-xs uppercase tracking-widest shadow-lg">
                            <span className="material-symbols-outlined mr-2">add</span>
                            Nuovo
                        </M3Button>
                    </div>
                }
            />

            <div className="bg-surface-container-low/30 backdrop-blur-xl rounded-2xl border border-outline-variant/20 overflow-hidden flex flex-col mt-8">
                <div className="flex flex-wrap gap-4 items-center p-6 bg-surface-container-high/50 border-b border-outline-variant/10">
                    <div className="flex-grow min-w-[250px]">
                        <TextField
                            placeholder="Cerca studente..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            icon="search"
                            className="bg-surface-container-low/50"
                        />
                    </div>
                    <div className="w-48">
                        <SelectField
                            value={filterClass}
                            onChange={e => setFilterClass(e.target.value)}
                            options={[
                                { value: 'all', label: 'Tutte le classi' },
                                ...userClasses.map(c => ({ value: c, label: `Classe ${c}` }))
                            ]}
                            className="bg-surface-container-low/50"
                        />
                    </div>
                    <M3Button
                        onClick={() => setShowArchived(!showArchived)}
                        variant={showArchived ? "tonal" : "text"}
                        className={`font-black text-[10px] uppercase tracking-widest ${showArchived ? 'bg-secondary-container/30 text-secondary' : ''}`}
                    >
                        <span className="material-symbols-outlined text-base mr-2">{showArchived ? 'archive' : 'unarchive'}</span>
                        {showArchived ? 'Archivio ON' : 'Archivio OFF'}
                    </M3Button>
                </div>

                <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {filteredStudents.length > 0 ? filteredStudents.map(student => (
                        <StudentItem
                            key={student.id}
                            student={student}
                            onEdit={setEditingStudent}
                            onTransfer={setTransferringStudent}
                            onDelete={onDeleteStudent}
                            onRestore={handleRestoreStudent}
                        />
                    )) : (
                        <EmptyState
                            title="Nessuno studente trovato"
                            description="Modifica i filtri o aggiungi nuovi studenti."
                            icon="person_search"
                        />
                    )}
                </div>
            </div>

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
                    currentSchoolYear={new Date().getFullYear() + "/" + (new Date().getFullYear() + 1)}
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
