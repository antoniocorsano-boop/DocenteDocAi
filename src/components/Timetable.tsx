import React, { useState, useMemo } from 'react';
import { Lezione, Slot, TimetableSettings } from '../types';
import TimetableCell from './TimetableCell';
import { DAYS_OF_WEEK } from '../constants';
import Guidance from './Guidance';
import { TabGroup, M3IconButton, M3Button } from './ui';

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
        <div className="page-layout pb-16 relative overflow-hidden animate-in fade-in duration-700">
            {/* Aura Ornaments */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 space-y-6">
                {/* HEADER: M3 Command Island */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4 md:px-0">
                    <div className="flex items-center gap-8 self-start md:self-auto">
                        <div className="w-14 h-14 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                            <span className="material-symbols-outlined text-3xl">calendar_view_week</span>
                        </div>
                        <div>
                            <h1 className="m3-headline-medium font-black text-on-surface tracking-tight">Il Mio Orario</h1>
                            <p className="m3-body-small text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-60">Planning Settimanale</p>
                        </div>
                    </div>
                    
                    {/* FLOATING COMMAND ISLAND */}
                    <div className="flex items-center bg-surface-container-low/40 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl border border-outline-variant/20 gap-8">
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
                            <div className="flex items-center gap-8 pr-2 animate-in slide-in-from-left-3">
                                <M3IconButton 
                                    icon="chevron_left" 
                                    onClick={() => handleDayNav(-1)} 
                                    variant="standard"
                                />
                                <span className="text-sm font-black min-w-[100px] text-center uppercase tracking-widest text-on-surface">
                                    {visibleDays[0]}
                                </span>
                                <M3IconButton 
                                    icon="chevron_right" 
                                    onClick={() => handleDayNav(1)} 
                                    variant="standard"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-8 self-end md:self-auto">
                        <M3Button 
                            onClick={() => window.print()} 
                            variant="secondary"
                            icon="print"
                        >
                            Stampa
                        </M3Button>
                    </div>
                </div>

                <div className="px-4 md:px-0">
                    <Guidance id="timetable-pro-tips-aura" icon="auto_awesome" title="Consiglio Rapido" isGloballyEnabled={showGuidanceTips}>
                        <p>Clicca su una cella vuota per pianificare. Usa la vista "Giorno" da smartphone per una gestione più focalizzata.</p>
                    </Guidance>
                </div>
                
                {/* MATRIX CONTAINER */}
                <div className="px-4 md:px-0 overflow-x-auto no-scrollbar">
                    <div className={`bg-surface-container-low/30 backdrop-blur-xl rounded-5xl border border-outline-variant/20 p-6 shadow-2xl ${viewMode === 'day' ? 'max-w-2xl mx-auto' : ''}`}>
                        <div className={`timetable-matrix border-none ${viewMode === 'day' ? 'single-day-view' : ''} min-w-[320px]`}>
                            <div className="matrix-header-time bg-surface-container-highest/50 backdrop-blur-md rounded-tl-2xl font-black text-[10px] text-on-surface-variant">ORA</div>
                            {visibleDays.map((day, idx) => (
                                <div 
                                    key={day} 
                                    className={`matrix-header-cell ${day === DAYS_OF_WEEK[(new Date().getDay()+6)%7] ? 'today font-black bg-primary/10' : ''} ${idx === visibleDays.length - 1 ? 'rounded-tr-2xl' : ''}`}
                                >
                                    {day.substring(0, 3)}
                                </div>
                            ))}

                            {settings.timeSlots.map((time, timeIdx) => (
                                <React.Fragment key={time}>
                                    <div className={`matrix-time-label font-mono font-black opacity-60 text-[10px] ${timeIdx === settings.timeSlots.length - 1 ? 'rounded-bl-2xl' : ''}`}>
                                        {time}
                                    </div>
                                    {visibleDays.map((day, dayIdx) => {
                                        const slotKey = `${day}-${time}`;
                                        const slot = slots[slotKey];
                                        const lesson = slot?.lezioneId ? lessons[slot.lezioneId] : undefined;
                                        return (
                                            <div 
                                                key={slotKey} 
                                                className={`matrix-cell-wrapper transition-all duration-300 hover:scale-[1.02] hover:z-20 ${timeIdx === settings.timeSlots.length - 1 && dayIdx === visibleDays.length - 1 ? 'rounded-br-2xl' : ''}`} 
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
