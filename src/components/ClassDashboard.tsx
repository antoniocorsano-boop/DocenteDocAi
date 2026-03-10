// MD3 Compliant - Migrated from legacy tokens to MD3 design system
// Block F Migration: Removed className usage, converted hardcoded values to MD3 tokens
// Block C Migration: Removed sys.colors legacy token references

/**
 * ClassDashboard.tsx
 * // M3Expressive refactor: Applied M3 tokens for colors, spacing, and elevation. Removed inline Tailwind, using dedicated CSS classes with M3 variables.
 */

import React, { useMemo } from 'react';
import { View, Studente, Lezione, Valutazione, Slot } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { calculatePerformance } from '../utils/evaluationUtils';
import { SectionHeader, PageWrapper } from './ui';
import Avatar from './ui/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { useStudentStore } from '../stores/useStudentStore';
import { useAcademicStore } from '../stores/useAcademicStore';
interface ClassDashboardProps {
    selectedClass: string;
    onNavigate: (view: View, context?: string) => void;
    onStartImpromptuSession: (classe: string) => void;
    onStartPlannedLesson: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
    onViewStudentProfile: (student: Studente) => void;
}

interface StudentDashboardItemProps {
    student: Studente;
    evaluations: Valutazione[];
    onClick: (student: Studente) => void;
}

const StudentDashboardItem = React.memo(({ student, evaluations, onClick }: StudentDashboardItemProps) => {
    const { trend } = calculatePerformance(student.id, 'Complessivo', evaluations);
    const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat';

    const trendColor = trend === 'up' ? 'var(--md-sys-color-tertiary)' : trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)';

    return (
        <ButtonBase
            onClick={() => onClick(student)}
            aria-label={`Dettagli studente: ${student.nome} ${student.cognome}`}
            sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-3)',
                px: 'var(--md-sys-spacing-4)',
                py: 'var(--md-sys-spacing-3)',
                bgcolor: 'var(--md-sys-color-surface-container-low)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                textAlign: 'left',
                transition: 'background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
                '&:hover': { bgcolor: 'var(--md-sys-color-surface-container)' },
            }}
        >
            <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 'var(--md-sys-typescale-weight-medium)', color: 'var(--md-sys-color-on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.cognome} {student.nome}</Typography>
                <Stack direction="row" alignItems="center" spacing="var(--md-sys-spacing-1)" sx={{ mt: 'var(--md-sys-spacing-0-5)' }}>
                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-label-medium-font-size)', color: trendColor }}>{trendIcon}</Box>
                    <Typography variant="caption" component="span" sx={{ color: trendColor }}>
                        {trend === 'up' ? 'In crescita' : trend === 'down' ? 'In calo' : 'Stabile'}
                    </Typography>
                </Stack>
            </Box>
            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-spacing-5)', color: 'var(--md-sys-color-on-surface-variant)' }}>chevron_right</Box>
        </ButtonBase>
    );
});

const ClassDashboard: React.FC<ClassDashboardProps> = ({
    selectedClass,
    onNavigate,
    onStartImpromptuSession,
    onStartPlannedLesson,
    onViewStudentProfile,
}) => {
  const students = useStudentStore(state => state.students);
    const evaluations = useStudentStore(state => state.evaluations);
    const slots = useAcademicStore(state => state.slots);
    const lessons = useAcademicStore(state => state.lessons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const submissions = useAcademicStore(state => state.submissions) || [];

    const filteredStudents = useMemo(() => {
        return students.filter(s => s.classe === selectedClass).sort((a, b) => a.cognome.localeCompare(b.cognome));
    }, [students, selectedClass]);

    const todaysLesson = useMemo(() => {
        const todayName = DAYS_OF_WEEK[new Date().getDay() - 1] || DAYS_OF_WEEK[6];
        const lessonsToday = Object.values(slots)
            .filter((slot: Slot) => slot.giorno === todayName && slot.classe === selectedClass && slot.lezioneId && lessons[slot.lezioneId])
            .map((slot: Slot) => ({ slot, lesson: lessons[slot.lezioneId!] }))
            .filter(item => item.lesson && !item.lesson.svolta)
            .sort((a, b) => a.slot.ora.localeCompare(b.slot.ora));

        return lessonsToday.length > 0 ? lessonsToday[0] : null;
    }, [slots, lessons, selectedClass]);

    // Count pending submissions for this class
    const inboxCount = useMemo(() => {
        return submissions.filter(s => s.status === 'pending' && filteredStudents.some(st => st.id === s.studentId)).length;
    }, [submissions, filteredStudents]);

    return (
        <PageWrapper maxWidth="var(--md-sys-layout-content-max-width)" sx={{ px: 'var(--md-sys-spacing-4)', boxSizing: 'border-box' }}>
            <SectionHeader
                title={`Cruscotto Classe ${selectedClass}`}
                subtitle="Gestione didattica, valutazioni e monitoraggio in tempo reale"
                sx={{ textAlign: 'center', mb: 'var(--md-sys-spacing-6)' }}
            />

            <Grid container spacing={3}>
                {/* Main Column */}
                <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing="var(--md-sys-spacing-5)">

                    {/* Hero Section: Lesson or Action */}
                    <Box component="section">
                        {todaysLesson ? (
                            <Card sx={{
                                bgcolor: 'var(--md-sys-color-primary-container)',
                                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                            }}>
                                <CardContent sx={{ p: 'var(--md-sys-spacing-6)', '&:last-child': { pb: 'var(--md-sys-spacing-6)' } }}>
                                    <Stack spacing="var(--md-sys-spacing-4)">
                                        <Stack direction="row" alignItems="flex-start" spacing="var(--md-sys-spacing-4)">
                                            <Box sx={{
                                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                                bgcolor: 'var(--md-sys-color-primary)',
                                                color: 'var(--md-sys-color-on-primary)',
                                                width: 'var(--md-sys-spacing-12)',
                                                height: 'var(--md-sys-spacing-12)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)' }}>school</Box>
                                            </Box>
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography variant="caption" component="p" sx={{ color: 'var(--md-sys-color-on-primary-container)', mb: 'var(--md-sys-spacing-1)' }}>Prossima Lezione • {todaysLesson.slot.ora}</Typography>
                                                <Typography variant="h6" component="h2" sx={{ color: 'var(--md-sys-color-on-primary-container)' }}>{todaysLesson.lesson.materia}</Typography>
                                                <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-primary-container)', mt: 'var(--md-sys-spacing-1)', opacity: 'var(--md-sys-state-opacity-caption)' }}>{todaysLesson.lesson.contenuto}</Typography>
                                            </Box>
                                        </Stack>
                                        <Button
                                            onClick={() => onStartPlannedLesson(todaysLesson.lesson.classe, todaysLesson.lesson.materia, `${todaysLesson.slot.giorno}-${todaysLesson.slot.ora}`, todaysLesson.lesson)}
                                            variant="contained"
                                            startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">door_open</Box>}
                                        >
                                            Avvia Aula Digitale
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card sx={{
                                bgcolor: 'var(--md-sys-color-surface-container)',
                                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                            }}>
                                <CardContent sx={{ p: 'var(--md-sys-spacing-6)', '&:last-child': { pb: 'var(--md-sys-spacing-6)' } }}>
                                    <Stack direction="row" alignItems="center" spacing="var(--md-sys-spacing-4)" sx={{ mb: 'var(--md-sys-spacing-4)' }}>
                                        <Box sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', bgcolor: 'var(--md-sys-color-surface-container-high)', color: 'var(--md-sys-color-on-surface-variant)', width: 'var(--md-sys-spacing-12)', height: 'var(--md-sys-spacing-12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)' }}>event_busy</Box>
                                        </Box>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="h6" component="h2" sx={{ color: 'var(--md-sys-color-on-surface)' }}>Nessuna lezione programmata</Typography>
                                            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mt: 'var(--md-sys-spacing-1)' }}>Puoi avviare una lezione libera o un&apos;attività improvvisata.</Typography>
                                        </Box>
                                    </Stack>
                                    <Button onClick={() => onStartImpromptuSession(selectedClass)} variant="outlined" fullWidth startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">add_circle</Box>}>
                                        Avvia Lezione Improvvisata
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </Box>

                    {/* INBOX WIDGET */}
                    {inboxCount > 0 && (
                        <Card
                            sx={{
                                bgcolor: 'var(--md-sys-color-tertiary-container)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                            }}
                        >
                            <ButtonBase onClick={() => onNavigate('teacher-inbox')} sx={{ display: 'block', width: '100%', borderRadius: 'var(--md-sys-shape-corner-large)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Stack direction="row" alignItems="center" spacing="var(--md-sys-spacing-4)">
                                            <Box sx={{
                                                position: 'relative',
                                                width: 'var(--md-sys-spacing-10)',
                                                height: 'var(--md-sys-spacing-10)',
                                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                                bgcolor: 'var(--md-sys-color-tertiary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)', color: 'var(--md-sys-color-on-tertiary)' }}>mail</Box>
                                                <Box component="span" sx={{
                                                    position: 'absolute',
                                                    top: 'calc(-1 * var(--md-sys-spacing-1))',
                                                    right: 'calc(-1 * var(--md-sys-spacing-1))',
                                                    minWidth: 'var(--md-sys-spacing-5)',
                                                    height: 'var(--md-sys-spacing-5)',
                                                    borderRadius: 'var(--md-sys-shape-corner-full)',
                                                    bgcolor: 'var(--md-sys-color-error)',
                                                    color: 'var(--md-sys-color-on-error)',
                                                    fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                                                    fontWeight: 'var(--md-sys-typescale-weight-bold)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    px: 'var(--md-sys-spacing-1)',
                                                }}>
                                                    {inboxCount}
                                                </Box>
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography variant="subtitle1" component="h3" sx={{ color: 'var(--md-sys-color-on-tertiary-container)' }}>Inbox Compiti</Typography>
                                                <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-tertiary-container)' }}>{inboxCount} elaborati consegnati da valutare.</Typography>
                                            </Box>
                                        </Stack>
                                        <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)', color: 'var(--md-sys-color-on-tertiary-container)' }}>arrow_forward</Box>
                                    </Stack>
                                </CardContent>
                            </ButtonBase>
                        </Card>
                    )}

                    {/* TOOLS GRID */}
                    <Stack spacing="var(--md-sys-spacing-6)">
                        {/* 1. SEZIONE REGISTRO & DIDATTICA */}
                        <Box component="section">
                            <Stack direction="row" alignItems="center" spacing="var(--md-sys-spacing-2)" sx={{ mb: 'var(--md-sys-spacing-3)' }}>
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)', color: 'var(--md-sys-color-primary)' }}>auto_stories</Box>
                                <Typography variant="subtitle1" component="h3" sx={{ color: 'var(--md-sys-color-on-surface)' }}>Registro &amp; Didattica</Typography>
                            </Stack>
                            <Grid container spacing={"var(--md-sys-spacing-3)"}>
                                {[
                                    { view: 'register', icon: 'book', bg: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', label: 'Diario di Bordo', caption: 'Lezioni, assenze, note' },
                                    { view: 'didattica-inclusiva', icon: 'accessibility_new', bg: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)', label: 'Inclusione', caption: 'PDP, PEI e strategie' },
                                ].map(item => (
                                    <Grid key={item.view} size={{ xs: 6 }}>
                                        <Card sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', height: '100%' }}>
                                            <ButtonBase onClick={() => onNavigate(item.view as View, selectedClass)} sx={{ display: 'block', width: '100%', p: 'var(--md-sys-spacing-4)', height: '100%', borderRadius: 'var(--md-sys-shape-corner-large)' }}>
                                                <Stack direction="row" alignItems="center" spacing="var(--md-sys-spacing-3)">
                                                    <Box sx={{ width: 'var(--md-sys-spacing-10)', height: 'var(--md-sys-spacing-10)', borderRadius: 'var(--md-sys-shape-corner-medium)', bgcolor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ color: item.color, fontSize: 'var(--icon-size-medium)' }}>{item.icon}</Box>
                                                    </Box>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography variant="subtitle2" component="h4" sx={{ color: 'var(--md-sys-color-on-surface)' }}>{item.label}</Typography>
                                                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mt: 'var(--md-sys-spacing-0-5)', display: 'block' }}>{item.caption}</Typography>
                                                    </Box>
                                                </Stack>
                                            </ButtonBase>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* 2. SEZIONE VALUTAZIONE & COMPETENZE */}
                        <Box component="section">
                            <Stack direction="row" alignItems="center" spacing="var(--md-sys-spacing-2)" sx={{ mb: 'var(--md-sys-spacing-3)' }}>
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)', color: 'var(--md-sys-color-secondary)' }}>grading</Box>
                                <Typography variant="subtitle1" component="h3" sx={{ color: 'var(--md-sys-color-on-surface)' }}>Valutazione &amp; Competenze</Typography>
                            </Stack>
                            <Grid container spacing={"var(--md-sys-spacing-3)"}>
                                {[
                                    { view: 'evaluations', icon: 'ballot', bg: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)', label: 'Voti', caption: 'Registro valutazioni' },
                                    { view: 'class-competency-dashboard', icon: 'psychology', bg: 'var(--md-sys-color-tertiary-container)', color: 'var(--md-sys-color-on-tertiary-container)', label: 'Competenze', caption: 'Livelli e matrici' },
                                ].map(item => (
                                    <Grid key={item.view} size={{ xs: 6 }}>
                                        <Card sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', height: '100%' }}>
                                            <ButtonBase onClick={() => onNavigate(item.view as View, selectedClass)} sx={{ display: 'block', width: '100%', p: 'var(--md-sys-spacing-4)', height: '100%', borderRadius: 'var(--md-sys-shape-corner-large)' }}>
                                                <Stack direction="row" alignItems="center" spacing="var(--md-sys-spacing-3)">
                                                    <Box sx={{ width: 'var(--md-sys-spacing-10)', height: 'var(--md-sys-spacing-10)', borderRadius: 'var(--md-sys-shape-corner-medium)', bgcolor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ color: item.color, fontSize: 'var(--icon-size-medium)' }}>{item.icon}</Box>
                                                    </Box>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography variant="subtitle2" component="h4" sx={{ color: 'var(--md-sys-color-on-surface)' }}>{item.label}</Typography>
                                                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mt: 'var(--md-sys-spacing-0-5)', display: 'block' }}>{item.caption}</Typography>
                                                    </Box>
                                                </Stack>
                                            </ButtonBase>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* 3. SEZIONE ANALISI & REPORT */}
                        <Box component="section">
                            <Stack direction="row" alignItems="center" spacing="var(--md-sys-spacing-2)" sx={{ mb: 'var(--md-sys-spacing-3)' }}>
                                <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>analytics</Box>
                                <Typography variant="subtitle1" component="h3" sx={{ color: 'var(--md-sys-color-on-surface)' }}>Analisi &amp; Report</Typography>
                            </Stack>
                            <Grid container spacing={"var(--md-sys-spacing-3)"}>
                                {[
                                    { view: 'improvement-guide', icon: 'query_stats', color: 'var(--md-sys-color-primary)', label: 'Analisi AI', caption: 'Report pedagogico' },
                                    { view: 'consiglio-di-classe', icon: 'gavel', color: 'var(--md-sys-color-secondary)', label: 'Consiglio', caption: 'Scrutini e tabelloni' },
                                    { view: 'studenti', icon: 'groups', color: 'var(--md-sys-color-tertiary)', label: 'Anagrafica', caption: 'Elenco studenti' },
                                ].map(item => (
                                    <Grid key={item.view} size={{ xs: 4 }}>
                                        <Card sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', height: '100%' }}>
                                            <ButtonBase onClick={() => onNavigate(item.view as View, selectedClass)} sx={{ display: 'block', width: '100%', p: 'var(--md-sys-spacing-4)', height: '100%', borderRadius: 'var(--md-sys-shape-corner-large)', textAlign: 'center' }}>
                                                <Stack alignItems="center" spacing="var(--md-sys-spacing-2)">
                                                    <Box sx={{ width: 'var(--md-sys-spacing-10)', height: 'var(--md-sys-spacing-10)', borderRadius: 'var(--md-sys-shape-corner-medium)', bgcolor: 'var(--md-sys-color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ color: item.color, fontSize: 'var(--icon-size-medium)' }}>{item.icon}</Box>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" component="h4" sx={{ color: 'var(--md-sys-color-on-surface)' }}>{item.label}</Typography>
                                                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mt: 'var(--md-sys-spacing-0-5)', display: 'block' }}>{item.caption}</Typography>
                                                    </Box>
                                                </Stack>
                                            </ButtonBase>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Stack>
                </Stack>
                </Grid>

                {/* Side Column: Students List */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card elevation={1} sx={{ borderRadius: 'var(--md-sys-shape-corner-large)' }}>
                        <CardContent sx={{ p: 'var(--md-sys-spacing-4)', '&:last-child': { pb: 'var(--md-sys-spacing-4)' } }}>
                            <Stack spacing="var(--md-sys-spacing-3)">
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 'var(--md-sys-spacing-2)' }}>
                                    <Typography variant="h6" component="h2" sx={{ color: 'var(--md-sys-color-on-surface)' }}>Studenti</Typography>
                                    <Typography variant="overline" component="span" sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-primary)', bgcolor: 'var(--md-sys-color-primary-container)', borderRadius: 'var(--md-sys-shape-corner-full)', px: 'var(--md-sys-spacing-3)', py: 'var(--md-sys-spacing-1)' }}>
                                        {filteredStudents.length}
                                    </Typography>
                                </Stack>

                                <Stack spacing="var(--md-sys-spacing-1)">
                                    {filteredStudents.length > 0 ? filteredStudents.map(student => (
                                        <StudentDashboardItem
                                            key={student.id}
                                            student={student}
                                            evaluations={evaluations}
                                            onClick={onViewStudentProfile}
                                        />
                                    )) : (
                                        <Stack alignItems="center" spacing="var(--md-sys-spacing-2)" sx={{ p: 'var(--md-sys-spacing-6)' }}>
                                            <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--icon-size-xl)', color: 'var(--md-sys-color-on-surface-variant)', fontVariationSettings: '"FILL" 0, "wght" 300' }}>person_off</Box>
                                            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Nessuno studente in elenco.</Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageWrapper>
    );
};

export default React.memo(ClassDashboard);

