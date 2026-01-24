// LEGACY - MD3 Non-compliant

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
        <div >
            <div >
            <div >
                <div >Rubriche di Valutazione</div>
                <p >Crea e gestisci le griglie di competenza.</p>
            </div>
                <M3Button onClick={() => setEditingRubric('new')} variant="filled" >
                    <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>add</span>
                    Crea Nuova
                </M3Button>
            </div>

            <InfoCard 
                title="Griglie Personalizzate"
                description="Crea rubriche di valutazione riutilizzabili basate sulle tue competenze. Usale durante le interrogazioni o le prove pratiche per una valutazione oggettiva."
                icon="schema"
                variant="secondary"
                
            />

            <div >
                <div >
                {rubriche.length > 0 ? (
                    <div >
                        {rubriche.map(rubrica => (
                            <ActionTile 
                                key={rubrica.id}
                                title={rubrica.titolo}
                                subtitle={`${rubrica.criteri.length} Criteri di competenza`}
                                icon="assignment"
                                variant="surface"
                                onClick={() => setEditingRubric(rubrica)}
                                
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
            
            <div >
                <SectionHeader title="Riferimenti" icon="menu_book" variant="tertiary" />
                <ActionTile 
                    title="Descrittori Livelli"
                    subtitle="Visualizza scala A-D"
                    icon="visibility"
                    variant="tertiary"
                    onClick={() => onNavigate('competency-levels')}
                    
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








