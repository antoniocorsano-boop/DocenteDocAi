// LEGACY - MD3 Non-compliant
import React, { useState, useMemo, useEffect } from 'react';
import { Studente, DidatticaInclusivaProps } from '../types';
import PianoInclusioneEditor from './PianoInclusioneEditor';
import { calculatePerformance } from '../utils/evaluationUtils';
import { useTheme } from '../theme/theme';
import {
    InfoCard,
    EmptyState,
    TabGroup,
    SectionHeader,
    M3Button,
    Avatar
} from './ui';

const DidatticaInclusiva: React.FC<DidatticaInclusivaProps> = (props) => {
  const { layers } = useTheme();
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
        <div style={{marginTop: layers.ref.spacing['8']}}>
            <InfoCard
                variant="tertiary"
                style={{padding: layers.ref.spacing['5']}}
            >
                <div style={{display: "flex", alignItems: "flex-start", gap: layers.ref.spacing['8']}}>
                    <div style={{ borderRadius: ref.shape[], backgroundColor: sys.colors.tertiary/10 }} style={{width: ref.spacing[48], height: ref.spacing[48], display: "flex", alignItems: "center", justifyContent: "center", color: "layers.sys.colors.tertiary"}}>
                        <span style={{ color: sys.colors.3xl }}>folder_shared</span>
                    </div>
                    <div>
                        <h3  style={{fontSize: "1.125rem", color: "layers.sys.colors.tertiary", marginBottom: layers.ref.spacing['4']}}>Gestione Piani Centralizzata</h3>
                        <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Crea o modifica PDP/PEI per ogni studente. L’AI ti guida nella compilazione suggerendo strategie personalizzate.</p>
                    </div>
                </div>
            </InfoCard>

            {sortedClasses.map(className => (
                <div key={className} style={{marginTop: layers.ref.spacing['4']}}>
                    <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}>
                        <div style={{ backgroundColor: sys.colors.outline-variant/30 }} style={{ flexGrow: "1" }}></div>
                        <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant/60 }} style={{ fontSize: "0.875rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>Classe {className}</span>
                        <div style={{ backgroundColor: sys.colors.outline-variant/30 }} style={{ flexGrow: "1" }}></div>
                    </div>
                    
                    <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['8']}}>
                        {studentsByClass[className].sort((a, b) => a.cognome.localeCompare(b.cognome)).map(student => {
                            const hasPlan = !!pianiInclusione[student.id];

                            return (
                                <InfoCard 
                                    key={student.id} 
                                    variant="elevated"
                                     style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer" }}
                                    onClick={() => setEditingStudent(student)}
                                >
                                    <div style={{padding: layers.ref.spacing['8'], display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                        <div style={{ flexGrow: "1", minWidth: "0" }}>
                                            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.cognome} {student.nome}</p>
                                            <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], marginTop: layers.ref.spacing['4']}}>
                                                {hasPlan ? (
                                                    <span style={{ backgroundColor: sys.colors.tertiary-container/50 }} style={{fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "layers.sys.colors.tertiary", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: ref.spacing[9999]}}>
                                                        Piano Attivo
                                                    </span>
                                                ) : (
                                                    <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant/40 }} style={{fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], border: "1px solid layers.sys.colors.outline", borderRadius: ref.spacing[9999]}}>
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
        <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['8']}}>
            {activePlansStudents.length > 0 ? activePlansStudents.map(student => {
                return (
                    <InfoCard 
                        key={student.id} 
                        variant="tonal"
                         style={{padding: layers.ref.spacing['8'], transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer"}}
                        onClick={() => setEditingStudent(student)}
                    >
                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                            <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                            <div style={{ flexGrow: "1" }}>
                                <h3 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "bold" }}>{student.cognome} {student.nome}</h3>
                                <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ fontSize: "0.875rem" }}>Classe {student.classe}</p>
                            </div>
                            <M3Button variant="text" size="small">
                                Modifica
                            </M3Button>
                        </div>
                    </InfoCard>
                )
            }) : (
                <div >
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
        <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6']}}>
            {suggestedStudents.length > 0 ? suggestedStudents.map(student => {
                const studentEvals = evaluations.filter(e => e.studenteId === student.id);
                const { grade } = calculatePerformance(student.id, 'Complessivo', studentEvals);

                return (
                    <InfoCard 
                        key={student.id} 
                        variant="elevated"
                         style={{ borderLeft: "4px solid" }}
                    >
                        <div style={{padding: layers.ref.spacing['4']}}>
                            <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: layers.ref.spacing['8']}}>
                                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6']}}>
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                    <div>
                                        <h3 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "bold" }}>{student.cognome} {student.nome}</h3>
                                        <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ fontSize: "0.75rem" }}>Classe {student.classe}</p>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: sys.colors.error/10 }} style={{color: "layers.sys.colors.error", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: "bold"}}>
                                    Media: {grade}
                                </div>
                            </div>
                            <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{fontSize: "0.875rem", marginBottom: layers.ref.spacing['8']}}>
                                Le performance recenti suggeriscono la necessit� di un piano personalizzato.
                            </p>
                            <M3Button 
                                onClick={() => setEditingStudent(student)} 
                                variant="tonal"
                                 style={{ width: "100%" }}
                            >
                                <span  style={{ marginRight: "0.5rem" }}>add_circle</span>
                                Crea Piano
                            </M3Button>
                        </div>
                    </InfoCard>
                )
            }) : (
                <div >
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
        <div  style={{marginLeft: "auto", marginRight: "auto", width: "100%", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}>
            <SectionHeader 
                title="Didattica Inclusiva"
                subtitle="Piani personalizzati (PDP/PEI) e monitoraggio assistito dall'AI"
                 style={{ textAlign: "center" }}
            />

            <div style={{marginTop: layers.ref.spacing['8']}}>
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

                <div >
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




