
import React, { useState, useMemo } from 'react';
import { 
    Studente, 
    OrientamentoActivity, 
    EPortfolioEntry, 
    StudentOrientamentoState 
} from '../types';
import { 
    M3Button, 
    SectionHeader, 
    Avatar, 
    EmptyState, 
    InfoCard, 
    SelectField
} from './ui';
import AddOrientamentoActivityModal from './AddOrientamentoActivityModal';
import StudentEPortfolioModal from './StudentEPortfolioModal';

interface OrientamentoDashboardProps {
    students: Studente[];
    activities: OrientamentoActivity[];
    ePortfolioEntries: EPortfolioEntry[];
    studentStates: Record<string, StudentOrientamentoState>;
    userClasses: string[];
    onSaveActivity: (activity: OrientamentoActivity) => void;
    onSaveEPortfolio: (entry: EPortfolioEntry) => void;
    onUpdateStudentState: (state: StudentOrientamentoState) => void;
    showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const OrientamentoDashboard: React.FC<OrientamentoDashboardProps> = ({
    students,
    activities,
    ePortfolioEntries,
    studentStates,
    userClasses,
    onSaveActivity,
    onSaveEPortfolio,
    onUpdateStudentState,
    showToast
}) => {
    const [selectedClass, setSelectedClass] = useState<string>(userClasses[0] || '');
    const [activeTab, setActiveTab] = useState<'activities' | 'students'>('activities');
    const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
    const [viewingStudent, setViewingStudent] = useState<Studente | null>(null);

    const filteredStudents = useMemo(() => {
        return students.filter(s => s.classe === selectedClass);
    }, [students, selectedClass]);

    const filteredActivities = useMemo(() => {
        return activities.filter(a => a.classes.includes(selectedClass));
    }, [activities, selectedClass]);

    const totalHours = useMemo(() => {
        return filteredActivities.reduce((acc, curr) => acc + curr.durationHours, 0);
    }, [filteredActivities]);

    const renderActivitiesTab = () => (
        <div style={{ gap: "var(--md-sys-spacing-6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 className="m3-title-large text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900" }}>Attivit� di Orientamento</h3>
                <M3Button onClick={() => setIsAddActivityModalOpen(true)} variant="filled">
                    <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>add</span>
                    Nuova Attivit�
                </M3Button>
            </div>

            <div className="md:grid-cols-2 lg:grid-cols-3" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)" }}>
                {filteredActivities.map(activity => (
                    <InfoCard 
                        key={activity.id}
                        title={activity.title}
                        description={`${activity.durationHours} ore • ${new Date(activity.date).toLocaleDateString('it-IT')}`}
                        icon="explore"
                        variant="surface"
                    >
                        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant line-clamp-2" style={{ marginTop: "var(--md-sys-spacing-4)" }}>
                            {activity.description}
                        </p>
                    </InfoCard>
                ))}
                {filteredActivities.length === 0 && (
                    <div className="col-span-full">
                        <EmptyState 
                            title="Nessuna attività" 
                            description="Inizia aggiungendo un'attività di orientamento per questa classe." 
                            icon="explore_off" 
                        />
                    </div>
                )}
            </div>
        </div>
    );

    const renderStudentsTab = () => (
        <div style={{ gap: "var(--md-sys-spacing-6)" }}>
            <h3 className="m3-title-large text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900" }}>Stato E-Portfolio Studenti</h3>
            <div className="aura-glass overflow-hidden border-[var(--md-sys-color-outline-variant)]/20" style={{ border: "1px solid var(--md-sys-color-outline)" }}>
                <table className="border-collapse" style={{ width: "100%" }}>
                    <thead>
                        <tr className="bg-[var(--md-sys-color-surface-container-low)]/50">
                            <th className="m3-label-large" style={{ padding: "var(--md-sys-spacing-8)", textAlign: "left", color: "var(--md-sys-color-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Studente</th>
                            <th className="m3-label-large" style={{ padding: "var(--md-sys-spacing-8)", textAlign: "center", color: "var(--md-sys-color-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Ore Totali</th>
                            <th className="m3-label-large" style={{ padding: "var(--md-sys-spacing-8)", textAlign: "center", color: "var(--md-sys-color-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Capolavoro</th>
                            <th className="m3-label-large" style={{ padding: "var(--md-sys-spacing-8)", textAlign: "center", color: "var(--md-sys-color-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Autovalutazione</th>
                            <th className="m3-label-large" style={{ padding: "var(--md-sys-spacing-8)", textAlign: "right", color: "var(--md-sys-color-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {filteredStudents.map(student => {
                            const state = studentStates[student.id] || { studentId: student.id, totalHours: 0, hasCapolavoro: false, hasAutovalutazione: false };
                            const progress = Math.min(100, (totalHours / 30) * 100); // Using class total hours as per guidelines for class activities
                            
                            return (
                                <tr key={student.id} className="hover:bg-primary/5" style={{ transition: "color 300ms" }}>
                                    <td style={{ padding: 'var(--md-sys-spacing-6)' }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}>
                                            <Avatar name={`${student.nome} ${student.cognome}`} size="sm" />
                                            <span className="text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "bold" }}>{student.cognome} {student.nome}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "var(--md-sys-spacing-8)", textAlign: "center" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--md-sys-spacing-4)" }}>
                                            <span style={{ fontWeight: "900", color: "var(--md-sys-color-primary)" }}>{totalHours}/30h</span>
                                            <div className="h-1.5 bg-[var(--md-sys-color-surface-container-high)]est overflow-hidden" style={{ width: "6rem", borderRadius: "9999px" }}>
                                                <div 
                                                    className={`h-full transition-all ${progress >= 100 ? 'bg-tertiary' : 'bg-primary'}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "var(--md-sys-spacing-8)", textAlign: "center" }}>
                                        <span className={`material-symbols-outlined ${state.hasCapolavoro ? 'text-tertiary' : 'text-[var(--md-sys-color-on-surface)]-variant/20'}`}>
                                            {state.hasCapolavoro ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                    </td>
                                    <td style={{ padding: "var(--md-sys-spacing-8)", textAlign: "center" }}>
                                        <span className={`material-symbols-outlined ${state.hasAutovalutazione ? 'text-tertiary' : 'text-[var(--md-sys-color-on-surface)]-variant/20'}`}>
                                            {state.hasAutovalutazione ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                    </td>
                                    <td style={{ padding: "var(--md-sys-spacing-8)", textAlign: "right" }}>
                                        <M3Button onClick={() => setViewingStudent(student)} variant="text">
                                            Dettagli
                                        </M3Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="page-layout px-6 pb-32">
            <div className="md:flex-row md:items-center" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "var(--md-sys-spacing-8)" }}>
                <SectionHeader 
                    title="Orientamento & E-Portfolio"
                    subtitle="Monitoraggio delle 30 ore annuali e gestione documenti istituzionali (Linee Guida 2023)."
                    className="!mb-0 !mt-0" style={{ flexGrow: "1" }}
                />
                <div className="w-48 self-end md:self-center">
                    <SelectField 
                        label="Classe"
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                    >
                        {userClasses.map(c => (
                            <option key={c} value={c}>Classe {c}</option>
                        ))}
                    </SelectField>
                </div>
            </div>

            <div className="lg:grid-cols-3 mt-8" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)" }}>
                <InfoCard 
                    title="Ore Medie Classe" 
                    description="Target Ministeriale: 30h"
                    icon="schedule"
                    variant="primary"
                >
                    <div style={{ marginTop: "var(--md-sys-spacing-4)" }}>
                        <span className="text-4xl" style={{ fontWeight: "900", color: "var(--md-sys-color-primary)" }}>{totalHours}h</span>
                        <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant" style={{ marginTop: "var(--md-sys-spacing-4)" }}>
                            {totalHours >= 30 ? '✅ Target raggiunto per la classe' : `Mancano ${30 - totalHours}h al target`}
                        </p>
                    </div>
                </InfoCard>

                <InfoCard 
                    title="Completamento E-Portfolio" 
                    description="Studenti con Capolavoro"
                    icon="auto_awesome"
                    variant="tertiary"
                >
                    <div style={{ marginTop: "var(--md-sys-spacing-4)" }}>
                        <span className="text-4xl" style={{ fontWeight: "900", color: "var(--md-sys-color-tertiary)" }}>
                            {filteredStudents.filter(s => studentStates[s.id]?.hasCapolavoro).length}/{filteredStudents.length}
                        </span>
                    </div>
                </InfoCard>

                <InfoCard 
                    title="Autovalutazioni" 
                    description="Riflessioni caricate"
                    icon="psychology"
                    variant="secondary"
                >
                    <div style={{ marginTop: "var(--md-sys-spacing-4)" }}>
                        <span className="text-4xl" style={{ fontWeight: "900", color: "var(--md-sys-color-secondary)" }}>
                            {filteredStudents.filter(s => studentStates[s.id]?.hasAutovalutazione).length}/{filteredStudents.length}
                        </span>
                    </div>
                </InfoCard>
            </div>

            <div className="mt-12 aura-glass rounded-[2.5rem] overflow-hidden border-[var(--md-sys-color-outline-variant)]/20" style={{ border: "1px solid var(--md-sys-color-outline)" }}>
                <div className="border-[var(--md-sys-color-outline-variant)]/10 bg-surface/30 backdrop-blur-md" style={{ display: "flex", borderBottom: "1px solid var(--md-sys-color-outline)", padding: "var(--md-sys-spacing-8)" }}>
                    <button 
                        onClick={() => setActiveTab('activities')}
                        className={`flex-grow py-4 font-black text-[10px] uppercase tracking-widest transition-all rounded-[var(--md-sys-shape-corner-large)] ${activeTab === 'activities' ? 'bg-primary text-on-primary shadow-[var(--md-sys-elevation-level2)]' : 'text-[var(--md-sys-color-on-surface)]-variant hover:bg-[var(--md-sys-color-surface-container-high)]'}`}
                    >
                        Attivit� di Orientamento
                    </button>
                    <button 
                        onClick={() => setActiveTab('students')}
                        className={`flex-grow py-4 font-black text-[10px] uppercase tracking-widest transition-all rounded-[var(--md-sys-shape-corner-large)] ${activeTab === 'students' ? 'bg-primary text-on-primary shadow-[var(--md-sys-elevation-level2)]' : 'text-[var(--md-sys-color-on-surface)]-variant hover:bg-[var(--md-sys-color-surface-container-high)]'}`}
                    >
                        Stato Studenti
                    </button>
                </div>

                <div style={{ padding: 'var(--md-sys-spacing-6)' }}>
                    {activeTab === 'activities' ? renderActivitiesTab() : renderStudentsTab()}
                </div>
            </div>

            {/* Modals */}
            <AddOrientamentoActivityModal
                isOpen={isAddActivityModalOpen}
                onClose={() => setIsAddActivityModalOpen(false)}
                onSave={(a) => {
                    onSaveActivity(a);
                    showToast('Attività salvata con successo', 'success');
                }}
                userClasses={userClasses}
            />

            {viewingStudent && (
                <StudentEPortfolioModal
                    isOpen={!!viewingStudent}
                    onClose={() => setViewingStudent(null)}
                    student={viewingStudent}
                    state={studentStates[viewingStudent.id] || { studentId: viewingStudent.id, hasCapolavoro: false, hasAutovalutazione: false, totalHours: 0, activities: [], ePortfolio: [], selfReflection: '', tutorNotes: '' }}
                    entries={ePortfolioEntries.filter(e => e.studentId === viewingStudent.id)}
                    onUpdateState={onUpdateStudentState}
                    onAddEntry={(e) => {
                        onSaveEPortfolio(e);
                        showToast('Documento aggiunto all\'E-Portfolio', 'success');
                    }}
                />
            )}
        </div>
    );
};

export default OrientamentoDashboard;




