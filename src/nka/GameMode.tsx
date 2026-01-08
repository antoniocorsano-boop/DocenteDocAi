// Modalità "gioco" per NKA: sblocca neuroni, badge, progressi visivi/sonori
import React, { useState } from 'react';
import { NKANode } from './types';
import { getInitialGameState, unlockNode, GameState } from './gameLogic';
import { playNkaSound } from './sound';


interface GameModeProps {
  nodes?: readonly NKANode[];
}

const GameMode: React.FC<GameModeProps> = ({ nodes = [] as readonly NKANode[] }) => {
  const [state, setState] = useState<GameState>(() => getInitialGameState(nodes));
  const handleUnlock = (nodeId: string) => {
    setState(prev => {
      const next = unlockNode(prev, nodeId);
      if (next.unlocked.length > prev.unlocked.length) playNkaSound('badge');
      return next;
    });
  };
  return (
    <div className="nka-game-mode">
      <h3>Modalità Gioco: Progresso</h3>
      <div className="nka-progress-bar" aria-valuenow={state.progress * 100} aria-valuemin={0} aria-valuemax={100} role="progressbar">
        <div className="nka-progress-fill" style={{ width: `${state.progress * 100}%` }} />
      </div>
      <div className="nka-unlocked-nodes">
        {state.unlocked.map(id => (
          <span key={id} className="nka-badge nka-unlocked">{id}</span>
        ))}
      </div>
      <div className="nka-game-actions">
        {nodes.filter(n => !state.unlocked.includes(n.id)).map(n => (
          <button key={n.id} onClick={() => handleUnlock(n.id)}>
            Sblocca {n.label}
          </button>
        ))}
      </div>
      <div className="nka-badges">
        {state.badges.map(b => (
          <span key={b} className="nka-badge nka-badge-special">{b}</span>
        ))}
      </div>
    </div>
  );
};

export default GameMode;


