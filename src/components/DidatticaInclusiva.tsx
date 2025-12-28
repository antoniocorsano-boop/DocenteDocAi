import React, { useState, useMemo, useEffect } from 'react';
import { Studente, DidatticaInclusivaProps } from '../types';
import PianoInclusioneEditor from './PianoInclusioneEditor';
import { calculatePerformance } from '../utils/evaluationUtils';
import Avatar from './Avatar';
import { InfoCard, EmptyState, TabGroup } from './M3Components';

const DidatticaInclusiva: React.FC<DidatticaInclusivaProps> = (props) => {
    const { students, pianiInclusione, onSavePiano, studentToEdit, onClearStudentToEdit, evaluations } = props;
    const [editingStudent, setEditingStudent] = useState<Studente | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'suggested'>('overview');

    useEffect(() => {
        if (studentToEdit) {
            setEditingStudent(studentToEdit);
        }
    }, [studentToEdit]);

    const handleCloseEditor = () => {
        setEditingStudent(null);
        if (onClearStudentToEdit) {
            onClearStudentToEdit();
        }
    };

    const studentsByClass = useMemo(() => {
        return students.reduce((acc, student) => {
            (acc[student.classe] = acc[student.classe] || []).push(student);
            return acc;
        }, {} as Record<string, Studente[]>);
    }, [students]);

    const activePlansStudents = useMemo(() => {
        return students.filter(s => !!pianiInclusione[s.id]);
    }, [students, pianiInclusione]);

    const suggestedStudents = useMemo(() => {
        return students.filter(s => {
            const hasPlan = !!pianiInclusione[s.id];
            if (hasPlan) return false;
            const studentEvals = evaluations.filter(e => e.studenteId === s.id);
            const { grade } = calculatePerformance(s.id, 'Complessivo', studentEvals);
            return grade && parseFloat(grade) < 6;
        });
    }, [students, pianiInclusione, evaluations]);

    const sortedClasses = Object.keys(studentsByClass).sort();

    const renderOverview = () => (
        <div className="space-y-4">
            <InfoCard
                title="Gestione Piani Centralizzata"
                description="Crea o modifica PDP/PEI per ogni studente. L’AI ti guida nella compilazione."
                icon="folder_shared"
                variant="tertiary"
            />

            {sortedClasses.map(className => (
                <details key={className} className="m3-expansion-panel" open>
                    <summary className="m3-expansion-summary bg-surface-container-highest/30">
                        <span className="m3-title-medium">Classe {className}</span>
                        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="m3-expansion-content !mt-0 !pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {studentsByClass[className].sort((a, b) => a.cognome.localeCompare(b.cognome)).map(student => {
                                const hasPlan = !!pianiInclusione[student.id];

                                return (
                                    <div key={student.id} className="m3-list-item-card !p-3 hover:bg-surface-container-high transition-colors" onClick={() => setEditingStudent(student)}>
                                        <div className="flex items-center gap-3 flex-grow">
                                            <Avatar name={student.nome} surname={student.cognome} size="medium" />
                                            <div>
                                                <p className="m3-body-large font-medium leading-tight">{student.cognome} {student.nome}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {hasPlan ? (
                                                        <span className="text-[10px] font-bold uppercase tracking-wide text-tertiary bg-tertiary-container px-2 py-0.5 rounded-md">
                                                            Piano Attivo
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant opacity-50">
                                                            Standard
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button className={`icon-button ${hasPlan ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                                            <span className="material-symbols-outlined">{hasPlan ? 'edit' : 'add_circle'}</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </details>
            ))}
            {students.length === 0 && (
                <EmptyState
                    title="Nessuno studente"
                    description="Aggiungi i tuoi studenti dalla sezione Classi per iniziare a gestire l'inclusione."
                    icon="group_off"
                />
            )}
        </div>
    );

    const renderActivePlans = () => (
        <div className="space-y-2">
            {activePlansStudents.length > 0 ? activePlansStudents.map(student => {
                return (
                    <div key={student.id} className="m3-list-item-card" onClick={() => setEditingStudent(student)}>
                        <div className="flex items-center gap-4">
                            <Avatar name={student.nome} surname={student.cognome} size="medium" />
                            <div>
                                <h3 className="m3-title-medium">{student.cognome} {student.nome}</h3>
                                <p className="m3-body-small text-on-surface-variant">Classe {student.classe}</p>
                            </div>
                        </div>
                        <button className="button button-outlined rounded-lg hover:shadow-md transition-all">
                            Modifica Piano
                        </button>
                    </div>
                )
            }) : (
                <EmptyState
                    title="Nessun piano attivo"
                    description="Non hai ancora creato nessun PDP o PEI."
                    icon="folder_off"
                />
            )}
        </div>
    );

    const renderSuggested = () => (
        <div className="expressive-wide-grid">
            {suggestedStudents.length > 0 ? suggestedStudents.map(student => {
                const studentEvals = evaluations.filter(e => e.studenteId === student.id);
                const { grade } = calculatePerformance(student.id, 'Complessivo', studentEvals);

                return (
                    <div key={student.id} className="hero-card bg-error-container text-on-error-container">
                        <div className="hero-header">
                            <div className="hero-icon-bg bg-error text-on-error">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <div>
                                <h3 className="m3-title-medium">{student.cognome} {student.nome}</h3>
                                <p className="m3-body-small opacity-80">Classe {student.classe} • Media: {grade}</p>
                            </div>
                        </div>
                        <button onClick={() => setEditingStudent(student)} className="button bg-white text-error w-full mt-2 rounded-lg hover:shadow-md transition-all">
                            <span className="material-symbols-outlined mr-2">add_circle</span>
                            Crea Piano
                        </button>
                    </div>
                )
            }) : (
                <div className="col-span-full">
                    <EmptyState
                        title="Tutto sotto controllo"
                        description="Non ci sono studenti con media insufficiente sprovvisti di piano."
                        icon="check_circle"
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className="page-container-full">
            <h1 className="m3-display-medium">Didattica Inclusiva (PDP / PEI)</h1>

            <div className="card min-h-[60vh]">
                <div className="mb-6">
                    <TabGroup
                        activeTab={activeTab}
                        onTabChange={(id: string) => setActiveTab(id as 'overview' | 'active' | 'suggested')}
                        variant="tertiary"
                        tabs={[
                            { id: 'overview', label: 'Panoramica', icon: 'grid_view' },
                            { id: 'active', label: 'Attivi', icon: 'description', badge: activePlansStudents.length > 0 ? activePlansStudents.length : undefined },
                            { id: 'suggested', label: 'Da Attenzionare', icon: 'warning', badge: suggestedStudents.length > 0 ? suggestedStudents.length : undefined }
                        ]}
                    />
                </div>

                <div>
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'active' && renderActivePlans()}
                    {activeTab === 'suggested' && renderSuggested()}
                </div>
            </div>

            {editingStudent && (
                <PianoInclusioneEditor
                    {...props}
                    student={editingStudent}
                    existingPiano={pianiInclusione[editingStudent.id]}
                    onClose={handleCloseEditor}
                    onSave={onSavePiano}
                />
            )}
        </div>
    );
};

export default DidatticaInclusiva;
