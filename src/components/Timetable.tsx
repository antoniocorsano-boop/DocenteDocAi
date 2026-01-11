import React, { useState, useMemo } from 'react';
import { Lezione, Slot, TimetableSettings } from '../types';
import TimetableCell from './TimetableCell';
import { DAYS_OF_WEEK } from '../constants';
import Guidance from './Guidance';
import { TabGroup, M3IconButton, M3Button, M3Typography } from './ui';

// MD3 Pure: Migrated to inline styles using MD3 tokens for colors, spacing, typography, and motion
// All timetable-* classes removed in favor of token-based styling

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
  }, [viewMode, currentDayIndex]);

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            backgroundColor: 'var(--md-sys-color-surface)',
            padding: 'var(--md-sys-spacing-6)',
            overflow: 'hidden'
        }}>
            {/* Aura Ornaments - MD3 decorative elements */}
            <div style={{
                position: 'absolute',
                top: 'var(--md-sys-spacing-4)',
                right: 'var(--md-sys-spacing-4)',
                width: '120px',
                height: '120px',
                backgroundColor: 'var(--md-sys-color-primary-container)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                opacity: 0.1,
                filter: 'blur(40px)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: 'var(--md-sys-spacing-8)',
                left: 'var(--md-sys-spacing-8)',
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--md-sys-color-secondary-container)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                opacity: 0.08,
                filter: 'blur(30px)',
                zIndex: 0
            }} />

            <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-6)',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* HEADER: MD3 Command Island */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--md-sys-spacing-6)',
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: 'var(--md-sys-elevation-level2)',
                    flexWrap: 'wrap',
                    gap: 'var(--md-sys-spacing-4)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-4)',
                        minWidth: 0,
                        flex: 1
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            backgroundColor: 'var(--md-sys-color-primary-container)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span className="material-symbols-outlined" style={{
                                fontSize: '24px',
                                color: 'var(--md-sys-color-on-primary-container)'
                            }}>calendar_view_week</span>
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <M3Typography variant="headline-small" style={{
                                color: 'var(--md-sys-color-on-surface)',
                                fontWeight: 900,
                                margin: 0
                            }}>Il Mio Orario</M3Typography>
                            <M3Typography variant="body-small" style={{
                                color: 'var(--md-sys-color-on-surface-variant)',
                                margin: 0,
                                opacity: 0.8
                            }}>Planning Settimanale</M3Typography>
                        </div>
                    </div>
                    
                    {/* FLOATING COMMAND ISLAND */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-4)',
                        backgroundColor: 'var(--md-sys-color-surface-container-high)',
                        padding: 'var(--md-sys-spacing-2)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        border: '1px solid var(--md-sys-color-outline-variant)',
                        backdropFilter: 'blur(16px)'
                    }}>
                        <TabGroup 
                            tabs={[
                                {id:'week', label:'Settimana', icon:'view_week'}, 
                                {id:'day', label:'Giorno', icon:'calendar_view_day'}
                            ]}
                            activeTab={viewMode}
                            onTabChange={(id: string) => setViewMode(id as 'week' | 'day')}
                            variant="primary"
                        />
                        
                        {viewMode === 'day' && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-2)',
                                padding: '0 var(--md-sys-spacing-3)',
                                margin: '0 var(--md-sys-spacing-2)',
                                borderLeft: '1px solid var(--md-sys-color-outline-variant)',
                                borderRight: '1px solid var(--md-sys-color-outline-variant)'
                            }}>
                                <M3IconButton 
                                    icon="chevron_left" 
                                    onClick={() => handleDayNav(-1)} 
                                    ariaLabel="Giorno precedente"
                                />
                                <M3Typography variant="label-large" style={{
                                    color: 'var(--md-sys-color-on-surface)',
                                    fontWeight: 600,
                                    minWidth: '80px',
                                    textAlign: 'center'
                                }}>
                                    {visibleDays[0]}
                                </M3Typography>
                                <M3IconButton 
                                    icon="chevron_right" 
                                    onClick={() => handleDayNav(1)} 
                                    ariaLabel="Giorno successivo"
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <M3Button 
                            onClick={() => window.print()} 
                            variant="secondary"
                            icon="print"
                        >
                            Stampa
                        </M3Button>
                    </div>
                </div>

                <div style={{
                    marginBottom: 'var(--md-sys-spacing-4)'
                }}>
                    <Guidance id="timetable-pro-tips-aura" icon="auto_awesome" title="Consiglio Rapido" isGloballyEnabled={showGuidanceTips}>
                        <p>Clicca su una cella vuota per pianificare. Usa la vista "Giorno" da smartphone per una gestione più focalizzata.</p>
                    </Guidance>
                </div>
                
                {/* MATRIX CONTAINER */}
                <div style={{
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    padding: 'var(--md-sys-spacing-6)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: 'var(--md-sys-elevation-level1)',
                    overflow: 'auto'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        minWidth: '320px'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: viewMode === 'day' ? '120px 1fr' : `120px repeat(${visibleDays.length}, 1fr)`,
                            gap: 'var(--md-sys-spacing-1)',
                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            padding: 'var(--md-sys-spacing-4)',
                            border: '1px solid var(--md-sys-color-outline-variant)',
                            minWidth: '100%'
                        }}>
                            <div style={{
                                padding: 'var(--md-sys-spacing-3)',
                                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--md-sys-color-outline-variant)'
                            }}>
                                <M3Typography variant="label-large" style={{
                                    color: 'var(--md-sys-color-on-surface-variant)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>ORA</M3Typography>
                            </div>
                            {visibleDays.map((day, idx) => (
                                <div 
                                    key={day} 
                                    style={{
                                        padding: 'var(--md-sys-spacing-3)',
                                        backgroundColor: day === DAYS_OF_WEEK[(new Date().getDay()+6)%7] 
                                            ? 'var(--md-sys-color-primary-container)' 
                                            : 'var(--md-sys-color-surface-container-highest)',
                                        borderRadius: idx === visibleDays.length - 1 ? 'var(--md-sys-shape-corner-medium)' : 'var(--md-sys-shape-corner-medium) 0 0 var(--md-sys-shape-corner-medium)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid var(--md-sys-color-outline-variant)',
                                        borderLeft: idx === 0 ? '1px solid var(--md-sys-color-outline-variant)' : 'none'
                                    }}
                                >
                                    <M3Typography variant="label-large" style={{
                                        color: day === DAYS_OF_WEEK[(new Date().getDay()+6)%7] 
                                            ? 'var(--md-sys-color-on-primary-container)' 
                                            : 'var(--md-sys-color-on-surface-variant)',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }}>{day.substring(0, 3)}</M3Typography>
                                </div>
                            ))}

                            {settings.timeSlots.map((time, timeIdx) => (
                                <React.Fragment key={time}>
                                    <div style={{
                                        padding: 'var(--md-sys-spacing-3)',
                                        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                        borderRadius: timeIdx === settings.timeSlots.length - 1 ? '0 var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium)' : 'var(--md-sys-shape-corner-medium)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid var(--md-sys-color-outline-variant)',
                                        borderTop: 'none'
                                    }}>
                                        <M3Typography variant="body-medium" style={{
                                            color: 'var(--md-sys-color-on-surface-variant)',
                                            fontWeight: 500
                                        }}>{time}</M3Typography>
                                    </div>
                                    {visibleDays.map((day, dayIdx) => {
                                        const slotKey = `${day}-${time}`;
                                        const slot = slots[slotKey];
                                        const lesson = slot?.lezioneId ? lessons[slot.lezioneId] : undefined;
                                        return (
                                            <div 
                                                key={slotKey} 
                                                style={{
                                                    borderRadius: timeIdx === settings.timeSlots.length - 1 && dayIdx === visibleDays.length - 1 
                                                        ? '0 var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium) 0' 
                                                        : 'var(--md-sys-shape-corner-medium)',
                                                    border: '1px solid var(--md-sys-color-outline-variant)',
                                                    borderTop: 'none',
                                                    borderLeft: dayIdx === 0 ? '1px solid var(--md-sys-color-outline-variant)' : 'none',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
                                                    backgroundColor: 'var(--md-sys-color-surface)'
                                                }}
                                                onClick={() => handleCellClick(day, time)}
                                            >
                                                <TimetableCell 
                                                    slot={slot || { giorno: day, ora: time }} 
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


