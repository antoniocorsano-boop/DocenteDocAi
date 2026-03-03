// MD3 Compliant
import React, { useState } from 'react';

interface M3SuggestionItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const M3SuggestionItem: React.FC<M3SuggestionItemProps> = ({ children, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: 'var(--md-sys-color-surface-variant)',
        opacity: isHovered && onClick ? 0.9 : 0.8,
        padding: 'var(--md-sys-spacing-4)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        border: `var(--md-sys-border-width-normal) solid ${isHovered && onClick ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
        transition: `border-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default M3SuggestionItem;

