// LEGACY - MD3 Non-compliant
import React, { useState, useEffect } from 'react';
import { Uda, AiSettings, KnowledgeBaseEntry } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';
import { validateUdaVerticalCurriculum } from '../services/aiService';
import { useTheme } from '../theme/theme';

interface UdaDetailModalProps {
    uda: Uda;
    onClose: () => void;
    onEdit: () => void;
    aiSettings: AiSettings;
    knowledgeBase: KnowledgeBaseEntry[];
}

const UdaDetailModal: React.FC<UdaDetailModalProps> = ({ uda, onClose, onEdit, aiSettings, knowledgeBase }) => {
  const { layers } = useTheme();
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
            <M3DialogContent style={{ backgroundColor: sys.colors.surface-container-high/30 }} style={{padding: layers.ref.spacing['6'], gap: layers.ref.spacing['6']}}>
                {/* Metadata Chips */}
                <div style={{display: "flex", flexWrap: "wrap", gap: layers.ref.spacing['2'], marginBottom: layers.ref.spacing['6']}}>
                    <span style={{ backgroundColor: sys.colors.primary/10 }} style={{borderRadius: ref.spacing[9999], color: "layers.sys.colors.primary", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: layers.ref.spacing['1']}}>
                        <span  style={{ fontSize: "0.875rem" }}>school</span>
                        Classe {uda.classe}
                    </span>
                    <span style={{ backgroundColor: sys.colors.secondary/10 }} style={{borderRadius: ref.spacing[9999], color: "layers.sys.colors.secondary", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: layers.ref.spacing['1']}}>
                        <span  style={{ fontSize: "0.875rem" }}>menu_book</span>
                        {uda.materia}
                    </span>
                    <span style={{ backgroundColor: sys.colors.tertiary/10 }} style={{borderRadius: ref.spacing[9999], color: "layers.sys.colors.tertiary", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: layers.ref.spacing['1']}}>
                        <span  style={{ fontSize: "0.875rem" }}>event</span>
                        {new Date(uda.startDate!).toLocaleDateString()} - {new Date(uda.endDate!).toLocaleDateString()}
                    </span>
                </div>

                {/* AI Validation Section */}
                <div style={{ backgroundColor: sys.colors.primary-container/10, borderRadius: ref.shape[] }} style={{border: "1px solid layers.sys.colors.outline", padding: layers.ref.spacing['4'], gap: layers.ref.spacing['3']}}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['2']}}>
                            <span  style={{color: "layers.sys.colors.primary"}}>verified</span>
                            <span style={{fontSize: "0.875rem", fontWeight: "900", color: "layers.sys.colors.on-surface", textTransform: "uppercase", letterSpacing: "0.1em"}}>Validazione Curricolo Verticale</span>
                        </div>
                        <M3Button onClick={handleValidate} variant="secondary" disabled={isValidating} style={{ fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {isValidating ? 'Validazione...' : 'Valida con AI'}
                        </M3Button>
                    </div>
                    {validationResult && (
                        <div style={{ backgroundColor: sys.colors.surface-container-low/50, borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['4'], border: "1px solid layers.sys.colors.outline"}}>
                            <p  style={{fontSize: "0.875rem", color: "layers.sys.colors.on-surface", lineHeight: "1.625"}}>
                                {validationResult}
                            </p>
                        </div>
                    )}
                </div>

                {/* Description */}
                <InfoCard title="Introduzione" variant="elevated" style={{padding: layers.ref.spacing['4']}}>
                    <p style={{color: "layers.sys.colors.on-surface", lineHeight: "1.625"}}>
                        {uda.introduction}
                    </p>
                </InfoCard>

                {/* Phases Timeline */}
                <div>
                    <h3 style={{ color: sys.colors.on-surface-variant }} style={{fontSize: "0.875rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: layers.ref.spacing['2']}}>Fasi di Lavoro</h3>
                    <div  style={{gap: layers.ref.spacing['3']}}>
                        {uda.phases.map((phase) => (
                            <div key={phase.id} >
                                <div  style={{width: ref.spacing[16], height: ref.spacing[16], borderRadius: ref.spacing[9999], backgroundColor: "layers.sys.colors.primary"}}></div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <h4 style={{fontWeight: "bold", color: "layers.sys.colors.primary"}}>{phase.title}</h4>
                                    <span style={{ color: sys.colors.on-secondary-container }} style={{fontSize: "0.75rem", fontWeight: "900", backgroundColor: "layers.sys.colors.secondary-container", borderRadius: "0.375rem", textTransform: "uppercase"}}>{phase.duration}h</span>
                                </div>
                                <p  style={{fontSize: "0.875rem", color: "layers.sys.colors.on-surface", fontWeight: "500"}}>{phase.description}</p>
                                <p style={{ color: sys.colors.on-surface-variant }} style={{ fontSize: "0.75rem" }}>{phase.activities}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Info Grid */}
                <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['4']}}>
                    <InfoCard title="Prodotto Finale" icon="inventory_2" variant="tonal" style={{padding: layers.ref.spacing['4']}}>
                        <p style={{fontSize: "0.875rem", color: "layers.sys.colors.on-surface"}}>{uda.finalProduct}</p>
                    </InfoCard>
                    <InfoCard title="Valutazione" icon="fact_check" variant="tonal" style={{padding: layers.ref.spacing['4']}}>
                        <p style={{fontSize: "0.875rem", color: "layers.sys.colors.on-surface"}}>{uda.evaluation}</p>
                    </InfoCard>
                </div>
            </M3DialogContent>

            <M3DialogActions>
                <M3Button onClick={handleClose} variant="text">Chiudi</M3Button>
                <M3Button onClick={handleEdit} variant="primary">
                    <span  style={{ marginRight: "0.5rem" }}>edit</span>
                    Modifica nel Planner
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default UdaDetailModal;

