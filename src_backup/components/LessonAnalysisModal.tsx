// LEGACY - MD3 Non-compliant

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
            <M3DialogContent >
                <div >
                    {contextLabel && <AiMemoryChip label={contextLabel} />}
                    
                    {/* Section 1: Engagement */}
                    <div >
                        <div >
                             <div >
                                <span >rocket_launch</span>
                             </div>
                             <h3 >Strategie di Coinvolgimento</h3>
                        </div>
                        <div >
                            {result.engagementSuggestions.map((item, index) => (
                                <div key={index} >
                                    <div >
                                        <h4 >{item.title}</h4>
                                        <span >{item.activityType}</span>
                                    </div>
                                    <p >{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Inclusivity */}
                    <div >
                         <div >
                             <div >
                                <span >diversity_3</span>
                             </div>
                             <h3 >Adattamenti per l'Inclusività (UDL)</h3>
                        </div>
                        <div >
                            {result.inclusivityAdaptations.map((item, index) => (
                                <div key={index} >
                                     <div >
                                         <span >
                                             {item.targetGroup}
                                         </span>
                                     </div>
                                     <p >{item.suggestion}</p>
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



