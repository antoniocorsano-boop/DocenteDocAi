
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
            <M3DialogContent className="test-generator-modal-content">
                <TextField
                    id="test-topic-input"
                    label="Argomento Specifico"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Es. Rivoluzione Francese"
                />

                <div className="test-generator-modal-form-section">
                    <label className="test-generator-modal-difficulty-label">Difficoltà</label>
                    <TabGroup
                        tabs={[{ id: 'easy', label: 'Base' }, { id: 'medium', label: 'Intermedio' }, { id: 'hard', label: 'Avanzato' }]}
                        activeTab={difficulty}
                        onTabChange={(id) => setDifficulty(id as 'easy' | 'medium' | 'hard')}
                        variant="primary"
                        className="test-generator-modal-difficulty-tabs"
                    />
                </div>

                <div className="test-generator-modal-question-count-section">
                    <div className="test-generator-modal-question-count-header">
                        <label htmlFor="test-qcount-slider" className="test-generator-modal-question-count-label">Numero Quesiti</label>
                        <span className="test-generator-modal-question-count-value">{questionCount}</span>
                    </div>
                    <input
                        id="test-qcount-slider"
                        name="test-qcount-slider"
                        type="range"
                        min="5"
                        max="20"
                        value={questionCount}
                        onChange={e => setQuestionCount(parseInt(e.target.value))}
                        className="test-generator-modal-question-count-input"
                    />
                </div>

                <div className="test-generator-modal-question-types-section">
                    <label className="test-generator-modal-question-types-label">Tipi di Domande</label>
                    <div className="test-generator-modal-question-types-grid">
                        <label className={`test-generator-modal-question-type-chip ${questionTypes.includes('multiple_choice') ? 'selected' : ''}`}>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={questionTypes.includes('multiple_choice')}
                                onChange={() => toggleQuestionType('multiple_choice')}
                            />
                            {questionTypes.includes('multiple_choice') && <span className="test-generator-modal-question-type-icon material-symbols-outlined">check</span>}
                            <span className="test-generator-modal-question-type-label">Scelta Multipla</span>
                        </label>

                        <label className={`test-generator-modal-question-type-chip ${questionTypes.includes('true_false') ? 'selected' : ''}`}>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={questionTypes.includes('true_false')}
                                onChange={() => toggleQuestionType('true_false')}
                            />
                            {questionTypes.includes('true_false') && <span className="test-generator-modal-question-type-icon material-symbols-outlined">check</span>}
                            <span className="test-generator-modal-question-type-label">Vero/Falso</span>
                        </label>
                    </div>
                </div>
            </M3DialogContent>
            <M3DialogActions className="test-generator-modal-actions">
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


