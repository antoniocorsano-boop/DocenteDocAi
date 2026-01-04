
import React from 'react';
import { LessonAnalysisResult } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, AiMemoryChip } from './ui';

interface LessonAnalysisModalProps {
    result: LessonAnalysisResult;
    onClose: () => void;
    title: string;
    contextLabel?: string;
}

const LessonAnalysisModal: React.FC<LessonAnalysisModalProps> = ({ result, onClose, title, contextLabel }) => {
    return (
        <M3Dialog
            title="Analisi Pedagogica AI"
            onClose={onClose}
            maxWidth="xl"
            level={1}
        >
            <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm">
                <div className="space-y-6">
                    {contextLabel && <AiMemoryChip label={contextLabel} />}
                    
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
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="filled">Ho capito</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default LessonAnalysisModal;
