import React, { useState, useMemo } from 'react';
import { RegisterEntry, RegisterViewProps } from '../types';
import { M3Dialog } from './M3Dialog';

const RegisterView: React.FC<RegisterViewProps> = ({ entries, lessons, students, isModalMode = false, initialClass }) => {
  const [selectedEntry, setSelectedEntry] = useState<RegisterEntry | null>(null);

  const filteredEntries = useMemo(() => {
    if (!initialClass) {
        return entries;
    }
    return entries.filter(entry => entry.classe === initialClass);
  }, [entries, initialClass]);

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.cognome} ${student.nome}` : 'Studente non trovato';
  };

  const renderEntryDetails = (entry: RegisterEntry) => {
    const lesson = lessons[entry.lessonId];
    const presentStudents = Object.entries(entry.studentAttendance)
        .filter(([, status]) => status === 'presente')
        .map(([studentId]) => getStudentName(studentId));
    
    const absentStudents = Object.entries(entry.studentAttendance)
        .filter(([, status]) => status === 'assente')
        .map(([studentId]) => getStudentName(studentId));

    return (
      <M3Dialog
        title="Dettaglio Lezione Svolta"
        headline={new Date(entry.date).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        onClose={() => setSelectedEntry(null)}
        maxWidth="lg"
        buttons={
          <button type="button" onClick={() => setSelectedEntry(null)} className="m3-button-text">Chiudi</button>
        }
      >
        <div className="space-y-4">
          <div className="card">
            <h3 className="m3-title-medium">Informazioni Lezione</h3>
            <p><strong>Classe:</strong> {entry.classe}</p>
            <p><strong>Materia:</strong> {entry.materia}</p>
            <p><strong>Argomento:</strong> {lesson?.contenuto || 'N/A'}</p>
          </div>
          <div className="card">
            <h3 className="m3-title-medium">Note</h3>
            <p className="whitespace-pre-wrap">{entry.notes || 'Nessuna nota.'}</p>
          </div>
          <div className="card">
            <h3 className="m3-title-medium">Appello ({presentStudents.length}/{Object.keys(entry.studentAttendance).length})</h3>
            <p><strong>Assenti:</strong> {absentStudents.length > 0 ? absentStudents.join(', ') : 'Nessuno'}</p>
          </div>
        </div>
      </M3Dialog>
    );
  };
  
  return (
    <div className="space-y-4">
      {!isModalMode && (
        <div className="page-header-compact">
          <div className="page-header-title-group">
            <h1 className="m3-headline-medium font-black">Diario di Bordo {initialClass && ` - ${initialClass}`}</h1>
            <p className="page-subtitle">Registro sintetico delle lezioni.</p>
          </div>
        </div>
      )}
      <div className={isModalMode ? "" : "card"}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Classe</th>
                <th>Materia</th>
                <th>Argomento</th>
                <th className="text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => {
                const lesson = lessons[entry.lessonId];
                return (
                  <tr key={entry.id} className="interactive-row" onClick={() => setSelectedEntry(entry)}>
                    <td>{new Date(entry.date).toLocaleDateString('it-IT')}</td>
                    <td>{entry.classe}</td>
                    <td>{entry.materia}</td>
                    <td>{lesson?.contenuto || 'Lezione improvvisata'}</td>
                    <td className="text-right">
                      <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredEntries.length === 0 && <p className="text-center p-4 text-on-surface-variant">Nessuna lezione registrata per questa classe.</p>}
      </div>
      {selectedEntry && renderEntryDetails(selectedEntry)}
    </div>
  );
};

export default RegisterView;
