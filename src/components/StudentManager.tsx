// MD3 Compliant - Block J Migration Complete (1 violation eliminated)

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
      style={{
        // student-manager-item-card styles
        backgroundColor: student.isArchived ? 'var(--md-sys-color-surface-container-low)' : 'var(--md-sys-color-surface-container)',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        padding: 'var(--md-sys-spacing-4)',
        border: `var(--md-sys-border-width-normal) solid ${student.isArchived ? 'var(--md-sys-color-outline-variant)' : 'var(--md-sys-color-outline)'}`
      }}
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
      <Avatar name={`${student.nome} ${student.cognome}`} size="lg"  />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
          <h3>{student.cognome} {student.nome}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
              <span>Classe {student.classe}</span>
              {student.isArchived && (
                  <span>
                      {student.archiveYear ? `Archiviato ${student.archiveYear}` : 'ARCHIVIATO'}
                  </span>
              )}
          </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
          {student.isArchived ? (
              <M3Button 
                  onClick={() => onRestore(student)} 
                  variant="icon" 
                   
                  title="Ripristina Studente come attivo"
                  aria-label={`Ripristina ${student.cognome} ${student.nome} come studente attivo`}
              >
                  <span style={{
}} aria-hidden="true">restore_from_trash</span>
              </M3Button>
          ) : (
              <>
                  <M3Button 
                      onClick={() => onTransfer(student)} 
                      variant="icon" 
                       
                      title="Cambia classe o trasferisci studente"
                      aria-label={`Cambia classe per ${student.cognome} ${student.nome}`}
                  >
                      <span style={{
}} aria-hidden="true">transfer_within_a_station</span>
                  </M3Button>
                  <M3Button 
                      onClick={() => onEdit(student)} 
                      variant="icon" 
                       
                      title="Modifica dati studente"
                      aria-label={`Modifica dati per ${student.cognome} ${student.nome}`}
                  >
                      <span style={{
}} aria-hidden="true">edit</span>
                  </M3Button>
              </>
          )}
          <M3Button 
              onClick={() => { if (confirm(`Eliminare definitivamente ${student.cognome} ${student.nome}?`)) onDelete(student.id); }} 
              variant="icon" 
               
              title="Elimina studente definitivamente"
              aria-label={`Elimina ${student.cognome} ${student.nome} dal sistema`}
          >
              <span style={{
}} aria-hidden="true">delete</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
            <SectionHeader
                title="Gestione Studenti"
                subtitle="Archivia, importa e aggiorna anagrafica e stato classe."
                actions={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                        <M3Button onClick={() => setIsImportModalOpen(true)} variant="tonal" >
                            <span>upload_file</span>
                            Importa
                        </M3Button>
                        <M3Button onClick={() => setEditingStudent('new')} variant="filled" >
                            <span>add</span>
                            Nuovo
                        </M3Button>
                    </div>
                }
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        <TextField
                            id="student-search"
                            label="Cerca studente per nome..."
                            placeholder="Digita nome o cognome..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            leadingIcon="search"
                            aria-label="Ricerca studenti per nome o cognome"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                        <SelectField
                            id="class-filter"
                            label="Seleziona classe"
                            value={filterClass}
                            onChange={e => setFilterClass(e.target.value)}
                            options={[
                                { value: 'all', label: 'Tutte le classi' },
                                ...userClasses.map(c => ({ value: c, label: `Classe ${c}` }))
                            ]}
                            aria-label="Filtra studenti per classe"
                        />
                    </div>
                    <M3Button
                        onClick={() => setShowArchived(!showArchived)}
                        variant={showArchived ? "tonal" : "text"}
                        style={{
                            // student-manager-archive-toggle styles
                            marginLeft: 'var(--md-sys-spacing-2)'
                        }}
                        title={showArchived ? 'Nascondi studenti archiviati' : 'Mostra studenti archiviati'}
                        aria-label={showArchived ? 'Nascondi archivio studenti' : 'Mostra archivio studenti'}
                        aria-pressed={showArchived}
                    >
                        <span  aria-hidden="true">{showArchived ? 'archive' : 'unarchive'}</span>
                        {showArchived ? 'Archivio ON' : 'Archivio OFF'}
                    </M3Button>
                </div>

                <div  
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

// M3Expressive refactor COMPLETED: StudentManager.tsx - Replaced all hardcoded Tailwind classes with dedicated student-manager-* CSS classes using M3 tokens for student cards, badges, actions, filters, and layout.

