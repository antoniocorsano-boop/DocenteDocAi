// LEGACY - MD3 Non-compliant

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

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for colors, spacing, typography, and animations

interface TestGeneratorModalProps {
    onClose: () => void;
    onGenerate: (config: {
        topic: string;
        difficulty: 'easy' | 'medium' | 'hard';
        questionCount: number;
        questionTypes: QuestionType[];
    }) => void;
}

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
            <M3DialogContent >
                <TextField
                    id="test-topic-input"
                    label="Argomento Specifico"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Es. Rivoluzione Francese"
                />

                <div >
                    <label >Difficoltà</label>
                    <TabGroup
                        tabs={[{ id: 'easy', label: 'Base' }, { id: 'medium', label: 'Intermedio' }, { id: 'hard', label: 'Avanzato' }]}
                        activeTab={difficulty}
                        onTabChange={(id) => setDifficulty(id as 'easy' | 'medium' | 'hard')}
                        variant="primary"
                        
                    />
                </div>

                <div >
                    <div >
                        <label htmlFor="test-qcount-slider" >Numero Quesiti</label>
                        <span >{questionCount}</span>
                    </div>
                    <input
                        id="test-qcount-slider"
                        name="test-qcount-slider"
                        type="range"
                        min="5"
                        max="20"
                        value={questionCount}
                        onChange={e => setQuestionCount(parseInt(e.target.value))}
                        
                    />
                </div>

                <div >
                    <label >Tipi di Domande</label>
                    <div >
                        <label className={`test-generator-modal-question-type-chip ${questionTypes.includes('multiple_choice') ? 'selected' : ''}`}>
                            <input
                                type="checkbox"
                                style={{ display: "none" }}
                                checked={questionTypes.includes('multiple_choice')}
                                onChange={() => toggleQuestionType('multiple_choice')}
                            />
                            {questionTypes.includes('multiple_choice') && <span >check</span>}
                            <span >Scelta Multipla</span>
                        </label>

                        <label className={`test-generator-modal-question-type-chip ${questionTypes.includes('true_false') ? 'selected' : ''}`}>
                            <input
                                type="checkbox"
                                style={{ display: "none" }}
                                checked={questionTypes.includes('true_false')}
                                onChange={() => toggleQuestionType('true_false')}
                            />
                            {questionTypes.includes('true_false') && <span >check</span>}
                            <span >Vero/Falso</span>
                        </label>
                    </div>
                </div>
            </M3DialogContent>
            <M3DialogActions >
                <M3Button variant="text" onClick={onClose}>Annulla</M3Button>
                <M3Button 
                    variant="filled" 
                    onClick={handleSubmit}
                    startIcon={<span style={{
  fontFamily: 'Material Symbols Outlined'
}}>auto_awesome</span>}
                >
                    Genera
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default TestGeneratorModal;







