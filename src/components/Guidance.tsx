
import React, { useState } from 'react';

function useGuidanceDismissed(id: string): [boolean, () => void] {
  const key = `guidance-dismissed-${id}`;
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return window.localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  });

  const dismiss = () => {
    try {
      window.localStorage.setItem(key, 'true');
      setIsDismissed(true);
    } catch (error) {
      console.error(`Failed to dismiss guidance with id "${id}":`, error);
    }
  };

  return [isDismissed, dismiss];
}

interface GuidanceProps {
  id: string;
  icon: string;
  title: string;
  children: React.ReactNode;
  isGloballyEnabled: boolean;
}

const Guidance: React.FC<GuidanceProps> = ({ id, icon, title, children, isGloballyEnabled }) => {
  const [isDismissed, dismiss] = useGuidanceDismissed(id);

  if (isDismissed || !isGloballyEnabled) {
    return null;
  }

  return (
    <div className="guidance-card">
      <div className="guidance-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="guidance-content">
        <h3 className="m3-title-medium">{title}</h3>
        <div className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">{children}</div>
      </div>
      <button onClick={dismiss} className="icon-button" aria-label="Chiudi suggerimento">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
};

export default Guidance;
