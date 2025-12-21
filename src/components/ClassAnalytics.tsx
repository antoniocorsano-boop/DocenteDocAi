
import React, { useMemo } from 'react';
import { Studente, Valutazione } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import BarChart from './charts/BarChart';
import DonutChart from './charts/DonutChart';

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
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-4xl h-[90vh]">
                <div className="dialog-header">
                    <h2 className="m3-headline-medium">Analisi Comparata Classi</h2>
                    <button onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card">
                            <h3 className="m3-title-large mb-4">Media Voti per Classe</h3>
                            <div className="flex justify-center">
                                {classPerformanceData.length > 0 ? (
                                    <BarChart data={classPerformanceData} color="var(--sys-tertiary)" />
                                ) : (
                                    <p className="text-on-surface-variant p-8">Dati insufficienti per generare il grafico.</p>
                                )}
                            </div>
                            <p className="m3-body-small text-on-surface-variant mt-4 text-center">
                                Confronto della media aritmetica dei voti di tutti gli studenti per ogni classe.
                            </p>
                        </div>

                        <div className="card flex flex-col items-center">
                            <h3 className="m3-title-large mb-4">Situazione Globale</h3>
                            <DonutChart data={globalStats} />
                            <p className="m3-body-small text-on-surface-variant mt-4 text-center">
                                Proporzione di studenti con media sufficiente vs insufficiente su tutte le classi.
                            </p>
                        </div>
                    </div>
                    
                    <div className="card">
                         <h3 className="m3-title-large mb-2">Dettaglio Numerico</h3>
                         <div className="table-container">
                             <table className="table">
                                 <thead>
                                     <tr>
                                         <th>Classe</th>
                                         <th>Studenti</th>
                                         <th>Media Classe</th>
                                         <th>Verifiche Svolte</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {userClasses.map(c => {
                                         const sCount = students.filter(s => s.classe === c).length;
                                         const avg = classPerformanceData.find(d => d.label === c)?.value || '-';
                                         const evalsCount = evaluations.filter(e => students.find(s => s.id === e.studenteId)?.classe === c).length;
                                         return (
                                             <tr key={c}>
                                                 <td className="font-bold">{c}</td>
                                                 <td>{sCount}</td>
                                                 <td>{avg}</td>
                                                 <td>{evalsCount}</td>
                                             </tr>
                                         )
                                     })}
                                 </tbody>
                             </table>
                         </div>
                    </div>
                </div>
                <div className="dialog-footer">
                    <button onClick={onClose} className="button button-filled">Chiudi</button>
                </div>
            </div>
        </div>
    );
};

export default ClassAnalytics;
