
import React, { useState } from 'react';
import { QuestionType } from '../types';
import { 
    M3Dialog, 
    M3DialogContent, 
    M3DialogActions, 
    M3Button, 
    TabGroup, 
    TextField 
} from './ui';

interface TestGeneratorModalProps {
    onClose: () => void;
    onGenerate: (config: {
        topic: string;
        difficulty: 'easy' | 'medium' | 'hard';
        questionCount: number;
        questionTypes: QuestionType[];
    }) => void;
}

const TestGeneratorModal: React.FC<TestGeneratorModalProps> = ({ onClose, onGenerate }) => {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [questionCount, setQuestionCount] = useState(10);
    const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(['multiple_choice']);

    const toggleQuestionType = (type: QuestionType) => {
        setQuestionTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const handleSubmit = () => {
        if (questionTypes.length === 0) { alert("Seleziona un tipo di domanda."); return; }
        onGenerate({ topic: topic || 'Argomenti KB', difficulty, questionCount, questionTypes });
    };

    return (
        <M3Dialog
            onClose={onClose}
            title="Generatore Verifiche"
            headline="Crea una verifica personalizzata con AI"
        >
            <M3DialogContent className="flex flex-col gap-6 pt-2">
                <TextField
                    id="test-topic-input"
                    label="Argomento Specifico"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Es. Rivoluzione Francese"
                />

                <div>
                    <label className="text-[11px] text-primary font-black uppercase tracking-[0.2em] px-2 mb-3 block">Difficoltà</label>
                    <TabGroup
                        tabs={[{ id: 'easy', label: 'Base' }, { id: 'medium', label: 'Intermedio' }, { id: 'hard', label: 'Avanzato' }]}
                        activeTab={difficulty}
                        onTabChange={(id) => setDifficulty(id as 'easy' | 'medium' | 'hard')}
                        variant="primary"
                        className="w-full"
                    />
                </div>

                <div className="p-5 bg-surface-container rounded-3xl border border-outline-variant">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <label htmlFor="test-qcount-slider" className="m3-label-large font-black uppercase text-primary tracking-widest">Numero Quesiti</label>
                        <span className="text-xl font-black text-primary">{questionCount}</span>
                    </div>
                    <input id="test-qcount-slider" name="test-qcount-slider" type="range" min="5" max="20" value={questionCount} onChange={e => setQuestionCount(parseInt(e.target.value))} className="w-full accent-primary" />
                </div>

                <div className="space-y-3">
                    <label className="text-[11px] text-primary font-black uppercase tracking-[0.2em] px-2 block">Tipi di Domande</label>
                    <div className="flex flex-wrap gap-2">
                        <label className={`cursor-pointer border rounded-full px-4 py-2 transition-all select-none flex items-center gap-2 ${questionTypes.includes('multiple_choice') ? 'bg-secondary-container border-secondary text-on-secondary-container' : 'border-outline hover:bg-surface-container-high'}`}>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={questionTypes.includes('multiple_choice')}
                                onChange={() => toggleQuestionType('multiple_choice')}
                            />
                            {questionTypes.includes('multiple_choice') && <span className="material-symbols-outlined text-sm">check</span>}
                            <span className="text-sm font-medium">Scelta Multipla</span>
                        </label>

                        <label className={`cursor-pointer border rounded-full px-4 py-2 transition-all select-none flex items-center gap-2 ${questionTypes.includes('true_false') ? 'bg-secondary-container border-secondary text-on-secondary-container' : 'border-outline hover:bg-surface-container-high'}`}>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={questionTypes.includes('true_false')}
                                onChange={() => toggleQuestionType('true_false')}
                            />
                            {questionTypes.includes('true_false') && <span className="material-symbols-outlined text-sm">check</span>}
                            <span className="text-sm font-medium">Vero/Falso</span>
                        </label>
                    </div>
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button variant="text" onClick={onClose}>Annulla</M3Button>
                <M3Button 
                    variant="filled" 
                    onClick={handleSubmit}
                    startIcon={<span className="material-symbols-outlined">auto_awesome</span>}
                >
                    Genera
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default TestGeneratorModal;
