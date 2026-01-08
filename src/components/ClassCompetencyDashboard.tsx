
import React, { useMemo, useState } from 'react';
import { Studente, ValutazioneCompetenza, TimetableSettings, Competenza, Livello } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, Avatar } from './ui';

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
        <div className="page-container-full pb-20">
            <div className="page-header-compact">
                <div className="page-header-title-group">
                    <h1 className="m3-headline-medium text-[var(--md-sys-color-on-surface)]">Competenze {selectedClass}</h1>
                    <p className="page-subtitle text-[var(--md-sys-color-on-surface)]-variant">
                        Analisi dei livelli raggiunti per area di competenza.
                    </p>
                </div>
            </div>
            
            {/* Controls */}
            <div className="flex justify-end mb-8">
                <div className="flex bg-[var(--md-sys-color-surface-container-high)] rounded-full p-1">
                    <button 
                        onClick={() => setSortBy('competency')} 
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === 'competency' ? 'bg-primary text-on-primary shadow-sm' : 'text-[var(--md-sys-color-on-surface)]-variant hover:bg-[var(--md-sys-color-surface-container-high)]est'}`}
                    >
                        Alfabetico
                    </button>
                    <button 
                        onClick={() => setSortBy('performance')} 
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === 'performance' ? 'bg-primary text-on-primary shadow-sm' : 'text-[var(--md-sys-color-on-surface)]-variant hover:bg-[var(--md-sys-color-surface-container-high)]est'}`}
                    >
                        Rendimento
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {competencySummaries.map(summary => {
                    const notEvaluatedCount = classStudents.length - summary.totalEvaluated;
                    return (
                        <details key={summary.competency.id} className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)] rounded-[var(--md-sys-shape-corner-extra-large)] overflow-hidden group transition-all hover:shadow-[var(--md-sys-elevation-level1)]">
                            <summary className="p-8 cursor-pointer list-none">
                                {/* Custom Header Content */}
                                <div className="flex items-start justify-between gap-8 mb-6">
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-8 mb-4">
                                            <span className="m3-label-tiny font-bold uppercase tracking-wider bg-primary-container text-on-primary-container px-4 py-0.5 rounded-md truncate max-w-[120px] md:max-w-[150px]">
                                                {summary.competency.codice}
                                            </span>
                                            <span className="text-xs text-[var(--md-sys-color-on-surface)]-variant">
                                                {summary.totalEvaluated}/{classStudents.length} Valutati
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--md-sys-color-on-surface)] line-clamp-2">
                                            {summary.competency.nome}
                                        </h3>
                                    </div>
                                    <span className="material-symbols-rounded text-[var(--md-sys-color-on-surface)]-variant group-open:rotate-180 transition-transform">expand_more</span>
                                </div>

                                {/* Visual Progress Bar */}
                                <div className="h-2 w-full bg-[var(--md-sys-color-surface-container-high)]est rounded-full overflow-hidden flex">
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
                                            className="h-full bg-[var(--md-sys-color-surface-container-high)]est" 
                                            style={{ width: `${(notEvaluatedCount / classStudents.length) * 100}%` }}
                                        />
                                    )}
                                </div>
                            </summary>
                            
                            <div className="p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {summary.levelCounts.map(lc => {
                                    const colorClass = getLevelColorClass(lc.level.nome);
                                    return (
                                        <div 
                                            key={lc.level.id} 
                                            onClick={() => handleLevelClick(lc, summary.competency.nome)}
                                            className={`p-8 rounded-[var(--md-sys-shape-corner-large)] border transition-all ${lc.count === 0 ? 'opacity-40 grayscale border-[var(--md-sys-color-outline-variant)]' : 'cursor-pointer border-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] hover:border-primary/30'}`}
                                        >
                                            <div className="flex items-center justify-between mb-8">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${colorClass}`}>
                                                    {lc.level.nome.charAt(0)}
                                                </div>
                                                <div className="text-2xl font-black text-[var(--md-sys-color-on-surface)]">{lc.count}</div>
                                            </div>
                                            <div className="text-[10px] font-bold uppercase tracking-tighter text-[var(--md-sys-color-on-surface)]-variant mb-4">Studenti</div>
                                            <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant line-clamp-3 leading-relaxed">
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
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-extra-large)] border-2 border-dashed border-[var(--md-sys-color-outline-variant)]">
                        <span className="material-symbols-rounded text-6xl text-[var(--md-sys-color-on-surface)]-variant/30 mb-8">bar_chart</span>
                        <p className="text-xl font-bold text-[var(--md-sys-color-on-surface)]">Nessun dato</p>
                        <p className="text-[var(--md-sys-color-on-surface)]-variant">Non hai ancora configurato le competenze in Impostazioni.</p>
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
                    <M3DialogContent className="space-y-2">
                                {viewingStudents.students.map(student => {
                                     return (
                                        <div 
                                            key={student.id} 
                                            onClick={() => { setViewingStudents(null); onViewStudentProfile(student); }} 
                                            className="flex items-center justify-between p-8 bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)] rounded-[var(--md-sys-shape-corner-large)] cursor-pointer hover:bg-[var(--md-sys-color-surface-container-high)] transition-all group"
                                        >
                                            <div className="flex items-center gap-6">
                                                <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                                <div>
                                                    <p className="font-bold text-[var(--md-sys-color-on-surface)]">{student.cognome} {student.nome}</p>
                                                    <div className="flex items-center gap-2.5">
                                                        <span className={`w-2 h-2 rounded-full ${viewingStudents.levelColorClass}`}></span>
                                                        <span className="text-xs text-[var(--md-sys-color-on-surface)]-variant">Livello raggiunto</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="material-symbols-rounded text-[var(--md-sys-color-on-surface)]-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
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


