// MD3 Compliant - Migrated from legacy className usage

import React, { useMemo, useState } from 'react';
import { Studente, ValutazioneCompetenza, TimetableSettings, Competenza, Livello } from '../types';
import { M3Dialog, Avatar } from './ui';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
interface ClassCompetencyDashboardProps {
    selectedClass: string;
    students: Studente[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    onViewStudentProfile: (student: Studente) => void;
}

// Data structure for the view
interface CompetencySummary {
    competency: Competenza;
    levelCounts: { level: Livello; count: number; students: Studente[] }[];
    totalEvaluated: number;
}

const ClassCompetencyDashboard: React.FC<ClassCompetencyDashboardProps> = ({
    selectedClass,
    students,
    competencyEvaluations,
    settings,
    onViewStudentProfile
}) => {
  const [viewingStudents, setViewingStudents] = useState<{ title: string; students: Studente[], levelColor: string } | null>(null);
    const [sortBy, setSortBy] = useState<'competency' | 'performance'>('competency');

    const classStudents = useMemo(() => students.filter(s => s.classe === selectedClass), [students, selectedClass]);

    const competencySummaries: CompetencySummary[] = useMemo(() => {
        const summaries = settings.competenze.map(competency => {
            const levelMap: Record<string, { level: Livello; students: Studente[] }> = {};
            competency.livelli.forEach(level => {
                levelMap[level.id] = { level, students: [] };
            });

            classStudents.forEach(student => {
                const latestEval = competencyEvaluations
                    .filter(e => e.studenteId === student.id && e.competenzaId === competency.id)
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];

                if (latestEval && levelMap[latestEval.livelloId]) {
                    levelMap[latestEval.livelloId].students.push(student);
                }
            });

            // Ensure consistent order A -> D
            const levelCounts = competency.livelli.map(level => ({
                level,
                count: levelMap[level.id].students.length,
                students: levelMap[level.id].students.sort((a, b) => a.cognome.localeCompare(b.cognome))
            }));

            const totalEvaluated = levelCounts.reduce((sum, lc) => sum + lc.count, 0);

            return { competency, levelCounts, totalEvaluated };
        });

        if (sortBy === 'performance') {
            summaries.sort((a, b) => {
                const getWeightedScore = (summary: CompetencySummary) => {
                    if (summary.totalEvaluated === 0) return 0;
                    return summary.levelCounts.reduce((score, lc) => {
                        const numericScore = parseInt(lc.level.punteggio || '0', 10);
                        return score + (numericScore * lc.count);
                    }, 0) / summary.totalEvaluated;
                };
                return getWeightedScore(b) - getWeightedScore(a); // Highest performance first
            });
        } else {
            summaries.sort((a,b) => a.competency.nome.localeCompare(b.competency.nome));
        }

        return summaries;
    }, [settings.competenze, classStudents, competencyEvaluations, sortBy]);

    const getLevelColor = (levelName: string) => {
        const lower = levelName.toLowerCase();
        if (lower.includes('avanzato') || lower.includes('a -')) return 'var(--md-sys-color-tertiary)';
        if (lower.includes('intermedio') || lower.includes('b -')) return 'var(--md-sys-color-secondary)';
        if (lower.includes('base') || lower.includes('c -')) return 'var(--md-sys-color-primary)';
        if (lower.includes('iniziale') || lower.includes('d -')) return 'var(--md-sys-color-error)';
        return 'var(--md-sys-color-surface-variant)';
    };

    const handleLevelClick = (levelCount: CompetencySummary['levelCounts'][0], competencyName: string) => {
        if (levelCount.count > 0) {
            const color = getLevelColor(levelCount.level.nome);
            setViewingStudents({
                title: `${competencyName} - Livello ${levelCount.level.nome}`,
                students: levelCount.students,
                levelColor: color
            });
        }
    };
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <Typography component="h1" variant="h4" sx={{ color: 'var(--md-sys-color-on-primary)' }}>Competenze {selectedClass}</Typography>
                    <Typography component="p" variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        Analisi dei livelli raggiunti per area di competenza.
                    </Typography>
                </div>
            </div>
            
            {/* Controls */}
            <div style={{display: "flex", justifyContent: "flex-end", marginBottom: 'var(--md-sys-spacing-8)'}}>
                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', display: "flex", borderRadius: 'var(--md-sys-spacing-4)', padding: 'var(--md-sys-spacing-1)' }}>
                    <button 
                        onClick={() => setSortBy('competency')} 
                        style={{borderRadius: 'var(--md-sys-shape-corner-full)', fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontWeight: 'var(--md-sys-typescale-body-large-font-weight-medium)', color: 'var(--md-sys-color-on-primary)'}}
                    >
                        Alfabetico
                    </button>
                    <button 
                        onClick={() => setSortBy('performance')} 
                        style={{borderRadius: 'var(--md-sys-shape-corner-full)', fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontWeight: 'var(--md-sys-typescale-body-large-font-weight-medium)', color: 'var(--md-sys-color-on-primary)'}}
                    >
                        Rendimento
                    </button>
                </div>
            </div>

            <div style={{marginTop: 'var(--md-sys-spacing-4)'}}>
                {competencySummaries.map(summary => {
                    const notEvaluatedCount = classStudents.length - summary.totalEvaluated;
                    return (
                        <details key={summary.competency.id} style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' , border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)'}}>
                            <summary  style={{padding: 'var(--md-sys-spacing-8)', cursor: "pointer"}}>
                                {/* Custom Header Content */}
                                <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 'var(--md-sys-spacing-8)', marginBottom: 'var(--md-sys-spacing-6)'}}>
                                    <div style={{ flexGrow: "1", minWidth: "0" }}>
                                        <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-8)', marginBottom: 'var(--md-sys-spacing-4)'}}>
                                            <span style={{ color: 'var(--md-sys-color-on-primary-container)' , fontWeight: "var(--md-sys-typescale-weight-bold)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-small-tracking)", backgroundColor: "var(--md-sys-color-primary)", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-medium)', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                                {summary.competency.codice}
                                            </span>
                                            <span style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>
                                                {summary.totalEvaluated}/{classStudents.length} Valutati
                                            </span>
                                        </div>
                                        <Typography component="h3" variant="h6" sx={{ color: 'var(--md-sys-color-on-primary)' ,  fontSize: 'var(--md-sys-typescale-title-large-font-size)', fontWeight: 'var(--md-sys-typescale-title-large-font-size-weight)' }}>
                                            {summary.competency.nome}
                                        </Typography>
                                    </div>
                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  transition: "transform var(--md-sys-motion-duration-medium)" }}>expand_more</span>
                                </div>

                                {/* Visual Progress Bar */}
                                <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', height: 'var(--md-sys-spacing-2)', width: "var(--md-sys-percent-full)", borderRadius: 'var(--md-sys-spacing-4)', display: "flex" }}>
                                    {summary.levelCounts.map(lc => {
                                        if (lc.count === 0) return null;
                                        const pct = (lc.count / classStudents.length) * 100;
                                        const levelColor = getLevelColor(lc.level.nome);
                                        return (
                                            <div 
                                                key={lc.level.id} 
                                                style={{ height: "var(--md-sys-percent-full)", width: `${pct}%`, backgroundColor: levelColor }} 
                                            />
                                        );
                                    })}
                                    {notEvaluatedCount > 0 && (
                                        <div 
                                            style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', height: "var(--md-sys-percent-full)", width: `${(notEvaluatedCount / classStudents.length) * 100}%` }}
                                        />
                                    )}
                                </div>
                            </summary>
                            
                            <div  style={{padding: 'var(--md-sys-spacing-8)', paddingTop: "0", display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-6)'}}>
                                {summary.levelCounts.map(lc => {
                                    return (
                                        <div 
                                            key={lc.level.id} 
                                            onClick={() => handleLevelClick(lc, summary.competency.nome)}
                                            style={{padding: 'var(--md-sys-spacing-8)'}}
                                        >
                                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 'var(--md-sys-spacing-8)'}}>
                                                <div style={{borderRadius: 'var(--md-sys-shape-corner-full)', fontWeight: 'var(--md-sys-typescale-body-large-font-weight-bold)'}}>
                                                    {lc.level.nome.charAt(0)}
                                                </div>
                                                <div style={{ color: 'var(--md-sys-color-on-primary)' ,  fontSize: 'var(--md-sys-typescale-display-large-font-size)', fontWeight: 'var(--md-sys-typescale-display-large-font-size-weight)' }}>{lc.count}</div>
                                            </div>
                                            <div style={{ color: 'var(--md-sys-color-on-surface-variant)' , fontWeight: "var(--md-sys-typescale-weight-bold)", textTransform: "uppercase", marginBottom: 'var(--md-sys-spacing-4)'}}>Studenti</div>
                                            <Typography component="p" variant="subtitle1" sx={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: 'var(--md-sys-typescale-body-large-font-size)', lineHeight: 'var(--md-sys-typescale-body-large-line-height)' }}>
                                                {lc.level.descrizione}
                                            </Typography>
                                        </div>
                                    );
                                })}
                            </div>
                        </details>
                    );
                })}
                
                {competencySummaries.length === 0 && (
                    <div style={{ padding: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: 'var(--md-sys-state-opacity-tint-moderate)', marginBottom: 'var(--md-sys-spacing-8)' }}>bar_chart</span>
                        <Typography component="p" variant="h6" sx={{ color: 'var(--md-sys-color-on-primary)' ,  fontSize: 'var(--md-sys-typescale-title-large-font-size)', fontWeight: 'var(--md-sys-typescale-title-large-font-size-weight)' }}>Nessun dato</Typography>
                        <Typography component="p" variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Non hai ancora configurato le competenze in Impostazioni.</Typography>
                    </div>
                )}
            </div>

            {/* Student List Modal */}
            {viewingStudents && (
                <M3Dialog
                    title={viewingStudents.title}
                    onClose={() => setViewingStudents(null)}
                    maxWidth="md"
                >
                    <DialogContent sx={{gap: 'var(--md-sys-spacing-2)'}}>
                                {viewingStudents.students.map(student => {
                                     return (
                                        <div 
                                            key={student.id} 
                                            onClick={() => { setViewingStudents(null); onViewStudentProfile(student); }} 
                                            style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' , display: "flex", alignItems: "center", justifyContent: "space-between", padding: 'var(--md-sys-spacing-8)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", cursor: "pointer", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)'}}
                                        >
                                            <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)'}}>
                                                <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                                    <Typography component="p" variant="body1" sx={{ color: 'var(--md-sys-color-on-primary)' ,  fontWeight: "var(--md-sys-typescale-weight-bold)" }}>{student.cognome} {student.nome}</Typography>
                                                    <div  style={{ display: "flex", alignItems: "center" }}>
                                                        <span style={{borderRadius: 'var(--md-sys-shape-corner-full)', backgroundColor: viewingStudents.levelColor, width: 'var(--md-sys-spacing-6)', height: 'var(--md-sys-spacing-6)'}}></span>
                                                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "var(--md-sys-typescale-body-small-font-size)" }}>Livello raggiunto</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  transition: "transform var(--md-sys-motion-duration-medium)" }}>arrow_forward</span>
                                        </div>
                                    )
                                })}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewingStudents(null)} variant="text">Chiudi</Button>
                    </DialogActions>
                </M3Dialog>
            )}
        </div>
    );
};

export default ClassCompetencyDashboard;

