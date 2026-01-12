
import React from 'react';
import { LiveAssistant } from './LiveAssistant'; // Corrected named import
import { LiveAssistantModalProps } from '../types';
import { M3Dialog, M3DialogContent } from './ui';

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
        <M3Dialog
            title="Assistente Vocale Live"
            onClose={onClose}
            maxWidth="2xl"
        >
            <M3DialogContent className="h-[85vh] overflow-hidden bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm" style={{ display: "flex", flexDirection: "column" }}>
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
            </M3DialogContent>
        </M3Dialog>
    );
};

export default LiveAssistantModal;


