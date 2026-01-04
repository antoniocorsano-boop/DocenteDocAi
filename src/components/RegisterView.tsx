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
        <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="m3-headline-small font-black text-primary">
                {new Date(entry.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            <p className="m3-label-medium text-on-surface-variant opacity-70 uppercase tracking-widest">Registro di Classe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard title="Informazioni Lezione" icon="info">
                <div className="space-y-2">
                    <p className="m3-body-medium"><strong>Classe:</strong> {entry.classe}</p>
                    <p className="m3-body-medium"><strong>Materia:</strong> {entry.materia}</p>
                    <p className="m3-body-medium"><strong>Argomento:</strong> {lesson?.contenuto || 'N/A'}</p>
                </div>
            </InfoCard>

            <InfoCard title="Appello" icon="group" variant="secondary">
                <div className="space-y-2">
                    <p className="m3-body-medium"><strong>Presenti:</strong> {presentStudents.length}/{Object.keys(entry.studentAttendance).length}</p>
                    <p className="m3-body-medium"><strong>Assenti:</strong> {absentStudents.length > 0 ? absentStudents.join(', ') : 'Nessuno'}</p>
                </div>
            </InfoCard>
          </div>

          <InfoCard title="Note e Osservazioni" icon="notes" variant="tertiary">
            <p className="m3-body-medium whitespace-pre-wrap leading-relaxed">
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
