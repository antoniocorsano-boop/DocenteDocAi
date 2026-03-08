// MD3 Compliant - Uses CSS custom properties for theming
import { Tabs, Tab, Badge, Box } from '@mui/material';
import React, { useState, useMemo } from 'react';
import { Lezione, Slot, TimetableSettings } from '../types';
import TimetableCell from './TimetableCell';
import { DAYS_OF_WEEK } from '../constants';
import Guidance from './Guidance';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

interface TimetableProps {
    slots: Record<string, Slot>;
    lessons: Record<string, Lezione>;
    settings: TimetableSettings;
    onEditSlot: (giorno: string, ora: string) => void;
    onShowSlotActions: (slot: Slot, lesson: Lezione) => void;
    onAiSuggest?: () => void;
    activeSlotKey?: string;
    showGuidanceTips: boolean;
}

export const Timetable: React.FC<TimetableProps> = React.memo(({ slots, lessons, settings, onEditSlot, onShowSlotActions, showGuidanceTips }) => {
  const daysToShow = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const todayIndex = (new Date().getDay() + 6) % 7;

  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [currentDayIndex, setCurrentDayIndex] = useState(Math.min(todayIndex, 5));

  const handleCellClick = (day: string, time: string) => {
    const slotKey = `${day}-${time}`;
    const slot = slots[slotKey];
    const lesson = slot?.lezioneId ? lessons[slot.lezioneId] : undefined;
    if (slot && lesson && (slot.classe || lesson.tipoLezione === 'Disposizione' || lesson.tipoLezione === 'Ricevimento')) {
      onShowSlotActions(slot, lesson);
    } else {
      onEditSlot(day, time);
    }
  };

  const handleDayNav = (offset: number) => {
    setCurrentDayIndex(prev => Math.max(0, Math.min(5, prev + offset)));
  };

  const visibleDays = useMemo(() => {
    if (viewMode === 'week') return daysToShow;
    return [daysToShow[currentDayIndex]];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, currentDayIndex]);

  const todayName = DAYS_OF_WEEK[(new Date().getDay() + 6) % 7];

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      bgcolor: 'var(--md-sys-color-surface)',
      p: { xs: 2, sm: 3 },
      boxSizing: 'border-box',
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: '1400px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>

        {/* HEADER */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          p: 2,
          bgcolor: 'var(--md-sys-color-surface-container-low)',
          borderRadius: 'var(--md-sys-shape-corner-extra-large)',
          border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
          boxShadow: 'var(--md-sys-elevation-level2)',
        }}>
          {/* Title block */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box sx={{
              width: 40, height: 40,
              borderRadius: 'var(--md-sys-shape-corner-large)',
              bgcolor: 'var(--md-sys-color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--md-sys-color-on-primary)' }}>calendar_view_week</span>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 700, lineHeight: 1.2 }}>
                Il Mio Orario
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Planning Settimanale
              </Typography>
            </Box>
          </Box>

          {/* View switcher + day navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Tabs
              value={viewMode}
              onChange={(_, v: string) => setViewMode(v as 'week' | 'day')}
              indicatorColor="primary"
              textColor="primary"
              aria-label="Modalità visualizzazione"
              sx={{
                bgcolor: 'var(--md-sys-color-surface-container)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                minHeight: 'auto',
                p: 0.5,
                '& .MuiTabs-indicator': { borderRadius: 'var(--md-sys-shape-corner-full)' },
              }}
            >
              {([
                { id: 'week', label: 'Settimana', icon: 'view_week' },
                { id: 'day',  label: 'Giorno',    icon: 'calendar_view_day' },
              ] as { id: string; label: string; icon: string; badge?: number }[]).map(tab => (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  id={`tab-${tab.id}`}
                  aria-controls={`panel-${tab.id}`}
                  data-testid={`tab-${tab.id}`}
                  label={
                    <Badge badgeContent={tab.badge} color="error">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 16 }}>{tab.icon}</Box>
                        {tab.label}
                      </Box>
                    </Badge>
                  }
                  sx={{
                    borderRadius: 'var(--md-sys-shape-corner-full)',
                    minHeight: 36,
                    py: 0.5,
                    px: 1.5,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Tabs>

            {viewMode === 'day' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={() => handleDayNav(-1)} aria-label="Giorno precedente" disabled={currentDayIndex === 0}>
                  <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
                </IconButton>
                <Typography variant="overline" sx={{ minWidth: 80, textAlign: 'center', fontWeight: 600 }}>
                  {visibleDays[0]}
                </Typography>
                <IconButton size="small" onClick={() => handleDayNav(1)} aria-label="Giorno successivo" disabled={currentDayIndex === 5}>
                  <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                </IconButton>
              </Box>
            )}
          </Box>

          <Button
            onClick={() => window.print()}
            variant="outlined"
            size="small"
            startIcon={<span className="material-symbols-outlined" aria-hidden="true">print</span>}
          >
            Stampa
          </Button>
        </Box>

        {/* GUIDANCE */}
        <Guidance id="timetable-pro-tips-aura" icon="auto_awesome" title="Consiglio Rapido" isGloballyEnabled={showGuidanceTips}>
          <Typography variant="body2">Clicca su una cella vuota per pianificare. Usa la vista "Giorno" da smartphone per una gestione più focalizzata.</Typography>
        </Guidance>

        {/* GRID CONTAINER */}
        <Box sx={{
          bgcolor: 'var(--md-sys-color-surface-container-low)',
          borderRadius: 'var(--md-sys-shape-corner-extra-large)',
          border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
          p: { xs: 1, sm: 2 },
          boxShadow: 'var(--md-sys-elevation-level1)',
          overflowX: 'auto',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {/* role="table" + display:contents rows = proper ARIA table semantics on a CSS grid */}
          <Box
            role="table"
            aria-label="Orario settimanale"
            sx={{
              display: 'grid',
              gridTemplateColumns: `var(--md-sys-layout-120) repeat(${visibleDays.length}, minmax(80px, 1fr))`,
              gap: 'var(--md-sys-spacing-0-5)',
              minWidth: viewMode === 'week' ? 600 : 240,
            }}
          >
            {/* Header row — display:contents preserves grid layout while adding ARIA row */}
            <Box role="row" sx={{ display: 'contents' }}>
              <Box role="columnheader" sx={{
                p: 1, bgcolor: 'var(--md-sys-color-surface-container-high)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography variant="overline" sx={{ fontWeight: 700, color: 'var(--md-sys-color-on-surface-variant)' }}>ORA</Typography>
              </Box>
              {visibleDays.map(day => (
                <Box role="columnheader" key={day} sx={{
                  p: 1,
                  bgcolor: day === todayName ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-high)',
                  borderRadius: 'var(--md-sys-shape-corner-medium)',
                  border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography variant="overline" sx={{
                    fontWeight: 700,
                    color: day === todayName ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
                  }}>
                    {day.substring(0, 3)}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Data rows */}
            {settings.timeSlots.map(time => (
              <Box role="row" key={time} sx={{ display: 'contents' }}>
                <Box role="rowheader" sx={{
                  p: 1,
                  bgcolor: 'var(--md-sys-color-surface-container)',
                  borderRadius: 'var(--md-sys-shape-corner-medium)',
                  border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)', whiteSpace: 'nowrap' }}>
                    {time}
                  </Typography>
                </Box>
                {visibleDays.map(day => {
                  const slotKey = `${day}-${time}`;
                  const currentSlot = slots[slotKey];
                  const lesson = currentSlot?.lezioneId ? lessons[currentSlot.lezioneId] : undefined;
                  return (
                    <Box role="cell" key={slotKey} sx={{ borderRadius: 'var(--md-sys-shape-corner-small)', overflow: 'hidden' }}>
                      <TimetableCell
                        slot={currentSlot || { giorno: day, ora: time }}
                        lesson={lesson}
                        onClick={() => handleCellClick(day, time)}
                      />
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
});

export default Timetable;

