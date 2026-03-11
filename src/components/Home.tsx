import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { PageWrapper } from './ui';
import { View, NavigationParams } from '../types';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useStudentStore } from '../stores/useStudentStore';

interface HomeProps {
  onNavigate: (view: View, params?: NavigationParams) => void;
  onOpenRegisterImport?: () => void;
  appState?: unknown;
  onSuggestionAction?: unknown;
  onStartClassroom?: unknown;
  finalizedRegister?: unknown;
  draftRegister?: unknown;
  showGuidanceTips?: unknown;
  suggestions?: unknown;
  dismissSuggestion?: unknown;
  onAiProcessing?: unknown;
  user?: unknown;
  onConnectDrive?: unknown;
  aiSettings?: unknown;
  settings?: unknown;
  handleOpenOperations?: unknown;
}

interface RecentActivity {
  id: string;
  title: string;
  meta?: string;
  time?: string;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const lessons = useAcademicStore(state => state.lessons);
  const students = useStudentStore(state => state.students);
  const evaluationsRaw = useStudentStore(state => state.evaluations);
  const evaluations = useMemo(() => evaluationsRaw ?? [], [evaluationsRaw]);

  const activities: RecentActivity[] = useMemo(() => {
    const acts: RecentActivity[] = [];
    Object.values(lessons || {}).slice(0, 3).forEach(lesson => {
      acts.push({
        id: `lesson-${lesson.id}`,
        title: 'Lezione pianificata',
        meta: `${lesson.materia} - ${lesson.classe}`,
        time: 'Oggi',
      });
    });
    evaluations.slice(0, 2).forEach(evaluation => {
      acts.push({
        id: `eval-${evaluation.id}`,
        title: 'Valutazione inserita',
        meta: `${evaluation.materia} - ${evaluation.studenteId}`,
        time: 'Ieri',
      });
    });
    return acts.slice(0, 5);
  }, [lessons, evaluations]);

  const nextLesson = useMemo(() => {
    const list = Object.values(lessons || {});
    return list.length ? list[0] : null;
  }, [lessons]);

  const lessonTagline = nextLesson
    ? `${nextLesson.classe} - ${nextLesson.tipoLezione ?? 'Lezione in classe'}`
    : 'Pianifica la prossima lezione';
  const lessonDetails =
    nextLesson?.obiettivi ||
    nextLesson?.contenuto ||
    "Utilizza l'integrazione AI per costruire contenuti e obiettivi in pochi tap.";

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buongiorno';
    if (h < 18) return 'Buon pomeriggio';
    return 'Buona sera';
  }, []);

  const quickActions: { label: string; icon: string; view: View }[] = [
    { label: 'Registro',    icon: 'menu_book',      view: 'register' as View },
    { label: 'Presenze',    icon: 'fact_check',     view: 'presenze' as View },
    { label: 'Valutazioni', icon: 'grading',        view: 'evaluations' as View },
    { label: 'Orario',      icon: 'schedule',       view: 'timetable' as View },
    { label: 'Agenda',      icon: 'calendar_month', view: 'calendario' as View },
  ];

  const metricCards = [
    {
      key: 'studenti',
      value: students?.length ?? 0,
      label: 'Studenti',
      icon: 'group',
      color: 'var(--md-sys-color-primary)',
      view: 'aula' as View,
      ariaLabel: `${students?.length ?? 0} studenti - vai a Classi`,
    },
    {
      key: 'valutazioni',
      value: evaluations?.length ?? 0,
      label: 'Valutazioni',
      icon: 'grading',
      color: 'var(--md-sys-color-tertiary)',
      view: 'evaluations' as View,
      ariaLabel: `${evaluations?.length ?? 0} valutazioni`,
    },
  ];

  return (
    <>
      <PageWrapper
        maxWidth="var(--md-sys-layout-content-max-width)"
        gap="var(--md-sys-spacing-6)"
        sx={{
          px: 'var(--md-sys-spacing-4)',
          pt: 'var(--md-sys-spacing-4)',
          pb: 'calc(80px + env(safe-area-inset-bottom, 0px))',
          boxSizing: 'border-box',
        }}
      >
        {/* HERO BANNER */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 'var(--md-sys-shape-corner-extra-large)',
            bgcolor: 'var(--md-sys-color-primary-container)',
            color: 'var(--md-sys-color-on-primary-container)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            component="span"
            className="material-symbols-outlined"
            aria-hidden="true"
            sx={{
              fontSize: 'var(--md-sys-typescale-display-small-font-size)',
              color: 'var(--md-sys-color-primary)',
              fontVariationSettings: '"FILL" 0',
              flexShrink: 0,
              mt: 0.5,
            }}
          >
            {nextLesson ? 'school' : 'auto_awesome'}
          </Box>
          <Stack spacing={0.5}>
            <Typography
              variant="h5"
              sx={{ color: 'var(--md-sys-color-on-primary-container)' }}
            >
              {greeting}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'var(--md-sys-color-on-primary-container)', opacity: 0.85 }}
            >
              {nextLesson
                ? `${lessonTagline} - ${lessonDetails.slice(0, 60)}${lessonDetails.length > 60 ? '...' : ''}`
                : lessonDetails}
            </Typography>
          </Stack>
        </Paper>

        {/* QUICK ACTION CHIPS */}
        <Box
          role="toolbar"
          aria-label="Azioni rapide"
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            pb: 0.5,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {quickActions.map(qa => (
            <Chip
              key={qa.view}
              label={qa.label}
              variant="outlined"
              onClick={() => onNavigate(qa.view)}
              aria-label={`Vai a ${qa.label}`}
              sx={{
                flexShrink: 0,
                scrollSnapAlign: 'start',
                borderColor: 'var(--md-sys-color-outline)',
                color: 'var(--md-sys-color-on-surface-variant)',
                '&:hover': { bgcolor: 'var(--md-sys-color-surface-container-high)' },
              }}
            />
          ))}
        </Box>

        {/* METRIC CARDS */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {metricCards.map(card => (
            <ButtonBase
              key={card.key}
              onClick={() => onNavigate(card.view)}
              aria-label={card.ariaLabel}
              focusRipple
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1.5,
                p: 2,
                borderRadius: 'var(--md-sys-shape-corner-large)',
                bgcolor: 'var(--md-sys-color-surface-container-low)',
                width: '100%',
                textAlign: 'left',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: 'var(--md-sys-color-surface-container)' },
                '&:focus-visible': { outline: `3px solid ${card.color}`, outlineOffset: 2 },
              }}
            >
              <Box
                component="span"
                className="material-symbols-outlined"
                aria-hidden="true"
                sx={{ fontSize: 'var(--md-sys-typescale-headline-medium-font-size)', color: card.color, fontVariationSettings: '"FILL" 0' }}
              >
                {card.icon}
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ color: card.color, lineHeight: 1 }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {card.label}
                </Typography>
              </Stack>
            </ButtonBase>
          ))}
        </Box>

        {/* RECENT ACTIVITY */}
        <Box component="section" aria-label="Attività recenti">
          <Typography variant="h6" sx={{ mb: 1.5, color: 'var(--md-sys-color-on-surface)' }}>
            Attività recenti
          </Typography>

          {activities.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 'var(--md-sys-shape-corner-large)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'var(--md-sys-color-surface-container-low)',
              }}
            >
              <Box
                component="span"
                className="material-symbols-outlined"
                aria-hidden="true"
                sx={{
                  fontSize: 'var(--md-sys-typescale-display-small-font-size)',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  fontVariationSettings: '"FILL" 0, "wght" 300',
                }}
              >
                event_busy
              </Box>
              <Typography variant="subtitle1">Nessuna attività recente</Typography>
              <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Le tue attività appariranno qui
              </Typography>
            </Paper>
          ) : (
            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {activities.map((activity, index) => {
                const isFirst = index === 0;
                const isLast = index === activities.length - 1;
                const br =
                  isFirst && isLast ? 'var(--md-sys-shape-corner-large)'
                  : isFirst ? 'var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-small)'
                  : isLast  ? 'var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large)'
                  : 'var(--md-sys-shape-corner-small)';

                return (
                  <ListItem
                    key={activity.id}
                    disablePadding
                    sx={{
                      borderRadius: br,
                      bgcolor: 'var(--md-sys-color-surface-container)',
                      px: 2.5,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 4,
                        alignSelf: 'stretch',
                        borderRadius: 'var(--md-sys-shape-corner-full)',
                        bgcolor: 'var(--md-sys-color-primary)',
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
                        {activity.title}
                      </Typography>
                      {activity.meta && (
                        <Typography
                          variant="body2"
                          sx={{ color: 'var(--md-sys-color-on-surface-variant)', mt: 0.25 }}
                        >
                          {activity.meta}
                        </Typography>
                      )}
                    </Box>
                    {activity.time && (
                      <Typography
                        variant="caption"
                        sx={{ color: 'var(--md-sys-color-on-surface-variant)', flexShrink: 0 }}
                      >
                        {activity.time}
                      </Typography>
                    )}
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </PageWrapper>

      {/* PRIMARY FAB */}
      <Fab
        variant="extended"
        color="primary"
        aria-label="Inizia giornata - Appello"
        onClick={() => onNavigate('presenze' as View)}
        sx={{
          position: 'fixed',
          bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
          right: 'calc(var(--md-sys-spacing-4, 16px) + var(--md-sys-spacing-10, 40px) + var(--md-sys-spacing-4, 16px))',
          zIndex: 'var(--md-sys-z-modal)',
          bgcolor: 'var(--md-sys-color-primary)',
          color: 'var(--md-sys-color-on-primary)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          gap: 1,
          textTransform: 'none',
        }}
      >
        <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-title-medium-font-size)' }}>
          playlist_add_check
        </Box>
        Inizia Giornata
      </Fab>
    </>
  );
};

export default Home;
