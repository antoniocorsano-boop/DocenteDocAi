import React, { useState } from 'react';
import { Studente, StudentOrientamentoState, EPortfolioEntry } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField } from './ui';

interface StudentEPortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Studente;
    state: StudentOrientamentoState;
    entries: EPortfolioEntry[];
    onUpdateState: (state: StudentOrientamentoState) => void;
    onAddEntry: (entry: EPortfolioEntry) => void;
}

const StudentEPortfolioModal: React.FC<StudentEPortfolioModalProps> = ({
    isOpen,
    onClose,
    student,
    state,
    entries,
    onUpdateState,
    onAddEntry
}) => {
    const [newEntry, setNewEntry] = useState<Partial<EPortfolioEntry>>({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: 'capolavoro',
        tags: []
    });

    const handleAddEntry = () => {
        if (!newEntry.title) return;
        onAddEntry({
            ...newEntry,
            id: `ep-entry-${Date.now()}`,
            studentId: student.id
        } as EPortfolioEntry);
        setNewEntry({ title: '', description: '', date: new Date().toISOString().split('T')[0], category: 'capolavoro', tags: [] });
    };

    return (
        <M3Dialog isOpen={isOpen} onClose={onClose} title={`E-Portfolio: ${student.nome} ${student.cognome}`} maxWidth="md">
            <M3DialogContent className="space-y-8 pt-4 px-4 md:px-6">
                {/* Status Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="m3-title-medium">Capolavoro</h4>
                            <p className="m3-body-small text-on-surface-variant">Caricato nell&apos;E-Portfolio</p>
                        </div>
                        <input 
                            type="checkbox"
                            checked={state.hasCapolavoro}
                            onChange={(e) => onUpdateState({ ...state, hasCapolavoro: e.target.checked })}
                            className="w-5 h-5 accent-primary"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="m3-title-medium">Autovalutazione</h4>
                            <p className="m3-body-small text-on-surface-variant">Riflessione critica completata</p>
                        </div>
                        <input 
                            type="checkbox"
                            checked={state.hasAutovalutazione}
                            onChange={(e) => onUpdateState({ ...state, hasAutovalutazione: e.target.checked })}
                            className="w-5 h-5 accent-primary"
                        />
                    </div>
                </div>

                {/* Add Entry Section */}
                <div className="space-y-4">
                    <h4 className="m3-title-large font-black">Aggiungi Documento/Riflessione</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <TextField
                                label="Titolo"
                                value={newEntry.title}
                                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2 items-end">
                            <select 
                                className="flex-grow bg-surface-container-high rounded-2xl px-4 py-3 m3-body-medium border-none focus:ring-2 focus:ring-primary min-w-0"
                                value={newEntry.category}
                                onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as EPortfolioEntry['category'] })}
                            >
                                <option value="capolavoro">Capolavoro</option>
                                <option value="riflessione">Riflessione</option>
                                <option value="certificazione">Certificazione</option>
                                <option value="altro">Altro</option>
                            </select>
                            <M3Button onClick={handleAddEntry} variant="tonal" disabled={!newEntry.title}>Aggiungi</M3Button>
                        </div>
                    </div>
                </div>

                {/* Entries List */}
                <div className="space-y-4">
                    <h4 className="m3-title-large font-black">Documenti Caricati</h4>
                    <div className="space-y-2">
                        {entries.length === 0 ? (
                            <p className="text-center py-8 text-on-surface-variant italic">Nessun documento caricato</p>
                        ) : (
                            entries.map(entry => (
                                <div key={entry.id} className="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-outline-variant/10">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-sm">
                                                {entry.category === 'capolavoro' ? 'auto_awesome' : 'description'}
                                            </span>
                                            <span className="font-bold">{entry.title}</span>
                                        </div>
                                        <p className="m3-body-small text-on-surface-variant">{entry.date}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-wider">
                                        {entry.category}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="filled">Chiudi</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default StudentEPortfolioModal;

