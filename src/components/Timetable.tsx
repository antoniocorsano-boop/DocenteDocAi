import React, { useState, useMemo } from 'react';
import { Lezione, Slot, TimetableSettings } from '../types';
import TimetableCell from './TimetableCell';
import { DAYS_OF_WEEK } from '../constants';
import Guidance from './Guidance';
import { TabGroup, M3IconButton, M3Button } from './ui';

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for colors, spacing, typography, and animations

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
        <div className="timetable-page-layout">
            {/* Aura Ornaments */}
            <div className="timetable-aura-ornament-primary" />
            <div className="timetable-aura-ornament-secondary" />

            <div className="timetable-content">
                {/* HEADER: M3 Command Island */}
                <div className="timetable-header">
                    <div className="timetable-header-leading">
                        <div className="timetable-header-icon-container">
                            <span className="material-symbols-outlined timetable-header-icon">calendar_view_week</span>
                        </div>
                        <div className="timetable-header-title-container">
                            <h1 className="timetable-header-title">Il Mio Orario</h1>
                            <p className="timetable-header-subtitle">Planning Settimanale</p>
                        </div>
                    </div>
                    
                    {/* FLOATING COMMAND ISLAND */}
                    <div className="timetable-command-island">
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
                            <div className="timetable-day-navigation">
                                <M3IconButton 
                                    icon="chevron_left" 
                                    onClick={() => handleDayNav(-1)} 
                                    ariaLabel="Giorno precedente"
                                />
                                <span className="timetable-day-navigation-label">
                                    {visibleDays[0]}
                                </span>
                                <M3IconButton 
                                    icon="chevron_right" 
                                    onClick={() => handleDayNav(1)} 
                                    ariaLabel="Giorno successivo"
                                />
                            </div>
                        )}
                    </div>

                    <div className="timetable-header-trailing">
                        <M3Button 
                            onClick={() => window.print()} 
                            variant="secondary"
                            icon="print"
                        >
                            Stampa
                        </M3Button>
                    </div>
                </div>

                <div className="timetable-guidance-container">
                    <Guidance id="timetable-pro-tips-aura" icon="auto_awesome" title="Consiglio Rapido" isGloballyEnabled={showGuidanceTips}>
                        <p>Clicca su una cella vuota per pianificare. Usa la vista "Giorno" da smartphone per una gestione più focalizzata.</p>
                    </Guidance>
                </div>
                
                {/* MATRIX CONTAINER */}
                <div className="timetable-matrix-container">
                    <div className={`timetable-matrix-wrapper ${viewMode === 'day' ? 'single-day-view' : ''}`}>
                        <div className={`timetable-matrix ${viewMode === 'day' ? 'single-day-view' : ''} min-w-[320px]`}>
                            <div className="timetable-matrix-header-time">ORA</div>
                            {visibleDays.map((day, idx) => (
                                <div 
                                    key={day} 
                                    className={`timetable-matrix-header-cell ${day === DAYS_OF_WEEK[(new Date().getDay()+6)%7] ? 'today' : ''} ${idx === visibleDays.length - 1 ? 'rounded-tr-2xl' : ''}`}
                                >
                                    {day.substring(0, 3)}
                                </div>
                            ))}

                            {settings.timeSlots.map((time, timeIdx) => (
                                <React.Fragment key={time}>
                                    <div className={`timetable-matrix-time-label ${timeIdx === settings.timeSlots.length - 1 ? 'rounded-bl-2xl' : ''}`}>
                                        {time}
                                    </div>
                                    {visibleDays.map((day, dayIdx) => {
                                        const slotKey = `${day}-${time}`;
                                        const slot = slots[slotKey];
                                        const lesson = slot?.lezioneId ? lessons[slot.lezioneId] : undefined;
                                        return (
                                            <div 
                                                key={slotKey} 
                                                className={`timetable-matrix-cell-wrapper ${timeIdx === settings.timeSlots.length - 1 && dayIdx === visibleDays.length - 1 ? 'rounded-br-2xl' : ''}`} 
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


