
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
        <div className="page-layout pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                <div className="space-y-1">
                    <h1 className="m3-headline-medium font-black tracking-tight">Rubriche di Valutazione</h1>
                    <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant">Crea e gestisci le griglie di competenza.</p>
                </div>
                <M3Button onClick={() => setEditingRubric('new')} variant="filled" className="shadow-[var(--md-sys-elevation-level2)] font-black text-xs uppercase tracking-widest">
                    <span className="material-symbols-outlined mr-2">add</span>
                    Crea Nuova
                </M3Button>
            </div>

            <InfoCard 
                title="Griglie Personalizzate"
                description="Crea rubriche di valutazione riutilizzabili basate sulle tue competenze. Usale durante le interrogazioni o le prove pratiche per una valutazione oggettiva."
                icon="schema"
                variant="secondary"
                className="bg-secondary-container/10 border-secondary/20 mb-8"
            />

            <div className="space-y-6">
                <SectionHeader title="I tuoi Modelli" icon="assignment" variant="primary" />
                {rubriche.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {rubriche.map(rubrica => (
                            <ActionTile 
                                key={rubrica.id}
                                title={rubrica.titolo}
                                subtitle={`${rubrica.criteri.length} Criteri di competenza`}
                                icon="assignment"
                                variant="surface"
                                onClick={() => setEditingRubric(rubrica)}
                                className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl border border-[var(--md-sys-color-outline-variant)]/20 hover:bg-[var(--md-sys-color-surface-container-high)]/50 transition-all"
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
            
            <div className="mt-12 space-y-6">
                <SectionHeader title="Riferimenti" icon="menu_book" variant="tertiary" />
                <ActionTile 
                    title="Descrittori Livelli"
                    subtitle="Visualizza scala A-D"
                    icon="visibility"
                    variant="tertiary"
                    onClick={() => onNavigate('competency-levels')}
                    className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl border border-[var(--md-sys-color-outline-variant)]/20 hover:bg-[var(--md-sys-color-surface-container-high)]/50 transition-all"
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
