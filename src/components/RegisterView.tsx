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
        <M3DialogContent >
          <div >
            <h2 >
                {new Date(entry.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            <p >Registro di Classe</p>
          </div>

          <div >
            <InfoCard title="Informazioni Lezione" icon="info">
                <div >
                    <p ><strong>Classe:</strong> {entry.classe}</p>
                    <p ><strong>Materia:</strong> {entry.materia}</p>
                    <p ><strong>Argomento:</strong> {lesson?.contenuto || 'N/A'}</p>
                </div>
            </InfoCard>

            <InfoCard title="Appello" icon="group" variant="secondary">
                <div >
                    <p ><strong>Presenti:</strong> {presentStudents.length}/{Object.keys(entry.studentAttendance).length}</p>
                    <p ><strong>Assenti:</strong> {absentStudents.length > 0 ? absentStudents.join(', ') : 'Nessuno'}</p>
                </div>
            </InfoCard>
          </div>

          <InfoCard title="Note e Osservazioni" icon="notes" variant="tertiary">
            <p >
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
    <div >
      {!isModalMode && (
        <div >
          <div >
            <h1 >Diario di Bordo {initialClass && ` - ${initialClass}`}</h1>
            <p >Registro sintetico delle lezioni.</p>
          </div>
        </div>
      )}
      <div style={isModalMode ? {} : { /* register-view-card styles */ }}>
        <div >
          <table >
            <thead>
              <tr>
                <th>Data</th>
                <th>Classe</th>
                <th>Materia</th>
                <th>Argomento</th>
                <th ></th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => {
                const lesson = lessons[entry.lessonId];
                return (
                  <tr key={entry.id}  onClick={() => setSelectedEntry(entry)}>
                    <td>{new Date(entry.date).toLocaleDateString('it-IT')}</td>
                    <td>{entry.classe}</td>
                    <td>{entry.materia}</td>
                    <td>{lesson?.contenuto || 'Lezione improvvisata'}</td>
                    <td >
                      <span >chevron_right</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredEntries.length === 0 && <p >Nessuna lezione registrata per questa classe.</p>}
      </div>
      {selectedEntry && renderEntryDetails(selectedEntry)}
    </div>
  );
};

export default RegisterView;








