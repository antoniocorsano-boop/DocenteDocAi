
import React from 'react';
import { Studente, KnowledgeBaseEntry, Corpus, NotebookNote, AiSettings } from '../types';
import NotebookView from './NotebookView';

interface StudentWorkspaceProps {
    student: Studente;
    knowledgeBase: KnowledgeBaseEntry[];
    setKnowledgeBase?: React.Dispatch<React.SetStateAction<KnowledgeBaseEntry[]>>;
    corpora?: Corpus[];
    setCorpora?: React.Dispatch<React.SetStateAction<Corpus[]>>;
    notebookNotes?: Record<string, NotebookNote[]>;
    setNotebookNotes?: React.Dispatch<React.SetStateAction<Record<string, NotebookNote[]>>>;
    aiSettings?: AiSettings;
    onLogout: () => void;
}

const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({ 
    student, 
    knowledgeBase, 
    setKnowledgeBase,
    corpora,
    setCorpora,
    notebookNotes,
    setNotebookNotes,
    aiSettings,
    onLogout 
}) => {
    // Filter Knowledge Base to show ONLY relevant documents (e.g., category 'materiale_didattico' or public)
    // For now, we show everything categorized as 'materiale_didattico' or created for the student's class.
    const studentMaterials = knowledgeBase.filter(kb => 
        kb.category === 'materiale_didattico' || 
        (kb.fileName.includes(student.classe))
    );

    return (
        <div className="app-container">
            {/* Student Header */}
            <header className="bg-surface border-b border-outline-variant p-4 flex justify-between items-center shadow-sm z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-lg">
                        {student.nome.charAt(0)}{student.cognome.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-on-surface">Area Studente</h1>
                        <p className="text-xs text-on-surface-variant">Classe {student.classe} • {student.cognome} {student.nome}</p>
                    </div>
                </div>
                <button onClick={onLogout} className="button button-text text-error">
                    <span className="material-symbols-outlined mr-2">logout</span> Esci
                </button>
            </header>

            {/* Main Workspace Content - Removed padding for NotebookView */}
            <main className="flex-grow overflow-hidden flex flex-col bg-surface-container-low">
                <NotebookView 
                    knowledgeBase={studentMaterials} // Only safe materials
                    setKnowledgeBase={setKnowledgeBase || (() => {})} 
                    corpora={corpora || []} 
                    setCorpora={setCorpora || (() => {})}
                    notebookNotes={notebookNotes || {}}
                    setNotebookNotes={setNotebookNotes || (() => {})}
                    aiSettings={aiSettings || { model: 'gemini-2.5-flash' }}
                    onCreateLessonFromNote={() => {}} // Disable teacher feature
                    readOnly={true} // Enable read-only mode
                />
            </main>
        </div>
    );
};

export default StudentWorkspace;
