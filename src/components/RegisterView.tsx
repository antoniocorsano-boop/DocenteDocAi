// M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
import React, { useState, useMemo } from 'react';
import { RegisterEntry, RegisterViewProps } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';

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
        onClose={() => setSelectedEntry(null)}
        maxWidth="lg"
        level={1}
      >
        <M3DialogContent className="register-view-dialog-content">
          <div className="register-view-dialog-header">
            <h2 className="register-view-dialog-date">
                {new Date(entry.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            <p className="register-view-dialog-label">Registro di Classe</p>
          </div>

          <div className="register-view-dialog-grid">
            <InfoCard title="Informazioni Lezione" icon="info">
                <div className="register-view-info-content">
                    <p className="register-view-info-item"><strong>Classe:</strong> {entry.classe}</p>
                    <p className="register-view-info-item"><strong>Materia:</strong> {entry.materia}</p>
                    <p className="register-view-info-item"><strong>Argomento:</strong> {lesson?.contenuto || 'N/A'}</p>
                </div>
            </InfoCard>

            <InfoCard title="Appello" icon="group" variant="secondary">
                <div className="register-view-attendance-content">
                    <p className="register-view-attendance-item"><strong>Presenti:</strong> {presentStudents.length}/{Object.keys(entry.studentAttendance).length}</p>
                    <p className="register-view-attendance-item"><strong>Assenti:</strong> {absentStudents.length > 0 ? absentStudents.join(', ') : 'Nessuno'}</p>
                </div>
            </InfoCard>
          </div>

          <InfoCard title="Note e Osservazioni" icon="notes" variant="tertiary">
            <p className="register-view-notes-text">
                {entry.notes || 'Nessuna nota registrata per questa lezione.'}
            </p>
          </InfoCard>
        </M3DialogContent>
        <M3DialogActions>
          <M3Button variant="text" onClick={() => setSelectedEntry(null)}>Chiudi</M3Button>
        </M3DialogActions>
      </M3Dialog>
    );
  };
  
  return (
    <div className="register-view-container">
      {!isModalMode && (
        <div className="register-view-header">
          <div className="register-view-title-group">
            <h1 className="register-view-title">Diario di Bordo {initialClass && ` - ${initialClass}`}</h1>
            <p className="register-view-subtitle">Registro sintetico delle lezioni.</p>
          </div>
        </div>
      )}
      <div className={isModalMode ? "" : "register-view-card"}>
        <div className="register-view-table-container">
          <table className="register-view-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Classe</th>
                <th>Materia</th>
                <th>Argomento</th>
                <th className="register-view-table-actions"></th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => {
                const lesson = lessons[entry.lessonId];
                return (
                  <tr key={entry.id} className="register-view-table-row" onClick={() => setSelectedEntry(entry)}>
                    <td>{new Date(entry.date).toLocaleDateString('it-IT')}</td>
                    <td>{entry.classe}</td>
                    <td>{entry.materia}</td>
                    <td>{lesson?.contenuto || 'Lezione improvvisata'}</td>
                    <td className="register-view-table-actions">
                      <span className="register-view-table-chevron">chevron_right</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredEntries.length === 0 && <p className="register-view-empty">Nessuna lezione registrata per questa classe.</p>}
      </div>
      {selectedEntry && renderEntryDetails(selectedEntry)}
    </div>
  );
};

export default RegisterView;


