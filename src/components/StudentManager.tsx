
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Studente, KnowledgeBaseEntry } from '../types';
import AddStudentModal from './AddStudentModal';
import ImportStudentsModal from './ImportStudentsModal';
import StudentTransferModal from './StudentTransferModal';
import { EmptyState, M3Button, SectionHeader, Avatar, TextField, SelectField } from './ui';
import { useListKeyboardNavigation } from '../hooks/useKeyboardNavigation';

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
    isFocused?: boolean;
    onFocus?: () => void;
}

const StudentItem = React.memo(({ student, onEdit, onTransfer, onDelete, onRestore, isFocused, onFocus }: StudentItemProps) => {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isFocused && itemRef.current) {
            itemRef.current.focus();
        }
    }, [isFocused]);

    return (
    <div
      ref={itemRef}
      className={`flex items-center gap-5 p-8 rounded-2xl transition-all hover:bg-surface-container-highest/50 group relative focus-visible:ring-2 focus-visible:ring-primary focus:outline-none ${student.isArchived ? 'opacity-60 grayscale' : ''}`}
      aria-label={`Studente ${student.cognome} ${student.nome}, classe ${student.classe}${student.isArchived ? ', archiviato' : ''}`}
      tabIndex={isFocused ? 0 : -1}
      onFocus={onFocus}
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
          <div className="flex items-center gap-6 mt-4">
              <span className="px-4 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Classe {student.classe}</span>
              {student.isArchived && (
                  <span className="px-4 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-black uppercase tracking-widest border border-outline-variant/20">
                      {student.archiveYear ? `Archiviato ${student.archiveYear}` : 'ARCHIVIATO'}
                  </span>
              )}
          </div>
      </div>

      <div className="flex gap-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          {student.isArchived ? (
              <M3Button 
                  onClick={() => onRestore(student)} 
                  variant="icon" 
                  className="text-primary hover:bg-primary/10" 
                  title="Ripristina Studente come attivo"
                  aria-label={`Ripristina ${student.cognome} ${student.nome} come studente attivo`}
              >
                  <span className="material-symbols-outlined" aria-hidden="true">restore_from_trash</span>
              </M3Button>
          ) : (
              <>
                  <M3Button 
                      onClick={() => onTransfer(student)} 
                      variant="icon" 
                      className="text-secondary hover:bg-secondary/10" 
                      title="Cambia classe o trasferisci studente"
                      aria-label={`Cambia classe per ${student.cognome} ${student.nome}`}
                  >
                      <span className="material-symbols-outlined" aria-hidden="true">transfer_within_a_station</span>
                  </M3Button>
                  <M3Button 
                      onClick={() => onEdit(student)} 
                      variant="icon" 
                      className="hover:bg-surface-container-highest" 
                      title="Modifica dati studente"
                      aria-label={`Modifica dati per ${student.cognome} ${student.nome}`}
                  >
                      <span className="material-symbols-outlined" aria-hidden="true">edit</span>
                  </M3Button>
              </>
          )}
          <M3Button 
              onClick={() => { if (confirm(`Eliminare definitivamente ${student.cognome} ${student.nome}?`)) onDelete(student.id); }} 
              variant="icon" 
              className="text-error hover:bg-error/10" 
              title="Elimina studente definitivamente"
              aria-label={`Elimina ${student.cognome} ${student.nome} dal sistema`}
          >
              <span className="material-symbols-outlined" aria-hidden="true">delete</span>
          </M3Button>
      </div>
    </div>
  );
});

const StudentManager: React.FC<StudentManagerProps> = ({
    students, onSaveStudent, onDeleteStudent, onImportStudents, userClasses, initialClass, knowledgeBase
}) => {
    const [filterClass, setFilterClass] = useState<string>(initialClass || 'all');
    const [editingStudent, setEditingStudent] = useState<Studente | 'new' | null>(null);
    const [transferringStudent, setTransferringStudent] = useState<Studente | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showArchived, setShowArchived] = useState(false);
    const [focusedStudentIndex, setFocusedStudentIndex] = useState<number>(0);
    const listContainerRef = useRef<HTMLDivElement>(null);

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

    // Reset focus when filters change
    useEffect(() => {
        setFocusedStudentIndex(0);
    }, [filterClass, searchTerm, showArchived]);

    // Handle arrow key navigation in list
    const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const keysToHandle = ['ArrowUp', 'ArrowDown', 'Home', 'End'];
        if (!keysToHandle.includes(e.key)) return;

        e.preventDefault();
        const max = filteredStudents.length - 1;
        let newIndex = focusedStudentIndex;

        switch (e.key) {
            case 'ArrowUp':
                newIndex = focusedStudentIndex > 0 ? focusedStudentIndex - 1 : 0;
                break;
            case 'ArrowDown':
                newIndex = focusedStudentIndex < max ? focusedStudentIndex + 1 : max;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = max;
                break;
        }

        setFocusedStudentIndex(newIndex);
    };

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
                    <div className="flex gap-6">
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
                <div className="flex flex-wrap gap-8 items-center p-6 bg-surface-container-high/50 border-b border-outline-variant/10">
                    <div className="flex-grow min-w-[250px]">
                        <TextField
                            id="student-search"
                            label="Cerca studente per nome..."
                            placeholder="Digita nome o cognome..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            leadingIcon="search"
                            className="bg-surface-container-low/50"
                            aria-label="Ricerca studenti per nome o cognome"
                        />
                    </div>
                    <div className="w-48">
                        <SelectField
                            id="class-filter"
                            label="Seleziona classe"
                            value={filterClass}
                            onChange={e => setFilterClass(e.target.value)}
                            options={[
                                { value: 'all', label: 'Tutte le classi' },
                                ...userClasses.map(c => ({ value: c, label: `Classe ${c}` }))
                            ]}
                            className="bg-surface-container-low/50"
                            aria-label="Filtra studenti per classe"
                        />
                    </div>
                    <M3Button
                        onClick={() => setShowArchived(!showArchived)}
                        variant={showArchived ? "tonal" : "text"}
                        className={`font-black text-[10px] uppercase tracking-widest ${showArchived ? 'bg-secondary-container/30 text-secondary' : ''}`}
                        title={showArchived ? 'Nascondi studenti archiviati' : 'Mostra studenti archiviati'}
                        aria-label={showArchived ? 'Nascondi archivio studenti' : 'Mostra archivio studenti'}
                        aria-pressed={showArchived}
                    >
                        <span className="material-symbols-outlined text-base mr-2" aria-hidden="true">{showArchived ? 'archive' : 'unarchive'}</span>
                        {showArchived ? 'Archivio ON' : 'Archivio OFF'}
                    </M3Button>
                </div>

                <div className="p-8 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar" 
                     ref={listContainerRef}
                     onKeyDown={handleListKeyDown}
                     role="listbox"
                     aria-label="Lista studenti">
                    {filteredStudents.length > 0 ? filteredStudents.map((student, index) => (
                        <StudentItem
                            key={student.id}
                            student={student}
                            onEdit={setEditingStudent}
                            onTransfer={setTransferringStudent}
                            onDelete={onDeleteStudent}
                            onRestore={handleRestoreStudent}
                            isFocused={index === focusedStudentIndex}
                            onFocus={() => setFocusedStudentIndex(index)}
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
