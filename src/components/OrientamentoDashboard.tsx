
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="m3-title-large font-black text-[var(--md-sys-color-on-surface)]">Attività di Orientamento</h3>
                <M3Button onClick={() => setIsAddActivityModalOpen(true)} variant="filled">
                    <span className="material-symbols-outlined mr-2">add</span>
                    Nuova Attività
                </M3Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map(activity => (
                    <InfoCard 
                        key={activity.id}
                        title={activity.title}
                        description={`${activity.durationHours} ore â€¢ ${new Date(activity.date).toLocaleDateString('it-IT')}`}
                        icon="explore"
                        variant="surface"
                    >
                        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant mt-4 line-clamp-2">
                            {activity.description}
                        </p>
                    </InfoCard>
                ))}
                {filteredActivities.length === 0 && (
                    <div className="col-span-full">
                        <EmptyState 
                            title="Nessuna attivitÃ " 
                            description="Inizia aggiungendo un'attivitÃ  di orientamento per questa classe." 
                            icon="explore_off" 
                        />
                    </div>
                )}
            </div>
        </div>
    );

    const renderStudentsTab = () => (
        <div className="space-y-6">
            <h3 className="m3-title-large font-black text-[var(--md-sys-color-on-surface)]">Stato E-Portfolio Studenti</h3>
            <div className="aura-glass overflow-hidden border border-[var(--md-sys-color-outline-variant)]/20">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[var(--md-sys-color-surface-container-low)]/50">
                            <th className="p-8 text-left m3-label-large text-primary uppercase tracking-widest">Studente</th>
                            <th className="p-8 text-center m3-label-large text-primary uppercase tracking-widest">Ore Totali</th>
                            <th className="p-8 text-center m3-label-large text-primary uppercase tracking-widest">Capolavoro</th>
                            <th className="p-8 text-center m3-label-large text-primary uppercase tracking-widest">Autovalutazione</th>
                            <th className="p-8 text-right m3-label-large text-primary uppercase tracking-widest">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {filteredStudents.map(student => {
                            const state = studentStates[student.id] || { studentId: student.id, totalHours: 0, hasCapolavoro: false, hasAutovalutazione: false };
                            const progress = Math.min(100, (totalHours / 30) * 100); // Using class total hours as per guidelines for class activities
                            
                            return (
                                <tr key={student.id} className="hover:bg-primary/5 transition-colors">
                                    <td style={{ padding: 'var(--md-sys-spacing-6)' }}>
                                        <div className="flex items-center gap-6">
                                            <Avatar name={`${student.nome} ${student.cognome}`} size="sm" />
                                            <span className="font-bold text-[var(--md-sys-color-on-surface)]">{student.cognome} {student.nome}</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <span className="font-black text-primary">{totalHours}/30h</span>
                                            <div className="w-24 h-1.5 bg-[var(--md-sys-color-surface-container-high)]est rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all ${progress >= 100 ? 'bg-tertiary' : 'bg-primary'}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <span className={`material-symbols-outlined ${state.hasCapolavoro ? 'text-tertiary' : 'text-[var(--md-sys-color-on-surface)]-variant/20'}`}>
                                            {state.hasCapolavoro ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                    </td>
                                    <td className="p-8 text-center">
                                        <span className={`material-symbols-outlined ${state.hasAutovalutazione ? 'text-tertiary' : 'text-[var(--md-sys-color-on-surface)]-variant/20'}`}>
                                            {state.hasAutovalutazione ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right">
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <SectionHeader 
                    title="Orientamento & E-Portfolio"
                    subtitle="Monitoraggio delle 30 ore annuali e gestione documenti istituzionali (Linee Guida 2023)."
                    className="!mb-0 !mt-0 flex-grow"
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <InfoCard 
                    title="Ore Medie Classe" 
                    description="Target Ministeriale: 30h"
                    icon="schedule"
                    variant="primary"
                >
                    <div className="mt-4">
                        <span className="text-4xl font-black text-primary">{totalHours}h</span>
                        <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant mt-4">
                            {totalHours >= 30 ? 'âœ… Target raggiunto per la classe' : `Mancano ${30 - totalHours}h al target`}
                        </p>
                    </div>
                </InfoCard>

                <InfoCard 
                    title="Completamento E-Portfolio" 
                    description="Studenti con Capolavoro"
                    icon="auto_awesome"
                    variant="tertiary"
                >
                    <div className="mt-4">
                        <span className="text-4xl font-black text-tertiary">
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
                    <div className="mt-4">
                        <span className="text-4xl font-black text-secondary">
                            {filteredStudents.filter(s => studentStates[s.id]?.hasAutovalutazione).length}/{filteredStudents.length}
                        </span>
                    </div>
                </InfoCard>
            </div>

            <div className="mt-12 aura-glass rounded-[2.5rem] overflow-hidden border border-[var(--md-sys-color-outline-variant)]/20">
                <div className="flex border-b border-[var(--md-sys-color-outline-variant)]/10 bg-surface/30 backdrop-blur-md p-8">
                    <button 
                        onClick={() => setActiveTab('activities')}
                        className={`flex-grow py-4 font-black text-[10px] uppercase tracking-widest transition-all rounded-[var(--md-sys-shape-corner-large)] ${activeTab === 'activities' ? 'bg-primary text-on-primary shadow-[var(--md-sys-elevation-level2)]' : 'text-[var(--md-sys-color-on-surface)]-variant hover:bg-[var(--md-sys-color-surface-container-high)]'}`}
                    >
                        Attività di Orientamento
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
                    showToast('AttivitÃ  salvata con successo', 'success');
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


