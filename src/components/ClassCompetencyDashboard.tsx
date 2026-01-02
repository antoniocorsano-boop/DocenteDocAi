
import React, { useMemo, useState } from 'react';
import { Studente, ValutazioneCompetenza, TimetableSettings, Competenza, Livello } from '../types';
import Avatar from './Avatar';
import { M3Dialog } from './M3Dialog';

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
                    <h1 className="m3-headline-medium">Competenze {selectedClass}</h1>
                    <p className="page-subtitle">
                        Analisi dei livelli raggiunti per area di competenza.
                    </p>
                </div>
            </div>
            
            {/* Controls */}
            <div className="flex justify-end mb-4">
                <div className="m3-option-group">
                    <button onClick={() => setSortBy('competency')} className={`m3-option-item ${sortBy === 'competency' ? 'active' : ''}`}>Alfabetico</button>
                    <button onClick={() => setSortBy('performance')} className={`m3-option-item ${sortBy === 'performance' ? 'active' : ''}`}>Rendimento</button>
                </div>
            </div>

            <div className="space-y-4">
                {competencySummaries.map(summary => {
                    const notEvaluatedCount = classStudents.length - summary.totalEvaluated;
                    return (
                        <details key={summary.competency.id} className="competency-card group">
                            <summary className="competency-summary-header list-none">
                                {/* Custom Header Content */}
                                <div className="competency-header-top">
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="m3-label-small bg-primary-container text-on-primary-container px-2 py-0.5 rounded-md truncate max-w-[100px]">
                                                {summary.competency.codice}
                                            </span>
                                            <span className="m3-body-small text-on-surface-variant">
                                                {summary.totalEvaluated}/{classStudents.length} Valutati
                                            </span>
                                        </div>
                                        <h3 className="m3-title-medium font-bold text-on-surface line-clamp-2">
                                            {summary.competency.nome}
                                        </h3>
                                    </div>
                                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                                </div>

                                {/* Visual Progress Bar */}
                                <div className="competency-progress-track">
                                    {summary.levelCounts.map(lc => {
                                        if (lc.count === 0) return null;
                                        const pct = (lc.count / classStudents.length) * 100;
                                        const colorClass = getLevelColorClass(lc.level.nome);
                                        return (
                                            <div 
                                                key={lc.level.id} 
                                                className={`competency-progress-segment ${colorClass}`} 
                                                style={{ width: `${pct}%` }} 
                                            />
                                        );
                                    })}
                                    {notEvaluatedCount > 0 && (
                                        <div 
                                            className="competency-progress-segment bg-surface-container-highest" 
                                            style={{ width: `${(notEvaluatedCount / classStudents.length) * 100}%` }}
                                        />
                                    )}
                                </div>
                            </summary>
                            
                            <div className="level-stat-grid">
                                {summary.levelCounts.map(lc => {
                                    const colorClass = getLevelColorClass(lc.level.nome);
                                    return (
                                        <div 
                                            key={lc.level.id} 
                                            onClick={() => handleLevelClick(lc, summary.competency.nome)}
                                            className={`level-stat-card ${lc.count === 0 ? 'disabled' : ''}`}
                                        >
                                            <div className={`level-stat-badge ${colorClass}`}>
                                                {lc.level.nome.charAt(0)}
                                            </div>
                                            <div className="level-count-big">{lc.count}</div>
                                            <div className="m3-label-small text-on-surface-variant">Studenti</div>
                                            <p className="level-desc-text">
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
                    <div className="empty-state-box">
                        <span className="material-symbols-outlined empty-state-icon">bar_chart</span>
                        <p className="m3-title-medium">Nessun dato</p>
                        <p>Non hai ancora configurato le competenze in Impostazioni.</p>
                    </div>
                )}
            </div>

            {/* Student List Modal */}
            {viewingStudents && (
                <M3Dialog
                    title={viewingStudents.title}
                    onClose={() => setViewingStudents(null)}
                    maxWidth="md"
                    buttons={
                        <button onClick={() => setViewingStudents(null)} className="m3-button-text">Chiudi</button>
                    }
                >
                    <div className="space-y-2">
                                {viewingStudents.students.map(student => {
                                     return (
                                        <div 
                                            key={student.id} 
                                            onClick={() => { setViewingStudents(null); onViewStudentProfile(student); }} 
                                            className="m3-list-item-card !bg-surface hover:!bg-surface-container-high"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar name={student.nome} surname={student.cognome} size="medium" />
                                                <div>
                                                    <p className="m3-body-large font-medium">{student.cognome} {student.nome}</p>
                                                    <div className="flex items-center gap-1">
                                                        <span className={`w-2 h-2 rounded-full ${viewingStudents.levelColorClass}`}></span>
                                                        <span className="m3-body-small text-on-surface-variant">Livello raggiunto</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-on-surface-variant">arrow_forward</span>
                                        </div>
                                    )
                                })}
                            </div>
                </M3Dialog>
            )}
        </div>
    );
};

export default ClassCompetencyDashboard;
