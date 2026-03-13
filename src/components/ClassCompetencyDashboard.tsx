// MD3 GOLD COMPLIANT — ClassCompetencyDashboard: riprogettato

import React, { useMemo, useState } from 'react';
import { Studente, ValutazioneCompetenza, TimetableSettings, Competenza, Livello } from '../types';
import { M3Dialog, M3Surface, Avatar, PageWrapper } from './ui';
import ButtonBase from '@mui/material/ButtonBase';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface ClassCompetencyDashboardProps {
    selectedClass: string;
    students: Studente[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    onViewStudentProfile: (student: Studente) => void;
}

interface CompetencySummary {
    competency: Competenza;
    levelCounts: { level: Livello; count: number; students: Studente[] }[];
    totalEvaluated: number;
}

// ── Colori semantici per livello ─────────────────────────────────────────────
function getLevelColor(levelName: string): string {
    const lower = levelName.toLowerCase();
    if (lower.includes('avanzato') || lower.startsWith('a')) return 'var(--md-sys-color-tertiary)';
    if (lower.includes('intermedio') || lower.startsWith('b')) return 'var(--md-sys-color-secondary)';
    if (lower.includes('base') || lower.startsWith('c')) return 'var(--md-sys-color-primary)';
    if (lower.includes('iniziale') || lower.startsWith('d')) return 'var(--md-sys-color-error)';
    return 'var(--md-sys-color-outline)';
}

function getLevelContainerColor(levelName: string): string {
    const lower = levelName.toLowerCase();
    if (lower.includes('avanzato') || lower.startsWith('a')) return 'var(--md-sys-color-tertiary-container)';
    if (lower.includes('intermedio') || lower.startsWith('b')) return 'var(--md-sys-color-secondary-container)';
    if (lower.includes('base') || lower.startsWith('c')) return 'var(--md-sys-color-primary-container)';
    if (lower.includes('iniziale') || lower.startsWith('d')) return 'var(--md-sys-color-error-container)';
    return 'var(--md-sys-color-surface-container)';
}

function getLevelOnContainerColor(levelName: string): string {
    const lower = levelName.toLowerCase();
    if (lower.includes('avanzato') || lower.startsWith('a')) return 'var(--md-sys-color-on-tertiary-container)';
    if (lower.includes('intermedio') || lower.startsWith('b')) return 'var(--md-sys-color-on-secondary-container)';
    if (lower.includes('base') || lower.startsWith('c')) return 'var(--md-sys-color-on-primary-container)';
    if (lower.includes('iniziale') || lower.startsWith('d')) return 'var(--md-sys-color-on-error-container)';
    return 'var(--md-sys-color-on-surface-variant)';
}

// ── Singola card competenza (con espansione controllata) ──────────────────────
interface CompetencyCardProps {
    summary: CompetencySummary;
    totalStudents: number;
    onLevelClick: (lc: CompetencySummary['levelCounts'][0], competencyName: string) => void;
}

const CompetencyCard: React.FC<CompetencyCardProps> = ({ summary, totalStudents, onLevelClick }) => {
    const [expanded, setExpanded] = useState(false);
    const notEvaluated = totalStudents - summary.totalEvaluated;
    const pctEvaluated = totalStudents > 0 ? Math.round((summary.totalEvaluated / totalStudents) * 100) : 0;

    return (
        <M3Surface elevation={1} sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', overflow: 'hidden' }}>
            {/* ── Header sempre visibile ── */}
            <ButtonBase
                onClick={() => setExpanded(v => !v)}
                focusRipple
                aria-expanded={expanded}
                aria-label={`${expanded ? 'Chiudi' : 'Espandi'} ${summary.competency.nome}`}
                sx={{
                    width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch',
                    px: 'var(--md-sys-spacing-4)', pt: 'var(--md-sys-spacing-4)', pb: 'var(--md-sys-spacing-3)',
                    gap: 'var(--md-sys-spacing-3)',
                    textAlign: 'left',
                    '&:hover': { bgcolor: 'var(--md-sys-color-surface-container-high)' },
                    '&:focus-visible': { outline: '2px solid var(--md-sys-color-primary)', outlineOffset: -2 },
                }}
            >
                {/* riga 1: badge codice + contatore + chevron */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                    <Box sx={{
                        px: 'var(--md-sys-spacing-2)', py: '2px',
                        borderRadius: 'var(--md-sys-shape-corner-small)',
                        bgcolor: 'var(--md-sys-color-primary)',
                        flexShrink: 0,
                    }}>
                        <Typography variant="labelSmall" sx={{
                            color: 'var(--md-sys-color-on-primary)',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            fontSize: '11px',
                        }}>
                            {summary.competency.codice}
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', flexShrink: 0 }}>
                        {summary.totalEvaluated}/{totalStudents} valutati
                    </Typography>

                    {summary.totalEvaluated > 0 && (
                        <Typography variant="labelSmall" sx={{
                            color: 'var(--md-sys-color-primary)',
                            fontWeight: 600,
                            ml: 'auto',
                            flexShrink: 0,
                        }}>
                            {pctEvaluated}%
                        </Typography>
                    )}

                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{
                        fontSize: 20,
                        color: 'var(--md-sys-color-on-surface-variant)',
                        ml: summary.totalEvaluated > 0 ? 0 : 'auto',
                        flexShrink: 0,
                        transition: 'transform 0.2s',
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}>
                        expand_more
                    </Box>
                </Box>

                {/* riga 2: nome competenza */}
                <Typography variant="titleMedium" sx={{
                    color: 'var(--md-sys-color-on-surface)',
                    fontWeight: 'var(--md-sys-typescale-weight-medium)',
                    lineHeight: 1.4,
                }}>
                    {summary.competency.nome}
                </Typography>

                {/* riga 3: barra di progresso composita */}
                <Box sx={{
                    height: 6, borderRadius: 'var(--md-sys-shape-corner-full)',
                    bgcolor: 'var(--md-sys-color-surface-container-high)',
                    overflow: 'hidden', display: 'flex',
                }}>
                    {summary.levelCounts.map(lc => {
                        if (lc.count === 0 || totalStudents === 0) return null;
                        return (
                            <Box key={lc.level.id} sx={{
                                height: '100%',
                                width: `${(lc.count / totalStudents) * 100}%`,
                                bgcolor: getLevelColor(lc.level.nome),
                                flexShrink: 0,
                            }} />
                        );
                    })}
                    {notEvaluated > 0 && totalStudents > 0 && (
                        <Box sx={{
                            height: '100%',
                            width: `${(notEvaluated / totalStudents) * 100}%`,
                            bgcolor: 'var(--md-sys-color-surface-container-high)',
                        }} />
                    )}
                </Box>

                {/* riga 4: legenda livelli (sempre visibile) */}
                {summary.totalEvaluated > 0 && (
                    <Box sx={{ display: 'flex', gap: 'var(--md-sys-spacing-3)', flexWrap: 'wrap' }}>
                        {summary.levelCounts.filter(lc => lc.count > 0).map(lc => (
                            <Box key={lc.level.id} sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Box sx={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    bgcolor: getLevelColor(lc.level.nome), flexShrink: 0,
                                }} />
                                <Typography variant="labelSmall" sx={{
                                    color: 'var(--md-sys-color-on-surface-variant)',
                                    fontSize: '11px',
                                }}>
                                    {lc.level.nome} ({lc.count})
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </ButtonBase>

            {/* ── Espansione: cards per livello ── */}
            {expanded && (
                <Box sx={{
                    px: 'var(--md-sys-spacing-4)', pb: 'var(--md-sys-spacing-4)',
                    pt: 'var(--md-sys-spacing-2)',
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                    gap: 'var(--md-sys-spacing-2)',
                    borderTop: '1px solid var(--md-sys-color-outline-variant)',
                }}>
                    {summary.levelCounts.map(lc => {
                        const containerColor = getLevelContainerColor(lc.level.nome);
                        const onContainerColor = getLevelOnContainerColor(lc.level.nome);
                        const isClickable = lc.count > 0;
                        return (
                            <ButtonBase
                                key={lc.level.id}
                                onClick={isClickable ? () => onLevelClick(lc, summary.competency.nome) : undefined}
                                focusRipple={isClickable}
                                disabled={!isClickable}
                                aria-label={`${lc.level.nome}: ${lc.count} studenti`}
                                sx={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                                    p: 'var(--md-sys-spacing-3)',
                                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                                    bgcolor: containerColor,
                                    opacity: isClickable ? 1 : 0.5,
                                    cursor: isClickable ? 'pointer' : 'default',
                                    textAlign: 'left',
                                    gap: 'var(--md-sys-spacing-1)',
                                    '&:hover': isClickable ? { filter: 'brightness(0.92)' } : {},
                                    '&:focus-visible': { outline: `2px solid ${getLevelColor(lc.level.nome)}`, outlineOffset: 2 },
                                }}
                            >
                                {/* numero grande */}
                                <Typography variant="h4" sx={{
                                    color: onContainerColor,
                                    fontWeight: 700,
                                    lineHeight: 1,
                                }}>
                                    {lc.count}
                                </Typography>
                                {/* nome livello */}
                                <Typography variant="labelSmall" sx={{
                                    color: onContainerColor,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontSize: '10px',
                                    opacity: 0.85,
                                }}>
                                    {lc.level.nome}
                                </Typography>
                                {/* descrizione */}
                                {lc.level.descrizione && (
                                    <Typography variant="bodySmall" sx={{
                                        color: onContainerColor,
                                        fontSize: '11px',
                                        lineHeight: 1.3,
                                        opacity: 0.75,
                                        mt: '2px',
                                    }}>
                                        {lc.level.descrizione}
                                    </Typography>
                                )}
                                {/* link studenti */}
                                {lc.count > 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: 'auto', pt: 'var(--md-sys-spacing-2)' }}>
                                        <Box component="span" className="material-symbols-outlined" aria-hidden="true"
                                            sx={{ fontSize: 12, color: onContainerColor, opacity: 0.75 }}>
                                            group
                                        </Box>
                                        <Typography variant="labelSmall" sx={{
                                            color: onContainerColor, fontSize: '11px', opacity: 0.75,
                                        }}>
                                            Vedi studenti
                                        </Typography>
                                    </Box>
                                )}
                            </ButtonBase>
                        );
                    })}
                </Box>
            )}
        </M3Surface>
    );
};

// ── Componente principale ─────────────────────────────────────────────────────
const ClassCompetencyDashboard: React.FC<ClassCompetencyDashboardProps> = ({
    selectedClass,
    students,
    competencyEvaluations,
    settings,
    onViewStudentProfile,
}) => {
    const [viewingStudents, setViewingStudents] = useState<{
        title: string;
        students: Studente[];
        levelColor: string;
    } | null>(null);
    const [sortBy, setSortBy] = useState<'competency' | 'performance'>('competency');

    const classStudents = useMemo(
        () => students.filter(s => s.classe === selectedClass),
        [students, selectedClass]
    );

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

            const levelCounts = competency.livelli.map(level => ({
                level,
                count: levelMap[level.id].students.length,
                students: levelMap[level.id].students.sort((a, b) => a.cognome.localeCompare(b.cognome)),
            }));

            const totalEvaluated = levelCounts.reduce((sum, lc) => sum + lc.count, 0);
            return { competency, levelCounts, totalEvaluated };
        });

        if (sortBy === 'performance') {
            summaries.sort((a, b) => {
                const score = (s: CompetencySummary) => {
                    if (s.totalEvaluated === 0) return 0;
                    return s.levelCounts.reduce((acc, lc) => {
                        return acc + (parseInt(lc.level.punteggio || '0', 10) * lc.count);
                    }, 0) / s.totalEvaluated;
                };
                return score(b) - score(a);
            });
        } else {
            summaries.sort((a, b) => a.competency.nome.localeCompare(b.competency.nome));
        }

        return summaries;
    }, [settings.competenze, classStudents, competencyEvaluations, sortBy]);

    const handleLevelClick = (lc: CompetencySummary['levelCounts'][0], competencyName: string) => {
        if (lc.count > 0) {
            setViewingStudents({
                title: `${competencyName} — ${lc.level.nome}`,
                students: lc.students,
                levelColor: getLevelColor(lc.level.nome),
            });
        }
    };

    // ── Statistiche globali ───────────────────────────────────────────────
    const totalEvals = competencySummaries.reduce((s, c) => s + c.totalEvaluated, 0);
    const totalPossible = competencySummaries.length * classStudents.length;
    const coveragePct = totalPossible > 0 ? Math.round((totalEvals / totalPossible) * 100) : 0;

    return (
        <>
            <PageWrapper
                maxWidth="var(--md-sys-layout-content-max-width)"
                gap="var(--md-sys-spacing-5)"
                sx={{
                    px: 'var(--md-sys-spacing-4)',
                    pt: 'var(--md-sys-spacing-4)',
                    pb: 'calc(24px + env(safe-area-inset-bottom, 0px))',
                }}
            >
                {/* ── Intestazione ────────────────────────────────────────── */}
                <Box>
                    <Typography variant="h5" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
                        Competenze
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mt: '2px' }}>
                        {selectedClass} · Analisi dei livelli raggiunti per area di competenza
                    </Typography>
                </Box>

                {/* ── Riepilogo copertura ──────────────────────────────────── */}
                {competencySummaries.length > 0 && classStudents.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 'var(--md-sys-spacing-3)', flexWrap: 'wrap' }}>
                        <Box sx={{
                            px: 'var(--md-sys-spacing-4)', py: 'var(--md-sys-spacing-3)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            bgcolor: 'var(--md-sys-color-surface-container)',
                            minWidth: 80, textAlign: 'center',
                        }}>
                            <Typography variant="h6" sx={{ color: 'var(--md-sys-color-primary)', lineHeight: 1 }}>
                                {classStudents.length}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                studenti
                            </Typography>
                        </Box>
                        <Box sx={{
                            px: 'var(--md-sys-spacing-4)', py: 'var(--md-sys-spacing-3)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            bgcolor: 'var(--md-sys-color-surface-container)',
                            minWidth: 80, textAlign: 'center',
                        }}>
                            <Typography variant="h6" sx={{ color: 'var(--md-sys-color-secondary)', lineHeight: 1 }}>
                                {competencySummaries.length}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                competenze
                            </Typography>
                        </Box>
                        <Box sx={{
                            px: 'var(--md-sys-spacing-4)', py: 'var(--md-sys-spacing-3)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            bgcolor: coveragePct >= 80
                                ? 'var(--md-sys-color-tertiary-container)'
                                : coveragePct >= 40
                                ? 'var(--md-sys-color-secondary-container)'
                                : 'var(--md-sys-color-surface-container)',
                            minWidth: 80, textAlign: 'center',
                        }}>
                            <Typography variant="h6" sx={{
                                color: coveragePct >= 80
                                    ? 'var(--md-sys-color-on-tertiary-container)'
                                    : coveragePct >= 40
                                    ? 'var(--md-sys-color-on-secondary-container)'
                                    : 'var(--md-sys-color-on-surface)',
                                lineHeight: 1,
                            }}>
                                {coveragePct}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                copertura
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* ── Controlli ordinamento ────────────────────────────────── */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
                    <Typography variant="labelSmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mr: 'var(--md-sys-spacing-1)' }}>
                        Ordina:
                    </Typography>
                    <Chip
                        label="Alfabetico"
                        size="small"
                        onClick={() => setSortBy('competency')}
                        variant={sortBy === 'competency' ? 'filled' : 'outlined'}
                        sx={{
                            bgcolor: sortBy === 'competency' ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                            color: sortBy === 'competency'
                                ? 'var(--md-sys-color-on-secondary-container)'
                                : 'var(--md-sys-color-on-surface-variant)',
                            borderColor: 'var(--md-sys-color-outline-variant)',
                            fontWeight: sortBy === 'competency' ? 600 : 400,
                        }}
                    />
                    <Chip
                        label="Rendimento"
                        size="small"
                        onClick={() => setSortBy('performance')}
                        variant={sortBy === 'performance' ? 'filled' : 'outlined'}
                        sx={{
                            bgcolor: sortBy === 'performance' ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                            color: sortBy === 'performance'
                                ? 'var(--md-sys-color-on-secondary-container)'
                                : 'var(--md-sys-color-on-surface-variant)',
                            borderColor: 'var(--md-sys-color-outline-variant)',
                            fontWeight: sortBy === 'performance' ? 600 : 400,
                        }}
                    />
                </Box>

                {/* ── Lista competenze ─────────────────────────────────────── */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
                    {competencySummaries.length > 0 ? (
                        competencySummaries.map(summary => (
                            <CompetencyCard
                                key={summary.competency.id}
                                summary={summary}
                                totalStudents={classStudents.length}
                                onLevelClick={handleLevelClick}
                            />
                        ))
                    ) : (
                        <M3Surface elevation={0} sx={{
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            p: 'var(--md-sys-spacing-8)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            gap: 'var(--md-sys-spacing-3)', textAlign: 'center',
                            bgcolor: 'var(--md-sys-color-surface-container)',
                        }}>
                            <Box component="span" className="material-symbols-outlined" aria-hidden="true"
                                sx={{ fontSize: 48, color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.5 }}>
                                bar_chart
                            </Box>
                            <Typography variant="titleMedium" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
                                Nessuna competenza configurata
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', maxWidth: 320 }}>
                                Aggiungi le competenze nelle Impostazioni per iniziare a valutare la classe.
                            </Typography>
                        </M3Surface>
                    )}
                </Box>
            </PageWrapper>

            {/* ── Modale studenti per livello ─────────────────────────────── */}
            {viewingStudents && (
                <M3Dialog
                    title={viewingStudents.title}
                    onClose={() => setViewingStudents(null)}
                    maxWidth="sm"
                >
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)', p: 'var(--md-sys-spacing-3)' }}>
                        {viewingStudents.students.length === 0 ? (
                            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center', py: 'var(--md-sys-spacing-4)' }}>
                                Nessuno studente a questo livello.
                            </Typography>
                        ) : viewingStudents.students.map(student => (
                            <ButtonBase
                                key={student.id}
                                onClick={() => { setViewingStudents(null); onViewStudentProfile(student); }}
                                focusRipple
                                aria-label={`Apri profilo di ${student.nome} ${student.cognome}`}
                                sx={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    p: 'var(--md-sys-spacing-3)',
                                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                                    bgcolor: 'var(--md-sys-color-surface-container)',
                                    textAlign: 'left',
                                    '&:hover': { bgcolor: 'var(--md-sys-color-surface-container-high)' },
                                    '&:focus-visible': { outline: '2px solid var(--md-sys-color-primary)', outlineOffset: 2 },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                                    <Box>
                                        <Typography variant="body2" sx={{
                                            color: 'var(--md-sys-color-on-surface)',
                                            fontWeight: 'var(--md-sys-typescale-weight-medium)',
                                        }}>
                                            {student.cognome} {student.nome}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '2px' }}>
                                            <Box sx={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                bgcolor: viewingStudents.levelColor, flexShrink: 0,
                                            }} />
                                            <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                                Livello raggiunto
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true"
                                    sx={{ fontSize: 18, color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    arrow_forward
                                </Box>
                            </ButtonBase>
                        ))}
                    </DialogContent>
                    <DialogActions sx={{ px: 'var(--md-sys-spacing-4)', pb: 'var(--md-sys-spacing-3)' }}>
                        <Button onClick={() => setViewingStudents(null)} variant="text">Chiudi</Button>
                    </DialogActions>
                </M3Dialog>
            )}
        </>
    );
};

export default ClassCompetencyDashboard;

