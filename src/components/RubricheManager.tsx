
import React, { useState } from 'react';
import { Competenza, Rubrica, View } from '../types';
import RubricEditor from './RubricEditor';
import { ActionTile, InfoCard, EmptyState } from './M3Components';

interface RubricheManagerProps {
    competenze: Competenza[];
    rubriche: Rubrica[];
    onSaveRubrica: (rubrica: Rubrica) => void;
    onDeleteRubrica: (rubricaId: string) => void;
    onNavigate: (view: View) => void;
}

const RubricheManager: React.FC<RubricheManagerProps> = ({ competenze, rubriche, onSaveRubrica, onDeleteRubrica, onNavigate }) => {
    const [editingRubric, setEditingRubric] = useState<Rubrica | 'new' | null>(null);

    const handleSave = (rubrica: Rubrica) => {
        onSaveRubrica(rubrica);
        setEditingRubric(null);
    };

    return (
        <div className="page-layout pb-24">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="page-title">Rubriche di Valutazione</h1>
                <button onClick={() => setEditingRubric('new')} className="button button-filled">
                    <span className="material-symbols-outlined mr-2">add</span>
                    Crea Nuova
                </button>
            </div>

            <InfoCard 
                title="Griglie Personalizzate"
                description="Crea rubriche di valutazione riutilizzabili basate sulle tue competenze. Usale durante le interrogazioni o le prove pratiche per una valutazione oggettiva."
                icon="schema"
                variant="secondary"
            />

            <div className="mt-6">
                <h2 className="m3-title-large mb-4">I tuoi Modelli</h2>
                {rubriche.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            
            <div className="mt-8">
                <h2 className="m3-title-large mb-4">Riferimenti</h2>
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
