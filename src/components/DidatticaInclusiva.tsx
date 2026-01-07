import React, { useState, useMemo, useEffect } from 'react';
import { Studente, DidatticaInclusivaProps } from '../types';
import PianoInclusioneEditor from './PianoInclusioneEditor';
import { calculatePerformance } from '../utils/evaluationUtils';
import { 
    InfoCard, 
    EmptyState, 
    TabGroup, 
    SectionHeader, 
    M3Button,
    Avatar 
} from './ui';

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
        <div className="space-y-8">
            <InfoCard
                variant="tertiary"
                style={{ padding: 'var(--md-sys-spacing-5)' }}
            >
                <div className="flex items-start gap-8">
                    <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
                        <span className="material-symbols-outlined text-3xl">folder_shared</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-tertiary mb-4">Gestione Piani Centralizzata</h3>
                        <p className="text-on-surface-variant">Crea o modifica PDP/PEI per ogni studente. Lâ€™AI ti guida nella compilazione suggerendo strategie personalizzate.</p>
                    </div>
                </div>
            </InfoCard>

            {sortedClasses.map(className => (
                <div key={className} className="space-y-4">
                    <div className="flex items-center gap-6 px-4">
                        <div className="h-px flex-grow bg-outline-variant/30"></div>
                        <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">Classe {className}</span>
                        <div className="h-px flex-grow bg-outline-variant/30"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {studentsByClass[className].sort((a, b) => a.cognome.localeCompare(b.cognome)).map(student => {
                            const hasPlan = !!pianiInclusione[student.id];

                            return (
                                <InfoCard 
                                    key={student.id} 
                                    variant="elevated"
                                    className="group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer"
                                    onClick={() => setEditingStudent(student)}
                                >
                                    <div className="p-8 flex items-center gap-8">
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-on-surface truncate">{student.cognome} {student.nome}</p>
                                            <div className="flex items-center gap-8 mt-4">
                                                {hasPlan ? (
                                                    <span className="m3-label-tiny font-bold uppercase tracking-wider text-tertiary bg-tertiary-container/50 px-4 py-0.5 rounded-full">
                                                        Piano Attivo
                                                    </span>
                                                ) : (
                                                    <span className="m3-label-tiny font-bold uppercase tracking-wider text-on-surface-variant/40 px-4 py-0.5 border border-outline-variant/30 rounded-full">
                                                        Standard
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${hasPlan ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                            <span className="material-symbols-outlined">{hasPlan ? 'edit' : 'add'}</span>
                                        </div>
                                    </div>
                                </InfoCard>
                            );
                        })}
                    </div>
                </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activePlansStudents.length > 0 ? activePlansStudents.map(student => {
                return (
                    <InfoCard 
                        key={student.id} 
                        variant="tonal"
                        className="p-8 hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer"
                        onClick={() => setEditingStudent(student)}
                    >
                        <div className="flex items-center gap-8">
                            <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                            <div className="flex-grow">
                                <h3 className="font-bold text-on-surface">{student.cognome} {student.nome}</h3>
                                <p className="text-sm text-on-surface-variant">Classe {student.classe}</p>
                            </div>
                            <M3Button variant="text" size="small">
                                Modifica
                            </M3Button>
                        </div>
                    </InfoCard>
                )
            }) : (
                <div className="col-span-full">
                    <EmptyState
                        title="Nessun piano attivo"
                        description="Non hai ancora creato nessun PDP o PEI."
                        icon="folder_off"
                    />
                </div>
            )}
        </div>
    );

    const renderSuggested = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedStudents.length > 0 ? suggestedStudents.map(student => {
                const studentEvals = evaluations.filter(e => e.studenteId === student.id);
                const { grade } = calculatePerformance(student.id, 'Complessivo', studentEvals);

                return (
                    <InfoCard 
                        key={student.id} 
                        variant="elevated"
                        className="overflow-hidden border-l-4 border-error"
                    >
                        <div style={{ padding: 'var(--md-sys-spacing-4)' }}>
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-6">
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                    <div>
                                        <h3 className="font-bold text-on-surface">{student.cognome} {student.nome}</h3>
                                        <p className="text-xs text-on-surface-variant">Classe {student.classe}</p>
                                    </div>
                                </div>
                                <div className="bg-error/10 text-error px-4 py-1 rounded text-xs font-bold">
                                    Media: {grade}
                                </div>
                            </div>
                            <p className="text-sm text-on-surface-variant mb-8">
                                Le performance recenti suggeriscono la necessità di un piano personalizzato.
                            </p>
                            <M3Button 
                                onClick={() => setEditingStudent(student)} 
                                variant="tonal"
                                className="w-full !bg-error/10 !text-error hover:!bg-error/20"
                            >
                                <span className="material-symbols-outlined mr-2">add_circle</span>
                                Crea Piano
                            </M3Button>
                        </div>
                    </InfoCard>
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
        <div className="page-layout max-w-7xl mx-auto w-full px-4 pb-24">
            <SectionHeader 
                title="Didattica Inclusiva"
                subtitle="Piani personalizzati (PDP/PEI) e monitoraggio assistito dall'AI"
                className="py-12 text-center"
            />

            <div className="space-y-8">
                <div className="flex justify-center">
                    <TabGroup
                        activeTab={activeTab}
                        onTabChange={(id) => setActiveTab(id)}
                        variant="primary"
                        tabs={[
                            { id: 'overview', label: 'Panoramica', icon: 'grid_view' },
                            { id: 'active', label: 'Piani Attivi', icon: 'description', badge: activePlansStudents.length > 0 ? activePlansStudents.length : undefined },
                            { id: 'suggested', label: 'Da Attenzionare', icon: 'warning', badge: suggestedStudents.length > 0 ? suggestedStudents.length : undefined }
                        ]}
                    />
                </div>

                <div className="min-h-[400px]">
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

