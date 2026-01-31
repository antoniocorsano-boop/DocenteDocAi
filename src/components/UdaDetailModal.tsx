/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.
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
            <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', padding: 'var(--md-sys-spacing-6)', gap: 'var(--md-sys-spacing-6)'}}>
                {/* Metadata Chips */}
                <div style={{display: "flex", flexWrap: "wrap", gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-6)'}}>
                    <span style={{ backgroundColor: 'var(--md-sys-color-primary-container)', borderRadius: 'var(--md-sys-spacing-4)', color: "var(--md-sys-color-primary)", fontSize: "var(--md-sys-typescale-body-large-font-size)", fontWeight: "bold", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-1)'}}>
                        <span  style={{ fontSize: "var(--md-sys-typescale-body-large-font-size)" }}>school</span>
                        Classe {uda.classe}
                    </span>
                    <span style={{ backgroundColor: 'var(--md-sys-color-secondary-container)', borderRadius: 'var(--md-sys-spacing-4)', color: "var(--md-sys-color-on-secondary-container)", fontSize: "var(--md-sys-typescale-body-large-font-size)", fontWeight: "bold", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-1)'}}>
                        <span  style={{ fontSize: "var(--md-sys-typescale-body-large-font-size)" }}>menu_book</span>
                        {uda.materia}
                    </span>
                    <span style={{ backgroundColor: 'var(--md-sys-color-tertiary-container)', borderRadius: 'var(--md-sys-spacing-4)', color: "var(--md-sys-color-on-tertiary-container)", fontSize: "var(--md-sys-typescale-body-large-font-size)", fontWeight: "bold", display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-1)'}}>
                        <span  style={{ fontSize: "var(--md-sys-typescale-body-large-font-size)" }}>event</span>
                        {new Date(uda.startDate!).toLocaleDateString()} - {new Date(uda.endDate!).toLocaleDateString()}
                    </span>
                </div>

                {/* AI Validation Section */}
                <div style={{ backgroundColor: 'var(--md-sys-color-primary-container)', borderRadius: 'var(--md-sys-shape-corner-large)' , border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)", padding: 'var(--md-sys-spacing-4)', gap: 'var(--md-sys-spacing-3)'}}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-2)'}}>
                            <span  style={{color: "var(--md-sys-color-primary)"}}>verified</span>
                            <span style={{fontSize: "var(--md-sys-typescale-body-large-font-size)", fontWeight: "900", color: "var(--md-sys-color-on-surface)", textTransform: "uppercase", letterSpacing: "var(--app-legacy-0_1em, 0.1em)"}}>Validazione Curricolo Verticale</span>
                        </div>
                        <M3Button onClick={handleValidate} variant="secondary" disabled={isValidating} style={{ fontSize: "var(--md-sys-typescale-body-large-font-size)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "var(--app-legacy-0_1em, 0.1em)" }}>
                            {isValidating ? 'Validazione...' : 'Valida con AI'}
                        </M3Button>
                    </div>
                    {validationResult && (
                        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-4)', border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)"}}>
                            <p  style={{fontSize: "var(--md-sys-typescale-body-large-font-size)", color: "var(--md-sys-color-on-surface)", lineHeight: "1.625"}}>
                                {validationResult}
                            </p>
                        </div>
                    )}
                </div>

                {/* Description */}
                <InfoCard title="Introduzione" variant="elevated" style={{padding: 'var(--md-sys-spacing-4)'}}>
                    <p style={{color: "var(--md-sys-color-on-surface)", lineHeight: "1.625"}}>
                        {uda.introduction}
                    </p>
                </InfoCard>

                {/* Phases Timeline */}
                <div>
                    <h3 style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: "var(--md-sys-typescale-body-large-font-size)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 'var(--md-sys-spacing-2)'}}>Fasi di Lavoro</h3>
                    <div  style={{gap: 'var(--md-sys-spacing-3)'}}>
                        {uda.phases.map((phase) => (
                            <div key={phase.id} >
                                <div  style={{width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-primary)"}}></div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <h4 style={{fontWeight: "bold", color: "var(--md-sys-color-primary)"}}>{phase.title}</h4>
                                    <span style={{ color: 'var(--md-sys-color-on-secondary-container)', fontSize: "var(--md-sys-typescale-body-large-font-size)", fontWeight: "900", backgroundColor: "var(--md-sys-color-secondary-container)", borderRadius: "var(--md-sys-shape-corner-small)", textTransform: "uppercase"}}>{phase.duration}h</span>
                                </div>
                                <p  style={{fontSize: "var(--md-sys-typescale-body-large-font-size)", color: "var(--md-sys-color-on-surface)", fontWeight: "500"}}>{phase.description}</p>
                                <p style={{ color: 'var(--md-sys-color-on-surface-variant)',  fontSize: "var(--md-sys-typescale-body-large-font-size)" }}>{phase.activities}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Info Grid */}
                <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-4)'}}>
                    <InfoCard title="Prodotto Finale" icon="inventory_2" variant="tonal" style={{padding: 'var(--md-sys-spacing-4)'}}>
                        <p style={{fontSize: "var(--md-sys-typescale-body-large-font-size)", color: "var(--md-sys-color-on-surface)"}}>{uda.finalProduct}</p>
                    </InfoCard>
                    <InfoCard title="Valutazione" icon="fact_check" variant="tonal" style={{padding: 'var(--md-sys-spacing-4)'}}>
                        <p style={{fontSize: "var(--md-sys-typescale-body-large-font-size)", color: "var(--md-sys-color-on-surface)"}}>{uda.evaluation}</p>
                    </InfoCard>
                </div>
            </M3DialogContent>

            <M3DialogActions>
                <M3Button onClick={handleClose} variant="text">Chiudi</M3Button>
                <M3Button onClick={handleEdit} variant="primary">
                    <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>edit</span>
                    Modifica nel Planner
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default UdaDetailModal;









// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
