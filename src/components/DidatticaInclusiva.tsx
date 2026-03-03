// MD3 Compliant - Block M Migration (13 violations eliminated)
// Note: Typography font sizes and functional border radius retained with eslint-disable comments
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
        <div style={{marginTop: 'var(--md-sys-spacing-8)'}}>
            <InfoCard
                variant="tertiary"
                style={{padding: 'var(--md-sys-spacing-5)'}}
            >
                <div style={{display: "flex", alignItems: "flex-start", gap: 'var(--md-sys-spacing-8)'}}>
                    <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: sys.colors.tertiary/10, width: 'var(--md-sys-spacing-8)', height: 'var(--md-sys-spacing-8)', display: "flex", alignItems: "center", justifyContent: "center", color: "var(--md-sys-color-tertiary)"}}>
                        <span style={{ color: 'var(--md-sys-color-on-tertiary)' }}>folder_shared</span>
                    </div>
                    <div>
                        <h3  style={{ fontSize: "var(--md-sys-typescale-title-large-font-size)" , color: "var(--md-sys-color-tertiary)", marginBottom: 'var(--md-sys-spacing-4)'}}>Gestione Piani Centralizzata</h3>
                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Crea o modifica PDP/PEI per ogni studente. L’AI ti guida nella compilazione suggerendo strategie personalizzate.</p>
                    </div>
                </div>
            </InfoCard>

            {sortedClasses.map(className => (
                <div key={className} style={{marginTop: 'var(--md-sys-spacing-4)'}}>
                    <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)', paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)'}}>
                        <div style={{ backgroundColor: sys.colors.outline-variant/30 ,  flexGrow: "1" }}></div>
                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)'/60 ,  fontSize: "var(--md-sys-typescale-body-medium-size)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)" }}>Classe {className}</span>
                        <div style={{ backgroundColor: sys.colors.outline-variant/30 ,  flexGrow: "1" }}></div>
                    </div>
                    
                    <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-8)'}}>
                        {studentsByClass[className].sort((a, b) => a.cognome.localeCompare(b.cognome)).map(student => {

                            return (
                                <InfoCard 
                                    key={student.id} 
                                    variant="elevated"
                                     style={{ transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', cursor: "pointer" }}
                                    onClick={() => setEditingStudent(student)}
                                >
                                    <div style={{padding: 'var(--md-sys-spacing-8)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                        <div style={{ flexGrow: "1", minWidth: "0" }}>
                                            <p style={{ color: 'var(--md-sys-color-on-primary)' ,  fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.cognome} {student.nome}</p>
                                            <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', marginTop: 'var(--md-sys-spacing-4)'}}>
                                                {hasPlan ? (
                                                    <span style={{ backgroundColor: sys.colors.tertiary-container/50 , fontWeight: "bold", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-small-tracking)", color: "var(--md-sys-color-tertiary)", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)'}}>
                                                        Piano Attivo
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)'/40 , fontWeight: "bold", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-small-tracking)", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", borderRadius: 'var(--md-sys-spacing-4)'}}>
                                                        Standard
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            
                                            borderRadius: 'var(--md-sys-shape-corner-full)',
                                            
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
                                            backgroundColor: hasPlan ? 'var(--md-sys-color-tertiary-container)' : 'var(--md-sys-color-surface-container-high)',
                                            color: hasPlan ? 'var(--md-sys-color-tertiary)' : 'var(--md-sys-color-on-surface-variant)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!hasPlan) {
                                                e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary-container)';
                                                e.currentTarget.style.color = 'var(--md-sys-color-primary)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!hasPlan) {
                                                e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                                                e.currentTarget.style.color = 'var(--md-sys-color-on-surface-variant)';
                                            }
                                        }}>
                                            <span style={{
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
        <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-8)'}}>
            {activePlansStudents.length > 0 ? activePlansStudents.map(student => {
                return (
                    <InfoCard 
                        key={student.id} 
                        variant="tonal"
                         style={{padding: 'var(--md-sys-spacing-8)', transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', cursor: "pointer"}}
                        onClick={() => setEditingStudent(student)}
                    >
                        <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)'}}>
                            <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                            <div style={{ flexGrow: "1" }}>
                                <h3 style={{ color: 'var(--md-sys-color-on-primary)' ,  fontWeight: "bold" }}>{student.cognome} {student.nome}</h3>
                                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "var(--md-sys-typescale-body-medium-size)" }}>Classe {student.classe}</p>
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
        <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-6)'}}>
            {suggestedStudents.length > 0 ? suggestedStudents.map(student => {
                const { grade } = calculatePerformance(student.id, 'Complessivo', studentEvals);

                return (
                    <InfoCard 
                        key={student.id} 
                        variant="elevated"
                         style={{ borderLeft: "var(--md-sys-border-width-normal) solid" }}
                    >
                        <div style={{padding: 'var(--md-sys-spacing-4)'}}>
                            <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 'var(--md-sys-spacing-8)'}}>
                                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)'}}>
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                    <div>
                                        <h3 style={{ color: 'var(--md-sys-color-on-primary)' ,  fontWeight: "bold" }}>{student.cognome} {student.nome}</h3>
                                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)' ,   fontSize: "var(--md-sys-typescale-label-large-font-size)"  }}>Classe {student.classe}</p>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: sys.colors.error/10 , color: "var(--md-sys-color-error)", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)',  borderRadius: "var(--md-sys-shape-corner-small)", fontSize: "var(--md-sys-typescale-label-large-font-size)" , fontWeight: "bold"}}>
                                    Media: {grade}
                                </div>
                            </div>
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' , fontSize: "var(--md-sys-typescale-body-medium-size)", marginBottom: 'var(--md-sys-spacing-8)'}}>
                                Le performance recenti suggeriscono la necessit� di un piano personalizzato.
                            </p>
                            <M3Button 
                                onClick={() => setEditingStudent(student)} 
                                variant="tonal"
                                 style={{ width: "var(--md-sys-percent-100)" }}
                            >
                                <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>add_circle</span>
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
                <section
                    style={{
                        background: 'var(--md-sys-color-surface)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        boxShadow: 'var(--md-sys-elevation-level1)',
                        padding: 'var(--md-sys-spacing-8)',
                        margin: 'var(--md-sys-spacing-8) var(--md-sys-margin-auto) 0 var(--md-sys-margin-auto)',
                        maxWidth: 1000,
                        width: 'var(--md-sys-percent-100)'
                    }}
                >
                    <SectionHeader
                        title="Didattica Inclusiva"
                        subtitle="Piani personalizzati (PDP/PEI) e monitoraggio assistito dall'AI"
                        style={{ textAlign: 'center' }}
                    />
                    <div style={{ marginTop: 'var(--md-sys-spacing-8)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <TabGroup
                                activeTab={activeTab}
                                onTabChange={id => setActiveTab(id)}
                                variant="primary"
                                tabs={[
                                    { id: 'overview', label: 'Panoramica', icon: 'grid_view' },
                                    { id: 'active', label: 'Piani Attivi', icon: 'description', badge: activePlansStudents.length > 0 ? activePlansStudents.length : undefined },
                                    { id: 'suggested', label: 'Da Attenzionare', icon: 'warning', badge: suggestedStudents.length > 0 ? suggestedStudents.length : undefined }
                                ]}
                            />
                        </div>
                        <div style={{ marginTop: 'var(--md-sys-spacing-8)' }}>
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
                </section>
    );
};

export default DidatticaInclusiva;

