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
        <div style={{
  marginTop: 'var(--md-sys-spacing-8)'
}}>
            <InfoCard
                variant="tertiary"
                style={{ padding: 'var(--md-sys-spacing-5)' }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--md-sys-spacing-8)" }}>
                    <div className="rounded-[var(--md-sys-shape-corner-large)] bg-tertiary/10 shrink-0" style={{ width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--md-sys-color-tertiary)" }}>
                        <span className="material-symbols-outlined text-3xl">folder_shared</span>
                    </div>
                    <div>
                        <h3 className="font-semibold" style={{ fontSize: "1.125rem", color: "var(--md-sys-color-tertiary)", marginBottom: "var(--md-sys-spacing-4)" }}>Gestione Piani Centralizzata</h3>
                        <p className="text-[var(--md-sys-color-on-surface)]-variant">Crea o modifica PDP/PEI per ogni studente. L’AI ti guida nella compilazione suggerendo strategie personalizzate.</p>
                    </div>
                </div>
            </InfoCard>

            {sortedClasses.map(className => (
                <div key={className} style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>
                        <div className="h-px bg-outline-variant/30" style={{ flexGrow: "1" }}></div>
                        <span className="text-[var(--md-sys-color-on-surface)]-variant/60" style={{ fontSize: "0.875rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>Classe {className}</span>
                        <div className="h-px bg-outline-variant/30" style={{ flexGrow: "1" }}></div>
                    </div>
                    
                    <div className="md:grid-cols-2 lg:grid-cols-3" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)" }}>
                        {studentsByClass[className].sort((a, b) => a.cognome.localeCompare(b.cognome)).map(student => {
                            const hasPlan = !!pianiInclusione[student.id];

                            return (
                                <InfoCard 
                                    key={student.id} 
                                    variant="elevated"
                                    className="group hover:ring-2 hover:ring-primary/20" style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer" }}
                                    onClick={() => setEditingStudent(student)}
                                >
                                    <div style={{ padding: "var(--md-sys-spacing-8)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                        <div style={{ flexGrow: "1", minWidth: "0" }}>
                                            <p className="text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.cognome} {student.nome}</p>
                                            <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", marginTop: "var(--md-sys-spacing-4)" }}>
                                                {hasPlan ? (
                                                    <span className="m3-label-tiny bg-tertiary-container/50 py-0.5" style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--md-sys-color-tertiary)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "9999px" }}>
                                                        Piano Attivo
                                                    </span>
                                                ) : (
                                                    <span className="m3-label-tiny text-[var(--md-sys-color-on-surface)]-variant/40 py-0.5 border-[var(--md-sys-color-outline-variant)]/30" style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", border: "1px solid var(--md-sys-color-outline)", borderRadius: "9999px" }}>
                                                        Standard
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${hasPlan ? 'bg-tertiary/10 text-tertiary' : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)]-variant group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>{hasPlan ? 'edit' : 'add'}</span>
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
        <div className="md:grid-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)" }}>
            {activePlansStudents.length > 0 ? activePlansStudents.map(student => {
                return (
                    <InfoCard 
                        key={student.id} 
                        variant="tonal"
                        className="hover:ring-2 hover:ring-primary/20" style={{ padding: "var(--md-sys-spacing-8)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer" }}
                        onClick={() => setEditingStudent(student)}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                            <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                            <div style={{ flexGrow: "1" }}>
                                <h3 className="text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "bold" }}>{student.cognome} {student.nome}</h3>
                                <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.875rem" }}>Classe {student.classe}</p>
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
        <div className="md:grid-cols-2 lg:grid-cols-3" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)" }}>
            {suggestedStudents.length > 0 ? suggestedStudents.map(student => {
                const studentEvals = evaluations.filter(e => e.studenteId === student.id);
                const { grade } = calculatePerformance(student.id, 'Complessivo', studentEvals);

                return (
                    <InfoCard 
                        key={student.id} 
                        variant="elevated"
                        className="overflow-hidden border-error" style={{ borderLeft: "4px solid" }}
                    >
                        <div style={{ padding: 'var(--md-sys-spacing-4)' }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--md-sys-spacing-8)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}>
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                    <div>
                                        <h3 className="text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "bold" }}>{student.cognome} {student.nome}</h3>
                                        <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.75rem" }}>Classe {student.classe}</p>
                                    </div>
                                </div>
                                <div className="bg-error/10 py-1" style={{ color: "var(--md-sys-color-error)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: "bold" }}>
                                    Media: {grade}
                                </div>
                            </div>
                            <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.875rem", marginBottom: "var(--md-sys-spacing-8)" }}>
                                Le performance recenti suggeriscono la necessit� di un piano personalizzato.
                            </p>
                            <M3Button 
                                onClick={() => setEditingStudent(student)} 
                                variant="tonal"
                                className="!bg-error/10 !text-error hover:!bg-error/20" style={{ width: "100%" }}
                            >
                                <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>add_circle</span>
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
        <div className="page-layout max-w-7xl pb-24" style={{ marginLeft: "auto", marginRight: "auto", width: "100%", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>
            <SectionHeader 
                title="Didattica Inclusiva"
                subtitle="Piani personalizzati (PDP/PEI) e monitoraggio assistito dall'AI"
                className="py-12" style={{ textAlign: "center" }}
            />

            <div style={{
  marginTop: 'var(--md-sys-spacing-8)'
}}>
                <div style={{
  display: 'flex',
  justifyContent: 'center'
}}>
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



