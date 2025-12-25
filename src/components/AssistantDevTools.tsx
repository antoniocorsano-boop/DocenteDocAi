import React, { useState } from 'react';
import { SystemSuggestion } from '../types';

interface AssistantDevToolsActions {
  setActiveSuggestion: (suggestion: SystemSuggestion | null) => void;
}

interface Props {
  actions: AssistantDevToolsActions;
}

const sampleSuggestion: SystemSuggestion = {
  id: 'dev-suggestion-1',
  message: "Prova: organizza una verifica di fine modulo per la classe.",
  action: { type: 'navigate', payload: 'improvement-guide' },
  actionLabel: 'Apri guida'
};

const AssistantDevTools: React.FC<Props> = ({ actions }) => {
  const [suggestionOn, setSuggestionOn] = useState(false);
  const [listening, setListening] = useState(false);

  const toggleSuggestion = () => {
    if (!suggestionOn) {
      actions.setActiveSuggestion(sampleSuggestion);
    } else {
      actions.setActiveSuggestion(null);
    }
    setSuggestionOn(!suggestionOn);
  };

  const toggleListening = () => {
    setListening(!listening);
    window.dispatchEvent(new CustomEvent('assistant:recording', { detail: { recording: !listening } }));
  };

  return (
    <div className="assistant-dev-tools" aria-hidden={false}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="button button-outlined" onClick={toggleSuggestion}>
          {suggestionOn ? 'Rimuovi suggerimento' : 'Simula suggerimento'}
        </button>
        <button className={`button ${listening ? 'button-filled' : 'button-outlined'}`} onClick={toggleListening}>
          {listening ? 'Stop Listen (dev)' : 'Start Listen (dev)'}
        </button>
      </div>
    </div>
  );
};

export default AssistantDevTools;
