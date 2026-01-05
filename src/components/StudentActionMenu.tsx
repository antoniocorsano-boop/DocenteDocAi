
import React, { useMemo } from 'react';
import { Popover, Box, Button, Divider } from '@mui/material';
import { Studente, Valutazione, ParticipationEntry } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import { Avatar } from './ui';

interface StudentActionMenuProps {
    student: Studente;
    anchorEl: HTMLElement | null;
    evaluations: Valutazione[];
    participation: ParticipationEntry[];
    onClose: () => void;
    onAddEvaluation: () => void;
    onViewProfile: () => void;
}

const StudentActionMenu: React.FC<StudentActionMenuProps> = ({
    student,
    anchorEl,
    evaluations,
    participation,
    onClose,
    onAddEvaluation,
    onViewProfile,
}) => {
    const { grade, trend } = useMemo(
        () => calculatePerformance(student.id, 'Complessivo', evaluations),
        [student.id, evaluations]
    );

    const participationToday = useMemo(
        () => participation.filter(p => p.type === 'positive' || p.type === 'collaboration' || p.type === 'question').length,
        [participation]
    );

    const trendClass = trend === 'up' ? 'var(--sys-tertiary)' : trend === 'down' ? 'var(--sys-error)' : 'var(--sys-on-surface-variant)';
    const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat';

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
                sx: {
                    backgroundColor: 'var(--sys-surface)',
                    border: '1px solid var(--sys-outline-variant)',
                    borderRadius: 'var(--shape-xl)',
                    boxShadow: 'var(--elevation-3)',
                    width: '280px',
                }
            }}
        >
            <Box>
                {/* Header with student info */}
                <Box
                    sx={{
                        backgroundColor: 'var(--sys-primary-container)',
                        color: 'var(--sys-on-primary-container)',
                        padding: '16px',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
                        <Box sx={{ minWidth: 0 }}>
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--sys-on-primary-container)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {student.cognome} {student.nome}
                            </h3>
                            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                                Classe {student.classe}
                            </p>
                        </Box>
                    </Box>

                    {/* Stats Row */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px',
                        }}
                    >
                        {/* Media */}
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                            <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Media
                            </p>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                                {grade || '-'}
                            </p>
                        </Box>

                        <Divider orientation="vertical" sx={{ height: '32px', backgroundColor: 'currentColor', opacity: 0.3 }} />

                        {/* Trend */}
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                            <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Trend
                            </p>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: trendClass }}>
                                {trendIcon}
                            </span>
                        </Box>

                        <Divider orientation="vertical" sx={{ height: '32px', backgroundColor: 'currentColor', opacity: 0.3 }} />

                        {/* Badge/Participation */}
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                            <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Badge
                            </p>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                                {participationToday}
                            </p>
                        </Box>
                    </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ padding: '8px' }}>
                    <p style={{ margin: '12px 16px 8px 16px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--sys-on-surface-variant)', letterSpacing: '0.5px' }}>
                        Azioni Rapide
                    </p>

                    <Button
                        fullWidth
                        onClick={() => {
                            onAddEvaluation();
                            onClose();
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            justifyContent: 'flex-start',
                            px: 2,
                            py: 1.5,
                            borderRadius: '20px',
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: 'var(--sys-on-surface)',
                            fontSize: '13px',
                            textTransform: 'none',
                            fontFamily: 'var(--font-family)',
                            '&:hover': { backgroundColor: 'var(--sys-surface-container-highest)' },
                            mb: 1
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--sys-primary)' }}>add_circle</span>
                        <span>Nuova Valutazione</span>
                    </Button>

                    <Button
                        fullWidth
                        onClick={() => {
                            onViewProfile();
                            onClose();
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            justifyContent: 'flex-start',
                            px: 2,
                            py: 1.5,
                            borderRadius: '20px',
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: 'var(--sys-on-surface)',
                            fontSize: '13px',
                            textTransform: 'none',
                            fontFamily: 'var(--font-family)',
                            '&:hover': { backgroundColor: 'var(--sys-surface-container-highest)' },
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--sys-secondary)' }}>person_search</span>
                        <span>Profilo Completo</span>
                    </Button>
                </Box>
            </Box>
        </Popover>
    );
};

export default StudentActionMenu;
            </div>
        </div>
    );
};

export default StudentActionMenu;
