// LEGACY - MD3 Non-compliant
import React, { useState, useMemo } from 'react';
import { useTheme } from '../theme/theme';
import { Lezione, Slot, TimetableSettings } from '../types';
import TimetableCell from './TimetableCell';
import { DAYS_OF_WEEK } from '../constants';
import Guidance from './Guidance';
import { TabGroup, M3IconButton, M3Button, M3Typography } from './ui';
import { useTheme } from '../theme/theme';

// MD3 Pure: Migrated to inline styles using MD3 tokens for colors, spacing, typography, and motion
// All timetable-* classes removed in favor of token-based styling
// Migration Date: Phase 7 (Remaining Components Migration) - useTheme compliance

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const daysToShow = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const todayIndex = (new Date().getDay() + 6) % 7; 

  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [currentDayIndex, setCurrentDayIndex] = useState(Math.min(todayIndex, 5));

  const handleCellClick = (day: string, time: string) => {
  const { layers } = useTheme();
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
        <div style={{position: 'relative',
            minHeight: '100vh',
            backgroundColor: 'layers.sys.color.surface',
            padding: layers.ref.spacing['6'],
            overflow: 'hidden'}}>
            {/* Aura Ornaments - MD3 decorative elements */}
            <div style={{position: 'absolute',
                top: layers.ref.spacing['4'],
                right: layers.ref.spacing['4'],
                width: layers.ref.spacing['8'],
                height: layers.ref.spacing['8'],
                backgroundColor: 'layers.sys.color.primaryContainer',
                borderRadius: 'layers.ref.shape.corner.full',
                opacity: 0.1,
                filter: 'blur(40px)',
                zIndex: 0}} />
            <div style={{position: 'absolute',
                bottom: layers.ref.spacing['8'],
                left: layers.ref.spacing['8'],
                width: layers.ref.spacing['8'],
                height: layers.ref.spacing['8'],
                backgroundColor: 'layers.sys.color.secondary-container',
                borderRadius: 'layers.ref.shape.corner.full',
                opacity: 0.08,
                filter: 'blur(30px)',
                zIndex: 0}} />

            <div style={{position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: layers.ref.spacing['6'],
                maxWidth: layers.ref.spacing['80'],
                margin: '0 auto'}}>
                {/* HEADER: MD3 Command Island */}
                <div style={{display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: layers.ref.spacing['6'],
                    backgroundColor: 'layers.sys.color.surfaceContainerLow',
                    borderRadius: 'layers.ref.shape.corner.extra-large',
                    border: '1px solid layers.sys.color.outline-variant',
                    backdropFilter: 'blur(20px)',
                    boxShadow: 'layers.sys.elevation.level2',
                    flexWrap: 'wrap',
                    gap: layers.ref.spacing['4']}}>
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: layers.ref.spacing['4'],
                        minWidth: 0,
                        flex: 1}}>
                        <div style={{width: layers.ref.spacing['8'],
                            height: layers.ref.spacing['8'],
                            borderRadius: 'layers.ref.shape.corner.large',
                            backgroundColor: 'layers.sys.color.primaryContainer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'}}>
                            <span style={{fontFamily: 'Material Symbols Outlined',
                                fontSize: layers.ref.spacing['6'],
                                color: 'layers.sys.color.on-primaryContainer'}}>calendar_view_week</span>
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <M3Typography variant="headline-small" style={{color: 'layers.sys.color.onSurface',
                                fontWeight: 900,
                                margin: 0}}>Il Mio Orario</M3Typography>
                            <M3Typography variant="body-small" style={{color: 'layers.sys.color.onSurface-variant',
                                margin: 0,
                                opacity: 0.8}}>Planning Settimanale</M3Typography>
                        </div>
                    </div>
                    
                    {/* FLOATING COMMAND ISLAND */}
                    <div style={{display: 'flex',
                        alignItems: 'center',
                        gap: layers.ref.spacing['4'],
                        backgroundColor: 'layers.sys.color.surfaceContainerHigh',
                        padding: layers.ref.spacing['2'],
                        borderRadius: 'layers.ref.shape.corner.large',
                        border: '1px solid layers.sys.color.outline-variant',
                        backdropFilter: 'blur(16px)'}}>
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
                            <div style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['2'],
                                padding: `0 ${layers.ref.spacing['3']}`,
                                margin: `0 ${layers.ref.spacing['2']}`,
                                borderLeft: '1px solid layers.sys.color.outline-variant',
                                borderRight: '1px solid layers.sys.color.outline-variant'}}>
                                <M3IconButton 
                                    icon="chevron_left" 
                                    onClick={() => handleDayNav(-1)} 
                                    ariaLabel="Giorno precedente"
                                />
                                <M3Typography variant="label-large" style={{color: 'layers.sys.color.onSurface',
                                    fontWeight: 600,
                                    minWidth: layers.ref.spacing['16'],
                                    textAlign: 'center'}}>
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

                <div style={{marginBottom: layers.ref.spacing['4']}}>
                    <Guidance id="timetable-pro-tips-aura" icon="auto_awesome" title="Consiglio Rapido" isGloballyEnabled={showGuidanceTips}>
                        <p>Clicca su una cella vuota per pianificare. Usa la vista "Giorno" da smartphone per una gestione più focalizzata.</p>
                    </Guidance>
                </div>
                
                {/* MATRIX CONTAINER */}
                <div style={{backgroundColor: 'layers.sys.color.surfaceContainerLow',
                    borderRadius: 'layers.ref.shape.corner.extra-large',
                    border: '1px solid layers.sys.color.outline-variant',
                    padding: layers.ref.spacing['6'],
                    backdropFilter: 'blur(20px)',
                    boxShadow: 'layers.sys.elevation.level1',
                    overflow: 'auto'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        minWidth: layers.ref.spacing['16']
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: viewMode === 'day' ? '120px 1fr' : `120px repeat(${visibleDays.length}, 1fr)`,
                            gap: 'var(--md-sys-spacing-1)',
                            backgroundColor: 'var(--md-sys-color-surfaceContainerHigh)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            padding: 'var(--md-sys-spacing-4)',
                            border: '1px solid var(--md-sys-color-outline-variant)',
                            minWidth: '100%'
                        }}>
                            <div style={{padding: layers.ref.spacing['3'],
                                backgroundColor: 'layers.sys.color.surfaceContainerHighest',
                                borderRadius: 'layers.ref.shape.corner.medium',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid layers.sys.color.outline-variant'}}>
                                <M3Typography variant="label-large" style={{color: 'layers.sys.color.onSurface-variant',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'}}>ORA</M3Typography>
                            </div>
                            {visibleDays.map((day, idx) => (
                                <div 
                                    key={day} 
                                    style={{padding: layers.ref.spacing['3'],
                                        backgroundColor: day === DAYS_OF_WEEK[(new Date().getDay()+6)%7] 
                                            ? 'layers.sys.color.primaryContainer' 
                                            : 'layers.sys.color.surfaceContainerHighest',
                                        borderRadius: idx === visibleDays.length - 1 ? 'layers.ref.shape.corner.medium' : 'layers.ref.shape.corner.medium 0 0 layers.ref.shape.corner.medium',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid layers.sys.color.outline-variant',
                                        borderLeft: idx === 0 ? '1px solid layers.sys.color.outline-variant' : 'none'}}
                                >
                                    <M3Typography variant="label-large" style={{color: day === DAYS_OF_WEEK[(new Date().getDay()+6)%7] 
                                            ? 'layers.sys.color.on-primaryContainer' 
                                            : 'layers.sys.color.onSurface-variant',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'}}>{day.substring(0, 3)}</M3Typography>
                                </div>
                            ))}

                            {settings.timeSlots.map((time, timeIdx) => (
                                <React.Fragment key={time}>
                                    <div style={{padding: layers.ref.spacing['3'],
                                        backgroundColor: 'layers.sys.color.surfaceContainerHighest',
                                        borderRadius: timeIdx === settings.timeSlots.length - 1 ? '0 layers.ref.shape.corner.medium layers.ref.shape.corner.medium layers.ref.shape.corner.medium' : 'layers.ref.shape.corner.medium',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid layers.sys.color.outline-variant',
                                        borderTop: 'none'}}>
                                        <M3Typography variant="body-medium" style={{color: 'layers.sys.color.onSurface-variant',
                                            fontWeight: 500}}>{time}</M3Typography>
                                    </div>
                                    {visibleDays.map((day, dayIdx) => {
                                        const slotKey = `${day}-${time}`;
                                        const slot = slots[slotKey];
                                        const lesson = slot?.lezioneId ? lessons[slot.lezioneId] : undefined;
                                        return (
                                            <div 
                                                key={slotKey} 
                                                style={{borderRadius: timeIdx === settings.timeSlots.length - 1 && dayIdx === visibleDays.length - 1 
                                                        ? '0 layers.ref.shape.corner.medium layers.ref.shape.corner.medium 0' 
                                                        : 'layers.ref.shape.corner.medium',
                                                    border: '1px solid layers.sys.color.outline-variant',
                                                    borderTop: 'none',
                                                    borderLeft: dayIdx === 0 ? '1px solid layers.sys.color.outline-variant' : 'none',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    transition: `all ${layers.motion.duration.short} ${layers.motion.easing.standard}`,
                                                    backgroundColor: 'layers.sys.color.surface'}}
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







