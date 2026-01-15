// LEGACY - MD3 Non-compliant

import React, { useMemo, useState } from 'react';
import { Studente, ValutazioneCompetenza, TimetableSettings, Competenza, Livello } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, Avatar } from './ui';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
  const [viewingStudents, setViewingStudents] = useState<{ title: string; students: Studente[], levelColorClass: string } | null>(null);
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

    const getLevelColorClass = (levelName: string) => {
        const lower = levelName.toLowerCase();
        if (lower.includes('avanzato') || lower.includes('a -')) return 'level-color-a';
        if (lower.includes('intermedio') || lower.includes('b -')) return 'level-color-b';
        if (lower.includes('base') || lower.includes('c -')) return 'level-color-c';
        if (lower.includes('iniziale') || lower.includes('d -')) return 'level-color-d';
        return 'level-color-none';
    };

    const handleLevelClick = (levelCount: CompetencySummary['levelCounts'][0], competencyName: string) => {
        if (levelCount.count > 0) {
            const colorClass = getLevelColorClass(levelCount.level.nome);
            setViewingStudents({
                title: `${competencyName} - Livello ${levelCount.level.nome}`,
                students: levelCount.students,
                levelColorClass: colorClass
            });
        }
    };
    
    return (
        <div >
            <div >
                <div >
                    <h1 style={{ color:  layers.sys.color.onPrimary }}>Competenze {selectedClass}</h1>
                    <p style={{ color:  layers.sys.color.onSurfaceVariant }}>
                        Analisi dei livelli raggiunti per area di competenza.
                    </p>
                </div>
            </div>
            
            {/* Controls */}
            <div style={{display: "flex", justifyContent: "flex-end", marginBottom: layers.ref.spacing['8']}}>
                <div style={{ backgroundColor: 'layers.sys.color.surfaceContainerHigh', display: "flex", borderRadius: layers.ref.spacing['4'], padding: layers.ref.spacing['1'] }}>
                    <button 
                        onClick={() => setSortBy('competency')} 
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === 'competency' ? 'bg-primary text-on-primary shadow-sm' : 'text-[var(--md-sys-color-onSurface)]-variant hover:bg-[var(--md-sys-color-surfaceContainerHigh)]est'}`}
                    >
                        Alfabetico
                    </button>
                    <button 
                        onClick={() => setSortBy('performance')} 
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === 'performance' ? 'bg-primary text-on-primary shadow-sm' : 'text-[var(--md-sys-color-onSurface)]-variant hover:bg-[var(--md-sys-color-surfaceContainerHigh)]est'}`}
                    >
                        Rendimento
                    </button>
                </div>
            </div>

            <div style={{marginTop: layers.ref.spacing['4']}}>
                {competencySummaries.map(summary => {
                    const notEvaluatedCount = classStudents.length - summary.totalEvaluated;
                    return (
                        <details key={summary.competency.id} style={{ backgroundColor:  layers.sys.color.surfaceContainerLow, borderRadius: layers.ref.shape.corner.large }} style={{border: "1px solid layers.sys.color.outline", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"}}>
                            <summary  style={{padding: layers.ref.spacing['8'], cursor: "pointer"}}>
                                {/* Custom Header Content */}
                                <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: layers.ref.spacing['8'], marginBottom: layers.ref.spacing['6']}}>
                                    <div style={{ flexGrow: "1", minWidth: "0" }}>
                                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], marginBottom: layers.ref.spacing['4']}}>
                                            <span style={{ color: sys.colors.on-primaryContainer }} style={{fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "layers.sys.color.primaryContainer", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: "0.375rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                                {summary.competency.codice}
                                            </span>
                                            <span style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.75rem" }}>
                                                {summary.totalEvaluated}/{classStudents.length} Valutati
                                            </span>
                                        </div>
                                        <h3 style={{ color:  layers.sys.color.onPrimary }} style={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                                            {summary.competency.nome}
                                        </h3>
                                    </div>
                                    <span style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ transition: "transform 300ms" }}>expand_more</span>
                                </div>

                                {/* Visual Progress Bar */}
                                <div style={{ backgroundColor:  layers.sys.color.surfaceContainerHighest }} style={{ height: "0.5rem", width: "100%", borderRadius: layers.ref.spacing['4'], display: "flex" }}>
                                    {summary.levelCounts.map(lc => {
                                        if (lc.count === 0) return null;
                                        const pct = (lc.count / classStudents.length) * 100;
                                        const colorClass = getLevelColorClass(lc.level.nome);
                                        return (
                                            <div 
                                                key={lc.level.id} 
                                                className={`h-full ${colorClass}`} 
                                                style={{ width: `${pct}%` }} 
                                            />
                                        );
                                    })}
                                    {notEvaluatedCount > 0 && (
                                        <div 
                                            style={{ backgroundColor:  layers.sys.color.surfaceContainerHighest }} style={{ height: "100%", width: `${(notEvaluatedCount / classStudents.length) * 100}%` }}
                                        />
                                    )}
                                </div>
                            </summary>
                            
                            <div  style={{padding: layers.ref.spacing['8'], paddingTop: "0", display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6']}}>
                                {summary.levelCounts.map(lc => {
                                    const colorClass = getLevelColorClass(lc.level.nome);
                                    return (
                                        <div 
                                            key={lc.level.id} 
                                            onClick={() => handleLevelClick(lc, summary.competency.nome)}
                                            className={`p-8 rounded-[var(--md-sys-shape-corner-large)] border transition-all ${lc.count === 0 ? 'opacity-40 grayscale border-[var(--md-sys-color-outline-variant)]' : 'cursor-pointer border-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surfaceContainerHigh)] hover:border-primary/30'}`}
                                        >
                                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: layers.ref.spacing['8']}}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${colorClass}`}>
                                                    {lc.level.nome.charAt(0)}
                                                </div>
                                                <div style={{ color:  layers.sys.color.onPrimary }} style={{ fontSize: "1.5rem", fontWeight: "900" }}>{lc.count}</div>
                                            </div>
                                            <div style={{ color:  layers.sys.color.onSurfaceVariant }} style={{fontWeight: "bold", textTransform: "uppercase", marginBottom: layers.ref.spacing['4']}}>Studenti</div>
                                            <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.75rem", lineHeight: "1.625" }}>
                                                {lc.level.descrizione}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </details>
                    );
                })}
                
                {competencySummaries.length === 0 && (
                    <div style={{ padding: layers.ref.spacing['4'], backgroundColor:  layers.sys.color.surfaceContainerLow, borderRadius: layers.ref.shape.corner.large, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                        <span style={{ color: layers.sys.color.onSurfaceVariant/30, marginBottom: layers.ref.spacing['8'] }}>bar_chart</span>
                        <p style={{ color:  layers.sys.color.onPrimary }} style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Nessun dato</p>
                        <p style={{ color:  layers.sys.color.onSurfaceVariant }}>Non hai ancora configurato le competenze in Impostazioni.</p>
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
                    <M3DialogContent style={{gap: layers.ref.spacing['2']}}>
                                {viewingStudents.students.map(student => {
                                     return (
                                        <div 
                                            key={student.id} 
                                            onClick={() => { setViewingStudents(null); onViewStudentProfile(student); }} 
                                            style={{ backgroundColor:  layers.sys.color.surfaceContainerLow, borderRadius: layers.ref.shape.corner.large }} style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: layers.ref.spacing['8'], border: "1px solid layers.sys.color.outline", cursor: "pointer", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"}}
                                        >
                                            <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6']}}>
                                                <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                                <div>
                                                    <p style={{ color:  layers.sys.color.onPrimary }} style={{ fontWeight: "bold" }}>{student.cognome} {student.nome}</p>
                                                    <div  style={{ display: "flex", alignItems: "center" }}>
                                                        <span className={`w-2 h-2 rounded-full ${viewingStudents.levelColorClass}`}></span>
                                                        <span style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ fontSize: "0.75rem" }}>Livello raggiunto</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ transition: "transform 300ms" }}>arrow_forward</span>
                                        </div>
                                    )
                                })}
                    </M3DialogContent>
                    <M3DialogActions>
                        <M3Button onClick={() => setViewingStudents(null)} variant="text">Chiudi</M3Button>
                    </M3DialogActions>
                </M3Dialog>
            )}
        </div>
    );
};

export default ClassCompetencyDashboard;







