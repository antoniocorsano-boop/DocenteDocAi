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
                <ul className="list-disc" style={{ paddingLeft: "var(--md-sys-spacing-5)", gap: "var(--md-sys-spacing-1)" }}>
                    {lines.map((item, index) => <li key={index}>{item.replace(/^[•-]\s*/, '').trim()}</li>)}
                </ul>
            );
        }
        return <p>{content}</p>;
    }

    return (
        <div
            className="m3-card surface-container-high elevation-1 rounded-m transition-shadow duration-300 focus-within:elevation-2" style={{ padding: "var(--md-sys-spacing-8)" }}
            tabIndex={0}
            aria-label={title}
            style={{ outline: 'none' }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 className="m3-title-medium text-[var(--md-sys-color-on-surface)]" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                    {icon && <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant" aria-hidden="true">{icon}</span>}
                    {title}
                </h3>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="icon-button m3-interactive"
                        aria-label="Modifica contenuto"
                        tabIndex={0}
                        style={{ background: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--shape-s)' }}
                    >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}} aria-hidden="true">edit</span>
                    </button>
                )}
            </div>

            <div style={{ marginTop: "var(--md-sys-spacing-4)" }}>
                {isEditing ? (
                    <div style={{ gap: "var(--md-sys-spacing-2)" }}>
                        <textarea
                            value={currentContent}
                            onChange={(e) => setCurrentContent(e.target.value)}
                            className="form-textarea m3-interactive" style={{ width: "100%" }}
                            rows={Math.max(5, currentContent.split('\n').length)}
                            autoFocus
                            aria-label="Modifica contenuto"
                            style={{ borderRadius: 'var(--shape-s)', background: 'var(--md-sys-color-surface-container)', color: 'var(--md-sys-color-on-surface)' }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--md-sys-spacing-8)" }}>
                            <button onClick={handleCancel} className="button button-text m3-interactive" aria-label="Annulla modifica">Annulla</button>
                            <button onClick={handleSave} className="button button-filled m3-interactive" aria-label="Salva contenuto">Salva</button>
                        </div>
                    </div>
                ) : (
                    <div className="prose text-[var(--md-sys-color-on-surface)]-variant">
                        {renderContent()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditableContentCard;


