
import React, { useMemo } from 'react';
import { Studente, Valutazione } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import BarChart from './charts/BarChart';
import DonutChart from './charts/DonutChart';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

interface ClassAnalyticsProps {
    userClasses: string[];
    students: Studente[];
    evaluations: Valutazione[];
    onClose: () => void;
}

const ClassAnalytics: React.FC<ClassAnalyticsProps> = ({ userClasses, students, evaluations, onClose }) => {
    
    const classPerformanceData = useMemo(() => {
        return userClasses.map(className => {
            const classStudents = students.filter(s => s.classe === className);
            if (classStudents.length === 0) return { label: className, value: 0 };

            const studentAverages = classStudents.map(s => {
                const sEvals = evaluations.filter(e => e.studenteId === s.id);
                const { grade } = calculatePerformance(s.id, 'Complessivo', sEvals);
                return grade ? parseFloat(grade) : null;
            }).filter((v): v is number => v !== null);

            const classAverage = studentAverages.length > 0 
                ? studentAverages.reduce((a, b) => a + b, 0) / studentAverages.length 
                : 0;

            return { label: className, value: parseFloat(classAverage.toFixed(1)) };
        }).filter(d => d.value > 0);
    }, [userClasses, students, evaluations]);

    const globalStats = useMemo(() => {
        const totalStudents = students.length;
        const studentsWithInsufficient = students.filter(s => {
            const sEvals = evaluations.filter(e => e.studenteId === s.id);
            const { grade } = calculatePerformance(s.id, 'Complessivo', sEvals);
            return grade && parseFloat(grade) < 6;
        }).length;

        return [
            { label: 'Sufficienti', value: totalStudents - studentsWithInsufficient, color: 'var(--sys-primary)' },
            { label: 'Insufficienti', value: studentsWithInsufficient, color: 'var(--sys-error)' }
        ];
    }, [students, evaluations]);

    return (
        <M3Dialog
            title="Analisi Comparata Classi"
            onClose={onClose}
            maxWidth="2xl"
        >
            <M3DialogContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[var(--md-sys-color-surface-container-low)] p-6 rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]">
                        <h3 className="text-lg font-bold text-[var(--md-sys-color-on-surface)] mb-8">Media Voti per Classe</h3>
                        <div className="flex justify-center">
                            {classPerformanceData.length > 0 ? (
                                <BarChart data={classPerformanceData} color="var(--sys-tertiary)" />
                            ) : (
                                <p className="text-[var(--md-sys-color-on-surface)]-variant p-8">Dati insufficienti per generare il grafico.</p>
                            )}
                        </div>
                        <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant mt-4 text-center">
                            Confronto della media aritmetica dei voti di tutti gli studenti per ogni classe.
                        </p>
                    </div>

                    <div className="bg-[var(--md-sys-color-surface-container-low)] p-6 rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)] flex flex-col items-center">
                        <h3 className="text-lg font-bold text-[var(--md-sys-color-on-surface)] mb-8">Situazione Globale</h3>
                        <DonutChart data={globalStats} />
                        <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant mt-4 text-center">
                            Proporzione di studenti con media sufficiente vs insufficiente su tutte le classi.
                        </p>
                    </div>
                </div>
                
                <div className="bg-[var(--md-sys-color-surface-container-low)] p-6 rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]">
                     <h3 className="text-lg font-bold text-[var(--md-sys-color-on-surface)] mb-8">Dettaglio Numerico</h3>
                     <div className="overflow-x-auto">
                         <table className="w-full text-left border-collapse">
                             <thead>
                                 <tr className="border-b border-[var(--md-sys-color-outline-variant)]">
                                     <th className="py-3 px-4 text-sm font-bold text-[var(--md-sys-color-on-surface)]-variant">Classe</th>
                                     <th className="py-3 px-4 text-sm font-bold text-[var(--md-sys-color-on-surface)]-variant">Studenti</th>
                                     <th className="py-3 px-4 text-sm font-bold text-[var(--md-sys-color-on-surface)]-variant">Media Classe</th>
                                     <th className="py-3 px-4 text-sm font-bold text-[var(--md-sys-color-on-surface)]-variant">Verifiche Svolte</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {userClasses.map(c => {
                                     const sCount = students.filter(s => s.classe === c).length;
                                     const avg = classPerformanceData.find(d => d.label === c)?.value || '-';
                                     const evalsCount = evaluations.filter(e => students.find(s => s.id === e.studenteId)?.classe === c).length;
                                     return (
                                         <tr key={c} className="border-b border-[var(--md-sys-color-outline-variant)]/50 hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors">
                                             <td className="py-3 px-4 font-bold text-[var(--md-sys-color-on-surface)]">{c}</td>
                                             <td className="py-3 px-4 text-[var(--md-sys-color-on-surface)]-variant">{sCount}</td>
                                             <td className="py-3 px-4 text-[var(--md-sys-color-on-surface)]-variant">{avg}</td>
                                             <td className="py-3 px-4 text-[var(--md-sys-color-on-surface)]-variant">{evalsCount}</td>
                                         </tr>
                                     )
                                 })}
                             </tbody>
                         </table>
                     </div>
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="filled">Chiudi</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ClassAnalytics;
