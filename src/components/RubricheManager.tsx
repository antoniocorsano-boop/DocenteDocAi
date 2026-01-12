
/* M3Expressive - RubricheManager Component */

import React, { useState } from 'react';
import { Competenza, Rubrica, View } from '../types';
import RubricEditor from './RubricEditor';
import { M3Button, InfoCard, EmptyState, SectionHeader, ActionTile } from './ui';

interface RubricheManagerProps {
    competenze: Competenza[];
    rubriche: Rubrica[];
    onSaveRubrica: (rubrica: Rubrica) => void;
    onDeleteRubrica: (id: string) => void;
    onNavigate: (view: View) => void;
}

const RubricheManager: React.FC<RubricheManagerProps> = ({ competenze, rubriche, onSaveRubrica, onNavigate }) => {
    const [editingRubric, setEditingRubric] = useState<Rubrica | 'new' | null>(null);

    const handleSave = (rubrica: Rubrica) => {
        onSaveRubrica(rubrica);
        setEditingRubric(null);
    };

    return (
        <div className="rubriche-manager-page-layout">
            <div className="rubriche-manager-header">
            <div className="rubriche-manager-title-section">
                <div className="rubriche-manager-title">Rubriche di Valutazione</div>
                <p className="rubriche-manager-subtitle">Crea e gestisci le griglie di competenza.</p>
            </div>
                <M3Button onClick={() => setEditingRubric('new')} variant="filled" className="rubriche-manager-create-button">
                    <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>add</span>
                    Crea Nuova
                </M3Button>
            </div>

            <InfoCard 
                title="Griglie Personalizzate"
                description="Crea rubriche di valutazione riutilizzabili basate sulle tue competenze. Usale durante le interrogazioni o le prove pratiche per una valutazione oggettiva."
                icon="schema"
                variant="secondary"
                className="rubriche-manager-info-card"
            />

            <div className="rubriche-manager-content">
                <div className="rubriche-manager-templates-section">
                {rubriche.length > 0 ? (
                    <div className="rubriche-manager-grid">
                        {rubriche.map(rubrica => (
                            <ActionTile 
                                key={rubrica.id}
                                title={rubrica.titolo}
                                subtitle={`${rubrica.criteri.length} Criteri di competenza`}
                                icon="assignment"
                                variant="surface"
                                onClick={() => setEditingRubric(rubrica)}
                                className="rubriche-manager-rubric-card"
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState 
                        title="Nessuna rubrica"
                        description="Inizia creando il tuo primo modello di valutazione."
                        icon="schema"
                    />
                )}
                </div>
            </div>
            
            <div className="rubriche-manager-references-section">
                <SectionHeader title="Riferimenti" icon="menu_book" variant="tertiary" />
                <ActionTile 
                    title="Descrittori Livelli"
                    subtitle="Visualizza scala A-D"
                    icon="visibility"
                    variant="tertiary"
                    onClick={() => onNavigate('competency-levels')}
                    className="rubriche-manager-reference-card"
                />
            </div>

            {editingRubric && (
                <RubricEditor
                    rubricToEdit={editingRubric === 'new' ? undefined : editingRubric}
                    allCompetenze={competenze}
                    onClose={() => setEditingRubric(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}

export default RubricheManager;


