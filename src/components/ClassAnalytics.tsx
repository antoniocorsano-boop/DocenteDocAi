// LEGACY - MD3 Non-compliant

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
            const { grade } = calculatePerformance(s.id, 'Complessivo', sEvals);
            return grade && parseFloat(grade) < 6;
        }).length;

        return [
            { label: 'Sufficienti', value: totalStudents - studentsWithInsufficient, color: 'var(--app-color-primary)' },
            { label: 'Insufficienti', value: studentsWithInsufficient, color: 'var(--sys-error)' }
        ];
    }, [students, evaluations]);

    return (
        <M3Dialog
            title="Analisi Comparata Classi"
            onClose={onClose}
            maxWidth="2xl"
        >
            <M3DialogContent style={{gap: 'var(--app-spacing-section)'}}>
                <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--app-spacing-section)'}}>
                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--app-spacing-section)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
                        <h3 style={{ color: 'var(--app-color-on-primary)' , fontSize: 'var(--md-sys-typescale-headline-small-size)', fontWeight: "bold", marginBottom: 'var(--md-sys-spacing-8)'}}>Media Voti per Classe</h3>
                        <div style={{
  display: 'flex',
  justifyContent: 'center'
}}>
                            {classPerformanceData.length > 0 ? (
                                <BarChart data={classPerformanceData} color="var(--sys-tertiary)" />
                            ) : (
                                <p style={{ color: 'var(--app-color-on-surface-variant)' , padding: 'var(--md-sys-spacing-8)'}}>Dati insufficienti per generare il grafico.</p>
                            )}
                        </div>
                        <p style={{ color: 'var(--app-color-on-surface-variant)' , fontSize: 'var(--md-sys-typescale-body-small-size)', marginTop: 'var(--app-spacing-container)', textAlign: "center"}}>
                            Confronto della media aritmetica dei voti di tutti gli studenti per ogni classe.
                        </p>
                    </div>

                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--app-spacing-section)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)", display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <h3 style={{ color: 'var(--app-color-on-primary)' , fontSize: 'var(--md-sys-typescale-headline-small-size)', fontWeight: "bold", marginBottom: 'var(--md-sys-spacing-8)'}}>Situazione Globale</h3>
                        <DonutChart data={globalStats} />
                        <p style={{ color: 'var(--app-color-on-surface-variant)' , fontSize: 'var(--md-sys-typescale-body-small-size)', marginTop: 'var(--app-spacing-container)', textAlign: "center"}}>
                            Proporzione di studenti con media sufficiente vs insufficiente su tutte le classi.
                        </p>
                    </div>
                </div>
                
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--app-spacing-section)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
                     <h3 style={{ color: 'var(--app-color-on-primary)' , fontSize: 'var(--md-sys-typescale-headline-small-size)', fontWeight: "bold", marginBottom: 'var(--md-sys-spacing-8)'}}>Dettaglio Numerico</h3>
                     <div style={{ overflowX: "auto" }}>
                         <table  style={{ width: "var(--md-sys-percent-full)", textAlign: "left" }}>
                             <thead>
                                 <tr  style={{borderBottom: "var(--app-border-thin) solid var(--md-sys-color-outline)"}}>
                                     <th style={{ color: 'var(--app-color-on-surface-variant)' , paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: "bold"}}>Classe</th>
                                     <th style={{ color: 'var(--app-color-on-surface-variant)' , paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: "bold"}}>Studenti</th>
                                     <th style={{ color: 'var(--app-color-on-surface-variant)' , paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: "bold"}}>Media Classe</th>
                                     <th style={{ color: 'var(--app-color-on-surface-variant)' , paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: "bold"}}>Verifiche Svolte</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {userClasses.map(c => {
                                     const sCount = students.filter(s => s.classe === c).length;
                                     const avg = classPerformanceData.find(d => d.label === c)?.value || '-';
                                     const evalsCount = evaluations.filter(e => students.find(s => s.id === e.studenteId)?.classe === c).length;
                                     return (
                                         <tr key={c}  style={{borderBottom: "var(--app-border-thin) solid var(--md-sys-color-outline)", transition: "color var(--app-motion-standard)"}}>
                                             <td style={{ color: 'var(--app-color-on-primary)' , paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', fontWeight: "bold"}}>{c}</td>
                                             <td style={{ color: 'var(--app-color-on-surface-variant)' , paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)'}}>{sCount}</td>
                                             <td style={{ color: 'var(--app-color-on-surface-variant)' , paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)'}}>{avg}</td>
                                             <td style={{ color: 'var(--app-color-on-surface-variant)' , paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)'}}>{evalsCount}</td>
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








