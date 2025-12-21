import React, { useState, useEffect } from 'react';

interface EditableContentCardProps {
  title: string;
  content: string; // The content will be a single string, newlines for lists
  onSave: (newContent: string) => void;
  icon?: string;
}

const EditableContentCard: React.FC<EditableContentCardProps> = ({ title, content, onSave, icon }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentContent, setCurrentContent] = useState(content);

    useEffect(() => {
        if (!isEditing) {
            setCurrentContent(content);
        }
    }, [content, isEditing]);

    const handleSave = () => {
        onSave(currentContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setCurrentContent(content); // Revert to original content
        setIsEditing(false);
    };

    const renderContent = () => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        if (lines.length > 1 || content.startsWith('• ') || content.startsWith('- ')) {
            return (
                <ul className="list-disc pl-5 space-y-1">
                    {lines.map((item, index) => <li key={index}>{item.replace(/^[•-]\s*/, '').trim()}</li>)}
                </ul>
            );
        }
        return <p>{content}</p>;
    }

    return (
        <div className="editable-card">
            <div className="flex justify-between items-start">
                <h3 className="m3-title-medium flex items-center gap-2">
                    {icon && <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>}
                    {title}
                </h3>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="icon-button" aria-label="Modifica">
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                )}
            </div>

            <div className="mt-2">
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={currentContent}
                            onChange={(e) => setCurrentContent(e.target.value)}
                            className="form-textarea w-full"
                            rows={Math.max(5, currentContent.split('\n').length)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={handleCancel} className="button button-text">Annulla</button>
                            <button onClick={handleSave} className="button button-filled">Salva</button>
                        </div>
                    </div>
                ) : (
                    <div className="prose">
                        {renderContent()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditableContentCard;
