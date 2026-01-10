import React, { useState, useEffect } from 'react';
import { Uda, AiSettings, KnowledgeBaseEntry } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';
import { validateUdaVerticalCurriculum } from '../services/aiService';

interface UdaDetailModalProps {
    uda: Uda;
    onClose: () => void;
    onEdit: () => void;
    aiSettings: AiSettings;
    knowledgeBase: KnowledgeBaseEntry[];
}

const UdaDetailModal: React.FC<UdaDetailModalProps> = ({ uda, onClose, onEdit, aiSettings, knowledgeBase }) => {
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<string | null>(null);

    useEffect(() => {
        console.log(`Audit: Opened UDA detail modal for ${uda.id}: ${uda.title}`);
    }, [uda.id, uda.title]);

    const handleValidate = async () => {
        console.log(`Audit: Started AI validation for UDA ${uda.id}`);
        setIsValidating(true);
        setValidationResult(null);
        try {
            const result = await validateUdaVerticalCurriculum(aiSettings, uda, knowledgeBase);
            setValidationResult(result);
            console.log(`Audit: Completed AI validation for UDA ${uda.id}`);
        } catch (error) {
            console.error("Validation error:", error);
            alert("Errore durante la validazione AI.");
        } finally {
            setIsValidating(false);
        }
    };

    const handleClose = () => {
        console.log(`Audit: Closed UDA detail modal for ${uda.id}`);
        onClose();
    };

    const handleEdit = () => {
        console.log(`Audit: Clicked edit button for UDA ${uda.id}`);
        onEdit();
    };

    return (
        <M3Dialog
            title={uda.title}
            onClose={handleClose}
            maxWidth="2xl"
        >
            <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm p-6 space-y-6">
                {/* Metadata Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">school</span>
                        Classe {uda.classe}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        {uda.materia}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">event</span>
                        {new Date(uda.startDate!).toLocaleDateString()} - {new Date(uda.endDate!).toLocaleDateString()}
                    </span>
                </div>

                {/* AI Validation Section */}
                <div className="bg-primary-container/10 border border-primary/20 rounded-large p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">verified</span>
                            <span className="text-sm font-black text-on-surface uppercase tracking-widest">Validazione Curricolo Verticale</span>
                        </div>
                        <M3Button onClick={handleValidate} variant="secondary" disabled={isValidating} className="text-xs font-black uppercase tracking-widest">
                            {isValidating ? 'Validazione...' : 'Valida con AI'}
                        </M3Button>
                    </div>
                    {validationResult && (
                        <div className="bg-surface-container-low/50 p-4 rounded-medium border border-outline-variant/20 animate-in fade-in slide-in-from-top-2">
                            <p className="text-sm text-on-surface leading-relaxed italic">
                                {validationResult}
                            </p>
                        </div>
                    )}
                </div>

                {/* Description */}
                <InfoCard title="Introduzione" variant="elevated" className="p-4">
                    <p className="text-on-surface leading-relaxed">
                        {uda.introduction}
                    </p>
                </InfoCard>

                {/* Phases Timeline */}
                <div>
                    <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Fasi di Lavoro</h3>
                    <div className="relative border-l-2 border-primary/30 ml-1 space-y-3 py-2">
                        {uda.phases.map((phase) => (
                            <div key={phase.id} className="relative pl-3">
                                <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-primary border-4 border-surface"></div>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-primary">{phase.title}</h4>
                                    <span className="text-xs font-black bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded uppercase">{phase.duration}h</span>
                                </div>
                                <p className="text-sm text-on-surface mt-1 font-medium">{phase.description}</p>
                                <p className="text-xs text-on-surface-variant mt-1 italic">{phase.activities}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard title="Prodotto Finale" icon="inventory_2" variant="tonal" className="p-4">
                        <p className="text-sm text-on-surface">{uda.finalProduct}</p>
                    </InfoCard>
                    <InfoCard title="Valutazione" icon="fact_check" variant="tonal" className="p-4">
                        <p className="text-sm text-on-surface">{uda.evaluation}</p>
                    </InfoCard>
                </div>
            </M3DialogContent>

            <M3DialogActions>
                <M3Button onClick={handleClose} variant="text">Chiudi</M3Button>
                <M3Button onClick={handleEdit} variant="primary">
                    <span className="material-symbols-outlined mr-2">edit</span>
                    Modifica nel Planner
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default UdaDetailModal;