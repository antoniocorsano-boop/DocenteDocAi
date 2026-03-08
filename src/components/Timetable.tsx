// MD3 Compliant - Uses CSS custom properties for theming
import { Tabs, Tab, Badge, Box } from '@mui/material';
import React, { useState, useMemo } from 'react';
import { Lezione, Slot, TimetableSettings } from '../types';
import TimetableCell from './TimetableCell';
import { DAYS_OF_WEEK } from '../constants';
import Guidance from './Guidance';
import {} from './ui';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// MD3 Pure: Migrated to inline styles using MD3 tokens for colors, spacing, typography, and motion
// All timetable-* classes removed in favor of token-based styling
// Migration Status: ✅ MD3 Compliant (uses CSS custom properties)

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
      setCurrentDayIndex(prev => {
          const newIndex = prev + offset;
          return Math.max(0, Math.min(5, newIndex));
      });
  };

  const visibleDays = useMemo(() => {
      if (viewMode === 'week') return daysToShow;
      return [daysToShow[currentDayIndex]];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, currentDayIndex]);

    return (
        <div style={{position: 'relative',
            minHeight: 'var(--md-sys-viewport-height-full)',
            backgroundColor: 'var(--md-sys-color-surface)',
            padding: 'var(--md-sys-spacing-6)',
            overflow: 'hidden'}}>
            {/* Aura Ornaments - MD3 decorative elements */}
            <div style={{position: 'absolute',
                top: 'var(--md-sys-spacing-4)',
                right: 'var(--md-sys-spacing-4)',
                width: 'var(--md-sys-spacing-8)',
                height: 'var(--md-sys-spacing-8)',
                backgroundColor: 'var(--md-sys-color-primary)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                opacity: 'var(--md-sys-state-opacity-tint-faint)',
                filter: 'blur(var(--md-sys-blur-40))',
                zIndex: 'var(--md-sys-z-base)'}} />
            <div style={{position: 'absolute',
                bottom: 'var(--md-sys-spacing-8)',
                left: 'var(--md-sys-spacing-8)',
                width: 'var(--md-sys-spacing-8)',
                height: 'var(--md-sys-spacing-8)',
                backgroundColor: 'var(--md-sys-color-secondary)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                opacity: 'var(--md-sys-state-opacity-tint-thin)',
                filter: 'blur(var(--md-sys-blur-30))',
                zIndex: 'var(--md-sys-z-base)'}} />

            <div style={{position: 'relative',
                zIndex: 'var(--md-sys-z-raised)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-6)',
                maxWidth: 'var(--md-sys-spacing-80)',
                marginLeft: 'var(--md-sys-margin-auto)',
                marginRight: 'var(--md-sys-margin-auto)'}}>
                {/* HEADER: MD3 Command Island */}
                <div style={{display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--md-sys-spacing-6)',
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                    border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                    backdropFilter: 'blur(var(--md-sys-blur-20))',
                    boxShadow: 'var(--md-sys-elevation-level2)',
                    flexWrap: 'wrap',
                    gap: 'var(--md-sys-spacing-4)'}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-4)',
                        minWidth: 0,
                        flex: 1}}>
                        <div style={{width: 'var(--md-sys-spacing-8)',
                            height: 'var(--md-sys-spacing-8)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            backgroundColor: 'var(--md-sys-color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'}}>
                            <span className="material-symbols-outlined" style={{fontSize: 'var(--icon-size-medium)',
                                color: 'var(--md-sys-color-on-primary)'}}>calendar_view_week</span>
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="h6" sx={{color: 'var(--md-sys-color-on-surface)',
                                fontWeight: 'var(--md-sys-typescale-weight-black)',
                                margin: 0}}>Il Mio Orario</Typography>
                            <Typography variant="caption" sx={{color: 'var(--md-sys-color-on-surface)',
                                margin: 0,
                                opacity: 'var(--md-sys-state-opacity-caption)'}}>Planning Settimanale</Typography>
                        </div>
                    </div>
                    
                    {/* FLOATING COMMAND ISLAND */}
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-4)',
                        backgroundColor: 'var(--md-sys-color-surface-container-high)',
                        padding: 'var(--md-sys-spacing-2)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                        backdropFilter: 'blur(var(--md-sys-blur-16))'}}>
                                                <Tabs
                          value={viewMode}
                          onChange={(_, v: string) => ((id: string) => setViewMode(id as 'week' | 'day'))(v)}
                          indicatorColor="primary"
                          textColor="primary"
                          aria-label="Sezioni di navigazione"
                          sx={{
                            bgcolor: 'var(--md-sys-color-surface-container-low)',
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            border: '1px solid var(--md-sys-color-outline-variant)',
                            minHeight: 'auto',
                            p: 0.5,
                          }}
                        >
                          {([
                                {id:'week', label:'Settimana', icon:'view_week'}, 
                                {id:'day', label:'Giorno', icon:'calendar_view_day'}
                            ]).map((tab: { id: string; label: string; icon?: string; badge?: number | string }) => (
                            <Tab
                              key={tab.id}
                              value={tab.id}
                              id={`tab-${tab.id}`}
                              aria-controls={`panel-${tab.id}`}
                              data-testid={`tab-${tab.id}`}
                              label={(
                                <Badge badgeContent={tab.badge} color="error">
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {tab.icon && <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}>{tab.icon}</Box>}
                                    {tab.label}
                                  </Box>
                                </Badge>
                              )}
                              sx={{
                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                minHeight: 'auto',
                                py: 1,
                                px: 2,
                                textTransform: 'uppercase',
                                fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                              }}
                            />
                          ))}
                        </Tabs>
                        
                        {viewMode === 'day' && (
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-2)',
                                padding: `0 var(--md-sys-spacing-3)`,
                                margin: `0 var(--md-sys-spacing-2)`,
                                borderLeft: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                                borderRight: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)'}}>
                                <IconButton 
                                    onClick={() => handleDayNav(-1)} 
                                    aria-label="Giorno precedente"
                                ><span className="material-symbols-outlined" aria-hidden="true">chevron_left</span></IconButton>
                                <Typography variant="overline" sx={{color: 'var(--md-sys-color-on-surface)',
                                    fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                    minWidth: 'var(--md-sys-spacing-16)',
                                    textAlign: 'center'}}>
                                    {visibleDays[0]}
                                </Typography>
                                <IconButton 
                                    onClick={() => handleDayNav(1)} 
                                    aria-label="Giorno successivo"
                                ><span className="material-symbols-outlined" aria-hidden="true">chevron_right</span></IconButton>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button 
                            onClick={() => window.print()} 
                            variant="outlined"
                            startIcon={<span className="material-symbols-outlined" aria-hidden="true">print</span>}
                        >
                            Stampa
                        </Button>
                    </div>
                </div>

                <div style={{marginBottom: 'var(--md-sys-spacing-4)'}}>
                    <Guidance id="timetable-pro-tips-aura" icon="auto_awesome" title="Consiglio Rapido" isGloballyEnabled={showGuidanceTips}>
                        <Typography variant="body2">Clicca su una cella vuota per pianificare. Usa la vista "Giorno" da smartphone per una gestione più focalizzata.</Typography>
                    </Guidance>
                </div>
                
                {/* MATRIX CONTAINER */}
                <div style={{backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                    border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                    padding: 'var(--md-sys-spacing-6)',
                    backdropFilter: 'blur(var(--md-sys-blur-20))',
                    boxShadow: 'var(--md-sys-elevation-level1)',
                    overflow: 'auto'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        minWidth: 'var(--md-sys-spacing-16)'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: viewMode === 'day' ? 'var(--md-sys-layout-120) 1fr' : `var(--md-sys-layout-120) repeat(${visibleDays.length}, 1fr)`,
                            gap: 'var(--md-sys-spacing-1)',
                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            padding: 'var(--md-sys-spacing-4)',
                            border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                            minWidth: 'var(--md-sys-percent-100)'
                        }}>
                            <div style={{padding: 'var(--md-sys-spacing-3)',
                                backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)'}}>
                                <Typography variant="overline" sx={{color: 'var(--md-sys-color-on-surface)',
                                    fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                    textTransform: 'uppercase',
                                    letterSpacing: 'var(--md-sys-typescale-label-large-tracking)'}}>ORA</Typography>
                            </div>
                            {visibleDays.map((day, idx) => (
                                <div 
                                    key={day} 
                                    style={{padding: 'var(--md-sys-spacing-3)',
                                        backgroundColor: day === DAYS_OF_WEEK[(new Date().getDay()+6)%7] 
                                            ? 'var(--md-sys-color-primary)'
                                            : 'var(--md-sys-color-surface-container-high)',
                                        borderRadius: idx === visibleDays.length - 1 ? 'var(--md-sys-shape-corner-medium)' : 'var(--md-sys-shape-corner-medium) 0 0 var(--md-sys-shape-corner-medium)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                                        borderLeft: idx === 0 ? 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)' : 'none'}}>
                                    <Typography variant="overline" sx={{color: day === DAYS_OF_WEEK[(new Date().getDay()+6)%7] 
                                            ? 'var(--md-sys-color-on-primary)' 
                                            : 'var(--md-sys-color-on-surface)',
                                        fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                                        textTransform: 'uppercase',
                                        letterSpacing: 'var(--md-sys-typescale-label-large-tracking)'}}>{day.substring(0, 3)}</Typography>
                                </div>
                            ))}

                            {settings.timeSlots.map((time, timeIdx) => (
                                <React.Fragment key={time}>
                                    <div style={{padding: 'var(--md-sys-spacing-3)',
                                        backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                        borderRadius: timeIdx === settings.timeSlots.length - 1 ? '0 var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium)' : 'var(--md-sys-shape-corner-medium)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                                        borderTop: 'none'}}>
                                        <Typography variant="body2" sx={{color: 'var(--md-sys-color-on-surface)',
                                            fontWeight: 'var(--md-sys-typescale-weight-medium)'}}>{time}</Typography>
                                    </div>
                                    {visibleDays.map((day, dayIdx) => {
                                        const slotKey = `${day}-${time}`;
                                        const currentSlot = slots[slotKey];
                                        const lesson = currentSlot?.lezioneId ? lessons[currentSlot.lezioneId] : undefined;
                                        return (
                                            <div 
                                                key={slotKey} 
                                                style={{borderRadius: timeIdx === settings.timeSlots.length - 1 && dayIdx === visibleDays.length - 1 
                                                        ? '0 var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium) 0' 
                                                        : 'var(--md-sys-shape-corner-medium)',
                                                    border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                                                    borderTop: 'none',
                                                    borderLeft: dayIdx === 0 ? 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)' : 'none',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    transition: `all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                                                    backgroundColor: 'var(--md-sys-color-surface)'}}
                                                onClick={() => handleCellClick(day, time)}
                                            >
                                                <TimetableCell 
                                                    slot={currentSlot || { giorno: day, ora: time }} 
                                                    lesson={lesson}
                                                    onClick={() => handleCellClick(day, time)}
                                                />
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Timetable;

