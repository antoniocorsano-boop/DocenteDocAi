import React, { useState, useMemo } from 'react';
import { Lezione, Slot, TimetableSettings } from '../types';
import TimetableCell from './TimetableCell';
import { DAYS_OF_WEEK } from '../constants';
import Guidance from './Guidance';
import { TabGroup } from './M3Components';

interface TimetableProps {
  slots: Record<string, Slot>;
  lessons: Record<string, Lezione>;
  settings: TimetableSettings;
  onEditSlot: (giorno: string, ora: string) => void;
  onShowSlotActions: (slot: Slot, lesson: Lezione) => void;
  onAiSuggest: (slot: Slot) => void;
  activeSlotKey?: string | null;
  showGuidanceTips: boolean;
}

export const Timetable: React.FC<TimetableProps> = React.memo(({ slots, lessons, settings, onEditSlot, onShowSlotActions, onAiSuggest, activeSlotKey, showGuidanceTips }) => {
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
    <div className="page-layout pb-32 relative overflow-hidden">
        {/* HEADER: M3 Command Island */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4 mb-8 px-4 md:px-0">
             <div className="flex items-center gap-4 self-start md:self-auto">
                 <div className="w-14 h-14 rounded-[20px] bg-primary-container text-on-primary-container flex items-center justify-center shadow-md">
                     <span className="material-symbols-outlined text-3xl">calendar_view_week</span>
                 </div>
                 <div>
                     <h1 className="m3-headline-medium font-black text-on-surface tracking-tight">Il Mio Orario</h1>
                     <p className="m3-body-small text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-50">Planning Settimanale</p>
                 </div>
             </div>
             
             {/* FLOATING COMMAND ISLAND */}
             <div className="flex items-center bg-surface-container-high/80 backdrop-blur-xl rounded-full p-1.5 shadow-2xl border border-white/20 gap-4">
                  <TabGroup 
                    tabs={[{id:'week', label:'Settimana', icon:'view_week'}, {id:'day', label:'Giorno', icon:'calendar_view_day'}]}
                    activeTab={viewMode}
                    onTabChange={(id) => setViewMode(id as any)}
                    variant="primary"
                  />
                  
                  {viewMode === 'day' && (
                    <div className="flex items-center gap-2 pr-3 animate-in slide-in-from-left-3">
                        <button onClick={() => handleDayNav(-1)} className="icon-button !w-10 !h-10 hover:bg-surface-container-highest"><span className="material-symbols-outlined">chevron_left</span></button>
                        <span className="text-sm font-black min-w-[90px] text-center uppercase tracking-widest">{visibleDays[0]}</span>
                        <button onClick={() => handleDayNav(1)} className="icon-button !w-10 !h-10 hover:bg-surface-container-highest"><span className="material-symbols-outlined">chevron_right</span></button>
                    </div>
                  )}
             </div>

             <div className="flex items-center gap-2 self-end md:self-auto">
                 <button onClick={() => window.print()} className="button-drop bg-surface-container-highest text-on-surface border-none !px-6">
                    <span className="material-symbols-outlined text-lg">print</span> <span className="ml-2 font-bold">Stampa</span>
                </button>
             </div>
        </div>

      <div className="px-4 md:px-0">
          <Guidance id="timetable-pro-tips-aura" icon="auto_awesome" title="Consiglio Rapido" isGloballyEnabled={showGuidanceTips}>
              <p>Clicca su una cella vuota per pianificare. Usa la vista "Giorno" da smartphone per una gestione più focalizzata.</p>
          </Guidance>
      </div>
      
      {/* MATRIX CONTAINER */}
      <div className="px-1 md:px-0 overflow-x-auto no-scrollbar">
          <div className={`timetable-matrix shadow-2xl border-none ${viewMode === 'day' ? 'single-day-view' : ''} min-w-[320px]`}>
              <div className="matrix-header-time bg-surface-container-highest font-black text-[10px]">ORA</div>
              {visibleDays.map(day => (
                  <div key={day} className={`matrix-header-cell ${day === DAYS_OF_WEEK[(new Date().getDay()+6)%7] ? 'today font-black' : ''}`}>
                      {day.substring(0, 3)}
                  </div>
              ))}

              {settings.timeSlots.map(time => (
                  <React.Fragment key={time}>
                      <div className="matrix-time-label font-mono font-black opacity-60 text-[10px]">{time}</div>
                      {visibleDays.map(day => {
                          const slotKey = `${day}-${time}`;
                          const slot = slots[slotKey];
                          const lesson = slot?.lezioneId ? lessons[slot.lezioneId] : undefined;
                          return (
                              <div key={slotKey} className="matrix-cell-wrapper" onClick={() => handleCellClick(day, time)}>
                                  <TimetableCell 
                                      slot={slot || { giorno: day, ora: time }} 
                                      lesson={lesson}
                                      onAiSuggest={onAiSuggest}
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
  );
});
