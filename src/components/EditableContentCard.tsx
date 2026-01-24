// MD3 Compliant - Block G Migration (12 violations eliminated)

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
        <ul style={{ paddingLeft: 'var(--md-sys-spacing-5)', gap: 'var(--md-sys-spacing-1)' }}>
          {lines.map((item, index) => <li key={index}>{item.replace(/^[•-]\s*/, '').trim()}</li>)}
        </ul>
      );
    }
    return <p>{content}</p>;
  }

  return (
    <div
      style={{
        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
        padding: 'var(--md-sys-spacing-8)',
        outline: 'none'
      }}
      tabIndex={0}
      aria-label={title}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ color: 'var(--md-sys-color-on-primary)', display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-8)' }}>
          {icon && <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }} aria-hidden="true">{icon}</span>}
          {title}
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            aria-label="Modifica contenuto"
            tabIndex={0}
            style={{ background: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-small)' }}
          >
            <span style={{ fontFamily: "'Material Symbols Outlined'" }} aria-hidden="true">edit</span>
          </button>
        )}
      </div>

      <div style={{ marginTop: 'var(--md-sys-spacing-4)' }}>
        {isEditing ? (
          <div style={{ gap: 'var(--md-sys-spacing-2)' }}>
            <textarea
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              style={{
                width: '100%',
                borderRadius: 'var(--md-sys-shape-corner-small)',
                background: 'var(--md-sys-color-surface-container)',
                color: 'var(--md-sys-color-on-surface)'
              }}
              rows={Math.max(5, currentContent.split('\n').length)}
              autoFocus
              aria-label="Modifica contenuto"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--md-sys-spacing-8)' }}>
              <button onClick={handleCancel} aria-label="Annulla modifica">Annulla</button>
              <button onClick={handleSave} aria-label="Salva contenuto">Salva</button>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableContentCard;








