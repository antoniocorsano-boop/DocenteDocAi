
import React from 'react';
import { LessonAnalysisResult } from '../types';
import { AiMemoryChip } from './M3Components';

interface LessonAnalysisModalProps {
    result: LessonAnalysisResult;
    onClose: () => void;
    title: string;
    contextLabel?: string;
}

const LessonAnalysisModal: React.FC<LessonAnalysisModalProps> = ({ result, onClose, title, contextLabel }) => {
    return (
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-3xl h-[80vh]">
                <div className="dialog-header">
                    <div>
                        <h2 className="m3-headline-medium">Analisi Pedagogica AI</h2>
                        <p className="m3-body-medium text-on-surface-variant">{title}</p>
                        {contextLabel && <AiMemoryChip label={contextLabel} />}
                    </div>
                    <button onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="dialog-content p-6 overflow-y-auto space-y-6">
                    
                    {/* Section 1: Engagement */}
                    <div className="card border-l-4 border-l-primary bg-surface-container-low">
                        <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">rocket_launch</span>
                             </div>
                             <h3 className="m3-title-large text-primary">Strategie di Coinvolgimento</h3>
                        </div>
                        <div className="space-y-4">
                            {result.engagementSuggestions.map((item, index) => (
                                <div key={index} className="p-3 bg-surface rounded-xl border border-outline-variant">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="m3-title-medium font-bold">{item.title}</h4>
                                        <span className="chip text-xs bg-primary-container text-on-primary-container border-none">{item.activityType}</span>
                                    </div>
                                    <p className="m3-body-medium text-on-surface-variant">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Inclusivity */}
                    <div className="card border-l-4 border-l-tertiary bg-surface-container-low">
                         <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">diversity_3</span>
                             </div>
                             <h3 className="m3-title-large text-tertiary">Adattamenti per l'Inclusività (UDL)</h3>
                        </div>
                        <div className="space-y-4">
                            {result.inclusivityAdaptations.map((item, index) => (
                                <div key={index} className="p-3 bg-surface rounded-xl border border-outline-variant flex gap-4 items-start">
                                     <div className="w-16 flex-shrink-0 pt-1">
                                         <span className="block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant text-center bg-surface-container-high rounded px-1 py-0.5">
                                             {item.targetGroup}
                                         </span>
                                     </div>
                                     <p className="m3-body-medium text-on-surface">{item.suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                
                <div className="dialog-footer">
                    <button onClick={onClose} className="button button-filled">Ho capito</button>
                </div>
            </div>
        </div>
    );
};

export default LessonAnalysisModal;
