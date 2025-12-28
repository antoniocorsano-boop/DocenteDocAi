
import React from 'react';
import { LiveAssistant } from './LiveAssistant'; // Corrected named import
import { LiveAssistantModalProps } from '../types';

const LiveAssistantModal: React.FC<LiveAssistantModalProps> = ({ 
    onClose, 
    lessonContext, 
    onNavigate, 
    onCreateEvent, 
    onScheduleLesson, 
    onAddEvaluation, 
    onAddNote,
    onMarkAttendance, 
    onCreateUda, 
    onLoadDemoData,
    students,
    evaluations,
    slots,
    lessons,
    pianiInclusione,
    knowledgeBase,
    userContext // Receive new prop
}) => {
    return (
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-2xl h-[85vh] flex flex-col">
                <div className="dialog-header border-b border-outline-variant flex-shrink-0">
                    <h2 className="m3-headline-medium">Assistente Vocale Live</h2>
                    <button onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                {/* Removed !p-6 to allow full bleed layout */}
                <div className="flex-grow overflow-hidden flex flex-col relative">
                    <LiveAssistant 
                        lessonContext={lessonContext} 
                        isModalMode={true} 
                        onNavigate={(v, c) => { onNavigate?.(v, c); onClose(); }}
                        onCreateEvent={(e) => { 
                            // Pass the event directly; ID generation happens in the parent handler or via helper
                            onCreateEvent?.(e); 
                            onClose();
                        }} 
                        onScheduleLesson={(data) => { onScheduleLesson?.(data); onClose(); }} 
                        onAddEvaluation={(data) => { onAddEvaluation?.(data); onClose(); }} 
                        onCreateUda={(data) => { onCreateUda?.(data); onClose(); }} 
                        onAddNote={(data) => { onAddNote?.(data); onClose(); }}
                        onMarkAttendance={(data) => { onMarkAttendance?.(data); onClose(); }} 
                        onLoadDemoData={() => { onLoadDemoData?.(); onClose(); }}
                        students={students}
                        evaluations={evaluations}
                        slots={slots}
                        lessons={lessons}
                        pianiInclusione={pianiInclusione}
                        knowledgeBase={knowledgeBase}
                        userContext={userContext} // Pass to LiveAssistant
                    />
                </div>
            </div>
        </div>
    );
};

export default LiveAssistantModal;
