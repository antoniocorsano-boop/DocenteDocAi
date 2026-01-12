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
            <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm" style={{ padding: "var(--md-sys-spacing-6)", gap: "var(--md-sys-spacing-6)" }}>
                {/* Metadata Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--md-sys-spacing-2)", marginBottom: "var(--md-sys-spacing-6)" }}>
                    <span className="px-3 py-1 bg-primary/10" style={{ borderRadius: "9999px", color: "var(--md-sys-color-primary)", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-1)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>school</span>
                        Classe {uda.classe}
                    </span>
                    <span className="px-3 py-1 bg-secondary/10" style={{ borderRadius: "9999px", color: "var(--md-sys-color-secondary)", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-1)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>menu_book</span>
                        {uda.materia}
                    </span>
                    <span className="px-3 py-1 bg-tertiary/10" style={{ borderRadius: "9999px", color: "var(--md-sys-color-tertiary)", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-1)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>event</span>
                        {new Date(uda.startDate!).toLocaleDateString()} - {new Date(uda.endDate!).toLocaleDateString()}
                    </span>
                </div>

                {/* AI Validation Section */}
                <div className="bg-primary-container/10 border-primary/20 rounded-large" style={{ border: "1px solid var(--md-sys-color-outline)", padding: "var(--md-sys-spacing-4)", gap: "var(--md-sys-spacing-3)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-2)" }}>
                            <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)" }}>verified</span>
                            <span style={{ fontSize: "0.875rem", fontWeight: "900", color: "var(--md-sys-color-on-surface)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Validazione Curricolo Verticale</span>
                        </div>
                        <M3Button onClick={handleValidate} variant="secondary" disabled={isValidating} style={{ fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {isValidating ? 'Validazione...' : 'Valida con AI'}
                        </M3Button>
                    </div>
                    {validationResult && (
                        <div className="bg-surface-container-low/50 rounded-medium border-outline-variant/20 animate-in fade-in slide-in-from-top-2" style={{ padding: "var(--md-sys-spacing-4)", border: "1px solid var(--md-sys-color-outline)" }}>
                            <p className="italic" style={{ fontSize: "0.875rem", color: "var(--md-sys-color-on-surface)", lineHeight: "1.625" }}>
                                {validationResult}
                            </p>
                        </div>
                    )}
                </div>

                {/* Description */}
                <InfoCard title="Introduzione" variant="elevated" style={{
  padding: 'var(--md-sys-spacing-4)'
}}>
                    <p style={{ color: "var(--md-sys-color-on-surface)", lineHeight: "1.625" }}>
                        {uda.introduction}
                    </p>
                </InfoCard>

                {/* Phases Timeline */}
                <div>
                    <h3 className="text-on-surface-variant" style={{ fontSize: "0.875rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--md-sys-spacing-2)" }}>Fasi di Lavoro</h3>
                    <div className="relative border-l-2 border-primary/30 ml-1 py-2" style={{ gap: "var(--md-sys-spacing-3)" }}>
                        {uda.phases.map((phase) => (
                            <div key={phase.id} className="relative pl-3">
                                <div className="absolute -left-2 top-1 border-4 border-surface" style={{ width: "1rem", height: "1rem", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-primary)" }}></div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <h4 style={{ fontWeight: "bold", color: "var(--md-sys-color-primary)" }}>{phase.title}</h4>
                                    <span className="text-on-secondary-container px-2 py-0.5" style={{ fontSize: "0.75rem", fontWeight: "900", backgroundColor: "var(--md-sys-color-secondary-container)", borderRadius: "0.375rem", textTransform: "uppercase" }}>{phase.duration}h</span>
                                </div>
                                <p className="mt-1" style={{ fontSize: "0.875rem", color: "var(--md-sys-color-on-surface)", fontWeight: "500" }}>{phase.description}</p>
                                <p className="text-on-surface-variant mt-1 italic" style={{ fontSize: "0.75rem" }}>{phase.activities}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Info Grid */}
                <div className="md:grid-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-4)" }}>
                    <InfoCard title="Prodotto Finale" icon="inventory_2" variant="tonal" style={{
  padding: 'var(--md-sys-spacing-4)'
}}>
                        <p style={{ fontSize: "0.875rem", color: "var(--md-sys-color-on-surface)" }}>{uda.finalProduct}</p>
                    </InfoCard>
                    <InfoCard title="Valutazione" icon="fact_check" variant="tonal" style={{
  padding: 'var(--md-sys-spacing-4)'
}}>
                        <p style={{ fontSize: "0.875rem", color: "var(--md-sys-color-on-surface)" }}>{uda.evaluation}</p>
                    </InfoCard>
                </div>
            </M3DialogContent>

            <M3DialogActions>
                <M3Button onClick={handleClose} variant="text">Chiudi</M3Button>
                <M3Button onClick={handleEdit} variant="primary">
                    <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>edit</span>
                    Modifica nel Planner
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default UdaDetailModal;