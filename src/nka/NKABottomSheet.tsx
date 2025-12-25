// Bottom sheet modal for NKA map
import * as React from 'react';
import { NKANode } from './types';
import NKANodeCard from './NKANodeCard';
import NKAForceMap from './NKAForceMap';
import { playNkaSound } from './sound';
// import { generateWizardForNode } from './wizardAI';
import { generateWizardForNodeLLM } from './wizardAI.llm';
import { NKAWizardStep } from './wizardAI';
import GameMode from './GameMode';


interface NKABottomSheetProps {
  open: boolean;
  nodes: readonly NKANode[];
  onClose: () => void;
  onNodeSelect: (node: NKANode) => void;
}


const NKABottomSheet: React.FC<NKABottomSheetProps> = ({ open, nodes, onClose, onNodeSelect }) => {
  // Advanced: sound feedback, force map, wizard, game mode
  const [selectedNode, setSelectedNode] = React.useState<NKANode | null>(null);
  const [showWizard, setShowWizard] = React.useState<boolean>(false);
  const [wizardSteps, setWizardSteps] = React.useState<NKAWizardStep[]>([]);
  const [wizardLoading, setWizardLoading] = React.useState<boolean>(false);
  const [showGame, setShowGame] = React.useState<boolean>(false);
  const handleNodeSelect = React.useCallback((node: NKANode) => {
    playNkaSound('node');
    setSelectedNode(node);
    setShowWizard(true);
    // Call onNodeSelect synchronously so callers don't depend on async LLM generation
    onNodeSelect(node);
    setWizardLoading(true);

    // Fire-and-forget: generate wizard steps asynchronously and update state when ready
    (async () => {
      try {
        const steps = await generateWizardForNodeLLM(node, {});
        setWizardSteps(steps);
      } catch (e) {
        // swallow LLM errors; UI will show fallback if needed
      } finally {
        setWizardLoading(false);
      }
    })();
  }, [onNodeSelect]);

  if (!open) return null;
  return (
    <div className="nka-bottom-sheet" role="dialog" aria-modal="true" aria-label="Mappa neurale">
      <div className="nka-map-container">
        <NKAForceMap nodes={nodes} onNodeSelect={handleNodeSelect} />
        {/* List fallback for accessibility and actions */}
        {nodes.map((node: NKANode) => (
          <NKANodeCard key={node.id} node={node} onSelect={() => handleNodeSelect(node)} />
        ))}
      </div>
      <button className="nka-close-btn" onClick={onClose} aria-label="Chiudi mappa neurale">×</button>
      {/* Wizard AI generativo */}
      {showWizard && selectedNode && (
        <div className="nka-wizard-modal">
          <h4>Wizard: {selectedNode.label}</h4>
          {wizardLoading ? (
            <div>Generazione wizard AI…</div>
          ) : (
            <ul>
              {wizardSteps.map((step: NKAWizardStep) => (
                <li key={step.id}>
                  <strong>{step.title}</strong>
                  <div>{step.description}</div>
                  {step.actions.map((a: string) => <button key={a}>{a}</button>)}
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setShowWizard(false)}>Chiudi wizard</button>
        </div>
      )}
      {/* Modalità gioco */}
      {showGame && (
        <GameMode nodes={nodes} />
      )}
      <button onClick={() => setShowGame((g: boolean) => !g)} className="nka-game-btn">{showGame ? 'Nascondi' : 'Mostra'} Modalità Gioco</button>
    </div>
  );
};

export default NKABottomSheet;
