
// M3Expressive: LessonAnalysisModal - AI-powered lesson analysis results with M3 tokens
import React from 'react';
import { LessonAnalysisResult } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, AiMemoryChip } from './ui';

interface LessonAnalysisModalProps {
    result: LessonAnalysisResult;
    onClose: () => void;
    title: string;
    contextLabel?: string;
}

const LessonAnalysisModal: React.FC<LessonAnalysisModalProps> = ({ result, onClose, contextLabel }) => {
    return (
        <M3Dialog
            title="Analisi Pedagogica AI"
            onClose={onClose}
            maxWidth="xl"
            level={1}
        >
            <M3DialogContent className="lesson-analysis-modal-content">
                <div className="lesson-analysis-modal-main-content">
                    {contextLabel && <AiMemoryChip label={contextLabel} />}
                    
                    {/* Section 1: Engagement */}
                    <div className="lesson-analysis-modal-section-card">
                        <div className="lesson-analysis-modal-section-header">
                             <div className="lesson-analysis-modal-icon-container primary">
                                <span className="material-symbols-outlined lesson-analysis-modal-icon">rocket_launch</span>
                             </div>
                             <h3 className="m3-title-large lesson-analysis-modal-section-title">Strategie di Coinvolgimento</h3>
                        </div>
                        <div className="lesson-analysis-modal-content-area">
                            {result.engagementSuggestions.map((item, index) => (
                                <div key={index} className="lesson-analysis-modal-item-card">
                                    <div className="lesson-analysis-modal-item-header">
                                        <h4 className="m3-title-medium lesson-analysis-modal-item-title">{item.title}</h4>
                                        <span className="chip lesson-analysis-modal-activity-type-chip">{item.activityType}</span>
                                    </div>
                                    <p className="lesson-analysis-modal-item-description">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Inclusivity */}
                    <div className="lesson-analysis-modal-section-card tertiary">
                         <div className="lesson-analysis-modal-section-header">
                             <div className="lesson-analysis-modal-icon-container tertiary">
                                <span className="material-symbols-outlined lesson-analysis-modal-icon">diversity_3</span>
                             </div>
                             <h3 className="m3-title-large lesson-analysis-modal-section-title tertiary">Adattamenti per l'Inclusività (UDL)</h3>
                        </div>
                        <div className="lesson-analysis-modal-content-area">
                            {result.inclusivityAdaptations.map((item, index) => (
                                <div key={index} className="lesson-analysis-modal-item-card lesson-analysis-modal-inclusivity-item">
                                     <div className="lesson-analysis-modal-target-group-badge">
                                         <span className="lesson-analysis-modal-target-group-label">
                                             {item.targetGroup}
                                         </span>
                                     </div>
                                     <p className="lesson-analysis-modal-inclusivity-suggestion">{item.suggestion}</p>
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


