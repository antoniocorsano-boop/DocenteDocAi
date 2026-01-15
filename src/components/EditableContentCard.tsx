// LEGACY - MD3 Non-compliant
import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/theme';

interface EditableContentCardProps {
  title: string;
  content: string; // The content will be a single string, newlines for lists
  onSave: (newContent: string) => void;
  icon?: string;
}

const EditableContentCard: React.FC<EditableContentCardProps> = ({ title, content, onSave, icon }) => {
  const { layers } = useTheme();
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
                <ul  style={{paddingLeft: layers.ref.spacing['5'], gap: layers.ref.spacing['1']}}>
                    {lines.map((item, index) => <li key={index}>{item.replace(/^[•-]\s*/, '').trim()}</li>)}
                </ul>
            );
        }
        return <p>{content}</p>;
    }

    return (
        <div
            style={{ borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['8'], outline: 'none' }}
            tabIndex={0}
            aria-label={title}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ color:  layers.sys.color.onPrimary }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                    {icon && <span style={{ color:  layers.sys.color.onSurfaceVariant }} aria-hidden="true">{icon}</span>}
                    {title}
                </h3>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        
                        aria-label="Modifica contenuto"
                        tabIndex={0}
                        style={{background: 'layers.sys.color.surfaceContainerHigh', borderRadius: 'var(--shape-s)'}}
                    >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}} aria-hidden="true">edit</span>
                    </button>
                )}
            </div>

            <div style={{marginTop: layers.ref.spacing['4']}}>
                {isEditing ? (
                    <div style={{gap: layers.ref.spacing['2']}}>
                        <textarea
                            value={currentContent}
                            onChange={(e) => setCurrentContent(e.target.value)}
                             style={{ width: "100%", borderRadius: 'var(--shape-s)', background: 'layers.sys.color.surfaceContainer', color: 'layers.sys.color.onSurface' }}
                            rows={Math.max(5, currentContent.split('\n').length)}
                            autoFocus
                            aria-label="Modifica contenuto"
                        />
                        <div style={{display: "flex", justifyContent: "flex-end", gap: layers.ref.spacing['8']}}>
                            <button onClick={handleCancel}  aria-label="Annulla modifica">Annulla</button>
                            <button onClick={handleSave}  aria-label="Salva contenuto">Salva</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ color:  layers.sys.color.onSurfaceVariant }}>
                        {renderContent()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditableContentCard;







